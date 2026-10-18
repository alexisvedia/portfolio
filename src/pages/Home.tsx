import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import PageTransition from '@components/PageTransition/PageTransition';
import SEOContent from '@components/SEOContent';
import Landing from '@/features/landing';

const HomeContainer = styled.div`
  position: relative;
  z-index: 1;
`;

interface HomeProps {
  onAnimationComplete?: () => void;
  fontsLoaded: boolean;
  onContactSectionViewChange: (isInView: boolean) => void;
}

const Home: React.FC<HomeProps> = ({ onAnimationComplete, onContactSectionViewChange }) => {
  const contactSectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    onAnimationComplete?.();
  }, [onAnimationComplete]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        onContactSectionViewChange(entry.isIntersecting);
      },
      {
        rootMargin: '0px',
        threshold: 0.5,
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
        <SEOContent />
        <Landing ref={contactSectionRef} />
      </HomeContainer>
    </PageTransition>
  );
};

export default Home;