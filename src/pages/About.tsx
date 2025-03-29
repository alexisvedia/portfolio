import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import LanguageMorphingTitle from '@components/LanguageMorphingTitle';
import PageTransition from '@components/PageTransition/PageTransition';

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

const SectionContent = styled.div`
  max-width: 800px;
  width: 100%;
  margin-bottom: 2rem;

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

const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.space.xl};
  padding-top: 5rem;
  gap: 2rem;
  background-color: ${({ theme }) => theme.colors.background};
`;

const About: React.FC = () => {
  const {} = useTranslation();

  // Ya no necesitamos actualizar los colores del fondo Aurora
  // porque lo hemos eliminado

  return (
    <PageTransition>
      <Content>
        <StyledMorphingTitle translationKey="navbar.about" morphTime={0.8} cooldownTime={0.2} />
        <SectionContent>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3
              style={{
                fontSize: '1.8rem',
                marginBottom: '1rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              Perfil Profesional
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            <div>
              <p>
                Desarrollador frontend apasionado, especializado en React y TypeScript, con vasta
                experiencia en diseño UX/UI y gran interés en la integración de soluciones de
                inteligencia artificial.
              </p>
              <p>
                Me destaco por mi adaptabilidad, capacidad de trabajar en equipo, humildad y
                compromiso constante con la excelencia. Siempre estoy en busca de desafíos que
                impulsen mi crecimiento profesional y personal.
              </p>
              <div style={{ marginTop: '1.5rem' }}>
                <h4
                  style={{
                    fontSize: '1.2rem',
                    marginBottom: '0.5rem',
                    color: 'rgba(255, 255, 255, 0.9)',
                  }}
                >
                  Idiomas
                </h4>
                <p>Español: Nativo</p>
                <p>Inglés: Nivel Intermedio</p>
              </div>
            </div>

            <div
              style={{
                height: '300px',
                width: '300px',
                borderRadius: '50%',
                overflow: 'hidden',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                margin: '0 auto',
              }}
            >
              <img
                src="/src/assets/profile-image.png"
                alt="Foto de perfil"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </div>
          </div>
        </SectionContent>

        <SectionContent>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3
              style={{
                fontSize: '1.8rem',
                marginBottom: '1rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              Experiencia Profesional
            </h3>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h4
              style={{
                fontSize: '1.4rem',
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              Desarrollador Frontend Senior
            </h4>
            <p
              style={{
                fontSize: '1.1rem',
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '0.5rem',
              }}
            >
              Empresa XYZ | 2020 - Presente
            </p>
            <ul style={{ color: 'rgba(255, 255, 255, 0.8)', paddingLeft: '1.5rem' }}>
              <li>
                Desarrollo de aplicaciones web utilizando React, TypeScript y styled-components.
              </li>
              <li>Implementación de arquitecturas escalables y mantenibles.</li>
              <li>Colaboración en equipos multidisciplinarios utilizando metodologías ágiles.</li>
              <li>Optimización de rendimiento y experiencia de usuario.</li>
            </ul>
          </div>

          <div>
            <h4
              style={{
                fontSize: '1.4rem',
                marginBottom: '0.5rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              Desarrollador Frontend
            </h4>
            <p
              style={{
                fontSize: '1.1rem',
                color: 'rgba(255, 255, 255, 0.7)',
                marginBottom: '0.5rem',
              }}
            >
              Empresa ABC | 2018 - 2020
            </p>
            <ul style={{ color: 'rgba(255, 255, 255, 0.8)', paddingLeft: '1.5rem' }}>
              <li>Desarrollo de interfaces de usuario con React y JavaScript.</li>
              <li>Implementación de diseños responsivos y accesibles.</li>
              <li>Integración con APIs RESTful y GraphQL.</li>
            </ul>
          </div>
        </SectionContent>

        <SectionContent>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3
              style={{
                fontSize: '1.8rem',
                marginBottom: '1rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              Proyectos Destacados
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
            }}
          >
            <div
              style={{
                background: 'rgba(60, 60, 80, 0.3)',
                borderRadius: '0.8rem',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <h4
                style={{
                  fontSize: '1.3rem',
                  marginBottom: '1rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                Portfolio Personal
              </h4>
              <p>
                Sitio web personal desarrollado con React, TypeScript y Vite, con animaciones
                avanzadas y diseño responsive.
              </p>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    background: 'rgba(100, 108, 255, 0.3)',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '1rem',
                    fontSize: '0.85rem',
                  }}
                >
                  React
                </span>
                <span
                  style={{
                    background: 'rgba(100, 108, 255, 0.3)',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '1rem',
                    fontSize: '0.85rem',
                  }}
                >
                  TypeScript
                </span>
                <span
                  style={{
                    background: 'rgba(100, 108, 255, 0.3)',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '1rem',
                    fontSize: '0.85rem',
                  }}
                >
                  Styled Components
                </span>
              </div>
            </div>

            <div
              style={{
                background: 'rgba(60, 60, 80, 0.3)',
                borderRadius: '0.8rem',
                padding: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '';
              }}
            >
              <h4
                style={{
                  fontSize: '1.3rem',
                  marginBottom: '1rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                E-commerce App
              </h4>
              <p>
                Aplicación de comercio electrónico con carrito de compras, pasarela de pagos y panel
                de administración.
              </p>
              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    background: 'rgba(100, 108, 255, 0.3)',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '1rem',
                    fontSize: '0.85rem',
                  }}
                >
                  React
                </span>
                <span
                  style={{
                    background: 'rgba(100, 108, 255, 0.3)',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '1rem',
                    fontSize: '0.85rem',
                  }}
                >
                  Redux
                </span>
                <span
                  style={{
                    background: 'rgba(100, 108, 255, 0.3)',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '1rem',
                    fontSize: '0.85rem',
                  }}
                >
                  Node.js
                </span>
              </div>
            </div>
          </div>
        </SectionContent>

        <SectionContent>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h3
              style={{
                fontSize: '1.8rem',
                marginBottom: '1rem',
                color: 'rgba(255, 255, 255, 0.9)',
              }}
            >
              Habilidades
            </h3>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '2rem',
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: '1.3rem',
                  marginBottom: '1rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                Frontend
              </h4>
              <ul style={{ color: 'rgba(255, 255, 255, 0.8)', paddingLeft: '1.5rem' }}>
                <li>React / React Native</li>
                <li>TypeScript / JavaScript</li>
                <li>HTML5 / CSS3</li>
                <li>Styled Components</li>
                <li>Redux / Context API</li>
              </ul>
            </div>

            <div>
              <h4
                style={{
                  fontSize: '1.3rem',
                  marginBottom: '1rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                Backend
              </h4>
              <ul style={{ color: 'rgba(255, 255, 255, 0.8)', paddingLeft: '1.5rem' }}>
                <li>Node.js</li>
                <li>Express</li>
                <li>MongoDB</li>
                <li>Firebase</li>
                <li>RESTful APIs</li>
              </ul>
            </div>

            <div>
              <h4
                style={{
                  fontSize: '1.3rem',
                  marginBottom: '1rem',
                  color: 'rgba(255, 255, 255, 0.9)',
                }}
              >
                Herramientas
              </h4>
              <ul style={{ color: 'rgba(255, 255, 255, 0.8)', paddingLeft: '1.5rem' }}>
                <li>Git / GitHub</li>
                <li>Webpack / Vite</li>
                <li>Jest / Testing Library</li>
                <li>Figma / Adobe XD</li>
                <li>CI/CD</li>
              </ul>
            </div>
          </div>
        </SectionContent>
      </Content>
    </PageTransition>
  );
};

export default About;
