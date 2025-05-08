import React from 'react';
import styled from 'styled-components';
// import { useTheme } from '../../../context/ThemeContext'; // Eliminado porque themeMode ya no se usa aquí

// Tipos para los props del componente
export interface ExperienceCardProps {
  title: string;
  period: string;
  role: string;
  tasks: string[];
  tools: string[];
  results?: string[];
  language?: 'es' | 'en';
}

const CardContainer = styled.div`
  margin-bottom: 2rem;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: ${props => (props.theme.mode === 'dark' ? '#FFFFFF' : '#333333')};
  font-family: 'Inter', sans-serif;
  font-weight: 600;
`;

const Period = styled.p`
  font-size: 0.9rem;
  color: ${props => (props.theme.mode === 'dark' ? '#B8B8B8' : '#666666')};
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
`;

const Role = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: ${props => (props.theme.mode === 'dark' ? '#E0E0E0' : '#444444')};
  font-family: 'Inter', sans-serif;
  font-weight: 500;
`;

const SectionTitle = styled.h5`
  font-size: 1rem;
  margin: 1rem 0 0.5rem 0;
  color: ${props => (props.theme.mode === 'dark' ? '#CCCCCC' : '#555555')};
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  text-transform: none;
`;

const List = styled.ul`
  padding-left: 1.5rem;
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
`;

const ListItem = styled.li`
  margin-bottom: 0.5rem;
  color: ${props => (props.theme.mode === 'dark' ? '#AAAAAA' : '#666666')};
  font-size: 0.95rem;
  line-height: 1.6;
`;

const ToolsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const Tool = styled.span`
  background-color: ${props => (props.theme.mode === 'dark' ? '#2D2F33' : '#EEEEEE')};
  color: ${props => (props.theme.mode === 'dark' ? '#CCCCCC' : '#555555')};
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-family: 'Inter', sans-serif;
`;

const ExperienceCard: React.FC<ExperienceCardProps> = ({
  title,
  period,
  role,
  tasks,
  tools,
  results,
  language = 'es',
}) => {
  // const { themeMode } = useTheme(); // Eliminado

  const translations = {
    tasks: {
      es: 'Tareas',
      en: 'Tasks',
    },
    tools: {
      es: 'Herramientas',
      en: 'Tools',
    },
    results: {
      es: 'Resultados',
      en: 'Results',
    },
  };

  return (
    <CardContainer>
      <CardTitle>{title}</CardTitle>
      <Period>{period}</Period>
      <Role>{role}</Role>

      <SectionTitle>{translations.tasks[language]}</SectionTitle>
      <List>
        {tasks.map((task, index) => (
          <ListItem key={index}>{task}</ListItem>
        ))}
      </List>

      <SectionTitle>{translations.tools[language]}</SectionTitle>
      <ToolsContainer>
        {tools.map((tool, index) => (
          <Tool key={index}>{tool}</Tool>
        ))}
      </ToolsContainer>

      {results && results.length > 0 && (
        <>
          <SectionTitle>{translations.results[language]}</SectionTitle>
          <List>
            {results.map((result, index) => (
              <ListItem key={index}>{result}</ListItem>
            ))}
          </List>
        </>
      )}
    </CardContainer>
  );
};

export default ExperienceCard;
