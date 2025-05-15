import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store, setLoaded } from '@store/index';
import { GlobalStyles } from '@styles/GlobalStyles';
import styled from 'styled-components';
import ContactButton from '@components/ContactButton';
import { ThemeProvider } from './context/ThemeContext';
import FontLoader from '@components/FontLoader/FontLoader';
import GrainOverlay from '@components/GrainOverlay';
import Sidebar from '@components/Sidebar/Sidebar';

// Cargar el componente del chatbot de manera diferida para mejorar el rendimiento inicial
const ChatbotAssistant = React.lazy(
  () =>
    new Promise<{ default: React.ComponentType<any> }>(resolve =>
      setTimeout(() => resolve(import('@components/ChatbotAssistant')), 2000)
    )
);
import { initScrollDetection } from '@utils/scrollDetection';
import { initializeN8NServer } from '@services/n8nService';

// Importar el nuevo componente
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

// Importar páginas
import Home from './pages/Home';
// Using dynamic imports for code splitting
const ProjectPage = React.lazy(() => import('./pages/ProjectPage'));
// Importar el componente XConsExperiencePage de forma diferida
const XConsExperiencePage = React.lazy(() => import('./xcons/XConsExperiencePage'));
// Importar FusionAdsPage de forma diferida
const FusionAdsPage = React.lazy(() => import('./fusionads/FusionAdsPage'));
const MaintenancePage = React.lazy(() => import('./pages/MaintenancePage'));

// Aseguramos que i18n se inicialice
import '@utils/i18n';

const SIDEBAR_WIDTH = '280px'; // Definir el ancho de la sidebar para usarlo en los estilos

const AppWrapper = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex; // Para alinear Sidebar y Content
`;

const MainContentWrapper = styled.div<{ $isSidebarPresent: boolean }>`
  flex-grow: 1;
  position: relative;
  min-height: 100vh;
  overflow: visible;
  background-color: ${({ theme }) => theme.colors.background};
  margin-left: ${({ $isSidebarPresent }) => ($isSidebarPresent ? SIDEBAR_WIDTH : '0')};
  transition: margin-left 0.3s ease-in-out;

  @media (max-width: 768px) {
    margin-left: 0; // En móvil no hay margen permanente
  }
`;

// Container de páginas (ahora dentro de MainContentWrapper)
const Container = styled.div`
  position: relative;
`;

// Contact Button position - puede necesitar ajustes si la sidebar lo afecta
const ContactButtonStyled = styled(ContactButton)<{ $hideOnScroll: boolean }>`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 100;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    transform: translateY(${props => (props.$hideOnScroll ? '-100px' : '0')});
    // Asegurar que no colisione con el botón de menú de la sidebar si es necesario
    // left: auto; // Descomentar si se necesita ajustar
    // right: 1.5rem;
  }
`;

const AppContent = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [hideControls, setHideControls] = useState(false);
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [shouldShowLoader, setShouldShowLoader] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile); // Abierta en escritorio, cerrada en móvil por defecto

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      setShouldShowLoader(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    } else {
      setFontsLoaded(true);
    }
    document.fonts.ready.then(() => {
      if (hasVisitedBefore) {
        setFontsLoaded(true);
      }
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      initializeN8NServer();
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true); // Siempre abierta en escritorio
      } else {
        setIsSidebarOpen(false); // Cerrada por defecto en móvil al redimensionar
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!isMobile) return;
    const handleScroll = () => {
      setHideControls(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setChatbotVisible(true);
    }, isMobile ? 3000 : 2000);
    return () => clearTimeout(timer);
  }, [isMobile]);

  // Efecto para hacer scroll a la sección de contacto
  useEffect(() => {
    if (location.state?.scrollToSection && location.pathname === '/') {
      const sectionId = location.state.scrollToSection;
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        setTimeout(() => { // setTimeout para dar tiempo al DOM a actualizarse si es necesario
          sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100); // Un pequeño delay puede ayudar
      }
      // Opcional: limpiar el estado para que no se repita el scroll en recargas o re-renders
      // window.history.replaceState({}, location.pathname, location.pathname);
    }
  }, [location.state, location.pathname]);

  const handleAnimationComplete = () => {
    store.dispatch(setLoaded(true));
  };

  useEffect(() => {
    const cleanup = initScrollDetection();
    return cleanup;
  }, []);

  const handleFontsLoaded = () => {
    setFontsLoaded(true);
  };

  const toggleSidebar = () => {
    if (isMobile) { // Solo permitir toggle en móvil
        setIsSidebarOpen(!isSidebarOpen);
    }
  };

  return (
    <AppWrapper>
      {shouldShowLoader && !fontsLoaded && <FontLoader onLoaded={handleFontsLoaded} />}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />
      
      <MainContentWrapper $isSidebarPresent={isSidebarOpen && !isMobile}>
        <GrainOverlay />
        <ContactButtonStyled initialDelay={500} $hideOnScroll={hideControls && isMobile} />
        {chatbotVisible && (
          <React.Suspense fallback={null}>
            <ChatbotAssistant initialDelay={500} />
          </React.Suspense>
        )}

        <Container>
          <React.Suspense fallback={<div>Loading...</div>}>
            <Routes>
              <Route
                path="/"
                element={
                  <Home onAnimationComplete={handleAnimationComplete} fontsLoaded={fontsLoaded} />
                }
              />
              <Route path="/xcons" element={<XConsExperiencePage />} />
              <Route path="/fusionads" element={<FusionAdsPage />} />
              <Route path="/bandit" element={<MaintenancePage />} />
              <Route path="/condamind" element={<MaintenancePage />} />
              <Route path="/:projectId" element={<ProjectPage />} />
            </Routes>
          </React.Suspense>
        </Container>
      </MainContentWrapper>
    </AppWrapper>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <GlobalStyles />
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <ScrollToTop />
          <AppContent />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
