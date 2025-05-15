import { MasonryItem } from '../components/MasonryFusion'; // Ajusta la ruta si es necesario

// Ejemplo de cómo importarías una imagen de proyecto:
// import nombreProyectoImage from '../../assets/Proyectos Fusion/nombre-proyecto.png';
import fusionAppThumbnail from '../../assets/Proyectos Fusion/fusion-app.png';
import galleryVideo from '../../assets/Proyectos Fusion/Gallery.mp4';

export const fusionProjectsData: MasonryItem[] = [
  {
    id: 'fusion-gallery-video',
    image: fusionAppThumbnail, // Thumbnail
    video: galleryVideo,       // Video para el modal
    height: 400,             // Altura del thumbnail (valor por defecto)
    title: {
      es: "Template Gallery",
      en: "Template Gallery",
    },
    description: {
      es: "En la página principal, introduje una serie de categorías visuales. Al hacer clic en una, los ejemplos de anuncios cambiaban al instante, mostrando solo los relacionados con ese tema. Luego, desarrollé una galería especial que se abría al seleccionar un anuncio. Aquí, los usuarios podían refinar su búsqueda con opciones como el tipo de industria, el estilo del diseño o la temporada. Con cada elección, la lista de anuncios se actualizaba automáticamente, indicando siempre los filtros activos. Un aspecto clave es que toda esta información –las categorías disponibles, los filtros y las propias plantillas– era consumida dinámicamente desde el backend, donde estos datos se almacenan.",
      en: "On the main page, I introduced a series of visual categories. Clicking on one would instantly change the ad examples, showing only those related to that theme. Then, I developed a special gallery that opened when an ad was selected. Here, users could refine their search with options like industry type, design style, or season. With each choice, the list of ads updated automatically, always indicating the active filters. A key aspect is that all this information – available categories, filters, and the templates themselves – was dynamically consumed from the backend, where this data is stored.",
    },
    // Para localización, podrías tener titleES, titleEN, descriptionES, descriptionEN, etc.
    // Por ahora, usaré los textos en inglés directamente como placeholders
    // actionButton y documentLinks se omiten por ahora
  },
  // Agregá más proyectos aquí...
]; 