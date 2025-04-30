import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import SimpleBlurText from '../SimpleBlurText';
import { useTheme } from '../../context/ThemeContext';

const HeroContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.space.xl};
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const Title = styled.h1`
  font-family: 'Morganite', sans-serif;
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
  line-height: 0.9;
  text-transform: uppercase;
  width: 100%;
  user-select: none;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 232px;
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 0.8;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 500px;
    margin-bottom: ${({ theme }) => theme.space.md};
  }
`;

const StyledVedia = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: -15px;
    display: flex;
    justify-content: center;
  }
`;

const StyledAlexis = styled.div`
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    display: flex;
    justify-content: center;
  }
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

const Subtitle = styled.h2<{ $visible: boolean; $fadeOut: boolean }>`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 1.3rem;
  font-weight: 400;
  margin-bottom: ${({ theme }) => theme.space.xl};
  margin-top: -37px;
  color: ${({ theme }) => `${theme.colors.text}cc`};
  max-width: 800px;
  position: relative;
  z-index: 2;
  opacity: ${props => props.$visible ? 1 : 0};
  user-select: none;
  animation: ${props => {
    if (props.$fadeOut) return css`${fadeOut} 0.4s ease-out forwards`;
    if (props.$visible) return css`${fadeIn} 0.8s ease-out forwards`;
    return 'none';
  }};

  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 18px;
    margin-top: 10px;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.3rem;
    margin-top: -37px;
  }
`;

// Contenedor con efecto parallax
const ParallaxTitle = styled.div`
  position: relative;
  will-change: transform, filter, opacity;
`;

interface HeroSectionProps {
  onAnimationComplete?: () => void;
  fontsLoaded?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onAnimationComplete, fontsLoaded = false }) => {
  const { t, i18n } = useTranslation();
  const { themeMode } = useTheme();
  // Cambiamos para que el key ya no dependa del idioma, solo del tema
  const [titleKey, setTitleKey] = useState(`title-${themeMode}`);
  const [isMobile, setIsMobile] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [subtitleFadeOut, setSubtitleFadeOut] = useState(false);
  const [currentSubtitleText, setCurrentSubtitleText] = useState('');
  const [startAnimations, setStartAnimations] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const prevLangRef = useRef(i18n.language);
  
  // Inicializar el texto del subtítulo
  useEffect(() => {
    setCurrentSubtitleText(t('heroSubtitle'));
  }, []);
  
  // Detectar si estamos en dispositivo móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Actualizar solo cuando cambia el tema, para el título
  useEffect(() => {
    setTitleKey(`title-${themeMode}`);
  }, [themeMode]);
  
  // Iniciar animaciones solo cuando las fuentes se han cargado
  useEffect(() => {
    if (fontsLoaded) {
      // Si es una visita posterior, iniciar animaciones inmediatamente
      if (localStorage.getItem('hasVisitedBefore')) {
        setStartAnimations(true);
      } else {
        // En la primera visita, esperamos a que el FontLoader desaparezca
        const timer = setTimeout(() => {
          setStartAnimations(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [fontsLoaded]);
  
  // Efecto separado para manejar cambios de idioma con transición suave
  useEffect(() => {
    // Si el idioma cambió y es diferente del anterior
    if (i18n.language !== prevLangRef.current) {
      // Primero, activar la animación de desvanecimiento
      if (subtitleVisible) {
        setSubtitleFadeOut(true);
        
        // Después de que termine la animación de desvanecimiento
        const timer = setTimeout(() => {
          // IMPORTANTE: Primero actualizamos el texto cuando el elemento está invisible
          setCurrentSubtitleText(t('heroSubtitle'));
          
          // Luego desactivamos el fadeOut y preparamos la animación fadeIn
          setSubtitleFadeOut(false);
          setSubtitleVisible(false);
          
          // Pequeño retraso antes de mostrar el nuevo texto
          setTimeout(() => {
            setSubtitleVisible(true);
          }, 50);
        }, 400); // Duración de la animación fadeOut
        
        return () => clearTimeout(timer);
      } else {
        // Si el subtítulo no está visible, actualizamos directamente el texto
        setCurrentSubtitleText(t('heroSubtitle'));
        // Y actualizamos la referencia
        prevLangRef.current = i18n.language;
      }
    }
  }, [i18n.language, subtitleVisible, t]);
  
  // Actualizar la referencia de idioma cuando cambia
  useEffect(() => {
    prevLangRef.current = i18n.language;
  }, [i18n.language]);
  
  // Efecto parallax para el título con blur y desvanecimiento gradual
  useEffect(() => {
    const titleElement = titleRef.current;
    if (!titleElement) return;
    
    // Factor para el efecto parallax (movimiento)
    const parallaxFactor = -0.4;
    
    // Altura aproximada de la sección hero para calcular efectos
    const heroHeight = window.innerHeight;
    
    const handleScroll = () => {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        
        // Efecto parallax (movimiento)
        const offsetY = scrollY * parallaxFactor;
        
        // Efecto de blur (0px a 20px) - se incrementa gradualmente con el scroll
        // Se calcula como porcentaje del desplazamiento respecto a la altura de la sección
        const scrollProgress = Math.min(scrollY / heroHeight, 1);
        const blurAmount = scrollProgress * 20; // Máximo blur: 20px (aumentado de 10px)
        
        // Opacidad (1 a 0) - se reduce gradualmente con el scroll
        const opacity = Math.max(1 - scrollProgress * 2, 0); // Factor aumentado a 2 para llegar a 0 más rápido
        
        if (titleElement) {
          // Aplicamos los tres efectos a la vez
          titleElement.style.transform = `translateY(${offsetY}px)`;
          titleElement.style.filter = `blur(${blurAmount}px)`;
          titleElement.style.opacity = opacity.toString();
        }
      });
    };
    
    // Inicializar
    handleScroll();
    
    // Agregar listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Función para manejar la finalización de la animación del título
  const handleTitleAnimationComplete = () => {
    // Mostrar el subtítulo con animación
    setCurrentSubtitleText(t('heroSubtitle'));
    setSubtitleVisible(true);
    
    // Si hay un callback externo, ejecutarlo también
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  };
  
  return (
    <HeroContainer>
      <ParallaxTitle ref={titleRef}>
        <Title>
          {isMobile ? (
            <>
              <StyledAlexis>
                <SimpleBlurText
                  key={`${titleKey}-1`}
                  text="ALEXIS"
                  onAnimationComplete={undefined}
                  delayStart={!startAnimations}
                />
              </StyledAlexis>
              <StyledVedia>
                <SimpleBlurText
                  key={`${titleKey}-2`}
                  text="VEDIA"
                  onAnimationComplete={handleTitleAnimationComplete}
                  delayStart={!startAnimations}
                />
              </StyledVedia>
            </>
          ) : (
            <SimpleBlurText
              key={titleKey}
              text="ALEXIS VEDIA"
              onAnimationComplete={handleTitleAnimationComplete}
              delayStart={!startAnimations}
            />
          )}
        </Title>
      </ParallaxTitle>
      <Subtitle 
        $visible={subtitleVisible} 
        $fadeOut={subtitleFadeOut}
      >
        {currentSubtitleText}
      </Subtitle>
    </HeroContainer>
  );
};

export default HeroSection;