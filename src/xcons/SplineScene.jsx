import Spline from '@splinetool/react-spline';
import styled from 'styled-components';
import { useTheme } from '../context/ThemeContext';
import { useRef, useEffect } from 'react';

const SplineContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const SplineOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: auto;
  
  background-color: transparent; 
`;

const WatermarkCover = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 170px;
  height: 80px;
  background-color: ${({ $isDark }) => $isDark ? '#282c34' : '#FFF'};
  z-index: 10;
  
  &::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    opacity: ${props => props.$isDark ? '0.15' : '0.08'};
    background-repeat: repeat;
    background-size: 100px;
    filter: ${props => props.$isDark 
      ? 'brightness(0) invert(1) contrast(2)' 
      : 'brightness(0) contrast(1.6)'};
  }
`;

export default function SplineScene() {
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';
  const containerRef = useRef(null);
  
  useEffect(() => {
    
    const setupSplineIframe = () => {
      if (!containerRef.current) return;
      
      
      const iframes = containerRef.current.querySelectorAll('iframe');
      
      if (iframes.length > 0) {
        iframes.forEach(iframe => {
          
          iframe.style.pointerEvents = 'none';
        });
      }
    };
    
    
    setupSplineIframe();
    
    
    const observer = new MutationObserver(setupSplineIframe);
    
    if (containerRef.current) {
      observer.observe(containerRef.current, { 
        childList: true,
        subtree: true 
      });
    }
    
    
    const intervalId = setInterval(setupSplineIframe, 500);
    
    
    return () => {
      observer.disconnect();
      clearInterval(intervalId);
    };
  }, []);
  
  return (
    <SplineContainer ref={containerRef}>
      <Spline
        scene="https://prod.spline.design/kFgAlvghlLyIp78Q/scene.splinecode"
        style={{ width: '100%', height: '100%', zIndex: 0 }}
      />
      
      <SplineOverlay />
      <WatermarkCover $isDark={isDark} />
    </SplineContainer>
  );
}