import React, { useEffect, useId, useRef } from 'react';
import styled from 'styled-components';

/* Efecto almohada: donde se apoya el dedo, la sección se hunde como una tela rellena, y el pozo sigue al dedo mientras
   se scrollea; al levantarlo rebota con un resorte.
   Funciona en cualquier navegador: el contenido se deforma con un filtro SVG (feDisplacementMap) y el pozo se
   sombrea dentro del mismo filtro, con la luz de arriba a la izquierda como en el resto del sitio.
   El filtro se aplica solo mientras se mueve: en reposo la sección se pinta normal. */

// Mapa de desplazamiento del tamaño del envoltorio, con el pozo donde se apretó: cada punto toma el contenido de
// más afuera, así lo de alrededor se estira hacia el centro. R es el corrimiento en x y G en y, con 128 como cero.
// Cubre todo el filtro: no hace falta ubicar el feImage, que cada navegador mide distinto.
// El sombreado sale de la misma gaussiana, así la sombra cae justo donde se hunde la tela: es la pendiente del pozo
// contra la luz de arriba a la izquierda. La ladera de arriba a la izquierda mira para el otro lado y se oscurece; la
// de abajo a la derecha mira a la luz y se aclara. Negro o crema, con la intensidad en el alpha. Va en una capa de la
// sección y no en el filtro: con un pin activo, el filtro deforma solo el bloque fijado.
const pitMap = (w: number, h: number, px: number, py: number, R: number) => {
  const nx = 160;
  const ny = Math.max(1, Math.min(480, Math.round((nx * h) / w)));
  const canvas = () => {
    const c = document.createElement('canvas');
    c.width = nx;
    c.height = ny;
    const ctx = c.getContext('2d')!;
    return { c, ctx, img: ctx.createImageData(nx, ny) };
  };
  const map = canvas();
  const s = 0.5;
  const peak = (s / Math.SQRT2) * Math.exp(-0.5);
  for (let y = 0; y < ny; y++)
    for (let x = 0; x < nx; x++) {
      const qx = (((x + 0.5) / nx) * w - px) / R;
      const qy = (((y + 0.5) / ny) * h - py) / R;
      const g = Math.exp(-(qx * qx + qy * qy) / (s * s)) / peak;
      const i = (y * nx + x) * 4;
      map.img.data[i] = 128 + 127 * qx * g;
      map.img.data[i + 1] = 128 + 127 * qy * g;
      map.img.data[i + 3] = 255;
    }
  map.ctx.putImageData(map.img, 0, 0);
  return map.c.toDataURL();
};

// Sombreado: un parche de 2,4R de lado centrado en el pozo, que la capa de la sección mueve con el dedo.
const PATCH = 1.2;
const shadeMap = (light: number) => {
  const n = 96;
  const c = document.createElement('canvas');
  c.width = c.height = n;
  const ctx = c.getContext('2d')!;
  const img = ctx.createImageData(n, n);
  const s = 0.5;
  const peak = (s / Math.SQRT2) * Math.exp(-0.5);
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const qx = ((x + 0.5) / n - 0.5) * 2 * PATCH;
      const qy = ((y + 0.5) / n - 0.5) * 2 * PATCH;
      const e = Math.exp(-(qx * qx + qy * qy) / (s * s));
      // Pendiente hacia la luz (±1 en la ladera más empinada) menos un poco de oscuro en el fondo del pozo.
      const v = (((qx + qy) / Math.SQRT2) * (e / peak)) / 1.2 - 0.3 * e;
      const lit = v > 0;
      const i = (y * n + x) * 4;
      img.data[i] = lit ? 255 : 0;
      img.data[i + 1] = lit ? 250 : 0;
      img.data[i + 2] = lit ? 228 : 0;
      img.data[i + 3] = 255 * Math.min(1, lit ? v * light : -v * 0.4);
    }
  ctx.putImageData(img, 0, 0);
  return `url(${c.toDataURL()})`;
};

