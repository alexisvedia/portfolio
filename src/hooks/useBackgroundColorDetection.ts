import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Hook para detectar el color promedio del fondo detrás de un elemento
 * y determinar si se necesita texto claro u oscuro para el contraste
 */
export const useBackgroundColorDetection = (elementRef: React.RefObject<HTMLElement>) => {
  const [isDarkBackground, setIsDarkBackground] = useState(false);
  const [averageColor, setAverageColor] = useState({ r: 255, g: 255, b: 255 });

  // Función para calcular la luminancia de un color
  const getLuminance = useCallback((r: number, g: number, b: number) => {
    // Convertir RGB a luminancia relativa usando la fórmula estándar
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }, []);

  // Función simplificada para detectar el color de fondo
  const analyzeBackground = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    // Lógica simple basada en scroll position con transición más dramática
    if (scrollY < windowHeight * 0.2) {
      // En la parte superior (hero section), usar texto oscuro
      setAverageColor({ r: 255, g: 255, b: 255 });
      setIsDarkBackground(false);
      console.log('🌅 Hero section - TEXTO NEGRO activado');
    } else {
      // En el resto de la página, usar texto claro
      setAverageColor({ r: 20, g: 20, b: 20 });
      setIsDarkBackground(true);
      console.log('🌙 Scroll section - TEXTO BLANCO activado');
    }
  }, []);

  // Observar cambios en el scroll y resize
  useEffect(() => {
    const handleUpdate = () => {
      requestAnimationFrame(analyzeBackground);
    };

    // Analizar inicialmente
    handleUpdate();

    // Escuchar eventos
    window.addEventListener('scroll', handleUpdate, { passive: true });
    window.addEventListener('resize', handleUpdate);
    
    // Observar cambios en el DOM que puedan afectar el fondo
    const observer = new MutationObserver(handleUpdate);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });

    return () => {
      window.removeEventListener('scroll', handleUpdate);
      window.removeEventListener('resize', handleUpdate);
      observer.disconnect();
    };
  }, [analyzeBackground]);

  return {
    isDarkBackground,
    averageColor,
    textColor: isDarkBackground ? '#ffffff' : '#000000',
    textColorSecondary: isDarkBackground ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)'
  };
};