import React from 'react';
import styled, { css } from 'styled-components';

// Definición de la estructura de datos que espera el componente
export interface FrontendExperienceCardData {
  cardTitle: string;
  subtitle: string;
  period: string;
  tasksTitle: string;
  tasks: string[];
  toolsTitle: string;
  tools: string[];
  resultsTitle: string;
  results: string[];
}

interface FrontendDevelopmentExperienceProps {
  title: React.ReactNode;
  experience: FrontendExperienceCardData;
  isDark: boolean;
}

const glassEffect = css`
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  will-change: backdrop-filter;
`;

const SectionContainer = styled.div<{ $isDark: boolean }>`
  margin: 2rem 0;
  border-radius: 12px;
  padding: 2.5rem;
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)')};
  background: ${({ $isDark }) => ($isDark ? 'rgba(40, 40, 45, 0.7)' : 'rgba(245, 245, 250, 0.75)')};
  ${glassEffect}
  color: ${({ theme }) => theme.colors.text};

  & > *:first-child {
    margin-bottom: 0.75rem;
  }

  @media (max-width: 767px) {
    padding: 0;
    border: none;
    background: none;
    border-radius: 0;
    margin: 1rem 0;
  }
`;

const DividerLine = styled.hr<{ $isDark?: boolean }>`
  width: 100%;
  border: none;
  height: 1px;
  background-color: ${({ $isDark, theme }) =>
    $isDark ? theme.colors.border + '55' : theme.colors.border + '88'};
  margin-top: 0.25rem;
  margin-bottom: 1rem;
`;

const ExperienceContentWrapper = styled.div`
  margin-bottom: 2rem;
`;

const ExperienceRoleTitle = styled.h3<{ $isDark: boolean }>`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: ${props => (props.$isDark ? '#FFFFFF' : '#1D1F23')};
  font-family: 'Inter', sans-serif;
  font-weight: 600;
`;

const ExperienceRoleSubtitle = styled.h4<{ $isDark: boolean }>`
  font-size: 1.1rem;
  margin-bottom: 1rem;
  color: ${props => (props.$isDark ? '#FFFFFF' : '#1D1F23')};
  font-family: 'Inter', sans-serif;
  font-weight: 500;
`;

const ExperiencePeriod = styled.p<{ $isDark: boolean }>`
  font-size: 0.9rem;
  color: ${props => (props.$isDark ? '#FFFFFF' : '#1D1F23')};
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
`;

const ExperienceListTitle = styled.h5<{ $isDark: boolean }>`
  font-size: 1rem;
  margin: 1rem 0 0.25rem 0;
  color: ${props => (props.$isDark ? '#FFFFFF' : '#1D1F23')};
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  text-transform: none;
`;

const ExperienceList = styled.ul`
  padding-left: 1.5rem;
  margin-bottom: 1rem;
  font-family: 'Inter', sans-serif;
  list-style: disc;
`;

const ExperienceListItem = styled.li<{ $isDark: boolean }>`
  margin-bottom: 0.5rem;
  color: ${props => (props.$isDark ? '#FFFFFF' : '#1D1F23')};
  font-size: 0.95rem;
  line-height: 1.6;
`;

const ToolsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const Tool = styled.span<{ $isDark: boolean }>`
  background-color: ${props => (props.$isDark ? '#2D2F33' : '#EEEEEE')};
  color: ${props => (props.$isDark ? '#FFFFFF' : '#1D1F23')};
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-family: 'Inter', sans-serif;
`;

const FrontendDevelopmentExperienceFc: React.FC<FrontendDevelopmentExperienceProps> = ({ title, experience, isDark }) => {
  if (!experience) return null;

  return (
    <SectionContainer $isDark={isDark}>
      {title}
      <DividerLine $isDark={isDark} />
      <ExperienceContentWrapper>
        <ExperienceRoleTitle $isDark={isDark}>{experience.cardTitle}</ExperienceRoleTitle>
        <ExperiencePeriod $isDark={isDark}>{experience.period}</ExperiencePeriod>
        <ExperienceRoleSubtitle $isDark={isDark}>{experience.subtitle}</ExperienceRoleSubtitle>

        {experience.tasks && experience.tasks.length > 0 && (
          <>
            <ExperienceListTitle $isDark={isDark}>{experience.tasksTitle}</ExperienceListTitle>
            <DividerLine $isDark={isDark} />
            <ExperienceList>
              {experience.tasks.map((task, index) => (
                <ExperienceListItem key={`task-${index}`} $isDark={isDark}>{task}</ExperienceListItem>
              ))}
            </ExperienceList>
          </>
        )}

        {experience.tools && experience.tools.length > 0 && (
          <>
            <ExperienceListTitle $isDark={isDark}>{experience.toolsTitle}</ExperienceListTitle>
            <DividerLine $isDark={isDark} />
            <ToolsContainer>
              {experience.tools.map((tool, index) => (
                <Tool key={`tool-${index}`} $isDark={isDark}>{tool}</Tool>
              ))}
            </ToolsContainer>
          </>
        )}

        {experience.results && experience.results.length > 0 && (
          <>
            <ExperienceListTitle $isDark={isDark}>{experience.resultsTitle}</ExperienceListTitle>
            <DividerLine $isDark={isDark} />
            <ExperienceList>
              {experience.results.map((result, index) => (
                <ExperienceListItem key={`result-${index}`} $isDark={isDark}>{result}</ExperienceListItem>
              ))}
            </ExperienceList>
          </>
        )}
      </ExperienceContentWrapper>
    </SectionContainer>
  );
};

export { FrontendDevelopmentExperienceFc as FrontendDevelopmentExperience }; 