// Sobre un fondo oscuro la sombra no se ve: la luz de la ladera queda más tenue para no leerse como un halo.
const lightFor = (el: Element) => {
  for (let n: Element | null = el; n; n = n!.parentElement) {
    const m = getComputedStyle(n).backgroundColor.match(/[\d.]+/g);
    if (!m || (m.length > 3 && +m[3] === 0)) continue;
    const [r, g, b] = m.map(Number);
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.35 ? 0.55 : 0.2;
  }
  return 0.2;
};

// El dedo (o el mouse apretado) es uno solo para toda la página: cada sección mira si está debajo.
const finger = { x: 0, y: 0, down: false };
const listeners = new Set<() => void>();
const notify = () => {
  // Apoyar el dedo quieto es lo que hunde la tela: sin esto el celular lo toma como long-press y selecciona el texto.
  const st = document.documentElement.style;
  const v = finger.down ? 'none' : '';
  st.userSelect = st.webkitUserSelect = v;
  st.setProperty('-webkit-touch-callout', v);
  listeners.forEach(fn => fn());
};
// Los campos de un formulario no se hunden: ahí apretar es escribir o elegir.
const isField = (t: EventTarget | null) => t instanceof Element && !!t.closest('input, textarea, select');
let wired = false;
const wire = () => {
  if (wired) return;
  wired = true;
  const opts = { passive: true, capture: true } as const;
  // En el celular, el navegador cancela los pointer events cuando arranca el scroll; los touch events siguen llegando.
  window.addEventListener('touchstart', e => {
    if (isField(e.target)) return;
    const t = e.touches[0];
    Object.assign(finger, { x: t.clientX, y: t.clientY, down: e.touches.length === 1 });
    notify();
  }, opts);
  window.addEventListener('touchmove', e => {
    const t = e.touches[0];
    if (!finger.down || !t) return;
    finger.x = t.clientX;
    finger.y = t.clientY;
    notify();
  }, opts);
  const lift = (e: TouchEvent) => {
    if (e.touches.length) return;
    finger.down = false;
    notify();
  };
  window.addEventListener('touchend', lift, opts);
  window.addEventListener('touchcancel', lift, opts);
  // Mouse: apretado con el botón principal, sin contar links ni botones, que se clickean.
  window.addEventListener('pointerdown', e => {
    if (e.pointerType === 'touch' || e.button !== 0 || isField(e.target) || (e.target as Element).closest?.('a, button, label')) return;
    Object.assign(finger, { x: e.clientX, y: e.clientY, down: true });
    notify();
  }, opts);
  window.addEventListener('pointermove', e => {
    if (e.pointerType === 'touch' || !finger.down) return;
    finger.x = e.clientX;
    finger.y = e.clientY;
    notify();
  }, opts);
  window.addEventListener('pointerup', e => {
    if (e.pointerType === 'touch' || !finger.down) return;
    finger.down = false;
    notify();
  }, opts);
  // Con el dedo quieto en la pantalla, el scroll mueve la página debajo: el pozo queda donde está el dedo.
  window.addEventListener('scroll', () => finger.down && notify(), opts);
};

