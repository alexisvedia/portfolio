import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../../context/ThemeContext';
import ExperienceCard, { ExperienceCardProps } from './ExperienceCard';

interface MarketingExperiencesProps {
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
    background: linear-gradient(90deg, #6366F1 0%, #A855F7 100%);
    border-radius: 2px;
  }
`;

const MarketingExperiences: React.FC<MarketingExperiencesProps> = ({ experiences, language = 'es' }) => {
  const { themeMode } = useTheme();
  
  const translations = {
    title: {
      es: 'Experiencias en Marketing',
      en: 'Marketing Experiences'
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

export default MarketingExperiences; 