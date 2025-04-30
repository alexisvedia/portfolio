import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import ProjectCard, { ProjectCardProps } from '../ProjectCard/ProjectCard';

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
const getPlaceholderImage = (index: number) => {
  // Definimos colores para generar imágenes con diferentes tonalidades
  const colors = ['#4361ee', '#3a0ca3', '#7209b7', '#f72585', '#4cc9f0', '#560bad'];
  const color = colors[index % colors.length];
  
  // Creamos una imagen SVG en base64 con un color de fondo único para cada proyecto
  // y un texto indicando el número de proyecto
  const svgContent = `
  <svg width="600" height="400" xmlns="http://www.w3.org/2000/svg">
    <rect width="600" height="400" fill="${color}"/>
    <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="36" 
      text-anchor="middle" dominant-baseline="middle" fill="white">
      Proyecto ${index + 1}
    </text>
  </svg>`;
  
  // Convertimos el SVG a base64
  const base64 = btoa(svgContent);
  return `data:image/svg+xml;base64,${base64}`;
};

// Datos de ejemplo para los proyectos
const createProjectsData = (): ProjectCardProps[] => [
  {
    title: 'App de Gestión de Tareas',
    description: 'Aplicación web que permite organizar tareas, crear listas y colaborar con otros usuarios.',
    imageUrl: getPlaceholderImage(0),
    tags: ['React', 'TypeScript', 'Firebase', 'Styled Components'],
    projectUrl: 'https://example.com/project1',
    repoUrl: 'https://github.com/username/project1',
  },
  {
    title: 'Dashboard Analítico',
    description: 'Panel de control interactivo para visualizar datos de negocio con gráficos personalizables.',
    imageUrl: getPlaceholderImage(1),
    tags: ['React', 'Chart.js', 'Material UI', 'Redux'],
    projectUrl: 'https://example.com/project2',
    repoUrl: 'https://github.com/username/project2',
  },
  {
    title: 'E-commerce Mobile',
    description: 'Aplicación móvil para compras en línea con integración de pagos y gestión de inventario.',
    imageUrl: getPlaceholderImage(2),
    tags: ['React Native', 'Redux', 'Node.js', 'MongoDB'],
    projectUrl: 'https://example.com/project3',
    repoUrl: 'https://github.com/username/project3',
  },
  {
    title: 'Plataforma de Aprendizaje',
    description: 'Sistema de gestión de cursos online con foros, evaluaciones y seguimiento de progreso.',
    imageUrl: getPlaceholderImage(3),
    tags: ['React', 'Node.js', 'Express', 'PostgreSQL'],
    projectUrl: 'https://example.com/project4',
    repoUrl: 'https://github.com/username/project4',
  },
  {
    title: 'Herramienta de Diseño UX',
    description: 'Aplicación para crear wireframes, prototipos y realizar pruebas de usabilidad.',
    imageUrl: getPlaceholderImage(4),
    tags: ['React', 'Canvas API', 'Socket.io', 'TypeScript'],
    projectUrl: 'https://example.com/project5',
    repoUrl: 'https://github.com/username/project5',
  },
  {
    title: 'Asistente Virtual IA',
    description: 'Chatbot interactivo que responde a preguntas comunes y realiza tareas básicas.',
    imageUrl: getPlaceholderImage(5),
    tags: ['React', 'TensorFlow.js', 'NLP', 'WebSockets'],
    projectUrl: 'https://example.com/project6',
    repoUrl: 'https://github.com/username/project6',
  },
];

const ProjectsSection: React.FC = () => {
  const { t } = useTranslation();
  const projectsData = createProjectsData();
  
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