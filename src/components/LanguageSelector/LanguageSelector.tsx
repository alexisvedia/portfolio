import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { keyframes, css } from 'styled-components';
import { MdOutlineLanguage } from "react-icons/md";

// Tiempo mínimo que debe pasar entre cambios de idioma (ms)
const LANGUAGE_CHANGE_COOLDOWN = 3000;

interface LanguageSelectorProps {
  className?: string;
  initialDelay?: number; // Retraso inicial para la aparición en ms
}

// Animación de carga
const loadingAnimation = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const LanguageSelectorContainer = styled.div<{ $visible: boolean }>`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  opacity: ${props => (props.$visible ? 1 : 0)};
  transform: translateY(${props => (props.$visible ? 0 : -10)}px);
  transition:
    opacity 0.6s ease-in-out,
    transform 0.6s ease-in-out;
`;

const LanguageButton = styled.button<{ $active?: boolean; $changing: boolean }>`
  background: ${props =>
    props.$changing ? 'rgba(150, 150, 150, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${({ theme, $changing }) => ($changing ? 'rgba(255, 255, 255, 0.5)' : theme.colors.text)};
  border: 1px solid ${({ theme }) => theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 50px;
  padding: 10px 15px;
  cursor: ${props => (props.$changing ? 'not-allowed' : 'pointer')};
  font-size: 0.9rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
  box-shadow: 0 2px 8px ${({ theme }) => theme.isDark ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  position: relative;
  overflow: hidden;

  /* Ajustamos el color de fondo basado en el tema */
  background: ${({ theme }) => 
    theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};

  &:hover {
    background: ${({ theme, $changing }) =>
      $changing 
      ? 'rgba(150, 150, 150, 0.2)' 
      : theme.isDark 
        ? 'rgba(255, 255, 255, 0.2)' 
        : 'rgba(0, 0, 0, 0.1)'};
    transform: ${props => (props.$changing ? 'none' : 'scale(1.05) translateY(-2px)')};
  }

  &:active {
    transform: ${props => (props.$changing ? 'none' : 'scale(0.98) translateY(0)')};
  }

  /* Indicador de carga */
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 0; /* Siempre comienza en 0 */
    background: linear-gradient(90deg, #646cff, #82e9de);
    opacity: ${props => (props.$changing ? 1 : 0)};
    ${props => props.$changing && css`
      animation: ${loadingAnimation} 3s linear;
      animation-fill-mode: forwards;
    `}
  }
`;

const LanguageIcon = styled(MdOutlineLanguage)<{ $changing?: boolean }>`
  margin-right: 6px;
  font-size: 1.2rem;
  opacity: ${props => (props.$changing ? 0.5 : 1)};
  transition: opacity 0.3s ease;
  color: ${({ theme }) => theme.colors.text};
  display: inline-flex;
  vertical-align: middle;
`;

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className,
  initialDelay = 1300, // Por defecto, aparece 300ms después de la navbar (que aparece a los 1000ms)
}) => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language?.startsWith('es') ? 'es' : 'en');
  
  // Un solo estado para controlar si el botón está en cooldown
  const [isDisabled, setIsDisabled] = useState(false);
  
  // Estado para controlar la animación inicial de aparición
  const [isVisible, setIsVisible] = useState(false);

  // Efecto para la animación inicial de aparición
  useEffect(() => {
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, initialDelay);

    return () => clearTimeout(initialTimer);
  }, [initialDelay]);

  // Sincronizar el estado con el idioma actual de i18n
  useEffect(() => {
    const lang = i18n.language?.startsWith('es') ? 'es' : 'en';
    if (currentLang !== lang) {
      setCurrentLang(lang);
    }
    
    // También actualizar localStorage explícitamente
    localStorage.setItem('i18nextLng', i18n.language);
  }, [i18n.language, currentLang]);

  const toggleLanguage = () => {
    // Si está deshabilitado, no hacer nada
    if (isDisabled) {
      return;
    }

    // Deshabilitar el botón inmediatamente
    setIsDisabled(true);

    // Determinar el nuevo idioma
    const newLang = currentLang === 'es' ? 'en' : 'es';
    
    // Cambiar el idioma
    i18n.changeLanguage(newLang)
      .then(() => {
        setCurrentLang(newLang);
      })
      .catch(error => {
        console.error('Error al cambiar el idioma:', error);
      });
    
    // Configurar un temporizador para habilitar el botón después del cooldown
    setTimeout(() => {
      setIsDisabled(false);
    }, LANGUAGE_CHANGE_COOLDOWN);
  };

  return (
    <LanguageSelectorContainer className={className} $visible={isVisible}>
      <LanguageButton onClick={toggleLanguage} $changing={isDisabled}>
        <LanguageIcon $changing={isDisabled} />
        {currentLang === 'es' ? 'ES' : 'EN'}
      </LanguageButton>
    </LanguageSelectorContainer>
  );
};

export default LanguageSelector;
