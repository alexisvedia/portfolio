/**
 * Script para detectar la actividad de desplazamiento y controlar la visibilidad
 * de la barra de desplazamiento
 */

export const initScrollDetection = (): (() => void) => {
  let scrollTimeout: number | null = null;

  
  const handleScroll = (): void => {
  
    document.body.classList.add('scrolling');

  
    if (scrollTimeout) {
      window.clearTimeout(scrollTimeout);
    }

  
    scrollTimeout = window.setTimeout(() => {
      document.body.classList.remove('scrolling');
    }, 1500);
  };

  
  window.addEventListener('scroll', handleScroll, { passive: true });

  
  return () => {
    window.removeEventListener('scroll', handleScroll);
    if (scrollTimeout) {
      window.clearTimeout(scrollTimeout);
    }
  };
};
