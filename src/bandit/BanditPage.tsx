import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { useTranslation } from 'react-i18next';
import banditLogo from '../assets/Proyectos Bandit/Logo Bandit Oscuro.png';
import banditFondo from '../assets/Proyectos Bandit/Bandit-fondo.svg';
import banditApp from '../assets/Proyectos Bandit/Bandit-app.png';
import PageTransition from '@components/PageTransition/PageTransition';
import StandardSectionTitle from '@components/shared/StandardSectionTitle';

const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  padding-top: 4rem;
`;

const BanditBanner = styled.div`
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
  background-image: url(${banditFondo});
  background-repeat: no-repeat;
  background-position: left center;
  background-size: cover;
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
    text-align: center;
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
    color: #F70F43;
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }
`;

const LocationText = styled.span`
  color: #888888;
  font-size: 0.9rem;
  margin-bottom: 8px;
`;

const StyledSiteButton = styled.a`
  display: inline-block;
  background-color: #F70F43;
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  margin-top: 8px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #D90D3A;
    text-decoration: none;
  }
`;

const RightContent = styled.div`
  max-width: 35%;

  @media (max-width: 992px) {
    max-width: 80%;
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;

  @media (min-width: 992px) {
    grid-template-columns: 1fr;
  }
  @media (max-width: 767px) {
    gap: 1.5rem;
    padding: 0;
    background: none;
    border: none;
    border-radius: 0;
  }
`;

// Definimos interfaces para las props y datos
interface ExperienceData {
  title: string;
  period: string;
  tasks: string[];
  tools: string[];
  results: string[];
}

interface UXUIDesignExperienceProps {
  title: React.ReactNode;
  experiences: ExperienceData;
  language: string;
  isDark: boolean;
}

// Componente para la experiencia en Bandit con tipos
const UXUIDesignExperience: React.FC<UXUIDesignExperienceProps> = ({ title, experiences, language, isDark }) => (
  <div>
    <DescriptionBox $isDark={isDark}>
      {title}
      <DividerLine $isDark={isDark} />
      <ExperienceItem $isDark={isDark}>
        <ExperienceHeader>
          <ExperiencePeriod $isDark={isDark}>{experiences.period}</ExperiencePeriod>
        </ExperienceHeader>
        <ExperienceDivider $isDark={isDark} />
        
        <ExperienceSubtitle>{language === 'es' ? 'Tareas:' : 'Tasks:'}</ExperienceSubtitle>
        <ExperienceList>
          {experiences.tasks.map((task: string, index: number) => (
            <ExperienceListItem key={index} $isDark={isDark}>{task}</ExperienceListItem>
          ))}
        </ExperienceList>
        
        <ExperienceSubtitle>{language === 'es' ? 'Herramientas:' : 'Tools:'}</ExperienceSubtitle>
        <ToolsContainer>
          {experiences.tools.map((tool: string, index: number) => (
            <Tool key={index} $isDark={isDark}>{tool}</Tool>
          ))}
        </ToolsContainer>
        
        <ExperienceSubtitle>{language === 'es' ? 'Resultados:' : 'Results:'}</ExperienceSubtitle>
        <ExperienceList>
          {experiences.results.map((result: string, index: number) => (
            <ExperienceListItem key={index} $isDark={isDark}>{result}</ExperienceListItem>
          ))}
        </ExperienceList>
      </ExperienceItem>
    </DescriptionBox>
  </div>
);

// Estilos para los ítems de experiencia
const ExperienceItem = styled.div<{ $isDark: boolean }>`
  padding: 1.5rem 0;
  border-radius: 8px;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)')};
  }
`;

const ExperienceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;

  @media (max-width: 576px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ExperiencePeriod = styled.span<{ $isDark: boolean }>`
  font-size: 0.95rem;
  color: ${props => (props.$isDark ? '#FFFFFF' : '#1D1F23')};
  white-space: nowrap;
  font-weight: 500;
`;

const ExperienceDivider = styled.hr<{ $isDark: boolean }>`
  width: 100%;
  border: none;
  height: 1px;
  background-color: ${({ $isDark }) =>
    $isDark
      ? 'rgba(255,255,255,0.1)'
      : 'rgba(0,0,0,0.05)'};
  margin: 0.8rem 0;
`;

const ExperienceSubtitle = styled.h5`
  font-size: 1rem;
  font-weight: 600;
  margin: 1rem 0 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const ExperienceList = styled.ul`
  padding-left: 1.5rem;
  margin: 0.5rem 0 1.5rem 0;
  list-style: disc;
`;

