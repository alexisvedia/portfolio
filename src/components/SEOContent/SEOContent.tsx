import React from 'react';
import styled from 'styled-components';

const SEOContainer = styled.div`
  position: absolute;
  left: -9999px;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
`;

const SEOHeading = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const SEOSubHeading = styled.h4`
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 0.8rem;
  color: ${({ theme }) => theme.colors.text};
`;

const SEOText = styled.p`
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text};
`;

const SEOList = styled.ul`
  margin-bottom: 1rem;
  padding-left: 1.5rem;
`;

const SEOListItem = styled.li`
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text};
`;

const SEOLink = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  text-decoration: underline;
  
  &:hover {
    opacity: 0.8;
  }
`;

const SEOContent: React.FC = () => {

  return (
    <SEOContainer>
      <SEOHeading>Alexis Vedia - Desarrollador Full Stack Profesional</SEOHeading>
      <SEOText>
        Alexis Vedia es un desarrollador full stack profesional especializado en tecnologías modernas como React, TypeScript, Node.js y desarrollo web avanzado. 
        Este portfolio profesional muestra la experiencia de Alexis Vedia en empresas como XCONS, FusionAds y Bandit, ofreciendo soluciones innovadoras en desarrollo frontend y backend.
      </SEOText>
      
      <SEOSubHeading>Servicios de Desarrollo Web</SEOSubHeading>
      <SEOList>
        <SEOListItem>Desarrollo Frontend con React y TypeScript</SEOListItem>
        <SEOListItem>Desarrollo Backend con Node.js y APIs REST</SEOListItem>
        <SEOListItem>Aplicaciones web responsivas y modernas</SEOListItem>
        <SEOListItem>Optimización de rendimiento y SEO</SEOListItem>
        <SEOListItem>Integración de bases de datos y servicios cloud</SEOListItem>
      </SEOList>
      
      <SEOSubHeading>Experiencia Profesional</SEOSubHeading>
      <SEOText>
        Desarrollador con experiencia en <SEOLink href="#experience">proyectos empresariales</SEOLink> incluyendo:
      </SEOText>
      <SEOList>
        <SEOListItem><SEOLink href="/xcons">XCONS</SEOLink> - Constructora innovadora con soluciones sustentables</SEOListItem>
        <SEOListItem><SEOLink href="/fusionads">FusionAds</SEOLink> - Plataforma de publicidad digital avanzada</SEOListItem>
        <SEOListItem><SEOLink href="/bandit">Bandit</SEOLink> - Soluciones en seguridad informática</SEOListItem>
        <SEOListItem><SEOLink href="/otros">Otros proyectos</SEOLink> - Diversos desarrollos personales y profesionales</SEOListItem>
      </SEOList>
      
      <SEOSubHeading>Tecnologías y Herramientas</SEOSubHeading>
      <SEOText>
        Especialización en tecnologías frontend y backend modernas para crear aplicaciones web escalables y eficientes.
      </SEOText>
      
      <SEOSubHeading>Contacto Profesional</SEOSubHeading>
      <SEOText>
        Para proyectos de desarrollo web, consultas técnicas o colaboraciones profesionales, 
        puedes <SEOLink href="#contact">contactar directamente</SEOLink> a través del formulario de contacto.
      </SEOText>
      
      <SEOText>
        Portfolio profesional de Alexis Vedia actualizado con proyectos recientes, experiencia laboral y 
        información de contacto para servicios de desarrollo web full stack. Desarrollador profesional 
        especializado en crear soluciones web modernas y escalables.
      </SEOText>
    </SEOContainer>
  );
};

export default SEOContent;