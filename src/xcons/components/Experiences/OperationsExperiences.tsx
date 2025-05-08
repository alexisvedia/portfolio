import React from 'react';
import styled from 'styled-components';
import ExperienceCard, { ExperienceCardProps } from './ExperienceCard';

interface OperationsExperiencesProps {
  title: React.ReactNode;
  experiences: Omit<ExperienceCardProps, 'language'>[];
  language?: 'es' | 'en';
}

const SectionContainer = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
`;

const OperationsExperiences: React.FC<OperationsExperiencesProps> = ({
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

export default OperationsExperiences;
