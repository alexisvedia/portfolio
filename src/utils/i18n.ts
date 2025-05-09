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
      heroTitle: 'UX/UI Designer and Frontend Developer',
      heroSubtitle:
        'Artificial Intelligence • User Experience • E-commerce • WordPress • Chatbots • Blogs • Interface Design • Mobile App Design • Automations',
      viewProjects: 'View Projects',
      contactMe: 'Contact Me',

      // Sidebar chats
      'sidebar.chats.today': 'TODAY',
      'sidebar.chats.yesterday': 'YESTERDAY',
      'sidebar.chats.previous': 'PREVIOUS',

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
      experience: 'Projects',
      skills: 'Skills',
      contact: 'Contact',
      // Projects section
      // Skills section
      // Contact section
      contactText: 'Want to work together? Have a project in mind? Feel free to reach out!',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      subject: 'Subject',
      send: 'Send Message',
      sending: 'Sending...',
      messageSent: 'Message sent successfully! I will get back to you soon.',
      messageError: 'There was an error sending your message. Please try again.',
      // Placeholders
      namePlaceholder: 'E.g: Steve Jobs',
      emailPlaceholder: 'example@example.com',
      messagePlaceholder: 'Write a message...',
      subjectPlaceholder: 'E.g: I need help improving Siri',
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
      // Tooltips for Sidebar Controls
      tooltip: {
        github: 'Visit GitHub Profile',
        linkedin: 'Visit LinkedIn Profile',
        toggleTheme: 'Toggle Theme',
        selectLanguage: 'Select Language',
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
            'Full Stack Developer with strong specialization in React and TypeScript and extensive background in UX/UI design.',
          part2:
            'I have collaborated with multidisciplinary teams on international projects, quickly adapting to intercultural environments and agile methodologies. I stand out for my teamwork ability, professional humility, and permanent commitment to excellence and delivering high-impact results.',
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
      // Testimonials Section Title
      testimonialsTitle: 'Testimonials',
      testimonials: {
        jorge:
          '"During the 2 years he provided services for XCONS, Alexis was a very proactive person, always doing more than what was asked, with an ambition to learn and improve."',
        mauro:
          '"Alexis started as one person and ended as another in his process at Fusion. Undoubtedly, in a short time he adapted, learned, and surpassed himself. He was of great help to us in very accelerated implementation times, and his knowledge in design saved us hours of understanding with the design team."',
        milena:
          '"Whenever I have to work with a new client, I think of Alexis, and how his help could serve me. He is a person who is at the forefront. Highly recommended!"',
        kodi:
          '"I met Alexis through Mile. He made an initial redesign proposal for my app without me asking. That\'s when I realized I had to work with him. We worked together for hours, and he never hesitated to tell me if something wasn\'t on the right track. He also introduced me to many tools, a genius!"',
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
        'Inteligencia Artificial • Experiencia de usuario • E-commerce • Wordpress • Chatbots • Blogs • Diseño de interfaces • Diseño de aplicaciones móviles • Automatizaciones',
      viewProjects: 'Ver Proyectos',
      contactMe: 'Contáctame',

      // Sidebar chats
      'sidebar.chats.today': 'HOY',
      'sidebar.chats.yesterday': 'AYER',
      'sidebar.chats.previous': 'ANTERIORES',

      // Chat translations
      'AI Portfolio Assistant': 'AI Portfolio Assistant',
      '¡Hola! Soy tu AI Portfolio Assistant. ¿En qué puedo ayudarte hoy?':
        '¡Hola! Soy tu AI Portfolio Assistant. ¿En qué puedo ayudarte hoy?',
      'Escribe un mensaje...': 'Escribe un mensaje...',
      'Limpiar chat': 'Limpiar chat',
      'Cerrar chat': 'Cerrar chat',

      // Navigation
      home: 'Inicio',
      projects: 'Proyectos',
      experience: 'Proyectos',
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
      subject: 'Asunto',
      send: 'Enviar Mensaje',
      sending: 'Enviando...',
      messageSent: '¡Mensaje enviado con éxito! Te responderé pronto.',
      messageError: 'Hubo un error al enviar tu mensaje. Por favor, intenta de nuevo.',
      // Placeholders
      namePlaceholder: 'Ej: Steve Jobs',
      emailPlaceholder: 'ejemplo@ejemplo.com',
      messagePlaceholder: 'Escribe un mensaje...',
      subjectPlaceholder: 'Ej: Necesito ayuda para mejorar Siri',
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
      // Tooltips para Controles de Sidebar
      tooltip: {
        github: 'Visitar Perfil de GitHub',
        linkedin: 'Visitar Perfil de LinkedIn',
        toggleTheme: 'Cambiar Tema',
        selectLanguage: 'Seleccionar Idioma',
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
            'Desarrollador Full Stack con sólida especialización en React y TypeScript y amplia trayectoria en diseño UX/UI.',
          part2:
            'He colaborado con equipos multidisciplinarios en proyectos internacionales, adaptándome rápidamente a entornos interculturales y metodologías ágiles. Destaco por mi capacidad de trabajo en equipo, humildad profesional y compromiso permanente con la excelencia y la entrega de resultados de alto impacto.',
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
      // Título Sección Testimonios
      testimonialsTitle: 'Testimonios',
      testimonials: {
        jorge:
          '"Durante los 2 años que prestó servicios para XCONS, Alexis fue una persona muy proactiva, siempre haciendo más de lo que se pedía, con ambición de aprender y superarse."',
        mauro:
          '"Alexis empezó como una persona y terminó como otra en su proceso en Fusion. Sin duda en poco tiempo se adaptó, aprendió y se superó a sí mismo. Nos fue de gran ayuda en tiempos muy acelerados de implementación, y su conocimiento en diseño nos ahorró horas de entendimiento con el equipo de diseñadores."',
        milena:
          '"Siempre que debo trabajar con algún cliente nuevo pienso en Alexis, y en cómo podría servirme su ayuda. Es una persona que está a la vanguardia. ¡Recomendadísimo!"',
        kodi:
          '"A Alexis lo conocí por contacto con Mile. Realizó una primer propuesta de rediseño de mi app sin habérselo pedido. Ahí me di cuenta que debía trabajar con él. Trabajamos en conjunto durante horas, y no dudaba nunca en decirme que algo no iba por buen camino. Además me hizo conocer muchas herramientas, ¡un genio!"',
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
