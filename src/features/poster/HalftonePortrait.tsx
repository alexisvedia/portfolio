import React, { useId, useLayoutEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { INK } from './content';
import { PORTRAIT_DOTS, PORTRAIT_SIZE } from './portraitDots';

gsap.registerPlugin(ScrollTrigger);

const { w: W, h: H } = PORTRAIT_SIZE;
const CX = W / 2;
const CY = H * 0.42;
const RING = W * 0.4;

type Dot = { x: number; y: number; r: number; tx: number; ty: number };

/** Retrato de Alexis en semitono: con el scroll los puntos se abren en el anillo de las letras; con el mouse, una lupa roja. */
const HalftonePortrait: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const uid = useId().replace(/:/g, '');

  const dots = useMemo<Dot[]>(() => {
    const out: Dot[] = [];
    for (let i = 0; i < PORTRAIT_DOTS.length; i += 3) {
      const [x, y, r] = [PORTRAIT_DOTS[i], PORTRAIT_DOTS[i + 1], PORTRAIT_DOTS[i + 2]];
      // Cada punto va al anillo en su mismo ángulo: la cara se abre desde el centro, sin cruces.
      const a = Math.atan2(y - CY, x - CX);
      const band = RING + ((Math.hypot(x - CX, y - CY) % 60) - 30);
      out.push({ x, y, r, tx: CX + Math.cos(a) * band - x, ty: CY + Math.sin(a) * band - y });
    }
    return out;
  }, []);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    // El ref del hero se asigna después de este efecto (los hijos van primero): se busca en el DOM.
    const hero = svg?.closest<HTMLElement>('[data-hero]');
    if (!svg || !hero) return;
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const circles = svg.querySelectorAll<SVGCircleElement>('[data-dots] circle');
      gsap.to(circles, {
        x: i => dots[i].tx,
        y: i => dots[i].ty,
        ease: 'power2.inOut',
        stagger: { amount: 0.4, from: 'center' },
        // Arranca con la página arriba y termina cuando el centro del retrato toca el borde: se ve entero.
        scrollTrigger: { trigger: svg, start: 0, end: 'center top', scrub: 0.6 },
      });
    });

    mm.add('(prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
      const lens = svg.querySelector<SVGCircleElement>('[data-lens]');
      const hole = svg.querySelector<SVGCircleElement>('[data-hole]');
      const zoom = svg.querySelector<SVGUseElement>('[data-zoom]');
      const masked = svg.querySelector<SVGGElement>('[data-masked]');
      if (!lens || !hole || !zoom || !masked) return;
      const st = { x: CX, y: CY, r: 0 };
      // Con la lupa cerrada no hay clon ni máscara: si no, cada frame de scroll reconstruye el <use> de 1490 puntos.
      let open = false;
      const apply = () => {
        if (open !== st.r > 0.5) {
          open = st.r > 0.5;
          if (open) {
            zoom.setAttribute('href', `#${uid}-dots`);
            masked.setAttribute('mask', `url(#${uid}-hole)`);
          } else {
            zoom.removeAttribute('href');
            masked.removeAttribute('mask');
          }
        }
        for (const c of [lens, hole]) {
          c.setAttribute('cx', `${st.x}`);
          c.setAttribute('cy', `${st.y}`);
          c.setAttribute('r', `${st.r}`);
        }
        zoom.setAttribute('transform', `translate(${st.x} ${st.y}) scale(1.6) translate(${-st.x} ${-st.y})`);
      };
      const move = (e: PointerEvent) => {
        const m = svg.getScreenCTM();
        if (!m) return;
        const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(m.inverse());
        const inside = p.x > -40 && p.x < W + 40 && p.y > -40 && p.y < H + 40;
        gsap.to(st, { x: p.x, y: p.y, r: inside ? 95 : 0, duration: 0.5, ease: 'power3.out', overwrite: true, onUpdate: apply });
      };
      // Si el puntero sale hacia la nav o fuera de la ventana, la lupa se cierra.
      const close = () => gsap.to(st, { r: 0, duration: 0.3, overwrite: true, onUpdate: apply });
      // La rueda no dispara pointermove: con la lupa abierta, cada frame de scroll reconstruiría el clon.
      const onScroll = () => {
        if (st.r > 0) close();
      };
      hero.addEventListener('pointermove', move);
      hero.addEventListener('pointerleave', close);
      window.addEventListener('scroll', onScroll, { passive: true });
      return () => {
        hero.removeEventListener('pointermove', move);
        hero.removeEventListener('pointerleave', close);
        window.removeEventListener('scroll', onScroll);
        gsap.killTweensOf(st);
        st.r = 0;
        apply();
      };
    });

    return () => mm.revert();
  }, [dots, uid]);

  return (
    <Svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} aria-hidden data-hero-portrait="">
      <defs>
        <clipPath id={`${uid}-lens`}>
          <circle data-lens="" cx={CX} cy={CY} r={0} />
        </clipPath>
        {/* Bajo la lupa la capa crema se apaga: solo se ven los puntos rojos ampliados. */}
        <mask id={`${uid}-hole`} maskUnits="userSpaceOnUse" x={-W} y={-H} width={W * 3} height={H * 3}>
          <rect x={-W} y={-H} width={W * 3} height={H * 3} fill="#fff" />
          <circle data-hole="" cx={CX} cy={CY} r={0} fill="#000" />
        </mask>
      </defs>
      <g fill={INK.cream} data-masked="">
        <g id={`${uid}-dots`} data-dots="">
          {dots.map((d, i) => (
            <circle key={i} cx={d.x} cy={d.y} r={d.r} />
          ))}
        </g>
      </g>
      <g clipPath={`url(#${uid}-lens)`}>
        <use data-zoom="" fill={INK.red} />
      </g>
    </Svg>
  );
};

export default HalftonePortrait;

const Svg = styled.svg`
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
`;
