import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled, { keyframes, css } from 'styled-components';
import { MdOutlineLanguage } from "react-icons/md";

// Tiempo mínimo que debe pasar entre cambios de idioma (ms)
const LANGUAGE_CHANGE_COOLDOWN = 3000;

interface LanguageSelectorProps {
  className?: string;
}

// Animación de carga
const loadingAnimation = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

// Estilos ajustados para que funcione dentro del ControlsContainer de la Sidebar
const LanguageSelectorContainer = styled.div`
  display: flex; 
  align-items: center;
`;

const LanguageButton = styled.button<{ $active?: boolean; $changing: boolean }>`
  display: flex; 
  align-items: center; 
  justify-content: center; // Centrar contenido si el padding lo permite
  height: 40px; // Altura fija
  min-width: 40px; // Ancho mínimo si solo es icono (aunque aquí siempre hay texto)
  padding: 0 12px; // Ajustar padding horizontal, vertical controlado por height/align-items
  background: ${props =>
    props.$changing ? 'rgba(150, 150, 150, 0.2)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${({ theme, $changing }) => ($changing ? 'rgba(255, 255, 255, 0.5)' : theme.colors.text)};
  border: 1px solid ${({ theme }) => theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 20px; // Hacerlo más redondeado para que coincida con los circulares
  cursor: ${props => (props.$changing ? 'not-allowed' : 'pointer')};
  font-size: 0.85rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
  box-shadow: 0 2px 8px ${({ theme }) => theme.isDark ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  position: relative;
  overflow: hidden;

  background: ${({ theme }) => 
    theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};

  &:hover {
    background: ${({ theme, $changing }) =>
      $changing 
      ? 'rgba(150, 150, 150, 0.2)' 
      : theme.isDark 
        ? 'rgba(255, 255, 255, 0.2)' 
        : 'rgba(0, 0, 0, 0.1)'};
    transform: ${props => (props.$changing ? 'none' : 'scale(1.03)')};
  }

  &:active {
    transform: ${props => (props.$changing ? 'none' : 'scale(0.97)')};
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
  margin-right: 5px;
  font-size: 1.1rem;
  opacity: ${props => (props.$changing ? 0.5 : 1)};
  transition: opacity 0.3s ease;
  color: ${({ theme }) => theme.colors.text};
  display: inline-flex;
  vertical-align: middle;
`;

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  className,
}) => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language?.startsWith('es') ? 'es' : 'en');
  
  // Un solo estado para controlar si el botón está en cooldown
  const [isDisabled, setIsDisabled] = useState(false);
  
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
    <LanguageSelectorContainer className={className}>
      <LanguageButton onClick={toggleLanguage} $changing={isDisabled}>
        <LanguageIcon $changing={isDisabled} />
        {currentLang === 'es' ? 'ES' : 'EN'}
      </LanguageButton>
    </LanguageSelectorContainer>
  );
};

export default LanguageSelector;
