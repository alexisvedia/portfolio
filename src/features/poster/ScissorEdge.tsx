import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styled from 'styled-components';
import { rng, SHADOW } from './cut';

/* Borde de arriba de una sección, cortado a tijera (docs/estilo-recorte.md): el papel de la sección sube en dientes
   de corte recto sobre la de arriba. La cara de cada diente que mira a la luz (arriba a la izquierda) lleva el tono
   claro, y una astilla negra asoma a la derecha de cada diente como sombra-pieza. Mientras la sección entra, el filo
   salta entre tres poses, como recorte animado cuadro a cuadro. */

type Pt = [number, number];
const W = 1000;
const H = 100;

// Dientes de ancho y alto desparejos: tramos rectos largos y alguna mordida honda, nunca un zigzag regular.
const edge = (seed: number): Pt[] => {
  const r = rng(seed);
  const out: Pt[] = [];
  for (let x = 0; x < W; ) {
    // Uno de cada cinco cortes es una mordida honda; el resto va por la mitad de arriba.
    out.push([x, r() < 0.2 ? 62 + r() * 30 : 6 + r() * 46]);
    x += 45 + r() * 110;
  }
  out.push([W, 6 + r() * 46]);
  return out;
};

// Una pose es el mismo filo con cada vértice corrido un poco: el papel se acomoda sin cambiar de forma.
const pose = (base: Pt[], seed: number): Pt[] => {
  const r = rng(seed);
  return base.map(([x, y], i) => [i && i < base.length - 1 ? x + (r() - 0.5) * 10 : x, Math.min(96, Math.max(4, y + (r() - 0.5) * 16))]);
};

const str = (p: Pt[], dx = 0, dy = 0) => p.map(([x, y]) => `${(x + dx).toFixed(1)},${(y + dy).toFixed(1)}`).join(' ');
// El papel baja 20 unidades más que el SVG: así el borde de abajo no deja una línea de antialias.
const paper = (p: Pt[], dx = 0, dy = 0) => `0,${H + 20} ${str(p, dx, dy)} ${W},${H + 20}`;
// Franja del filo: el borde y el mismo borde 9 unidades más abajo, de vuelta.
const lip = (p: Pt[]) => `${str(p)} ${str([...p].reverse(), 2, 9)}`;

const ScissorEdge: React.FC<{ color: string; light: string; seed: number }> = ({ color, light, seed }) => {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = ref.current!;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const base = edge(seed);
    const poses = [base, pose(base, seed + 1), pose(base, seed + 2)];
    const [shadow, sheet, glint] = Array.from(svg.querySelectorAll('polygon'));
    let shown = 0;
    const st = ScrollTrigger.create({
      trigger: svg.parentElement,
      start: 'top bottom',
      end: 'top top',
      onUpdate: self => {
        // Nueve cuadros en todo el recorrido: la pose cambia a saltos, no se desliza.
        const i = Math.floor(self.progress * 9) % 3;
        if (i === shown) return;
        shown = i;
        const p = poses[i];
        gsap.set(shadow, { attr: { points: paper(p, 7, 4) } });
        gsap.set(sheet, { attr: { points: paper(p) } });
        gsap.set(glint, { attr: { points: lip(p) } });
      },
    });
    return () => st.kill();
  }, [seed]);

  const p = edge(seed);
  return (
    <Svg ref={ref} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <polygon points={paper(p, 7, 4)} fill={SHADOW} />
      <polygon points={paper(p)} fill={color} />
      <polygon points={lip(p)} fill={light} />
    </Svg>
  );
};

/* Pegado al borde de arriba, hacia afuera, y encima de la sección anterior. El papel desborda hacia abajo y tapa
   la costura entre el SVG y el fondo de la sección. */
const Svg = styled.svg`
  position: absolute;
  left: 0;
  bottom: calc(100% - 1px);
  z-index: 3;
  display: block;
  width: 100%;
  height: clamp(2.25rem, 5.5vw, 5rem);
  overflow: visible;
  pointer-events: none;
`;

export default ScissorEdge;
