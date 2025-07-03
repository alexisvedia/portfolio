import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import PageTransition from '@components/PageTransition/PageTransition';
import { useTheme } from '../context/ThemeContext';
import maintenanceImage from '@/assets/images/matenimiento.png';

const MaintenanceContainer = styled.div< { $isDark: boolean } >`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 160px);
  padding: 2rem;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const StyledImage = styled.img< { $isDark?: boolean } >`
  width: 150px;
  height: auto;
  margin-bottom: 2rem;
  ${({ $isDark }) => !$isDark && `filter: invert(1);`}
`;

const Title = styled.h1< { $isDark: boolean } >`
  font-size: 2.5rem;
  margin-bottom: 1rem;
  color: ${({ $isDark }) => $isDark ? '#FFFFFF' : '#1D1F23'};
`;

const Message = styled.p`
  font-size: 1.2rem;
  line-height: 1.6;
  max-width: 600px;
  
`;

const MaintenancePage: React.FC = () => {
  const { i18n } = useTranslation();
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';

  const translations = {
    title: {
      es: 'Página en Construcción',
      en: 'Page Under Construction',
    },
    message: {
      es: 'Actualmente estoy trabajando para mejorar esta sección. Por favor, vuelve más tarde.',
      en: 'I am currently working on improving this section. Please check back later.',
    },
  };

  const currentLanguage = i18n.language.startsWith('es') ? 'es' : 'en';

  return (
    <PageTransition>
      <MaintenanceContainer $isDark={isDark}>
        <StyledImage src={maintenanceImage} alt="En mantenimiento" $isDark={isDark} />
        <Title $isDark={isDark}>{translations.title[currentLanguage]}</Title>
        <Message>{translations.message[currentLanguage]}</Message>
      </MaintenanceContainer>
    </PageTransition>
  );
};

export default MaintenancePage;