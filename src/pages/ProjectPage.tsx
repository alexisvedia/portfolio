import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import ferreyraImage from '../assets/ferreyra2.webp';
// @ts-ignore
import { SplineScene } from '../xcons';

const ProjectContainer = styled.div`
  padding: 0 20px 40px;
  max-width: 1200px;
  margin: 0 auto;
  color: ${({ theme }) => theme.colors.text};
`;

const ProjectHeader = styled.div`
  margin-bottom: 40px;
  text-align: center;
`;

// Mejorando el banner con degradado para todos los proyectos
const ProjectBanner = styled.div<{ $bgColor: string }>`
  background: linear-gradient(
    to bottom,
    ${({ $bgColor }) => $bgColor},
    ${({ $bgColor }) => `${$bgColor}dd`}
  );
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  margin-right: 0;
  margin-top: -120px; /* Compensar cualquier padding del contenedor principal */
  padding: 250px 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  /* margin-bottom: 80px; */
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.15);
  position: relative;

  @media (max-width: 768px) {
    padding: 200px 0 10px;
  }
`;

const BannerContent = styled.div`
  max-width: 1200px;
  width: 100%;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 992px) {
    flex-direction: column;
    text-align: center;
  }
`;

const BannerLeftContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  max-width: 600px;

  @media (max-width: 992px) {
    align-items: center;
    margin-bottom: 40px;
  }
`;

const BannerLogo = styled.img`
  max-width: 650px;
  margin-bottom: 70px;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15));

  @media (max-width: 1200px) {
    max-width: 550px;
  }

  @media (max-width: 992px) {
    max-width: 480px;
  }

  @media (max-width: 576px) {
    max-width: 380px;
  }
`;

const BannerWebImage = styled.img`
  max-width: 500px;
  height: auto;
  filter: drop-shadow(0 4px 15px rgba(0, 0, 0, 0.2));

  @media (max-width: 1200px) {
    max-width: 400px;
  }

  @media (max-width: 992px) {
    max-width: 90%;
  }
`;

const BannerTitle = styled.h1`
  font-family: 'Morganite', sans-serif;
  font-size: 80px;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 20px;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 60px;
  }
`;

const BannerDescription = styled.p`
  font-size: 20px;
  line-height: 1.8;
  max-width: 600px;
  text-align: justify;
  color: white;
  font-weight: 400;
  letter-spacing: 0.3px;

  @media (max-width: 992px) {
    text-align: center;
    font-size: 18px;
  }
`;

const ProjectTitle = styled.h1`
  font-family: 'Morganite', sans-serif;
  font-size: 80px;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 20px;
`;

const ProjectDescription = styled.p`
  font-size: 18px;
  line-height: 1.6;
  max-width: 800px;
  margin: 0 auto;
`;

const ProjectContent = styled.div`
  margin-top: ${({ theme }) => theme.space.xl};
`;

const BackButton = styled.button`
  padding: 10px 20px;
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 40px;

  &:hover {
    background: ${({ theme }) => theme.colors.secondary};
  }
`;

// Nuevos componentes para la experiencia XCONS
const ExperienceContainer = styled.div`
  max-width: 900px;
  margin: 0 auto 60px;
  padding: 0;
`;

const ExperienceCard = styled.div`
  background: transparent;
  backdrop-filter: none;
  padding: 0;
  box-shadow: none;
  margin-bottom: 40px;
`;

const RoleTitle = styled.h2`
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 12px;
  color: ${({ theme }) => theme.colors.primary};
`;

const RolePeriod = styled.div`
  font-size: 16px;
  color: ${({ theme }) => `${theme.colors.text}99`};
  margin-bottom: 24px;
  display: flex;
  align-items: center;
`;

const LocationBadge = styled.span`
  background: ${({ theme }) => `${theme.colors.primary}55`};
  color: ${({ theme }) => theme.colors.primary};
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  margin-left: 16px;
  display: inline-flex;
  align-items: center;
  font-weight: 500;
`;

const SkillsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
`;

const SkillBadge = styled.span`
  background: ${({ theme }) =>
    theme.isDark ? 'rgba(40, 40, 60, 0.6)' : 'rgba(230, 230, 235, 0.9)'};
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const RoleDescription = styled.p`
  font-size: 16px;
  line-height: 1.8;
  color: ${({ theme }) => `${theme.colors.text}ee`};
  margin-bottom: 16px;
