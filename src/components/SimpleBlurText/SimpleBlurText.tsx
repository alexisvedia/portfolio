import { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

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
}

const AnimatedSpan = styled.span<AnimatedSpanProps>`
  display: inline-block;
  opacity: 0;
  animation: ${blurIn} 0.8s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
  animation-delay: ${props => props.$delay * 0.08}s;
`;

interface SimpleBlurTextProps {
  text: string;
  className?: string;
  onAnimationComplete?: () => void;
}

const SimpleBlurText: React.FC<SimpleBlurTextProps> = ({
  text,
  className,
  onAnimationComplete,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Calcula la duración total de la animación basado en el número de caracteres
    // y un tiempo adicional para la animación completa
    const totalDuration = text.length * 80 + 800;

    // Ejecuta onAnimationComplete después de que termine toda la animación
    const timer = setTimeout(() => {
      if (onAnimationComplete) {
        onAnimationComplete();
      }
    }, totalDuration);

    return () => clearTimeout(timer);
  }, [text, onAnimationComplete]);

  if (!mounted) return null;

  return (
    <div className={className}>
      {text.split('').map((char, index) => (
        <AnimatedSpan key={index} $delay={index}>
          {char === ' ' ? '\u00A0' : char}
        </AnimatedSpan>
      ))}
    </div>
  );
};

export default SimpleBlurText;
