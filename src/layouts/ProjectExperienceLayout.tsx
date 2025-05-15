import React from 'react';
import styled, { css } from 'styled-components';
import { ThemeMode } from '../context/ThemeContext'; // Asumiendo ubicación
import StandardSectionTitle from '@components/shared/StandardSectionTitle'; // Usar alias
import Masonry from '../xcons/components/Masonry'; // Mantener ruta o mover Masonry? -> Mejor moverlo a shared? Por ahora dejamos ruta
import { ExperienceCardProps } from '../xcons/components/Experiences/ExperienceCard'; // Tipos necesarios
import MarketingExperiences from '../xcons/components/Experiences/MarketingExperiences'; // Componentes de experiencia
import OperationsExperiences from '../xcons/components/Experiences/OperationsExperiences'; // Componentes de experiencia
import xFondoDefault from '../assets/x-fondo.png'; // Default background

// --- Tipos para Props ---
export interface MasonryDataItem { // Exportar para usar en archivos de datos
  id: string | number;
  height: number;
  image?: string;
  type: 'image' | 'spline';
  splineSrc?: string;
  thumbnail?: string;
  title?: string;
  description?: string;
}

export interface ExperienceSectionData { // Exportar para usar en archivos de datos
  title: string; // Título traducido para la sección (e.g., "Marketing y Diseño")
  experiences: Omit<ExperienceCardProps, 'language'>[]; // Datos para ExperienceCard
}

export interface BannerTextData { // Exportar para usar en archivos de datos
    main: string;
    link?: string;
    location?: string;
}

export interface ProjectExperienceLayoutProps { // Exportar para usar en ProjectPage
  language: 'es' | 'en';
  isDark: boolean;
  themeMode: ThemeMode;
  bannerLogo: string;
  bannerText: BannerTextData;
  bannerImage: string;
  bannerBackground?: string; // Opcional, para fondo de banner específico
  roleSummaryTitle: string; // Título traducido
  roleSummaryText: string; // Texto traducido
  experienceSection1?: ExperienceSectionData; // Datos para la primera caja de experiencias
  experienceSection2?: ExperienceSectionData; // Datos para la segunda caja de experiencias
  featuredProjectsTitle: string; // Título traducido
  masonryData: MasonryDataItem[];
  projectName?: string; // Opcional para título H1 oculto
}

// --- Styled Components (Movidos de XConsExperiencePage) ---

const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  padding-top: 4rem;
`;

const ProjectBanner = styled.div` // Renombrado
  position: relative;
  width: 100%;
  background-color: white; // Ajustar si es necesario para tema oscuro
  display: flex;
  align-items: center;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  margin-bottom: 3rem;
  overflow: hidden;
`;

const BannerBackground = styled.div<{ $bgImage?: string }>`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
  background-image: url(${props => props.$bgImage || xFondoDefault}); // Usar prop o default importado
  background-repeat: no-repeat;
  background-position: left center;
`;

const BannerContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 50px;
  width: 100%;
  position: relative;
  z-index: 2;
  padding: 10px;

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

const BannerText = styled.p<{ $isDark?: boolean }>` // Añadir $isDark para colores
  font-size: 1rem;
  color: ${({ $isDark }) => $isDark ? '#DDDDDD' : '#333'}; // Color condicional
  max-width: 400px;
  line-height: 1.6;

  a {
    color: ${({ $isDark }) => $isDark ? '#4db1ff' : '#15814B'}; // Color de enlace condicional
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }
`;

const LocationText = styled.span<{ $isDark?: boolean }>` // Añadir $isDark para colores
  color: ${({ $isDark }) => $isDark ? '#AAAAAA' : '#888888'};
  font-size: 0.9rem;
`;

const RightContent = styled.div`
  max-width: 40%;
  @media (max-width: 992px) {
    max-width: 80%;
  }
  img {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); // Ajustar sombra para tema oscuro?
    display: block;
  }
`;

const Summary = styled.div`
  margin: 3rem auto;
  max-width: 100%;
