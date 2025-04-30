import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import ProjectCard, { ProjectCardProps } from '../ProjectCard/ProjectCard';
import { useTheme } from '../../context/ThemeContext';

const SectionContainer = styled.section`
  padding: ${({ theme }) => theme.space['2xl']} 0;
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['4xl']};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space.xl};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${({ theme }) => theme.space.xl};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

// Función para generar URLs de imágenes de placeholder
const getPlaceholderImage = (index: number, isDark: boolean = true) => {
  // En lugar de usar placeholder.com, usaremos una solución local
  // Esto evitará los errores de red que se muestran en la consola
  return `/images/projects/project-${index + 1}.jpg`;
};

// Datos de ejemplo para los proyectos
const createProjectsData = (isDark: boolean): ProjectCardProps[] => [
  {
    title: 'App de Gestión de Tareas',
    description: 'Aplicación web que permite organizar tareas, crear listas y colaborar con otros usuarios.',
    imageUrl: getPlaceholderImage(0, isDark),
    tags: ['React', 'TypeScript', 'Firebase', 'Styled Components'],
    projectUrl: 'https://example.com/project1',
    repoUrl: 'https://github.com/username/project1',
  },
  {
    title: 'Dashboard Analítico',
    description: 'Panel de control interactivo para visualizar datos de negocio con gráficos personalizables.',
    imageUrl: getPlaceholderImage(1, isDark),
    tags: ['React', 'Chart.js', 'Material UI', 'Redux'],
    projectUrl: 'https://example.com/project2',
    repoUrl: 'https://github.com/username/project2',
  },
  {
    title: 'E-commerce Mobile',
    description: 'Aplicación móvil para compras en línea con integración de pagos y gestión de inventario.',
    imageUrl: getPlaceholderImage(2, isDark),
    tags: ['React Native', 'Redux', 'Node.js', 'MongoDB'],
    projectUrl: 'https://example.com/project3',
    repoUrl: 'https://github.com/username/project3',
  },
  {
    title: 'Plataforma de Aprendizaje',
    description: 'Sistema de gestión de cursos online con foros, evaluaciones y seguimiento de progreso.',
    imageUrl: getPlaceholderImage(3, isDark),
    tags: ['React', 'Node.js', 'Express', 'PostgreSQL'],
    projectUrl: 'https://example.com/project4',
    repoUrl: 'https://github.com/username/project4',
  },
  {
    title: 'Herramienta de Diseño UX',
    description: 'Aplicación para crear wireframes, prototipos y realizar pruebas de usabilidad.',
    imageUrl: getPlaceholderImage(4, isDark),
    tags: ['React', 'Canvas API', 'Socket.io', 'TypeScript'],
    projectUrl: 'https://example.com/project5',
    repoUrl: 'https://github.com/username/project5',
  },
  {
    title: 'Asistente Virtual IA',
    description: 'Chatbot interactivo que responde a preguntas comunes y realiza tareas básicas.',
    imageUrl: getPlaceholderImage(5, isDark),
    tags: ['React', 'TensorFlow.js', 'NLP', 'WebSockets'],
    projectUrl: 'https://example.com/project6',
    repoUrl: 'https://github.com/username/project6',
  },
];

const ProjectsSection: React.FC = () => {
  const { t } = useTranslation();
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';
  const projectsData = createProjectsData(isDark);
  
  return (
    <SectionContainer id="projects">
      <SectionTitle>{t('projects')}</SectionTitle>
      <ProjectsGrid>
        {projectsData.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </ProjectsGrid>
    </SectionContainer>
  );
};

export default ProjectsSection; 