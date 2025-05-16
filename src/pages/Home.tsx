import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import PageTransition from '@components/PageTransition/PageTransition';
import HeroSection from '@components/HeroSection/HeroSection';
import BioSection from '@components/BioSection';
import ProjectsSection from '@components/ProjectsSection/ProjectsSection';
import TestimonialsSection from '@components/TestimonialsSection/TestimonialsSection';
import ContactSection from '@components/ContactSection/ContactSection';

const HomeContainer = styled.div`
  position: relative;
  z-index: 1;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 1rem;
`;

interface HomeProps {
  onAnimationComplete?: () => void;
  fontsLoaded: boolean;
  onContactSectionViewChange: (isInView: boolean) => void;
}

const Home: React.FC<HomeProps> = ({ onAnimationComplete, fontsLoaded, onContactSectionViewChange }) => {
  const contactSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        onContactSectionViewChange(entry.isIntersecting);
      },
      {
        rootMargin: '0px',
        threshold: 0.1,
      }
    );

    const currentRef = contactSectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [onContactSectionViewChange]);

  return (
    <PageTransition>
      <HomeContainer id="home">
        <ContentWrapper>
          <HeroSection onAnimationComplete={onAnimationComplete} fontsLoaded={fontsLoaded} />
          <BioSection />
        </ContentWrapper>
        <ContentWrapper>
          <ProjectsSection />
        </ContentWrapper>
        <TestimonialsSection />
        <ContentWrapper>
          <ContactSection ref={contactSectionRef} id="contact-section-home" />
        </ContentWrapper>
      </HomeContainer>
    </PageTransition>
  );
};

export default Home;
