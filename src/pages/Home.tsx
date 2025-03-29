import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import SimpleBlurText from '@components/SimpleBlurText';
import PageTransition from '@components/PageTransition/PageTransition';

const Content = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: ${({ theme }) => theme.space.xl};
  padding-top: 5rem;
`;

const Title = styled.div`
  font-family:
    'Inter',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    Oxygen,
    Ubuntu,
    Cantarell,
    'Open Sans',
    'Helvetica Neue',
    sans-serif;
  font-size: ${({ theme }) => theme.fontSizes['5xl']};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.space['2xl']};
  text-align: center;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`;

const Home: React.FC<{ onAnimationComplete?: () => void }> = ({ onAnimationComplete }) => {
  const { t, i18n } = useTranslation();

  // Ya no necesitamos actualizar los colores del fondo Aurora
  // porque lo hemos eliminado

  return (
    <PageTransition>
      <Content>
        <Title>
          <SimpleBlurText
            key={i18n.language}
            text={t('welcome')}
            onAnimationComplete={onAnimationComplete}
          />
        </Title>
      </Content>
    </PageTransition>
  );
};

export default Home;
