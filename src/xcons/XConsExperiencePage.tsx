import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme, ThemeMode } from '../context/ThemeContext';
import { MarketingExperiences, OperationsExperiences } from './components/Experiences';
import { marketingExperiences, operationsExperiences } from './data/experiencesData';
import { useTranslation } from 'react-i18next';
import xFondo from '../assets/x-fondo.png';
import xconLogoVerde from '../assets/xcon-logo-verde.png';
import xconsComercial from '../assets/xcons-comercial.png';
import Masonry, { MasonryItem } from './components/Masonry';

import RediseñoXCONSProjectImage from '../assets/Proyectos XCONS/rediseñoXCONS.png';
import CamionProjectImage from '../assets/Proyectos XCONS/camion.png';
import OsvaldoProjectImage from '../assets/Proyectos XCONS/osvaldo.png';
import ComercialXCONSProjectImage from '../assets/Proyectos XCONS/comercial.png';
import FerreyraProjectImage from '../assets/Proyectos XCONS/Ferreyra.png';
import SplineThumbnailImage from '../assets/Proyectos XCONS/spline.png';
import RrssProjectImage from '../assets/Proyectos XCONS/rrss.png';
import StandardSectionTitle from '../components/shared/StandardSectionTitle';
import PageTransition from '@components/PageTransition/PageTransition';

const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  padding-top: 4rem;
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
  background-image: url(${xFondo});
  background-repeat: no-repeat;
  background-position: left center;
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
    color: #15814b;
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
  background-color: #15814b; /* Color principal XCONS */
  color: white;
  padding: 8px 16px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.9rem;
  margin-top: 8px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #106a3c; /* Un tono más oscuro para el hover */
    text-decoration: none; /* Asegurar que no haya subrayado en hover */
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

// Definición del glassEffect localmente si no se quiere importar o es simple
const glassEffectForDescriptionBox = css`
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  will-change: backdrop-filter;
`;

// Nuevo título estilizado para dentro del DescriptionBox
const SectionTitleInsideBox = styled.h3<{ $isDark: boolean }>`
  font-family: 'NHaasGroteskTXPro-55Rg', 'Inter', sans-serif; // Fuente principal para consistencia
  font-weight: 600;
  font-size: 1.6rem;
  color: ${({ $isDark }) => ($isDark ? '#FFFFFF' : '#1D1F23')}; // Colores de texto del tema
  margin-bottom: 0.75rem;
  text-transform: uppercase;
`;

// Línea separadora (similar a la de Marketing/Operations Experiences)
const DividerLine = styled.hr<{ $isDark?: boolean }>`
  width: 100%;
  border: none;
  height: 1px;
  background-color: ${({ $isDark }) =>
    $isDark
      ? 'rgba(255,255,255,0.2)'
      : 'rgba(0,0,0,0.15)'}; // Mismos colores de borde que DescriptionBox/Inputs
  margin-top: 0.75rem;
  margin-bottom: 1.5rem;
`;

const DescriptionBox = styled.div<{ $isDark: boolean }>`
  border-radius: 12px;
  padding: 2.5rem;
  margin-top: 1rem;
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)')};
  background: ${({ $isDark }) => ($isDark ? 'rgba(40, 40, 45, 0.7)' : 'rgba(245, 245, 250, 0.75)')};
  ${glassEffectForDescriptionBox} // El color del texto de SummaryText se manejará directamente o se heredará.

  @media (max-width: 767px) {
    padding: 0;
    border: none;
    background: none;
    border-radius: 0;
    margin-top: 0.5rem;
  }
`;

const SummaryText = styled.p<{ $isDark: boolean }>`
  // Pasar $isDark para consistencia si es necesario
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 0;
  color: ${({ $isDark }) => ($isDark ? '#DDDDDD' : '#444444')}; // Restaurar color explícito
`;

const ExperienceContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;

  @media (min-width: 992px) {
    grid-template-columns: 1fr 1fr;
  }
  @media (max-width: 767px) {
    gap: 1.5rem;
    padding: 0;
    background: none;
    border: none;
    border-radius: 0;
  }
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

