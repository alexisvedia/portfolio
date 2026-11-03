// Copy de la home de afiches. Solo en español, por pedido de Alexis (2026-11-03): la página fija `lng: 'es'`.
// Los textos que ya existían en staging se leen de i18n (`landing.*`, `testimonials.*`); acá va lo nuevo.
// Cifras contadas el 2026-11-03.

export const INK = {
  ground: '#0d0c0b',
  cream: '#efe6c8',
  red: '#e63b3f',
  teal: '#11808e',
  lime: '#c8df2a',
  blue: '#1f86c6',
  orange: '#ee7a2b',
  violet: '#8a5cc4',
} as const;

export const NAV = [
  { id: 'about', label: 'Manifiesto' },
  { id: 'experience', label: 'Trayectoria' },
  { id: 'cubiq', label: 'Cubiq' },
  { id: 'services', label: 'Servicios' },
  { id: 'contact', label: 'Contacto' },
];

export const HERO = {
  name: 'Alexis Vedia',
  role: 'Ingeniero de IA y diseñador de producto',
  line: 'Diseño interfaces, las programo y armo los sistemas de IA que las mantienen andando.',
  ctaPrimary: 'Escribime',
  ctaSecondary: 'Ver el recorrido',
  place: 'Argentina, GMT-3. Trabajo remoto.',
};

export interface Stop {
  years: string;
  company: string;
  role: string;
  text: string;
  to?: string;
  anchor?: string;
  linkLabel: string;
}

export const ROUTE: Stop[] = [
  {
    years: '2022 a 2024',
    company: 'XCONS',
    role: 'Diseño UI/UX y QA',
    text: 'E-commerce omnicanal de materiales de construcción. Interfaces web y mobile, bibliotecas de componentes y sitios en WordPress, Magento y HubSpot. También las pruebas manuales de cada entrega.',
    to: '/xcons',
    linkLabel: 'Ver el caso XCONS',
  },
  {
    years: '2024 a 2025',
    company: 'FusionAds.ai',
    role: 'Desarrollo frontend',
    text: 'Publicidad generativa con IA. Funcionalidades en React y TypeScript, consumo de APIs REST y formularios complejos validados con Zod y React Hook Form.',
    to: '/fusionads',
    linkLabel: 'Ver el caso FusionAds',
  },
  {
    years: '2025',
    company: 'Bandit',
    role: 'Diseño UI/UX',
    text: 'Gestión de giras para artistas y managers. Prototipos de alta fidelidad en Figma validados con user testing y componentes nuevos para el design system.',
    to: '/bandit',
    linkLabel: 'Ver el caso Bandit',
  },
  {
    years: 'Desde 2025',
    company: 'Cubiq Digital',
    role: 'AI Engineer',
    text: 'Automatización con IA para productos B2B: workflows de n8n en producción, agentes y frontend en React. Y el sistema que conecta todo eso, contado más abajo.',
    anchor: 'cubiq',
    linkLabel: 'Leer la historia',
  },
];

export const STUDY =
  'Formación: Diplomatura en Desarrollo Web Frontend en la UTN FRC (2025) y certificaciones de Vanderbilt, DeepLearning.AI, Meta (Front-End) y Google (UX).';

export const OTHERS = { to: '/otros', label: 'Otros proyectos' };

export interface Stat {
  value: string;
  label: string;
}

export interface Beat {
  title: string;
  text: string;
  stats?: Stat[];
}

export const CUBIQ = {
  intro:
    'Una startup chica que vende IA y automatizaciones a empresas. Cuando llegué, las herramientas estaban pensadas para una sola persona y había que crecer sin sumar suscripciones.',
  beats: [
    {
      title: 'El problema',
      text: 'Los pedidos entraban por cinco canales distintos. Los workflows se editaban sobre copias viejas, los mismos errores de n8n volvían y lo dicho en una reunión dependía de que alguien lo anotara.',
    },
    {
      title: 'La memoria',
      text: 'Un grabador propio que transcribe las reuniones y separa quién dijo qué. Un registro de errores que se vuelve regla y vuelve solo al contexto antes de tocar n8n: una capa propia sobre n8nac, una CLI open source. Y una traza de cada cambio en producción.',
      stats: [
        { value: '417', label: 'reuniones transcriptas, 187,5 horas' },
        { value: '99', label: 'reglas aprendidas de errores reales' },
        { value: '490', label: 'cambios trazados en 37 workflows' },
      ],
    },
    {
      title: 'El sistema nervioso',
      text: 'Un servidor propio, siempre encendido. Encima, un chat interno self-hosted con tablero, diseño, estado de los bots y 6 agentes especializados. Y un dispatcher que lee cada canal y reparte los pedidos entre sesiones de IA.',
      stats: [
        { value: '4.811', label: 'mensajes repartidos por el dispatcher (incluye proyectos propios)' },
        { value: '7', label: 'bots corriendo en el chat del equipo' },
      ],
    },
    {
      title: 'El resultado',
      text: 'Conversación, tareas, diseños y bots en un solo lugar, con datos propios. Los agentes operan las mismas tarjetas que las personas y cada falla de un workflow llega sola a una sala del chat.',
      stats: [
        { value: '144', label: 'tarjetas en 25 días, 68 creadas por un agente' },
        { value: '29', label: 'workflows a mi cargo, 18 en producción' },
      ],
    },
  ] as Beat[],
  note: 'Cifras contadas el 2026-11-03. Sin nombres de clientes ni datos internos.',
};

export const VOICES = [
  { key: 'mauro', name: 'Mauro', role: 'CTO en Fusion AI' },
  { key: 'jorge', name: 'Jorge', role: 'CTO en XCONS' },
  { key: 'kodi', name: 'Kodi', role: 'CEO en Bandit' },
  { key: 'milena', name: 'Milena', role: 'Especialista digital' },
] as const;

export const CONTACT = {
  lead: 'Si tenés un producto para diseñar, un proceso para automatizar o un equipo que necesita IA que funcione, escribime.',
  email: 'alexisleonelvedia@gmail.com',
  links: [
    { href: 'https://www.linkedin.com/in/alexis-vedia/', label: 'LinkedIn' },
    { href: 'https://github.com/AlexisVedia', label: 'GitHub' },
    { href: 'https://x.com/AlexisVedia', label: 'X' },
  ],
  footer: 'Alexis Vedia, 2026. Diseñado y programado a mano.',
};
