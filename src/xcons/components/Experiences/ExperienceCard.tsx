import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../../context/ThemeContext';

// Tipos para los props del componente
export interface ExperienceCardProps {
  title: string;
  period: string;
  role: string;
  tasks: string[];
  tools: string[];
  results?: string[];
  images?: string[];
  language?: 'es' | 'en';
}

const CardContainer = styled.div`
  background-color: ${props => props.theme === 'dark' ? '#1D1F23' : '#F6F6F6'};
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme === 'dark' ? '#FFFFFF' : '#333333'};
`;

const Period = styled.p`
  font-size: 0.9rem;
  color: ${props => props.theme === 'dark' ? '#B8B8B8' : '#666666'};
  margin-bottom: 1rem;
`;

const Role = styled.h4`
  font-size: 1.2rem;
  margin-bottom: 1rem;
  color: ${props => props.theme === 'dark' ? '#E0E0E0' : '#444444'};
`;

const SectionTitle = styled.h5`
  font-size: 1rem;
  margin: 1rem 0 0.5rem 0;
  color: ${props => props.theme === 'dark' ? '#CCCCCC' : '#555555'};
`;

const List = styled.ul`
  padding-left: 1.5rem;
  margin-bottom: 1rem;
`;

const ListItem = styled.li`
  margin-bottom: 0.5rem;
  color: ${props => props.theme === 'dark' ? '#AAAAAA' : '#666666'};
`;

const ToolsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const Tool = styled.span`
  background-color: ${props => props.theme === 'dark' ? '#2D2F33' : '#EEEEEE'};
  color: ${props => props.theme === 'dark' ? '#CCCCCC' : '#555555'};
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
`;

const ImagesGallery = styled.div`
  display: flex;
  overflow-x: auto;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-bottom: 0.5rem;
`;

const GalleryImage = styled.img`
  height: 120px;
  border-radius: 8px;
  object-fit: cover;
`;

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  title,
  period,
  role,
  tasks,
  tools,
  results,
  images,
  language = 'es'
}) => {
  const { themeMode } = useTheme();
  
  const translations = {
    tasks: {
      es: 'Tareas',
      en: 'Tasks'
    },
    tools: {
      es: 'Herramientas',
      en: 'Tools'
    },
    results: {
      es: 'Resultados',
      en: 'Results'
    }
  };
  
  return (
    <CardContainer theme={themeMode}>
      <CardTitle theme={themeMode}>{title}</CardTitle>
      <Period theme={themeMode}>{period}</Period>
      <Role theme={themeMode}>{role}</Role>
      
      <SectionTitle theme={themeMode}>{translations.tasks[language]}</SectionTitle>
      <List>
        {tasks.map((task, index) => (
          <ListItem key={index} theme={themeMode}>{task}</ListItem>
        ))}
      </List>
      
      <SectionTitle theme={themeMode}>{translations.tools[language]}</SectionTitle>
      <ToolsContainer>
        {tools.map((tool, index) => (
          <Tool key={index} theme={themeMode}>{tool}</Tool>
        ))}
      </ToolsContainer>
      
      {results && results.length > 0 && (
        <>
          <SectionTitle theme={themeMode}>{translations.results[language]}</SectionTitle>
          <List>
            {results.map((result, index) => (
              <ListItem key={index} theme={themeMode}>{result}</ListItem>
            ))}
          </List>
        </>
      )}
      
      {images && images.length > 0 && (
        <ImagesGallery>
          {images.map((image, index) => (
            <GalleryImage key={index} src={image} alt={`${title} - ${index + 1}`} />
          ))}
        </ImagesGallery>
      )}
    </CardContainer>
  );
};

export default ExperienceCard; 