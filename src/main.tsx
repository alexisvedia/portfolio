import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerSW } from 'virtual:pwa-register';

import { ThemeProvider } from './context/ThemeContext';

import './utils/i18n';


import favicon from './assets/images/projects/Logo AV.png';


const link = document.createElement('link');
link.rel = 'icon';
link.href = favicon;
document.head.appendChild(link);

// Ensure page always starts at top on load/refresh
try {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
  window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
} catch {}

// Clarity now injected via official snippet in index.html


// Con autoUpdate, registerSW recarga la página cuando el service worker nuevo toma control: sin esto el celular
// sigue mostrando la versión anterior del caché hasta la segunda visita.
registerSW({ immediate: true });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
        <App />
    </ThemeProvider>
  </React.StrictMode>
);