// Textos para los elementos de la galería (Español e Inglés)
const masonryItemText = {
  splineScene: {
    title: { es: 'Escena Interactiva 3D', en: 'Interactive 3D Scene' },
    description: {
      es: 'Escena hecha con Spline para la web comercial, puede reaccionar al scroll o hover del mouse si se desea.',
      en: 'Scene made with Spline for the commercial website, it can react to scroll or mouse hover if desired.',
    },
  },
  rediseñoXCONS: {
    title: { es: 'Rediseño XCONS', en: 'XCONS Redesign' },
    description: {
      es: 'Propuesta de rediseño de la plataforma principal, basada en buenas prácticas de diseño UX/UI, considerando principios fundamentales como familiaridad, ley de Prägnanz, etc.',
      en: 'Redesign proposal for the main platform, based on UX/UI design best practices, considering fundamental principles such as familiarity, Prägnanz law, etc.',
    },
  },
  camion: {
    title: { es: 'Diseño de banner OG', en: 'OG Banner Design' },
    description: {
      es: 'Antes de la existencia de la AI de edición de imagen, haciendo uso de Photoshop realizaba los diseños de cada banner que usaban las webs utilizando los recursos originales (algunas veces en mala calidad) que enviaban los clientes que digitalizabamos.',
      en: 'Before the existence of image editing AI, using Photoshop, I designed each banner used by the websites using the original resources (sometimes of poor quality) sent by the clients we digitized.',
    },
  },
  osvaldo: {
    title: { es: 'E-commerce Osvaldo Gonzalez', en: 'Osvaldo Gonzalez E-commerce' },
    description: {
      es: 'Diseño para la digitalización de un distribuidor de materiales de construcción en Argentina usando el branding de la marca. Cada uno de los recursos visuales fue creado desde cero.',
      en: "Design for the digitalization of a construction materials distributor in Argentina using the brand's branding. Each visual asset was created from scratch.",
    },
  },
  comercialXCONS: {
    title: {
      es: 'Migración y rediseño de sitio comercial',
      en: 'Commercial Site Migration and Redesign',
    },
    description: {
      es: 'Realicé la migración del sitio comercial alojado en hubspot a Wordpress, modficando el código de plantillas y módulos. Previamente se realizó una propuesta de diseño en Figma para ver como quedaría el sitio el producción.',
      en: 'I migrated the commercial site hosted on HubSpot to WordPress, modifying template and module code. Previously, a design proposal was made in Figma to preview how the site would look in production.',
    },
  },
  ferreyra: {
    title: {
      es: 'E-commerce Ferreyra materiales',
      en: 'Ferreyra Materials E-commerce',
    },
    description: {
      es: 'Una propuesta de diseño aprobada por el cliente para su e-commerce. En mi paso en XCONS he realizado más de 10 diseños de e-commerces para diversos clientes en toda LATAM.',
      en: 'A design proposal approved by the client for their e-commerce. During my time at XCONS, I created more than 10 e-commerce designs for various clients across LATAM.',
    },
  },
  rrss: {
    title: {
      es: 'Recursos gráficos para RRSS',
      en: 'Graphic Assets for Social Media',
    },
    description: {
      es: 'En conjunto con el equipo de marketing, realicé varias piezas y recursos para redes sociales, incluyendo imágenes y videos con el fin de comunicar y dar a conocer la propuesta comercial de XCONS.',
      en: "Together with the marketing team, I created several assets and resources for social media, including images and videos to communicate and promote XCONS's commercial offering.",
    },
  },
} as const;

// Definir un tipo para las claves de masonryItemText
type MasonryItemKey = keyof typeof masonryItemText;

// Definición de datos base para los elementos de la galería
// Aseguramos que los elementos base cumplan con parte de MasonryItem y añadan la key.
const masonryItemDetails: Array<
  Omit<MasonryItem, 'title' | 'description' | 'id'> & { id: string | number; key: MasonryItemKey }
