import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import ScrollFloat from '@components/ScrollFloat';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { store, setLoaded } from '@store/index';
import { theme } from '@styles/theme';
import { GlobalStyles } from '@styles/GlobalStyles';
import styled from 'styled-components';
import Aurora from './Aurora';
import SimpleBlurText from '@components/SimpleBlurText';
import LanguageSelector from '@components/LanguageSelector';
import NavBar from '@components/NavBar/NavBar';
import LanguageMorphingTitle from '@components/LanguageMorphingTitle';

// Importar páginas
import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Resume from './pages/Resume';

// Aseguramos que i18n se inicialice
import '@utils/i18n';

// Contenedor principal para toda la aplicación
const AppWrapper = styled.div`
  position: relative;
`;

// Contenedor para el efecto Aurora, que ahora está fijo y cubre solo la ventana
const AuroraWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 0;
  overflow: hidden;
`;

// Contenedor de páginas
const Container = styled.div`
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  z-index: 1;
`;

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.space.xl};
`;

const Title = styled.div`
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Open Sans',
    'Helvetica Neue',
    sans-serif;
  font-size: ${({ theme }) => theme.fontSizes['5xl']};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.space['2xl']};
  text-align: center;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

// Secciones estilizadas
const Section = styled.section`
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space.xl};
  position: relative;
  scroll-margin-top: 4.5rem;
  overflow: hidden;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.space.xl};
  text-align: center;
  font-weight: 600;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;

  &:after {
    content: '';
    display: block;
    width: 60px;
    height: 4px;
    background: #646cff;
    margin: 8px auto 0;
    border-radius: 2px;
    box-shadow: 0 2px 10px rgba(100, 108, 255, 0.4);
  }
`;

const SectionContent = styled.div`
  max-width: 800px;
  width: 100%;
  background-color: rgba(30, 30, 30, 0.5);
  backdrop-filter: blur(16px);
  border-radius: 1rem;
  padding: ${({ theme }) => theme.space.xl};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  }

  /* Estilos para párrafos dentro del contenido */
  p {
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.8;
    margin-bottom: 1.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
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
      opacity 0.5s ease,
      transform 0.5s ease;
  }
`;

// Estilo para los títulos de sección con animación morphing
const StyledMorphingTitle = styled(LanguageMorphingTitle)`
  font-size: clamp(2.5rem, 5vw, 7rem);
  font-weight: 900;
  margin-bottom: 2.5rem;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  line-height: 1.2;
  letter-spacing: -0.02em;

  @media (min-width: 768px) {
    font-size: clamp(3.5rem, 8vw, 10rem);
  }
`;

const AppContent = () => {
  // Estado para controlar la visibilidad solo de la navbar
  const [navbarVisible, setNavbarVisible] = useState(false);
  const { t, i18n } = useTranslation();
  const [pendingLanguage, setPendingLanguage] = useState<string | null>(null);
  const location = useLocation();

  // Estado para los colores de Aurora
  const [currentColors, setCurrentColors] = useState<string[]>(['#646cff', '#82e9de', '#a6c1ff']);

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

      // Ocultar la navbar primero (con el texto en el idioma original)
      setNavbarVisible(false);
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
  }, []);

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
    // Si tenemos un idioma pendiente y la navbar está oculta, podemos proceder
    if (pendingLanguage && !navbarVisible) {
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
    }
  }, [pendingLanguage, navbarVisible, i18n]);

  // Función para manejar la finalización de las animaciones
  const handleAnimationComplete = () => {
    // Este callback se llama cuando la animación de bienvenida está completa
    console.log('Animación de bienvenida completada');
    store.dispatch(setLoaded(true));
  };

  return (
    <AppWrapper>
      <AuroraWrapper>
        <Aurora colorStops={currentColors} blend={0.5} amplitude={1.0} speed={0.5} />
      </AuroraWrapper>
      <NavBarStyled t={t} visible={navbarVisible} />
      <LanguageSelectorStyled initialDelay={1300} />

      <Container>
        <Routes>
          <Route path="/" element={<Home onAnimationComplete={handleAnimationComplete} />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/resume" element={<Resume />} />
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
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
