import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { Home, User, Briefcase, FileText } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface NavItem {
  name: string;
  url: string;
  icon: React.ElementType;
  // Agregar traducciones para los nombres de las secciones
  nameKey: string;
}

interface NavBarProps {
  className?: string;
  t: (key: string) => string;
}

// Contenedor principal de la barra de navegación
const NavContainer = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  margin-top: 1.5rem;

  @media (max-width: 768px) {
    bottom: 0;
    margin-bottom: 1.5rem;
    top: auto;
    width: 85%; /* Aumentamos el ancho en mobile */
    max-width: 400px;
  }

  @media (min-width: 769px) {
    top: 0;
  }
`;

// Contenedor de los elementos de navegación
const NavContent = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background-color: rgba(30, 30, 30, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  padding: 0.25rem 0.25rem;
  border-radius: 9999px;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.2),
    0 10px 10px -5px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    justify-content: space-around;
    padding: 0.5rem;
    gap: 0.5rem;
  }
`;

// Elemento de navegación
const NavLink = styled(Link)<{ $isActive: boolean }>`
  position: relative;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  padding: 0.5rem 1.5rem;
  border-radius: 9999px;
  transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
  color: ${({ $isActive }) => ($isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.53)')};
  background-color: ${({ $isActive }) => ($isActive ? 'rgba(100, 108, 255, 0.01)' : 'transparent')};
  text-decoration: none;

  &:hover {
    color: #ffffff;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 0.75rem 1.25rem;
    flex: 1;
    display: flex;
    justify-content: center;

    /* Efecto mejorado al tocar en mobile */
    &:active {
      transform: scale(0.95);
      background-color: rgba(255, 255, 255, 0);
    }

    > span.text {
      display: none;
    }

    > span.icon {
      display: flex;
    }
  }

  @media (min-width: 769px) {
    > span.text {
      display: inline;
    }

    > span.icon {
      display: none;
    }
  }
`;

// Luz tubo (efecto visual)
const Lamp = styled(motion.div)`
  position: absolute;
  inset: 0;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 9999px;
  z-index: -10;
`;

// Luz superior
const LampTop = styled.div`
  position: absolute;
  top: -0.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 2rem;
  height: 0.25rem;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 9999px 9999px 0 0;
`;

// Efectos de luz/glow
const LampGlow1 = styled.div`
  position: absolute;
  width: 3rem;
  height: 1.5rem;
  background-color: rgba(255, 255, 255, 0.18);
  border-radius: 9999px;
  filter: blur(8px);
  top: -0.5rem;
  left: -0.5rem;
`;

const LampGlow2 = styled.div`
  position: absolute;
  width: 2rem;
  height: 1.5rem;
  background-color: rgba(255, 255, 255, 0.11);
  border-radius: 9999px;
  filter: blur(8px);
  top: -0.25rem;
`;

const LampGlow3 = styled.div`
  position: absolute;
  width: 1rem;
  height: 1rem;
  background-color: rgba(255, 255, 255, 0);
  border-radius: 9999px;
  filter: blur(4px);
  top: 0;
  left: 0.5rem;
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 768px) {
    font-size: 1.1rem; /* Iconos más grandes en mobile */
  }
`;

export const NavBar: React.FC<NavBarProps> = ({ className, t }) => {
  // Definir los elementos de navegación con sus nombres y URLs
  const items: NavItem[] = [
    { name: 'Home', nameKey: 'navbar.home', url: '/', icon: Home },
    { name: 'About', nameKey: 'navbar.about', url: '/about', icon: User },
    { name: 'Projects', nameKey: 'navbar.projects', url: '/projects', icon: Briefcase },
    { name: 'Resume', nameKey: 'navbar.resume', url: '/resume', icon: FileText },
  ];

  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();

  // Configurar detector de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <NavContainer className={className}>
      <NavContent>
        {items.map(item => {
          const Icon = item.icon;
          const isActive =
            location.pathname === item.url || (location.pathname === '' && item.url === '/');

          return (
            <NavLink key={item.name} to={item.url} $isActive={isActive}>
              <span className="text">{t(item.nameKey)}</span>
              <IconWrapper className="icon">
                <Icon size={isMobile ? 22 : 18} strokeWidth={2.5} />
              </IconWrapper>
              {isActive && (
                <Lamp
                  layoutId="lamp"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <LampTop />
                  <LampGlow1 />
                  <LampGlow2 />
                  <LampGlow3 />
                </Lamp>
              )}
            </NavLink>
          );
        })}
      </NavContent>
    </NavContainer>
  );
};

export default NavBar;
