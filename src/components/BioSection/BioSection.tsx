import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import ScrollReveal from '@components/ScrollReveal';
import TechSlider from '@components/TechSlider';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Nueva importación de imagen
import alexisImage from '../../assets/images/projects/alexis.png';

gsap.registerPlugin(ScrollTrigger);

const SectionContainer = styled.section`
  padding: ${({ theme }) => theme.space.xl} 0;
  position: relative;
  overflow: hidden;
  width: 100%;
  margin: -5vh 0 10rem 0;
  padding-top: 5vh;
`;

const ContentWrapper = styled.div`
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    padding: 0 ${({ theme }) => theme.space.md};
  }
`;

const ProfileImageContainer = styled.div`
  max-width: 45%;
  overflow: hidden;
  position: relative;
  will-change: transform, opacity, filter;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    max-width: 80%;
    margin-bottom: 1.5rem;
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
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

const SectionTitleStyles = styled.div`
  .title-text {
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
  }
`;

const StyledScrollReveal = styled(ScrollReveal)`
  margin-bottom: 0;
  line-height: normal;
`;

const BioTextContainer = styled.div`
  margin-bottom: 1rem;
  line-height: 1.1;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const TechSliderContainer = styled.div`
  width: 100%;
  margin-top: 3rem;
  position: relative;
  opacity: 0;
  transform: translateY(20px);
`;

const BioSection: React.FC = () => {
  const { t, i18n } = useTranslation();
  const imageRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Obtener los textos completos
  const bioPart1 = t('about.bio.part1');
  const bioPart2 = t('about.bio.part2');
  
  useEffect(() => {
    const imageElement = imageRef.current;
    const titleElement = titleRef.current;
    const sliderElement = sliderRef.current;
    
    if (!imageElement || !titleElement || !sectionRef.current || !sliderElement) return;
    
    // Configuración inicial de la imagen y título
    gsap.set([imageElement, titleElement], { 
      opacity: 0,
      y: 30,
      scale: 0.95,
      filter: 'blur(10px)'
    });
    
    // Configuración inicial del slider
    gsap.set(sliderElement, {
      opacity: 0,
      y: 20
    });
    
    // Animación de la imagen
    gsap.to(imageElement, {
      opacity: 1,
      y: 0,
      x: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
        end: 'top 30%',
        scrub: true,
      }
    });
    
    // Animación del título (ligeramente adelantada)
    gsap.to(titleElement, {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 85%',
        end: 'top 40%',
        scrub: true,
      }
    });
    
    // Animación del slider (aparece más tarde)
    gsap.to(sliderElement, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: sliderElement,
        start: 'top 85%',
        end: 'top 50%',
        scrub: true,
      }
    });
    
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  return (
    <SectionContainer ref={sectionRef} id="about">
      <ContentWrapper>
        <ProfileImageContainer ref={imageRef}>
          <ProfileImage 
            src={alexisImage}
            alt="Alexis Vedia" 
          />
        </ProfileImageContainer>
        <TextContainer>
          <SectionTitleStyles ref={titleRef}>
            <StyledScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={10}
              blurStrength={20}
              textClassName="title-text"
            >
              {i18n.language === 'es' ? 'SOBRE MÍ' : 'ABOUT ME'}
            </StyledScrollReveal>
          </SectionTitleStyles>
          
          <BioTextContainer>
            {/* Usar el texto completo para el párrafo 1 */}
            <StyledScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={8}
              blurStrength={15}
              textClassName="bio-text"
            >
              {bioPart1}
            </StyledScrollReveal>
          </BioTextContainer>
          
          <BioTextContainer>
            {/* Usar el texto completo para el párrafo 2 */}
            <StyledScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={8}
              blurStrength={15}
              textClassName="bio-text"
            >
              {bioPart2}
            </StyledScrollReveal>
          </BioTextContainer>
        </TextContainer>
      </ContentWrapper>
      
      <TechSliderContainer ref={sliderRef}>
        <TechSlider />
      </TechSliderContainer>
    </SectionContainer>
  );
};

export default BioSection; 