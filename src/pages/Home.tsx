import React from 'react';
import styled from 'styled-components';
import PageTransition from '@components/PageTransition/PageTransition';
import HeroSection from '@components/HeroSection/HeroSection';
import BioSection from '@components/BioSection';
import ProjectsSection from '@components/ProjectsSection/ProjectsSection';
import SkillsSection from '@components/SkillsSection/SkillsSection';
import Footer from '@components/Footer/Footer';
import AboutSection from '@components/AboutSection/AboutSection';

const HomeContainer = styled.div`
  position: relative;
  z-index: 1;
  overflow: hidden;
`;

const ContentWrapper = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Home: React.FC<{ onAnimationComplete?: () => void }> = ({ onAnimationComplete }) => {
  return (
    <PageTransition>
      <HomeContainer id="home">
        <ContentWrapper>
          <HeroSection onAnimationComplete={onAnimationComplete} />
          <BioSection />
          <AboutSection />
          <ProjectsSection />
          <SkillsSection />
          <Footer />
        </ContentWrapper>
      </HomeContainer>
    </PageTransition>
  );
};

export default Home;
