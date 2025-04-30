import React, { useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useTranslation } from 'react-i18next';

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const SectionContainer = styled.section`
  padding: ${({ theme }) => theme.space.xl} 0;
  position: relative;
  overflow: hidden;
  width: 100%;
  margin: 3rem 0;
`;

const ContentWrapper = styled.div<{ $visible: boolean }>`
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  animation: ${props => (props.$visible ? fadeIn : 'none')} 1.2s ease-out forwards;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    padding: 0 ${({ theme }) => theme.space.md};
  }
`;

const ProfileImage = styled.img`
  max-width: 45%;
  height: auto;
  display: block;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 80%;
    margin-bottom: 1.5rem;
  }
`;

const TextContainer = styled.div`
  flex: 1;
  padding-left: 10px;
  max-width: 45%;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding-left: 0;
    max-width: 100%;
    text-align: center;
  }
`;

const SectionTitle = styled.h2`
  font-family: 'Morganite', sans-serif;
  font-weight: 900;
  font-size: 5rem;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.5rem;
  line-height: 0.9;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 4rem;
    margin-bottom: 1rem;
  }
`;

const BioText = styled.p`
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.5;
  margin-bottom: 1.5rem;
  font-size: 1.15rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  text-shadow: 0 1px 2px ${({ theme }) => theme.isDark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)'};
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: 1.05rem;
    line-height: 1.4;
  }
`;

const BioSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  return (
    <SectionContainer ref={sectionRef}>
      <ContentWrapper $visible={isVisible}>
        <ProfileImage 
          src="/images/projects/alexis.png" 
          alt="Alexis Vedia" 
        />
        <TextContainer>
          <SectionTitle>{i18n.language === 'es' ? 'SOBRE MÍ' : 'ABOUT ME'}</SectionTitle>
          <BioText>{t('about.bio.part1')}</BioText>
          <BioText>{t('about.bio.part2')}</BioText>
        </TextContainer>
      </ContentWrapper>
    </SectionContainer>
  );
};

export default BioSection; 