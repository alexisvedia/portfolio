import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import FlowingMenu from '@components/FlowingMenu';

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

const MenuContainer = styled.div`
  width: 100%;
  height: 600px;
  position: relative;
  overflow: hidden;
`;

const ProjectsSection: React.FC = () => {
  const { t } = useTranslation();

  // Definir los elementos del menú con los logos y colores de las empresas
  const companyItems = [
    { 
      link: '#', 
      text: 'Condamind', 
      image: '/images/projects/Condamind.svg',
      color: '#262626'
    },
    { 
      link: '#', 
      text: 'FusionAds', 
      image: '/images/projects/Fusionads.svg',
      color: '#F7480B'
    },
    { 
      link: '#', 
      text: 'Bandit', 
      image: '/images/projects/Bandit.svg',
      color: '#F70F43'
    },
    { 
      link: '#', 
      text: 'XCONS', 
      image: '/images/projects/XCONS.svg',
      color: '#15814B'
    }
  ];

  return (
    <SectionContainer id="projects">
      <TitleContainer>
        <SectionTitle>{t('experience')}</SectionTitle>
      </TitleContainer>

      <MenuContainer>
        <FlowingMenu items={companyItems} />
      </MenuContainer>
    </SectionContainer>
  );
};

export default ProjectsSection;
