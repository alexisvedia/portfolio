import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store, setLoaded } from '@store/index';
import { GlobalStyles } from '@styles/GlobalStyles';
import styled from 'styled-components';

import { ThemeProvider } from './context/ThemeContext';
import FontLoader from '@components/FontLoader/FontLoader';
import GrainOverlay from '@components/GrainOverlay';


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
// Importar BanditPage de forma diferida
const BanditPage = React.lazy(() => import('./bandit/BanditPage'));
const MaintenancePage = React.lazy(() => import('./pages/MaintenancePage'));

// Aseguramos que i18n se inicialice
import '@utils/i18n';



const AppWrapper = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex; // Para alinear Sidebar y Content
`;

const MainContentWrapper = styled.div`
  flex-grow: 1;
  position: relative;
  min-height: 100vh;
  overflow: visible;
  background-color: ${({ theme }) => theme.colors.background};
`;

// Container de páginas (ahora dentro de MainContentWrapper)
const Container = styled.div`
  position: relative;
`;




const AppContent = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isContactSectionInView, setIsContactSectionInView] = useState(false);
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [shouldShowLoader, setShouldShowLoader] = useState(false);

  const [n8nServerReady, setN8nServerReady] = useState(false); // Nuevo estado para controlar si el servidor está listo

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
    // Intentar inicializar el servidor con un retraso inicial
    const timer = setTimeout(async () => {
      try {
        // Llamar a initializeN8NServer y actualizar el estado según el resultado
        const success = await initializeN8NServer();
        setN8nServerReady(success);
        
        // Si no fue exitoso en el primer intento, seguir intentando hasta un máximo de 3 veces
        if (!success) {
          let retryCount = 0;
          const maxRetries = 3;
          
          const retryInterval = setInterval(async () => {
            retryCount++;
            console.log(`Reintento ${retryCount} de ${maxRetries} para conectar con n8n`);
            
            const retrySuccess = await initializeN8NServer();
            if (retrySuccess) {
              setN8nServerReady(true);
              clearInterval(retryInterval);
            } else if (retryCount >= maxRetries) {
              // Alcanzó el número máximo de reintentos, detener los intentos
              console.log('Se alcanzó el número máximo de reintentos para conectar con n8n');
              clearInterval(retryInterval);
            }
          }, 3000);
          
          // Limpieza del intervalo si el componente se desmonta
          return () => clearInterval(retryInterval);
        }
      } catch (error) {
        console.error("Error al inicializar el servidor n8n:", error);
      }
    }, 2500);
    
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Mostrar el chatbot solo si el servidor n8n está listo
    if (n8nServerReady) {
      const timer = window.setTimeout(() => {
        setChatbotVisible(true);
      }, isMobile ? 1000 : 500); // Tiempos más cortos ya que ya esperamos a que el servidor esté listo
      return () => clearTimeout(timer);
    }
  }, [n8nServerReady, isMobile]);

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
      window.history.replaceState({}, location.pathname, location.pathname);
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





  return (
    <AppWrapper>
      {shouldShowLoader && !fontsLoaded && <FontLoader onLoaded={handleFontsLoaded} />}
      <MainContentWrapper>
        <GrainOverlay />

        {chatbotVisible && n8nServerReady && (
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
                  <Home 
                    onAnimationComplete={handleAnimationComplete} 
                    fontsLoaded={fontsLoaded} 
                    onContactSectionViewChange={setIsContactSectionInView}
                  />
                }
              />
              <Route path="/xcons" element={<XConsExperiencePage />} />
              <Route path="/fusionads" element={<FusionAdsPage />} />
              <Route path="/bandit" element={<BanditPage />} />
              <Route path="/otros" element={<MaintenancePage />} />
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