const Almohada: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const id = `almohada${useId().replace(/:/g, '')}`;
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<SVGFEImageElement>(null);
  const offRef = useRef<SVGFEOffsetElement>(null);
  const shadeRef = useRef<HTMLDivElement>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement>(null);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    wire();
    const wrap = wrapRef.current!;
    const section = wrap.parentElement!;
    const fe = imgRef.current!;
    const off = offRef.current!;
    const patch = shadeRef.current!.firstElementChild as HTMLElement;
    const disp = dispRef.current!;

    // Resorte: d va hacia `target` (1 apretado, 0 suelto). Al soltar pasa de largo y se infla un poco antes de quedar.
    let d = 0, vel = 0, target = 0, last = 0, raf = 0, R = 0;
    // Lo que se deforma: el envoltorio, o el bloque fijado por un pin de ScrollTrigger si hay uno activo. Un filtro en
    // un ancestro de un elemento `position: fixed` lo vuelve relativo a ese ancestro y lo haría saltar de lugar.
    let skin: HTMLElement = wrap;
    // Dónde quedó el pozo en el mapa, relativo a `skin`, y dónde está ahora el dedo: el mapa se corre con feOffset
    // en vez de volver a dibujarse en cada cuadro de scroll.
    const pit = { x: 0, y: 0 };

    // Lleva el pozo y su sombra al lugar del dedo.
    const follow = () => {
      const k = skin.getBoundingClientRect();
      off.setAttribute('dx', String(finger.x - k.left - pit.x));
      off.setAttribute('dy', String(finger.y - k.top - pit.y));
      const s = section.getBoundingClientRect();
      patch.style.transform = `translate(${finger.x - s.left - PATCH * R}px, ${finger.y - s.top - PATCH * R}px)`;
    };

    const frame = (now: number) => {
      const dt = Math.min(0.033, last ? (now - last) / 1000 : 0.016);
      last = now;
      vel += (150 * (target - d) - (target ? 15 : 9) * vel) * dt;
      d += vel * dt;
      const settled = Math.abs(d - target) < 0.002 && Math.abs(vel) < 0.002;
      if (settled) d = target;

      // Corrimiento máximo: la mitad de la escala. Un 4% del radio: la tela se estira sin torcer el texto.
      disp.setAttribute('scale', String(d * R * 0.08));
      skin.style.filter = d ? `url(#${id})` : '';
      patch.style.opacity = String(Math.max(0, Math.min(1, d)));

      if (settled) {
        raf = last = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    const run = () => raf || (raf = requestAnimationFrame(frame));

    const press = () => {
      const s = section.getBoundingClientRect();
      skin.style.filter = '';
      skin =
        Array.from(wrap.querySelectorAll<HTMLElement>('.pin-spacer > *')).find(el => getComputedStyle(el).position === 'fixed') ?? wrap;
      const k = skin.getBoundingClientRect();
      R = Math.min(Math.max(s.width, Math.min(s.height, innerHeight)) * 0.32, 420);
      pit.x = finger.x - k.left;
      pit.y = finger.y - k.top;
      fe.setAttribute('href', pitMap(k.width, k.height, pit.x, pit.y, R));
      patch.style.width = patch.style.height = `${2 * PATCH * R}px`;
      patch.style.backgroundImage = shadeMap(lightFor(section));
      follow();
      target = 1;
      run();
    };

    const update = () => {
      const s = section.getBoundingClientRect();
      const over = finger.down && finger.x >= s.left && finger.x <= s.right && finger.y >= s.top && finger.y <= s.bottom;
      if (over && !target) press();
      else if (over) follow();
      else if (target) {
        // El dedo salió de esta sección (o se levantó): rebota, con el pozo quieto donde estaba.
        target = 0;
        run();
      }
    };
    listeners.add(update);
    return () => {
      listeners.delete(update);
      cancelAnimationFrame(raf);
      skin.style.filter = '';
    };
  }, [id]);

  return (
    <>
      <Defs aria-hidden="true" focusable="false">
        {/* sRGB: el mapa se lee tal cual, sin pasarlo a lineal. Lo que el corrimiento deja afuera del mapa se rellena
            con gris 128, que no desplaza. */}
        <filter id={id} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feFlood floodColor="rgb(128,128,128)" result="flat" />
          <feImage ref={imgRef} preserveAspectRatio="none" result="map" />
          <feOffset ref={offRef} in="map" dx="0" dy="0" result="moved" />
          <feMerge result="pit">
            <feMergeNode in="flat" />
            <feMergeNode in="moved" />
          </feMerge>
          <feDisplacementMap ref={dispRef} in="SourceGraphic" in2="pit" scale="0" xChannelSelector="R" yChannelSelector="G" />
          {/* El desplazamiento toma el píxel más cercano y deja los bordes del texto dentados: medio píxel de desenfoque
              los alisa. */}
          <feGaussianBlur stdDeviation="0.3" />
        </filter>
      </Defs>
      <Wrap ref={wrapRef}>{children}</Wrap>
      <Shade ref={shadeRef} aria-hidden="true">
        <div />
      </Shade>
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

/* Cubre la sección y recorta el parche en su borde, para que la sombra no pase a la sección vecina. */
const Shade = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  overflow: hidden;
  pointer-events: none;
  border-radius: inherit;

  > div {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
    background-size: 100% 100%;
    will-change: transform;
  }
`;

export default Almohada;
