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
  margin-top: 0.75rem;
  margin-bottom: 1.5rem;
`;

const ExperienceContentWrapper = styled.div<{ $isDark: boolean }>`
  // Aquí podrían ir estilos específicos si la tarjeta interna necesitara diferenciarse
`;

const ExperienceHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const ExperienceRoleTitle = styled.h3<{ $isDark: boolean }>`
  font-family: 'NHaasGroteskTXPro-65Md', 'Inter', sans-serif;
  font-size: 1.5rem;
  color: ${({ $isDark }) => ($isDark ? '#FFFFFF' : '#1D1F23')};
  margin-bottom: 0.25rem;
`;

const ExperienceRoleSubtitle = styled.h4<{ $isDark: boolean }>`
  font-family: 'NHaasGroteskTXPro-55Rg', 'Inter', sans-serif;
  font-size: 1.1rem;
  color: ${({ $isDark }) => ($isDark ? '#E0E0E0' : '#1D1F23')};
  margin-bottom: 0.25rem;
  font-weight: 500;
`;

const ExperiencePeriod = styled.p<{ $isDark: boolean }>`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: ${({ $isDark }) => ($isDark ? '#CCCCCC' : '#333333')};
  margin-bottom: 1rem;
`;

const ExperienceSection = styled.div`
  margin-bottom: 1.5rem;
  &:last-child {
    margin-bottom: 0;
  }
`;

const ExperienceListTitle = styled.h5<{ $isDark: boolean }>`
  font-family: 'NHaasGroteskTXPro-55Rg', 'Inter', sans-serif;
  font-size: 1rem;
  text-transform: none;
  letter-spacing: 0.5px;
  color: ${({ $isDark }) => ($isDark ? '#E0E0E0' : '#1D1F23')};
  margin-bottom: 0.75rem;
`;

const ExperienceList = styled.ul`
  list-style-position: outside;
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 0;
  margin-bottom: 1.5rem;
`;

const ExperienceListItem = styled.li<{ $isDark: boolean }>`
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: ${({ $isDark }) => ($isDark ? '#CCCCCC' : '#333333')};
  line-height: 1.7;
  margin-bottom: 0.5rem;

  &::marker {
    color: ${({ $isDark, theme }) => ($isDark ? theme.colors.accent : theme.colors.accent)};
  }
`;

const ToolsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Tool = styled.span<{ $isDark: boolean }>`
  background-color: ${({ $isDark }) => ($isDark ? '#2D2F33' : '#EEEEEE')};
  color: ${({ $isDark }) => ($isDark ? '#CCCCCC' : '#333333')};
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
      <ExperienceContentWrapper $isDark={isDark}>
        <ExperienceHeader>
          <ExperienceRoleTitle $isDark={isDark}>{experience.cardTitle}</ExperienceRoleTitle>
          <ExperienceRoleSubtitle $isDark={isDark}>{experience.subtitle}</ExperienceRoleSubtitle>
          <ExperiencePeriod $isDark={isDark}>{experience.period}</ExperiencePeriod>
        </ExperienceHeader>

        {experience.tasks && experience.tasks.length > 0 && (
          <ExperienceSection>
            <ExperienceListTitle $isDark={isDark}>{experience.tasksTitle}</ExperienceListTitle>
            <DividerLine $isDark={isDark} />
            <ExperienceList>
              {experience.tasks.map((task, index) => (
                <ExperienceListItem key={`task-${index}`} $isDark={isDark}>{task}</ExperienceListItem>
              ))}
            </ExperienceList>
          </ExperienceSection>
        )}

        {experience.tools && experience.tools.length > 0 && (
          <ExperienceSection>
            <ExperienceListTitle $isDark={isDark}>{experience.toolsTitle}</ExperienceListTitle>
            <DividerLine $isDark={isDark} />
            <ToolsContainer>
              {experience.tools.map((tool, index) => (
                <Tool key={`tool-${index}`} $isDark={isDark}>{tool}</Tool>
              ))}
            </ToolsContainer>
          </ExperienceSection>
        )}

        {experience.results && experience.results.length > 0 && (
          <ExperienceSection>
            <ExperienceListTitle $isDark={isDark}>{experience.resultsTitle}</ExperienceListTitle>
            <DividerLine $isDark={isDark} />
            <ExperienceList>
              {experience.results.map((result, index) => (
                <ExperienceListItem key={`result-${index}`} $isDark={isDark}>{result}</ExperienceListItem>
              ))}
            </ExperienceList>
          </ExperienceSection>
        )}
      </ExperienceContentWrapper>
    </SectionContainer>
  );
};

export { FrontendDevelopmentExperienceFc as FrontendDevelopmentExperience }; 