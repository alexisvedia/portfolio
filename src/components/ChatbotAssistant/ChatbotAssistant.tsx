import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { HiSparkles } from "react-icons/hi2";

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

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

const morphToButton = keyframes`
  0% {
    width: 320px;
    height: 400px;
    border-radius: 16px;
    opacity: 1;
  }
  80% {
    width: 48px;
    height: 48px;
    border-radius: 16px;
    opacity: 1;
  }
  100% {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    opacity: 1;
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

const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0px);
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

const ChatbotContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  animation: ${floatAnimation} 6s ease-in-out infinite;
`;

const ChatElement = styled.div<{ isOpen: boolean }>`
  width: ${props => props.isOpen ? '320px' : '48px'};
  height: ${props => props.isOpen ? '400px' : '48px'};
  border-radius: ${props => props.isOpen ? '16px' : '50%'};
  background: ${props => props.isOpen ? 'rgba(30, 30, 35, 0.7)' : 'rgba(255, 255, 255, 0.1)'};
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  animation: ${props => props.isOpen 
    ? css`${morphToChat} 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards` 
    : css`${morphToButton} 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards`};
  transform-origin: bottom right;
  
  /* Windows 11 Mica effect */
  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.15' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
    opacity: 0.02;
    border-radius: inherit;
    z-index: -1;
    pointer-events: none;
  }
`;

const ChatButton = styled.button<{ isOpen: boolean }>`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  border: none;
  background: transparent;
  position: absolute;
  top: 0;
  left: 0;
  z-index: ${props => props.isOpen ? '0' : '2'};
  opacity: ${props => props.isOpen ? '0' : '1'};
  transition: opacity 0.2s ease-out;
  
  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  
  &:before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    z-index: -1;
    opacity: ${props => props.isOpen ? '0' : '0.6'};
    animation: ${pulse} 3s ease-in-out infinite;
    pointer-events: none;
  }
  
  svg {
    display: flex;
  }
`;

const ChatContent = styled.div<{ isOpen: boolean }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  opacity: ${props => props.isOpen ? '1' : '0'};
  animation: ${props => props.isOpen 
    ? css`${fadeInContent} 0.4s forwards` 
    : css`${fadeOutContent} 0.2s forwards`};
  z-index: ${props => props.isOpen ? '2' : '0'};
  pointer-events: ${props => props.isOpen ? 'auto' : 'none'};
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
  backdrop-filter: blur(10px);
`;

const HeaderTitle = styled.h3`
  margin: 0;
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  
  svg {
    display: flex;
    vertical-align: middle;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.text};
  cursor: pointer;
  font-size: ${props => props.theme.fontSizes.lg};
  opacity: 0.8;
  transition: all 0.2s;
  
  &:hover {
    opacity: 1;
    transform: scale(1.1);
  }
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  
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
`;

const MessageBubble = styled.div<{ isUser?: boolean }>`
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 16px;
  background: ${props => props.isUser 
    ? `linear-gradient(135deg, ${props.theme.colors.primary}, ${props.theme.colors.accent})` 
    : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.theme.colors.text};
  align-self: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  animation: ${fadeIn} 0.3s forwards;
  font-size: ${props => props.theme.fontSizes.sm};
  line-height: 1.5;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const ChatInputContainer = styled.div`
  padding: 12px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  gap: 10px;
  background: rgba(20, 20, 25, 0.3);
  backdrop-filter: blur(10px);
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
`;

const SendButton = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
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
`;

// AI Stars Icon Component
const AIStarsIcon: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <span className={className} style={{ display: 'flex', alignItems: 'center' }}>
      <HiSparkles size={22} color="white" />
    </span>
  );
};

// Sample messages for demo
const initialMessages = [
  { text: "¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?", isUser: false },
];

interface ChatbotAssistantProps {
  initialDelay?: number;
}

const ChatbotAssistant: React.FC<ChatbotAssistantProps> = ({ initialDelay = 2000 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [visible, setVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { t } = useTranslation();
  
  // Show the chatbot after initial delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
    }, initialDelay);
    
    return () => clearTimeout(timer);
  }, [initialDelay]);
  
  // Auto scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Add click outside listener to close the chat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target as Node) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);
  
  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 400); // Adjusted delay to match animation time
    }
  }, [isOpen]);
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    
    // If opening, add a welcome message if chat is empty
    if (!isOpen && messages.length === 0) {
      setMessages([{ text: t("¡Hola! Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?"), isUser: false }]);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleSendMessage = () => {
    if (inputValue.trim()) {
      // Add user message
      setMessages([...messages, { text: inputValue, isUser: true }]);
      
      // Simulate assistant response (in a real app, this would call an API)
      setTimeout(() => {
        setMessages(prev => [
          ...prev, 
          { 
            text: "Gracias por tu mensaje. ¡Estoy aquí para ayudarte con lo que necesites!", 
            isUser: false 
          }
        ]);
      }, 1000);
      
      setInputValue('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };
  
  if (!visible) return null;
  
  return (
    <ChatbotContainer isOpen={isOpen} ref={chatbotRef}>
      <ChatElement isOpen={isOpen}>
        <ChatButton onClick={toggleChat} isOpen={isOpen}>
          <AIStarsIcon />
        </ChatButton>
        
        <ChatContent isOpen={isOpen}>
          <ChatHeader>
            <HeaderTitle>
              <AIStarsIcon className="header-icon" />
              {t("Asistente")}
            </HeaderTitle>
            <CloseButton onClick={toggleChat}>×</CloseButton>
          </ChatHeader>
          
          <ChatMessages>
            {messages.map((message, index) => (
              <MessageBubble key={index} isUser={message.isUser}>
                {message.text}
              </MessageBubble>
            ))}
            <div ref={messagesEndRef} />
          </ChatMessages>
          
          <ChatInputContainer>
            <ChatInput
              type="text"
              placeholder={t("Escribe un mensaje...")}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              ref={inputRef}
            />
            <SendButton onClick={handleSendMessage}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 2L11 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </SendButton>
          </ChatInputContainer>
        </ChatContent>
      </ChatElement>
    </ChatbotContainer>
  );
};

export default ChatbotAssistant;
