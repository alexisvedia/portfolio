import { ExperienceCardProps } from '../components/Experiences/ExperienceCard';

type ExperienceData = Omit<ExperienceCardProps, 'language'>;

// Datos para experiencias de Marketing
export const marketingExperiences: {
  es: ExperienceData[];
  en: ExperienceData[];
} = {
  es: [
    {
      title: 'Diseño de Interfaces y UX',
      period: 'nov. 2022 - may. 2024',
      role: 'UI/UX Designer',
      tasks: [
        'Diseño de interfaces gráficas para desktop y móvil',
        'Creación y organización de bibliotecas de componentes UI',
        'Diseño de piezas para redes sociales',
        'Diseño 3D y edición de videos (Premiere/After Effects)',
        'Diseño y maquetado de la web comercial (HubSpot → WordPress)',
        'Análisis de interacción con Clarity (cards de producto, home)',
        'Propuestas de mejora basadas en análisis de datos'
      ],
      tools: ['Figma', 'Photoshop', 'Clarity', 'HubSpot', 'WordPress', 'Premiere', 'After Effects'],
      results: [
        'Mejora en la experiencia de usuario basada en datos de Clarity',
        'Implementación exitosa de nuevos componentes UI',
        'Migración completa de HubSpot a WordPress'
      ],
      images: [
        '/images/projects/xcons/marketing1.jpg',
        '/images/projects/xcons/marketing2.jpg'
      ]
    }
  ],
  en: [
    {
      title: 'Interface Design and UX',
      period: 'Nov 2022 - May 2024',
      role: 'UI/UX Designer',
      tasks: [
        'Design of graphic interfaces for desktop and mobile',
        'Creation and organization of UI component libraries',
        'Design of social media assets',
        '3D design and video editing (Premiere/After Effects)',
        'Design and layout of the commercial website (HubSpot → WordPress)',
        'Interaction analysis with Clarity (product cards, home)',
        'Improvement proposals based on data analysis'
      ],
      tools: ['Figma', 'Photoshop', 'Clarity', 'HubSpot', 'WordPress', 'Premiere', 'After Effects'],
      results: [
        'Improved user experience based on Clarity data',
        'Successful implementation of new UI components',
        'Complete migration from HubSpot to WordPress'
      ],
      images: [
        '/images/projects/xcons/marketing1.jpg',
        '/images/projects/xcons/marketing2.jpg'
      ]
    }
  ]
};

// Datos para experiencias de Operaciones
export const operationsExperiences: {
  es: ExperienceData[];
  en: ExperienceData[];
} = {
  es: [
    {
      title: 'Garantía de Calidad y Desarrollo Front-end',
      period: 'nov. 2022 - may. 2024',
      role: 'Especialista en garantía de calidad y front-end',
      tasks: [
        'Reuniones con clientes para relevamiento de requerimientos',
        'Research y análisis de recursos',
        'Implementación de propuestas en Magento (HTML/CSS/JS)',
        'Rediseño del sitio general que agrupa todos los e-commerce',
        'Testeo de flujos de usuario',
        'Creación y ejecución de test cases',
        'Validación de UI junto a desarrolladores'
      ],
      tools: ['Magento', 'HTML', 'CSS', 'JavaScript', 'Git'],
      results: [
        'Mejora en la calidad del código y rendimiento del sitio',
        'Optimización de flujos de usuario',
        'Unificación exitosa de múltiples e-commerce bajo una misma plataforma'
      ],
      images: [
        '/images/projects/xcons/operations1.jpg',
        '/images/projects/xcons/operations2.jpg'
      ]
    }
  ],
  en: [
    {
      title: 'Quality Assurance and Front-end Development',
      period: 'Nov 2022 - May 2024',
      role: 'Quality Assurance and Front-end Specialist',
      tasks: [
        'Client meetings for requirement gathering',
        'Resource research and analysis',
        'Implementation of proposals in Magento (HTML/CSS/JS)',
        'Redesign of the general site that groups all e-commerce platforms',
        'User flow testing',
        'Creation and execution of test cases',
        'UI validation with developers'
      ],
      tools: ['Magento', 'HTML', 'CSS', 'JavaScript', 'Git'],
      results: [
        'Improved code quality and site performance',
        'Optimization of user flows',
        'Successful unification of multiple e-commerce sites under one platform'
      ],
      images: [
        '/images/projects/xcons/operations1.jpg',
        '/images/projects/xcons/operations2.jpg'
      ]
    }
  ]
}; 