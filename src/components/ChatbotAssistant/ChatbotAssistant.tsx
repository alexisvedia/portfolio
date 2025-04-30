import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { HiSparkles } from 'react-icons/hi2';
import ReactMarkdown from 'react-markdown';
import { sendMessageToN8N, initializeN8NServer } from '../../services/n8nService';
import { useTheme } from '../../context/ThemeContext';

// Animations
const morphToChat = keyframes`
  0% {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    opacity: 1;
  }
  20% {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    opacity: 1;
  }
  100% {
    width: 320px;
    height: 400px;
    border-radius: 16px;
    opacity: 1;
  }
`;

// Mobile-specific animations - simplificar para mejor rendimiento
const morphToButton = keyframes`
  0% {
    width: 320px;
    height: 400px;
    border-radius: 16px;
  }
  100% {
    width: 48px;
    height: 48px;
    border-radius: 50%;
  }
`;

const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0.8;
  }
`;

const fadeInContent = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const fadeOutContent = keyframes`
  0% {
    opacity: 1;
  }
  40% {
    opacity: 0;
  }
  100% {
    opacity: 0;
  }
`;

const smoothAppear = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const AppOverlay = styled.div<{ $isOpen: boolean; $isMobile: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  pointer-events: ${props => (props.$isOpen && props.$isMobile ? 'auto' : 'none')};
  opacity: ${props => (props.$isOpen && props.$isMobile ? 0.5 : 0)};
  background-color: ${props =>
    props.$isOpen && props.$isMobile ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)'};
  transition: ${props => (props.$isMobile ? 'opacity 0.2s linear' : 'none')};
  will-change: opacity;
  backdrop-filter: none;

  @media (max-width: 768px) {
    height: calc(var(--vh, 1vh) * 100);
  }
`;

