import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { MicaCard } from '../ProjectCard';

const SectionContainer = styled.section`
  padding: ${({ theme }) => theme.space['2xl']} 0;
  position: relative;
  z-index: 10;
`;

const SectionTitle = styled.h2`
  font-size: 80px;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 1.5rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${({ theme }) => theme.space.xl};
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

// Función para generar URLs de imágenes de placeholder
const getPlaceholderImage = (index: number) => {
  // Definimos colores para generar imágenes con diferentes tonalidades
  const colors = ['#4361ee', '#3a0ca3', '#7209b7', '#f72585'];
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

// Datos para los proyectos
const createProjectsData = () => [
  {
    title: 'App de Gestión de Tareas',
    description: 'Aplicación web que permite organizar tareas, crear listas y colaborar con otros usuarios en tiempo real. Incluye notificaciones, recordatorios y análisis de productividad.',
    imageUrl: getPlaceholderImage(0),
    technologies: ['React', 'TypeScript', 'Firebase', 'Styled Components'],
  },
  {
    title: 'Dashboard Analítico',
    description: 'Panel de control interactivo para visualizar datos de negocio con gráficos personalizables y filtros avanzados. Permite exportar informes y programar alertas automáticas.',
    imageUrl: getPlaceholderImage(1),
    technologies: ['React', 'Chart.js', 'Material UI', 'Redux'],
  },
  {
    title: 'E-commerce Mobile',
    description: 'Aplicación móvil para compras en línea con integración de pagos, gestión de inventario y seguimiento de pedidos. Incluye sistema de recomendaciones basado en IA.',
    imageUrl: getPlaceholderImage(2),
    technologies: ['React Native', 'Redux', 'Node.js', 'MongoDB'],
  },
  {
    title: 'Plataforma de Aprendizaje',
    description: 'Sistema de gestión de cursos online con foros, evaluaciones y seguimiento de progreso. Incorpora videoconferencias en tiempo real y materiales educativos interactivos.',
    imageUrl: getPlaceholderImage(3),
    technologies: ['React', 'Node.js', 'Express', 'PostgreSQL'],
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
          <MicaCard key={index} {...project} />
        ))}
      </ProjectsGrid>
    </SectionContainer>
  );
};

export default ProjectsSection; 