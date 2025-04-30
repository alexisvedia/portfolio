import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

interface Skill {
  name: string;
  level: number; // 0-100
  icon?: string;
}

interface SkillCategory {
  title: string;
  skills: Skill[];
}

const SectionContainer = styled.section`
  padding: ${({ theme }) => theme.space['2xl']} 0;
  background-color: ${({ theme }) => theme.isDark 
    ? `${theme.colors.secondary}99` 
    : `${theme.colors.secondary}66`};
  transition: background-color 0.3s ease;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space.xl};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
`;

const CategoriesContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.space.xl};
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.space.lg};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const CategoryCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 12px;
  padding: ${({ theme }) => theme.space.lg};
  box-shadow: 0 4px 20px ${({ theme }) => theme.isDark 
    ? 'rgba(0, 0, 0, 0.2)' 
    : 'rgba(0, 0, 0, 0.08)'};
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
`;

const CategoryTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.xl};
  margin-bottom: ${({ theme }) => theme.space.lg};
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  font-weight: 600;
`;

const SkillsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
`;

const SkillItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const SkillHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.space.xs};
`;

const SkillName = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const SkillLevel = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => `${theme.colors.text}99`};
`;

const ProgressBarContainer = styled.div`
  height: 8px;
  background-color: ${({ theme }) => `${theme.colors.text}22`};
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBar = styled.div<{ $level: number }>`
  height: 100%;
  width: ${({ $level }) => `${$level}%`};
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
`;

// Datos de ejemplo para habilidades
const skillsData: SkillCategory[] = [
  {
    title: 'Desarrollo Frontend',
    skills: [
      { name: 'React', level: 95 },
      { name: 'TypeScript', level: 90 },
      { name: 'HTML/CSS', level: 98 },
      { name: 'Styled Components', level: 85 },
      { name: 'Redux', level: 80 },
    ],
  },
  {
    title: 'Diseño UX/UI',
    skills: [
      { name: 'Figma', level: 90 },
      { name: 'Adobe XD', level: 85 },
      { name: 'Sketch', level: 75 },
      { name: 'Wireframing', level: 95 },
      { name: 'Prototyping', level: 85 },
    ],
  },
  {
    title: 'Desarrollo Backend',
    skills: [
      { name: 'Node.js', level: 75 },
      { name: 'Express', level: 70 },
      { name: 'MongoDB', level: 65 },
      { name: 'Firebase', level: 80 },
      { name: 'RESTful APIs', level: 85 },
    ],
  },
];

const SkillsSection: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <SectionContainer id="skills">
      <SectionTitle>{t('skills')}</SectionTitle>
      <CategoriesContainer>
        {skillsData.map((category, categoryIndex) => (
          <CategoryCard key={categoryIndex}>
            <CategoryTitle>{category.title}</CategoryTitle>
            <SkillsList>
              {category.skills.map((skill, skillIndex) => (
                <SkillItem key={skillIndex}>
                  <SkillHeader>
                    <SkillName>{skill.name}</SkillName>
                    <SkillLevel>{skill.level}%</SkillLevel>
                  </SkillHeader>
                  <ProgressBarContainer>
                    <ProgressBar $level={skill.level} />
                  </ProgressBarContainer>
                </SkillItem>
              ))}
            </SkillsList>
          </CategoryCard>
        ))}
      </CategoriesContainer>
    </SectionContainer>
  );
};

export default SkillsSection; 