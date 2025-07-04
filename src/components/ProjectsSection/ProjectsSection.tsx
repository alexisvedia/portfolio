import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import FlowingMenu from '@components/FlowingMenu';


import fusionadsLogo from '../../assets/images/projects/Fusionads.svg';
import banditLogo from '../../assets/images/projects/Bandit.svg';
import xconsLogo from '../../assets/images/projects/XCONS.svg';

const SectionContainer = styled.section`
  padding: 0 0 ${({ theme }) => theme.space['2xl']};
  position: relative;
  z-index: 5;
`;


const TitleContainer = styled.div`
  margin-top: 4rem;
  padding-top: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 3rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  position: relative;
  font-family: ${({ theme }) => theme.fonts.body};
`;

const MenuContainer = styled.div`
  width: 100%;
  height: 600px;
  position: relative;
  overflow: hidden;
`;

const ProjectsSection: React.FC = () => {
  const { t } = useTranslation();


  const companyItems = [
    {
      link: '/xcons',
      text: 'XCONS',
      image: xconsLogo,
      color: '#15814B',
      description: t(
        'companyDescriptions.xcons',
        'Constructora innovadora con enfoque en soluciones sustentables y tecnología avanzada.'
      ),
    },
    {
      link: '/fusionads',
      text: 'FusionAds',
      image: fusionadsLogo,
      color: '#F7480B',
      description: t(
        'companyDescriptions.fusionads',
        'Plataforma innovadora de publicidad digital que integra tecnologías emergentes.'
      ),
    },
    {
      link: '/bandit',
      text: 'Bandit',
      image: banditLogo,
      color: '#F70F43',
      description: t(
        'companyDescriptions.bandit',
        'Soluciones disruptivas en seguridad informática y protección de datos.'
      ),
    },
    {
      link: '/otros',
      text: t('navbar.otros', 'Otros Proyectos'),
      color: '#262626',
      description: t(
        'companyDescriptions.otros',
        'Diversos proyectos personales y profesionales en desarrollo.'
      ),
    },
  ];

  return (
    <SectionContainer id="experience">
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
