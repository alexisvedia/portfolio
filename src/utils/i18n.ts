import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      landing: {
        firstName: 'Alexis',
        lastName: 'Vedia',
        role1: 'UX/UI Software Developer',
        role2: 'AI Integration Specialist',
        heroAlt: 'Silhouette of Alexis Vedia wearing sunglasses that reflect a blue sky',
        lead: 'I help entrepreneurs, agencies and startups shape innovative solutions and bring them to life with high-end UX/UI design, real code and AI tools that optimize and maximize results.',
        feature1Title: 'End to end',
        feature1Text: 'From UX research and high-fidelity Figma prototypes to a flawless, complete implementation.',
        feature2Title: 'Solo or with your team',
        feature2Text: 'I work autonomously or embedded in your team, adapting to what the project needs to deliver outstanding results.',
        servicesTitle: 'Services',
        learnMore: 'Learn more',
        aiTitle: 'AI & automation',
        aiText: 'Workflow automation with n8n, API integrations and web scraping solutions. Business process optimization with Artificial Intelligence.',
        aiAlt: 'n8n workflow with an AI agent, Gemini model and memory',
        frontTitle: 'Frontend development',
        frontText: 'Modern, scalable web apps with React, TypeScript and the latest technologies. Focused on performance, accessibility and user experience.',
        frontAlt: 'React and TypeScript code in an editor',
        wpTitle: 'WordPress development',
        wpText: 'Custom WordPress solutions with theme development, plugin customization and WooCommerce integration. Performance optimization, SEO and migrations.',
        wpAlt: 'Osvaldo González e-commerce built with WordPress',
        designTitle: 'Graphic & web design',
        designText: 'User-centered design with advanced prototyping in Figma, user research, usability testing and component libraries. Design optimized for effective social media communication.',
        designAlt: 'Crema & Crew ice cream shop design in Figma',
        contactTitle: 'New technology',
        contactSubtitle: 'It is time to take the next step',
        name: 'Name',
        namePh: 'e.g. Steve Jobs',
        subject: 'Subject',
        subjectPh: 'e.g. I need help improving Siri',
        email: 'Email',
        emailPh: 'example@example.com',
        message: 'Message',
        messagePh: 'Write a message...',
        send: 'Send message',
        sending: 'Sending...',
        sent: 'Message sent. I will get back to you soon.',
        error: 'The message could not be sent. Try again or email alexisleonelvedia@gmail.com.',
      },
      welcome: 'Welcome!',
      selectLanguage: 'Select language',
      english: 'English',
      spanish: 'Spanish',

      heroTitle: 'UX/UI Designer and Frontend Developer',
      heroSubtitle:
        'Artificial Intelligence • User Experience • E-commerce • WordPress • Chatbots • Interface Design • Mobile App Design • Automations',

      // Hero section translations
      heroSubtitle1: 'UX/UI Developer',
      heroSubtitle2: 'AI Integration Specialist',
      heroDescription1: 'I accompany agencies, entrepreneurs and startups',
      heroDescription2: 'in designing innovative solutions,',
      heroDescription3: 'materializing them into real products',
      heroDescription4: 'and boosting them with AI',
      heroDescription5: '',

      viewProjects: 'View Projects',
      contactMe: 'Contact Me',
      underConstruction: 'Under construction',

      xInvite: {
        title: 'Want to stay up to date?',
        description:
          'Daily AI updates: leaks, quick analyses and practical examples. Clear demos, questions to spark debate, and a critical look at impact.',
        cta: 'Visit my profile',
        ctaAria: "Open Alexis' profile on X in a new tab",
        avatarAlt: "Alexis' X profile photo",
      },

      'AI Portfolio Assistant': 'AI Portfolio Assistant',
      '¡Hola! Soy tu AI Portfolio Assistant. ¿En qué puedo ayudarte hoy?':
        "Hello! I'm your AI Portfolio Assistant. How can I help you today?",
      'Escribe un mensaje...': 'Type a message...',
      'Enviar mensaje': 'Send message',
      'Limpiar chat': 'Clean chat',
      'Cerrar chat': 'Close chat',
      Conectado: 'Connected',
      Conectando: 'Connecting',
      Desconectado: 'Disconnected',
      Desconocido: 'Unknown',

      home: 'Home',
      projects: 'Projects',
      experience: 'Projects',
      skills: 'Skills',
      contact: 'Contact',

      contactText:
        'Want to work together? Have a project in mind? Feel free to contact me at alexisleonelvedia@gmail.com or using the form!',
      name: 'Name',
      email: 'Email',
      message: 'Message',
      subject: 'Subject',
      send: 'Send Message',
      sending: 'Sending...',
      messageSent: 'Message sent successfully! I will get back to you soon.',
      messageError: 'There was an error sending your message. Please try again.',

      namePlaceholder: 'E.g: Steve Jobs',
      emailPlaceholder: 'example@example.com',
      messagePlaceholder: 'Write a message...',
      subjectPlaceholder: 'E.g: I need help improving Siri',

      yourName: 'Your Name',
      allRightsReserved: 'All Rights Reserved',

      navbar: {
        home: 'Home',
        about: 'About Me',
        projects: 'Projects',
        resume: 'Resume',
        services: 'Services',
        xcons: 'XCONS',
        xcons2: 'XCONS 2',
        fusionads: 'FusionAds',
        bandit: 'Bandit',
        otros: 'Other Projects',
      },

      tooltip: {
        github: 'Visit GitHub Profile',
        linkedin: 'Visit LinkedIn Profile',
        x: 'Visit X Profile',
        toggleTheme: 'Toggle Theme',
        selectLanguage: 'Select Language',
        viewOriginal: 'View original image in new tab',
        copyEmail: 'Copy email to clipboard',
        copied: 'Copied!',
      },

      documentLinksTitle: 'Proposal Defense',

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

      testimonialsTitle: 'Testimonials',
      testimonials: {
        jorge:
          '"During the 2 years he provided services for XCONS, Alexis was a very proactive person, always doing more than what was asked, with an ambition to learn and improve."',
        mauro:
          '"Alexis started as one person and ended as another in his process at Fusion. Undoubtedly, in a short time he adapted, learned, and surpassed himself. He was of great help to us in very accelerated implementation times, and his knowledge in design saved us hours of understanding with the design team."',
        milena:
          '"Whenever I have to work with a new client, I think of Alexis, and how his help could serve me. He is a person who is at the forefront. Highly recommended!"',
        kodi: '"I met Alexis through Mile. He made an initial redesign proposal for my app without me asking. That\'s when I realized I had to work with him. We worked together for hours, and he never hesitated to tell me if something wasn\'t on the right track. He also introduced me to many tools, a genius!"',
      },
      viewOriginalButton: 'View Original',
      openOriginalTitle: 'Open original image in new tab',
      companyDescriptions: {
        xcons: 'E-commerce platform specialized in omnichannel sales of construction materials.',
        fusionads:
          'AI-powered generative advertising platform that creates professional omni-channel ads.',
        bandit: 'Platform focused on tour and live concert management for artists and managers.',
        otros: 'Various personal and professional projects under development.',
      },
      bandit: {
        experience: {
          tasks: 'Tasks',
          tools: 'Tools',
          results: 'Results',
        },
      },

      services: {
        title: 'Services',
        subtitle:
          'Comprehensive solutions from design to development, with a focus on user experience and cutting-edge technology.',
        frontend: {
          title: 'Frontend Development',
          description:
            'Modern and scalable web applications with React, TypeScript and the latest technologies. Focus on performance, accessibility and user experience.',
        },
        design: {
          title: 'UX/UI Design',
          description:
            'User-centered design with advanced prototyping in Figma. User research, usability testing and component library creation.',
        },
        automation: {
          title: 'Automation & Integration',
          description:
            'Workflow automation with n8n, API integrations and web scraping solutions. Optimization of business processes.',
        },
        ai: {
          title: 'AI Integration',
          description:
            'Implementation of AI solutions with LLMs, advanced prompt engineering and intelligent workflow development.',
        },
        wordpress: {
          title: 'WordPress Development',
          description:
            'Custom WordPress solutions with theme development, plugin customization and WooCommerce integration. Performance optimization and SEO.',
        },
      },
    },
  },
  es: {
    translation: {
      landing: {
        firstName: 'Alexis',
        lastName: 'Vedia',
        role1: 'UX/UI Software Developer',
        role2: 'Especialista en Integración de IA',
        heroAlt: 'Silueta de Alexis Vedia con anteojos de sol que reflejan un cielo azul',
        lead: 'Impulso a emprendedores, agencias y startups ideando soluciones innovadoras y llevándolas a la realidad con diseño UX/UI de alto nivel, desarrollo en código y herramientas de IA que optimizan y maximizan resultados.',
        feature1Title: 'De principio a fin',
        feature1Text: 'Desde investigación UX y prototipos de alta fidelidad en Figma, hasta una impecable implementación completa.',
        feature2Title: 'Solo o en equipo',
        feature2Text: 'Trabajo de forma autónoma o integrado a tu equipo, adaptándome a las necesidades del proyecto para entregar resultados sobresalientes.',
        servicesTitle: 'Servicios',
        learnMore: 'Conocer más',
        aiTitle: 'AI y automatizaciones',
        aiText: 'Automatización de flujos de trabajo con n8n, integraciones de APIs y soluciones de web scraping. Optimización de procesos empresariales con Inteligencia Artificial.',
        aiAlt: 'Workflow de n8n con un agente de IA, modelo Gemini y memoria',
        frontTitle: 'Desarrollo Frontend',
        frontText: 'Aplicaciones web modernas y escalables con React, TypeScript y las últimas tecnologías. Enfoque en rendimiento, accesibilidad y experiencia de usuario.',
        frontAlt: 'Código React y TypeScript en un editor',
        wpTitle: 'Desarrollo Wordpress',
        wpText: 'Soluciones WordPress personalizadas con desarrollo de temas, personalización de plugins e integración WooCommerce. Optimización de rendimiento, SEO y migraciones.',
        wpAlt: 'E-commerce de Osvaldo González hecho en WordPress',
        designTitle: 'Diseño Gráfico y Web',
        designText: 'Diseño centrado en el usuario con prototipado avanzado en Figma. Research de usuarios, testing de usabilidad y creación de librerías de componentes. Diseño optimizado para comunicación eficaz en redes sociales.',
        designAlt: 'Diseño de la heladería Crema & Crew en Figma',
        contactTitle: 'Nueva tecnología',
        contactSubtitle: 'Es momento de dar el siguiente paso',
        name: 'Nombre',
        namePh: 'Ej: Steve Jobs',
        subject: 'Asunto',
        subjectPh: 'Ej: Necesito ayuda para mejorar Siri',
        email: 'Correo electrónico',
        emailPh: 'ejemplo@ejemplo.com',
        message: 'Mensaje',
        messagePh: 'Escribe un mensaje...',
        send: 'Enviar Mensaje',
        sending: 'Enviando...',
        sent: 'Mensaje enviado. Te respondo pronto.',
        error: 'No se pudo enviar el mensaje. Probá de nuevo o escribime a alexisleonelvedia@gmail.com.',
      },
      welcome: '¡Bienvenido!',
      selectLanguage: 'Seleccionar idioma',
      english: 'Inglés',
      spanish: 'Español',

      heroTitle: 'Diseñador UX/UI y Desarrollador Frontend',
      heroSubtitle:
        'Inteligencia Artificial • Experiencia de usuario • E-commerce • Wordpress • Chatbots • Diseño de interfaces • Diseño de aplicaciones móviles • Automatizaciones',

      // Hero section translations
      heroSubtitle1: 'Desarrollador UX/UI',
      heroSubtitle2: 'Especialista en Integración de IA',
      heroDescription1: 'Acompaño a agencias, emprendedores y startups',
      heroDescription2: 'en el diseño de soluciones innovadoras,',
      heroDescription3: 'materializarlas en productos reales',
      heroDescription4: 'e impulsarlas con IA',
      heroDescription5: '',

      viewProjects: 'Ver Proyectos',
      contactMe: 'Contáctame',
      underConstruction: 'En construcción',

      xInvite: {
        title: '¿Querés mantenerte al día?',
        description:
          'Actualizaciones diarias de IA: leaks, microanálisis y ejemplos prácticos. Demos claras, preguntas para debatir y mirada crítica sobre el impacto.',
        cta: 'Visitar perfil',
        ctaAria: 'Abrir el perfil de Alexis en X en una nueva pestaña',
        avatarAlt: 'Foto de perfil de Alexis en X',
      },

      'AI Portfolio Assistant': 'AI Portfolio Assistant',
      '¡Hola! Soy tu AI Portfolio Assistant. ¿En qué puedo ayudarte hoy?':
        '¡Hola! Soy tu AI Portfolio Assistant. ¿En qué puedo ayudarte hoy?',
      'Escribe un mensaje...': 'Escribe un mensaje...',
      'Enviar mensaje': 'Enviar mensaje',
      'Limpiar chat': 'Limpiar chat',
      'Cerrar chat': 'Cerrar chat',
      Conectado: 'Conectado',
      Conectando: 'Conectando',
      Desconectado: 'Desconectado',
      Desconocido: 'Desconocido',

      home: 'Inicio',
      projects: 'Proyectos',
      experience: 'Proyectos',
      skills: 'Habilidades',
      contact: 'Contacto',

      contactText:
        '¿Quieres trabajar juntos? ¿Tienes un proyecto en mente? ¡No dudes en contactarme a alexisleonelvedia@gmail.com o usando el formulario!',
      name: 'Nombre',
      email: 'Correo electrónico',
      message: 'Mensaje',
      subject: 'Asunto',
      send: 'Enviar Mensaje',
      sending: 'Enviando...',
      messageSent: '¡Mensaje enviado con éxito! Te responderé pronto.',
      messageError: 'Hubo un error al enviar tu mensaje. Por favor, intenta de nuevo.',

      namePlaceholder: 'Ej: Steve Jobs',
      emailPlaceholder: 'ejemplo@ejemplo.com',
      messagePlaceholder: 'Escribe un mensaje...',
      subjectPlaceholder: 'Ej: Necesito ayuda para mejorar Siri',

      yourName: 'Tu Nombre',
      allRightsReserved: 'Todos los Derechos Reservados',

      navbar: {
        home: 'Inicio',
        about: 'Sobre Mí',
        projects: 'Proyectos',
        resume: 'Currículum',
        services: 'Servicios',
        xcons: 'XCONS',
        xcons2: 'XCONS 2',
        fusionads: 'FusionAds',
        bandit: 'Bandit',
        otros: 'Otros Proyectos',
      },

      tooltip: {
        github: 'Visitar Perfil de GitHub',
        linkedin: 'Visitar Perfil de LinkedIn',
        x: 'Visitar Perfil de X',
        toggleTheme: 'Cambiar Tema',
        selectLanguage: 'Seleccionar Idioma',
        viewOriginal: 'Ver imagen original en nueva pestaña',
        copyEmail: 'Copiar correo al portapapeles',
        copied: '¡Copiado!',
      },

      documentLinksTitle: 'Defensa de la propuesta',

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

      testimonialsTitle: 'Testimonios',
      testimonials: {
        jorge:
          '"Durante los 2 años que prestó servicios para XCONS, Alexis fue una persona muy proactiva, siempre haciendo más de lo que se pedía, con ambición de aprender y superarse."',
        mauro:
          '"Alexis empezó como una persona y terminó como otra en su proceso en Fusion. Sin duda en poco tiempo se adaptó, aprendió y se superó a sí mismo. Nos fue de gran ayuda en tiempos muy acelerados de implementación, y su conocimiento en diseño nos ahorró horas de entendimiento con el equipo de diseñadores."',
        milena:
          '"Siempre que debo trabajar con algún cliente nuevo pienso en Alexis, y en cómo podría servirme su ayuda. Es una persona que está a la vanguardia. ¡Recomendadísimo!"',
        kodi: '"A Alexis lo conocí por contacto con Mile. Realizó una primer propuesta de rediseño de mi app sin habérselo pedido. Ahí me di cuenta que debía trabajar con él. Trabajamos en conjunto durante horas, y no dudaba nunca en decirme que algo no iba por buen camino. Además me hizo conocer muchas herramientas, ¡un genio!"',
      },
      viewOriginalButton: 'Ver Original',
      openOriginalTitle: 'Abrir imagen original en nueva pestaña',
      companyDescriptions: {
        xcons:
          'Plataforma de e-commerce especializada en la venta omnicanal de materiales de construcción.',
        fusionads:
          'Plataforma de publicidad generativa impulsada por IA que crea anuncios profesionales omnicanal.',
        bandit:
          'Plataforma enfocada en la gestión de giras y conciertos en vivo para artistas y managers.',
        otros: 'Diversos proyectos personales y profesionales en desarrollo.',
      },
      bandit: {
        experience: {
          tasks: 'Tareas',
          tools: 'Herramientas',
          results: 'Resultados',
        },
      },

      services: {
        title: 'Servicios',
        subtitle:
          'Soluciones integrales desde el diseño hasta el desarrollo, con enfoque en experiencia de usuario y tecnología de vanguardia.',
        frontend: {
          title: 'Desarrollo Frontend',
          description:
            'Aplicaciones web modernas y escalables con React, TypeScript y las últimas tecnologías. Enfoque en rendimiento, accesibilidad y experiencia de usuario.',
        },
        design: {
          title: 'Diseño UX/UI',
          description:
            'Diseño centrado en el usuario con prototipado avanzado en Figma. Research de usuarios, testing de usabilidad y creación de librerías de componentes.',
        },
        automation: {
          title: 'Automatización e Integración',
          description:
            'Automatización de flujos de trabajo con n8n, integraciones de APIs y soluciones de web scraping. Optimización de procesos empresariales.',
        },
        ai: {
          title: 'Integración de IA',
          description:
            'Implementación de soluciones de IA con LLMs, prompt engineering avanzado y desarrollo de flujos de trabajo inteligentes.',
        },
        wordpress: {
          title: 'Desarrollo WordPress',
          description:
            'Soluciones WordPress personalizadas con desarrollo de temas, personalización de plugins e integración WooCommerce. Optimización de rendimiento y SEO.',
        },
      },
    },
  },
};

const getDefaultLanguage = () => {
  const savedLanguage = localStorage.getItem('i18nextLng');
  if (savedLanguage && (savedLanguage.startsWith('es') || savedLanguage.startsWith('en'))) {
    return savedLanguage.startsWith('es') ? 'es' : 'en';
  }

  const browserLang = navigator.language;
  return browserLang && browserLang.startsWith('es') ? 'es' : 'en';
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: getDefaultLanguage(),
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  });

i18n.on('languageChanged', lng => {
  localStorage.setItem('i18nextLng', lng);
});

export default i18n;
