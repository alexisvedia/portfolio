import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
// import StarBorder from '../StarBorder/StarBorder';
import styles from './ContactButton.module.css'; // Importar los estilos del módulo

interface ContactButtonProps {
  className?: string;
  initialDelay?: number;
  $hideOnScroll?: boolean; // Mantengo esta prop aunque no se use directamente en los nuevos estilos base
}

const ContactButton: React.FC<ContactButtonProps> = ({ className, initialDelay = 500 }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, initialDelay);
    return () => clearTimeout(timer);
  }, [initialDelay]);

  const handleClick = () => {
    navigate('/', { state: { scrollToContact: true } });
  };

  // Combinar clases: la del módulo y cualquier clase externa pasada por props
  const combinedClassName = `${styles.contactButton} ${className || ''}`.trim();

  return (
    <button 
      className={combinedClassName} 
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.6s ease-in-out' // Mantengo la transición de opacidad
      }}
      onClick={handleClick}
      aria-label={t('contactMe')}
    >
      {t('contactMe')}
    </button>
  );
};

export default ContactButton; 