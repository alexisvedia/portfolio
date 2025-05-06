import React, { useEffect, useState, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

interface TechSliderProps {
  className?: string;
}

const slideAnimation = keyframes`
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
`;

const SliderContainer = styled.div`
  width: 100%;
  overflow: hidden;
  padding: 20px 0;
  margin: 30px 0;
  position: relative;
  background: ${({ theme }) => theme.isDark 
    ? 'rgba(29, 31, 35, 0.7)' 
    : 'rgba(246, 246, 246, 0.7)'};
  border-top: 1px solid ${({ theme }) => theme.isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  border-bottom: 1px solid ${({ theme }) => theme.isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 16px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: ${({ theme }) => theme.isDark 
    ? '0 8px 32px rgba(0, 0, 0, 0.2)' 
    : '0 8px 32px rgba(0, 0, 0, 0.05)'};
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
`;

const SliderInner = styled.div`
  position: relative;
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: center;
`;

const SliderTrack = styled.div<{ $animate: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 100%;
  
  @media (max-width: 768px) {
    ${({ $animate }) => $animate && css`
      display: flex;
      justify-content: flex-start;
      min-width: 200%;
      animation: ${slideAnimation} 20s linear infinite;
    `}
  }
`;

const SliderItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 15px;
  
  @media (max-width: 768px) {
    flex: 0 0 auto;
  }
`;

const TechIcon = styled.img<{ $isDarkMode: boolean }>`
  height: 35px;
  max-height: 35px;
  width: auto;
  max-width: 100px;
  object-fit: contain;
  opacity: 1;
  transition: transform 0.3s ease, filter 0.3s ease;
  filter: ${({ $isDarkMode }) => $isDarkMode ? 'brightness(0) invert(1)' : 'none'};

  &:hover {
    transform: translateY(-5px);
  }
`;

const TechSlider: React.FC<TechSliderProps> = ({ className }) => {
  const { themeMode } = useTheme();
  const isDarkMode = themeMode === 'dark';
  const [isMobile, setIsMobile] = useState(false);
  
  // Lista de tecnologías con sus iconos actualizados
  const technologies = [
    { name: 'Figma', src: '/images/Logos/figma-icon-one-color.svg' },
    { name: 'MongoDB', src: '/images/Logos/mongodb-svgrepo-com.svg' },
    { name: 'n8n', src: '/images/Logos/n8n.io.svg' },
    { name: 'Postman', src: '/images/Logos/postman-svgrepo-com.svg' },
    { name: 'React', src: '/images/Logos/react-svgrepo-com.svg' },
    { name: 'Adobe Photoshop', src: '/images/Logos/adobe-photoshop-2 1.svg' },
    { name: 'HuggingFace', src: '/images/Logos/huggingface-1 1.svg' },
    { name: 'Replicate', src: '/images/Logos/Replicate Ai.svg' }
  ];

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Comprobar al cargar y cuando se redimensiona la ventana
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return (
    <SliderContainer className={className}>
      <SliderInner>
        <SliderTrack $animate={isMobile}>
          {technologies.map((tech, index) => (
            <SliderItem key={`tech-${index}`}>
              <TechIcon 
                src={tech.src} 
                alt={tech.name} 
                title={tech.name}
                $isDarkMode={isDarkMode}
              />
            </SliderItem>
          ))}
          
          {/* Duplicamos los iconos para crear un efecto infinito en mobile */}
          {isMobile && technologies.map((tech, index) => (
            <SliderItem key={`tech-dup-${index}`}>
              <TechIcon 
                src={tech.src} 
                alt={tech.name} 
                title={tech.name}
                $isDarkMode={isDarkMode}
              />
            </SliderItem>
          ))}
        </SliderTrack>
      </SliderInner>
    </SliderContainer>
  );
};

export default TechSlider; 