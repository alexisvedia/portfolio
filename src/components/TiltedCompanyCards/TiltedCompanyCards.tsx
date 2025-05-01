import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface CompanyCardProps {
  logoSrc: string;
  color: string;
  name: string;
  onClick?: () => void;
  isSelected?: boolean;
  shouldMoveLogo: boolean;
  index: number;
}

interface ContainerProps {
  $isSticky?: boolean;
}

const CompaniesContainer = styled.div<ContainerProps>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem 0;
  flex-wrap: wrap;
  gap: 5px;
  perspective: 1000px;
  position: ${props => props.$isSticky ? 'sticky' : 'relative'};
  top: ${props => props.$isSticky ? '-100px' : '0'};
  z-index: 20;
  transition: top 0.3s ease;
  transform-style: preserve-3d;
  
  @media (min-width: 768px) {
    flex-wrap: nowrap;
    gap: 0;
  }
`;

const Card = styled.div<{ $bgColor: string; $isSelected?: boolean }>`
  background-color: ${props => `#${props.$bgColor}`};
  height: 180px;
  width: 80%;
  max-width: 180px;
  margin: 0 -20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.4s ease;
  transform: ${props => props.$isSelected 
    ? 'scale(1.05) perspective(500px) rotateY(0) translateY(-10px) translateZ(50px)' 
    : 'perspective(800px) rotateY(25deg)'};
  border-radius: 8px;
  position: relative;
  z-index: ${props => props.$isSelected ? 50 : 5}; 
  box-shadow: ${props => props.$isSelected 
    ? '0 15px 30px rgba(0,0,0,0.4)' 
    : '0 5px 15px rgba(0,0,0,0.2)'};
  
  @media (min-width: 768px) {
    width: 160px;
    margin: 0 -25px;
  }
  
  &:hover {
    transform: ${props => !props.$isSelected && 'scale(1.02) perspective(800px) rotateY(15deg) translateY(-5px)'};
    z-index: ${props => !props.$isSelected && 8};
  }
`;

const CompanyLogo = styled.img<{ $isSelected?: boolean; $shouldMove: boolean }>`
  width: 55%;
  max-height: 80px;
  object-fit: contain;
  filter: brightness(0) invert(1);
  margin-bottom: ${props => (props.$isSelected || props.$shouldMove) ? '0' : '20px'};
  transform: ${props => (props.$isSelected || props.$shouldMove) ? 'translateY(67px)' : 'none'};
  transition: all 0.5s ease;
`;

const CompanyName = styled.div<{ $isSelected?: boolean; $shouldHide: boolean }>`
  position: absolute;
  bottom: 15px;
  left: 0;
  right: 0;
  text-align: center;
  color: white;
  font-weight: 500;
  opacity: ${props => (props.$isSelected || props.$shouldHide) ? 0 : 0.9};
  font-size: 14px;
  transition: opacity 0.3s ease;
`;

const CompanyCard: React.FC<CompanyCardProps> = ({ 
  logoSrc, 
  color, 
  name, 
  onClick, 
  isSelected = false,
  shouldMoveLogo,
  index
}) => {
  return (
    <Card 
      $bgColor={color} 
      onClick={onClick} 
      $isSelected={isSelected}
    >
      <CompanyLogo 
        src={logoSrc} 
        alt={name} 
        $isSelected={isSelected}
        $shouldMove={shouldMoveLogo}
      />
      <CompanyName 
        $isSelected={isSelected}
        $shouldHide={shouldMoveLogo}
      >
        {name}
      </CompanyName>
    </Card>
  );
};

const TiltedCompanyCards: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [anyCardSelected, setAnyCardSelected] = useState(false);
  const [isAboveScrollPoint, setIsAboveScrollPoint] = useState(true);
  const [lastScrollPosition, setLastScrollPosition] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const projectTitleRef = useRef<HTMLElement | null>(null);
  
  const companies = [
    { 
      name: 'FusionAds.ai', 
      logoSrc: '/images/projects/Fusionads.svg', 
      color: 'F7480B' 
    },
    { 
      name: 'Bandit', 
      logoSrc: '/images/projects/Bandit.svg', 
      color: 'F70F43' 
    },
    { 
      name: 'XCONS', 
      logoSrc: '/images/projects/XCONS.svg', 
      color: '15814B' 
    },
    { 
      name: 'Condamind', 
      logoSrc: '/images/projects/Condamind.svg', 
      color: '262626' 
    }
  ];
  
  // Obtener referencia al título de proyectos una vez que se monte el componente
  useEffect(() => {
    projectTitleRef.current = document.querySelector('#projects h2');
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || !projectTitleRef.current) return;
      
      const currentScrollPos = window.pageYOffset;
      const scrollingUp = currentScrollPos < lastScrollPosition;
      setLastScrollPosition(currentScrollPos);
      
      const rect = containerRef.current.getBoundingClientRect();
      const isPassingThreshold = rect.top <= 100;
      
      setIsSticky(isPassingThreshold);
      
      // Calcular el punto de scroll donde debemos restaurar los logos
      const projectTitleRect = projectTitleRef.current.getBoundingClientRect();
      const scrollPoint = projectTitleRect.top + window.pageYOffset - 170;
      
      // Verificar si estamos por encima del punto de scroll
      const isAbove = window.pageYOffset < scrollPoint - 100; // 100px de margen
      
      // Si estamos por encima del punto y estamos scrolleando hacia arriba
      if (isAbove && scrollingUp && selectedCard !== null) {
        setSelectedCard(null);
        setAnyCardSelected(false);
      }
      
      setIsAboveScrollPoint(isAbove);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollPosition, selectedCard]);
  
  const handleCardClick = (index: number) => {
    // Si ya está seleccionada, no hacer nada
    if (selectedCard === index) {
      return;
    }
    
    const newSelected = selectedCard === null ? index : index;
    setSelectedCard(newSelected);
    
    // Si es la primera vez que se selecciona cualquier tarjeta
    if (newSelected !== null && !anyCardSelected) {
      setAnyCardSelected(true);
    }
    
    // Hacer scroll hasta la sección de proyectos
    const projectsTitle = document.querySelector('#projects h2');
    if (projectsTitle) {
      const yOffset = -170; // Ajusta cuánto de las tarjetas quedará visible
      const y = projectsTitle.getBoundingClientRect().top + window.pageYOffset + yOffset;
      
      window.scrollTo({
        top: y,
        behavior: 'smooth'
      });
    }
  };
  
  // Determinar si los logos deben moverse basado en la selección y posición de scroll
  const shouldMoveLogos = anyCardSelected && !isAboveScrollPoint;
  
  return (
    <CompaniesContainer ref={containerRef} $isSticky={isSticky}>
      {companies.map((company, index) => (
        <CompanyCard 
          key={index}
          logoSrc={company.logoSrc}
          color={company.color}
          name={company.name}
          isSelected={selectedCard === index}
          onClick={() => handleCardClick(index)}
          index={index}
          shouldMoveLogo={shouldMoveLogos}
        />
      ))}
    </CompaniesContainer>
  );
};

export default TiltedCompanyCards; 