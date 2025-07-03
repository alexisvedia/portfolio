import React from 'react';
import styled, { css } from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import PageTransition from '@components/PageTransition/PageTransition';
import fusionAdsFondo from '../assets/Proyectos Fusion/Fusion-fondo.png';
import fusionAdsLogo from '../assets/Proyectos Fusion/Logo-color-fusion.png';
import fusionAdsAppImage from '../assets/Proyectos Fusion/fusion-app.png';

import { FrontendDevelopmentExperience } from './components/FrontendDevelopmentExperience';
import type { FrontendExperienceCardData } from './components/FrontendDevelopmentExperience';
import { frontendDevelopmentExperienceData } from './data/experiencesData';
import StandardSectionTitle from '../components/shared/StandardSectionTitle';
import { MasonryFusion } from './components/MasonryFusion';
import { fusionProjectsData } from './data/fusionProjectsData';

const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  padding-top: 4rem;
`;

const FusionAdsBanner = styled.div`
  position: relative;
  width: 100%;
  background-color: white;
  display: flex;
  align-items: center;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  margin-bottom: 3rem;
  overflow: hidden;
  min-height: 180px;
`;

const BannerBackground = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
  background-image: url(${fusionAdsFondo});

  background-repeat: no-repeat;
  background-position: center center;
  background-size: 600px auto;
  opacity: 0.5;
`;

const BannerContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 50px;
  width: 100%;
  position: relative;
  z-index: 2;
  padding: 10px 30px;

  @media (max-width: 992px) {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }
`;

const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 60%;

  @media (max-width: 992px) {
    max-width: 100%;
    align-items: center;
  }
`;

const LogoImage = styled.img`
  max-width: 230px;
  margin-bottom: 15px;
`;

const BannerText = styled.p`
  font-size: 1rem;
  color: #333;
  max-width: 500px;
  line-height: 1.6;
  margin-bottom: 10px;

  a {
    color: #007bff;
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }
`;

const LocationText = styled.span`
  color: #666;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
`;

const StyledSiteButton = styled.a`
  display: inline-block;
  background-color: #F7480B;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  margin-top: 8px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #D9400A;
    text-decoration: none;
  }
`;

const RightContent = styled.div`
  max-width: 35%;

  @media (max-width: 992px) {
    max-width: 70%;
    margin-top: 20px;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    display: block;
  }
`;


const Summary = styled.div<{ $themeMode: ThemeMode }>`
  margin: 3rem auto;
  max-width: 100%;
`;

const glassEffectForDescriptionBox = css`
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  will-change: backdrop-filter;
`;

const SectionTitleInsideBox = styled.h3<{ $isDark: boolean }>`
  font-weight: 600;
  font-size: 1.6rem;
  color: ${({ $isDark }) => ($isDark ? '#FFFFFF' : '#1D1F23')};
  margin-bottom: 0.75rem;
  text-transform: uppercase;
`;

const DividerLine = styled.hr<{ $isDark?: boolean }>`
  width: 100%;
  border: none;
  height: 1px;
  background-color: ${({ $isDark }) =>
    $isDark
      ? 'rgba(255,255,255,0.2)'
      : 'rgba(0,0,0,0.15)'};
  margin-top: 0.75rem;
  margin-bottom: 1.5rem;
`;

const DescriptionBox = styled.div<{ $isDark: boolean }>`
  border-radius: 12px;
  padding: 2.5rem;
  margin-top: 1rem;
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)')};
  background: ${({ $isDark }) => ($isDark ? 'rgba(40, 40, 45, 0.7)' : 'rgba(245, 245, 250, 0.75)')};
  ${glassEffectForDescriptionBox}

  @media (max-width: 767px) {
    padding: 0;
    border: none;
    background: none;
    border-radius: 0;
    margin-top: 0.5rem;
  }
`;

const SummaryText = styled.p<{ $isDark: boolean }>`
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 0;
  color: ${({ $isDark }) => ($isDark ? '#DDDDDD' : '#444444')};
`;


const ExperienceContainer = styled.div`
  display: flex; 
  flex-direction: column;
  gap: 3rem; 
  margin-top: 3rem; 
`;


const MasonryWrapper = styled.div<{ $isDark?: boolean }>`
  margin-top: 4rem;
  margin-bottom: 2rem;
  border-radius: 12px;
  padding: 2.5rem;
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)')};
  background: ${({ $isDark }) => ($isDark ? 'rgba(40, 40, 45, 0.7)' : 'rgba(245, 245, 250, 0.75)')};
  ${glassEffectForDescriptionBox}
  color: ${({ theme }) => theme.colors.text};

  & > *:first-child {
    margin-bottom: 0.75rem;
  }

  @media (max-width: 767px) {
    padding: 0;
    border: none;
    background: none;
    border-radius: 0;
    margin-top: 2rem;
  }
`;

