import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext'; // TS6133 ThemeMode eliminado
import { useTranslation } from 'react-i18next';
import PageTransition from '@components/PageTransition/PageTransition'; // Asumiendo alias correcto
import fusionAdsFondo from '../assets/Proyectos Fusion/Fusion-fondo.png'; // Importación imagen de fondo
import fusionAdsLogo from '../assets/Proyectos Fusion/Logo-color-fusion.png'; // Ruta actualizada del logo
import fusionAdsAppImage from '../assets/Proyectos Fusion/fusion-app.png'; // Importación para la imagen derecha
// import fusionAdsIlustracion from '../assets/images/projects/fusionads-ilustracion.png'; // Placeholder para ilustración

const PageContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  padding-top: 4rem;
  font-family: 'Inter', sans-serif;
`;

const FusionAdsBanner = styled.div`
  position: relative;
  width: 100%;
  background-color: white; /* Considerar tema */
  display: flex;
  align-items: center;
  padding: 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  margin-bottom: 3rem;
  overflow: hidden;
  min-height: 180px; /* Añadida altura mínima para consistencia */
`;

const BannerBackground = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
  background-image: url(${fusionAdsFondo}); /* Usar la imagen de fondo importada */
  /* background-color: #f0f0f0; */ /* Eliminar color de fondo temporal */
  background-repeat: no-repeat;
  background-position: center center; /* Ajustar posición si es necesario */
  background-size: 600px auto; /* Ejemplo: ancho 400px, alto automático */
  opacity: 0.5; /* Opacidad aumentada para mayor visibilidad */
`;

const BannerContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; /* Ajustado para separar contenido */
  gap: 50px;
  width: 100%;
  position: relative;
  z-index: 2;
  padding: 10px 30px; /* Añadido padding horizontal */

  @media (max-width: 992px) {
    flex-direction: column;
    gap: 20px;
    text-align: center; /* Centrar texto en móvil */
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
  color: #333; /* Considerar tema */
  max-width: 500px; /* Ajustado */
  line-height: 1.6;
  margin-bottom: 10px; /* Añadido margen */

  a {
    color: #007bff; /* Color de enlace estándar, ajustar según diseño */
    text-decoration: underline;
    &:hover {
      text-decoration: none;
    }
  }
`;

const LocationText = styled.span`
  color: #666; /* Considerar tema */
  font-size: 0.9rem;
  font-weight: 500; /* Añadido peso */
`;

const RightContent = styled.div`
  max-width: 35%; // Ajustado

  @media (max-width: 992px) {
    max-width: 70%;
    margin-top: 20px; // Espacio en móvil
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 8px; // Ajustado
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15); // Sombra sutil
    display: block;
  }
`;

const FusionAdsPage: React.FC = () => {
  // const { themeMode } = useTheme(); // TS6133 Eliminado
  useTheme(); // Llamada para mantener el hook si tiene efectos secundarios y evitar otro error de no uso.
  // const { t, i18n } = useTranslation('fusionads'); // TS6133 i18n eliminado
  const { t } = useTranslation('fusionads'); // TS6133 i18n eliminado

  // Textos para internacionalización con traducciones explícitas donde sea necesario
  const bannerDescription = t('banner.description', 'FusionAds.ai es una plataforma de publicidad generativa impulsada por inteligencia artificial que genera anuncios profesionales omni-canal.');
  const bannerUrl = "https://backoffice.fusionos.ai"; // URL actualizada sin /login
  const bannerLocation = t('banner.location', 'Estados Unidos');

  // Para asegurar que tenemos las traducciones correctas en el contexto de i18n, aunque usemos fallbacks:
  // Esto es más para la configuración de i18n, pero lo ponemos aquí como referencia
  /* // TS6133 Eliminado
  const translations = {
    en: {
      banner: {
// ... existing code ...
      }
    }
  };
  */

  return (
    <PageTransition>
      <PageContainer>
        <FusionAdsBanner>
          <BannerBackground />
          <BannerContent>
            <LeftContent>
              <LogoImage src={fusionAdsLogo} alt="FusionAds Logo" />
              <BannerText>
                {bannerDescription}
                <br />
                <a href={bannerUrl} target="_blank" rel="noopener noreferrer">
                  {bannerUrl} {/* Mostrar la URL directamente */}
                </a>
              </BannerText>
              <LocationText>{bannerLocation}</LocationText>
            </LeftContent>
            <RightContent>
              <img src={fusionAdsAppImage} alt="FusionAds App Illustration" />
            </RightContent>
          </BannerContent>
        </FusionAdsBanner>

        {/* Aquí irán las demás secciones replicadas de XCONS */}
        {/* Por ejemplo: Resumen, Experiencias, Galería, etc. */}

      </PageContainer>
    </PageTransition>
  );
};

export default FusionAdsPage; 