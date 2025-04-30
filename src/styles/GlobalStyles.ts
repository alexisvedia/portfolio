import { createGlobalStyle } from 'styled-components';
import './fonts.css'; // Importar el archivo de fuentes

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    
    /* Personalización de la barra de desplazamiento */
    scrollbar-width: thin;
    scrollbar-color: ${({ theme }) => `${theme.colors.text}50`} transparent;
  }
  
  /* Estilos para navegadores WebKit (Chrome, Safari, etc.) */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  
  ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => `${theme.colors.text}50`};
    border-radius: 3px;
    transition: opacity 1.5s ease;
  }
  
  /* Ocultar la barra cuando no se está desplazando */
  ::-webkit-scrollbar-thumb:hover {
    background-color: ${({ theme }) => `${theme.colors.text}80`};
  }
  
  /* Ocultar flechas de inicio y fin */
  ::-webkit-scrollbar-button {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    opacity: 0;
    visibility: hidden;
  }
  
  /* Hacer que la barra de desplazamiento se desvanezca cuando no hay actividad */
  body:not(.scrolling) ::-webkit-scrollbar-thumb {
    background-color: transparent !important;
    visibility: hidden !important;
    opacity: 0;
    width: 0;
  }
  
  /* Mostrar la barra de desplazamiento durante el scroll */
  body.scrolling ::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => `${theme.colors.text}50`};
    visibility: visible;
  }
  
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.3s ease, color 0.3s ease;
    
    /* Aplicar ruido al fondo */
    position: relative;
    
    &::before {
      content: "";
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 100000;
      opacity: ${({ theme }) => theme.isDark ? '0.15' : '0.08'};
      
      /* Background noise pattern estático usando SVG */
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E");
      background-repeat: repeat;
      background-size: 100px;
      
      /* Color del ruido según el tema */
      filter: ${({ theme }) => theme.isDark 
        ? 'brightness(0) invert(1) contrast(2)' 
        : 'brightness(0) contrast(1.6)'};
    }
  }

  button {
    background: none;
    border: none;
    cursor: pointer;
    font-family: inherit;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  ul, ol {
    list-style: none;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Morganite', ${({ theme }) => theme.fonts.heading};
    font-weight: 700;
  }
  
  /* Transiciones para el cambio de tema */
  a, button, input, textarea, .card, .navbar, .footer {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  }
  
  /* Clases para utilizar la fuente Morganite */
  .morganite {
    font-family: 'Morganite', sans-serif;
  }
  
  .morganite-bold {
    font-family: 'Morganite', sans-serif;
    font-weight: 700;
  }
  
  .morganite-black {
    font-family: 'Morganite', sans-serif;
    font-weight: 900;
  }
`;
