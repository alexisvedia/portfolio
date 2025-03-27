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

const About: React.FC = () => {
  const {} = useTranslation();

  // Cuando el componente se monta, actualiza los colores para esta página
  useEffect(() => {
    // Emitir evento para cambiar los colores del fondo Aurora
    const event = new CustomEvent('updateAuroraColors', {
      detail: {
        colors: ['#ff6464', '#ffc382', '#ffa6a6'],
      },
    });
    window.dispatchEvent(event);
  }, []);

  return (
    <PageTransition>
      <Content>
        <StyledMorphingTitle translationKey="navbar.about" morphTime={0.8} cooldownTime={0.2} />
        <SectionContent>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vel ultricies
            lacinia, nisl nisl aliquet nisl, nec aliquet nisl nisl sit amet lorem.
          </p>
        </SectionContent>
      </Content>
    </PageTransition>
  );
};

export default About;
