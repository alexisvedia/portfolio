import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { INK } from './content';

const PosterGlobal = createGlobalStyle`
  /* GlobalStyles pone overflow-x: hidden en html y body, y eso convierte a body en contenedor
     de scroll: ningún position: sticky funciona. clip recorta igual sin crear el contenedor. */
  html,
  body {
    overflow-x: clip;
  }

  /* Los fondos de color de cada sección van de borde a borde: sin el ancho máximo del sitio viejo. */
  body {
    max-width: none;
    padding: 0;
  }

  @font-face {
    font-family: 'Morganite';
    src: url('/fonts/Morganite/Morganite-Medium.ttf') format('truetype');
    font-weight: 500;
    font-display: swap;
  }
  @font-face {
    font-family: 'Morganite';
    src: url('/fonts/Morganite/Morganite-ExtraBold.ttf') format('truetype');
    font-weight: 800;
    font-display: swap;
  }
  @font-face {
    font-family: 'Morganite';
    src: url('/fonts/Morganite/Morganite-Black.ttf') format('truetype');
    font-weight: 900;
    font-display: swap;
  }
  @font-face {
    font-family: 'NHaas';
    src: url('/fonts/NHaasGrotesk/NHaasGroteskTXPro-55Rg.otf') format('opentype');
    font-weight: 400;
    font-display: swap;
  }

  html, body {
    background: ${INK.ground};
    color-scheme: dark;
    scrollbar-color: ${INK.red} ${INK.ground};
  }
  ::selection {
    background: ${INK.lime};
    color: ${INK.ground};
  }
  ::-webkit-scrollbar { width: 10px; }
  ::-webkit-scrollbar-track { background: ${INK.ground}; }
  ::-webkit-scrollbar-thumb { background: ${INK.red}; border-radius: 10px; border: 2px solid ${INK.ground}; }
`;

// createGlobalStyle reinyecta sus estilos en cada render (props nuevas): memo evita el parpadeo de las fuentes.
const PosterGlobalOnce = React.memo(PosterGlobal);

export default PosterGlobalOnce;
