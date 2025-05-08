import React from 'react';
import styled from 'styled-components';
import ExperienceCard, { ExperienceCardProps } from './ExperienceCard';

interface MarketingExperiencesProps {
  title: React.ReactNode;
  experiences: Omit<ExperienceCardProps, 'language'>[];
  language?: 'es' | 'en';
}

const SectionContainer = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
`;

const MarketingExperiences: React.FC<MarketingExperiencesProps> = ({
  title,
  experiences,
  language = 'es',
}) => {
  return (
    <SectionContainer>
      {title}
      {experiences.map((experience, index) => (
        <ExperienceCard key={index} {...experience} language={language} />
      ))}
    </SectionContainer>
  );
};

export default MarketingExperiences;
