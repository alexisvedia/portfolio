import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';

const HeroContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
  margin-bottom: 0;
  background-image: url('/images/hero-desktop.webp');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  
  @media (max-width: 768px) {
    background-image: url('/images/fondo-mobile.webp');
    background-size: cover;
    background-position: center -80px;
  }
  

`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  z-index: 5;
  padding: 0;
  width: 100%;
  height: 100vh;
  
  @media (max-width: 768px) {
    padding: 0;
    justify-content: flex-start;
    padding-top: 20vh;
  }
`;

const HeroImage = styled.div`
  display: block;
  position: absolute;
  bottom: 4.3vh;
  left: 50%;
  transform: translateX(-51%);
  width: 100vw;
  max-width: 400px;
  height: 61vh;
  background-image: url('/images/hero-mobile.webp');
  background-size: contain;
  background-position: center bottom;
  background-repeat: no-repeat;
  z-index: 20;
  pointer-events: none;
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const MainTitle = styled.h1`
  font-family: 'Prosa', sans-serif;
  font-weight: 400;
  font-size: clamp(5rem, 15vw, 12rem);
  line-height: 0.8;
  color: #FFE2D4;
  text-transform: uppercase;
  letter-spacing: -0.02em;
  margin: 0;

  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 768px) {
    font-size: clamp(5rem, 22vw, 8rem);
    line-height: 0.7;
    letter-spacing: -0.01em;
    text-align: center;
    padding-left: 0;
    margin-top: -2rem;
  }
`;

const AlexisText = styled.span`
  font-size: 250.68px;
  display: block;
  width: 100%;
  text-align: center;
  margin: 0;
  padding: 0;
  position: relative;
  /* Ajustes manuales de posición */
  transform: translateX(-400px) translateY(-50px);
  
  @media (max-width: 768px) {
    font-size: clamp(4rem, 40vw, 171.68px);
    transform: translateX(0px) translateY(-3rem);
  }
`;

const VediaText = styled.span`
  font-size: 311.68px;
  display: block;
  width: 100%;
  text-align: center;
  margin: 0;
  padding: 0;
  position: relative;
  /* Ajustes manuales de posición */
  transform: translateX(-397px) translateY(0px);
  
  @media (max-width: 768px) {
    font-size: clamp(5rem, 49.5vw, 214.68px);
    transform: translateX(0px) translateY(0px);
  }
`;

const NavBarContainer = styled.div`
  position: fixed;
  top: 3rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  
  @media (max-width: 768px) {
    top: auto;
    bottom: 3rem;
  }
`;



const LiquidGlassNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  backdrop-filter: blur(12px) saturate(150%);
  -webkit-backdrop-filter: blur(12px) saturate(150%);
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.05) 30%,
    rgba(255, 255, 255, 0.08) 70%,
    rgba(255, 255, 255, 0.12) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  color: white;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      rgba(255, 255, 255, 0.1), 
      transparent
    );
    transition: left 0.6s ease;
  }
  
  &:hover {
    transform: translateY(-2px);
    backdrop-filter: blur(16px) saturate(180%);
    -webkit-backdrop-filter: blur(16px) saturate(180%);
    box-shadow: 
      0 12px 40px rgba(0, 0, 0, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    
    &::before {
      left: 100%;
    }
  }
  
  @media (max-width: 768px) {
    padding: 1rem 2rem;
    gap: 1rem;
  }
`;

const NavItem = styled.a`
  color: white;
  text-decoration: none;
  font-family: 'Prosa', sans-serif;
  font-weight: 500;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-1px);
    text-decoration: none;
  }
  
  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.5rem 1rem;
  }
`;

const fadeInUp = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const AnimatedTitle = styled(MainTitle)<{ scrollY: number }>`
  animation: ${fadeInUp} 1s ease-out 0.5s both;
  transform: translateY(${props => props.scrollY * 1.5}px);
  opacity: ${props => Math.max(0, 1 - (props.scrollY / 100))};
  transition: transform 0.1s ease-out, opacity 0.1s ease-out;
  will-change: transform, opacity;
  
  @media (max-width: 768px) {
    transform: translateY(${props => props.scrollY * 2}px);
    opacity: ${props => Math.max(0, 1 - (props.scrollY / 80))};
  }
`;

const StaticNav = styled(LiquidGlassNav)`
  animation: ${fadeInUp} 1s ease-out 1s both;
`;

interface HeroSectionProps {
  onAnimationComplete?: () => void;
  fontsLoaded?: boolean;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onAnimationComplete, fontsLoaded = false }) => {
  const { t } = useTranslation();
  const [scrollY, setScrollY] = useState(0);
  
  useEffect(() => {
    if (onAnimationComplete) {
      const timer = setTimeout(() => {
        onAnimationComplete();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [onAnimationComplete]);
  
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <>
      {/* Subtle SVG Filter for Liquid Glass Effect */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <filter id="liquid-glass-subtle" x="-20%" y="-20%" width="140%" height="140%" filterUnits="objectBoundingBox">
            {/* Gentle turbulence */}
            <feTurbulence 
              type="fractalNoise" 
              baseFrequency="0.01 0.015" 
              numOctaves="2" 
              seed="13" 
              result="noise"
            />
            
            {/* Soft blur */}
            <feGaussianBlur in="noise" stdDeviation="1" result="softNoise" />
            
            {/* Very subtle displacement */}
            <feDisplacementMap 
              in="SourceGraphic" 
              in2="softNoise" 
              scale="2" 
              xChannelSelector="R" 
              yChannelSelector="G" 
              result="displaced"
            />
            
            {/* Final composition with original */}
            <feComposite 
              in="displaced" 
              in2="SourceGraphic" 
              operator="over" 
              k1="0.1" 
              k2="0.9" 
              k3="0" 
              k4="0" 
              result="final"
            />
          </filter>
        </defs>
      </svg>
      
      <NavBarContainer>
        <LiquidGlassNav>
          <NavItem href="#home">{t('navbar.home')}</NavItem>
          <NavItem href="#projects">{t('navbar.projects')}</NavItem>
          <NavItem href="#contact">{t('contact')}</NavItem>
        </LiquidGlassNav>
      </NavBarContainer>
      
      <HeroContainer>
        <ContentWrapper>
          <AnimatedTitle scrollY={scrollY}>
            <AlexisText>ALEXIS</AlexisText>
            <VediaText>VEDIA</VediaText>
          </AnimatedTitle>
        </ContentWrapper>
        
      <HeroImage />
      </HeroContainer>
    </>
  );
};

export default HeroSection;