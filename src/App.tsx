import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLocation,
  useOutletContext,
} from 'react-router-dom';
import { useState, useEffect, useLayoutEffect } from 'react';
import { Provider } from 'react-redux';
import { store, setLoaded } from '@store/index';
import { GlobalStyles } from '@styles/GlobalStyles';
import styled from 'styled-components';
import ContactButton from '@components/ContactButton';
import { ThemeProvider } from './context/ThemeContext';
import FontLoader from '@components/FontLoader/FontLoader';
import DotBackground from '@components/DotBackground';
import Sidebar from '@components/Sidebar/Sidebar';
import { LazyLoadErrorBoundary } from '@components/ErrorBoundary';

const ChatbotAssistant = React.lazy(() => import('@components/ChatbotAssistant'));

const LazyComponentWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <LazyLoadErrorBoundary>
      {/* Ocultamos el spinner visual para evitar ícono de carga */}
      <React.Suspense fallback={null}>{children}</React.Suspense>
    </LazyLoadErrorBoundary>
  );
};
import { initScrollDetection } from '@utils/scrollDetection';
import { initializeN8NServer } from '@services/n8nService';

import Home from './pages/Home';

const createLazyComponent = <T extends React.ComponentType<any>>( // eslint-disable-line @typescript-eslint/no-explicit-any
  importFn: () => Promise<unknown>,
  retries = 3
) => {
  return React.lazy<T>(() => {
    return new Promise((resolve, reject) => {
      const attemptImport = (retriesLeft: number) => {
        importFn()
          .then(mod => resolve(mod as { default: T }))
          .catch(error => {
            if (retriesLeft > 0) {
              setTimeout(() => attemptImport(retriesLeft - 1), 1000);
            } else {
              reject(error);
            }
          });
      };
      attemptImport(retries);
    });
  });
};

const ProjectPage = createLazyComponent(() => import('./pages/ProjectPage'));
const XConsExperiencePage = createLazyComponent(
  () => import('./features/xcons/XConsExperiencePage')
);
const XCons2ExperiencePage = createLazyComponent(
  () => import('./features/xcons/XCons2ExperiencePage')
);
const FusionAdsPage = createLazyComponent(() => import('./features/fusionads/FusionAdsPage'));
const MaintenancePage = createLazyComponent(() => import('./pages/MaintenancePage'));

import '@utils/i18n';

const SIDEBAR_WIDTH = '280px';
const SIDEBAR_COLLAPSED_WIDTH = '80px';

const AppWrapper = styled.div`
  position: relative;
  background: transparent;
  display: flex;
`;

const MainContentWrapper = styled.div<{ $isSidebarPresent: boolean; $isSidebarCollapsed: boolean }>`
  flex-grow: 1;
  position: relative;
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  overflow: visible;
  background: transparent;
  margin-left: ${({ $isSidebarPresent, $isSidebarCollapsed }) => {
    if (!$isSidebarPresent) return '0';
    return $isSidebarCollapsed ? SIDEBAR_COLLAPSED_WIDTH : SIDEBAR_WIDTH;
  }};
  transition: margin-left 0.3s ease-in-out;
  box-sizing: border-box;

  @media (max-width: 768px) {
    margin-left: 0;
    /* Avoid horizontal overflow on mobile by using percentage width */
    width: 100%;
  }
`;

const Container = styled.div`
  position: relative;
`;

