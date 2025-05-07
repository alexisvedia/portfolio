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
  color: ${props => props.$themeMode === 'dark' ? '#DDDDDD' : '#444444'};
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
  const { i18n, t } = useTranslation();
  const language = i18n.language.startsWith('en') ? 'en' : 'es';
  
  const masonryData = [
    { 
      id: 1, 
      image: OGImage, 
      height: 400, 
      type: 'image' as const, 
      title: 'Imagen OG Portafolio',
      description: 'Esta es la imagen principal utilizada para las vistas previas de enlaces del portafolio, diseñada para captar la atención y representar la identidad visual del proyecto.' 
    },
    { 
      id: 2, 
      image: RediseñoImage, 
      height: 300, 
      type: 'image' as const, 
      title: 'Propuesta de Rediseño',
      description: 'Concepto de rediseño para una plataforma existente, enfocado en mejorar la usabilidad y modernizar la interfaz de usuario. Incluye nuevos flujos y componentes visuales.' 
    },
    { 
      id: 3, 
      image: FerreyraImage, 
      height: 350, 
      type: 'image' as const, 
      title: 'Proyecto Ferreyra',
      description: 'Visualización del proyecto desarrollado para Ferreyra, destacando la integración de soluciones de e-commerce y la experiencia de usuario en el sector de construcción.' 
    },
    { 
      id: 'spline-scene', 
      height: 300, 
      type: 'spline' as const, 
      thumbnail: XConsComercialImage, // Usaremos esta como thumbnail temporal para Spline
      splineSrc: "https://prod.spline.design/kFgAlvghlLyIp78Q/scene.splinecode",
      title: 'Escena Interactiva 3D',
      description: 'Una escena 3D interactiva creada con Spline. Muestra la capacidad de integrar elementos tridimensionales y animaciones en la web para una experiencia de usuario más inmersiva.' 
    },
    { 
      id: 4, 
      image: XFondoImage, 
      height: 250, 
      type: 'image' as const, 
      title: 'Fondo XCONS',
      description: 'Imagen de fondo utilizada en la identidad visual de XCONS, representando la fusión de tecnología y construcción.' 
    },
    { 
      id: 5, 
      image: XConsComercialImage, 
      height: 300, 
      type: 'image' as const, 
      title: 'Vista Comercial XCONS',
      description: 'Material gráfico diseñado para la presentación comercial de XCONS, mostrando la plataforma y sus beneficios clave para los usuarios.' 
    },
    { 
      id: 6, 
      image: XConLogoVerdeImage, 
      height: 200, 
      type: 'image' as const, 
      title: 'Logo XCONS (Versión Verde)',
      description: 'Versión del logotipo de XCONS en tonalidad verde, utilizada en contextos específicos de la marca para denotar crecimiento y sostenibilidad.' 
    },
  ];
  
  const translations = {
    mainTitle: {
      es: 'Un Vistazo a XCONS',
      en: 'A Glimpse into XCONS'
    },
    marketingTitle: {
        es: 'Marketing y Diseño',
        en: 'Marketing & Design'
    },
    operationsTitle: {
        es: 'Operaciones y Calidad',
        en: 'Operations & Quality'
    },
    projectsTitle: {
        es: 'Proyectos Destacados',
        en: 'Featured Projects'
    },
    summary: {
      es: 'Como diseñador UI/UX y gráfico, lideré la creación y organización de bibliotecas de componentes, definiendo experiencias de usuario para interfaces desktop y móviles y creando material visual para marketing. Optimicé flujos clave del e-commerce (incluyendo checkout, compra, micrositios y gestión de vendors) y participé activamente en la transición de marca y dominio desde ViviendaVerde a XCONS, contribuyendo a la nueva identidad visual. Colaboré estrechamente con el equipo de desarrollo front-end, ejecutando tareas de maquetación web y guiando a otros diseñadores en el contexto de la empresa.',
      en: 'As a UI/UX and Graphic Designer, I led the creation and organization of component libraries, defined user experiences for desktop and mobile interfaces, and created visual assets for marketing. I optimized key e-commerce flows (including checkout, purchasing, microsites, and vendor management) and actively participated in the brand and domain transition from ViviendaVerde to XCONS, contributing to the new visual identity. Collaborating closely with the front-end development team, I executed web development tasks and provided guidance to fellow designers regarding the company\'s context.'
    }
  };
  
  return (
    <PageContainer>
      <StandardSectionTitle as="h1" style={{ color: 'transparent', userSelect: 'none' }}>
        {translations.mainTitle[language]}
      </StandardSectionTitle>
      
      <XconsBanner>
        <BannerBackground />
        <BannerContent>
          <LeftContent>
            <LogoImage src={xconLogoVerde} alt="XCON Logo" />
            <BannerText>
              {language === 'es'
                ? "Plataforma de e-commerce especializada en la venta omnicanal de materiales de construcción"
                : "E-commerce platform specialized in omnichannel sales of construction materials"}
            </BannerText>
          </LeftContent>
          <RightContent>
            <img src={xconsComercial} alt="XCONS Comercial" />
          </RightContent>
        </BannerContent>
      </XconsBanner>
      
      <Summary $themeMode={themeMode}>
        <SummaryText $themeMode={themeMode}>
            {translations.summary[language]}
        </SummaryText>
      </Summary>
      
      <ExperienceContainer>
        <MarketingExperiences 
          title={<StandardSectionTitle style={{ paddingLeft: '3.5rem', textAlign: 'left' }}>{translations.marketingTitle[language]}</StandardSectionTitle>}
          experiences={marketingExperiences[language]}
          language={language}
        />
        <OperationsExperiences 
          title={<StandardSectionTitle style={{ paddingLeft: '3.5rem', textAlign: 'left' }}>{translations.operationsTitle[language]}</StandardSectionTitle>}
          experiences={operationsExperiences[language]}
          language={language}
        />
      </ExperienceContainer>

      <StandardSectionTitle style={{ paddingLeft: '3.5rem', textAlign: 'center', marginTop: '4rem' }}>
        {translations.projectsTitle[language]}
      </StandardSectionTitle>

      <MasonryWrapper>
        <Masonry data={masonryData} />
      </MasonryWrapper>
    </PageContainer>
  );
};

export default XConsExperiencePage; 