> = [
  {
    id: 'spline-scene',
    key: 'splineScene',
    height: 300,
    type: 'spline' as const,
    thumbnail: SplineThumbnailImage,
    splineSrc: 'https://prod.spline.design/kFgAlvghlLyIp78Q/scene.splinecode',
  },
  {
    id: 7,
    key: 'rediseñoXCONS',
    image: RediseñoXCONSProjectImage,
    height: 320,
    type: 'image' as const,
    documentLinks: [
      {
        name: 'Diseño general.pdf',
        url: 'https://storage.googleapis.com/brandify-usercontent-dev/c4e43e71-4702-4e55-88be-4308c9fdce23?Expires=1746921599&GoogleAccessId=GOOG1EQYYUCN45RGYHGLHRS57FY5LN3ZFJOZEUIRTNHTBDZURLXQ4KVCAN4BI&Signature=eayt9wA%2B98j7WjMDtdCzsujR3%2Bs%3D%0A',
      },
      {
        name: 'Distribuidores.pdf',
        url: 'https://storage.googleapis.com/brandify-usercontent-dev/f5ce9fd5-3397-40fc-b914-930f0c293986?Expires=1746921599&GoogleAccessId=GOOG1EQYYUCN45RGYHGLHRS57FY5LN3ZFJOZEUIRTNHTBDZURLXQ4KVCAN4BI&Signature=kM7WtIcN0oXOEELf9%2FB2LBrhYyA%3D%0A',
      },
      {
        name: 'Calculadores.pdf',
        url: 'https://storage.googleapis.com/brandify-usercontent-dev/c4e43e71-4702-4e55-88be-4308c9fdce23?Expires=1746921599&GoogleAccessId=GOOG1EQYYUCN45RGYHGLHRS57FY5LN3ZFJOZEUIRTNHTBDZURLXQ4KVCAN4BI&Signature=eayt9wA%2B98j7WjMDtdCzsujR3%2Bs%3D%0A',
      },
      {
        name: 'Calificación.pdf',
        url: 'https://storage.googleapis.com/brandify-usercontent-dev/7d81c133-7384-4782-af57-a27e8ab5a7e2?Expires=1746921599&GoogleAccessId=GOOG1EQYYUCN45RGYHGLHRS57FY5LN3ZFJOZEUIRTNHTBDZURLXQ4KVCAN4BI&Signature=8p412QJ5P0mYrEqrKJy%2FmQ3WOrQ%3D%0A',
      },
      {
        name: 'Otras consideraciones.pdf',
        url: 'https://storage.googleapis.com/brandify-usercontent-dev/22709981-98c0-4926-8f80-376a095fea2a?Expires=1746921599&GoogleAccessId=GOOG1EQYYUCN45RGYHGLHRS57FY5LN3ZFJOZEUIRTNHTBDZURLXQ4KVCAN4BI&Signature=j0HPmAei9M1RfCrqigusBboXCb0%3D%0A',
      },
    ],
  },
  {
    id: 8,
    key: 'camion',
    image: CamionProjectImage,
    height: 380,
    type: 'image' as const,
    actionButton: {
      url: 'https://www.corralongonzalez.com.ar/?srsltid=AfmBOopRBo-jVl1o-9v2jPjQp9pr_l4NM8xoFXyuf-x3HlhDZiCmBjnb',
      labelES: 'Visitar sitio',
      labelEN: 'Visit site',
    },
  },
  {
    id: 9,
    key: 'osvaldo',
    image: OsvaldoProjectImage,
    height: 420,
    type: 'image' as const,
    actionButton: {
      url: 'https://www.corralongonzalez.com.ar/?srsltid=AfmBOopRBo-jVl1o-9v2jPjQp9pr_l4NM8xoFXyuf-x3HlhDZiCmBjnb',
      labelES: 'Visitar sitio',
      labelEN: 'Visit site',
    },
  },
  {
    id: 10,
    key: 'comercialXCONS',
    image: ComercialXCONSProjectImage,
    height: 330,
    type: 'image' as const,
    actionButton: {
      url: 'https://comercial.xcons.com/',
      labelES: 'Visitar sitio',
      labelEN: 'Visit site',
    },
  },
  {
    id: 11,
    key: 'ferreyra',
    image: FerreyraProjectImage,
    height: 350,
    type: 'image' as const,
    actionButton: {
      url: 'https://www.ferreyramateriales.com/',
      labelES: 'Visitar sitio',
      labelEN: 'Visit site',
    },
  },
  {
    id: 12,
    key: 'rrss',
    image: RrssProjectImage,
    height: 300,
    type: 'image' as const,
    actionButton: {
      url: 'https://www.instagram.com/xcons_ar/',
      labelES: 'Ver en Instagram',
      labelEN: 'View on Instagram',
    },
  },
];

