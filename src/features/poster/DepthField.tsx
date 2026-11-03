import React, { useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { INK } from './content';
import { STROKE } from './glyphs';

gsap.registerPlugin(ScrollTrigger);

type Piece = { kind: 'ring' | 'bar' | 'arc'; top: string; left: string; size: string; color: string; depth: 1 | 2 | 3; rotate: number };

/* depth 1 es el fondo (lento, chico), 3 el primer plano (rápido, grande y desenfocado). */
const PIECES: Piece[] = [
  { kind: 'ring', top: '12%', left: '62%', size: 'clamp(3rem, 7vw, 6rem)', color: INK.teal, depth: 1, rotate: 0 },
  { kind: 'bar', top: '30%', left: '86%', size: 'clamp(4rem, 9vw, 8rem)', color: INK.lime, depth: 2, rotate: -32 },
  { kind: 'arc', top: '80%', left: '22%', size: 'clamp(5rem, 11vw, 10rem)', color: INK.orange, depth: 2, rotate: 20 },
  { kind: 'ring', top: '78%', left: '90%', size: 'clamp(8rem, 18vw, 16rem)', color: INK.red, depth: 3, rotate: 0 },
  { kind: 'bar', top: '-4%', left: '40%', size: 'clamp(7rem, 15vw, 13rem)', color: INK.blue, depth: 3, rotate: 58 },
  { kind: 'arc', top: '18%', left: '8%', size: 'clamp(2.5rem, 5vw, 4.5rem)', color: INK.violet, depth: 1, rotate: -70 },
];

const shape = (p: Piece) => {
  const sw = STROKE;
  if (p.kind === 'ring')
    return (
      <>
        <circle cx={50} cy={50} r={40} fill={p.color} />
        <circle cx={50} cy={50} r={14} fill="var(--poster-ground, #0d0c0b)" />
      </>
    );
  if (p.kind === 'bar') return <path d="M14 50H86" stroke={p.color} strokeWidth={sw} strokeLinecap="round" />;
  return <path d="M14 86A36 36 0 0 1 86 86" fill="none" stroke={p.color} strokeWidth={sw} strokeLinecap="round" />;
};

/** Capas de piezas sueltas del alfabeto detrás y delante del hero. Decorativas. */
const DepthField: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const pieces = gsap.utils.toArray<HTMLElement>('[data-depth]', el);
      pieces.forEach(p => {
        const d = Number(p.dataset.depth);
        gsap.to(p, {
          yPercent: -60 * d,
          rotation: `+=${d * 25}`,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
        });
      });
    });
    // El parallax del puntero solo con mouse: en touch no hay hover que seguir.
    mm.add('(prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
      const inners = gsap.utils.toArray<HTMLElement>('[data-depth] > svg', el);
      const movers = inners.map(n => ({
        x: gsap.quickTo(n, 'x', { duration: 0.8, ease: 'power3.out' }),
        y: gsap.quickTo(n, 'y', { duration: 0.8, ease: 'power3.out' }),
        d: Number(n.parentElement?.dataset.depth ?? 1),
      }));
      const onMove = (e: PointerEvent) => {
        const nx = e.clientX / window.innerWidth - 0.5;
        const ny = e.clientY / window.innerHeight - 0.5;
        movers.forEach(m => {
          m.x(nx * m.d * 28);
          m.y(ny * m.d * 28);
        });
      };
      window.addEventListener('pointermove', onMove);
      return () => window.removeEventListener('pointermove', onMove);
    });
    return () => mm.revert();
  }, []);

  return (
    <Field ref={ref} aria-hidden="true">
      {PIECES.map((p, i) => (
        <Bit
          key={i}
          data-depth={p.depth}
          data-low={parseFloat(p.top) > 60 || undefined}
          style={{ top: p.top, left: p.left, width: p.size, transform: `rotate(${p.rotate}deg)` }}
          $depth={p.depth}
        >
          <svg viewBox="0 0 100 100">{shape(p)}</svg>
        </Bit>
      ))}
    </Field>
  );
};

const Field = styled.div`
  position: absolute;
  inset: 0;
  overflow: clip;
  pointer-events: none;
`;

const Bit = styled.div<{ $depth: number }>`
  position: absolute;
  opacity: ${({ $depth }) => ($depth === 1 ? 0.35 : $depth === 2 ? 0.7 : 0.9)};
  filter: ${({ $depth }) => ($depth === 3 ? 'blur(6px)' : $depth === 1 ? 'blur(1px)' : 'none')};
  z-index: ${({ $depth }) => ($depth === 3 ? 3 : 0)};

  svg {
    display: block;
    width: 100%;
    overflow: visible;
  }

  @media (max-width: 860px) {
    opacity: ${({ $depth }) => ($depth === 1 ? 0.25 : 0.5)};
    /* Las piezas de abajo caen sobre el copy del hero. */
    &[data-low] {
      display: none;
    }
  }
`;

export default DepthField;
