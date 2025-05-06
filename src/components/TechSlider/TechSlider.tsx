import React, { useEffect, useState, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

interface TechSliderProps {
  className?: string;
}

// Definimos el componente Tooltip con estilo Glass
const Tooltip = styled.div<{ $isVisible: boolean; $isDarkMode: boolean }>`
  position: absolute;
  top: -35px;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px 12px;
  border-radius: 100px;
  font-size: 12px;
  white-space: nowrap;
  background: ${({ $isDarkMode }) => 
    $isDarkMode ? 'rgba(20, 20, 25, 0.9)' : 'rgba(240, 240, 245, 0.9)'};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: opacity 0.2s ease;
  pointer-events: none;
  z-index: 10000;
  color: ${({ $isDarkMode }) => $isDarkMode ? '#ffffff' : '#000000'};
`;

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
  overflow: visible;
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
  position: relative;
  
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
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  
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

  const handleMouseEnter = (name: string) => {
    setActiveTooltip(name);
  };

  const handleMouseLeave = () => {
    setActiveTooltip(null);
  };

  return (
    <SliderContainer className={className}>
      <SliderInner>
        <SliderTrack $animate={isMobile}>
          {technologies.map((tech, index) => (
            <SliderItem 
              key={`tech-${index}`}
              onMouseEnter={() => handleMouseEnter(tech.name)}
              onMouseLeave={handleMouseLeave}
            >
              <TechIcon 
                src={tech.src} 
                alt={tech.name} 
                $isDarkMode={isDarkMode}
              />
              <Tooltip 
                $isVisible={activeTooltip === tech.name}
                $isDarkMode={isDarkMode}
              >
                {tech.name}
              </Tooltip>
            </SliderItem>
          ))}
          
          {/* Duplicamos los iconos para crear un efecto infinito en mobile */}
          {isMobile && technologies.map((tech, index) => (
            <SliderItem 
              key={`tech-dup-${index}`}
              onMouseEnter={() => handleMouseEnter(`dup-${tech.name}`)}
              onMouseLeave={handleMouseLeave}
            >
              <TechIcon 
                src={tech.src} 
                alt={tech.name}
                $isDarkMode={isDarkMode}
              />
              <Tooltip 
                $isVisible={activeTooltip === `dup-${tech.name}`}
                $isDarkMode={isDarkMode}
              >
                {tech.name}
              </Tooltip>
            </SliderItem>
          ))}
        </SliderTrack>
      </SliderInner>
    </SliderContainer>
  );
};

export default TechSlider; 