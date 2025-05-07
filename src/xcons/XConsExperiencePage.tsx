import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { MarketingExperiences, OperationsExperiences } from './components/Experiences';
import { marketingExperiences, operationsExperiences } from './data/experiencesData';
import SplineScene from './SplineScene';
import { useTranslation } from 'react-i18next';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: 'Inter', sans-serif;
`;

const Header = styled.header`
  margin-bottom: 3rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #6366F1 0%, #A855F7 50%, #3B82F6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`;

const Period = styled.p`
  font-size: 1.2rem;
  color: ${props => props.theme === 'dark' ? '#B8B8B8' : '#666666'};
`;

const Summary = styled.div`
  margin: 3rem 0;
  padding: 2rem;
  border-radius: 12px;
  background-color: ${props => props.theme === 'dark' ? 'rgba(29, 31, 35, 0.6)' : 'rgba(246, 246, 246, 0.6)'};
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const SummaryText = styled.p`
  font-size: 1.1rem;
  line-height: 1.8;
  color: ${props => props.theme === 'dark' ? '#DDDDDD' : '#444444'};
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

const XConsExperiencePage: React.FC = () => {
  const { themeMode } = useTheme();
  const { i18n, t } = useTranslation();
  const language = i18n.language.startsWith('en') ? 'en' : 'es';
  
  const translations = {
    title: {
      es: 'XCONS',
      en: 'XCONS'
    },
    period: {
      es: 'noviembre 2022 - mayo 2024',
      en: 'November 2022 - May 2024'
    },
    summary: {
      es: [
        'Desempeñé el rol de diseñador de interfaces gráficas para desktop y móvil, y experiencias de usuario. Creé y organicé las bibliotecas de componentes UI para diferentes secciones de la empresa.',
        'Trabajé en el flujo de distintas secciones del e-commerce y en la creación de módulos para múltiples casos de uso. Algunas de las secciones son: check-out, flujo de compra, micrositios, vendor.',
        'Trabajo junto al equipo de desarrolladores front-end donde también ejecuto tareas de desarrollo web. Ayudo a otros diseñadores a orientarse, entender el contexto y propósito de la empresa.'
      ],
      en: [
        'I performed the role of graphic interface designer for desktop and mobile, and user experiences. I created and organized the UI component libraries for different sections of the company.',
        'I worked on the flow of different sections of the e-commerce and on the creation of modules for multiple use cases. Some of the sections are: check-out, purchase flow, microsites, vendor.',
        'I work alongside the front-end development team where I also perform web development tasks. I help other designers to orient themselves, understand the context and purpose of the company.'
      ]
    }
  };
  
  return (
    <PageContainer>
      <SplineScene />
      
      <Header>
        <Title>{translations.title[language]}</Title>
        <Period theme={themeMode}>{translations.period[language]}</Period>
      </Header>
      
      <Summary theme={themeMode}>
        {translations.summary[language].map((paragraph, index) => (
          <SummaryText key={index} theme={themeMode}>{paragraph}</SummaryText>
        ))}
      </Summary>
      
      <ExperienceContainer>
        <MarketingExperiences 
          experiences={marketingExperiences[language]}
          language={language}
        />
        <OperationsExperiences 
          experiences={operationsExperiences[language]}
          language={language}
        />
      </ExperienceContainer>
    </PageContainer>
  );
};

export default XConsExperiencePage; 