import React from 'react';
import styled from 'styled-components';

const GrainElement = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1; /* Z-index mínimo para que quede por debajo de todo */
  opacity: 0; /* Cambiado a 0 para eliminar el efecto de ruido */
  
  /* Background noise pattern estático usando SVG */
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 100px;
  
  /* Color del ruido según el tema */
  filter: ${({ theme }) => theme.isDark 
    ? 'brightness(0) invert(1) contrast(2)' 
    : 'brightness(0) contrast(1.6)'};
`;

const GrainOverlay: React.FC = () => {
  return <GrainElement />;
};

export default GrainOverlay; 