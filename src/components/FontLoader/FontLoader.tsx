import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';


const dash = keyframes`
  72.5% {
    opacity: 0;
  }

  to {
    stroke-dashoffset: 0;
  }
`;


const fadeOut = keyframes`
  0% { opacity: 1; visibility: visible; }
  99% { opacity: 0; visibility: visible; }
  100% { opacity: 0; visibility: hidden; }
`;

const LoaderContainer = styled.div<{ $isLoaded: boolean }>`
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
  animation: ${({ $isLoaded }) => $isLoaded ? fadeOut : 'none'} 0.6s ease-in-out forwards;
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

interface FontLoaderProps {
  onLoaded?: () => void;
}

const FontLoader: React.FC<FontLoaderProps> = ({ onLoaded }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {

    if (document.readyState === 'complete') {
      handleFontsLoaded();
    } else {
      window.addEventListener('load', handleFontsLoaded);
    }


    document.fonts.ready.then(handleFontsLoaded);

    return () => {
      window.removeEventListener('load', handleFontsLoaded);
    };
  }, []);

  const handleFontsLoaded = () => {
    
    setTimeout(() => {
      setIsLoaded(true);
      if (onLoaded) {

        setTimeout(onLoaded, 600);
      }
    }, 500);
  };

  return (
    <LoaderContainer $isLoaded={isLoaded}>
      <ECGContainer className="loading">
        <ECGSvg width="64px" height="48px">
          <BackLine points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="back" />
          <FrontLine points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="front" />
        </ECGSvg>
      </ECGContainer>
    </LoaderContainer>
  );
};

export default FontLoader;