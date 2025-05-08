import React, { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from '../ThemeToggle/ThemeToggle';
import LanguageSelector from '../LanguageSelector/LanguageSelector';
import Tooltip from '../Tooltip/Tooltip';
import {
  Menu,
  Home as HomeIcon,
  User as AboutIcon,
  Briefcase as ExperienceIcon,
  Mail as ContactIcon,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import PortfolioLogo from '../../assets/images/projects/Logo AV.png';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

interface NavLinkItem {
  href: string;
  labelKey: string;
  defaultLabel: string;
  IconComponent: React.ElementType;
  subLinks?: NavLinkItem[];
}

interface ChatItem {
  id: string;
  title: string;
  titleKey?: string;
  displayText: {
    es: string;
    en: string;
  };
}

interface ChatGroup {
  titleKey: string;
  defaultTitle: string;
  chats: ChatItem[];
}

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

interface TooltipState {
  visible: boolean;
  text: string;
  position: { x: number; y: number };
}

const SidebarOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const SidebarContainer = styled.aside<{ $isOpen: boolean; $isMobile: boolean }>`
  background-color: ${({ theme }) => theme.colors.sidebarBackground};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.space.lg};
  height: 100dvh;
  width: 280px;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out, background-color 0.3s ease-in-out;

  ${({ $isMobile, $isOpen }) =>
    $isMobile &&
    css`
      transform: ${$isOpen ? 'translateX(0)' : 'translateX(-100%)'};
      box-shadow: ${$isOpen ? '0 0 20px rgba(0,0,0,0.3)' : 'none'};
    `}
  
  ${({ $isMobile }) => 
    !$isMobile && 
    css`
      transform: translateX(0);
    `}
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  padding: ${({ theme }) => theme.space.sm} 0;
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const LogoImageWrapper = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.cardBackground};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 4px;
  box-sizing: border-box;
`;

const LogoImage = styled.img`
  max-height: 100%;
  max-width: 100%;
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: filter 0.3s ease-in-out;
  filter: ${({ theme }) => (theme.isDark ? 'none' : 'invert(1)')};
`;

const LogoText = styled.h1`
  font-family: 'NHaasGrotesk', sans-serif;
  font-size: 18px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  line-height: 1;
  letter-spacing: 0.5px;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-top: ${({ theme }) => theme.space.md};
  margin-bottom: ${({ theme }) => theme.space.xs};
`;

const ChatListContainer = styled.div`
  margin-top: 0;
  padding-top: ${({ theme }) => theme.space.md};
  border-top: 1px solid ${({ theme }) => (theme.isDark ? theme.colors.border : '#dee2e6')};
  flex-grow: 2;
  overflow-y: auto;

  /* Estilos de scrollbar consistentes */
  scrollbar-width: thin;
  scrollbar-color: rgba(155, 155, 155, 0.5) transparent;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: rgba(155, 155, 155, 0.5);
    border-radius: 20px;
  }
`;

const ChatGroupTitle = styled.h4`
  font-family: 'NHaasGrotesk', sans-serif;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => `0 ${theme.space.md} ${theme.space.xs}`};
  margin: 0 0 ${({ theme }) => theme.space.xs} 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  opacity: 0.9;
`;

const ChatGroupWrapper = styled.div`
  &:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.space.sm}; /* Espacio entre grupos de chat */
  }
`;

const ChatListStyled = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ChatItemStyled = styled.li`
  margin-bottom: ${({ theme }) => theme.space.xs};
`;

const ChatLink = styled.a`
  display: block;
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.md}`};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none !important;
  border-radius: 4px;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out, opacity 0.2s ease-in-out;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 400;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.75;

  &:hover {
    background-color: ${({ theme }) => (theme.isDark ? 'rgba(33,33,33,0.5)' : 'rgba(236,236,236,0.5)')};
    color: ${({ theme }) => theme.colors.text};
    opacity: 1;
  }

  &.active {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const NavItem = styled.li`
  margin-bottom: ${({ theme }) => theme.space.xs};

  &:last-child {
    margin-bottom: 0;
  }
`;

const NavLink = styled.a`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none !important;
  border-radius: 6px;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => (theme.isDark ? '#212121' : '#ECECEC')};
    color: ${({ theme }) => theme.colors.text};
    text-decoration: none !important;
  }

  &.active {
    background-color: ${({ theme }) => (theme.isDark ? theme.colors.text : theme.colors.text)}; 
    color: ${({ theme }) => (theme.isDark ? theme.colors.sidebarBackground : theme.colors.background)}; 
    svg {
        color: ${({ theme }) => (theme.isDark ? theme.colors.sidebarBackground : theme.colors.background)};
    }
  }

  svg {
    width: 18px;
    height: 18px;
    opacity: 0.9;
  }

  svg.chevron-icon {
    margin-left: auto;
    transition: transform 0.2s ease-in-out;
  }

  svg.chevron-icon.open {
    transform: rotate(180deg);
  }
`;

const SubNavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  margin-left: ${({ theme }) => theme.space.lg};
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;

  &.open {
    max-height: 500px;
  }
`;

const SubNavItem = styled.li`
  margin-bottom: ${({ theme }) => theme.space.xs};
`;

const SubNavLink = styled.a`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.md}`};
  padding-left: ${({ theme }) => theme.space.lg};
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none !important;
  border-radius: 4px;
  transition: background-color 0.2s ease-in-out, color 0.2s ease-in-out;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: 400;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => (theme.isDark ? 'rgba(33,33,33,0.5)' : 'rgba(236,236,236,0.5)')};
    color: ${({ theme }) => theme.colors.text};
  }

  &.active {
    background-color: ${({ theme }) => (theme.isDark ? theme.colors.text : theme.colors.text)}; 
    color: ${({ theme }) => (theme.isDark ? theme.colors.sidebarBackground : theme.colors.background)}; 
    svg {
        color: ${({ theme }) => (theme.isDark ? theme.colors.sidebarBackground : theme.colors.background)};
    }
  }

  svg {
    width: 14px;
    height: 14px;
    opacity: 0.8;
  }
`;

const ControlsContainer = styled.div`
  margin-top: auto;
  padding: ${({ theme }) => theme.space.md} 0;
  border-top: 1px solid ${({ theme }) => (theme.isDark ? theme.colors.border : '#dee2e6')};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.md};
`;

const SocialMediaButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${({ theme }) => 
    theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'}; 
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => (theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)')};
  border-radius: 50%;
  font-size: 1.1rem;
  text-decoration: none;
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => 
      theme.isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}; 
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    display: block;
  }
