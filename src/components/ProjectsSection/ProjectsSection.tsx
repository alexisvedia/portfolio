import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

const SectionContainer = styled.section`
  padding: 0 0 ${({ theme }) => theme.space['2xl']};
  position: relative;
  z-index: 5;
`;

// Contenedor para el título con un poco de margen superior
const TitleContainer = styled.div`
  margin-top: 4rem;
  padding-top: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 80px;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 3rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  position: relative;
  font-family: 'Morganite', sans-serif;
  letter-spacing: 0;
`;

const Container = styled.div`
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
`;

const Panel = styled.section<{ color?: string }>`
  position: absolute;
  will-change: transform;
  width: 100%;
  height: 100%;
  background-color: ${({ color }) => color || 'transparent'};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  color: white;
`;

const Description = styled(Panel)`
  padding: 2rem;
`;

const ProjectsSection: React.FC = () => {
  const { t } = useTranslation();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to('.panel:not(:last-child)', {
      yPercent: -100,
      ease: 'none',
      stagger: 0.5,
      scrollTrigger: {
        trigger: '#scroll-container',
        start: 'top top',
        end: '+=300%',
        scrub: true,
        pin: true,
      },
    });

    gsap.set('.panel', { zIndex: (i, target, targets) => targets.length - i });

    return () => {
      // Limpieza de ScrollTrigger
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <SectionContainer id="projects">
      <TitleContainer>
        <SectionTitle>{t('experience')}</SectionTitle>
      </TitleContainer>

      <Container id="scroll-container">
        <Description className="panel" color="#3498db">
          <div>
            <h1>Layered pinning from bottom</h1>
            <p>A simple example where overlapping panels reveal from the bottom.</p>
          </div>
        </Description>

        <Panel className="panel" color="#e74c3c">
          <div>ONE</div>
        </Panel>

        <Panel className="panel" color="#f39c12">
          <div>TWO</div>
        </Panel>

        <Panel className="panel" color="#9b59b6">
          <div>THREE</div>
        </Panel>
      </Container>
    </SectionContainer>
  );
};

export default ProjectsSection;
