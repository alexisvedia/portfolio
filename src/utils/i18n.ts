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
      // Hero
      heroTitle: 'UX/UI Designer & Frontend Developer',
      heroSubtitle:
        'I create beautiful and functional digital experiences with React and TypeScript, focusing on usability and modern design.',
      viewProjects: 'View Projects',
      contactMe: 'Contact me',

      // Chat translations
      'AI Portfolio Assistant': 'AI Portfolio Assistant',
      '¡Hola! Soy tu AI Portfolio Assistant. ¿En qué puedo ayudarte hoy?':
        "Hello! I'm your AI Portfolio Assistant. How can I help you today?",
      'Escribe un mensaje...': 'Type a message...',
      'Limpiar chat': 'Clean chat',
      'Cerrar chat': 'Close chat',

      // Navigation
      home: 'Home',
      projects: 'Projects',
      experience: 'Experience',
      skills: 'Skills',
      contact: 'Contact',
      // Projects section
      // Skills section
      // Contact section
      contactText: 'Want to work together? Have a project in mind? Feel free to reach out!',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      send: 'Send Message',
      sending: 'Sending...',
      messageSent: 'Message sent successfully! I will get back to you soon.',
      messageError: 'There was an error sending your message. Please try again.',
      // Footer
      yourName: 'Your Name',
      allRightsReserved: 'All Rights Reserved',
      // Navegación
      navbar: {
        home: 'Home',
        about: 'About Me',
        projects: 'Projects',
        resume: 'Resume',
      },
      // About page
      about: {
        professionalProfile: 'Professional Profile',
        professionalExperience: 'Professional Experience',
        featuredProjects: 'Featured Projects',
        skills: 'Skills',
        languages: 'Languages',
        spanish: 'Spanish: Native',
        english: 'English: Intermediate Level',
        bio: {
          part1:
            'Passionate Full Stack Developer, specialized in React and TypeScript, with extensive experience in UX/UI design and great interest in integrating artificial intelligence solutions. I stand out for my adaptability, teamwork ability, humility, and constant commitment to excellence.',
          part2:
            'Experience in automations with n8n. I am always looking for challenges that drive my professional and personal growth.',
        },
        jobs: {
          fullStackEngineer: 'Full Stack Engineer',
          fusionOS: 'FusionOS.ai | 2024 - 2025',
          uiUxDesigner: 'UI/UX Designer & Quality Assurance Specialist',
          xcons: 'XCONS | 2022 - 2024',
        },
        jobDescriptions: {
          fusionOS: [
            'Advanced development of frontend functionalities with React and TypeScript.',
            'Integration and consumption of REST APIs to make the application dynamic.',
            'Implementation and maintenance of scalable interfaces with debugging practices and code quality assurance.',
          ],
          xcons: [
            'Design of graphical interfaces and user experiences for web and mobile applications.',
            'Creation and maintenance of UI component libraries.',
            'Development and customization of websites using WordPress and Elementor.',
            'Execution of functional tests, error detection and documentation.',
            'Quality assurance in digital processes and products.',
          ],
        },
        projects: {
          personalPortfolio: 'Personal Portfolio',
          personalPortfolioDesc:
            'Personal website developed with React, TypeScript and Vite, with advanced animations and responsive design.',
          ecommerceApp: 'E-commerce App',
          ecommerceAppDesc:
            'E-commerce application with shopping cart, payment gateway and admin panel.',
        },
        skillCategories: {
          fullStack: 'Full Stack',
          backend: 'Backend',
          tools: 'Tools',
        },
      },
    },
  },
  es: {
    translation: {
      welcome: '¡Bienvenido!',
      selectLanguage: 'Seleccionar idioma',
      english: 'Inglés',
      spanish: 'Español',
      // Hero
      heroTitle: 'Diseñador UX/UI y Desarrollador Frontend',
      heroSubtitle:
        'Creo experiencias digitales hermosas y funcionales con React y TypeScript, enfocándome en la usabilidad y el diseño moderno.',
      viewProjects: 'Ver Proyectos',
      contactMe: 'Contáctame',
      // Navigation
      home: 'Inicio',
      projects: 'Proyectos',
      experience: 'Experiencia',
      skills: 'Habilidades',
      contact: 'Contacto',
      // Projects section
      // Skills section
      // Contact section
      contactText:
        '¿Quieres trabajar juntos? ¿Tienes un proyecto en mente? ¡No dudes en contactarme!',
      name: 'Nombre',
      email: 'Correo electrónico',
      message: 'Mensaje',
      send: 'Enviar Mensaje',
      sending: 'Enviando...',
      messageSent: '¡Mensaje enviado con éxito! Te responderé pronto.',
      messageError: 'Hubo un error al enviar tu mensaje. Por favor, intenta de nuevo.',
      // Footer
      yourName: 'Tu Nombre',
      allRightsReserved: 'Todos los Derechos Reservados',
      // Navegación
      navbar: {
        home: 'Inicio',
        about: 'Sobre Mí',
        projects: 'Proyectos',
        resume: 'Currículum',
      },
      // Página Sobre Mí
      about: {
        professionalProfile: 'Perfil Profesional',
        professionalExperience: 'Experiencia Profesional',
        featuredProjects: 'Proyectos Destacados',
        skills: 'Habilidades',
        languages: 'Idiomas',
        spanish: 'Español: Nativo',
        english: 'Inglés: Nivel Intermedio',
        bio: {
          part1:
            'Desarrollador Full Stack apasionado, especializado en React y TypeScript, con vasta experiencia en diseño UX/UI y gran interés en la integración de soluciones de inteligencia artificial. Me destaco por mi adaptabilidad, capacidad de trabajar en equipo, humildad y compromiso constante con la excelencia.',
          part2:
            'Experiencia en automatizaciones con n8n. Siempre estoy en busca de desafíos que impulsen mi crecimiento profesional y personal.',
        },
        jobs: {
          fullStackEngineer: 'Ingeniero Full Stack',
          fusionOS: 'FusionOS.ai | 2024 - 2025',
          uiUxDesigner: 'Diseñador UI/UX & Especialista en Aseguramiento de Calidad',
          xcons: 'XCONS | 2022 - 2024',
        },
        jobDescriptions: {
          fusionOS: [
            'Desarrollo avanzado de funcionalidades frontend con React y TypeScript.',
            'Integración y consumo de APIs REST para dinamizar la aplicación.',
            'Implementación y mantenimiento de interfaces escalables con prácticas de debugging y aseguramiento de la calidad del código.',
          ],
          xcons: [
            'Diseño de interfaces gráficas y experiencias de usuario para aplicaciones web y móviles.',
            'Creación y mantenimiento de bibliotecas de componentes UI.',
            'Desarrollo y personalización de sitios web utilizando WordPress y Elementor.',
            'Ejecución de pruebas funcionales, detección y documentación de errores.',
            'Aseguramiento de la calidad en procesos y productos digitales.',
          ],
        },
        projects: {
          personalPortfolio: 'Portfolio Personal',
          personalPortfolioDesc:
            'Sitio web personal desarrollado con React, TypeScript y Vite, con animaciones avanzadas y diseño responsive.',
          ecommerceApp: 'E-commerce App',
          ecommerceAppDesc:
            'Aplicación de comercio electrónico con carrito de compras, pasarela de pagos y panel de administración.',
        },
        skillCategories: {
          fullStack: 'Full Stack',
          backend: 'Backend',
          tools: 'Herramientas',
        },
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
