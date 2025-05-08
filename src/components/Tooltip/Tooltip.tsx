import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

interface TooltipProps {
  text: string;
  isVisible: boolean;
  position: { x: number; y: number };
  className?: string;
}

// Estilo basado en las implementaciones existentes (ChatbotAssistant/TechSlider)
const TooltipContainer = styled.div<{ $isDark?: boolean; $isVisible: boolean }>`
  position: fixed; // Usar fixed para evitar problemas de overflow
  padding: 6px 10px; // Ligeramente más pequeño
  border-radius: 6px;
  font-size: 0.75rem; // 12px
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.text};
  background: ${({ $isDark }) => 
    $isDark ? 'rgba(30, 30, 35, 0.85)' : 'rgba(250, 250, 255, 0.85)'};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  border: 1px solid ${({ $isDark }) => 
    $isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  pointer-events: none;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transform: translate(-50%, -100%); // Centrado horizontalmente, encima del punto y
  transition: opacity 0.15s ease-in-out;
  z-index: 10000; // Asegurar que esté por encima de otros elementos
  margin-top: -8px; // Pequeño espacio sobre el elemento target
`;

const Tooltip: React.FC<TooltipProps> = ({ text, isVisible, position, className }) => {
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';

  // No renderizar si no es visible para optimizar
  if (!isVisible) {
    return null;
  }

  return (
    <TooltipContainer
      $isDark={isDark}
      $isVisible={isVisible}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
      className={className}
    >
      {text}
    </TooltipContainer>
  );
};

export default Tooltip; 