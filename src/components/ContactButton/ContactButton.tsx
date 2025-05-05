import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import StarBorder from './StarBorder';
import { ArrowUp } from 'lucide-react';

interface ContactButtonProps {
  className?: string;
  initialDelay?: number;
  $hideOnScroll?: boolean;
}

const ButtonWrapper = styled.div`
  cursor: pointer;
`;

const ArrowIcon = styled(ArrowUp)`
  margin-right: 6px;
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContactButton: React.FC<ContactButtonProps> = ({ className, initialDelay = 500, $hideOnScroll = false }) => {
  const { t, i18n } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const [isAtContact, setIsAtContact] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const currentLang = i18n.language;
  const isSpanish = currentLang === 'es' || currentLang.startsWith('es-');

  // Efecto para la animación inicial de aparición
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, initialDelay);
    
    return () => clearTimeout(timer);
  }, [initialDelay]);

  // Detectar si el usuario ha scrolleado hasta la sección de contacto
  useEffect(() => {
    const checkScrollPosition = () => {
      const contactElement = document.getElementById('contact');
      if (contactElement) {
        const contactRect = contactElement.getBoundingClientRect();
        const isNearContact = contactRect.top <= window.innerHeight && contactRect.bottom >= 0;
        setIsAtContact(isNearContact);
      }
    };

    window.addEventListener('scroll', checkScrollPosition);
    // Verificar posición inicial
    checkScrollPosition();
    
    return () => window.removeEventListener('scroll', checkScrollPosition);
  }, []);

  // Función para hacer scroll hacia el formulario de contacto o hacia el inicio
  const handleClick = () => {
    if (isAtContact) {
      // Scroll al inicio
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Scroll hacia el formulario
      const contactElement = document.getElementById('contact');
      if (contactElement) {
        contactElement.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  // Texto para el botón según el idioma
  const getButtonText = () => {
    if (isAtContact) {
      // Siempre usar texto hardcodeado según el idioma
      return isSpanish ? 'Volver arriba' : 'Back to top';
    }
    // Para "contactMe" usar el mismo enfoque de texto hardcodeado si no hay traducción
    const contactText = t('contactMe');
    if (contactText === 'contactMe' && isSpanish) {
      return 'Contáctame';
    }
    return contactText;
  };

  return (
    <ButtonWrapper 
      ref={buttonRef}
      className={className} 
      style={{
        opacity: isVisible ? 1 : 0,
        transform: `translateY(${isVisible ? 0 : -10}px)${$hideOnScroll ? ' translateY(-100px)' : ''}`,
        transition: 'opacity 0.6s ease-in-out, transform 0.3s ease'
      }}
    >
      <StarBorder 
        color="white"
        speed="5s"
        onClick={handleClick}
        // Solo mostrar animación cuando no estamos en el formulario
        style={{ 
          '--animation-enabled': isAtContact ? 'paused' : 'running'
        } as React.CSSProperties}
      >
        <ButtonContent>
          {isAtContact && <ArrowIcon size={18} />}
          {getButtonText()}
        </ButtonContent>
      </StarBorder>
    </ButtonWrapper>
  );
};

export default ContactButton; 