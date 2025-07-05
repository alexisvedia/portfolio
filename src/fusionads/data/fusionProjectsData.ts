import { MasonryItem } from '../components/MasonryFusion';


import fusionAppThumbnail from '../../assets/Proyectos Fusion/fusion-app.png';
import fusionDesignDirectionsThumbnail from '../../assets/Proyectos Fusion/fusion-design-directions.png';
import fusionFirstStepThumbnail from '../../assets/Proyectos Fusion/fusion-first-step.png';
import fusionPublishFlowThumbnail from '../../assets/Proyectos Fusion/fusion-publish-flow.png';
import fusionCampaignTemplateGalleryThumbnail from '../../assets/Proyectos Fusion/fusion-campaign-template-gallery.png';
import internalTemplatesThumbnail from '../../assets/Proyectos Fusion/internal templates.png';
import reactRouterThumbnail from '../../assets/Proyectos Fusion/react router.png';
import fusionPropuestaThumbnail from '../../assets/Proyectos Fusion/fusion-propuesta.png';


import galleryVideo from '../../assets/Proyectos Fusion/Gallery.mp4';
import designDirectionsVideo from '../../assets/Proyectos Fusion/Design Directions.mp4';
import firstStepVideo from '../../assets/Proyectos Fusion/Primer step.mp4';
import publishVideo from '../../assets/Proyectos Fusion/Publicar.mp4';
import campaignTemplateGalleryVideo from '../../assets/Proyectos Fusion/Template gallery campaña.mp4';

