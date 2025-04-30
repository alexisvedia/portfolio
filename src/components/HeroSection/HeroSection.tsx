import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import SimpleBlurText from '../SimpleBlurText';

const HeroContainer = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 90vh;
  padding: ${({ theme }) => theme.space.xl};
  text-align: center;
  position: relative;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes['5xl']};
  font-weight: 800;
  margin-bottom: ${({ theme }) => theme.space.md};
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.2;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: calc(${({ theme }) => theme.fontSizes['5xl']} * 1.2);
  }
`;

const Subtitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 400;
  margin-bottom: ${({ theme }) => theme.space.xl};
  color: ${({ theme }) => `${theme.colors.text}cc`};
  max-width: 800px;

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    font-size: ${({ theme }) => theme.fontSizes['3xl']};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.md};
  margin-top: ${({ theme }) => theme.space.lg};
  flex-wrap: wrap;
  justify-content: center;
`;

const PrimaryButton = styled.a`
  padding: ${({ theme }) => `${theme.space.md} ${theme.space.xl}`};
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
  border: none;
  border-radius: 6px;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => `${theme.colors.primary}dd`};
    transform: translateY(-2px);
  }
`;

const HeroSection: React.FC<{ onAnimationComplete?: () => void }> = ({ onAnimationComplete }) => {
  const { t, i18n } = useTranslation();
  
  return (
    <HeroContainer>
      <Title>
        <SimpleBlurText
          key={i18n.language}
          text={t('heroTitle')}
          onAnimationComplete={onAnimationComplete}
        />
      </Title>
      <Subtitle>{t('heroSubtitle')}</Subtitle>
      <ButtonContainer>
        <PrimaryButton href="#projects">{t('viewProjects')}</PrimaryButton>
        <PrimaryButton href="#about">{t('navbar.about')}</PrimaryButton>
      </ButtonContainer>
    </HeroContainer>
  );
};

export default HeroSection; 