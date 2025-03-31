import React, { useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import GooeyText from '../GooeyText';
import styled from 'styled-components';

interface LanguageMorphingTitleProps {
  translationKey: string;
  morphTime?: number;
  cooldownTime?: number;
  className?: string;
}

const MorphContainer = styled.div<{ $shouldMorph: boolean }>`
  position: relative;
  width: 100%;
  height: auto;
  min-height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  font-size: clamp(2.5rem, 5vw, 7rem);
  font-weight: 900;
  color: white;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  line-height: 1.2;
  letter-spacing: -0.02em;

  @media (min-width: 768px) {
    min-height: 160px;
    margin-bottom: 2rem;
    font-size: clamp(3.5rem, 8vw, 10rem);
  }
`;

// Seguimos la estructura general del ScrollFloat para mantener coherencia
const SectionTitle = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

// Tiempo mínimo de animación para asegurar que todo termine correctamente
const MIN_ANIMATION_DURATION = 2500; // ms

const LanguageMorphingTitle: React.FC<LanguageMorphingTitleProps> = ({
  translationKey,
  morphTime = 1,
  cooldownTime = 0.25,
  className,
}) => {
  const { t, i18n } = useTranslation();
  const [shouldMorph, setShouldMorph] = useState(false);
  const [texts, setTexts] = useState<string[]>(['', '']);

  // Refs para seguimiento
  const previousLanguageRef = useRef<string>(i18n.language);
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initializedRef = useRef(false);
  const isChangingRef = useRef(false);
  const lastChangeTimeRef = useRef<number>(0);

  // Efecto para la inicialización inicial
  useEffect(() => {
    if (!initializedRef.current) {
      // Configuración inicial
      const currentText = t(translationKey);
      setTexts([currentText, currentText]);
      initializedRef.current = true;
    }
  }, [t, translationKey]);

  // Función para calcular la duración total de la animación
  const getTotalAnimationDuration = () => {
    // Calcular la duración en ms y asegurarnos de que no sea menor que el mínimo
    const calculatedDuration = (morphTime + cooldownTime) * 1000 + 500;
    return Math.max(calculatedDuration, MIN_ANIMATION_DURATION);
  };

  // Efecto para detectar cambios de idioma
  useEffect(() => {
    // Si ya estamos procesando un cambio, no hacer nada
    if (isChangingRef.current) {
      return;
    }

    // Si el idioma ha cambiado
    if (previousLanguageRef.current !== i18n.language) {
      const now = Date.now();

      // Verificar si ha pasado suficiente tiempo desde el último cambio
      const timeElapsed = now - lastChangeTimeRef.current;
      if (timeElapsed < MIN_ANIMATION_DURATION) {
        // Cambio demasiado rápido
      }

      isChangingRef.current = true;
      lastChangeTimeRef.current = now;

      // Obtener el texto en el idioma anterior
      const oldText = t(translationKey, { lng: previousLanguageRef.current });

      // Obtener el texto en el nuevo idioma
      const newText = t(translationKey, { lng: i18n.language });

      // Solo animar si los textos son diferentes
      if (oldText !== newText) {
        // Actualizar los textos para la animación
        setTexts([oldText, newText]);
        setShouldMorph(true);

        // Limpiar cualquier timeout anterior
        if (animationTimeoutRef.current) {
          clearTimeout(animationTimeoutRef.current);
          animationTimeoutRef.current = null;
        }

        // Configurar un nuevo timeout para finalizar la animación
        const totalDuration = getTotalAnimationDuration();

        animationTimeoutRef.current = setTimeout(() => {
          setShouldMorph(false);
          isChangingRef.current = false;
          animationTimeoutRef.current = null;

          // Asegurar que el texto mostrado coincida con el idioma actual
          const finalText = t(translationKey);
          setTexts([finalText, finalText]);
        }, totalDuration);
      } else {
        // Si los textos son iguales, solo actualizamos la referencia
        isChangingRef.current = false;
      }

      // Actualizar la referencia del idioma
      previousLanguageRef.current = i18n.language;
    }
  }, [i18n.language, t, translationKey, morphTime, cooldownTime]);

  // Efecto para la limpieza al desmontar
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
        animationTimeoutRef.current = null;
      }
    };
  }, []);

  // Si los textos no están definidos aún, mostrar el texto actual directamente
  if (!texts[0] && !texts[1]) {
    const currentText = t(translationKey);
    return (
      <MorphContainer className={className} $shouldMorph={false}>
        <SectionTitle>{currentText}</SectionTitle>
      </MorphContainer>
    );
  }

  return (
    <MorphContainer className={className} $shouldMorph={shouldMorph}>
      <SectionTitle>
        <GooeyText
          key={shouldMorph ? `morphing-${i18n.language}` : i18n.language}
          texts={texts}
          morphTime={shouldMorph ? morphTime : 0}
          cooldownTime={shouldMorph ? cooldownTime : 0}
          textClassName="font-bold"
        />
      </SectionTitle>
    </MorphContainer>
  );
};

export default LanguageMorphingTitle;
