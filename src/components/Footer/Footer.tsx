import React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  padding: ${({ theme }) => theme.space.xl} 0;
  margin-top: ${({ theme }) => theme.space['2xl']};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  transition: background-color 0.3s ease, border-color 0.3s ease;
  width: 100%;
`;

const FooterContent = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.space.lg};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Logo = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  font-weight: 700;
  margin-bottom: ${({ theme }) => theme.space.lg};
  color: ${({ theme }) => theme.colors.text};
`;

const SocialLinks = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.lg};
  margin-bottom: ${({ theme }) => theme.space.xl};
`;

const SocialLink = styled.a`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.xl};
  transition: all 0.2s ease;
  width: 2.5rem;
  height: 2.5rem;
  background-color: ${({ theme }) => theme.isDark 
    ? 'rgba(255, 255, 255, 0.1)' 
    : 'rgba(0, 0, 0, 0.05)'};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-3px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);
  }
`;

const NavLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.space.lg};
  margin-bottom: ${({ theme }) => theme.space.xl};
`;

const NavLink = styled.a`
  color: ${({ theme }) => `${theme.colors.text}cc`};
  text-decoration: none;
  font-size: ${({ theme }) => theme.fontSizes.md};
  transition: color 0.2s ease;
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
  border-radius: 4px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => `${theme.colors.primary}11`};
  }
`;

const Copyright = styled.p`
  color: ${({ theme }) => `${theme.colors.text}99`};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  text-align: center;
`;

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <Logo>Portfolio</Logo>
        
        <SocialLinks>
          <SocialLink href="https://github.com/yourusername" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <i className="fab fa-github"></i>
          </SocialLink>
          <SocialLink href="https://linkedin.com/in/yourusername" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <i className="fab fa-linkedin-in"></i>
          </SocialLink>
          <SocialLink href="https://twitter.com/yourusername" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </SocialLink>
          <SocialLink href="https://dribbble.com/yourusername" target="_blank" rel="noopener noreferrer" aria-label="Dribbble">
            <i className="fab fa-dribbble"></i>
          </SocialLink>
        </SocialLinks>
        
        <NavLinks>
          <NavLink href="#home">{t('home')}</NavLink>
          <NavLink href="#projects">{t('projects')}</NavLink>
          <NavLink href="#contact">{t('contact')}</NavLink>
        </NavLinks>
        
        <Copyright>&copy; {currentYear} {t('yourName')}. {t('allRightsReserved')}</Copyright>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer; 