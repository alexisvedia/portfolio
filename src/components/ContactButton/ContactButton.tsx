import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styles from './ContactButton.module.css';

interface ContactButtonProps {
  className?: string;
  initialDelay?: number;
  $hideOnScroll?: boolean;
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
    navigate('/', { state: { scrollToSection: 'contact' } });
  };


  const combinedClassName = `${styles.contactButton} ${className || ''}`.trim();

  return (
    <button 
      className={combinedClassName} 
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.6s ease-in-out'
      }}
      onClick={handleClick}
      aria-label={t('contactMe')}
    >
      {t('contactMe')}
    </button>
  );
};

export default ContactButton;