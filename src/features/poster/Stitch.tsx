import React, { useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { INK } from './content';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin);

/* Hilo que cose una sección con la siguiente: baja, hace un rulo, una puntada en zigzag, otro rulo y remata en un anillo. */
const PATH =
  'M150 0C150 80 118 122 200 140C300 162 334 58 272 58C206 58 226 172 360 180L400 146L440 204L480 146L520 204L560 146C646 112 712 262 624 254C556 248 598 138 702 150C806 162 850 222 850 300';

/* Variante que continúa el rail de la galería: nace en el borde derecho, donde termina el aro de avance. */
const FROM_RAIL = PATH.replace('M150 0C150 80 118 122 200 140', 'M0 0C-40 0 -40 120 200 140');

interface Props {
  color?: string;
  flip?: boolean;
  /** Hilo crema de 3px y aro rojo chico, alineado al final del rail de WorkGallery. Se usa con flip. */
  fromRail?: boolean;
}

const Stitch: React.FC<Props> = ({ color = INK.cream, flip, fromRail }) => {
  const d = fromRail ? FROM_RAIL : PATH;
  const bead = fromRail ? INK.red : color;
  const ref = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const line = svg.querySelector('[data-thread]');
      const bead = svg.querySelector('[data-bead]');
      const tl = gsap.timeline({ scrollTrigger: { trigger: svg, start: 'top 85%', end: 'bottom 35%', scrub: 0.5 } });
      tl.fromTo(line, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', ease: 'none' }, 0).fromTo(
        bead,
        { motionPath: { path: line as SVGPathElement, align: line as SVGPathElement, alignOrigin: [0.5, 0.5], end: 0 } },
        { motionPath: { path: line as SVGPathElement, align: line as SVGPathElement, alignOrigin: [0.5, 0.5], start: 0, end: 1 }, ease: 'none' },
        0
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <Wrap aria-hidden="true" data-from-rail={fromRail ? '' : undefined}>
      <svg ref={ref} viewBox="0 0 1000 310" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
        <path d={d} fill="none" stroke={color} strokeOpacity={0.14} strokeWidth={2} strokeDasharray="2 10" />
        <path
          data-thread=""
          d={d}
          fill="none"
          stroke={color}
          strokeWidth={fromRail ? 3 : 7}
          vectorEffect={fromRail ? 'non-scaling-stroke' : undefined}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <g data-bead="" transform="translate(850 300)">
          <circle r={fromRail ? 7 : 15} fill={bead} />
          <circle r={fromRail ? 2.3 : 5.5} fill="var(--poster-ground, #0d0c0b)" />
        </g>
      </svg>
    </Wrap>
  );
};

const Wrap = styled.div`
  padding-inline: max(clamp(1.25rem, 4vw, 3.5rem), calc((100% - 1320px) / 2));
  margin-block: clamp(-2rem, -3vh, -1rem);
  pointer-events: none;

  svg {
    display: block;
    width: 100%;
    max-width: 72rem;
    margin-inline: auto;
    overflow: visible;
  }

  /* Mismo ancho que el rail: el hilo arranca justo en su extremo derecho. */
  /* El margen de arriba replica el bottom del rail (y media altura de su línea de 3px): el hilo nace a su altura. */
  &[data-from-rail] {
    margin-top: calc(-1 * clamp(1.25rem, 4vh, 2.5rem) - 1.5px);
  }
  &[data-from-rail] svg {
    max-width: 1320px;
  }
`;

export default Stitch;
