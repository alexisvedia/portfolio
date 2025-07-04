import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { HiSparkles } from 'react-icons/hi2';
import { FaTrash } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { sendMessageToN8N, initializeN8NServer } from '../../services/n8nService';
import { useTheme } from '../../context/ThemeContext';

// Animaciones
const pulse = keyframes`
  0% { transform: scale(0.95); opacity: 0.7; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.7; }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Nuevas animaciones para el botón con efecto de luz
const fadeInWithGlow = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.02);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

const rotateLightRing = keyframes`
  0% {
    opacity: 0;
    transform: rotate(0deg);
  }
  5% {
    opacity: 1;
  }
  95% {
    opacity: 1;
    transform: rotate(360deg);
  }
  100% {
    opacity: 0;
    transform: rotate(360deg);
  }
`;

const flashEffect = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
  100% {
    opacity: 0;
    transform: scale(1.2);
  }
`;

// Estilo glass unificado y reforzado que mantiene consistencia
const glassStyle = (isDark: boolean) => css`
  background: ${isDark ? 'rgba(30, 30, 35, 0.5)' : 'rgba(240, 240, 245, 0.5)'};
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border: 1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)'};
  box-shadow: 0 8px 32px rgba(0, 0, 0, ${isDark ? '0.3' : '0.1'});

  /* Refuerzo para mantener el efecto consistente */
  transform: translateZ(0);
  will-change: backdrop-filter;
`;

// Contenedor del botón con posición
const ChatButtonContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  pointer-events: auto !important;
`;

// Efecto de luz circular
const LightRing = styled.div<{ $isDark?: boolean }>`
  position: absolute;
  top: -3px;
  left: -3px;
  width: calc(100% + 6px);
  height: calc(100% + 6px);
  border-radius: 50%;
  opacity: 0;
  z-index: 1;
  background: ${({ $isDark }) => $isDark
    ? `conic-gradient(
      transparent 0deg,
      transparent 280deg,
      rgba(255, 255, 255, 0.4) 300deg,
      rgba(255, 255, 255, 0.8) 320deg,
      rgba(255, 255, 255, 0.9) 330deg,
      rgba(255, 255, 255, 0.8) 340deg,
      rgba(255, 255, 255, 0.4) 360deg,
      transparent 380deg
    )`
    : `conic-gradient(
      transparent 0deg,
      transparent 280deg,
      rgba(100, 100, 255, 0.3) 300deg,
      rgba(100, 100, 255, 0.6) 320deg,
      rgba(100, 100, 255, 0.7) 330deg,
      rgba(100, 100, 255, 0.6) 340deg,
      rgba(100, 100, 255, 0.3) 360deg,
      transparent 380deg
    )`
  };
  filter: blur(5px);
  animation: ${rotateLightRing} 0.4s linear 0s;
`;

// Destello final
const FlashEffect = styled.div<{ $isDark?: boolean }>`
  position: absolute;
  top: -6px;
  left: -6px;
  right: -6px;
  bottom: -6px;
  border-radius: 50%;
  background: ${({ $isDark }) => $isDark
    ? 'radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 60%)'
    : 'radial-gradient(circle, rgba(100, 100, 255, 0.15) 0%, transparent 60%)'
  };
  opacity: 0;
  z-index: 2;
  animation: ${flashEffect} 0.3s ease-out 0.4s;
`;

// Componente de botón con nuevas animaciones
const ChatButton = styled.button<{ $isDark: boolean; $isFirstAppearance: boolean }>`
  position: relative;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 3;
  opacity: 0;
  animation: ${props => props.$isFirstAppearance ? fadeInWithGlow : fadeIn} 1s ease-out forwards;
  pointer-events: auto !important;
  color: ${({ $isDark }) => ($isDark ? 'white' : 'white')};

  ${({ $isDark }) => glassStyle($isDark)}

  background: ${({ $isDark }) => ($isDark ? 'rgba(30, 30, 35, 0.5)' : 'rgba(40, 40, 45, 0.8)')};

  &:hover {
    background: ${({ $isDark }) => ($isDark ? 'rgba(35, 35, 40, 0.5)' : 'rgba(50, 50, 55, 0.8)')};
    transform: translateZ(0) scale(1.05);
  }
