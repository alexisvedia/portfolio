import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { store, setLoaded } from '@store/index';
import { GlobalStyles } from '@styles/GlobalStyles';
import styled from 'styled-components';
import LanguageSelector from '@components/LanguageSelector';
import ThemeToggle from '@components/ThemeToggle';
import { ThemeProvider } from './context/ThemeContext';
const ChatbotAssistant = React.lazy(() => import('@components/ChatbotAssistant'));
import { initScrollDetection } from '@utils/scrollDetection';
import { initializeN8NServer } from '@services/n8nService';

// Importar páginas
import Home from './pages/Home';
// Using dynamic imports for code splitting
const About = React.lazy(() => import('./pages/About'));

// Aseguramos que i18n se inicialice
import '@utils/i18n';

// Contenedor principal para toda la aplicación
const AppWrapper = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.background};
`;

// Contenedor de páginas
const Container = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: visible;
  background-color: ${({ theme }) => theme.colors.background};
`;

// Language Selector position
const LanguageSelectorStyled = styled(LanguageSelector)<{ $hideOnScroll: boolean }>`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 100;
  transition: transform 0.3s ease;
  
  @media (max-width: 768px) {
    transform: translateY(${props => props.$hideOnScroll ? '-100px' : '0'});
  }
`;

// Theme Toggle position con exactamente las propiedades solicitadas
const ThemeToggleStyled = styled(ThemeToggle)<{ $hideOnScroll: boolean }>`
  position: fixed;
  top: 1.6rem;
  right: 6.8rem;
  z-index: 100;
  --toggle-size: 14px;
  height: 40px;
  transition: transform 0.3s ease;
  
  /* Ajustar el tamaño del toggle */
  & label {
    width: 42px;
    height: 42px;
  }
  
  @media (max-width: 768px) {
    transform: translateY(${props => props.$hideOnScroll ? '-100px' : '0'});
  }
`;

const AppContent = () => {
  const { i18n } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [hideControls, setHideControls] = useState(false);
  
  // Inicializar el servidor n8n cuando la aplicación se carga
  useEffect(() => {
    // Una única llamada de precalentamiento al servidor n8n
    initializeN8NServer();
  }, []);

  // Detectar si estamos en dispositivo móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Controlar el scroll para ocultar controles en móvil
  useEffect(() => {
    if (!isMobile) return; // Solo aplicar en móvil
    
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHideControls(true);
      } else {
        setHideControls(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  // Función para manejar la finalización de las animaciones
  const handleAnimationComplete = () => {
    // Este callback se llama cuando la animación de bienvenida está completa
    store.dispatch(setLoaded(true));
  };

  // Inicializar la detección de scroll para controlar la visibilidad de la barra de desplazamiento
  useEffect(() => {
    const cleanup = initScrollDetection();
    return cleanup;
  }, []);

  return (
    <AppWrapper>
      <LanguageSelectorStyled initialDelay={500} $hideOnScroll={hideControls} />
      <ThemeToggleStyled initialDelay={500} $hideOnScroll={hideControls} />
      <React.Suspense fallback={null}>
        <ChatbotAssistant initialDelay={500} />
      </React.Suspense>

      <Container>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home onAnimationComplete={handleAnimationComplete} />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </React.Suspense>
      </Container>
    </AppWrapper>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <GlobalStyles />
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppContent />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
