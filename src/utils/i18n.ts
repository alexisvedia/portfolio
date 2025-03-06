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

// Obtener el idioma guardado en localStorage o usar el idioma del navegador
const getDefaultLanguage = () => {
  const savedLanguage = localStorage.getItem('i18nextLng');
  if (savedLanguage && (savedLanguage.startsWith('es') || savedLanguage.startsWith('en'))) {
    return savedLanguage.startsWith('es') ? 'es' : 'en';
  }

  // Si no hay un idioma guardado, intentar detectar el idioma del navegador
  const browserLang = navigator.language;
  return browserLang && browserLang.startsWith('es') ? 'es' : 'en';
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: getDefaultLanguage(), // Establecer el idioma inicial explícitamente
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

// Asegurarse de que el idioma seleccionado se guarde correctamente en localStorage
i18n.on('languageChanged', lng => {
  localStorage.setItem('i18nextLng', lng);
});

export default i18n;