const ChatbotContainer = styled.div<{ $isOpen: boolean; $visible: boolean; $isReady: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  opacity: 0;
  transform: translateY(20px);
  animation: ${props =>
    props.$visible
      ? css`
          ${smoothAppear} 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards
        `
      : 'none'};
  animation-delay: 0s;
  overscroll-behavior: contain;

  @media (max-width: 768px) {
    bottom: ${props => (props.$isOpen ? '0' : '30px')};
    right: ${props => (props.$isOpen ? '0' : '20px')};
    width: ${props => (props.$isOpen ? '100%' : 'auto')};
    height: ${props => (props.$isOpen ? '100%' : 'auto')};
    z-index: 1001;
    transform: none;
    will-change: bottom, right, width, height;
  }
`;

const FloatingWrapper = styled.div<{ $isReady: boolean; $isOpen: boolean; $isMobile: boolean }>`
  animation: ${props =>
    props.$isReady && !props.$isOpen && !props.$isMobile
      ? css`
          ${float} 6s ease-in-out infinite
        `
      : 'none'};
  animation-delay: 0.3s;

  @media (max-width: 768px) {
    width: ${props => (props.$isOpen ? '100%' : 'auto')};
    height: ${props => (props.$isOpen ? '100%' : 'auto')};
    position: ${props => (props.$isOpen ? 'absolute' : 'relative')};
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
`;

const ChatElement = styled.div<{ $isOpen: boolean; $isInitialRender: boolean; $isMobile: boolean }>`
  width: ${props => (props.$isOpen ? '320px' : '48px')};
  height: ${props => (props.$isOpen ? '400px' : '48px')};
  border-radius: ${props => (props.$isOpen ? '16px' : '50%')};
  background: ${({ theme, $isOpen }) => 
    $isOpen 
      ? theme.isDark 
        ? 'rgba(30, 30, 35, 0.95)' 
        : 'rgba(240, 240, 245, 0.95)'
      : theme.isDark 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'rgba(0, 0, 0, 0.05)'
  };
  backdrop-filter: none;
  border: 1px solid ${({ theme }) => 
    theme.isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
  box-shadow: 0 4px 20px ${({ theme }) => 
    theme.isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  animation: ${props =>
    !props.$isMobile &&
    !props.$isInitialRender &&
    (props.$isOpen
      ? css`
          ${morphToChat} 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards
        `
      : css`
          ${morphToButton} 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards
        `)};
  transform-origin: bottom right;
  transition: ${props => 
    props.$isMobile 
      ? 'none' 
      : 'all 0.3s ease'
  };
  visibility: visible;
  opacity: 1;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    backdrop-filter: none;
    z-index: -1;
  }

  @media (max-width: 768px) {
    width: ${props => (props.$isOpen ? '100%' : '48px')};
    height: ${props => (props.$isOpen ? 'calc(var(--vh, 1vh) * 100)' : '48px')};
    border-radius: ${props => (props.$isOpen ? '0' : '50%')};
    position: ${props => (props.$isOpen ? 'fixed' : 'relative')};
    top: ${props => (props.$isOpen ? '0' : 'auto')};
    right: ${props => (props.$isOpen ? '0' : 'auto')};
    bottom: ${props => (props.$isOpen ? '0' : 'auto')};
    left: ${props => (props.$isOpen ? '0' : 'auto')};
    will-change: width, height, border-radius, position;
    border: ${props => (props.$isOpen ? 'none' : '1px solid rgba(255, 255, 255, 0.1)')};
  }
`;

const ChatButton = styled.button<{ $isOpen: boolean; $isMobile: boolean }>`
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.text};
  cursor: pointer;
  border: none;
  background: transparent;
  position: absolute;
  top: 0;
  left: 0;
  z-index: ${props => (props.$isOpen ? '0' : '2')};
  opacity: ${props => (props.$isOpen ? '0' : '1')};
  transition: opacity 0.2s ease-out;
  animation: none;
  overflow: hidden;
  touch-action: manipulation;

  &:hover {
    background: ${({ theme }) => 
      theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
  }

  &:active {
    transform: scale(0.95);
    transition: transform 0.1s ease-in-out;
  }

  &:before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border-radius: 50%;
    background: ${({ theme }) => 
      theme.isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)'};
    z-index: -1;
    opacity: ${props => (props.$isOpen ? '0' : '0.6')};
    animation: ${pulse} 3s ease-in-out infinite;
    pointer-events: none;
  }

  @media (max-width: 768px) {
    width: 48px;
    height: 48px;
    /* Área de toque aumentada para mejorar accesibilidad en móviles */
    &:after {
      content: '';
      position: absolute;
      top: -10px;
      left: -10px;
      right: -10px;
      bottom: -10px;
    }
  }
`;

const RippleSpan = styled.span<{ $x: number; $y: number; $size: number }>`
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 600ms cubic-bezier(0.4, 0, 0.2, 1);
  background-color: rgba(255, 255, 255, 0.7);
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  top: ${props => props.$y - props.$size / 2}px;
  left: ${props => props.$x - props.$size / 2}px;

  @keyframes ripple {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
`;

const IconContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
`;

const ChatContent = styled.div<{ $isOpen: boolean; $isMobile: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  opacity: ${props => (props.$isOpen ? '1' : '0')};
  animation: ${props =>
    !props.$isMobile && props.$isOpen
      ? css`
          ${fadeInContent} 0.4s forwards
        `
      : !props.$isMobile
        ? css`
            ${fadeOutContent} 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards
          `
        : 'none'};
  z-index: ${props => (props.$isOpen ? '2' : '0')};
  pointer-events: ${props => (props.$isOpen ? 'auto' : 'none')};
  transition: ${props => (props.$isMobile ? 'none' : 'none')};
  transform: scale(1);

  @media (max-width: 768px) {
    height: 100%;
    display: flex;
    flex-direction: column;
  }
`;

const ChatHeader = styled.div`
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  backdrop-filter: none;

  .header-buttons {
    display: flex;
    flex-direction: row;
    gap: 12px;
    align-items: center;
    margin-left: auto;
  }

  @media (max-width: 768px) {
    border-radius: 0;
    padding: 20px 16px;
    padding-top: max(20px, env(safe-area-inset-top, 20px));
    position: sticky;
    top: 0;
    z-index: 10;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
`;

const HeaderTitle = styled.h3`
  margin: 0;
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: 600;
  font-family: inherit;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    display: flex;
    vertical-align: middle;
  }
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  -webkit-overflow-scrolling: touch; /* Para scroll suave en iOS */

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
  }

  @media (max-width: 768px) {
    padding: 20px;
    flex: 1;
    height: 100%;
    max-height: calc(var(--vh, 1vh) * 100 - 130px);
    padding-bottom: env(safe-area-inset-bottom, 20px);
  }
`;

const dotAnimation = keyframes`
  0%, 20% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-5px);
  }
  60%, 100% {
    transform: translateY(0);
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  max-width: 80px;
  margin: 4px 0;
  align-self: flex-start;

  span {
    width: 6px;
    height: 6px;
    background: ${props => props.theme.colors.text};
    border-radius: 50%;
    display: inline-block;
    opacity: 0.8;

    &:nth-child(1) {
      animation: ${dotAnimation} 1.4s infinite 0s;
    }
    &:nth-child(2) {
      animation: ${dotAnimation} 1.4s infinite 0.2s;
    }
    &:nth-child(3) {
      animation: ${dotAnimation} 1.4s infinite 0.4s;
    }
  }
`;

const MessageBubble = styled.div<{
  $isUser?: boolean;
  $index: number;
  $shouldAnimate: boolean;
  $isMobile: boolean;
}>`
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 16px;
  background: ${props =>
    props.$isUser
      ? `linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.accent})`
      : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.$isUser ? "white" : props.theme.colors.text};
  align-self: ${props => (props.$isUser ? 'flex-end' : 'flex-start')};
  font-size: ${props => props.theme.fontSizes.sm};
  line-height: 1.5;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  opacity: 1;
  animation: none;
  animation-delay: 0s;
  transform-origin: ${props => (props.$isUser ? 'bottom right' : 'bottom left')};

  @media (max-width: 768px) {
    max-width: 85%;
    padding: 12px 16px;
    font-size: calc(${props => props.theme.fontSizes.sm} + 1px);
  }
`;

const ChatInputContainer = styled.div`
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  gap: 10px;
  background: rgba(20, 20, 25, 0.3);
  backdrop-filter: none;

  @media (max-width: 768px) {
    padding: 16px 20px;
    padding-bottom: max(16px, env(safe-area-inset-bottom));
    position: sticky;
    bottom: 0;
    width: 100%;
    z-index: 10;
    backdrop-filter: none;
  }
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border-radius: 20px;
  border: none;
  background: rgba(255, 255, 255, 0.05);
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.fontSizes.sm};
  outline: none;
  transition: all 0.2s;

  &:focus {
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 0 0 2px rgba(0, 112, 243, 0.3);
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  @media (max-width: 768px) {
    padding: 14px 18px;
    font-size: calc(${props => props.theme.fontSizes.sm} + 1px);
    min-height: 48px;
  }
`;

const SendButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: none;
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid rgba(255, 255, 255, 0.05);

  &:hover {
    transform: scale(1.05);
    background: rgba(255, 255, 255, 0.15);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    backdrop-filter: none;
  }
`;

// Memoizar el componente AIStarsIcon para reducir re-renderizados
const AIStarsIcon = React.memo(({ className }: { className?: string }) => {
  const { themeMode } = useTheme();
  return (
    <span
      className={className}
      style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <HiSparkles size={22} color={themeMode === 'dark' ? "white" : "black"} />
    </span>
  );
});

// Sample messages for demo
const initialMessages = [
  { text: '¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?', isUser: false },
];

interface ChatbotAssistantProps {
  initialDelay?: number;
}

const ChatbotAssistant: React.FC<ChatbotAssistantProps> = ({ initialDelay = 500 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [visible, setVisible] = useState(false);
  const [shouldAnimateMessages, setShouldAnimateMessages] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const initRetryCountRef = useRef(0);
  const [ripples, setRipples] = useState<
    Array<{ x: number; y: number; size: number; key: number }>
  >([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();

  // Añadir efecto para establecer la variable vh para viewport en móviles
  useEffect(() => {
    // Crear una variable CSS para la altura real de la ventana en dispositivos móviles
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Establecer el valor inicial
    setVh();

    // Actualizar en cambios de orientación o redimensionamiento
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', setVh);

    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, []);

  const handleClearChat = () => {
    setMessages([
      { text: t('¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?'), isUser: false },
    ]);
  };

  // Verificar si estamos en un dispositivo móvil - memoizado para evitar recálculos
  const isMobile = React.useMemo(() => 
    typeof window !== 'undefined' && window.innerWidth <= 768, 
    []
  );

  // Optimizar inicialización para no bloquear el hilo principal
  const initializeService = async () => {
    if (!isReady) {
      try {
        // Usamos setTimeout para no bloquear el hilo principal
        await new Promise(resolve => setTimeout(resolve, 0));
        const isInitialized = await initializeN8NServer();
        if (isInitialized) {
          // Solo después de que el servicio esté listo, iniciamos la animación del chat
          requestAnimationFrame(() => {
            setVisible(true);
            setTimeout(() => {
              setIsReady(true);
            }, 300);
          });
        } else {
          // Si la inicialización falla y no hemos excedido el límite de intentos, reintentamos
          if (initRetryCountRef.current < 2) { // Reducir número de reintentos
            initRetryCountRef.current += 1;
            setTimeout(initializeService, 3000); // Aumentar intervalo para reducir carga
          }
        }
      } catch (error) {
        console.error('Error al inicializar el servicio:', error);
        if (initRetryCountRef.current < 2) {
          initRetryCountRef.current += 1;
          setTimeout(initializeService, 3000);
        }
      }
    }
  };

  // Optimizar el efecto useEffect para la inicialización
  useEffect(() => {
    // Retrasar inicialización en dispositivos móviles para mejorar LCP
    const delay = typeof window !== 'undefined' && window.innerWidth <= 768 ? 1000 : initialDelay;
    
    const initTimer = setTimeout(() => {
      initializeService();
    }, delay);
    
    return () => clearTimeout(initTimer);
  }, []);

  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Modificar el efecto para el manejo del scroll
  useEffect(() => {
    if (isMobile && isOpen) {
      // Guardar la posición actual del scroll
      const scrollY = window.scrollY;
      
      // Aplicar estilos para prevenir scroll
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.overscrollBehavior = 'none';
      
      // Establecer una clase para manejar iOS
      document.documentElement.classList.add('chat-open');
      
      // Ajustar altura para dispositivos con notch
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      
      // Manejar iOS focus en input
      if (inputRef.current) {
        const handleKeyboardShow = () => {
          // Esperar a que el teclado aparezca
          setTimeout(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          }, 300);
        };
        
        inputRef.current.addEventListener('focus', handleKeyboardShow);
        
        return () => {
          inputRef.current?.removeEventListener('focus', handleKeyboardShow);
        };
      }
    } else {
      // Restaurar el scroll
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.overscrollBehavior = '';
      document.documentElement.classList.remove('chat-open');
      
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.body.style.overscrollBehavior = '';
      document.documentElement.classList.remove('chat-open');
    };
  }, [isOpen, isMobile]);

  // Añadir un efecto para manejar cambios de orientación
  useEffect(() => {
    const handleOrientationChange = () => {
      if (isOpen && isMobile) {
        // Ajustar altura en cambios de orientación
        setTimeout(() => {
          const vh = window.innerHeight * 0.01;
          document.documentElement.style.setProperty('--vh', `${vh}px`);
          // Asegurar scroll al final
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    };
    
    window.addEventListener('orientationchange', handleOrientationChange);
    window.addEventListener('resize', handleOrientationChange);
    
    return () => {
      window.removeEventListener('orientationchange', handleOrientationChange);
      window.removeEventListener('resize', handleOrientationChange);
    };
  }, [isOpen, isMobile]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(
        () => {
          inputRef.current?.focus();
        },
        isMobile ? 100 : 400
      ); // Tiempo más rápido para móviles
    }
  }, [isOpen, isMobile]);

  // Trigger message animation when chat opens
  useEffect(() => {
    if (isOpen) {
      // Immediate animation for messages
      setShouldAnimateMessages(true);
    } else {
      setShouldAnimateMessages(false);
    }

    // After first toggle, no longer initial render
    if (isInitialRender && isOpen) {
      setIsInitialRender(false);
    }
  }, [isOpen, isInitialRender]);

  const toggleChat = () => {
    // Only allow toggle when component is fully ready
    if (!isReady) return;

    // Sin usar requestAnimationFrame en móvil para que sea instantáneo
    if (isMobile) {
      if (isInitialRender) {
        setIsInitialRender(false);
        setIsOpen(true);
      } else {
        setIsOpen(!isOpen);
      }

      // Si estamos abriendo y no hay mensajes, añadir mensaje de bienvenida
      if (!isOpen && messages.length === 0) {
        setMessages([
          { text: t('¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?'), isUser: false },
        ]);
      }
    } else {
      // Mantener animación en desktop
      requestAnimationFrame(() => {
        if (isInitialRender) {
          setIsInitialRender(false);
          setIsOpen(true);
        } else {
          setIsOpen(!isOpen);
        }

        if (!isOpen && messages.length === 0) {
          setMessages([
            { text: t('¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?'), isUser: false },
          ]);
        }
      });
    }
  };

  // MOVIDO: Después de la definición de toggleChat
  const handleClickOutside = React.useCallback((event: MouseEvent) => {
    try {
      if (
        chatbotRef.current &&
        !chatbotRef.current.contains(event.target as Node) &&
        isOpen
      ) {
        // Usar el toggleChat en lugar de setIsOpen para cerrar correctamente
        toggleChat();
      }
    } catch (error) {
      console.error("Error en handleClickOutside:", error);
    }
  }, [isOpen, chatbotRef, toggleChat]);

  // Optimizar manejo de click outside
  useEffect(() => {
    // Siempre agregar el event listener cuando el chat está abierto, independientemente del dispositivo
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, handleClickOutside]);

  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent multiple clicks
    if (!isReady) return;
    
    // Debounce click handling to improve performance
    e.preventDefault();
    e.stopPropagation(); // Prevenir propagación del evento
    
    try {
      // Call toggle function directly without ripple calculation on low-end devices
      if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) {
        toggleChat();
        return;
      }
      
      // Guardar las coordenadas inmediatamente para evitar errores si el botón desaparece
      const button = e.currentTarget;
      if (!button) {
        toggleChat();
        return;
      }
      
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 1.5;
      
      // Use requestAnimationFrame para la UI
      requestAnimationFrame(() => {
        // Create new ripple with improved sizing
        const ripple = {
          x,
          y,
          size,
          key: Date.now(),
        };

        // Add new ripple to state - limit to one ripple for mobile
        setRipples([ripple]);

        // Remove ripple after animation completes
        setTimeout(() => {
          setRipples([]);
        }, 600); // Match the animation duration
      });

      // Call toggle function immediately for better responsiveness
      toggleChat();
    } catch (error) {
      console.error("Error en handleButtonClick:", error);
      // En caso de error, al menos asegurar que el toggle funcione
      toggleChat();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim()) {
      const userMessage = { text: inputValue, isUser: true };
      setInputValue('');
      inputRef.current?.focus();
      setShouldAnimateMessages(true);
      setMessages([...messages, userMessage]);
      setIsTyping(true);

      try {
        const response = await sendMessageToN8N(inputValue);
        setIsTyping(false);
        setMessages(prev => [...prev, response]);
      } catch (error) {
        console.error('Error al enviar mensaje:', error);
        setIsTyping(false);

        // Mensaje personalizado basado en el tipo de error
        let errorMessage =
          'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo más tarde.';

        // Si es un error específico de arranque en frío o conexión
        if (error instanceof Error) {
          if (
            error.message.includes('iniciando') ||
            error.message.includes('después de varios intentos') ||
            error.message.includes('failed to fetch') ||
            error.message.includes('network') ||
            error.message.includes('connection')
          ) {
            errorMessage =
              'Parece que el servicio está iniciando o hay problemas de conexión. Por favor, espera unos segundos y vuelve a intentarlo.';
          }
        }

        setMessages(prev => [
          ...prev,
          {
            text: errorMessage,
            isUser: false,
          },
        ]);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Optimizar renderizado usando React.memo para componentes internos
  const MessageBubbleContent = React.memo(({ message }: { message: { text: string; isUser: boolean } }) => (
    <ReactMarkdown>{message.text}</ReactMarkdown>
  ));

  // Return nothing until we're ready to start the animation
  if (!visible && !isReady) return null;

  return (
    <>
      <AppOverlay $isOpen={isOpen} $isMobile={isMobile} />
      <ChatbotContainer 
        $isOpen={isOpen} 
        ref={chatbotRef} 
        $visible={visible} 
        $isReady={isReady}
      >
        <FloatingWrapper $isReady={isReady} $isOpen={isOpen} $isMobile={isMobile}>
          <ChatElement $isOpen={isOpen} $isInitialRender={isInitialRender} $isMobile={isMobile}>
            <ChatButton onClick={handleButtonClick} $isOpen={isOpen} $isMobile={isMobile}>
              <IconContainer>
                <AIStarsIcon />
              </IconContainer>
              {ripples.map(ripple => (
                <RippleSpan key={ripple.key} $x={ripple.x} $y={ripple.y} $size={ripple.size} />
              ))}
            </ChatButton>

            {/* Solo renderizar el contenido cuando esté abierto para optimizar rendimiento */}
            {isOpen && (
              <ChatContent $isOpen={isOpen} $isMobile={isMobile}>
                <ChatHeader>
                  <HeaderTitle>
                    <AIStarsIcon className="header-icon" />
                    {t('Asistente')}
                  </HeaderTitle>
                  <div className="header-buttons">
                    <HeaderButton onClick={handleClearChat} title="Limpiar chat">
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
                        <path d="M3 6h18" />
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      </svg>
                    </HeaderButton>
                    <HeaderButton onClick={toggleChat}>×</HeaderButton>
                  </div>
                </ChatHeader>

                <ChatMessages>
                  {messages.map((message, index) => (
                    <MessageBubble
                      key={index}
                      $isUser={message.isUser}
                      $index={index}
                      $shouldAnimate={shouldAnimateMessages}
                      $isMobile={isMobile}
                    >
                      <MessageBubbleContent message={message} />
                    </MessageBubble>
                  ))}
                  {isTyping && (
                    <TypingIndicator>
                      <span></span>
                      <span></span>
                      <span></span>
                    </TypingIndicator>
                  )}
                  <div ref={messagesEndRef} />
                </ChatMessages>

                <ChatInputContainer>
                  <ChatInput
                    type="text"
                    placeholder={t('Escribe un mensaje...')}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyPress={handleKeyPress}
                    ref={inputRef}
                  />
                  <SendButton onClick={handleSendMessage}>
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M22 2L11 13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M22 2L15 22L11 13L2 9L22 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </SendButton>
                </ChatInputContainer>
              </ChatContent>
            )}
          </ChatElement>
        </FloatingWrapper>
      </ChatbotContainer>
    </>
  );
};

// Aplicar memo al componente completo para evitar renderizados innecesarios
export default React.memo(ChatbotAssistant);

const HeaderButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.text};
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 16px;
    height: 16px;
  }

  @media (max-width: 768px) {
    padding: 10px;
    /* Aumentar área táctil en móviles */
    min-width: 44px;
    min-height: 44px;
  }
`;
