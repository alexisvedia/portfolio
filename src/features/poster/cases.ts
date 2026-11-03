// Casos de estudio con el lenguaje de afiches. El contenido sale de las páginas viejas
// (`features/xcons`, `features/bandit`, `features/fusionads`), recortado y en español.
import { INK } from './content';
import xconsLogo from '@/assets/images/projects/XCONS.svg';
import fusionLogo from '@/assets/images/projects/Fusionads.svg';
import banditLogo from '@/assets/images/projects/Bandit.svg';
import xconsHome from '@/assets/poster/xcons-home.webp';
import fusionApp from '@/assets/poster/fusion-app.webp';
import banditHome from '@/assets/poster/bandit-home.webp';
import xRediseno from '@/assets/poster/cases/xcons-redisenoxcons.webp';
import xComercial from '@/assets/poster/cases/xcons-comercial.webp';
import xFerreyra from '@/assets/poster/cases/xcons-ferreyra.webp';
import xOsvaldo from '@/assets/poster/cases/xcons-osvaldo.webp';
import xSpline from '@/assets/poster/cases/xcons-spline.webp';
import xCamion from '@/assets/poster/cases/xcons-camion.webp';
import xRrss from '@/assets/poster/cases/xcons-rrss.webp';
import bHome from '@/assets/poster/cases/bandit-nueva-home.webp';
import bCalendar from '@/assets/poster/cases/bandit-calendar-redesign.webp';
import bComponents from '@/assets/poster/cases/bandit-nuevos-componentes.webp';
import bOnboarding from '@/assets/poster/cases/bandit-nuevo-onboarding.webp';
import bModals from '@/assets/poster/cases/bandit-modales-informativos.webp';
import fGallery from '@/assets/poster/cases/fusion-fusion-campaign-template-gallery.webp';
import fFirst from '@/assets/poster/cases/fusion-fusion-first-step.webp';
import fDirections from '@/assets/poster/cases/fusion-fusion-design-directions.webp';
import fPublish from '@/assets/poster/cases/fusion-fusion-publish-flow.webp';
import fInternal from '@/assets/poster/cases/fusion-internal-templates.webp';
import fRouter from '@/assets/poster/cases/fusion-react-router.webp';
import fProposal from '@/assets/poster/cases/fusion-fusion-propuesta.webp';
import vGallery from '@/assets/Proyectos Fusion/Gallery.mp4';
import vFirst from '@/assets/Proyectos Fusion/Primer step.mp4';
import vDirections from '@/assets/Proyectos Fusion/Design Directions.mp4';
import vPublish from '@/assets/Proyectos Fusion/Publicar.mp4';

export type CaseSlug = 'xcons' | 'fusionads' | 'bandit';

export interface Piece {
  title: string;
  text: string;
  src: string;
  w: number;
  h: number;
  /** Video que reemplaza a la captura mientras la pieza está en pantalla. */
  video?: string;
}

export interface Case {
  slug: CaseSlug;
  name: string;
  /** Palabra del alfabeto construido y sus columnas, como un bloque de kanji. */
  word: string;
  cols: number;
  years: string;
  role: string;
  lead: string;
  accent: string;
  logo: string;
  hero: { src: string; w: number; h: number; alt: string };
  tasks: string[];
  tools: string[];
  results: { big: string; text: string }[];
  pieces: Piece[];
  next: CaseSlug;
}

