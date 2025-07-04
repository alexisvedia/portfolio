import React, { useState, useRef, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

const glassEffect = css`
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  will-change: backdrop-filter;
`;

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const TooltipContent = styled.div<{ 
  $visible: boolean; 
  $position: string; 
  $isDark: boolean;
}>`
  position: absolute;
  z-index: 1000;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  transition: all 0.2s ease;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  visibility: ${({ $visible }) => ($visible ? 'visible' : 'hidden')};
  transform: ${({ $visible, $position }) => {
    if (!$visible) return 'scale(0.8)';
    switch ($position) {
      case 'top':
        return 'translateY(-2px) scale(1)';
      case 'bottom':
        return 'translateY(2px) scale(1)';
      case 'left':
        return 'translateX(-2px) scale(1)';
      case 'right':
        return 'translateX(2px) scale(1)';
      default:
        return 'scale(1)';
    }
  }};
  
  ${({ $position }) => {
    switch ($position) {
      case 'top':
        return css`
          bottom: 100%;
          left: 50%;
          transform-origin: bottom center;
          margin-bottom: 8px;
          margin-left: -50%;
        `;
      case 'bottom':
        return css`
          top: 100%;
          left: 50%;
          transform-origin: top center;
          margin-top: 8px;
          margin-left: -50%;
        `;
      case 'left':
        return css`
          right: 100%;
          top: 50%;
          transform-origin: right center;
          margin-right: 8px;
          margin-top: -50%;
        `;
      case 'right':
        return css`
          left: 100%;
          top: 50%;
          transform-origin: left center;
          margin-left: 8px;
          margin-top: -50%;
        `;
      default:
        return css`
          bottom: 100%;
          left: 50%;
          transform-origin: bottom center;
          margin-bottom: 8px;
          margin-left: -50%;
        `;
    }
  }}
  
  ${glassEffect}
  background: ${({ $isDark }) => 
    $isDark 
      ? 'rgba(40, 40, 45, 0.95)' 
      : 'rgba(245, 245, 250, 0.95)'
  };
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ $isDark }) => 
    $isDark 
      ? 'rgba(255, 255, 255, 0.15)' 
      : 'rgba(0, 0, 0, 0.1)'
  };
  box-shadow: 0 4px 12px ${({ $isDark }) => 
    $isDark 
      ? 'rgba(0, 0, 0, 0.3)' 
      : 'rgba(0, 0, 0, 0.1)'
  };
`;

const Tooltip: React.FC<TooltipProps> = ({ 
  children, 
  content, 
  position = 'top', 
  delay = 300 
}) => {
  const [visible, setVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return (
    <TooltipContainer
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <TooltipContent
        $visible={visible}
        $position={position}
        $isDark={isDark}
      >
        {content}
      </TooltipContent>
    </TooltipContainer>
  );
};

export default Tooltip;