`;

const ExperienceDivider = styled.div`
  height: 1px;
  background: ${({ theme }) => `${theme.colors.text}33`};
  margin: 32px 0;
`;

const ProjectLogoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
`;

const SplineContainer = styled.div`
  width: 100%;
  height: auto;
  margin-top: 80px;
  margin-bottom: 40px;
  position: relative;
`;

const SplineTitle = styled.h3`
  font-size: 28px;
  margin-bottom: 25px;
  color: #15814B;
  text-align: center;
  font-weight: 600;
`;

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  color: string;
}

const ProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);

  // Datos de ejemplo de proyectos - en una aplicación real, estos datos podrían venir de una API
  const projectsData: Record<string, Project> = {
    condamind: {
      id: 'condamind',
      title: 'Condamind',
      description: t(
        'companyDescriptions.condamind',
        'Empresa líder en tecnologías cognitivas y soluciones de IA avanzadas.'
      ),
      image: '/images/projects/Condamind.svg',
      color: '#262626',
    },
    fusionads: {
      id: 'fusionads',
      title: 'FusionAds',
      description: t(
        'companyDescriptions.fusionads',
        'Plataforma innovadora de publicidad digital que integra tecnologías emergentes.'
      ),
      image: '/images/projects/Fusionads.svg',
      color: '#F7480B',
    },
    bandit: {
      id: 'bandit',
      title: 'Bandit',
      description: t(
        'companyDescriptions.bandit',
        'Soluciones disruptivas en seguridad informática y protección de datos.'
      ),
      image: '/images/projects/Bandit.svg',
      color: '#F70F43',
    },
    xcons: {
      id: 'xcons',
      title: 'XCONS',
      description: t(
        'companyDescriptions.xcons',
        'Plataforma de e-commerce especializada en la venta omnicanal de materiales de construcción.'
      ),
      image: '/images/projects/XCONS.svg',
      color: '#15814B',
    },
  };

  useEffect(() => {
    if (projectId) {
      const foundProject = projectsData[projectId];
      if (foundProject) {
        setProject(foundProject);
      } else {
        // Si no existe el proyecto, redirigimos a la página principal
        navigate('/');
      }
    }
  }, [projectId, navigate]);

  if (!project) {
    return <div>Cargando...</div>;
  }

  // Renderizado condicional para XCONS
  const renderProjectContent = () => {
    if (project.id === 'xcons') {
      return (
        <>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <RoleTitle>UI/UX Designer & Especialista en garantía de calidad</RoleTitle>
            <RolePeriod>
              ago. 2022 - may. 2024 · 1 año 10 meses
              <LocationBadge>{t('remote', 'En remoto')}</LocationBadge>
            </RolePeriod>

            <SkillsContainer>
              <SkillBadge>Adobe Photoshop</SkillBadge>
              <SkillBadge>Magento</SkillBadge>
              <SkillBadge>+8 aptitudes</SkillBadge>
            </SkillsContainer>

            <RoleDescription>
              {i18n.language.startsWith('es')
                ? 'Como diseñador UI/UX y gráfico, lideré la creación y organización de bibliotecas de componentes, definiendo experiencias de usuario para interfaces desktop y móviles y creando material visual para marketing. Optimicé flujos clave del e-commerce (incluyendo checkout, compra, micrositios y gestión de vendors) y participé activamente en la transición de marca y dominio desde ViviendaVerde a XCONS, contribuyendo a la nueva identidad visual. Colaboré estrechamente con el equipo de desarrollo front-end, ejecutando tareas de maquetación web y guiando a otros diseñadores en el contexto de la empresa.'
                : 'As a UI/UX and Graphic Designer, I led the creation and organization of component libraries, defined user experiences for desktop and mobile interfaces, and created visual assets for marketing. I optimized key e-commerce flows (including checkout, purchasing, microsites, and vendor management) and actively participated in the brand and domain transition from ViviendaVerde to XCONS, contributing to the new visual identity. Collaborating closely with the front-end development team, I executed web development tasks and provided guidance to fellow designers regarding the company\'s context.'}
            </RoleDescription>

            <div
              style={{
                marginTop: '40px',
                marginBottom: '20px',
                display: 'flex',
                flexDirection: 'row',
                position: 'relative',
              }}
            >
              <div
                style={{
                  flex: '0 0 50%',
                  paddingRight: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}
              >
                <h3
                  style={{
                    fontSize: '24px',
                    marginBottom: '15px',
                    color: '#15814B',
                  }}
                >
                  {i18n.language.startsWith('es')
                    ? 'Diseño de e-commerce para Ferreyra'
                    : 'E-commerce design for Ferreyra'}
                </h3>
                <p
                  style={{
                    fontSize: '16px',
                    lineHeight: '1.6',
                  }}
                >
                  {i18n.language.startsWith('es')
                    ? 'Desarrollo de interfaz para empresa de materiales de construcción, incluyendo sistema de categorías, filtros avanzados y proceso de checkout optimizado.'
                    : 'Interface development for a construction materials company, including category system, advanced filters, and optimized checkout process.'}
                </p>
              </div>
              <div
                style={{
                  flex: '0 0 35%',
                  marginLeft: '15%',
                  overflow: 'visible',
                  position: 'relative',
                  zIndex: '1',
                }}
              >
                <img
                  src={ferreyraImage}
                  alt="Diseño de interfaz XCONS para Ferreyra"
                  style={{
                    width: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                  }}
                />
              </div>
            </div>
            
            <SplineContainer>
              <SplineTitle>
                {i18n.language.startsWith('es')
                  ? 'Modelo 3D Interactivo'
                  : 'Interactive 3D Model'}
              </SplineTitle>
              <SplineScene />
            </SplineContainer>
          </div>
        </>
      );
    } else if (project.id === 'condamind') {
      return (
        <>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <RoleTitle>Desarrollador Full Stack & Especialista en IA</RoleTitle>
            <RolePeriod>
              ene. 2023 - Actualidad · 1 año 6 meses
              <LocationBadge>{t('remote', 'En remoto')}</LocationBadge>
            </RolePeriod>

            <SkillsContainer>
              <SkillBadge>React</SkillBadge>
              <SkillBadge>Node.js</SkillBadge>
              <SkillBadge>Python</SkillBadge>
              <SkillBadge>TensorFlow</SkillBadge>
              <SkillBadge>+5 aptitudes</SkillBadge>
            </SkillsContainer>

          </div>
        </>
      );
    } else if (project.id === 'fusionads') {
      return (
        <>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <RoleTitle>Marketing Digital & Especialista en Publicidad</RoleTitle>
            <RolePeriod>
              mar. 2021 - dic. 2022 · 1 año 9 meses
              <LocationBadge>{t('remote', 'En remoto')}</LocationBadge>
            </RolePeriod>

            <SkillsContainer>
              <SkillBadge>Google Ads</SkillBadge>
              <SkillBadge>Facebook Ads</SkillBadge>
              <SkillBadge>SEO</SkillBadge>
              <SkillBadge>+4 aptitudes</SkillBadge>
            </SkillsContainer>

           
          </div>
        </>
      );
    } else if (project.id === 'bandit') {
      return (
        <>
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <RoleTitle>Ingeniero de Seguridad & Analista de Ciberseguridad</RoleTitle>
            <RolePeriod>
              jun. 2020 - feb. 2021 · 8 meses
              <LocationBadge>{t('remote', 'En remoto')}</LocationBadge>
            </RolePeriod>

            <SkillsContainer>
              <SkillBadge>Ethical Hacking</SkillBadge>
              <SkillBadge>Pentesting</SkillBadge>
              <SkillBadge>Firewall</SkillBadge>
              <SkillBadge>+6 aptitudes</SkillBadge>
            </SkillsContainer>

          
          </div>
        </>
      );
    }

    return (
      <>
        <img
          src={project.image}
          alt={project.title}
          style={{ maxWidth: '200px', margin: '0 auto', display: 'block' }}
        />
      </>
    );
  };

  return (
    <>
      <ProjectBanner $bgColor={project.color}>
        <BannerContent>
          <BannerLeftContent>
            <img
              src={project.image}
              alt={project.title}
              style={{ width: '60%', maxWidth: '1000px', marginBottom: '0' }}
            />
            <BannerDescription>{project.description}</BannerDescription>
          </BannerLeftContent>

          <BannerWebImage 
            src={project.id === 'xcons' ? "/images/web-xconx.png" : "/images/projects/fallback-image.jpg"} 
            alt={`${project.title} Website`} 
          />
        </BannerContent>
      </ProjectBanner>

      <ProjectContainer style={{ paddingTop: 0 }}>
        <ProjectContent>{renderProjectContent()}</ProjectContent>

        <BackButton onClick={() => navigate('/')}>{t('backToHome', 'Volver al inicio')}</BackButton>
      </ProjectContainer>
    </>
  );
};

export default ProjectPage;
