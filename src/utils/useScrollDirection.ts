import { useState, useEffect } from 'react';

type ScrollDirection = 'up' | 'down' | 'none';

interface UseScrollDirectionOptions {
  /**
   * Umbral en píxeles para considerar un cambio de dirección
   * @default 10
   */
  threshold?: number;
  /**
   * Si es true, no detectará scroll hacia arriba hasta que el usuario haya
   * scrolleado hacia abajo al menos el valor del threshold
   * @default true
   */
  requireScrollDown?: boolean;
}

/**
 * Hook personalizado para detectar la dirección del scroll
 * @param options Opciones de configuración
 * @returns Objeto con la dirección actual del scroll y si está scrolleando
 */
export const useScrollDirection = ({
  threshold = 10,
  requireScrollDown = true,
}: UseScrollDirectionOptions = {}) => {
  const [direction, setDirection] = useState<ScrollDirection>('none');
  const [scrollY, setScrollY] = useState<number>(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const [hasScrolledDown, setHasScrolledDown] = useState<boolean>(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollTimeout: NodeJS.Timeout | null = null;

    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = Math.abs(currentScrollY - lastScrollY);

      // Actualizar estado de scrolling
      setIsScrolling(true);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 150);

      // Actualizar posición Y
      setScrollY(currentScrollY);

      // Si no ha pasado el umbral, no actualizar la dirección
      if (scrollDifference < threshold) {
        return;
      }

      // Determinar dirección
      if (currentScrollY > lastScrollY) {
        // Scrolleando hacia abajo
        setHasScrolledDown(true);
        setDirection('down');
      } else if (!requireScrollDown || hasScrolledDown) {
        // Scrolleando hacia arriba (y ya ha scrolleado hacia abajo si se requiere)
        setDirection('up');
      }

      lastScrollY = currentScrollY;
    };

    const handleScroll = () => {
      window.requestAnimationFrame(updateScrollDirection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, [threshold, requireScrollDown, hasScrolledDown]);

  return { direction, scrollY, isScrolling };
};