const FusionAdsPage: React.FC = () => {
  const { themeMode } = useTheme();
  const { t, i18n } = useTranslation('fusionads');
  const [searchParams, setSearchParams] = useSearchParams();
  const language = i18n.language.startsWith('en') ? 'en' : 'es';
  const isDark = themeMode === 'dark';
  

  const initialProject = searchParams.get('project');

  const bannerUrl = "https://backoffice.fusionos.ai";

  const bannerSectionTexts = {
    description: {
      es: 'FusionAds.ai es una plataforma de publicidad generativa impulsada por inteligencia artificial que genera anuncios profesionales omni-canal.',
      en: 'FusionAds.ai is an AI-powered generative advertising platform that creates professional omni-channel ads.'
    },
    location: {
      es: 'Estados Unidos',
      en: 'United States'
    },
    visitSiteButton: {
      es: 'Visitar sitio',
      en: 'Visit site'
    }
  };


  const roleSummaryTexts = {
    title: {
      es: "Resumen de Rol",
      en: "Role Summary"
    },
    description: {
      es: `Como Desarrollador Front-End en React y TypeScript, trabajé en la creación y mejora de componentes reutilizables, colaborando con el equipo para optimizar flujos críticos y garantizar la coherencia entre desktop y mobile. Mantuve e implementé soluciones en código legacy, adaptando componentes antiguos a nuevas necesidades sin afectar el rendimiento.\n\nIntegré servicios del backend con la interfaz, implementando validaciones con Zod y gestionando communications con APIs externas. Además, mejoré la experiencia del usuario en formularios dinámicos y modales, optimizando la visibilidad de elementos según el estado de la campaña.\n\nFui responsable de la gestión del estado global a través de Context API y trabajé en la migración de flujos de campaña, asegurando la coexistencia de componentes viejos y nuevos, siempre priorizando la escalabilidad y mantenibilidad del proyecto.`,
      en: `As a Front-End Developer in React and TypeScript, I worked on creating and improving reusable components, collaborating with the team to optimize critical flows and ensure consistency between desktop and mobile. I maintained and implemented solutions in legacy code, adapting old components to new needs without affecting performance.\n\nI integrated backend services with the interface, implementing validations with Zod and managing communications with external APIs. Additionally, I improved the user experience in dynamic forms and modals, optimizing the visibility of elements according to the campaign status.\n\nI was responsible for global state management through the Context API and worked on migrating campaign flows, ensuring the coexistence of old and new components, always prioritizing the scalability and maintainability of the project.`
    }
  };


  const currentExperienceData = frontendDevelopmentExperienceData[language] as FrontendExperienceCardData;
  const experienceSectionTitleText = frontendDevelopmentExperienceData[language].sectionTitle;

  return (
    <PageTransition>
      <PageContainer>
        <FusionAdsBanner>
          <BannerBackground />
          <BannerContent>
            <LeftContent>
              <LogoImage src={fusionAdsLogo} alt={t('fusionadsBanner.logoAlt', 'FusionAds.ai Logo')} />
              <BannerText>
                {bannerSectionTexts.description[language]}
              </BannerText>
              <LocationText>{bannerSectionTexts.location[language]}</LocationText>
              <StyledSiteButton href={bannerUrl} target="_blank" rel="noopener noreferrer">
                {bannerSectionTexts.visitSiteButton[language]}
              </StyledSiteButton>
            </LeftContent>
            <RightContent>
              <img src={fusionAdsAppImage} alt={t('fusionadsBanner.appImageAlt', 'FusionAds Application Screenshot')} />
            </RightContent>
          </BannerContent>
        </FusionAdsBanner>


        <Summary $themeMode={themeMode}>
          <DescriptionBox $isDark={isDark}>
            <SectionTitleInsideBox $isDark={isDark}>
              {roleSummaryTexts.title[language]}
            </SectionTitleInsideBox>
            <DividerLine $isDark={isDark} />
            <SummaryText $isDark={isDark}>
              {roleSummaryTexts.description[language]}
            </SummaryText>
          </DescriptionBox>
        </Summary>


        <ExperienceContainer>
          <FrontendDevelopmentExperience
            title={<StandardSectionTitle>{experienceSectionTitleText}</StandardSectionTitle>}
            experience={currentExperienceData}
            isDark={isDark}
          />
        </ExperienceContainer>


        <MasonryWrapper $isDark={isDark}>
          <StandardSectionTitle style={{ textAlign: 'left' }}>
            {language === 'en' ? 'Featured Projects' : 'Proyectos Destacados'}
          </StandardSectionTitle>
          <DividerLine $isDark={isDark} />
          {fusionProjectsData.length > 0 ? (
            <MasonryFusion 
              data={fusionProjectsData} 
              initialSelectedProject={initialProject}
              onModalStateChange={(isOpen, projectId) => {
                if (isOpen && projectId) {
                  setSearchParams({ project: projectId });
                } else {
                  setSearchParams({});
                }
              }}
            />
          ) : (
            <p>{language === 'en' ? 'Projects will be added here soon.' : 'Próximamente se agregarán proyectos aquí.'}</p>
          )}
        </MasonryWrapper>

      </PageContainer>
    </PageTransition>
  );
};

export default FusionAdsPage;