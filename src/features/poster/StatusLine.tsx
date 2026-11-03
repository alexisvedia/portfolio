import React from 'react';
import styled from 'styled-components';
import { INK } from './content';

/* Decorativa: copia el formato de la status line que uso en Claude Code (modelo, ventana de contexto y reloj del caché).
   La ventana se llena con el scroll de la página y el caché se descuenta en vivo; cada scroll lo vuelve a calentar. */
const WINDOW = 200;
const TTL = 60 * 60;
const CELLS = 10;

const bar = (share: number) => {
  const n = Math.max(0, Math.min(CELLS, Math.ceil(share * CELLS)));
  return '█'.repeat(n) + '░'.repeat(CELLS - n);
};
const clock = (s: number) => `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`;

const StatusLine: React.FC = () => {
  const [used, setUsed] = React.useState(24);
  const [left, setLeft] = React.useState(TTL);
  const [hits, setHits] = React.useState(11);

  React.useEffect(() => {
    let raf = 0;
    const fill = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setUsed(Math.round(24 + 150 * Math.min(1, window.scrollY / Math.max(1, max))));
    };
    fill();
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        fill();
        setLeft(TTL);
        setHits(h => h + 1);
      });
    };
    const tick = window.setInterval(() => setLeft(s => Math.max(0, s - 1)), 1000);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(tick);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Aciertos sobre lecturas: el primer mensaje siempre escribe el caché, después todo es acierto.
  const ratio = Math.round((hits / (hits + 1)) * 100);
  return (
    <Line data-reveal="" aria-hidden="true">
      <b>[Opus 5.5 · xhigh]</b>
      <i>·</i>
      <span>
        <em>{bar(used / WINDOW)}</em> {used}k/{WINDOW}k
      </span>
      <i>·</i>
      <span>{WINDOW - used}k restantes</span>
      <i>·</i>
      <span className={left ? 'warm' : 'cold'}>
        {left ? (
          <>
            caché ● 1h <em>{bar(left / TTL)}</em> {clock(left)}
          </>
        ) : (
          'caché ○ fría'
        )}
      </span>
      <i>·</i>
      <span>aciertos {ratio}%</span>
    </Line>
  );
};

const Line = styled.p`
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem 0.55rem;
  margin: clamp(1.5rem, 4vh, 2.5rem) 0 0;
  padding: 0.7rem 1rem;
  border: 2px solid ${INK.cream};
  border-radius: 0.6rem;
  background: #050505;
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 0.82rem;
  line-height: 1.5;
  color: rgba(239, 230, 200, 0.75);
  white-space: nowrap;
  font-variant-numeric: tabular-nums;

  b {
    font-weight: 500;
    color: ${INK.cream};
  }
  i {
    font-style: normal;
    color: rgba(239, 230, 200, 0.35);
  }
  em {
    font-style: normal;
    letter-spacing: -0.05em;
    color: ${INK.blue};
  }
  .warm,
  .warm em {
    color: ${INK.lime};
  }
  .cold {
    color: ${INK.red};
  }
`;

export default StatusLine;
