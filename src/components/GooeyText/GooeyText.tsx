'use client';

import * as React from 'react';
import { cn } from '../../utils/cn';
import styled from 'styled-components';

interface GooeyTextProps {
  texts: string[];
  morphTime?: number;
  cooldownTime?: number;
  className?: string;
  textClassName?: string;
}

const Container = styled.div`
  position: relative;
  min-height: 150px;
  min-width: 280px;
  width: 100%;

  @media (min-width: 768px) {
    min-height: 180px;
  }
`;

const HiddenSvg = styled.svg`
  position: absolute;
  height: 0;
  width: 0;
`;

const TextContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 150px;
  width: 100%;
  position: relative;

  @media (min-width: 768px) {
    min-height: 180px;
  }
`;

const TextSpan = styled.span`
  position: absolute;
  display: inline-block;
  user-select: none;
  text-align: center;
  font-size: clamp(2.5rem, 5vw, 7rem);
  line-height: 1.2;
  white-space: nowrap;
  color: white;
  font-weight: 900;
  letter-spacing: -0.02em;
  transform-origin: center center;

  @media (min-width: 768px) {
    font-size: clamp(3.5rem, 8vw, 10rem);
  }
`;

export function GooeyText({
  texts,
  morphTime = 1,
  cooldownTime = 0.25,
  className,
  textClassName,
}: GooeyTextProps) {
  const text1Ref = React.useRef<HTMLSpanElement>(null);
  const text2Ref = React.useRef<HTMLSpanElement>(null);
  const [filterId] = React.useState(`threshold-${Math.random().toString(36).substring(2, 9)}`);
  const animationFrameIdRef = React.useRef<number | null>(null);
  const isAnimatingRef = React.useRef(false);
  const elapsedTimeRef = React.useRef(0);
  const previousTextsRef = React.useRef<string[]>(['', '']);
  const completed = React.useRef(false);
  const animationAbortedRef = React.useRef(false);

  // Limpiar cualquier animación en curso
  const cleanupAnimation = React.useCallback(() => {
    if (animationFrameIdRef.current) {
      console.log('[GooeyText] Cancelando animación en curso');
      cancelAnimationFrame(animationFrameIdRef.current);
      animationFrameIdRef.current = null;
    }
    isAnimatingRef.current = false;
    elapsedTimeRef.current = 0;
    animationAbortedRef.current = false;
  }, []);

  // Función para configurar el morphing basado en una fracción (0-1)
  const setMorph = React.useCallback((fraction: number) => {
    if (!text1Ref.current || !text2Ref.current || animationAbortedRef.current) return;

    try {
      // Primero establecer el texto entrante (se hará visible gradualmente)
      const blur1 = Math.min(8 / (1 - fraction) - 8, 100);
      const opacity1 = Math.pow(1 - fraction, 0.4) * 100;

      text1Ref.current.style.filter = `blur(${blur1}px)`;
      text1Ref.current.style.opacity = `${opacity1}%`;

      // Luego establecer el texto saliente (se desvanecerá gradualmente)
      const blur2 = Math.min(8 / fraction - 8, 100);
      const opacity2 = Math.pow(fraction, 0.4) * 100;

      text2Ref.current.style.filter = `blur(${blur2}px)`;
      text2Ref.current.style.opacity = `${opacity2}%`;
    } catch (err) {
      console.error('[GooeyText] Error en setMorph:', err);
      animationAbortedRef.current = true;
      finalizeAnimation();
    }
  }, []);

  // Función para aplicar el estado final después de completar la animación
  const finalizeAnimation = React.useCallback(() => {
    if (!text1Ref.current || !text2Ref.current) return;

    try {
      // El texto original (text1) está completamente oculto
      text1Ref.current.style.opacity = '0%';
      text1Ref.current.style.filter = '';

      // El texto nuevo (text2) está completamente visible
      text2Ref.current.style.opacity = '100%';
      text2Ref.current.style.filter = '';

      // Asegurar que el texto final sea visible
      if (texts && texts.length > 1 && texts[1]) {
        text2Ref.current.textContent = texts[1];
      }

      completed.current = true;
    } catch (err) {
      console.error('[GooeyText] Error en finalizeAnimation:', err);
    }
  }, [texts]);

  // Estabilizar el componente en caso de cambio rápido
  const forceStableState = React.useCallback(() => {
    cleanupAnimation();

    if (text1Ref.current && text2Ref.current && texts && texts.length > 1) {
      try {
        // Mostrar directamente el segundo texto sin animación
        text1Ref.current.style.opacity = '0%';
        text1Ref.current.textContent = texts[0] || '';

        text2Ref.current.style.opacity = '100%';
        text2Ref.current.style.filter = '';
        text2Ref.current.textContent = texts[1] || '';

        console.log('[GooeyText] Estado estabilizado: mostrar segundo texto', texts[1]);
      } catch (err) {
        console.error('[GooeyText] Error al estabilizar:', err);
      }
    }
  }, [texts, cleanupAnimation]);

  // Efecto para iniciar o reiniciar la animación cuando cambian los textos
  React.useEffect(() => {
    console.log('[GooeyText] recibió textos:', texts);

    // Manejo de casos bordes
    if (!texts || texts.length < 2) {
      console.log('[GooeyText] Textos insuficientes', texts);
      forceStableState();
      return;
    }

    // Verificar que tengamos los textos necesarios y sean válidos
    if (!texts[0] || !texts[1]) {
      console.log('[GooeyText] Textos incompletos o inválidos');
      forceStableState();
      return;
    }

    // Si los textos son iguales, no necesitamos animar
    if (texts[0] === texts[1]) {
      console.log('[GooeyText] Textos iguales, no hay animación');
      if (text1Ref.current) {
        text1Ref.current.textContent = texts[0];
        text1Ref.current.style.opacity = '100%';
        text1Ref.current.style.filter = '';
      }
      if (text2Ref.current) {
        text2Ref.current.textContent = '';
        text2Ref.current.style.opacity = '0%';
      }
      completed.current = true;
      return cleanupAnimation();
    }

    // Si los textos son los mismos que antes, no reiniciamos la animación
    if (
      previousTextsRef.current[0] === texts[0] &&
      previousTextsRef.current[1] === texts[1] &&
      isAnimatingRef.current
    ) {
      console.log('[GooeyText] Mismos textos que antes, continuando animación actual');
      return;
    }

    // Actualizar la referencia de textos anteriores
    previousTextsRef.current = [...texts];
    completed.current = false;
    animationAbortedRef.current = false;

    // Limpiar cualquier animación en curso
    cleanupAnimation();

    // Configuración inicial
    if (text1Ref.current && text2Ref.current) {
      try {
        console.log(`[GooeyText] Iniciando morphing de "${texts[0]}" a "${texts[1]}"`);

        // Preparamos los elementos de texto
        text1Ref.current.textContent = texts[0];
        text2Ref.current.textContent = texts[1];

        // Configuración inicial: el primer texto está completamente visible
        text1Ref.current.style.opacity = '100%';
        text1Ref.current.style.filter = '';

        // El segundo texto está invisible inicialmente
        text2Ref.current.style.opacity = '0%';
        text2Ref.current.style.filter = '';
      } catch (err) {
        console.error('[GooeyText] Error al inicializar los textos:', err);
        forceStableState();
        return;
      }
    }

    // Si el tiempo de morphing es 0, no necesitamos animar
    if (morphTime <= 0) {
      console.log('[GooeyText] morphTime es 0, aplicando estado final directamente');
      finalizeAnimation();
      return;
    }

    // Marcamos que estamos animando
    isAnimatingRef.current = true;
    elapsedTimeRef.current = 0;

    // Tiempo de inicio para la animación
    let startTime = performance.now();

    // Función de animación
    const animate = (currentTime: number) => {
      // Si la animación fue abortada o ya no estamos animando
      if (animationAbortedRef.current || !isAnimatingRef.current) {
        console.log('[GooeyText] Animación abortada o detenida');
        cleanupAnimation();
        return;
      }

      try {
        // Calcular el tiempo transcurrido desde el inicio
        const elapsed = (currentTime - startTime) / 1000;
        elapsedTimeRef.current = elapsed;

        // Si hemos superado el tiempo de morphing
        if (elapsed >= morphTime) {
          console.log('[GooeyText] Morphing completado');
          // Aplicar el estado final
          finalizeAnimation();

          // Si hay tiempo de enfriamiento, esperar antes de finalizar
          if (cooldownTime > 0) {
            setTimeout(() => {
              cleanupAnimation();
            }, cooldownTime * 1000);
          } else {
            cleanupAnimation();
          }
          return;
        }

        // Calcular la fracción del progreso de la animación (0-1)
        const fraction = elapsed / morphTime;

        // Aplicar el morphing según la fracción
        setMorph(fraction);

        // Continuar la animación
        animationFrameIdRef.current = requestAnimationFrame(animate);
      } catch (err) {
        console.error('[GooeyText] Error en animación:', err);
        animationAbortedRef.current = true;
        finalizeAnimation();
        cleanupAnimation();
      }
    };

    // Iniciar la animación
    animationFrameIdRef.current = requestAnimationFrame(animate);

    // Limpieza al desmontar o cuando cambian las dependencias
    return cleanupAnimation;
  }, [
    texts,
    morphTime,
    cooldownTime,
    cleanupAnimation,
    setMorph,
    finalizeAnimation,
    forceStableState,
  ]);

  // Asegurarse de limpiar la animación cuando se desmonta el componente
  React.useEffect(() => {
    return cleanupAnimation;
  }, [cleanupAnimation]);

  return (
    <Container className={className}>
      <HiddenSvg aria-hidden="true" focusable="false">
        <defs>
          <filter id={filterId}>
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </HiddenSvg>

      <TextContainer style={{ filter: `url(#${filterId})` }}>
        <TextSpan ref={text1Ref} className={textClassName} />
        <TextSpan ref={text2Ref} className={textClassName} />
      </TextContainer>
    </Container>
  );
}

export default GooeyText;
