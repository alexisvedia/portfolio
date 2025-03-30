/**
 * Script para detectar la actividad de desplazamiento y controlar la visibilidad
 * de la barra de desplazamiento
 */

export const initScrollDetection = (): (() => void) => {
  let scrollTimeout: number | null = null;

  // Función para manejar el evento de scroll
  const handleScroll = (): void => {
    // Añadir clase 'scrolling' al body cuando hay actividad de scroll
    document.body.classList.add('scrolling');

    // Limpiar el timeout anterior si existe
    if (scrollTimeout) {
      window.clearTimeout(scrollTimeout);
    }

    // Establecer un nuevo timeout para quitar la clase después de que el scroll se detenga
    scrollTimeout = window.setTimeout(() => {
      document.body.classList.remove('scrolling');
    }, 1500); // Desaparece después de 1.5 segundos de inactividad
  };

  // Añadir el listener de scroll al window
  window.addEventListener('scroll', handleScroll, { passive: true });

  // Limpiar el listener cuando el componente se desmonte (opcional, para usar en React)
  return () => {
    window.removeEventListener('scroll', handleScroll);
    if (scrollTimeout) {
      window.clearTimeout(scrollTimeout);
    }
  };
};
