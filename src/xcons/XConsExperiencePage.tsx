import React from 'react';
import styled from 'styled-components';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { MarketingExperiences, OperationsExperiences } from './components/Experiences';
import { marketingExperiences, operationsExperiences } from './data/experiencesData';
import { useTranslation } from 'react-i18next';
import xFondo from '../assets/x-fondo.png';
import xconLogoVerde from '../assets/xcon-logo-verde.png';
import xconsComercial from '../assets/xcons-comercial.png';
import Masonry from './components/Masonry';
import OGImage from '../assets/OG.png';
import RediseñoImage from '../assets/Rediseño.png';
import FerreyraImage from '../assets/ferreyra2.webp';
import XFondoImage from '../assets/x-fondo.png';
import XConsComercialImage from '../assets/xcons-comercial.png';
import XConLogoVerdeImage from '../assets/xcon-logo-verde.png';
import StandardSectionTitle from '../components/shared/StandardSectionTitle';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
`;

const XconsBanner = styled.div`
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
`;

const BannerBackground = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
  background-image: url(${xFondo});
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

const BannerText = styled.p`
  font-size: 1rem;
  color: #333;
  max-width: 400px;
  line-height: 1.4;
`;

const RightContent = styled.div`
  max-width: 40%;

  @media (max-width: 992px) {
    max-width: 80%;
  }

  img {
    max-width: 131%;
    height: auto;
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    display: block;
  }
`;

const Summary = styled.div<{ $themeMode: ThemeMode }>`
  margin: 3rem auto;
  max-width: 750px;
`;

const SummaryText = styled.p<{ $themeMode: ThemeMode }>`
  font-size: 1rem;
  line-height: 1.8;
  color: ${props => (props.$themeMode === 'dark' ? '#DDDDDD' : '#444444')};
  margin-bottom: 1.5rem;
`;

const ExperienceContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;

  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const MasonryWrapper = styled.div`
  margin-top: 4rem;
`;

const XConsExperiencePage: React.FC = () => {
  const { themeMode } = useTheme();
  const { i18n } = useTranslation();
  const language = i18n.language.startsWith('en') ? 'en' : 'es';

  const masonryData = [
    { id: 1, image: OGImage, height: 400, type: 'image' as const, title: 'Imagen OG Portafolio', description: '...' },
    { id: 2, image: RediseñoImage, height: 300, type: 'image' as const, title: 'Propuesta de Rediseño', description: '...' },
    { id: 3, image: FerreyraImage, height: 350, type: 'image' as const, title: 'Proyecto Ferreyra', description: '...' },
    { id: 'spline-scene', height: 300, type: 'spline' as const, thumbnail: XConsComercialImage, splineSrc: 'https://prod.spline.design/kFgAlvghlLyIp78Q/scene.splinecode', title: 'Escena Interactiva 3D', description: '...' },
    { id: 4, image: XFondoImage, height: 250, type: 'image' as const, title: 'Fondo XCONS', description: '...' },
    { id: 5, image: XConsComercialImage, height: 300, type: 'image' as const, title: 'Vista Comercial XCONS', description: '...' },
    { id: 6, image: XConLogoVerdeImage, height: 200, type: 'image' as const, title: 'Logo XCONS (Versión Verde)', description: '...' },
  ]; // Descripciones acortadas para brevedad

  const translations = {
    mainTitle: { es: 'Un Vistazo a XCONS', en: 'A Glimpse into XCONS' },
    marketingTitle: { es: 'Marketing y Diseño', en: 'Marketing & Design' },
    operationsTitle: { es: 'Operaciones y Calidad', en: 'Operations & Quality' },
    projectsTitle: { es: 'Proyectos Destacados', en: 'Featured Projects' },
    summary: { 
      es: 'Como Diseñador UI/UX y Gráfico, lideré la creación y mantenimiento de bibliotecas de componentes, definiendo experiencias coherentes en desktop y mobile, y produciendo piezas visuales para campañas en redes sociales. Colaboré con otros diseñadores en la optimización de los flujos críticos del e-commerce —checkout, compra, micrositios y gestión de proveedores—, mejorando la conversión y la usabilidad. Participé activamente en el rebranding de ViviendaVerde a XCONS, aplicando la nueva identidad visual en todos los puntos de contacto digitales. Trabajé codo a codo con el equipo front-end, ejecutando maquetación semántica y guiando a otros diseñadores para garantizar consistencia y calidad en el producto.', 
      en: '...' // Mantener o añadir la traducción en inglés aquí si es necesario
    }, 
  };

  return (
    <PageContainer>
      <StandardSectionTitle as="h1" style={{ position: 'absolute', width: '1px', height: '1px', margin: '-1px', padding: 0, overflow: 'hidden', clip: 'rect(0,0,0,0)', border: 0 }}>
        {translations.mainTitle[language]}
      </StandardSectionTitle>

      <XconsBanner>
        <BannerBackground />
        <BannerContent>
          <LeftContent>
            <LogoImage src={xconLogoVerde} alt="XCON Logo" />
            <BannerText>
              {language === 'es'
                ? 'Plataforma de e-commerce especializada...'
                : 'E-commerce platform specialized...'}
            </BannerText>
          </LeftContent>
          <RightContent>
            <img src={xconsComercial} alt="XCONS Comercial" />
          </RightContent>
        </BannerContent>
      </XconsBanner>

      <Summary $themeMode={themeMode}>
        <SummaryText $themeMode={themeMode}>{translations.summary[language]}</SummaryText>
      </Summary>

      <ExperienceContainer>
        <div>
          <MarketingExperiences 
            title={<StandardSectionTitle>{translations.marketingTitle[language]}</StandardSectionTitle>} 
            experiences={marketingExperiences[language]} 
            language={language} 
          />
        </div>
        <div>
          <OperationsExperiences 
            title={<StandardSectionTitle>{translations.operationsTitle[language]}</StandardSectionTitle>} 
            experiences={operationsExperiences[language]} 
            language={language} 
          />
        </div>
      </ExperienceContainer>

      <MasonryWrapper>
        <StandardSectionTitle>{translations.projectsTitle[language]}</StandardSectionTitle>
        <Masonry data={masonryData} />
      </MasonryWrapper>
    </PageContainer>
  );
};

export default XConsExperiencePage;
