import React, { useLayoutEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { INK } from './content';
import { PIN } from './WorkGallery';
import { rng, pts, type Pt } from './cut';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin);

/* Hilo que cose una sección con la siguiente: baja, hace un rulo, una puntada en zigzag, otro rulo y remata en un anillo. */
const PATH =
  'M150 0C150 80 118 122 200 140C300 162 334 58 272 58C206 58 226 172 360 180L400 146L440 204L480 146L520 204L560 146C646 112 712 262 624 254C556 248 598 138 702 150C806 162 850 222 850 300';

/* Variante que continúa el rail de la galería: nace en el borde derecho, donde termina el aro de avance. */
const FROM_RAIL = PATH.replace('M150 0C150 80 118 122 200 140', 'M0 0C-40 0 -40 120 200 140');

/* Papelitos recortados que acompañan el hilo (docs/estilo-recorte.md). `at` es la fracción del hilo donde aparecen:
   el punto queda corrido del trazo a un costado. Están después de x=250, la parte que FROM_RAIL comparte con PATH. */
const SCRAPS = (
  [
    [0.22, 277, 83],
    [0.34, 308, 195],
    [0.47, 439, 163],
    [0.6, 584, 165],
    [0.71, 645, 277],
    [0.86, 715, 176],
  ] as const
).map(([at, cx, cy], i) => {
  const rand = rng(41 + i * 7);
  const n = 4 + Math.floor(rand() * 2);
  const r = 8 + rand() * 5;
  const turn = rand() * Math.PI;
  const poly: Pt[] = Array.from({ length: n }, (_, j) => {
    const a = turn + ((j + (rand() - 0.5) * 0.6) / n) * Math.PI * 2;
    const k = r * (0.7 + rand() * 0.45);
    return [cx + Math.cos(a) * k * 1.3, cy + Math.sin(a) * k * 0.8];
  });
  return { at, points: pts(poly), delay: `${(-rand() * 1.5).toFixed(2)}s` };
});

interface Props {
  color?: string;
  flip?: boolean;
  /** Nace en el extremo derecho del rail de WorkGallery, a su altura. Se usa con flip. */
  fromRail?: boolean;
}

const Stitch: React.FC<Props> = ({ color = INK.cream, flip, fromRail: wantsRail }) => {
  // El rail solo existe con la galería pineada: sin él, el hilo vuelve a su forma original.
  const [railShown, setRailShown] = useState(() => !!wantsRail && window.matchMedia(PIN).matches);
  useLayoutEffect(() => {
    if (!wantsRail) return;
    const mq = window.matchMedia(PIN);
    const sync = () => setRailShown(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, [wantsRail]);
  const fromRail = wantsRail && railShown;
  const d = fromRail ? FROM_RAIL : PATH;
  // fromRail dibuja a 1320px en vez de 1152 (72rem): se compensa la escala para que trazo y aro midan lo mismo.
  const k = fromRail ? 1152 / 1320 : 1;
  const ref = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const line = svg.querySelector('[data-thread]');
      const bead = svg.querySelector('[data-bead]');
      const scraps = svg.querySelectorAll('[data-scrap]');
      // Los papelitos se mueven solo con la costura en pantalla.
      ScrollTrigger.create({ trigger: svg, onToggle: self => svg.toggleAttribute('data-live', self.isActive) });
      gsap.set(scraps, { autoAlpha: 0 });
      const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 85%', end: 'bottom 35%', scrub: 0.5 } });
      tl.fromTo(line, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', ease: 'none' }, 0).fromTo(
        bead,
        { motionPath: { path: line as SVGPathElement, align: line as SVGPathElement, alignOrigin: [0.5, 0.5], end: 0 } },
        { motionPath: { path: line as SVGPathElement, align: line as SVGPathElement, alignOrigin: [0.5, 0.5], start: 0, end: 1 }, ease: 'none' },
        0
      );
      // Cada papelito cae de golpe cuando el hilo pasa por su altura (los tramos de arriba duran 0.5).
      scraps.forEach((el, i) => tl.set(el, { autoAlpha: 1 }, SCRAPS[i].at * 0.5));
      return () => svg.removeAttribute('data-live');
    });
    return () => mm.revert();
  }, [fromRail]);

  return (
    <Wrap aria-hidden="true" data-from-rail={fromRail ? '' : undefined}>
      <svg ref={ref} viewBox="0 0 1000 310" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
        <path d={d} fill="none" stroke={color} strokeOpacity={0.14} strokeWidth={2} strokeDasharray="2 10" />
        <path
          data-thread=""
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={7 * k}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g fill={color}>
          {SCRAPS.map(s => (
            <polygon key={s.at} data-scrap="" points={s.points} style={{ animationDelay: s.delay }} />
          ))}
        </g>
        <g data-bead="" transform="translate(850 300)">
          <circle r={15 * k} fill={color} />
          <circle r={5.5 * k} fill="var(--poster-ground, #0d0c0b)" />
        </g>
      </svg>
    </Wrap>
  );
};

/* Pocas poses y saltos, como un recorte que mueve el viento: steps(1) sostiene cada pose hasta la siguiente. */
const flutter = keyframes`
  0% { transform: rotate(0deg); }
  33% { transform: translate(3px, -4px) rotate(9deg); }
  66% { transform: translate(-3px, 2px) rotate(-7deg); }
`;

const Wrap = styled.div`
  padding-inline: max(clamp(1.25rem, 4vw, 3.5rem), calc((100% - 1320px) / 2));
  margin-block: clamp(-2rem, -3vh, -1rem);
  pointer-events: none;
  /* Encima de la sección anterior, que puede tener fondo opaco: el margen negativo no esconde el arranque del hilo. */
  position: relative;
  z-index: 2;

  svg {
    display: block;
    width: 100%;
    max-width: 72rem;
    margin-inline: auto;
    overflow: visible;
  }

  /* Mismo ancho que el rail (el hilo arranca en su extremo derecho). El margen de arriba replica el bottom del rail (y media altura de su línea de 3px): el hilo nace a su altura. */
  &[data-from-rail] {
    margin-top: calc(-1 * clamp(1.25rem, 4vh, 2.5rem) - 1.5px);
  }
  &[data-from-rail] svg {
    max-width: 1320px;
  }
  [data-scrap] {
    transform-box: fill-box;
    transform-origin: center;
  }
  svg[data-live] [data-scrap] {
    animation: ${flutter} 1.5s steps(1, end) infinite;
  }
  @media (prefers-reduced-motion: reduce) {
    svg[data-live] [data-scrap] {
      animation: none;
    }
  }
  /* Mientras el rail avanza, su aro es el único punto: el del hilo aparece cuando la galería terminó. */
  &[data-from-rail] [data-bead] {
    visibility: hidden;
  }
  :root[data-rail-done] &[data-from-rail] [data-bead] {
    visibility: visible;
  }
`;

export default Stitch;
