import { createGlobalStyle } from 'styled-components';

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
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: 700;
  }
  
  /* Transiciones para el cambio de tema */
  a, button, input, textarea, .card, .navbar, .footer {
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  }
`;
