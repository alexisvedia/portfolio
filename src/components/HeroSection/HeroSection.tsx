import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import SimpleBlurText from '../SimpleBlurText';
import { useTheme } from '../../context/ThemeContext';

const HeroContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 0 ${({ theme }) => theme.space.xl};
  text-align: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 0;
`;

const CenteringWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: auto;
  margin-bottom: auto;
`;

const Title = styled.h1`
  font-weight: 900;
  color: ${({ theme }) => theme.colors.text};
  line-height: 0.9;
  text-transform: uppercase;
  width: 100%;
  user-select: none;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 75px;
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1;
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 130px;
    margin-bottom: ${({ theme }) => theme.space.sm};
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

// Contenedor con efecto parallax
const ParallaxTitle = styled.div`
  position: relative;
  will-change: transform, filter, opacity;
`;

// Contenedor para el subtítulo con efecto parallax
const ParallaxSubtitle = styled.div`
  position: relative;
  will-change: transform, filter, opacity;
  margin-top: 0;
  max-width: 800px;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    margin-top: ${({ theme }) => theme.space.xs};
  }
`;

// Subtítulo con animación de aparición original
const Subtitle = styled.h2<{ $visible: boolean; $fadeOut: boolean }>`
  font-size: 1.3rem;
  font-weight: 400;
  margin-bottom: 0;
  color: ${({ theme }) => `${theme.colors.text}cc`};
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
  }

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.3rem;
  }
`;

interface HeroSectionProps {
  onAnimationComplete?: () => void;
  fontsLoaded?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onAnimationComplete, fontsLoaded = false }) => {
  const { t, i18n } = useTranslation();
  const { themeMode } = useTheme();
  const [titleKey, setTitleKey] = useState(`title-${themeMode}`);
  const [isMobile, setIsMobile] = useState(false);
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [subtitleFadeOut, setSubtitleFadeOut] = useState(false);
  const [currentSubtitleText, setCurrentSubtitleText] = useState('');
  const [startAnimations, setStartAnimations] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const prevLangRef = useRef(i18n.language);
  
  useEffect(() => {
    setCurrentSubtitleText(t('heroSubtitle'));
  }, []);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    setTitleKey(`title-${themeMode}`);
  }, [themeMode]);
  
  useEffect(() => {
    if (fontsLoaded) {
      if (localStorage.getItem('hasVisitedBefore')) {
        setStartAnimations(true);
      } else {
        const timer = setTimeout(() => {
          setStartAnimations(true);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [fontsLoaded]);
  
  useEffect(() => {
    if (i18n.language !== prevLangRef.current) {
      if (subtitleVisible) {
        setSubtitleFadeOut(true);
        const timer = setTimeout(() => {
          setCurrentSubtitleText(t('heroSubtitle'));
          setSubtitleFadeOut(false);
          setSubtitleVisible(false);
          setTimeout(() => {
            setSubtitleVisible(true);
          }, 50);
        }, 400); 
        return () => clearTimeout(timer);
      } else {
        setCurrentSubtitleText(t('heroSubtitle'));
        prevLangRef.current = i18n.language;
      }
    }
  }, [i18n.language, subtitleVisible, t]);
  
  useEffect(() => {
    prevLangRef.current = i18n.language;
  }, [i18n.language]);
  
  useEffect(() => {
    const titleElement = titleRef.current;
    const subtitleElement = subtitleRef.current;
    if (!titleElement || !subtitleElement) return;
    const parallaxFactor = -0.4;
    const subtitleParallaxFactor = -0.5;
    const heroHeight = window.innerHeight;
    const handleScroll = () => {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const offsetY = scrollY * parallaxFactor;
        const subtitleOffsetY = scrollY * subtitleParallaxFactor;
        const scrollProgress = Math.min(scrollY / heroHeight, 1);
        const blurAmount = scrollProgress * 20;
        const opacity = Math.max(1 - scrollProgress * 2, 0);
        if (titleElement) {
          titleElement.style.transform = `translateY(${offsetY}px)`;
          titleElement.style.filter = `blur(${blurAmount}px)`;
          titleElement.style.opacity = opacity.toString();
        }
        if (subtitleElement) {
          subtitleElement.style.transform = `translateY(${subtitleOffsetY}px)`;
          subtitleElement.style.filter = `blur(${blurAmount}px)`;
          subtitleElement.style.opacity = opacity.toString();
        }
      });
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTitleAnimationComplete = () => {
    setCurrentSubtitleText(t('heroSubtitle'));
    setSubtitleVisible(true);
    if (onAnimationComplete) {
      onAnimationComplete();
    }
  };
  
  return (
    <HeroContainer>
      <CenteringWrapper>
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
        
        <ParallaxSubtitle ref={subtitleRef}>
          <Subtitle 
            $visible={subtitleVisible} 
            $fadeOut={subtitleFadeOut}
          >
            {currentSubtitleText}
          </Subtitle>
        </ParallaxSubtitle>
      </CenteringWrapper>
    </HeroContainer>
  );
};

export default HeroSection;