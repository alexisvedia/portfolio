import React from 'react';
import styled from 'styled-components';



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
  color: ${props => (props.theme.isDark ? '#FFFFFF' : '#1D1F23')};
  font-family: 'Inter', sans-serif;
  font-weight: 600;
`;

const Period = styled.p`
  font-size: 0.9rem;
  color: ${props => (props.theme.isDark ? '#FFFFFF' : '#1D1F23')};
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
`;

const Role = styled.h4`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: ${props => (props.theme.isDark ? '#FFFFFF' : '#1D1F23')};
  font-family: 'Inter', sans-serif;
  font-weight: 500;
`;

const SectionTitle = styled.h5`
  font-size: 1rem;
  margin: 1rem 0 0.25rem 0;
  color: ${props => (props.theme.isDark ? '#FFFFFF' : '#1D1F23')};
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  text-transform: none;
`;

const DividerLine = styled.hr`
  width: 100%;
  border: none;
  height: 1px;
  background-color: ${({ theme }) => theme.isDark ? theme.colors.border + '55' : theme.colors.border + '88'};
  margin-top: 0.25rem;
  margin-bottom: 1rem;
`;

const List = styled.ul`
  padding-left: 1.5rem;
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
  list-style: disc;
`;

const ListItem = styled.li`
  margin-bottom: 0.5rem;
  color: ${props => (props.theme.isDark ? '#FFFFFF' : '#1D1F23')};
  font-size: 0.95rem;
  line-height: 1.6;
`;

const ToolsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tool = styled.span`
  background-color: ${props => (props.theme.isDark ? '#2D2F33' : '#EEEEEE')};
  color: ${props => (props.theme.isDark ? '#FFFFFF' : '#1D1F23')};
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
      <DividerLine />
      <List>
        {tasks.map((task, index) => (
          <ListItem key={`task-${index}`}>{task}</ListItem>
        ))}
      </List>

      <SectionTitle>{translations.tools[language]}</SectionTitle>
      <DividerLine />
      <ToolsContainer>
        {tools.map((tool, index) => (
          <Tool key={`tool-${index}`}>{tool}</Tool>
        ))}
      </ToolsContainer>

      {results && results.length > 0 && (
        <>
          <SectionTitle>{translations.results[language]}</SectionTitle>
          <DividerLine />
          <List>
            {results.map((result, index) => (
              <ListItem key={`result-${index}`}>{result}</ListItem>
            ))}
          </List>
        </>
      )}
    </CardContainer>
  );
};

export default ExperienceCard;
