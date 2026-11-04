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

export const FONT = {
  display: `'Morganite', 'Arial Narrow', sans-serif`,
  text: `'NHaas', 'Helvetica Neue', Arial, sans-serif`,
} as const;

export const NAV = [
  { id: 'about', label: 'Manifiesto' },
  { id: 'experience', label: 'Trayectoria' },
  { id: 'cubiq', label: 'Cubiq' },
  { id: 'stack', label: 'Stack de IA' },
  { id: 'services', label: 'Servicios' },
  { id: 'contact', label: 'Contacto' },
];

export const HERO = {
  name: 'Alexis Vedia',
  role: 'Ingeniero de IA y diseñador de producto',
  line: 'Diseño interfaces, las programo y armo los sistemas de IA que las mantienen andando.',
  ctaPrimary: 'Escribime',
  ctaSecondary: 'Ver el recorrido',
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

export const ROUTE_LEAD = 'Cuatro paradas: del diseño de interfaces a la IA que las opera.';

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

/* Testimonio destacado, puesto como mensaje en el chat del equipo. */
export const TEAM_VOICE = {
  name: 'Sabri',
  role: 'Cubiq Digital',
  room: 'equipo',
  time: '18:42',
  text: 'Desde que Alexis armó el chat interno, una reunión termina y las tareas ya están cargadas. Nos ordenó a todos y nos hizo trabajar con IA de verdad, no como experimento.',
  reactions: [
    { emoji: '🔥', count: 4 },
    { emoji: '🙌', count: 3 },
  ],
} as const;

/* Stack de IA: lo que tengo armado para trabajar con agentes. Cifras contadas en una sola máquina. */
export const AI_STACK = {
  intro:
    'No uso un chat de IA: armé el entorno donde trabajan los agentes. Varios modelos, las mismas reglas para todos, memoria que no se pierde entre sesiones y tres máquinas conectadas.',
  blocks: [
    {
      title: 'Agentes de código',
      text: 'Claude Code, Codex, OpenCode y pi. Claude Code, Codex y pi leen el mismo archivo de reglas: lo que aprende uno lo saben todos.',
      tools: ['Claude Code', 'Codex', 'OpenCode', 'pi'],
    },
    {
      title: 'Harness',
      text: 'El agente no arranca de cero. Hooks que frenan comandos peligrosos y afirmaciones sin respaldo, skills que cargan el método de cada tarea y sub-agentes para el trabajo en paralelo.',
      stats: [
        { value: '40', label: 'hooks en 12 eventos del ciclo de vida' },
        { value: '75', label: 'skills instaladas' },
        { value: '10', label: 'sub-agentes especializados' },
      ],
    },
    {
      title: 'MCPs y herramientas',
      text: 'El agente opera lo mismo que yo: navegador de QA, diseño en Figma, workflows de n8n, analítica, documentación de librerías y las otras máquinas por SSH.',
      stats: [
        { value: '14', label: 'servidores MCP conectados' },
        { value: '15', label: 'plugins, 3 hechos por mí' },
      ],
    },
    {
      title: 'Memoria permanente',
      text: 'Un vault de Obsidian como memoria compartida entre agentes y máquinas, con búsqueda semántica por embeddings. Cada regla nace de un error real y vuelve sola al contexto cuando el tema aparece.',
      stats: [
        { value: '105', label: 'documentos de reglas y procedimientos' },
      ],
    },
    {
      title: 'Contexto y caché',
      text: 'La ventana de contexto se administra: un reloj del caché del prompt en la barra de estado (tiempo hasta que se enfría, aciertos y fallos), compactación guiada que conserva lo literal y un proxy que recorta la salida de los comandos antes de que entre al contexto.',
    },
    {
      title: 'Tres máquinas',
      text: 'Dos Windows y un servidor Linux conectados por Tailscale. herdr abre y sigue las sesiones de agentes en cualquiera de las tres, y las reglas, docs y skills se sincronizan entre todas.',
      tools: ['herdr', 'Tailscale', 'SSH'],
    },
  ],
  skills: ['RAG', 'Embeddings', 'PGVector', 'Búsqueda semántica', 'Agentes con herramientas', 'MCP', 'Multi-agente', 'Prompt caching', 'Compactación de contexto', 'Evals', 'n8n'],
  case: {
    title: 'Chat de soporte con RAG',
    text: 'Para una plataforma SaaS de retail: ingiere la documentación del equipo, la guarda como embeddings en PGVector y responde con la captura del paso que explica.',
  },
  note: 'Cifras contadas el 2026-11-03 en una de las tres máquinas.',
};

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
