import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import StarBorder from '../StarBorder/StarBorder';

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
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/', { state: { scrollToContact: true } });
    }
  };

  return (
    <div 
      className={className} 
      style={{
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.6s ease-in-out'
      }}
    >
      <StarBorder
        as="button"
        onClick={handleClick}
        color="white"
        speed="5s"
        aria-label={t('contactMe')}
      >
        {t('contactMe')}
      </StarBorder>
    </div>
  );
};

export default ContactButton; 