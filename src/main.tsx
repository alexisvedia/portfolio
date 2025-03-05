import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import i18n from '@utils/i18n';

// Asegurarse de que i18n se inicialice con el idioma inglés
if (i18n.language !== 'en') {
  i18n.changeLanguage('en');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
