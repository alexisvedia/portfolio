import React from 'react';
import styled from 'styled-components';

export interface ProjectCardProps {
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  projectUrl?: string;
  repoUrl?: string;
}

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px ${({ theme }) => theme.isDark 
    ? 'rgba(0, 0, 0, 0.25)' 
    : 'rgba(0, 0, 0, 0.08)'};
  transition: transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.isDark 
    ? 'rgba(255, 255, 255, 0.05)' 
    : 'rgba(0, 0, 0, 0.05)'};
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px ${({ theme }) => theme.isDark 
      ? 'rgba(0, 0, 0, 0.3)' 
      : 'rgba(0, 0, 0, 0.12)'};
  }
`;

const ImageContainer = styled.div`
  height: 200px;
  overflow: hidden;
  position: relative;
`;

const ProjectImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.space.lg};
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Title = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  margin-bottom: ${({ theme }) => theme.space.sm};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => `${theme.colors.text}cc`};
  margin-bottom: ${({ theme }) => theme.space.md};
  flex: 1;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.space.xs};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const Tag = styled.span`
  background-color: ${({ theme }) => `${theme.colors.primary}22`};
  color: ${({ theme }) => theme.colors.primary};
  padding: 4px 8px;
  border-radius: 4px;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: 500;
`;

const LinksContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.md};
`;

const PrimaryButton = styled.a`
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.md}`};
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  text-align: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => `${theme.colors.primary}dd`};
    transform: translateY(-2px);
  }
`;

const SecondaryButton = styled.a`
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.md}`};
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 500;
  text-align: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => `${theme.colors.primary}22`};
    transform: translateY(-2px);
  }
`;

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  imageUrl,
  tags,
  projectUrl,
  repoUrl,
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    // Si la imagen falla, reemplazarla con una imagen local de respaldo
    e.currentTarget.src = `/images/projects/fallback-image.jpg`;
  };

  return (
    <Card>
      <ImageContainer>
        <ProjectImage src={imageUrl} alt={title} onError={handleImageError} />
      </ImageContainer>
      <Content>
        <Title>{title}</Title>
        <TagsContainer>
          {tags.map((tag, index) => (
            <Tag key={index}>{tag}</Tag>
          ))}
        </TagsContainer>
        <Description>{description}</Description>
        <LinksContainer>
          {projectUrl && (
            <PrimaryButton href={projectUrl} target="_blank" rel="noopener noreferrer">
              Ver Proyecto
            </PrimaryButton>
          )}
          {repoUrl && (
            <SecondaryButton 
              href={repoUrl} 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Repositorio
            </SecondaryButton>
          )}
        </LinksContainer>
      </Content>
    </Card>
  );
};

export default ProjectCard; 