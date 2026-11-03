import React from 'react';
import { CELL, layoutWord, STROKE } from './glyphs';

interface Props {
  word: string;
  cols: number;
  ink: string;
  accent: string;
  /** Índices de letras que van enteras en el color de acento, como los afiches de dos tintas. */
  accentGlyphs?: number[];
  /** Dibuja la grilla de construcción (celda, ejes y círculo guía) debajo de cada letra, oculta hasta el hover. */
  guides?: boolean;
  className?: string;
}

/**
 * Palabra armada con el alfabeto construido. Es decorativa: el texto accesible vive en el `<h2>` vecino.
 * Cada trazo lleva `data-stroke` y cada anillo `data-ring` para que la animación los encuentre.
 */
const ConstructedWord: React.FC<Props> = ({ word, cols, ink, accent, accentGlyphs = [], guides, className }) => {
  const { placed, viewBox } = layoutWord(word, cols);
  return (
    <svg className={className} viewBox={viewBox} aria-hidden="true" focusable="false">
      {placed.map(({ char, x, y, glyph }, i) => {
        const color = accentGlyphs.includes(i) ? accent : ink;
        const ringColor = accentGlyphs.includes(i) ? ink : accent;
        return (
          <g key={`${char}${i}`} transform={`translate(${x} ${y})`}>
            {guides && (
              <g data-guide="" fill="none" stroke={accent} strokeWidth={0.6}>
                <rect vectorEffect="non-scaling-stroke" x={0} y={0} width={CELL} height={CELL} />
                <path vectorEffect="non-scaling-stroke" d={`M${CELL / 2} 0V${CELL}M0 ${CELL / 2}H${CELL}M0 0L${CELL} ${CELL}M${CELL} 0L0 ${CELL}`} />
                <circle vectorEffect="non-scaling-stroke" cx={CELL / 2} cy={CELL / 2} r={CELL / 2 - STROKE / 2} />
                <circle vectorEffect="non-scaling-stroke" cx={CELL / 2} cy={CELL / 2} r={CELL / 4} />
              </g>
            )}
            {glyph.strokes.map((d, j) => (
              <path
                key={j}
                d={d}
                data-stroke=""
                fill="none"
                stroke={color}
                strokeWidth={STROKE}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {glyph.rings?.map((r, j) => (
              <g key={`r${j}`} data-ring="">
                <circle cx={r.cx} cy={r.cy} r={r.r} fill={ringColor} />
                <circle cx={r.cx} cy={r.cy} r={r.r * 0.36} fill="var(--poster-ground, #0d0c0b)" />
              </g>
            ))}
          </g>
        );
      })}
    </svg>
  );
};

export default ConstructedWord;