const ExperienceListItem = styled.li<{ $isDark: boolean }>`
  margin-bottom: 0.5rem;
  color: ${props => (props.$isDark ? '#FFFFFF' : '#1D1F23')};
  line-height: 1.6;
  font-size: 0.95rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const ToolsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const Tool = styled.span<{ $isDark: boolean }>`
  background-color: ${props => (props.$isDark ? '#2D2F33' : '#EEEEEE')};
  color: ${props => (props.$isDark ? '#FFFFFF' : '#1D1F23')};
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.85rem;
`;

const BanditPage: React.FC = () => {
  const { themeMode } = useTheme();
  const { i18n } = useTranslation();
  const language = i18n.language.startsWith('en') ? 'en' : 'es';
  const isDark = themeMode === 'dark';

  const translations = {
    mainTitle: { es: 'Un Vistazo a Bandit', en: 'A Glimpse into Bandit' },
    designTitle: { es: 'Diseño UX/UI', en: 'UX/UI Design' },
    roleSummaryTitle: { es: 'Resumen de Rol', en: 'Role Summary' },
    visitSiteButton: { es: 'Visitar sitio', en: 'Visit site' },
    summary: {
      es: 'Como diseñador UX/UI, trabajé junto a Kodi (CEO de Bandit) para potenciar su plataforma, mejorando su estética y experiencia de usuario. Utilicé Clarity para ver sesiones de usuarios reales, hice pruebas y test para cada propuesta. Discutimos cuál era el mejor camino para cada nueva función, o cómo mejorar aquellas existentes, siempre basándome en los principios del UX. Añadimos tooltips, movimos botones, simplificamos acciones, homogeneizamos modales y secciones, siempre teniendo en cuenta que eran componentes reutilizables a lo largo de toda la plataforma. Mi experiencia como desarrollador me permitió entender mejor los requisitos y desarrollar propuestas más realistas y acordes a las implementaciones finales. La sección más difícil fue sin duda el calendario, que presentaba información y funcionalidades nunca antes vistas en aplicaciones de su tipo. Revisando las sesiones de Clarity pudimos notar qué secciones necesitaban mejoras críticas y cuáles utilizaban más los usuarios.',
      en: 'As a UX/UI designer, I worked alongside Kodi (CEO of Bandit) to enhance their platform, improving its aesthetics and user experience. I used Clarity to view real user sessions, conducted tests for each proposal. We discussed the best approach for each new feature, or how to improve existing ones, always based on UX principles. We added tooltips, moved buttons, simplified actions, and homogenized modals and sections, always considering they were reusable components throughout the platform. My experience as a developer allowed me to better understand requirements and develop more realistic proposals aligned with final implementations. The most challenging section was undoubtedly the calendar, which presented information and functionalities never before seen in applications of its kind. By reviewing Clarity sessions, we could identify which sections needed critical improvements and which ones users utilized most.',
    },
    bannerDescription: {
      es: 'Bandit es una plataforma enfocada en la gestión de giras y conciertos en vivo, diseñada para simplificar la logística tanto para artistas como para managers y agencias.',
      en: 'Bandit is a platform focused on tour and live concert management, designed to simplify logistics for artists, managers, and agencies.',
    },
    location: {
      es: 'España',
      en: 'Spain',
    },
  };

  const uxUIExperiences = {
    es: {
      title: "Diseño UX/UI",
      period: "Febrero 2025 - Actualidad",
      tasks: [
        "Propuestas de rediseño en cada sección de la plataforma",
        "Investigación de la competencia",
        "Desarrollo estético de nuevos componentes",
        "Trabajo en conjunto con el equipo",
        "Mejora de la experiencia general y a detalle",
        "Revisión de sesiones de usuarios reales",
        "Inicio de desarrollo de la propuesta mobile"
      ],
      tools: [
        "Clarity",
        "Figma",
        "Adobe Photoshop"
      ],
      results: [
        "Mejora significativa en la experiencia general de la plataforma",
        "Reducción de carga cognitiva, visual y motora a los usuarios",
        "Menos preguntas frecuentes de parte de los usuarios sobre funcionalidades básicas",
        "Una mejor experiencia a nivel mobile"
      ]
    },
    en: {
      title: "UX/UI Design",
      period: "February 2025 - Present",
      tasks: [
        "Redesign proposals for each platform section",
        "Competitor research",
        "Aesthetic development of new components",
        "Teamwork collaboration",
        "General and detailed experience improvements",
        "Review of real user sessions",
        "Beginning of mobile proposal development"
      ],
      tools: [
        "Clarity",
        "Figma",
        "Adobe Photoshop"
      ],
      results: [
        "Significant improvement in the overall platform experience",
        "Reduction of cognitive, visual, and motor load for users",
        "Fewer frequent questions from users about basic functionalities",
        "Better mobile experience"
      ]
    }
  };

  return (
    <PageTransition>
      <PageContainer>
        <StandardSectionTitle
          as="h1"
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            margin: '-1px',
            padding: 0,
            overflow: 'hidden',
            clip: 'rect(0,0,0,0)',
            border: 0,
          }}
        >
          {translations.mainTitle[language]}
        </StandardSectionTitle>

        <BanditBanner>
          <BannerBackground />
          <BannerContent>
            <LeftContent>
              <LogoImage src={banditLogo} alt="Bandit Logo" />
              <BannerText>
                {translations.bannerDescription[language]}
              </BannerText>
              <LocationText>{translations.location[language]}</LocationText>
              <StyledSiteButton
                href="https://app.bandit.show/"
                target="_blank"
                rel="noopener noreferrer"
              >
                {translations.visitSiteButton[language]}
              </StyledSiteButton>
            </LeftContent>
            <RightContent>
              <img src={banditApp} alt="Bandit App Screenshot" />
            </RightContent>
          </BannerContent>
        </BanditBanner>

        <Summary $themeMode={themeMode}>
          <DescriptionBox $isDark={isDark}>
            <SectionTitleInsideBox $isDark={isDark}>
              {translations.roleSummaryTitle[language]}
            </SectionTitleInsideBox>
            <DividerLine $isDark={isDark} />
            <SummaryText $isDark={isDark}>{translations.summary[language]}</SummaryText>
          </DescriptionBox>
        </Summary>

        <ExperienceContainer>
          <UXUIDesignExperience
            title={
              <StandardSectionTitle>{translations.designTitle[language]}</StandardSectionTitle>
            }
            experiences={uxUIExperiences[language]}
            language={language}
            isDark={isDark}
          />
        </ExperienceContainer>
      </PageContainer>
    </PageTransition>
  );
};

export default BanditPage; 