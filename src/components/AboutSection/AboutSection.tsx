import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import profileImage from '../../assets/profile-image.webp';

const SectionContainer = styled.section`
  padding: ${({ theme }) => theme.space.xl};
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: 16px;
  margin: 2rem auto;
  max-width: 1200px;
`;

const SectionTitle = styled.h2`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  align-items: center;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ImageContainer = styled.div`
  height: 300px;
  width: 300px;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  margin: 0 auto;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const BioText = styled.p`
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.9;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ExperienceSection = styled.div`
  margin-top: 3rem;
`;

const ExperienceTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

const JobContainer = styled.div`
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: ${({ theme }) => theme.isDark ? 'rgba(60, 60, 80, 0.3)' : 'rgba(240, 240, 245, 0.5)'};
  border-radius: 0.8rem;
  border: 1px solid ${({ theme }) => theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px ${({ theme }) => theme.isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

const JobTitle = styled.h4`
  font-size: 1.4rem;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const Company = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const JobDescription = styled.ul`
  padding-left: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  opacity: 0.9;
  
  li {
    margin-bottom: 0.5rem;
  }
`;

const TechSection = styled.div`
  margin-top: 3rem;
`;

const TechTitle = styled.h3`
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

const TechGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  }
`;

const TechItem = styled.div`
  background: ${({ theme }) => theme.isDark ? 'rgba(60, 60, 80, 0.3)' : 'rgba(240, 240, 245, 0.5)'};
  border-radius: 8px;
  padding: 1rem;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 25px ${({ theme }) => theme.isDark ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.1)'};
  }
`;

const TechName = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  margin-top: 0.5rem;
`;

const AboutSection: React.FC = () => {
  const { t } = useTranslation();

  return (
    <SectionContainer id="about">
      <SectionTitle>{t('navbar.about')}</SectionTitle>
      
      <ContentWrapper>
        <ImageContainer>
          <ProfileImage src={profileImage} alt={t('navbar.about')} />
        </ImageContainer>
        
        <div>
          <BioText>{t('about.bio.part1')}</BioText>
          <BioText>{t('about.bio.part2')}</BioText>
        </div>
      </ContentWrapper>
      
      <ExperienceSection>
        <ExperienceTitle>{t('about.professionalExperience')}</ExperienceTitle>
        
        <JobContainer>
          <JobTitle>{t('about.jobs.fullStackEngineer')}</JobTitle>
          <Company>{t('about.jobs.fusionOS')}</Company>
          <JobDescription>
            {(t('about.jobDescriptions.fusionOS', { returnObjects: true }) as string[]).map(
              (description: string, index: number) => (
                <li key={index}>{description}</li>
              )
            )}
          </JobDescription>
        </JobContainer>
        
        <JobContainer>
          <JobTitle>{t('about.jobs.uiUxDesigner')}</JobTitle>
          <Company>{t('about.jobs.xcons')}</Company>
          <JobDescription>
            {(t('about.jobDescriptions.xcons', { returnObjects: true }) as string[]).map(
              (description: string, index: number) => (
                <li key={index}>{description}</li>
              )
            )}
          </JobDescription>
        </JobContainer>
      </ExperienceSection>
      
      <TechSection>
        <TechTitle>{t('skills.title')}</TechTitle>
        <TechGrid>
          {['React', 'TypeScript', 'Node.js', 'GraphQL', 'Next.js', 'CSS/SASS', 'Redux', 'MongoDB', 'Express', 'Figma', 'Git', 'Docker'].map((tech, index) => (
            <TechItem key={index}>
              <TechName>{tech}</TechName>
            </TechItem>
          ))}
        </TechGrid>
      </TechSection>
    </SectionContainer>
  );
};

export default AboutSection; 