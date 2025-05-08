import React from 'react';
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
}

const Home: React.FC<HomeProps> = ({ onAnimationComplete, fontsLoaded }) => {
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
          <ContactSection />
        </ContentWrapper>
      </HomeContainer>
    </PageTransition>
  );
};

export default Home;
