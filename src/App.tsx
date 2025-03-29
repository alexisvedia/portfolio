import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { store, setLoaded } from '@store/index';
import { theme } from '@styles/theme';
import { GlobalStyles } from '@styles/GlobalStyles';
import styled from 'styled-components';
import Aurora from './Aurora';
import LanguageSelector from '@components/LanguageSelector';
import NavBar from '@components/NavBar/NavBar';
import ChatbotAssistant from '@components/ChatbotAssistant';

// Importar páginas
import Home from './pages/Home';
import About from './pages/About';

// Aseguramos que i18n se inicialice
import '@utils/i18n';

// Contenedor principal para toda la aplicación
const AppWrapper = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.background};
`;

// Ya no necesitamos el contenedor para el efecto Aurora

// Contenedor de páginas
const Container = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: visible;
  background-color: ${({ theme }) => theme.colors.background};
`;

// Language Selector position
const LanguageSelectorStyled = styled(LanguageSelector)`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 100;
`;

// NavBar estilizada con la misma transición pero manteniendo el centrado original
const NavBarStyled = styled(NavBar)<{ visible: boolean }>`
  &&& {
    opacity: ${({ visible }) => (visible ? 1 : 0)};
    transform: translateX(-50%) translateY(${({ visible }) => (visible ? 0 : -10)}px);
    transition:
      opacity 0.5s cubic-bezier(0.215, 0.61, 0.355, 1),
      transform 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);

    @media (max-width: 768px) {
      transform: translateX(-50%) translateY(${({ visible }) => (visible ? 0 : 10)}px);
      transition:
        opacity 0.4s cubic-bezier(0.34, 1.56, 0.64, 1),
        transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
  }
`;

const AppContent = () => {
  // Estado para controlar la visibilidad solo de la navbar
  const [navbarVisible, setNavbarVisible] = useState(false);
  const { t, i18n } = useTranslation();
  const [pendingLanguage, setPendingLanguage] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Estado para los colores de Aurora
  const [currentColors, setCurrentColors] = useState<string[]>(['#646cff', '#82e9de', '#a6c1ff']);

  // Detectar si estamos en dispositivo móvil
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Establecer navbarVisible a true después de 1000ms cuando se inicia
  useEffect(() => {
    const timer = setTimeout(() => {
      setNavbarVisible(true);
    }, 1000);

    // Limpiar el timeout cuando el componente se desmonte
    return () => clearTimeout(timer);
  }, []);

  // Escuchar el evento de cambio de idioma para ocultar solo la navbar
  useEffect(() => {
    const handleInitiateLanguageChange = (
      event: CustomEvent<{ previousLanguage: string; newLanguage: string }>
    ) => {
      // Guardar el idioma que queremos cambiar
      setPendingLanguage(event.detail.newLanguage);

      // Solo ocultar la navbar si NO estamos en modo móvil
      // En móvil, solo mostramos iconos, por lo que no hay necesidad de ocultar y mostrar el navbar
      if (!isMobile) {
        setNavbarVisible(false);
      } else {
        // En móvil, cambiamos el idioma directamente sin ocultar/mostrar el navbar
        i18n.changeLanguage(event.detail.newLanguage);
      }
    };

    // Registrar oyente para el evento custom
    window.addEventListener(
      'initiateLanguageChange',
      handleInitiateLanguageChange as EventListener
    );

    // Limpiar oyentes cuando el componente se desmonte
    return () => {
      window.removeEventListener(
        'initiateLanguageChange',
        handleInitiateLanguageChange as EventListener
      );
    };
  }, [isMobile, i18n]);

  // Escuchar el evento de actualización de colores de Aurora
  useEffect(() => {
    const handleUpdateAuroraColors = (event: CustomEvent<{ colors: string[] }>) => {
      setCurrentColors(event.detail.colors);
    };

    // Registrar oyente para el evento custom
    window.addEventListener('updateAuroraColors', handleUpdateAuroraColors as EventListener);

    // Limpiar oyentes cuando el componente se desmonte
    return () => {
      window.removeEventListener('updateAuroraColors', handleUpdateAuroraColors as EventListener);
    };
  }, []);

  // Efectuar el cambio de idioma solo cuando todas las animaciones iniciales y ocultar navbar hayan terminado
  useEffect(() => {
    // Si tenemos un idioma pendiente y la navbar está oculta (solo en desktop), podemos proceder
    if (pendingLanguage && (!navbarVisible || isMobile)) {
      // Solo necesitamos esta lógica si no estamos en mobile
      if (!isMobile) {
        const timer = setTimeout(() => {
          // Cambiar realmente el idioma en i18n SOLO después de que la navbar esté oculta
          i18n.changeLanguage(pendingLanguage).then(() => {
            // Después de un tiempo para que el cambio de idioma surta efecto, mostrar navbar nuevamente
            const showTimer = setTimeout(() => {
              setNavbarVisible(true);
              // Limpiar el idioma pendiente
              setPendingLanguage(null);
            }, 300);

            return () => clearTimeout(showTimer);
          });
        }, 300); // Dar tiempo para que la navbar termine de ocultarse

        return () => clearTimeout(timer);
      } else {
        // En móvil, añadimos un pequeño efecto de "pulso" al cambiar el idioma
        const timer = setTimeout(() => {
          i18n.changeLanguage(pendingLanguage).then(() => {
            setPendingLanguage(null);
          });
        }, 100);

        return () => clearTimeout(timer);
      }
    }
  }, [pendingLanguage, navbarVisible, i18n, isMobile]);

  // Función para manejar la finalización de las animaciones
  const handleAnimationComplete = () => {
    // Este callback se llama cuando la animación de bienvenida está completa
    store.dispatch(setLoaded(true));
  };

  return (
    <AppWrapper>
      <NavBarStyled t={t} visible={navbarVisible} />
      <LanguageSelectorStyled initialDelay={1300} />
      <ChatbotAssistant initialDelay={1300} />

      <Container>
        <Routes>
          <Route path="/" element={<Home onAnimationComplete={handleAnimationComplete} />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Container>
    </AppWrapper>
  );
};

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppContent />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
