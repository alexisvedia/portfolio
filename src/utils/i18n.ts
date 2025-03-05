import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      welcome: 'Welcome!',
      selectLanguage: 'Select language',
      english: 'English',
      spanish: 'Spanish',
      // Navegación
      navbar: {
        home: 'Home',
        about: 'About Me',
        projects: 'Projects',
        resume: 'Resume',
      },
    },
  },
  es: {
    translation: {
      welcome: '¡Bienvenido!',
      selectLanguage: 'Seleccionar idioma',
      english: 'Inglés',
      spanish: 'Español',
      // Navegación
      navbar: {
        home: 'Inicio',
        about: 'Sobre Mí',
        projects: 'Proyectos',
        resume: 'Currículum',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;
