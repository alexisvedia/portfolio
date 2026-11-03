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

interface Props {
  color?: string;
  flip?: boolean;
}

const Stitch: React.FC<Props> = ({ color = INK.cream, flip }) => {
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
    <Wrap aria-hidden="true">
      <svg ref={ref} viewBox="0 0 1000 310" style={flip ? { transform: 'scaleX(-1)' } : undefined}>
        <path d={PATH} fill="none" stroke={color} strokeOpacity={0.14} strokeWidth={2} strokeDasharray="2 10" />
        <path data-thread="" d={PATH} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" strokeLinejoin="round" />
        <g data-bead="" transform="translate(850 300)">
          <circle r={15} fill={color} />
          <circle r={5.5} fill="var(--poster-ground, #0d0c0b)" />
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
`;

export default Stitch;
