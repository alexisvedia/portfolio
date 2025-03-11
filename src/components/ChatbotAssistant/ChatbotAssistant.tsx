import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { HiSparkles } from "react-icons/hi2";

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
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

const starTwinkle = keyframes`
  0% {
    opacity: 0.7;
    transform: scale(1) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1.2) rotate(5deg);
  }
  100% {
    opacity: 0.7;
    transform: scale(1) rotate(0deg);
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

const ChatbotContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  bottom: ${props => props.isOpen ? '30px' : '20px'};
  right: ${props => props.isOpen ? '30px' : '20px'};
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  animation: ${floatAnimation} 6s ease-in-out infinite;
`;

const ChatbotButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(121, 40, 202, 0.4);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(121, 40, 202, 0.5);
  }
  
  &:before {
    content: '';
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    border-radius: 50%;
    background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
    z-index: -1;
    opacity: 0.6;
    animation: ${pulse} 3s ease-in-out infinite;
  }
`;

const ChatWindow = styled.div<{ isVisible: boolean }>`
  width: 320px;
  height: 400px;
  background: ${props => props.theme.colors.secondary};
  border-radius: 16px;
  margin-bottom: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${props => props.isVisible ? css`${fadeIn} 0.4s forwards` : css`${fadeOut} 0.3s forwards`};
  opacity: ${props => props.isVisible ? 1 : 0};
  transform-origin: bottom right;
  backdrop-filter: blur(10px);
`;

const ChatHeader = styled.div`
  padding: 16px;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top-left-radius: 16px;
  border-top-right-radius: 16px;
`;

const HeaderTitle = styled.h3`
  margin: 0;
  font-size: ${props => props.theme.fontSizes.lg};
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
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
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  gap: 10px;
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
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, ${props => props.theme.colors.primary}, ${props => props.theme.colors.accent});
  color: ${props => props.theme.colors.text};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    transform: scale(1.05);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

// AI Stars Icon Component
const AIStarsIcon: React.FC = () => {
  return (
    <HiSparkles size={22} />
  );
};

const StarContainer = styled.div`
  position: relative;
  width: 22px;
  height: 22px;
  margin-right: 8px;
`;

interface StarProps {
  delay: number;
  size: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

const Star = styled.div<StarProps>`
  position: absolute;
  width: ${props => props.size};
  height: ${props => props.size};
  top: ${props => props.top};
  left: ${props => props.left};
  right: ${props => props.right};
  bottom: ${props => props.bottom};
  background: white;
  clip-path: polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%);
  animation: ${starTwinkle} ${props => 2 + props.delay}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
`;

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
      }, 300); // Add a small delay to ensure animation completes
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
      {isOpen && (
        <ChatWindow isVisible={isOpen}>
          <ChatHeader>
            <HeaderTitle>
              <AIStarsIcon />
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
        </ChatWindow>
      )}
      
      <ChatbotButton onClick={toggleChat}>
        {!isOpen ? (
          <AIStarsIcon />
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 5L5 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 5L19 19" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </ChatbotButton>
    </ChatbotContainer>
  );
};

export default ChatbotAssistant;