const XConsExperiencePage: React.FC = () => {
  const { themeMode } = useTheme();
  const { i18n } = useTranslation();
  const language = i18n.language.startsWith('en') ? 'en' : 'es';
  const isDark = themeMode === 'dark';

  // Generar masonryData con los textos traducidos
  const masonryData: MasonryItem[] = masonryItemDetails.map(item => {
    const texts = masonryItemText[item.key];
    return {
      ...item,
      title: texts.title[language],
      description: texts.description[language],
    } as MasonryItem; // Asegurar que el objeto resultante sea del tipo MasonryItem
  });

  const translations = {
    mainTitle: { es: 'Un Vistazo a XCONS', en: 'A Glimpse into XCONS' },
    marketingTitle: { es: 'Marketing y Diseño', en: 'Marketing & Design' },
    operationsTitle: { es: 'Operaciones y Calidad', en: 'Operations & Quality' },
    projectsTitle: { es: 'Proyectos Destacados', en: 'Featured Projects' },
    roleSummaryTitle: { es: 'Resumen de Rol', en: 'Role Summary' },
    summary: {
      es: 'Como Diseñador UI/UX y Gráfico, lideré la creación y mantenimiento de bibliotecas de componentes, definiendo experiencias coherentes en desktop y mobile, y produciendo piezas visuales para campañas en redes sociales. Colaboré con otros diseñadores en la optimización de los flujos críticos del e-commerce —checkout, compra, micrositios y gestión de proveedores—, mejorando la conversión y la usabilidad. Participé activamente en el rebranding de ViviendaVerde a XCONS, aplicando la nueva identidad visual en todos los puntos de contacto digitales. Trabajé codo a codo con el equipo front-end, ejecutando maquetación semántica y guiando a otros diseñadores para garantizar consistencia y calidad en el producto.',
      en: 'As a UI/UX and Graphic Designer, I led the creation and maintenance of component libraries, defining coherent experiences on desktop and mobile, and producing visual pieces for social media campaigns. I collaborated with other designers in optimizing critical e-commerce flows—checkout, purchase, microsites, and supplier management—improving conversion and usability. I actively participated in the rebranding from ViviendaVerde to XCONS, applying the new visual identity across all digital touchpoints. I worked closely with the front-end team, executing semantic layout and guiding other designers to ensure consistency and quality in the product.',
    },
    visitSiteButton: { es: 'Visitar sitio', en: 'Visit site' },
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

        <XconsBanner>
          <BannerBackground />
          <BannerContent>
            <LeftContent>
              <LogoImage src={xconLogoVerde} alt="XCON Logo" />
              <BannerText>
                {language === 'es' ? (
                  <>
                    Plataforma de e-commerce especializada en la venta omnicanal de materiales de
                    construcción.
                  </>
                ) : (
                  <>
                    E-commerce platform specialized in omnichannel sales of construction materials.
                  </>
                )}
              </BannerText>
              <LocationText>{language === 'es' ? 'Argentina' : 'Argentina'}</LocationText>
              <StyledSiteButton
                href="https://www.xcons.com.ar"
                target="_blank"
                rel="noopener noreferrer"
              >
                {translations.visitSiteButton[language]}
              </StyledSiteButton>
            </LeftContent>
            <RightContent>
              <img src={xconsComercial} alt="XCONS Comercial" />
            </RightContent>
          </BannerContent>
        </XconsBanner>

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
          <div>
            <MarketingExperiences
              title={
                <StandardSectionTitle>{translations.marketingTitle[language]}</StandardSectionTitle>
              }
              experiences={marketingExperiences[language]}
              language={language}
              isDark={isDark}
            />
          </div>
          <div>
            <OperationsExperiences
              title={
                <StandardSectionTitle>
                  {translations.operationsTitle[language]}
                </StandardSectionTitle>
              }
              experiences={operationsExperiences[language]}
              language={language}
              isDark={isDark}
            />
          </div>
        </ExperienceContainer>

        <MasonryWrapper $isDark={isDark}>
          <StandardSectionTitle style={{ textAlign: 'left' }}>
            {translations.projectsTitle[language]}
          </StandardSectionTitle>
          <DividerLine $isDark={isDark} />
          <Masonry data={masonryData} themeMode={themeMode} />
        </MasonryWrapper>
      </PageContainer>
    </PageTransition>
  );
};

export default XConsExperiencePage;
