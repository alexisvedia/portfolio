import React from 'react';
import styled from 'styled-components';
// Asumimos que ThemeMode y useTheme están correctamente exportados y las rutas son válidas
import { ThemeMode, useTheme } from '../../context/ThemeContext'; 

// Definición de la estructura de datos que espera el componente
export interface FrontendExperienceData {
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
  experience: FrontendExperienceData;
  isDark: boolean; // isDark se pasará como prop para evitar llamar a useTheme aquí directamente
                 // y mantener el componente más puro si es posible, aunque también podría obtenerse de useTheme.
}

const ExperienceCard = styled.div<{ $isDark: boolean }>`
  background-color: ${({ $isDark, theme }) =>
    $isDark ? theme.colors.backgroundSecondaryDark : theme.colors.backgroundSecondaryLight};
  border: 1px solid ${({ $isDark, theme }) => ($isDark ? theme.colors.borderDark : theme.colors.borderLight)};
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease-in-out;
  margin-bottom: 2rem;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }

  @media (max-width: 767px) {
    padding: 1.5rem;
  }
`;

const ExperienceHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const ExperienceRoleTitle = styled.h3<{ $isDark: boolean }>`
  font-family: 'NHaasGroteskTXPro-65Md', 'Inter', sans-serif;
  font-size: 1.5rem;
  color: ${({ $isDark, theme }) => ($isDark ? theme.colors.textTitleDark : theme.colors.textTitleLight)};
  margin-bottom: 0.25rem;
`;

const ExperienceRoleSubtitle = styled.h4<{ $isDark: boolean }>`
  font-family: 'NHaasGroteskTXPro-55Rg', 'Inter', sans-serif;
  font-size: 1.1rem;
  color: ${({ $isDark, theme }) => ($isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondaryLight)};
  margin-bottom: 0.25rem;
  font-weight: 500;
`;

const ExperiencePeriod = styled.p<{ $isDark: boolean }>`
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: ${({ $isDark, theme }) => ($isDark ? theme.colors.textTertiaryDark : theme.colors.textTertiaryLight)};
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
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: ${({ $isDark, theme }) => ($isDark ? theme.colors.textSecondaryDark : theme.colors.textSecondaryLight)};
  margin-bottom: 0.75rem;
  padding-bottom: 0.25rem;
  border-bottom: 1px solid ${({ $isDark, theme }) => ($isDark ? theme.colors.borderDark : theme.colors.borderLight)};
  display: inline-block;
`;

const ExperienceList = styled.ul`
  list-style-position: outside;
  padding-left: 1.5rem;
  margin: 0;
`;

const ExperienceListItem = styled.li<{ $isDark: boolean }>`
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: ${({ $isDark, theme }) => ($isDark ? theme.colors.textDark : theme.colors.textLight)};
  line-height: 1.7;
  margin-bottom: 0.5rem;

  &::marker {
    color: ${({ $isDark, theme }) => ($isDark ? theme.colors.accentDark : theme.colors.accentLight)};
  }
`;

const FrontendDevelopmentExperienceFc: React.FC<FrontendDevelopmentExperienceProps> = ({ experience, isDark }) => {
  if (!experience) return null;

  return (
    <ExperienceCard $isDark={isDark}>
      <ExperienceHeader>
        <ExperienceRoleTitle $isDark={isDark}>{experience.cardTitle}</ExperienceRoleTitle>
        <ExperienceRoleSubtitle $isDark={isDark}>{experience.subtitle}</ExperienceRoleSubtitle>
        <ExperiencePeriod $isDark={isDark}>{experience.period}</ExperiencePeriod>
      </ExperienceHeader>

      {experience.tasks && experience.tasks.length > 0 && (
        <ExperienceSection>
          <ExperienceListTitle $isDark={isDark}>{experience.tasksTitle}</ExperienceListTitle>
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
          <ExperienceList>
            {experience.tools.map((tool, index) => (
              <ExperienceListItem key={`tool-${index}`} $isDark={isDark}>{tool}</ExperienceListItem>
            ))}
          </ExperienceList>
        </ExperienceSection>
      )}

      {experience.results && experience.results.length > 0 && (
        <ExperienceSection>
          <ExperienceListTitle $isDark={isDark}>{experience.resultsTitle}</ExperienceListTitle>
          <ExperienceList>
            {experience.results.map((result, index) => (
              <ExperienceListItem key={`result-${index}`} $isDark={isDark}>{result}</ExperienceListItem>
            ))}
          </ExperienceList>
        </ExperienceSection>
      )}
    </ExperienceCard>
  );
};

export { FrontendDevelopmentExperienceFc as FrontendDevelopmentExperience }; 