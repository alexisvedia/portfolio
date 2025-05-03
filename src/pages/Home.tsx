import React from 'react';
import styled from 'styled-components';
import PageTransition from '@components/PageTransition/PageTransition';
import HeroSection from '@components/HeroSection/HeroSection';
import BioSection from '@components/BioSection';
import ProjectsSection from '@components/ProjectsSection/ProjectsSection';
import SkillsSection from '@components/SkillsSection/SkillsSection';
import ContactSection from '@components/ContactSection/ContactSection';
import Footer from '@components/Footer/Footer';

const HomeContainer = styled.div`
  position: relative;
  z-index: 1;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
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
        <ProjectsSection />
        <ContentWrapper>
          <SkillsSection />
          <ContactSection />
          <Footer />
        </ContentWrapper>
      </HomeContainer>
    </PageTransition>
  );
};

export default Home;
