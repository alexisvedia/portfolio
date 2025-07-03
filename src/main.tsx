import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import { ThemeProvider } from './context/ThemeContext';

import './utils/i18n';


import favicon from './assets/images/projects/Logo AV.png';


const link = document.createElement('link');
link.rel = 'icon';
link.href = favicon;
document.head.appendChild(link);



ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>

        <App />

    </ThemeProvider>
  </React.StrictMode>
);