`;

const ThemeToggleWrapper = styled.div`
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  label.toggle {
      transform: scale(0.9);
  }
`;

const MobileMenuButton = styled.button<{ $isMobile: boolean; $isOpen: boolean }>`
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  z-index: 1001;
  background: ${({ theme }) => (theme.isDark ? 'rgba(33,33,33,0.8)' : 'rgba(255,255,255,0.8)')};
  border: 1px solid ${({ theme }) => (theme.isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')};
  color: ${({ theme }) => theme.colors.text};
  border-radius: 50%;
  padding: ${({ theme }) => theme.space.xs};
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: background-color 0.2s, box-shadow 0.2s, opacity 0.3s ease, transform 0.3s ease;
  width: 40px;
  height: 40px;
  display: ${({ $isMobile, $isOpen }) => (!$isMobile ? 'none' : $isOpen ? 'none' : 'flex')};
  align-items: center;
  justify-content: center;
  opacity: ${({ $isOpen }) => ($isOpen ? '0' : '1')};
  transform: ${({ $isOpen }) => ($isOpen ? 'translateX(-20px)' : 'translateX(0)')};
  pointer-events: ${({ $isOpen }) => ($isOpen ? 'none' : 'auto')};

  &:hover {
    background: ${({ theme }) => (theme.isDark ? 'rgba(45,45,45,0.9)' : 'rgba(240,240,240,0.9)')};
  }
`;

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, isMobile }) => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language.startsWith('es') ? 'es' : 'en';
  const navigate = useNavigate();
  const location = useLocation();
  const [tooltip, setTooltip] = useState<TooltipState>({ 
    visible: false, 
    text: '', 
    position: { x: 0, y: 0 } 
  });
  const [openSubmenuKey, setOpenSubmenuKey] = useState<string | null>(null);
  const [activeLink, setActiveLink] = useState<string>("#home");
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null); // Referencia al SidebarContainer

  // Efecto para controlar el scroll del body cuando el sidebar está abierto en móvil
  useEffect(() => {
    const body = document.body;
    if (isMobile && isOpen) {
      body.style.overflow = 'hidden';
    } else {
      body.style.overflow = 'auto';
    }

    // Cleanup: restaurar el scroll del body si el componente se desmonta
    return () => {
      body.style.overflow = 'auto';
    };
  }, [isOpen, isMobile]);

  const navLinks: NavLinkItem[] = [
    { href: '#home', labelKey: 'home', defaultLabel: 'Inicio', IconComponent: HomeIcon },
    { href: '#about', labelKey: 'navbar.about', defaultLabel: 'Sobre mí', IconComponent: AboutIcon },
    {
      href: '#experience',
      labelKey: 'experience',
      defaultLabel: 'Experiencia', 
      IconComponent: ExperienceIcon,
      subLinks: [
        { href: '/xcons', labelKey: 'navbar.xcons', defaultLabel: 'XCONS', IconComponent: ChevronRight }, 
        { href: '#fusionads', labelKey: 'navbar.fusionads', defaultLabel: 'FusionAds', IconComponent: ChevronRight },
        { href: '#bandit', labelKey: 'navbar.bandit', defaultLabel: 'Bandit', IconComponent: ChevronRight },
        { href: '#condamind', labelKey: 'navbar.condamind', defaultLabel: 'Condamind', IconComponent: ChevronRight },
      ],
    },
    { href: '#contact', labelKey: 'contact', defaultLabel: 'Contacto', IconComponent: ContactIcon },
  ];

  const chatGroups: ChatGroup[] = [
    {
      titleKey: 'sidebar.chats.today',
      defaultTitle: 'Hoy',
      chats: [
        { id: 'chat1', title: '¿Por qué Alexis es necesario en tu proyecto?', displayText: { es: '¿Por qué Alexis es necesario en tu proyecto?', en: 'Why is Alexis needed in your project?' } },
        { id: 'chat2', title: 'Planes de dominación mundial (con Alexis)', displayText: { es: 'Planes de dominación mundial (con Alexis)', en: 'World domination plans (with Alexis)' } },
        { id: 'chat3', title: 'Contratar a Alexis: la mejor decisión', displayText: { es: 'Contratar a Alexis: la mejor decisión', en: 'Hiring Alexis: the best decision' } },
        { id: 'chat_new1', title: 'El secreto del café perfecto según Alexis', displayText: { es: 'El secreto del café perfecto según Alexis', en: 'Alexis\'s secret to the perfect coffee' } },
      ],
    },
    {
      titleKey: 'sidebar.chats.yesterday',
      defaultTitle: 'Ayer',
      chats: [
        { id: 'chat4', title: 'Ideas de proyectos innovadores con Alexis', displayText: { es: 'Ideas de proyectos innovadores con Alexis', en: 'Innovative project ideas with Alexis?' } },
        { id: 'chat5', title: '¿Cómo contactar a este genio?', displayText: { es: '¿Cómo contactar a este genio?', en: 'How to contact this genius?' } },
        { id: 'chat6', title: 'El impacto de Alexis en la industria tech', displayText: { es: 'El impacto de Alexis en la industria tech', en: 'Alexis\'s impact on the tech industry' } },
        { id: 'chat_new2', title: 'Debate: ¿Piña en la pizza? La opinión de Alexis', displayText: { es: 'Debate: ¿Piña en la pizza? La opinión de Alexis', en: 'Debate: Pineapple on pizza? Alexis\'s take' } },
      ],
    },
    {
      titleKey: 'sidebar.chats.previous',
      defaultTitle: 'Anteriores',
      chats: [
        { id: 'chat_prev1', title: 'Desbloqueando el potencial de React con Alexis', displayText: { es: 'Desbloqueando el potencial de React con Alexis', en: 'Unlocking React\'s potential with Alexis' } },
        { id: 'chat_prev2', title: 'Consejos de Alexis para un código limpio', displayText: { es: 'Consejos de Alexis para un código limpio', en: 'Alexis\'s tips for clean code' } },
        { id: 'chat_prev3', title: 'La filosofía de diseño de Alexis Vedia', displayText: { es: 'La filosofía de diseño de Alexis Vedia', en: 'Alexis Vedia\'s design philosophy' } },
      ]
    }
  ];

  const swipeThreshold = 50; 

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) {
      return;
    }

    const swipeDistance = touchEndX.current - touchStartX.current;
    
    if (swipeDistance > swipeThreshold && !isOpen) {
      toggleSidebar();
    }
    
    if (swipeDistance < -swipeThreshold && isOpen) {
      toggleSidebar();
    }
    
    touchStartX.current = null;
    touchEndX.current = null;
  };

  useEffect(() => {
    if (isMobile) {
      const handleDocumentTouchStart = (e: TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
      };
      
      const handleDocumentTouchMove = (e: TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
      };
      
      const handleDocumentTouchEnd = () => {
        if (touchStartX.current === null || touchEndX.current === null) {
          return;
        }
        
        const swipeDistance = touchEndX.current - touchStartX.current;
        
        if (swipeDistance > swipeThreshold && !isOpen && touchStartX.current < 30) {
          toggleSidebar();
        }
        
        touchStartX.current = null;
        touchEndX.current = null;
      };
      
      document.addEventListener('touchstart', handleDocumentTouchStart);
      document.addEventListener('touchmove', handleDocumentTouchMove);
      document.addEventListener('touchend', handleDocumentTouchEnd);
      
      return () => {
        document.removeEventListener('touchstart', handleDocumentTouchStart);
        document.removeEventListener('touchmove', handleDocumentTouchMove);
        document.removeEventListener('touchend', handleDocumentTouchEnd);
      };
    }
  }, [isMobile, isOpen, toggleSidebar]);

  useEffect(() => {
    if (location.pathname === '/') {
      if (location.hash) {
        setActiveLink(location.hash);
      } else {
        setActiveLink('#home');
      }
    } else {
      setActiveLink(location.pathname);
    }
  }, [location]);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, linkItem: NavLinkItem) => {
    e.preventDefault();
    const { href, subLinks } = linkItem;
    
    setActiveLink(href);
    
    const isExperienceSublink = navLinks
        .find(link => link.href === '#experience')
        ?.subLinks?.some(subLink => subLink.href === href);

    if (subLinks && subLinks.length > 0) {
      if (openSubmenuKey === href) {
        setOpenSubmenuKey(null);
      } else {
        setOpenSubmenuKey(href);
      }
    } else if (!isExperienceSublink) {
      setOpenSubmenuKey(null);
    }
    
    if (href.startsWith('#')) {
      if (location.pathname === '/') {
        const targetId = href.substring(1);
        const element = document.getElementById(targetId);
        
        if (element) {
          setTimeout(() => {
            window.scrollTo({
              top: element.offsetTop - 80,
              behavior: 'smooth'
            });
            
            try {
              element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
              });
            } catch (error) {
              console.error("Error en scrollIntoView:", error);
            }
          }, 50);
        } else {
          console.warn(`Elemento con ID '${targetId}' no encontrado en el DOM.`);
        }
      } else {
        navigate(`/${href}`);
      }
    } else {
      navigate(href);
    }
    
    if (isMobile && isOpen) {
      const isSublinkClick = navLinks.some(link => link.subLinks?.some(sl => sl.href === href));
      if ((!subLinks || subLinks.length === 0) || isSublinkClick) {
         toggleSidebar();
      }
    }
  };

  const showTooltip = (textKey: string, e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltip({
      visible: true,
      text: t(textKey),
      position: {
        x: rect.left + rect.width / 2,
        y: rect.top,
      }
    });
  };

  const hideTooltip = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };

  return (
    <>
      <Tooltip 
        text={tooltip.text} 
        isVisible={tooltip.visible} 
        position={tooltip.position} 
      />
      
      {isMobile && (
        <MobileMenuButton 
          $isMobile={isMobile}
          $isOpen={isOpen}
          onClick={toggleSidebar}
          aria-label={t('openMenu', 'Abrir menú')}
        >
          <Menu size={24} />
        </MobileMenuButton>
      )}

      {isMobile && <SidebarOverlay $isOpen={isOpen} onClick={toggleSidebar} />}

      <SidebarContainer 
        $isOpen={isOpen} 
        $isMobile={isMobile}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <LogoContainer>
          <LogoImageWrapper>
            <LogoImage src={PortfolioLogo} alt={t('portfolioLogoAlt', 'Logo del Portafolio')} />
          </LogoImageWrapper>
          <LogoText>{t('sidebar.logoText', 'Portfolio')}</LogoText>
        </LogoContainer>
        <NavList>
          {navLinks.map((linkItemMap) => {
            const { href: itemHref, labelKey, defaultLabel, IconComponent: ItemIconComponent, subLinks: itemSubLinks } = linkItemMap;
            
            const isSubmenuOpen = openSubmenuKey === itemHref;
            
            const isLinkActive = activeLink === itemHref;
            
            return (
              <NavItem key={itemHref}>
                <NavLink 
                  href={itemHref} 
                  onClick={(e) => handleLinkClick(e, linkItemMap)}
                  className={isLinkActive ? 'active' : ''}
                >
                  <ItemIconComponent />
                  {t(labelKey, defaultLabel)}
                  {itemSubLinks && itemSubLinks.length > 0 && (
                    <ChevronDown size={16} className={`chevron-icon ${isSubmenuOpen ? 'open' : ''}`} />
                  )}
                </NavLink>
                {itemSubLinks && itemSubLinks.length > 0 && (
                  <SubNavList className={isSubmenuOpen ? 'open' : ''}>
                    {itemSubLinks.map((subLinkItem) => (
                      <SubNavItem key={subLinkItem.href}>
                        <SubNavLink 
                          href={subLinkItem.href} 
                          onClick={(e) => handleLinkClick(e, subLinkItem)}
                          className={activeLink === subLinkItem.href ? 'active' : ''}
                        >
                          {t(subLinkItem.labelKey, subLinkItem.defaultLabel)}
                        </SubNavLink>
                      </SubNavItem>
                    ))}
                  </SubNavList>
                )}
              </NavItem>
            );
          })}
        </NavList>

        <ChatListContainer>
          {chatGroups.map((group) => (
            <ChatGroupWrapper key={group.titleKey}>
              <ChatGroupTitle>{t(group.titleKey, group.defaultTitle)}</ChatGroupTitle>
              <ChatListStyled>
                {group.chats.map((chat) => (
                  <ChatItemStyled key={chat.id}>
                    <ChatLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        console.log(`Clicked chat: ${chat.displayText[currentLanguage]}`);
                        if (isMobile) toggleSidebar(); 
                      }}
                      onMouseEnter={(e) => showTooltip(chat.displayText[currentLanguage], e)}
                      onMouseLeave={hideTooltip}
                    >
                      {chat.displayText[currentLanguage]}
                    </ChatLink>
                  </ChatItemStyled>
                ))}
              </ChatListStyled>
            </ChatGroupWrapper>
          ))}
        </ChatListContainer>

        <ControlsContainer>
          <SocialMediaButton 
            href="https://github.com/AxSRockS" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="GitHub"
            onMouseEnter={(e) => showTooltip('tooltip.github', e)}
            onMouseLeave={hideTooltip}
          >
            <FaGithub />
          </SocialMediaButton>
          <SocialMediaButton 
            href="https://www.linkedin.com/in/alexis-vedia-80b936190/" 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label="LinkedIn"
            onMouseEnter={(e) => showTooltip('tooltip.linkedin', e)}
            onMouseLeave={hideTooltip}
          >
            <FaLinkedin />
          </SocialMediaButton>
          <div 
             onMouseEnter={(e) => showTooltip('tooltip.toggleTheme', e)} 
             onMouseLeave={hideTooltip} 
             style={{ lineHeight: 1 }}
          >
            <ThemeToggleWrapper>
              <ThemeToggle />
            </ThemeToggleWrapper>
          </div>
          <div 
             onMouseEnter={(e) => showTooltip('tooltip.selectLanguage', e)} 
             onMouseLeave={hideTooltip}
             style={{ lineHeight: 1 }}
          >
            <LanguageSelector />
          </div>
        </ControlsContainer>
      </SidebarContainer>
    </>
  );
};

export default Sidebar; 