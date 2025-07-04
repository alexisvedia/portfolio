import React from 'react';
import styled, { keyframes } from 'styled-components';

const dash = keyframes`
  72.5% {
    opacity: 0;
  }

  to {
    stroke-dashoffset: 0;
  }
`;

const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.background};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ECGContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ECGSvg = styled.svg`
  width: 64px;
  height: 48px;
`;

const BackLine = styled.polyline`
  fill: none;
  stroke: #3B3B3B;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
`;

const FrontLine = styled.polyline`
  fill: none;
  stroke: white;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 48, 144;
  stroke-dashoffset: 192;
  animation: ${dash} 1.4s linear infinite;
`;

const LoadingSpinner: React.FC = () => {
  return (
    <LoaderContainer>
      <ECGContainer className="loading">
        <ECGSvg width="64px" height="48px">
          <BackLine points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="back" />
          <FrontLine points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="front" />
        </ECGSvg>
      </ECGContainer>
    </LoaderContainer>
  );
};

export default LoadingSpinner;