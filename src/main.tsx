import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import './styles/index.css'; // Eliminado: Estilos globales se manejan en App.tsx con GlobalStyles
import { ThemeProvider } from './context/ThemeContext';
// import { LanguageProvider } from './context/LanguageContext'; // Eliminado: i18next maneja el contexto del idioma
import './utils/i18n'; // Inicialización de i18next

// Importar el favicon
import favicon from './assets/images/projects/Logo AV.png';

// Inyectar el favicon en el head
const link = document.createElement('link');
link.rel = 'icon';
link.href = favicon;
document.head.appendChild(link);

// i18n ya está configurado en @utils/i18n.ts
// No forzamos ningún idioma aquí para permitir que
// se use el configurado en localStorage o el detectado del navegador

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      {/* <LanguageProvider> */}
        <App />
      {/* </LanguageProvider> */}
    </ThemeProvider>
  </React.StrictMode>
);