export const CASES: Record<CaseSlug, Case> = {
  xcons: {
    slug: 'xcons',
    name: 'XCONS',
    word: 'XCONS',
    cols: 3,
    years: 'Nov. 2022 a may. 2024',
    role: 'Diseño UI/UX y QA',
    lead: 'E-commerce omnicanal de materiales de construcción. Diseñé sus interfaces, armé el sitio comercial y probé sus flujos con casos de prueba.',
    accent: INK.lime,
    logo: xconsLogo,
    hero: { src: xconsHome, w: 1400, h: 788, alt: 'Home del e-commerce de XCONS con el cotizador que consulta varios corralones a la vez' },
    tasks: [
      'Interfaces web y mobile para la plataforma y para la tienda de cada cliente.',
      'Bibliotecas de componentes UI ordenadas para el equipo.',
      'El sitio comercial: de Figma a WordPress, migrado desde HubSpot.',
      'Flujos probados, casos de prueba y UI validada con los desarrolladores.',
    ],
    tools: ['Figma', 'Photoshop', 'Illustrator', 'After Effects', 'Blender', 'Spline', 'Clarity', 'HubSpot', 'WordPress', 'Magento', 'JavaScript'],
    results: [
      { big: '+10', text: 'e-commerce diseñados para clientes de LATAM' },
      { big: '1', text: 'plataforma que unifica varios e-commerce' },
      { big: 'UX', text: 'mejoras basadas en los datos de Clarity' },
    ],
    pieces: [
      { title: 'Rediseño de la plataforma', text: 'Una propuesta apoyada en la familiaridad y la ley de Prägnanz.', src: xRediseno, w: 1400, h: 2934 },
      { title: 'Sitio comercial', text: 'Primero en Figma; después, plantillas y módulos migrados de HubSpot a WordPress.', src: xComercial, w: 1400, h: 1182 },
      { title: 'E-commerce Ferreyra', text: 'Propuesta de tienda aprobada por el cliente.', src: xFerreyra, w: 1400, h: 3286 },
      { title: 'E-commerce Osvaldo Gonzalez', text: 'Cada recurso visual hecho desde cero con la marca del distribuidor.', src: xOsvaldo, w: 1400, h: 3946 },
      { title: 'Escena 3D', text: 'Hecha en Spline para la web comercial. Puede reaccionar al scroll y al mouse.', src: xSpline, w: 1400, h: 788 },
      { title: 'Banners de cada tienda', text: 'Retocados en Photoshop con el material que mandaba cada cliente, a veces en baja calidad.', src: xCamion, w: 1309, h: 1253 },
      { title: 'Piezas para redes', text: 'Imágenes y videos junto al equipo de marketing.', src: xRrss, w: 559, h: 559 },
    ],
    next: 'fusionads',
  },
  fusionads: {
    slug: 'fusionads',
    name: 'FusionAds.ai',
    word: 'FUSION',
    cols: 3,
    years: 'May. 2024 a mar. 2025',
    role: 'Desarrollo frontend',
    lead: 'Publicidad generativa con IA. Programé en React y TypeScript los flujos para armar, generar y publicar una campaña.',
    accent: INK.orange,
    logo: fusionLogo,
    hero: { src: fusionApp, w: 1400, h: 788, alt: 'Galería de plantillas de FusionAds.ai para elegir los diseños de una campaña' },
    tasks: [
      'Componentes en React y TypeScript sobre código legacy.',
      'Formularios dinámicos validados con Zod.',
      'Integraciones con APIs REST, Google Drive y Facebook.',
      'Rutas y accesos según el estado de cada usuario.',
    ],
    tools: ['React', 'TypeScript', 'Zod', 'Context API', 'React Router', 'Vite', 'Google Drive API', 'Facebook API', 'Postman', 'MongoDB'],
    results: [
      { big: 'Legacy', text: 'código mantenido y unido a las funciones nuevas' },
      { big: 'UX', text: 'formularios, modales y flujos de campaña más claros' },
      { big: 'Front', text: 'más rendimiento con código y estado mejor manejados' },
    ],
    pieces: [
      { title: 'Galería de plantillas', text: 'Categorías y filtros que llegan del backend. Las plantillas siguen la industria de cada cuenta.', src: fGallery, w: 1400, h: 783, video: vGallery },
      { title: 'Scrape y armado de campaña', text: 'Con una URL se completa el formulario, con skeletons mientras llegan los datos.', src: fFirst, w: 1400, h: 783, video: vFirst },
      { title: 'Direcciones de diseño', text: 'Un resumen de la campaña generado al momento y una carga propia para cada dirección.', src: fDirections, w: 1400, h: 783, video: vDirections },
      { title: 'Publicación', text: 'Antes de publicar revisa las redes conectadas y deja integrarlas en el mismo paso.', src: fPublish, w: 1400, h: 788, video: vPublish },
      { title: 'Plantillas internas', text: 'Los diseñadores suben plantillas y quedan ordenadas en Google Drive por su API.', src: fInternal, w: 1400, h: 788 },
      { title: 'Rutas por estado', text: 'Login, verificación o dashboard según la sesión y el token de cada usuario.', src: fRouter, w: 1400, h: 788 },
      { title: 'La propuesta con la que me postulé', text: 'Un rediseño de UX/UI que mandé por mail antes de entrar.', src: fProposal, w: 1400, h: 774 },
    ],
    next: 'bandit',
  },
  bandit: {
    slug: 'bandit',
    name: 'Bandit',
    word: 'BANDIT',
    cols: 3,
    years: 'Feb. a jun. 2025',
    role: 'Diseño UI/UX',
    lead: 'Gestión de giras para artistas y managers. Rediseñé la plataforma sección por sección, mirando sesiones de usuarios reales.',
    accent: INK.blue,
    logo: banditLogo,
    hero: { src: banditHome, w: 1400, h: 788, alt: 'Home rediseñada de Bandit con los artistas y las giras en curso' },
    tasks: [
      'Propuestas de rediseño para cada sección de la plataforma.',
      'Investigación de la competencia y de sesiones reales en Clarity.',
      'Componentes reutilizables nuevos.',
      'El arranque de la versión mobile.',
    ],
    tools: ['Figma', 'Clarity', 'Photoshop', 'User testing'],
    results: [
      { big: 'UX', text: 'una experiencia general mejor en toda la plataforma' },
      { big: 'Menos', text: 'carga cognitiva, visual y motora para cada usuario' },
      { big: '?', text: 'menos preguntas sobre las funciones básicas' },
    ],
    pieces: [
      { title: 'Nueva home', text: 'Muestra primero el estado de las giras y lleva directo a las tareas de todos los días.', src: bHome, w: 1400, h: 1011 },
      { title: 'Calendario', text: 'El corazón de la plataforma: eventos más legibles y más rápidos de crear y editar.', src: bCalendar, w: 1400, h: 809 },
      { title: 'Componentes nuevos', text: 'Un selector que mezcla rangos y fechas sueltas, y modales para crear eventos rápido.', src: bComponents, w: 1400, h: 941 },
      { title: 'Onboarding', text: 'Presenta Bandit de a poco, según el rol de cada usuario.', src: bOnboarding, w: 1400, h: 963 },
      { title: 'Modales informativos', text: 'Guían por las funciones más complejas y anuncian lo nuevo.', src: bModals, w: 1253, h: 837 },
    ],
    next: 'xcons',
  },
};

export const CASE_PATH: Record<CaseSlug, string> = { xcons: '/xcons', fusionads: '/fusionads', bandit: '/bandit' };
