import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const ProjectContainer = styled.div`
  padding: 120px 20px 40px;
  max-width: 1200px;
  margin: 0 auto;
  color: ${({ theme }) => theme.colors.text};
`;

const ProjectHeader = styled.div`
  margin-bottom: 40px;
  text-align: center;
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
  margin-top: 60px;
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

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  color: string;
}

const ProjectPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const { t } = useTranslation();
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
        'Constructora innovadora con enfoque en soluciones sustentables y tecnología avanzada.'
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

  return (
    <ProjectContainer>
      <ProjectHeader>
        <ProjectTitle style={{ color: project.color }}>{project.title}</ProjectTitle>
        <ProjectDescription>{project.description}</ProjectDescription>
      </ProjectHeader>

      <ProjectContent>
        {/* Aquí iría el contenido específico del proyecto */}
        <img
          src={project.image}
          alt={project.title}
          style={{ maxWidth: '200px', margin: '0 auto', display: 'block' }}
        />
      </ProjectContent>

      <BackButton onClick={() => navigate('/')}>{t('backToHome', 'Volver al inicio')}</BackButton>
    </ProjectContainer>
  );
};

export default ProjectPage;
