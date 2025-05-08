import React, { useEffect } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { useTheme } from '../../context/ThemeContext';
import { IoCheckmarkCircle, IoAlertCircle, IoClose } from 'react-icons/io5';

// Tipos de toast
export type ToastType = 'success' | 'error' | 'info';

// Props del componente
interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

// Animaciones
const slideIn = keyframes`
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(20px);
    opacity: 0;
  }
`;

// Estilo glass unificado
const glassStyle = (isDark: boolean) => css`
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.05)'};
  box-shadow: 0 10px 25px rgba(0, 0, 0, ${isDark ? '0.3' : '0.1'});
  transform: translateZ(0);
  will-change: backdrop-filter, opacity, transform;
`;

// Obtener color según tipo
const getTypeColor = (type: ToastType, isDark: boolean) => {
  switch (type) {
    case 'success':
      return isDark ? 'rgba(0, 180, 80, 0.95)' : 'rgba(30, 215, 96, 0.95)';
    case 'error':
      return isDark ? 'rgba(200, 30, 30, 0.95)' : 'rgba(255, 80, 80, 0.95)';
    case 'info':
    default:
      return isDark ? 'rgba(30, 100, 220, 0.95)' : 'rgba(70, 130, 240, 0.95)';
  }
};

// Obtener background según tipo y tema
const getBackground = (type: ToastType, isDark: boolean) => {
  const baseColor = getTypeColor(type, isDark);
  const overlayColor = isDark 
    ? 'rgba(20, 20, 25, 0.7)' 
    : 'rgba(250, 250, 255, 0.85)';
  
  return `linear-gradient(${overlayColor}, ${overlayColor}), ${baseColor}`;
};

// Contenedor principal
const ToastContainer = styled.div<{ 
  $type: ToastType; 
  $isDark: boolean; 
  $isVisible: boolean;
  $isLeaving: boolean;
}>`
  position: fixed;
  top: 30px;
  left: 45image.png%;
  transform: translateX(-50%);
  padding: 16px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 9999;
  max-width: 450px;
  color: ${({ theme }) => theme.colors.text};
  ${({ $isDark }) => glassStyle($isDark)}
  background: ${({ $type, $isDark }) => getBackground($type, $isDark)};
  animation: ${({ $isVisible, $isLeaving }) => 
    $isVisible 
      ? css`${slideIn} 0.3s ease forwards` 
      : $isLeaving 
        ? css`${slideOut} 0.3s ease forwards` 
        : 'none'};
  pointer-events: ${({ $isVisible }) => ($isVisible ? 'auto' : 'none')};
  opacity: ${({ $isVisible, $isLeaving }) => ($isVisible || $isLeaving ? 1 : 0)};
  
  ${slideIn} {
    from {
      transform: translate(-50%, -20px);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }
  ${slideOut} {
    from {
      transform: translate(-50%, 0);
      opacity: 1;
    }
    to {
      transform: translate(-50%, -20px);
      opacity: 0;
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.02;
    pointer-events: none;
    border-radius: inherit;
    background-image: url('/images/AcrylicTexture.png');
    background-repeat: repeat;
    mix-blend-mode: overlay;
  }
  
  @media (max-width: 500px) {
    top: 20px;
    left: 20px;
    right: 20px;
    transform: translateX(0);
    width: auto;
    max-width: none;
  }
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  flex-shrink: 0;
`;

const Message = styled.div`
  font-size: 15px;
  font-weight: 500;
  flex-grow: 1;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  padding: 4px;
  border-radius: 50%;
  font-size: 20px;
  
  &:hover {
    opacity: 1;
  }
  
  &:focus {
    outline: none;
  }
`;

const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  isVisible,
  onClose,
  duration = 5000,
}) => {
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';
  const [isLeaving, setIsLeaving] = React.useState(false);
  
  // Auto-cerrar después de duración
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setIsLeaving(true);
        const animationTimer = setTimeout(() => {
          onClose();
          setIsLeaving(false);
        }, 300);
        return () => clearTimeout(animationTimer);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);
  
  // Manejar cierre manual
  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
      setIsLeaving(false);
    }, 300);
  };
  
  // Icono según tipo
  const renderIcon = () => {
    switch (type) {
      case 'success':
        return <IoCheckmarkCircle />;
      case 'error':
        return <IoAlertCircle />;
      case 'info':
      default:
        return <IoCheckmarkCircle />;
    }
  };
  
  if (!isVisible && !isLeaving) return null;
  
  return (
    <ToastContainer 
      $type={type} 
      $isDark={isDark} 
      $isVisible={isVisible}
      $isLeaving={isLeaving}
    >
      <IconWrapper>{renderIcon()}</IconWrapper>
      <Message>{message}</Message>
      <CloseButton onClick={handleClose} aria-label="Cerrar notificación">
        <IoClose />
      </CloseButton>
    </ToastContainer>
  );
};

export default Toast; 