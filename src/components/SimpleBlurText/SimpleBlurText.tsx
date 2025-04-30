import { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

const blurIn = keyframes`
  0% {
    filter: blur(10px);
    opacity: 0;
    transform: translateY(-20px);
  }
  50% {
    filter: blur(5px);
    opacity: 0.5;
    transform: translateY(-10px);
  }
  100% {
    filter: blur(0);
    opacity: 1;
    transform: translateY(0);
  }
`;

interface AnimatedSpanProps {
  $delay: number;
  $animate: boolean;
}

const AnimatedSpan = styled.span<AnimatedSpanProps>`
  display: inline-block;
  opacity: 0;
  
  ${props => props.$animate && css`
    animation: ${blurIn} 0.5s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
    animation-delay: ${props.$delay * 0.04}s;
  `}
`;

const StyledContainer = styled.div<{ $visible: boolean }>`
  visibility: ${props => props.$visible ? 'visible' : 'hidden'};
`;

interface SimpleBlurTextProps {
  text: string;
  className?: string;
  onAnimationComplete?: () => void;
  delayStart?: boolean;
}

const SimpleBlurText: React.FC<SimpleBlurTextProps> = ({
  text,
  className,
  onAnimationComplete,
  delayStart = false,
}) => {
  const [mounted, setMounted] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(!delayStart);

  useEffect(() => {
    setMounted(true);
    
    // Si no hay retraso solicitado, iniciamos la animación inmediatamente
    if (!delayStart) {
      setVisible(true);
      setAnimating(true);
    }
  }, [delayStart]);
  
  // Observamos cambios en delayStart para iniciar animación cuando sea false
  useEffect(() => {
    if (!delayStart && mounted) {
      setVisible(true);
      // Pequeño retraso para asegurar que el elemento esté visible antes de animar
      const timer = setTimeout(() => {
        setAnimating(true);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [delayStart, mounted]);

  // Ejecutar callback cuando la animación termine
  useEffect(() => {
    if (!animating) return;
    
    const totalDuration = text.length * 40 + 500;

    // Ejecuta onAnimationComplete después de que termine toda la animación
    const timer = setTimeout(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, totalDuration);

    return () => clearTimeout(timer);
  }, [text, onAnimationComplete, animating]);

  if (!mounted) return null;

  return (
    <StyledContainer className={className} $visible={visible}>
      {text.split('').map((char, index) => (
        <AnimatedSpan key={index} $delay={index} $animate={animating}>
          {char === ' ' ? '\u00A0' : char}
        </AnimatedSpan>
      ))}
    </StyledContainer>
  );
};

export default SimpleBlurText;
