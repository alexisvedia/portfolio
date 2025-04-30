import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SectionContainer = styled.section`
  padding: ${({ theme }) => theme.space.xl} 0;
  position: relative;
  overflow: hidden;
  width: 100%;
  margin: -11rem 0 3rem 0;
`;

const ContentWrapper = styled.div<{ $opacity: number; $translateY: number }>`
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: ${props => props.$opacity};
  transform: translateY(${props => props.$translateY}px);
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    padding: 0 ${({ theme }) => theme.space.md};
  }
`;

const ProfileImage = styled.img`
  max-width: 45%;
  height: auto;
  display: block;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 80%;
    margin-bottom: 1.5rem;
  }
`;

const TextContainer = styled.div`
  flex: 1;
  padding-left: 10px;
  max-width: 45%;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-left: 0;
    max-width: 100%;
    text-align: center;
  }
`;

const SectionTitle = styled.h2`
  font-family: 'Morganite', sans-serif;
  font-weight: 900;
  font-size: 5rem;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.5rem;
  line-height: 0.9;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
`;

const BioText = styled.p`
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.5;
  margin-bottom: 1.5rem;
  font-size: 1.15rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  text-shadow: 0 1px 2px ${({ theme }) => theme.isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)'};
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.05rem;
    line-height: 1.4;
  }
`;

const BioSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [opacity, setOpacity] = useState(0);
  const [translateY, setTranslateY] = useState(120);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      
      const scrollPosition = window.scrollY;
      const triggerHeight = window.innerHeight * 0.3; // Comienza a mostrar cuando el scroll ha pasado 30% de la ventana
      const threshold = window.innerHeight * 0.2; // Un umbral más corto para completar la animación más rápido
      
      if (scrollPosition > triggerHeight) {
        // Calcular progreso de animación con un umbral más corto para que sea más decisivo
        const scrollProgress = Math.min((scrollPosition - triggerHeight) / threshold, 1);
        
        // Aplicar una curva de aceleración para que la animación sea más decisiva
        // Usamos una curva básica donde pequeños cambios al principio y final tienen mayor efecto
        let easedProgress;
        
        if (scrollProgress < 0.2) {
          // Inicio acelerado (0 a 0.5 más rápido)
          easedProgress = scrollProgress * 2.5;
        } else if (scrollProgress > 0.8) {
          // Final acelerado (0.8 a 1 más rápido)
          easedProgress = 0.5 + ((scrollProgress - 0.2) / 0.8) * 0.5;
        } else {
          // Mitad con velocidad normal
          easedProgress = scrollProgress;
        }
        
        // Asegurar que llegue a 1 más fácilmente
        if (scrollProgress > 0.9) easedProgress = 1;
        
        setOpacity(easedProgress);
        
        // Parallax effect: mover hacia arriba mientras scrolleamos
        const parallaxDistance = 120;
        const newTranslateY = Math.max(0, parallaxDistance - (easedProgress * parallaxDistance));
        setTranslateY(newTranslateY);
      } else {
        setOpacity(0);
        setTranslateY(120);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Inicializar con la posición actual
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  return (
    <SectionContainer ref={sectionRef}>
      <ContentWrapper $opacity={opacity} $translateY={translateY}>
        <ProfileImage 
          src="/images/projects/alexis.png" 
          alt="Alexis Vedia" 
        />
        <TextContainer>
          <SectionTitle>{i18n.language === 'es' ? 'SOBRE MÍ' : 'ABOUT ME'}</SectionTitle>
          <BioText>{t('about.bio.part1')}</BioText>
          <BioText>{t('about.bio.part2')}</BioText>
        </TextContainer>
      </ContentWrapper>
    </SectionContainer>
  );
};

export default BioSection; 