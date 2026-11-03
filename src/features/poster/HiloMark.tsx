import React from 'react';

interface Props {
  ink: string;
  accent: string;
  className?: string;
}

/**
 * Logo Hilo: la A y la V en un solo trazo que termina en el anillo, como el hilo rojo del sitio.
 * Decorativo: el nombre accesible va en el link que lo contiene. Los trazos llevan `data-stroke` para el DrawSVG.
 */
const HiloMark: React.FC<Props> = ({ ink, accent, className }) => (
  <svg className={className} viewBox="0 0 256 256" aria-hidden="true" focusable="false">
    <g fill="none" stroke={ink} strokeWidth={26} strokeLinecap="round" strokeLinejoin="round">
      <path data-stroke="" d="M28 214V110A46 46 0 0 1 120 110V184Q120 222 140 192L199 72" />
      <path data-stroke="" d="M28 156H94" />
    </g>
    <path
      data-ring=""
      fill={accent}
      fillRule="evenodd"
      d="M215 18a22 22 0 1 1 0 44a22 22 0 1 1 0-44zm0 14a8 8 0 1 0 0 16a8 8 0 1 0 0-16z"
    />
  </svg>
);

export default HiloMark;
