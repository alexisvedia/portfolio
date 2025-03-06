import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

interface LanguageSelectorProps {
  className?: string;
}

const LanguageSelectorContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
`;

const LanguageButton = styled.button<{ $active?: boolean }>`
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50px;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
  transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05) translateY(-2px);
  }

  &:active {
    transform: scale(0.98) translateY(0);
  }
`;

const FlagIcon = styled.span`
  margin-right: 6px;
  font-size: 1rem;
`;

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ className }) => {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language?.startsWith('es') ? 'es' : 'en');

  useEffect(() => {
    // Sincronizar el estado con el idioma actual
    const lang = i18n.language?.startsWith('es') ? 'es' : 'en';
    if (currentLang !== lang) {
      setCurrentLang(lang);
    }
  }, [i18n.language, currentLang]);

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'es' : 'en';

    // En lugar de cambiar el idioma directamente, emitimos un evento personalizado
    const event = new CustomEvent('initiateLanguageChange', {
      detail: { newLanguage: newLang },
    });
    window.dispatchEvent(event);
  };

  return (
    <LanguageSelectorContainer className={className}>
      <LanguageButton $active={true} onClick={toggleLanguage}>
        <FlagIcon>
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
            <path d="M2 12h20"></path>
          </svg>
        </FlagIcon>
        {currentLang === 'en' ? 'EN' : 'ES'}
      </LanguageButton>
    </LanguageSelectorContainer>
  );
};

export default LanguageSelector;
