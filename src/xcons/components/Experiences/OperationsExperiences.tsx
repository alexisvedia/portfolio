import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../../context/ThemeContext';
import ExperienceCard, { ExperienceCardProps } from './ExperienceCard';

interface OperationsExperiencesProps {
  experiences: Omit<ExperienceCardProps, 'language'>[];
  language?: 'es' | 'en';
}

const SectionContainer = styled.div`
  margin: 2rem 0;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme === 'dark' ? '#FFFFFF' : '#333333'};
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #3B82F6 0%, #10B981 100%);
    border-radius: 2px;
  }
`;

const OperationsExperiences: React.FC<OperationsExperiencesProps> = ({ experiences, language = 'es' }) => {
  const { themeMode } = useTheme();
  
  const translations = {
    title: {
      es: 'Experiencias en Operaciones',
      en: 'Operations Experiences'
    }
  };
  
  return (
    <SectionContainer>
      <SectionTitle theme={themeMode}>{translations.title[language]}</SectionTitle>
      {experiences.map((experience, index) => (
        <ExperienceCard
          key={index}
          {...experience}
          language={language}
        />
      ))}
    </SectionContainer>
  );
};

export default OperationsExperiences; 