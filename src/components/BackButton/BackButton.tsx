import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { IoChevronBack } from 'react-icons/io5'; // Un icono de ejemplo, puedes cambiarlo

interface BackButtonProps {
  className?: string;
  initialDelay?: number; 
  hideOnScroll?: boolean; 
}

const ButtonStyled = styled.button<{
  $visible: boolean;
  $hideOnScroll?: boolean; // Para consistencia con otros toggles, aunque no lo usemos ahora
}>`
  position: fixed;
  top: 6rem;
  left: 1.5rem;
  z-index: 1000; 
  padding: 0.6rem 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  
  background: ${({ theme }) => 
    theme.isDark ? 'rgba(40, 40, 45, 0.6)' : 'rgba(250, 250, 250, 0.6)'};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => 
    theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 50px; // Redondeado como los toggles
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 2px 8px ${({ theme }) => 
    theme.isDark ? 'rgba(0, 0, 0, 0.15)' : 'rgba(0, 0, 0, 0.08)'};
  
  opacity: ${props => (props.$visible ? 1 : 0)};
  transform: translateY(${props => (props.$visible ? '0px' : '-20px')});
  transition: all 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);

  &:hover {
    background: ${({ theme }) => 
      theme.isDark ? 'rgba(50, 50, 55, 0.7)' : 'rgba(240, 240, 240, 0.7)'};
    transform: scale(1.05) translateY(0px); // Mantener el Y en hover
    box-shadow: 0 4px 12px ${({ theme }) => 
      theme.isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.12)'};
  }

  &:active {
    transform: scale(0.98) translateY(0px);
  }
  
  // Para consistencia con otros toggles, aunque no lo usemos ahora
  @media (max-width: 768px) {
    transform: translateY(${props => (props.$hideOnScroll && props.$visible ? '-100px' : (props.$visible ? '0px' : '-20px'))});
  }
`;

const BackButtonText = styled.span`
  @media (max-width: 768px) {
    display: none; // Opcional: ocultar texto en móviles y dejar solo el icono
  }
`;

const BackButton: React.FC<BackButtonProps> = ({
  className,
  initialDelay = 0, // Puede ser 0 si queremos que aparezca al instante en estas páginas
}) => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, initialDelay);
    return () => clearTimeout(timer);
  }, [initialDelay]);

  const handleClick = () => {
    navigate('/');
  };

  return (
    <ButtonStyled 
      onClick={handleClick} 
      className={className} 
      $visible={isVisible}
      aria-label="Volver al inicio"
    >
      <IoChevronBack size={18} />
      <BackButtonText>Inicio</BackButtonText> 
    </ButtonStyled>
  );
};

export default BackButton; 