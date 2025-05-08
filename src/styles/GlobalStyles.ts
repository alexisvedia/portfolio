import { createGlobalStyle } from 'styled-components';
import './fonts.css'; // Importar el archivo de fuentes Morganite

// --- Importar Google Fonts ---
// Guardar las URLs en constantes para claridad
const latoFontsUrl =
  'https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap';
const openSansFontsUrl =
  'https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap'; // Añadir Open Sans (Regular 400, Bold 700)

// Función para añadir un link de fuente al head
const addFontLink = (url: string) => {
  if (!document.querySelector(`link[href="${url}"]`)) {
    // Evitar añadir duplicados
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    document.head.appendChild(link);
  }
};

// Añadir las fuentes
addFontLink(latoFontsUrl);
addFontLink(openSansFontsUrl);
// --- Fin Importar Google Fonts ---

export const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html {
    scroll-behavior: smooth;
    height: 100%;
    font-size: 16px; // Base font size
  }

  body {
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.body}; /* 'Inter' es el principal aquí */
    line-height: 1.6;
    min-height: 100%;
    overflow-x: hidden; 
    transition: background-color 0.3s ease, color 0.3s ease; 
  }

  /* Estilos globales para párrafos */
  p {
    font-family: ${({ theme }) => theme.fonts.body}; /* Aplicar la fuente del tema para el cuerpo */
    font-size: 16px; /* Tamaño estándar */
    color: inherit; /* Heredar color para respetar temas */
    margin-bottom: 1rem; /* Espaciado inferior estándar para párrafos */
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.heading}; /* Usa Morganite y luego Inter */
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.2;
    margin: 0 0 1rem 0;
  }

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      text-decoration: underline;
    }
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: 1rem;
    padding: 0.5rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    background-color: ${({ theme }) => theme.colors.inputBg};
    color: ${({ theme }) => theme.colors.text};
    border-radius: 4px;
    transition: border-color 0.2s ease, background-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;
