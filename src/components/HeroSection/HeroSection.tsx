import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
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

const Subtitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 400;
  margin-bottom: ${({ theme }) => theme.space.xl};
  color: ${({ theme }) => `${theme.colors.text}cc`};
  max-width: 800px;
  position: relative;
  z-index: 2;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes['4xl']};
    margin-top: -60px;
  }
`;

const HeroSection: React.FC<{ onAnimationComplete?: () => void }> = ({ onAnimationComplete }) => {
  const { t, i18n } = useTranslation();
  const { themeMode } = useTheme();
  const [key, setKey] = useState(`${i18n.language}-${themeMode}`);
  const [isMobile, setIsMobile] = useState(false);
  
  // Detectar si estamos en dispositivo móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Actualizar la key cuando cambia el tema o el idioma
  useEffect(() => {
    setKey(`${i18n.language}-${themeMode}`);
  }, [i18n.language, themeMode]);
  
  return (
    <HeroContainer>
      <Title>
        {isMobile ? (
          <>
            <StyledAlexis>
              <SimpleBlurText
                key={`${key}-1`}
                text="ALEXIS"
                onAnimationComplete={undefined}
              />
            </StyledAlexis>
            <StyledVedia>
              <SimpleBlurText
                key={`${key}-2`}
                text="VEDIA"
                onAnimationComplete={onAnimationComplete}
              />
            </StyledVedia>
          </>
        ) : (
          <SimpleBlurText
            key={key}
            text="ALEXIS VEDIA"
            onAnimationComplete={onAnimationComplete}
          />
        )}
      </Title>
      <Subtitle>{t('heroSubtitle')}</Subtitle>
    </HeroContainer>
  );
};

export default HeroSection;