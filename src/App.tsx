import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, useLocation, ScrollRestoration, useOutletContext } from 'react-router-dom';
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
import LoadingSpinner from '@components/LoadingSpinner';


const ChatbotAssistant = React.lazy(
  () =>
    new Promise<{ default: React.ComponentType<{ initialDelay?: number }> }>(resolve =>
      setTimeout(() => resolve(import('@components/ChatbotAssistant')), 2000)
    )
);
import { initScrollDetection } from '@utils/scrollDetection';
import { initializeN8NServer } from '@services/n8nService';




import Home from './pages/Home';

const ProjectPage = React.lazy(() => import('./pages/ProjectPage'));

const XConsExperiencePage = React.lazy(() => import('./xcons/XConsExperiencePage'));

const FusionAdsPage = React.lazy(() => import('./fusionads/FusionAdsPage'));

const BanditPage = React.lazy(() => import('./bandit/BanditPage'));
const MaintenancePage = React.lazy(() => import('./pages/MaintenancePage'));


import '@utils/i18n';

const SIDEBAR_WIDTH = '280px';

const AppWrapper = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
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
    margin-left: 0;
  }
`;


const Container = styled.div`
  position: relative;
`;


const ContactButtonStyled = styled(ContactButton)<{ $hideOnScroll: boolean }>`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 100;
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    transform: translateY(${props => (props.$hideOnScroll ? '-100px' : '0')});
  
  
  
  }
`;

// Componente wrapper para Home que usa el contexto del Outlet
const HomeWrapper = () => {
  const { handleAnimationComplete, fontsLoaded, setIsContactSectionInView } = useOutletContext<{
    handleAnimationComplete: () => void;
    fontsLoaded: boolean;
    setIsContactSectionInView: (inView: boolean) => void;
  }>();
  
  return (
    <Home 
      onAnimationComplete={handleAnimationComplete} 
      fontsLoaded={fontsLoaded} 
      onContactSectionViewChange={setIsContactSectionInView}
    />
  );
};

const AppContent = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isContactSectionInView, setIsContactSectionInView] = useState(false);
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [shouldShowLoader, setShouldShowLoader] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  const [n8nServerReady, setN8nServerReady] = useState(false);

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

    const timer = setTimeout(async () => {
      try {
  
        const success = await initializeN8NServer();
        setN8nServerReady(success);
        

        if (!success) {
          let retryCount = 0;
          const maxRetries = 3;
          
          const retryInterval = setInterval(async () => {
            retryCount++;

            
            const retrySuccess = await initializeN8NServer();
            if (retrySuccess) {
              setN8nServerReady(true);
              clearInterval(retryInterval);
            } else if (retryCount >= maxRetries) {
    

              clearInterval(retryInterval);
            }
          }, 3000);
          
    
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
      if (!mobile) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {

    if (n8nServerReady) {
      const timer = window.setTimeout(() => {
        setChatbotVisible(true);
      }, isMobile ? 1000 : 500);
      return () => clearTimeout(timer);
    }
  }, [n8nServerReady, isMobile]);


  useEffect(() => {
    if (location.state?.scrollToSection && location.pathname === '/') {
      const sectionId = location.state.scrollToSection;
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        setTimeout(() => {
          sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }

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

  const toggleSidebar = () => {
    if (isMobile) {
        setIsSidebarOpen(!isSidebarOpen);
    }
  };


  const shouldHideContactButton = isMobile && isContactSectionInView;

  return (
    <AppWrapper>
      {shouldShowLoader && !fontsLoaded && <FontLoader onLoaded={handleFontsLoaded} />}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />
      
      <MainContentWrapper $isSidebarPresent={isSidebarOpen && !isMobile}>
        <GrainOverlay />
        <ContactButtonStyled initialDelay={500} $hideOnScroll={shouldHideContactButton} />
        {chatbotVisible && n8nServerReady && (
          <React.Suspense fallback={null}>
            <ChatbotAssistant initialDelay={500} />
          </React.Suspense>
        )}

        <Container>
          <ScrollRestoration 
            getKey={(location) => {
              return location.pathname;
            }}
          />
          <React.Suspense fallback={<LoadingSpinner />}>
            <Outlet context={{ handleAnimationComplete, fontsLoaded, setIsContactSectionInView }} />
          </React.Suspense>
        </Container>
      </MainContentWrapper>
    </AppWrapper>
  );
};

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AppContent />,
      children: [
        {
          index: true,
          element: <HomeWrapper />
        },
        {
          path: "xcons",
          element: <XConsExperiencePage />
        },
        {
          path: "fusionads",
          element: <FusionAdsPage />
        },
        {
          path: "bandit",
          element: <BanditPage />
        },
        {
          path: "otros",
          element: <MaintenancePage />
        },
        {
          path: ":projectId",
          element: <ProjectPage />
        }
      ]
    }
  ]);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <GlobalStyles />
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
