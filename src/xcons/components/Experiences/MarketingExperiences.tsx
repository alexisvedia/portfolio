import React from 'react';
import styled, { css } from 'styled-components';
import ExperienceCard, { ExperienceCardProps } from './ExperienceCard';

interface MarketingExperiencesProps {
  title: React.ReactNode;
  experiences: Omit<ExperienceCardProps, 'language'>[];
  language?: 'es' | 'en';
  isDark?: boolean;
}

const glassEffect = css`
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  will-change: backdrop-filter;
`;

const SectionContainer = styled.div< { $isDark?: boolean } >`
  margin: 2rem 0;
  border-radius: 12px;
  padding: 2.5rem;
  border: 1px solid ${({ $isDark }) => $isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'};
  background: ${({ $isDark }) => ($isDark ? 'rgba(40, 40, 45, 0.7)' : 'rgba(245, 245, 250, 0.75)')};
  ${glassEffect}
  color: ${({ theme }) => theme.colors.text};

  & > *:first-child {
    margin-bottom: 0.75rem;
  }
`;

const DividerLine = styled.hr< { $isDark?: boolean } >`
  width: 100%;
  border: none;
  height: 1px;
  background-color: ${({ $isDark, theme }) => $isDark ? theme.colors.border + '55' : theme.colors.border + '88'};
  margin-top: 0.75rem;
  margin-bottom: 1.5rem;
`;

const MarketingExperiences: React.FC<MarketingExperiencesProps> = ({
  title,
  experiences,
  language = 'es',
  isDark = false,
}) => {
  return (
    <SectionContainer $isDark={isDark}>
      {title}
      <DividerLine $isDark={isDark} />
      {experiences.map((experience, index) => (
        <ExperienceCard key={index} {...experience} language={language} />
      ))}
    </SectionContainer>
  );
};

export default MarketingExperiences;
