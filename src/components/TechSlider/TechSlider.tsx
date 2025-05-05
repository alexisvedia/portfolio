import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

interface TechSliderProps {
  className?: string;
}

const SliderContainer = styled.div`
  width: 100%;
  overflow: hidden;
  padding: 20px 0;
  margin: 30px 0;
  position: relative;
  background: ${({ theme }) => theme.isDark ? 'rgba(29, 31, 35, 0.5)' : 'rgba(246, 246, 246, 0.5)'};
  border-top: 1px solid ${({ theme }) => theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  border-bottom: 1px solid ${({ theme }) => theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  backdrop-filter: blur(5px);
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

const SliderTrack = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 100%;
`;

const SliderItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 0 15px;
`;

const TechIcon = styled.img`
  height: 35px;
  max-height: 35px;
  width: auto;
  max-width: 100px;
  object-fit: contain;
  opacity: 1;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const TechSlider: React.FC<TechSliderProps> = ({ className }) => {
  // Lista de tecnologías con sus iconos
  const technologies = [
    { name: 'figma', src: '/images/projects/figma-icon.svg' },
    { name: 'git', src: '/images/projects/git.svg' },
    { name: 'mongodb', src: '/images/projects/mongodb-icon-2.svg' },
    { name: 'n8n', src: '/images/projects/N8n-logo-new.svg' },
    { name: 'postman', src: '/images/projects/postman.svg' },
    { name: 'react', src: '/images/projects/react-2.svg' },
    { name: 'typescript', src: '/images/projects/typescript.svg' },
    { name: 'wordpress', src: '/images/projects/wordpress-icon.svg' },
    { name: 'magento', src: '/images/projects/Magento.svg.png' }
  ];

  return (
    <SliderContainer className={className}>
      <SliderInner>
        <SliderTrack>
          {technologies.map((tech, index) => (
            <SliderItem key={`tech-${index}`}>
              <TechIcon 
                src={tech.src} 
                alt={tech.name} 
                title={tech.name} 
              />
            </SliderItem>
          ))}
        </SliderTrack>
      </SliderInner>
    </SliderContainer>
  );
};

export default TechSlider; 