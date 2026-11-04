import React, { useEffect, useId, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

/* Detalles de papel recortado (docs/estilo-recorte.md): polígonos de corte a mano, tres tonos (base, luz arriba a la
   izquierda y sombra negra abajo a la derecha), nervaduras radiales descentradas y papelitos sueltos. Se mueven en
   poses, con steps(), como animación de recortes. Decorativos. */

const SHADOW = '#030404';

// Semilla fija: el mismo dibujo en cada visita.
const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

type Pt = [number, number];
/** Polígono de 8 a 11 lados con radio irregular y una mordida: una "redondez" hecha con tijera. */
const cut = (cx: number, cy: number, r: number, seed: number): Pt[] => {
  const rand = rng(seed);
  const n = 8 + Math.floor(rand() * 4);
  const bite = Math.floor(rand() * n);
  return Array.from({ length: n }, (_, i) => {
    const a = ((i + (rand() - 0.5) * 0.5) / n) * Math.PI * 2;
    const k = i === bite ? 0.68 : 0.86 + rand() * 0.2;
    return [cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k];
  });
};
const pts = (p: Pt[], dx = 0, dy = 0, s = 1, [cx, cy]: Pt = [0, 0]) =>
  p.map(([x, y]) => `${(cx + (x - cx) * s + dx).toFixed(1)},${(cy + (y - cy) * s + dy).toFixed(1)}`).join(' ');

type Blob = { x: number; y: number; r: number; seed: number; flower?: boolean; veins?: boolean };

const LEAF: Blob[] = [
  { x: 52, y: 54, r: 24, seed: 4, veins: true },
  { x: 118, y: 90, r: 58, seed: 1, veins: true },
  { x: 60, y: 130, r: 40, seed: 2, veins: true },
  { x: 152, y: 154, r: 30, seed: 3, flower: true },
];
const CANOPY: Blob[] = [
  { x: 70, y: 54, r: 26, seed: 11 },
  { x: 102, y: 66, r: 44, seed: 12 },
  { x: 56, y: 100, r: 32, seed: 13 },
  { x: 148, y: 98, r: 34, seed: 14 },
  { x: 94, y: 128, r: 24, seed: 15 },
];
const FLECKS = [
  [26, 176, 8, 4, 20],
  [178, 30, 6, 3, -35],
  [12, 96, 5, 3, 60],
  [184, 120, 7, 3, 10],
  [140, 16, 4, 4, 0],
];

interface Props {
  kind: 'leaf' | 'canopy';
  base: string;
  light: string;
  accent: string;
  className?: string;
}

const CutDetail: React.FC<Props> = ({ kind, base, light, accent, className }) => {
  const id = useId().replace(/:/g, '');
  const ref = useRef<SVGSVGElement>(null);

  // Fuera de pantalla no se anima; al entrar, las nervaduras se dibujan una vez.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => el.toggleAttribute('data-on', e.isIntersecting), { rootMargin: '10%' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const blobs = kind === 'leaf' ? LEAF : CANOPY;
  return (
    <Svg ref={ref} className={className} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      {kind === 'canopy' && (
        <g stroke={SHADOW} strokeLinecap="round" fill="none">
          <path d="M104 200L98 112" strokeWidth={9} />
          <path d="M100 150L66 112M99 128L140 102M98 116L84 84" strokeWidth={3} />
        </g>
      )}
      {blobs.map((b, i) => {
        const p = cut(b.x, b.y, b.r, b.seed);
        const fill = b.flower ? accent : base;
        return (
          <Piece key={i} style={{ animationDelay: `${-i * 0.37}s`, animationDuration: `${2.2 + i * 0.3}s` }}>
            <polygon points={pts(p, b.r * 0.13, b.r * 0.16)} fill={SHADOW} />
            <clipPath id={`${id}-${i}`}>
              <polygon points={pts(p)} />
            </clipPath>
            <polygon points={pts(p)} fill={fill} />
            {!b.flower && (
              <Light clipPath={`url(#${id}-${i})`}>
                <polygon points={pts(cut(b.x, b.y, b.r, b.seed + 40), -b.r * 0.5, -b.r * 0.55, 0.72, [b.x, b.y])} fill={light} />
              </Light>
            )}
            {b.veins && (
              <Veins stroke={light} strokeWidth={1.6} strokeLinecap="round">
                {p.map(([x, y], j) => (
                  <line
                    key={j}
                    pathLength={1}
                    x1={b.x - b.r * 0.12}
                    y1={b.y + b.r * 0.08}
                    x2={b.x - b.r * 0.12 + (x - b.x + b.r * 0.12) * 0.86}
                    y2={b.y + b.r * 0.08 + (y - b.y - b.r * 0.08) * 0.86}
                  />
                ))}
              </Veins>
            )}
          </Piece>
        );
      })}
      {FLECKS.map(([x, y, w, h, rot], i) => (
        <Fleck key={i} style={{ animationDelay: `${-i * 0.9}s` }}>
          <rect x={x} y={y} width={w} height={h} fill={accent} transform={`rotate(${rot} ${x} ${y})`} />
        </Fleck>
      ))}
    </Svg>
  );
};

// Poses de recorte: pocas posiciones por segundo, sin interpolar.
const sway = keyframes`
  from { transform: rotate(-2.5deg) translate(0, 0); }
  to { transform: rotate(2.5deg) translate(1px, -2px); }
`;
const turn = keyframes`
  from { transform: translate(0, 0); }
  to { transform: translate(4px, 3px); }
`;
const drift = keyframes`
  0% { transform: translate(0, 0) rotate(0); }
  50% { transform: translate(-3px, 6px) rotate(25deg); }
  100% { transform: translate(0, 12px) rotate(0); opacity: 0; }
`;

const Piece = styled.g`
  transform-box: fill-box;
  transform-origin: 50% 100%;
  animation: ${sway} 2.4s steps(4, jump-none) infinite alternate;
`;
const Light = styled.g`
  animation: ${turn} 3.2s steps(3, jump-none) infinite alternate;
`;
const Veins = styled.g`
  line {
    stroke-dasharray: 1;
    stroke-dashoffset: 1;
    transition: stroke-dashoffset 1.1s cubic-bezier(0.6, 0, 0.2, 1);
  }
`;
const Fleck = styled.g`
  transform-box: fill-box;
  transform-origin: center;
  animation: ${drift} 3.6s steps(6, jump-none) infinite;
`;

const Svg = styled.svg`
  pointer-events: none;
  overflow: visible;

  ${Piece}, ${Light}, ${Fleck} {
    animation-play-state: paused;
  }
  &[data-on] ${Piece}, &[data-on] ${Light}, &[data-on] ${Fleck} {
    animation-play-state: running;
  }
  &[data-on] ${Veins} line {
    stroke-dashoffset: 0;
  }
  ${Veins} line:nth-child(odd) {
    transition-delay: 0.15s;
  }

  @media (prefers-reduced-motion: reduce) {
    ${Piece}, ${Light}, ${Fleck} {
      animation: none;
    }
    ${Veins} line {
      stroke-dashoffset: 0;
      transition: none;
    }
  }
`;

export default CutDetail;
