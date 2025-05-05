import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { HiSparkles } from 'react-icons/hi2';
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

// Componente de botón flotante simple
const ChatButton = styled.button<{ $isDark: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 9999;
  pointer-events: auto !important;

  ${({ $isDark }) => glassStyle($isDark)}

  &:hover {
    transform: translateZ(0) scale(1.05);
  }

  /* Efecto de pulso */
  &::before {
    content: '';
    position: absolute;
    top: -5px;
    left: -5px;
    right: -5px;
    bottom: -5px;
    border-radius: 50%;
    z-index: -1;
    background: ${({ $isDark }) => ($isDark ? 'rgba(200, 200, 200, 0.08)' : 'rgba(0, 0, 0, 0.05)')};
    animation: ${pulse} 2s infinite;
  }
`;

// Ventana de chat con efecto glass garantizado
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

  ${({ $isDark }) => glassStyle($isDark)}

  @media (max-width: 768px) {
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100vh;
    border-radius: 0;
  }
`;

const ChatHeader = styled.div<{ $isDark: boolean }>`
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid
    ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)')};

  ${({ $isDark }) => glassStyle($isDark)}
  background: ${({ $isDark }) => ($isDark ? 'rgba(25, 25, 35, 0.7)' : 'rgba(240, 240, 245, 0.7)')};
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overscroll-behavior: contain;

  /* Scrollbar mejorada */
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

  /* Aplicamos backdrop-filter solo a las burbujas */
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transform: translateZ(0);

  /* Estilos de markdown */
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

const ChatInputArea = styled.div<{ $isDark: boolean }>`
  padding: 16px;
  display: flex;
  gap: 10px;
  border-top: 1px solid
    ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)')};

  ${({ $isDark }) => glassStyle($isDark)}
  background: ${({ $isDark }) => ($isDark ? 'rgba(25, 25, 35, 0.7)' : 'rgba(240, 240, 245, 0.7)')};
`;

const ChatInput = styled.input<{ $isDark: boolean }>`
  flex: 1;
  padding: 12px 16px;
  border-radius: 24px;
  border: none;
  outline: none;
  font-size: 14px;

  background: ${({ $isDark }) => ($isDark ? 'rgba(40, 40, 45, 0.7)' : 'rgba(250, 250, 255, 0.7)')};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid
    ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)')};

  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  &:focus {
    box-shadow: 0 0 0 2px
      ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)')};
  }

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const SendButton = styled.button<{ $isDark: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ $isDark }) => ($isDark ? 'rgba(50, 50, 60, 0.8)' : 'rgba(50, 50, 60, 0.2)')};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid
    ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)')};

  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  &:hover {
    background: ${({ $isDark }) => ($isDark ? 'rgba(60, 60, 70, 0.9)' : 'rgba(60, 60, 70, 0.3)')};
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

// Componente principal
const ChatbotAssistant: React.FC<{ initialDelay?: number }> = ({ initialDelay = 500 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: '¡Hola! Soy tu AI Portfolio Assistant. ¿En qué puedo ayudarte hoy?', isUser: false },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { t } = useTranslation();
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';

  // Inicializar componente con retraso
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      initializeN8NServer(); // Precalentar el servicio
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [initialDelay]);

  // Scroll automático al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus en el input cuando se abre
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

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

  if (!isVisible) return null;

  return (
    <>
      {!isOpen ? (
        <ChatButton $isDark={isDark} onClick={() => setIsOpen(true)}>
          <HiSparkles size={24} />
        </ChatButton>
      ) : (
        <ChatWindow $isDark={isDark}>
          <ChatHeader $isDark={isDark}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <HiSparkles size={20} />
              <span style={{ fontWeight: 600 }}>{t('AI Portfolio Assistant')}</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              aria-label={t('Cerrar chat')}
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
            </button>
          </ChatHeader>

          <ChatMessages>
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
            <ChatInput
              type="text"
              placeholder={t('Escribe un mensaje...')}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
              ref={inputRef}
              $isDark={isDark}
            />
            <SendButton $isDark={isDark} onClick={handleSendMessage}>
              <svg
                width="18"
                height="18"
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
          </ChatInputArea>
        </ChatWindow>
      )}
    </>
  );
};

export default ChatbotAssistant;