`;

// Ventana de chat con efecto acrylic de Microsoft Fluent Design
const ChatWindow = styled.div<{ $isDark: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  height: 500px;
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: ${fadeIn} 0.3s ease forwards;
  z-index: 9999;
  pointer-events: auto !important;

  /* Efecto Acrylic Material de Microsoft Fluent Design */
  background: ${({ $isDark }) =>
    $isDark
      ? 'linear-gradient(rgba(30, 30, 35, 0.6), rgba(30, 30, 35, 0.6))'
      : 'linear-gradient(rgba(240, 240, 245, 0.6), rgba(240, 240, 245, 0.6))'};
  backdrop-filter: blur(30px) saturate(125%);
  -webkit-backdrop-filter: blur(30px) saturate(125%);
  box-shadow: 0 8px 32px rgba(0, 0, 0, ${({ $isDark }) => ($isDark ? '0.4' : '0.2')});
  border: 1px solid
    ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)')};

  /* Textura granular superpuesta */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.02;
    pointer-events: none;
    background-image: url('/images/AcrylicTexture.png');
    background-repeat: repeat;
    mix-blend-mode: ${({ $isDark }) => ($isDark ? 'lighten' : 'darken')};
  }

  transform: translateZ(0);
  will-change: backdrop-filter;

  @media (max-width: 768px) {
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100dvh;
    border-radius: 0;
    display: flex;
    flex-direction: column;
    margin-top: 0;
    position: fixed;
    top: 0;
    left: 0;
  }
`;

// Cambios en el header para mobile
const ChatHeader = styled.div<{ $isDark: boolean }>`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1.5px solid
    ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.04)')};
  color: ${({ $isDark }) => ($isDark ? 'white' : 'inherit')};
  ${({ $isDark }) => glassStyle($isDark)}
  background: ${({ $isDark }) => ($isDark ? 'rgba(32, 32, 34, 0.7)' : 'rgba(240, 240, 245, 0.7)')};
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    padding: 25px 8px 20px 8px;
    min-height: unset;
    height: unset;
    max-height: unset;
    margin-top: env(safe-area-inset-top, 0);
    box-shadow: 0 1px 8px rgba(0, 0, 0, 0.04);
    border-bottom: none;
    background: ${({ $isDark }) =>
      $isDark
        ? 'linear-gradient(to bottom, rgba(32,32,34,0.95) 0%, rgba(32,32,34,0.7) 60%, rgba(32,32,34,0.0) 100%)'
        : 'linear-gradient(to bottom, rgba(240,240,245,0.95) 0%, rgba(240,240,245,0.7) 60%, rgba(240,240,245,0.0) 100%)'};
  }
`;

const ChatHeaderActions = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  position: relative;

  @media (max-width: 768px) {
    gap: 6px;
  }
`;

const IconButton = styled.button<{ $isDark?: boolean }>`
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  transition: background 0.2s ease;
  position: relative;
  color: ${({ $isDark }) => ($isDark ? 'white' : 'inherit')};

  &:hover {
    background: ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)')};
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    svg,
    i {
      transform: scale(1.05);
    }
  }
`;

// Tooltip como componente separado para evitar ser cortado por overflow:hidden
const Tooltip = styled.div<{ $isDark?: boolean; $isVisible: boolean }>`
  position: fixed;
  padding: 8px 12px;
  border-radius: 100px;
  font-size: 12px;
  white-space: nowrap;
  background: ${({ $isDark }) =>
    $isDark ? 'rgba(20, 20, 25, 0.65)' : 'rgba(240, 240, 245, 0.65)'};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  pointer-events: none;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transition: opacity 0.2s ease;
  z-index: 10000;
`;

// Mejorar el wrapper para efecto burbuja y sombra
const InputWrapper = styled.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
  background: ${({ theme }) => (theme.mode === 'dark' ? '#202022B' : 'rgba(240,240,245,0)')};
  border-radius: 24px;
  box-shadow: none;
  border: 1.5px solid
    ${({ theme }) => (theme.mode === 'dark' ? 'rgba(80,80,90,0)' : 'rgba(180,180,200,0)')};
  padding: 0;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
`;

const ChatInput = styled.input<{ $isDark: boolean }>`
  width: 100%;
  padding: 18px 52px 18px 20px;
  border-radius: 24px;
  border: none;
  outline: none;
  font-size: 18px;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  box-shadow: none;
  &::placeholder {
    color: ${({ $isDark }) => ($isDark ? 'rgba(200,200,210,0.7)' : 'rgba(80,80,90,0.5)')};
    opacity: 1;
  }
  &:focus {
    box-shadow: none;
    outline: none;
  }
`;

const SendButton = styled.button<{ $isDark: boolean }>`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ $isDark }) => ($isDark ? 'white' : '#222')};
  background: transparent;
  transition: background 0.15s;
  z-index: 2;
  &:hover,
  &:focus {
    background: ${({ $isDark }) => ($isDark ? 'rgba(60, 60, 65, 0.18)' : 'rgba(60, 60, 70, 0.12)')};
  }
`;