// Prefetch lo antes posible (en carga de módulo) para cubrir navegación inicial
try {
  type NetworkInformation = {
    saveData?: boolean;
    effectiveType?: 'slow-2g' | '2g' | '3g' | '4g' | string;
  };
  type NavigatorWithConnection = Navigator & { connection?: NetworkInformation };
  const shouldPrefetch = () => {
    const nav = navigator as NavigatorWithConnection;
    if (nav.connection?.saveData) return false;
    const effective = nav.connection?.effectiveType;
    if (effective && ['slow-2g', '2g'].includes(effective)) return false;
    return true;
  };

  const prefetch = () => {
    if (!shouldPrefetch()) return;
    Promise.all([
      import('./pages/ProjectPage'),
      import('./features/xcons/XConsExperiencePage'),
      import('./features/xcons/XCons2ExperiencePage'),
      import('./features/fusionads/FusionAdsPage'),
      import('./pages/MaintenancePage'),

      import('@components/ChatbotAssistant'),
    ]).catch(() => {});
  };

  if (typeof window !== 'undefined') {
    const ric = (
      window as unknown as {
        requestIdleCallback?: (cb: () => void, opts?: { timeout?: number }) => number;
      }
    ).requestIdleCallback;
    if (typeof ric === 'function') {
      ric(prefetch, { timeout: 1500 });
    } else {
      setTimeout(prefetch, 300);
    }
  }
} catch {
  // No romper en navegadores sin estas APIs
}

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
  // Removed Lenis smooth scrolling for native behavior
  const location = useLocation();
  // La home de afiches trae su propia navegación, fondo y loader.
  const isHome = location.pathname === '/';
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isContactSectionInView, setIsContactSectionInView] = useState(false);
  const [chatbotVisible, setChatbotVisible] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [shouldShowLoader, setShouldShowLoader] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isMobile);
  // Inicializar el sidebar colapsado y recuperar estado desde localStorage
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState !== null ? JSON.parse(savedState) : true; // Por defecto colapsado
  });
  const [n8nServerReady, setN8nServerReady] = useState(false);

  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (!hasVisitedBefore) {
      setShouldShowLoader(true);
      localStorage.setItem('hasVisitedBefore', 'true');
    } else {
      setFontsLoaded(true);
    }
    const startsOnHome = window.location.pathname === '/';
    document.fonts.ready.then(() => {
      if (hasVisitedBefore || startsOnHome) {
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
        console.error('Error al inicializar el servidor n8n:', error);
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
    setChatbotVisible(true);
  }, []);

  useEffect(() => {
    if (location.state?.scrollToSection && location.pathname === '/') {
      const sectionId = location.state.scrollToSection as string;
      const sectionElement = document.getElementById(sectionId);
      if (sectionElement) {
        // Jump instantly without animated scroll and without preserving previous offset
        requestAnimationFrame(() => {
          sectionElement.scrollIntoView({ behavior: 'auto', block: 'start' });
        });
      }

      window.history.replaceState({}, location.pathname, location.pathname);
    }
  }, [location.state, location.pathname]);

  // Ensure non-home pages start at the top on navigation (pre-paint)
  useLayoutEffect(() => {
    if (location.pathname !== '/') {
      try {
        if ('scrollRestoration' in window.history) {
          window.history.scrollRestoration = 'manual';
        }
      } catch {}
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
    return () => {
      try {
        if ('scrollRestoration' in window.history) {
          window.history.scrollRestoration = 'auto';
        }
      } catch {}
    };
  }, [location.pathname]);

  // Mobile UX: auto-close sidebar on route change (e.g., tapping project links)
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

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

  const toggleSidebarCollapse = () => {
    if (!isMobile) {
      const newCollapsedState = !isSidebarCollapsed;
      setIsSidebarCollapsed(newCollapsedState);
      // Guardar el estado en localStorage
      localStorage.setItem('sidebarCollapsed', JSON.stringify(newCollapsedState));
    }
  };

  const shouldHideContactButton = isContactSectionInView;
  const hasSidebar = !isHome && isSidebarOpen && !isMobile;

  return (
    <AppWrapper>
      {shouldShowLoader && !fontsLoaded && !isHome && <FontLoader onLoaded={handleFontsLoaded} />}
      {!isHome && (
        <Sidebar
          isOpen={isSidebarOpen}
          toggleSidebar={toggleSidebar}
          isMobile={isMobile}
          isCollapsed={isSidebarCollapsed}
          toggleCollapse={toggleSidebarCollapse}
        />
      )}

      <MainContentWrapper
        $isSidebarPresent={hasSidebar}
        $isSidebarCollapsed={isSidebarCollapsed}
      >
        {!isHome && (
          <DotBackground isSidebarPresent={hasSidebar} isSidebarCollapsed={isSidebarCollapsed} />
        )}
        {!isHome && (
          <ContactButtonStyled initialDelay={500} $hideOnScroll={shouldHideContactButton} />
        )}
        {chatbotVisible && (
          <React.Suspense fallback={null}>
            <ChatbotAssistant
              initialDelay={0}
              n8nServerReady={n8nServerReady}
              isSidebarPresent={hasSidebar}
              isSidebarCollapsed={isSidebarCollapsed}
            />
          </React.Suspense>
        )}

        <Container>
          {/* Removed ScrollRestoration to avoid unexpected scroll restore on reload */}
          <LazyComponentWrapper>
            <Outlet context={{ handleAnimationComplete, fontsLoaded, setIsContactSectionInView }} />
          </LazyComponentWrapper>
        </Container>
      </MainContentWrapper>
    </AppWrapper>
  );
};

function App() {
  // Prefetch de rutas pesadas en segundo plano para navegación sin "loading"
  useEffect(() => {
    try {
      type NetworkInformation = {
        saveData?: boolean;
        effectiveType?: 'slow-2g' | '2g' | '3g' | '4g' | string;
      };
      type NavigatorWithConnection = Navigator & { connection?: NetworkInformation };
      const shouldPrefetch = () => {
        const nav = navigator as NavigatorWithConnection;
        // Evitar en ahorro de datos o redes potencialmente lentas
        if (nav.connection?.saveData) return false;
        const effective = nav.connection?.effectiveType;
        if (effective && ['slow-2g', '2g'].includes(effective)) return false;
        return true;
      };

      const prefetch = () => {
        if (!shouldPrefetch()) return;
        // Disparar fetch de los chunks; se silencian errores para no afectar UX
        Promise.all([
          import('./pages/ProjectPage'),
          import('./features/xcons/XConsExperiencePage'),
          import('./features/xcons/XCons2ExperiencePage'),
          import('./features/fusionads/FusionAdsPage'),
          import('./pages/MaintenancePage'),

          import('@components/ChatbotAssistant'),
        ]).catch(() => {});
      };

      type RequestIdleCallbackFn = (cb: () => void, opts?: { timeout?: number }) => number;
      const ric = (window as unknown as { requestIdleCallback?: RequestIdleCallbackFn })
        .requestIdleCallback;
      if (typeof ric === 'function') {
        ric(prefetch, { timeout: 3000 });
      } else {
        // Pequeño delay para no competir con la renderización inicial
        setTimeout(prefetch, 1200);
      }
    } catch {
      // No-op: prioridad a no romper en navegadores antiguos
    }
  }, []);

  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <AppContent />,
        children: [
          {
            index: true,
            element: <HomeWrapper />,
          },
          {
            path: 'xcons',
            element: <XConsExperiencePage />,
          },
          {
            path: 'bandit',
            element: <XCons2ExperiencePage />,
          },
          {
            path: 'fusionads',
            element: <FusionAdsPage />,
          },
          {
            path: 'otros',
            element: <MaintenancePage />,
          },
          {
            path: ':projectId',
            element: <ProjectPage />,
          },
        ],
      },
    ],
    {
      future: {
        // Opt into RR v7 relative splat path behavior to silence warnings
        v7_relativeSplatPath: true,
      },
    }
  );

  return (
    <Provider store={store}>
      <ThemeProvider>
        <GlobalStyles />
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