export const fusionProjectsData: MasonryItem[] = [
  {
    id: 'fusion-gallery-video',
    image: fusionAppThumbnail,
    video: galleryVideo,
    height: 400,
    title: {
      es: "Template Gallery",
      en: "Template Gallery",
    },
    description: {
      es: "Introduje una serie de categorías visuales. Al hacer clic en una, los ejemplos de templates cambiaban al instante, mostrando solo los relacionados con ese tema. Estos templates se muestran en función a la industria que tiene configurada la cuenta, haciendo que sean personalizados para cada usuario. Desarrollé una galería que se abría al seleccionar un template. Aquí, los usuarios podían refinar su búsqueda con opciones como el tipo de industria, el estilo del diseño o la temporada. Con cada elección, la lista de templates se actualizaba automáticamente, indicando siempre los filtros activos. Un aspecto clave es que toda esta información –las categorías disponibles, los filtros y las propias plantillas– era consumida dinámicamente desde el backend.",
      en: "I introduced a series of visual categories. Clicking on one would instantly change the template examples, showing only those related to that theme. These templates are displayed based on the industry configured for the account, making them personalized for each user. I developed a gallery that opened when a template was selected. Here, users could refine their search with options like industry type, design style, or season. With each choice, the list of templates updated automatically, always indicating the active filters. A key aspect is that all this information – available categories, filters, and the templates themselves – was dynamically consumed from the backend.",
    },
  },
  {
    id: 'fusion-first-step',
    image: fusionFirstStepThumbnail,
    video: firstStepVideo,
    height: 400,
    title: {
      es: "Scrape y flujo de campaña",
      en: "Scrape and Campaign Flow",
    },
    description: {
      es: "Integré la funcionalidad de scrape automático en base a una URL para completar todos los campos del form según la información scrapeada, añadiendo loadings y skeletons hasta obtener los datos. Listé todos los productos o servicios y agregué un panel de edición para la información de los mismos, dónde previamente solo teníamos \"catálogos\" y realicé la implementación para separar \"productos\" de \"servicios\" trabajando con legacy code. Este modal se reutliza en otras áreas de la aplicación y los campos se renderizan dinámicamente y son obligatorios o no en función al tipo de dato que le llegue. Apliqué un debounce para evitar bugs visuales en la selección de múltiples redes sociales donde se realizaría la publicación. Además, cree la función del stepper que leía cada paso y se actualizaba a medida que el user avanzaba, desbloqueando nuevas secciones.",
      en: "I integrated an automatic scraping functionality based on a URL to complete all form fields according to the scraped information, adding loadings and skeletons until the data was obtained. I listed all products or services and added an editing panel for their information, where previously we only had \"catalogs,\" and I implemented the separation of \"products\" from \"services\" working with legacy code. This modal is reused in other areas of the application, and the fields are dynamically rendered and are mandatory or not based on the type of data received. I applied a debounce to avoid visual bugs in the selection of multiple social networks where the publication would be made. Additionally, I created the stepper function that read each step and updated as the user progressed, unlocking new sections.",
    },
  },
  {
    id: 'fusion-campaign-template-gallery',
    image: fusionCampaignTemplateGalleryThumbnail,
    video: campaignTemplateGalleryVideo,
    height: 400,
    title: {
      es: "Template Gallery en campaña",
      en: "In-Campaign Template Gallery",
    },
    description: {
      es: "Reutilizando el mismo modal que en la home, con la información scrapeada de la campaña hice que se muestren diferentes templates en función a un score para matchear mejor con el tipo de campaña. Como la información de cada template se iba construyendo parcialmente mediante processcallback, agregué una animación de carga mientras los textos e imágenes se iban completando hasta obtener el template final en status generated. Ningún template no completado se podía seleccionar y el botón de generar diseños está deshabilitado si alguno de los seleccionados sigue en estado pendiente. Para hacer pruebas, únicamente en entorno staging, agregué un botón para copiar executions ids de manera fácil para debuggear los templates que fallaban.",
      en: "Reusing the same modal as on the homepage, with the scraped campaign information, I made different templates display based on a score to better match the campaign type. As the information for each template was partially built via processcallback, I added a loading animation while the texts and images were completed until the final template reached 'generated' status. No incomplete template could be selected, and the 'generate designs' button is disabled if any of the selected ones are still in a pending state. For testing purposes, only in the staging environment, I added a button to easily copy execution IDs to debug failing templates.",
    },
  },
  {
    id: 'fusion-design-directions',
    image: fusionDesignDirectionsThumbnail,
    video: designDirectionsVideo,
    height: 400,
    title: {
      es: "Direcciones de Diseño",
      en: "Design Directions",
    },
    description: {
      es: "Al pasar al step 2, integré EPs internos que permitían generar un breve resumen de la campaña. Apliqué skeletons a cada sección, diseñe un mock para la carga previa de cada dirección de diseño. Además, integré un auto assign al botón de agregar diseño.",
      en: "Upon moving to step 2, I integrated internal EPs that allowed generating a brief summary of the campaign. I applied skeletons to each section and designed a mock for the pre-loading of each design direction. Additionally, I integrated an auto-assign feature to the 'add design' button.",
    },
  },
  {
    id: 'fusion-publish-flow',
    image: fusionPublishFlowThumbnail,
    video: publishVideo,
    height: 400,
    title: {
      es: "Publicación e Integraciones",
      en: "Publishing and Integrations",
    },
    description: {
      es: "Al intentar publicar, agregué una validación para comprobar si el user estaba conectado a las redes sociales que previamente seleccionó en el paso 1. Si no lo estaba, un módulo que permite la integración opcional se hace visible. Luego la integración se puede guardar y se realiza la publicación. Al lanzar la campaña hice que la información que el backend envía se muestre de manera clara al usuario para que sepa el estado y cómo accionar si algo ocurrió mal.",
      en: "When attempting to publish, I added a validation to check if the user was connected to the social networks previously selected in step 1. If not, a module allowing optional integration becomes visible. Then the integration can be saved, and the publication is made. Upon launching the campaign, I ensured that the information sent by the backend is clearly displayed to the user, so they know the status and how to act if something went wrong.",
    },
  },
  {
    id: 'fusion-internal-templates-system',
    image: internalTemplatesThumbnail,

    height: 400,
    title: {
      es: "Sistema de Templates Internos",
      en: "Internal Templates System",
    },
    description: {
      es: "Cree una sección interna para los diseñadores del equipo donde podían subir y configurar los templates que realizaban y guardar automáticamente y separados por carpeta, nombre, fecha e industria dentro de un Google Drive utilizando su API. Esto permitia subir rápidamente nuevos templates y habilitarlos a la vista de todos los usuarios una vez estén testeados.",
      en: "I created an internal section for the team\'s designers where they could upload and configure the templates they created, saving them automatically and separated by folder, name, date, and industry within a Google Drive using its API. This allowed for the rapid uploading of new templates and making them available to all users once tested.",
    },
  },
  {
    id: 'fusion-route-management',
    image: reactRouterThumbnail,
    height: 400,
    title: {
      es: "Gestión de rutas y acceso por estado de usuario",
      en: "Route Management and User Status Access",
    },
    description: {
      es: "Implementé la navegación usando react-router-dom con useRoutes, organizando las rutas según el estado de autenticación del usuario. Usé UserContext y useEffect para redirigir dinámicamente a páginas como login, pending-verification o dashboard, dependiendo de si el usuario había verificado su cuenta, tenía sesión activa o si el token estaba expirado. Además, integré modales como VerificationPopup con useDisclosure y configuré condiciones para mostrar el cartel DeviceNotSupported únicamente una vez logueado el usuario, y que desaparezca correctamente al cerrar sesión o limpiar la cache.",
      en: "I implemented navigation using react-router-dom with useRoutes, organizing routes based on the user\'s authentication status. I used UserContext and useEffect to dynamically redirect to pages like login, pending-verification, or dashboard, depending on whether the user had verified their account, had an active session, or if the token was expired. Additionally, I integrated modals like VerificationPopup with useDisclosure and configured conditions to display the DeviceNotSupported banner only once the user was logged in, ensuring it disappeared correctly upon logging out or clearing the cache.",
    },
  },
  {
    id: 'fusion-custom-proposal',
    image: fusionPropuestaThumbnail,
    height: 400,
    title: {
      es: "Propuesta personalizada",
      en: "Custom Proposal",
    },
    description: {
      es: "Para conseguir el puesto, envié un mail con esta propuesta personalizada para demostrar mis conocimientos en UX/UI",
      en: "To get the position, I sent an email with this custom proposal to demonstrate my UX/UI knowledge",
    },
    documentLinks: [
      {
        name: "FusionOS.pdf",
        url: "/assets/FusionOS.pdf"
      }
    ]
  },

];