// Animación para los puntos de carga
const LoadingDot = styled.div<{ $delay: number }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.6;
  animation: ${pulse} 1s infinite;
  animation-delay: ${props => props.$delay}s;
`;

// Restaurar styled-component para ChatMessages
const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overscroll-behavior: contain;
  background: transparent;
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
  @media (max-width: 768px) {
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    overflow-y: auto;
    padding-top: 90px;
    padding-bottom: 80px;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: transparent;
  }
`;

// Restaurar styled-component para MessageBubble
const MessageBubble = styled.div<{ $isUser: boolean; $isDark: boolean }>`
  max-width: 85%;
  padding: 12px 16px;
  border-radius: 16px;
  align-self: ${props => (props.$isUser ? 'flex-end' : 'flex-start')};
  background: ${({ $isUser, $isDark }) =>
    $isUser
      ? $isDark
        ? 'rgba(50, 50, 60, 0.7)'
        : 'rgba(50, 50, 60, 0.2)'
      : $isDark
        ? 'rgba(40, 40, 45, 0.7)'
        : 'rgba(230, 230, 240, 0.7)'};
  border: 1px solid
    ${({ $isUser, $isDark }) =>
      $isUser
        ? $isDark
          ? 'rgba(255, 255, 255, 0.1)'
          : 'rgba(0, 0, 0, 0.05)'
        : $isDark
          ? 'rgba(255, 255, 255, 0.05)'
          : 'rgba(0, 0, 0, 0.03)'};
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transform: translateZ(0);
  p,
  ul,
  ol,
  li {
    margin: 0.5em 0;
    &:first-child {
      margin-top: 0;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
  code {
    background: ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.07)')};
    padding: 2px 4px;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.9em;
  }
`;

// Restaurar styled-component para ChatInputArea
const ChatInputArea = styled.div<{ $isDark: boolean }>`
  padding: 16px;
  border-top: 1px solid
    ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)')};
  ${({ $isDark }) => glassStyle($isDark)}
  background: ${({ $isDark }) => ($isDark ? 'rgba(32, 32, 34, 0.7)' : 'rgba(240, 240, 245, 0.7)')};
  @media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    padding: 12px 8px 12px 8px;
    min-height: 64px;
    height: 64px;
    box-shadow: 0 -1px 8px rgba(0, 0, 0, 0.04);
  }
`;

