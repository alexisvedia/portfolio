import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// import i18n from '@utils/i18n';

// i18n ya está configurado en @utils/i18n.ts
// No forzamos ningún idioma aquí para permitir que
// se use el configurado en localStorage o el detectado del navegador

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
