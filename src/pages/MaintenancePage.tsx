import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import PageTransition from '@components/PageTransition/PageTransition';
import { useTheme } from '../context/ThemeContext'; // Ruta corregida

const MaintenanceContainer = styled.div< { $isDark: boolean } >`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 160px); // Ajusta según la altura de tu header/footer si es necesario
  padding: 2rem;
  text-align: center;
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
`;

const Title = styled.h1< { $isDark: boolean } >`
  font-size: 2.5rem;
  font-family: 'NHaasGroteskTXPro-75Bd', 'Inter', sans-serif;
  margin-bottom: 1rem;
  color: ${({ $isDark }) => $isDark ? '#FFFFFF' : '#1D1F23'}; // Blanco en modo oscuro, oscuro en modo claro
`;

const Message = styled.p`
  font-size: 1.2rem;
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
  max-width: 600px;
  // El color se hereda de MaintenanceContainer o se puede especificar aquí si es necesario
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
        <Title $isDark={isDark}>{translations.title[currentLanguage]}</Title>
        <Message>{translations.message[currentLanguage]}</Message>
      </MaintenanceContainer>
    </PageTransition>
  );
};

export default MaintenancePage; 