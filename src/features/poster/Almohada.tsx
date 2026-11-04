import React, { useEffect, useId, useRef } from 'react';
import styled from 'styled-components';

/* Efecto almohada: donde se aprieta, la sección se hunde como una tela rellena y rebota con un resorte al soltar.
   Funciona en cualquier navegador: el contenido se deforma con un filtro SVG (feDisplacementMap) y el pozo se
   sombrea con una capa de degradados, con la luz de arriba a la izquierda como en el resto del sitio.
   El filtro se aplica solo mientras se mueve: en reposo la sección se pinta normal. */

// Mapa de desplazamiento del tamaño del envoltorio, con el pozo donde se apretó: cada punto toma el contenido de
// más afuera, así lo de alrededor se estira hacia el centro. R es el corrimiento en x y G en y, con 128 como cero.
// Cubre todo el filtro: no hace falta ubicar el feImage, que cada navegador mide distinto.
const pitMap = (w: number, h: number, px: number, py: number, R: number) => {
  const nx = 160;
  const ny = Math.max(1, Math.min(480, Math.round((nx * h) / w)));
  const c = document.createElement('canvas');
  c.width = nx;
  c.height = ny;
  const ctx = c.getContext('2d')!;
  const img = ctx.createImageData(nx, ny);
  const s = 0.5;
  const peak = (s / Math.SQRT2) * Math.exp(-0.5);
  for (let y = 0; y < ny; y++)
    for (let x = 0; x < nx; x++) {
      const qx = (((x + 0.5) / nx) * w - px) / R;
      const qy = (((y + 0.5) / ny) * h - py) / R;
      const g = Math.exp(-(qx * qx + qy * qy) / (s * s)) / peak;
      const i = (y * nx + x) * 4;
      img.data[i] = 128 + 127 * qx * g;
      img.data[i + 1] = 128 + 127 * qy * g;
      img.data[i + 3] = 255;
    }
  ctx.putImageData(img, 0, 0);
  return c.toDataURL();
};

const Almohada: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const id = `almohada${useId().replace(/:/g, '')}`;
  const wrapRef = useRef<HTMLDivElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<SVGFEImageElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const wrap = wrapRef.current!;
    const shade = shadeRef.current!;
    const section = wrap.parentElement!;
    const fe = imgRef.current!;
    const disp = dispRef.current!;

    // Resorte: d va hacia `target` (1 apretado, 0 suelto). Al soltar pasa de largo y se infla un poco antes de quedar.
    let d = 0, vel = 0, target = 0, last = 0, raf = 0, R = 0;
    const press = { x: 0, y: 0, sx: 0, sy: 0, id: -1 };

    const frame = (now: number) => {
      const dt = Math.min(0.033, last ? (now - last) / 1000 : 0.016);
      last = now;
      vel += (150 * (target - d) - (target ? 15 : 9) * vel) * dt;
      d += vel * dt;
      const settled = Math.abs(d - target) < 0.002 && Math.abs(vel) < 0.002;
      if (settled) d = target;

      // Corrimiento máximo: la mitad de la escala. Un 4% del radio: la tela se estira sin torcer el texto.
      disp.setAttribute('scale', String(d * R * 0.08));
      wrap.style.filter = d ? `url(#${id})` : '';
      shade.style.opacity = String(Math.max(0, Math.min(1, d)));

      if (settled) {
        raf = last = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    const run = () => raf || (raf = requestAnimationFrame(frame));

    const down = (e: PointerEvent) => {
      // Un solo dedo, botón principal, y no sobre algo que se puede clickear.
      if (e.button !== 0 || target || (e.target as Element).closest('a, button, input, textarea, select, label')) return;
      const s = section.getBoundingClientRect();
      const w = wrap.getBoundingClientRect();
      R = Math.min(Math.max(s.width, s.height) * 0.32, 420);
      press.id = e.pointerId;
      press.sx = e.clientX;
      press.sy = e.clientY;
      fe.setAttribute('href', pitMap(w.width, w.height, e.clientX - w.left, e.clientY - w.top, R));
      shade.style.setProperty('--x', `${e.clientX - s.left}px`);
      shade.style.setProperty('--y', `${e.clientY - s.top}px`);
      shade.style.setProperty('--r', `${R}px`);
      target = 1;
      run();
    };
    const up = (e?: Event) => {
      if (!target || (e instanceof PointerEvent && e.pointerId !== press.id)) return;
      target = 0;
      run();
    };
    // Si el dedo arrastra, es scroll: se suelta.
    const move = (e: PointerEvent) =>
      target && e.pointerId === press.id && Math.hypot(e.clientX - press.sx, e.clientY - press.sy) > 8 && up();

    section.addEventListener('pointerdown', down, { passive: true });
    section.addEventListener('pointermove', move, { passive: true });
    for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) section.addEventListener(ev, up, { passive: true });
    window.addEventListener('scroll', up, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      section.removeEventListener('pointerdown', down);
      section.removeEventListener('pointermove', move);
      for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) section.removeEventListener(ev, up);
      window.removeEventListener('scroll', up);
    };
  }, [id]);

  return (
    <>
      <Defs aria-hidden="true" focusable="false">
        {/* sRGB: el mapa se lee tal cual, sin pasarlo a lineal. */}
        <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feImage ref={imgRef} preserveAspectRatio="none" result="pit" />
          <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="pit" scale="0" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </Defs>
      <Wrap ref={wrapRef}>{children}</Wrap>
      <Shade ref={shadeRef} />
    </>
  );
};

const Defs = styled.svg`
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
`;

const Wrap = styled.div`
  position: relative;
  touch-action: pan-y;
`;

/* El pozo con la luz de arriba a la izquierda: la ladera de arriba queda en sombra y la de abajo a la derecha, que mira
   a la luz, brilla. Alrededor, la tela tirante hace un anillo apenas más claro. */
const Shade = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  border-radius: inherit;
  opacity: 0;
  background:
    radial-gradient(
      circle at calc(var(--x) - var(--r) * 0.1) calc(var(--y) - var(--r) * 0.12),
      rgba(0, 0, 0, 0.42) 0,
      rgba(0, 0, 0, 0.3) calc(var(--r) * 0.16),
      rgba(0, 0, 0, 0.12) calc(var(--r) * 0.36),
      rgba(0, 0, 0, 0.03) calc(var(--r) * 0.52),
      transparent calc(var(--r) * 0.62)
    ),
    radial-gradient(
      circle at calc(var(--x) + var(--r) * 0.16) calc(var(--y) + var(--r) * 0.18),
      transparent calc(var(--r) * 0.3),
      rgba(255, 253, 235, 0.32) calc(var(--r) * 0.42),
      rgba(255, 253, 235, 0.08) calc(var(--r) * 0.52),
      transparent calc(var(--r) * 0.62)
    ),
    radial-gradient(
      circle at calc(var(--x) - var(--r) * 0.06) calc(var(--y) - var(--r) * 0.06),
      transparent calc(var(--r) * 0.64),
      rgba(0, 0, 0, 0.04) calc(var(--r) * 0.74),
      transparent calc(var(--r) * 0.9)
    );
`;

export default Almohada;
