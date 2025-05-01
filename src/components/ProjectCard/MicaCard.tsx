import React from 'react';
import styled from 'styled-components';

export interface MicaCardProps {
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
}

// Contenedor exterior con sombra y efectos de hover
const CardContainer = styled.div`
  position: relative;
  isolation: isolate;
  height: 100%;
  overflow: hidden;
  border-radius: 16px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background-color: ${({ theme }) => theme.isDark ? '#2A2D36' : '#FFFFFF'};
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  z-index: 50;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  }
`;

// Contenido interior con diseño
const Card = styled.div`
  position: relative;
  height: 100%;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  z-index: 51;
  
  // Fondo completamente opaco con textura sutil
  background-color: ${({ theme }) => theme.isDark ? '#2A2D36' : '#FFFFFF'};
  
  // Textura de ruido para el efecto Mica dentro de la card
  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: ${({ theme }) => theme.isDark ? 0.03 : 0.02};
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 100px;
    pointer-events: none;
    z-index: -1;
  }
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  font-weight: 900;
  font-family: 'Morganite', sans-serif;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
  position: relative;
  z-index: 2;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  line-height: 1.6;
  color: ${({ theme }) => `${theme.colors.text}dd`};
  margin-bottom: 1.5rem;
  flex: 1;
  position: relative;
  z-index: 2;
`;

const TechnologiesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  position: relative;
  z-index: 2;
`;

const Technology = styled.span`
  background-color: ${({ theme }) => 
    theme.isDark 
      ? 'rgba(100, 108, 255, 0.2)' 
      : 'rgba(100, 108, 255, 0.15)'};
  color: ${({ theme }) => 
    theme.isDark 
      ? 'rgba(180, 185, 255, 1)' 
      : 'rgba(80, 90, 210, 1)'};
  padding: 0.4rem 0.8rem;
  border-radius: 2rem;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
`;

const ImageContainer = styled.div`
  margin-top: auto;
  height: 180px;
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  z-index: 2;
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const MicaCard: React.FC<MicaCardProps> = ({
  title,
  description,
  imageUrl,
  technologies,
}) => {
  // Imagen de respaldo
  const fallbackImage = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzlhOWE5YSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjQiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIGZpbGw9IiNmZmZmZmYiPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg==";

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = fallbackImage;
    e.currentTarget.onerror = null; // Prevenir bucle infinito
  };

  return (
    <CardContainer>
      <Card>
        <Title>{title}</Title>
        <TechnologiesContainer>
          {technologies.map((tech, index) => (
            <Technology key={index}>{tech}</Technology>
          ))}
        </TechnologiesContainer>
        <Description>{description}</Description>
        <ImageContainer>
          <ProjectImage 
            src={imageUrl} 
            alt={title} 
            onError={handleImageError} 
          />
        </ImageContainer>
      </Card>
    </CardContainer>
  );
};

export default MicaCard; 