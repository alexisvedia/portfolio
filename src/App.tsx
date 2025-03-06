import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import NavBar from '@components/NavBar';

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

// Contenedor de secciones
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
const LanguageSelectorStyled = styled(LanguageSelector)<{ visible: boolean }>`
  position: fixed;
  top: 1.5rem;
  right: 1.5rem;
  z-index: 100;
  opacity: ${({ visible }) => (visible ? 1 : 0)};
  transform: translateY(${({ visible }) => (visible ? 0 : -10)}px);
  transition:
    opacity 0.5s ease,
    transform 0.5s ease;
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

const AppContent = () => {
  // Estado para controlar la visibilidad del navbar y selector de idioma
  const [visible, setVisible] = useState(false);
  const { t, i18n } = useTranslation();
  const [pendingLanguage, setPendingLanguage] = useState<string | null>(null);

  // Establecer visible a true después de 1000ms cuando se inicia
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, 1000);

    // Limpiar el timeout cuando el componente se desmonte
    return () => clearTimeout(timer);
  }, []);

  // Escuchar el evento de inicio de cambio de idioma
  useEffect(() => {
    const handleInitiateLanguageChange = (event: CustomEvent<{ newLanguage: string }>) => {
      // Almacenar el nuevo idioma en el estado pendiente
      setPendingLanguage(event.detail.newLanguage);
      // Ocultar los componentes
      setVisible(false);
    };

    // Escuchar el evento personalizado
    window.addEventListener(
      'initiateLanguageChange',
      handleInitiateLanguageChange as EventListener
    );

    return () => {
      window.removeEventListener(
        'initiateLanguageChange',
        handleInitiateLanguageChange as EventListener
      );
    };
  }, []);

  // Efecto para cambiar el idioma después de que los componentes estén ocultos
  useEffect(() => {
    if (!visible && pendingLanguage) {
      // Esperar a que la animación de desvanecimiento termine antes de cambiar el idioma
      const timer = setTimeout(() => {
        // Cambiar el idioma
        i18n.changeLanguage(pendingLanguage);
        // Limpiar el idioma pendiente
        setPendingLanguage(null);

        // Esperar un momento antes de mostrar los componentes nuevamente
        setTimeout(() => {
          setVisible(true);
        }, 400);
      }, 500); // Tiempo suficiente para que la navbar desaparezca completamente

      return () => clearTimeout(timer);
    }
  }, [visible, pendingLanguage, i18n]);

  // Colores para cada sección
  const sectionColors = {
    home: ['#3A29FF', '#FF94B4', '#FF3232'],
    about: ['#21D4FD', '#2152FF', '#21D4FD'],
    projects: ['#8E33FF', '#FF33A8', '#8E33FF'],
    resume: ['#00F5A0', '#00D9F5', '#00F5A0'],
  };

  // Estados para la sección activa y los colores actuales
  const [activeSection, setActiveSection] = useState('home');
  const [currentColors, setCurrentColors] = useState(sectionColors.home);

  // Referencia para la animación
  const animationRef = useRef<number | null>(null);

  // Función para interpolar entre colores
  const interpolateColor = (color1: string, color2: string, factor: number): string => {
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');

    const r = Math.round(
      parseInt(hex1.substring(0, 2), 16) * (1 - factor) +
        parseInt(hex2.substring(0, 2), 16) * factor
    );
    const g = Math.round(
      parseInt(hex1.substring(2, 4), 16) * (1 - factor) +
        parseInt(hex2.substring(2, 4), 16) * factor
    );
    const b = Math.round(
      parseInt(hex1.substring(4, 6), 16) * (1 - factor) +
        parseInt(hex2.substring(4, 6), 16) * factor
    );

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  // Función para animar la transición de color
  const animateColorTransition = (startColors: string[], targetColors: string[]) => {
    const duration = 1000; // duración en milisegundos
    const startTime = performance.now();

    const updateColors = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      if (progress < 1) {
        const interpolatedColors = startColors.map((startColor, index) =>
          interpolateColor(startColor, targetColors[index], progress)
        );

        setCurrentColors(interpolatedColors);
        animationRef.current = requestAnimationFrame(updateColors);
      } else {
        setCurrentColors(targetColors);
        animationRef.current = null;
      }
    };

    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    animationRef.current = requestAnimationFrame(updateColors);
  };

  // Efecto para iniciar animación cuando cambia la sección activa
  useEffect(() => {
    if (activeSection in sectionColors) {
      const targetColors = sectionColors[activeSection as keyof typeof sectionColors];
      animateColorTransition(currentColors, targetColors);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [activeSection, currentColors]);

  // Detectar sección activa durante el scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'resume'];

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Si la sección está visible en la ventana
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Comprobar la sección inicial
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleAnimationComplete = () => {
    console.log('Animation completed!');
    store.dispatch(setLoaded(true));
  };

  return (
    <AppWrapper>
      <AuroraWrapper>
        <Aurora colorStops={currentColors} blend={0.5} amplitude={1.0} speed={0.5} />
      </AuroraWrapper>
      <NavBarStyled t={t} visible={visible} />
      <LanguageSelectorStyled visible={visible} />

      <Container>
        {/* Sección Home */}
        <Section id="home">
          <Content>
            <Title>
              <SimpleBlurText
                key={i18n.language}
                text={t('welcome')}
                onAnimationComplete={handleAnimationComplete}
              />
            </Title>
          </Content>
        </Section>

        {/* Sección About */}
        <Section id="about">
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
          >
            {t('navbar.about')}
          </ScrollFloat>
          <SectionContent>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel
              ultricies lacinia, nisl nisl aliquet nisl, nec aliquet nisl nisl sit amet lorem.
            </p>
          </SectionContent>
        </Section>

        {/* Sección Projects */}
        <Section id="projects">
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
          >
            {t('navbar.projects')}
          </ScrollFloat>
          <SectionContent>
            <p>
              Aquí irán tus proyectos. Esta sección puede ser expandida con tarjetas, imágenes, etc.
            </p>
          </SectionContent>
        </Section>

        {/* Sección Resume */}
        <Section id="resume">
          <ScrollFloat
            animationDuration={1}
            ease="back.inOut(2)"
            scrollStart="center bottom+=50%"
            scrollEnd="bottom bottom-=40%"
            stagger={0.03}
          >
            {t('navbar.resume')}
          </ScrollFloat>
          <SectionContent>
            <p>Información sobre tu experiencia, educación, habilidades, etc.</p>
          </SectionContent>
        </Section>

        <Routes>
          <Route path="/" element={<></>} />
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
