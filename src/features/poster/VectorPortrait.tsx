import React, { useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { INK } from './content';
import { PORTRAIT_LAYERS, PORTRAIT_SIZE } from './portraitVector';

const { w: W, h: H } = PORTRAIT_SIZE;

// Tres tintas planas, de abajo hacia arriba. `depth` es cuánto se corre cada una con el mouse.
const LAYERS = [
  { key: 'shade', fill: '#342e2a', depth: -1 },
  { key: 'mid', fill: INK.red, depth: 0.5 },
  { key: 'light', fill: INK.cream, depth: 1.4 },
] as const;

/**
 * Retrato vectorial de Alexis en tres tintas, como una serigrafía.
 * El scroll desfasa los `<g data-layer>` (lo anima PosterHome); el mouse mueve cada `path` según su profundidad.
 */
const VectorPortrait: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
      const movers = LAYERS.map(({ key, depth }) => {
        const p = svg.querySelector(`[data-layer="${key}"] path`);
        return {
          x: gsap.quickTo(p, 'x', { duration: 0.9, ease: 'power3.out' }),
          y: gsap.quickTo(p, 'y', { duration: 0.9, ease: 'power3.out' }),
          depth,
        };
      });
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        movers.forEach(m => {
          m.x(nx * m.depth * 10);
          m.y(ny * m.depth * 10);
        });
      };
      window.addEventListener('pointermove', onMove);
      return () => window.removeEventListener('pointermove', onMove);
    });
    return () => mm.revert();
  }, []);

  return (
    <Svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      aria-hidden="true"
      focusable="false"
      data-hero-portrait=""
    >
      {LAYERS.map(({ key, fill }) => (
        <g key={key} data-layer={key}>
          <path fill={fill} fillRule="evenodd" d={PORTRAIT_LAYERS[key]} />
        </g>
      ))}
    </Svg>
  );
};

export default VectorPortrait;

const Svg = styled.svg`
  display: block;
  width: 100%;
  height: 100%;
  overflow: visible;
`;