`;

const glassEffect = css`
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  will-change: backdrop-filter;
`;

const StyledBox = styled.div<{ $isDark: boolean }>`
  border-radius: 12px;
  padding: 2.5rem;
  border: 1px solid ${({ $isDark }) => $isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'};
  background: ${({ $isDark }) => ($isDark ? 'rgba(40, 40, 45, 0.7)' : 'rgba(245, 245, 250, 0.75)')};
  ${glassEffect}
  color: ${({ theme }) => theme.colors.text}; // Requiere ThemeProvider en App.tsx
`;

const DescriptionBox = styled(StyledBox)`
  margin-top: 1rem;
  margin-bottom: 0; // Quitar margen inferior si ExperienceContainer maneja el espacio
`;

const SectionTitleInsideBox = styled.h3<{ $isDark: boolean }>`
  font-weight: 600;
  font-size: 1.6rem;
  color: ${({ $isDark }) => $isDark ? '#FFFFFF' : '#1D1F23'};
  margin-bottom: 0.75rem;
  text-transform: uppercase;
`;

const DividerLine = styled.hr<{ $isDark: boolean }>`
  width: 100%;
  border: none;
  height: 1px;
  background-color: ${({ $isDark }) => $isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'};
  margin-top: 0.75rem;
  margin-bottom: 1.5rem;
`;

const SummaryText = styled.p<{ $isDark: boolean }>`
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 0;
  color: ${({ $isDark }) => $isDark ? '#DDDDDD' : '#444444'};
`;

const ExperienceContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  margin-top: 3rem;

  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const MasonryWrapper = styled(StyledBox)`
  margin-top: 4rem;
  margin-bottom: 2rem;

  & > *:first-child { // Título (StandardSectionTitle)
    margin-bottom: 0.75rem;
  }
`;

// --- Componente Layout ---

const ProjectExperienceLayout: React.FC<ProjectExperienceLayoutProps> = ({
  language,
  isDark,
  themeMode,
  bannerLogo,
  bannerText,
  bannerImage,
  bannerBackground, // Usar este prop
  roleSummaryTitle,
  roleSummaryText,
  experienceSection1,
  experienceSection2,
  featuredProjectsTitle,
  masonryData,
  projectName,
}) => {

  // Ajustes para colores dependientes del tema donde no usamos styled-components directamente
  // const bannerLinkColor = isDark ? '#61afef' : '#15814B'; // Ejemplo de colores
  // const bannerTextColor = isDark ? '#DDDDDD' : '#333';

  return (
      <PageContainer>
        {projectName && (
          <StandardSectionTitle as="h1" style={{ position: 'absolute', width: '1px', height: '1px', margin: '-1px', padding: 0, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
            {projectName}
          </StandardSectionTitle>
        )}

        <ProjectBanner>
          <BannerBackground $bgImage={bannerBackground} />
          <BannerContent>
            <LeftContent>
              <LogoImage src={bannerLogo} alt={`${projectName || 'Project'} Logo`} />
              <BannerText $isDark={isDark}>
                {bannerText.main}
                {bannerText.link && <><br /><a href={bannerText.link} target="_blank" rel="noopener noreferrer">{bannerText.link.replace(/^https?:\/\//, '')}</a></>}
                {bannerText.location && <><br /><LocationText $isDark={isDark}>{bannerText.location}</LocationText></>}
              </BannerText>
            </LeftContent>
            <RightContent>
              <img src={bannerImage} alt={`${projectName || 'Project'} visual`} />
            </RightContent>
          </BannerContent>
        </ProjectBanner>

        <Summary>
          <DescriptionBox $isDark={isDark}>
            <SectionTitleInsideBox $isDark={isDark}>{roleSummaryTitle}</SectionTitleInsideBox>
            <DividerLine $isDark={isDark} />
            <SummaryText $isDark={isDark}>{roleSummaryText}</SummaryText>
          </DescriptionBox>
        </Summary>

        {(experienceSection1 || experienceSection2) && (
          <ExperienceContainer>
            {experienceSection1 && (
              <MarketingExperiences
                title={<StandardSectionTitle>{experienceSection1.title}</StandardSectionTitle>}
                experiences={experienceSection1.experiences}
                language={language}
                isDark={isDark}
              />
            )}
             {experienceSection2 && (
              <OperationsExperiences
                title={<StandardSectionTitle>{experienceSection2.title}</StandardSectionTitle>}
                experiences={experienceSection2.experiences}
                language={language}
                isDark={isDark}
              />
            )}
          </ExperienceContainer>
        )}

        <MasonryWrapper $isDark={isDark}>
          <StandardSectionTitle style={{ textAlign: 'left' }}>
            {featuredProjectsTitle}
          </StandardSectionTitle>
          <DividerLine $isDark={isDark} />
          <Masonry data={masonryData} themeMode={themeMode} />
        </MasonryWrapper>
      </PageContainer>
  );
};

export default ProjectExperienceLayout; 