// Componente principal
const ChatbotAssistant: React.FC<{ initialDelay?: number }> = ({ initialDelay = 500 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFirstAppearance, setIsFirstAppearance] = useState(true);
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';

  // Estado para los tooltips
  const [tooltipText, setTooltipText] = useState('');
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipVisible, setTooltipVisible] = useState(false);

  // Mensaje de bienvenida en un ref para comparar cambios
  const welcomeMessageKey = '¡Hola! Soy tu AI Portfolio Assistant. ¿En qué puedo ayudarte hoy?';

  // Inicializar los mensajes con el texto traducido
  const [messages, setMessages] = useState(() => [{ text: t(welcomeMessageKey), isUser: false }]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);
  const prevLangRef = useRef(currentLanguage);

  // Actualizar UI cuando cambia el idioma
  useEffect(() => {
    // Solo ejecutar si realmente cambió el idioma
    if (prevLangRef.current !== currentLanguage) {
      // Guardar el nuevo idioma como referencia
      prevLangRef.current = currentLanguage;

      // Actualizar el primer mensaje si es un mensaje del sistema
      setMessages(prev => {
        const newMessages = [...prev];
        if (newMessages.length > 0 && !newMessages[0].isUser) {
          newMessages[0] = {
            ...newMessages[0],
            text: t(welcomeMessageKey),
          };
        }
        return newMessages;
      });
    }
  }, [currentLanguage, t, welcomeMessageKey]);

  // Inicializar componente con retraso
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      initializeN8NServer(); // Precalentar el servicio
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [initialDelay]);

  // Cerrar el chat cuando se hace clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && chatWindowRef.current && !chatWindowRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    // Cerrar el chat cuando se presiona ESC
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isOpen && e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  // Scroll automático al final cuando hay nuevos mensajes o se abre el chat
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Focus en el input cuando se abre
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  // Limpiar el chat (usando el idioma actual)
  const handleClearChat = useCallback(() => {
    setMessages([{ text: t(welcomeMessageKey), isUser: false }]);
  }, [t, welcomeMessageKey]);

  // Manejo de mensajes
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    // Agregar mensaje del usuario
    setMessages(prev => [...prev, { text: inputValue, isUser: true }]);
    setInputValue('');
    setIsTyping(true);

    try {
      // Enviar mensaje al servicio
      const response = await sendMessageToN8N(inputValue);
      setIsTyping(false);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setIsTyping(false);

      setMessages(prev => [
        ...prev,
        {
          text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
          isUser: false,
        },
      ]);
    }
  };

  // Manejadores de tooltip
  const handleShowTooltip = (text: string, e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipText(text);
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setTooltipVisible(true);
  };

  const handleHideTooltip = () => {
    setTooltipVisible(false);
  };

  // Cerrar el chat y ocultar cualquier tooltip visible
  const handleCloseChat = () => {
    setIsOpen(false);
    setIsFirstAppearance(false); // Ya no será la primera aparición la próxima vez
    setTooltipVisible(false); // Asegurarse de que no quede ningún tooltip visible
  };

  // Prevenir scroll en el body cuando el chat está abierto en móvil
  useEffect(() => {
    const preventBodyScroll = () => {
      if (isOpen && window.innerWidth <= 768) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    };

    preventBodyScroll();
    window.addEventListener('resize', preventBodyScroll);

    return () => {
      window.removeEventListener('resize', preventBodyScroll);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Manejar clic en el área de mensajes para evitar cierre accidental
  const handleMessagesClick = (e: React.MouseEvent) => {
    // Prevenir la propagación del evento para evitar que active handleClickOutside
    e.stopPropagation();
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Tooltip global */}
      <Tooltip
        $isDark={isDark}
        $isVisible={tooltipVisible}
        style={{
          left: `${tooltipPosition.x}px`,
          top: `${tooltipPosition.y}px`,
          transform: 'translate(-50%, -100%)',
        }}
      >
        {tooltipText}
      </Tooltip>

      {!isOpen ? (
        <ChatButtonContainer>
          <ChatButton $isDark={isDark} $isFirstAppearance={isFirstAppearance} onClick={() => setIsOpen(true)}>
            {isFirstAppearance && (
              <>
                <LightRing $isDark={isDark} />
                <FlashEffect $isDark={isDark} />
              </>
            )}
            <HiSparkles size={24} />
          </ChatButton>
        </ChatButtonContainer>
      ) : (
        <ChatWindow $isDark={isDark} ref={chatWindowRef}>
          <ChatHeader $isDark={isDark}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <HiSparkles size={20} />
              <span style={{ fontWeight: 600 }}>{t('AI Portfolio Assistant')}</span>
            </div>
            <ChatHeaderActions>
              {/* Botón de limpiar chat */}
              <IconButton
                onClick={handleClearChat}
                $isDark={isDark}
                aria-label={t('Limpiar chat')}
                onMouseEnter={e => handleShowTooltip(t('Limpiar chat'), e)}
                onMouseLeave={handleHideTooltip}
              >
                <FaTrash size={16} />
              </IconButton>

              {/* Botón de cerrar */}
              <IconButton
                onClick={handleCloseChat}
                $isDark={isDark}
                aria-label={t('Cerrar chat')}
                onMouseEnter={e => handleShowTooltip(t('Cerrar chat'), e)}
                onMouseLeave={handleHideTooltip}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18"></path>
                  <path d="M6 6L18 18"></path>
                </svg>
              </IconButton>
            </ChatHeaderActions>
          </ChatHeader>

          <ChatMessages onClick={handleMessagesClick}>
            {messages.map((message, index) => (
              <MessageBubble key={index} $isUser={message.isUser} $isDark={isDark}>
                {message.isUser ? message.text : <ReactMarkdown>{message.text}</ReactMarkdown>}
              </MessageBubble>
            ))}

            {isTyping && (
              <MessageBubble $isUser={false} $isDark={isDark}>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <LoadingDot key={i} $delay={delay} />
                  ))}
                </div>
              </MessageBubble>
            )}

            <div ref={messagesEndRef} />
          </ChatMessages>

          <ChatInputArea $isDark={isDark}>
            <InputWrapper>
              <ChatInput
                type="text"
                placeholder={t('Escribe un mensaje...')}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                ref={inputRef}
                $isDark={isDark}
              />
              <SendButton
                $isDark={isDark}
                onClick={handleSendMessage}
                aria-label={t('Enviar mensaje')}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 2L11 13"></path>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                </svg>
              </SendButton>
            </InputWrapper>
          </ChatInputArea>
        </ChatWindow>
      )}
    </>
  );
};

export default ChatbotAssistant;
