import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { sendMessageToN8N } from '../../services/n8nService';
import { useTheme } from '../../context/ThemeContext';
import TypewriterText from '../TypewriterText';
import { LuSparkles } from 'react-icons/lu';
import { flushSync } from 'react-dom';

// Animaciones
const pulse = keyframes`
  0% { transform: scale(0.95); opacity: 0.7; }
  50% { transform: scale(1.05); opacity: 1; }
  100% { transform: scale(0.95); opacity: 0.7; }
`;

// Nueva animación Apple-style para el input
// const slideUpSpring = keyframes`
//   0% {
//     opacity: 0;
//     transform: translateY(20px) scale(0.95);
//   }
//   100% {
//     opacity: 1;
//     transform: translateY(0) scale(1);
//   }
// `;

// Nueva variante con un pequeño overshoot tipo iOS
const slideUpSpringPunch = keyframes`
  0% { opacity: 0; transform: translateY(24px) scale(0.94); }
  60% { opacity: 1; transform: translateY(-6px) scale(1.02); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
`;



// Nueva animación para globos flotantes
const floatIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.8);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-5px) scale(1.05);
  }
  100% {
    opacity: 1;
    transform: translateY(0px) scale(1);
  }
`;

// removed unused gentleFloat keyframes

// Styled components
const FloatingInputContainer = styled.div<{ 
  $isExpanded: boolean; 
  $isDark: boolean;
  $isSidebarPresent?: boolean;
  $isSidebarCollapsed?: boolean;
  $hasText: boolean;
  $collapsed: boolean;
}>`
  position: fixed;
  bottom: 14px;
  left: ${({ $isSidebarPresent, $isSidebarCollapsed }) => {
    if (!$isSidebarPresent) return '50%';
    const sidebarWidth = $isSidebarCollapsed ? '80px' : '280px';
    return `calc(50% + ${sidebarWidth} / 2)`;
  }};
  transform: translateX(-50%);
  z-index: 10000;
  width: ${({ $isExpanded, $hasText }) => ($isExpanded || $hasText ? '450px' : '275px')};
  transition: transform 0.22s ease, width 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease, visibility 0s, scale 0.25s ease;
  pointer-events: auto;

  @media (max-width: 768px) {
    width: calc(100% - 32px);
    left: 16px;
    transform: none;
  }

  /* Cerrado y sin texto, la barra se guarda en el botón redondo (Launcher). */
  ${({ $collapsed }) => $collapsed && css`
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    scale: 0.92;
    /* Visible al instante al abrir (el foco del toque lo necesita); se oculta recién al terminar el fundido. */
    transition-delay: 0s, 0s, 0s, 0.25s, 0s;
  `}
  
  /* Subtle lift when closed and hovered */
  ${({ $isExpanded, $hasText }) => (!$isExpanded && !$hasText) && css`
    &:hover {
      transform: translateX(-50%) translateY(-4px);
    }
    @media (max-width: 768px) {
      &:hover { transform: translateY(-4px); }
    }
  `}
`;

// Botón redondo con el símbolo de IA: abre la barra del chat. Se esconde mientras el chat está abierto o tiene texto.
const Launcher = styled.button<{ $hidden: boolean }>`
  position: fixed;
  right: 16px;
  z-index: 10000;
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  padding: 0;
  border: 2px solid #0d0c0b;
  border-radius: 50%;
  background: #e63b3f;
  color: #efe6c8;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.35);
  cursor: pointer;
  transition: opacity 0.25s ease, visibility 0.25s, scale 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), translate 0.22s ease;

  svg {
    width: 26px;
    height: 26px;
  }
  &:hover {
    translate: 0 -3px;
  }
  &:focus-visible {
    outline: 2px solid #efe6c8;
    outline-offset: 3px;
  }
  ${({ $hidden }) => $hidden && css`
    opacity: 0;
    visibility: hidden;
    pointer-events: none;
    scale: 0.6;
  `}
`;

// Overlay fijo para blur y fondo negro/transparente - NO se mueve con sidebar
const FixedBlurOverlay = styled.div<{ 
  $isVisible: boolean;
  $isDark: boolean;
}>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9998;
  pointer-events: ${({ $isVisible }) => ($isVisible ? 'auto' : 'none')};
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  backdrop-filter: ${({ $isVisible }) => ($isVisible ? 'blur(6px)' : 'blur(0px)')};
  -webkit-backdrop-filter: ${({ $isVisible }) => ($isVisible ? 'blur(6px)' : 'blur(0px)')};
  transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background: ${({ $isVisible, $isDark }) => $isVisible 
    ? `linear-gradient(
        to top,
        ${$isDark ? 'rgba(0, 0, 0, 1)' : 'rgba(255, 255, 255, 0.98)'} 0%,
        ${$isDark ? 'rgba(0, 0, 0, 0.90)' : 'rgba(255, 255, 255, 0.85)'} 25%,
        ${$isDark ? 'rgba(0, 0, 0, 0.65)' : 'rgba(255, 255, 255, 0.58)'} 50%,
        ${$isDark ? 'rgba(0, 0, 0, 0.40)' : 'rgba(255, 255, 255, 0.34)'} 75%,
        transparent 100%
      )`
    : 'transparent'};
  will-change: opacity, backdrop-filter;
  overscroll-behavior: contain;
  touch-action: none;
`;

// Resplandor de colores que SÍ se mueve con el sidebar
const ColorGlowOverlay = styled.div<{ 
  $isVisible: boolean; 
  $isDark: boolean;
  $isSidebarPresent?: boolean;
  $isSidebarCollapsed?: boolean;
  $bottomInset?: number;
}>`
  position: fixed;
  top: 0;
  /* Ocupa siempre todo el ancho de la ventana */
  left: 0;
  right: 0;
  bottom: ${({ $bottomInset }) => ($bottomInset ? `${Math.max(0, $bottomInset)}px` : '0')};
  z-index: 9999;
  pointer-events: none;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  transition: opacity 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              visibility 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              bottom 0.25s ease-out;
  background: transparent;
  will-change: opacity, transform;

  @keyframes float {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-20px) scale(1.05); }
  }

  @keyframes colorShift {
    0%, 100% {
      filter: hue-rotate(0deg) brightness(1) saturate(1.2);
    }
    25% {
      filter: hue-rotate(15deg) brightness(1.1) saturate(1.4);
    }
    50% {
      filter: hue-rotate(-10deg) brightness(0.95) saturate(1.1);
    }
    75% {
      filter: hue-rotate(8deg) brightness(1.05) saturate(1.3);
    }
  }

  

  /* Resplandor principal */
  &::before {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    /* Extend below viewport to avoid gap when floating up */
    bottom: -48px;
    /* Lower the glow a bit */
    top: 64%;
    z-index: 2;
    opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
    animation: ${({ $isVisible }) => ($isVisible ? 'colorShift 10s ease-in-out infinite both, float 8s ease-in-out infinite' : 'none')};
    filter: blur(3px);
    transition: opacity 1.2s ease, transform 1.2s ease;
    pointer-events: none;
    will-change: opacity, transform;
    mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.65) 20%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.15) 65%, rgba(0,0,0,0) 90%);
    -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.65) 20%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.15) 65%, rgba(0,0,0,0) 90%);
    background:
      ${({ $isSidebarPresent, $isSidebarCollapsed }) => {
        const expanded = $isSidebarPresent && !$isSidebarCollapsed;
        const size1 = expanded ? '1400px 520px' : '950px 420px';
        const size2 = expanded ? '900px 380px' : '720px 320px';
        const leftFiller = expanded
          ? `, radial-gradient(ellipse 900px 380px at 0% 108%, rgba(59,130,246,0.10) 0%, transparent 70%)`
          : '';
        return `radial-gradient(ellipse ${size1} at 50% 100%, rgba(59,130,246,0.38) 0%, rgba(56,189,248,0.32) 35%, rgba(37,99,235,0.26) 60%, transparent 75%),
                radial-gradient(ellipse ${size2} at 28% 112%, rgba(14,165,233,0.26) 0%, transparent 70%),
                radial-gradient(ellipse ${size2} at 72% 112%, rgba(2,132,199,0.26) 0%, transparent 70%)${leftFiller}`;
      }};
    background-repeat: no-repeat;
    background-size: cover, cover, cover;
    background-position: 
      ${({ $isSidebarPresent, $isSidebarCollapsed }) => {
        const expanded = $isSidebarPresent && !$isSidebarCollapsed;
        const offset = expanded ? '140px' : '0px';
        const base = `calc(50% + ${offset}) 100%, calc(30% + ${offset}) 110%, calc(70% + ${offset}) 110%`;
        return expanded ? `${base}, 0% 110%` : base;
      }};
  }

  /* Resplandor secundario */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    /* Extend below viewport to avoid gap when floating up */
    bottom: -48px;
    /* Lower the secondary glow slightly more */
    top: 72%;
    z-index: 1;
    opacity: ${({ $isVisible }) => ($isVisible ? 0.7 : 0)};
    animation: ${({ $isVisible }) => ($isVisible ? 'colorShift 12s ease-in-out infinite reverse, float 10s ease-in-out infinite reverse' : 'none')};
    filter: blur(8px);
    transition: opacity 1.5s ease;
    pointer-events: none;
    will-change: opacity, transform;
    mask-image: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 25%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 75%);
    -webkit-mask-image: linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 25%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0) 75%);
    background:
      ${({ $isSidebarPresent, $isSidebarCollapsed }) => {
        const expanded = $isSidebarPresent && !$isSidebarCollapsed;
        const size1 = expanded ? '1100px 420px' : '800px 350px';
        const size2 = expanded ? '820px 300px' : '600px 250px';
        const leftFiller = expanded
          ? `, radial-gradient(ellipse 820px 300px at 0% 106%, rgba(99,102,241,0.08) 0%, transparent 60%)`
          : '';
        return `radial-gradient(ellipse ${size1} at 50% 100%, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.20) 40%, transparent 70%),
                radial-gradient(ellipse ${size2} at 35% 105%, rgba(168,85,247,0.18) 0%, transparent 60%),
                radial-gradient(ellipse ${size2} at 65% 105%, rgba(59,130,246,0.18) 0%, transparent 60%)${leftFiller}`;
      }};
    background-repeat: no-repeat;
    background-size: cover, cover, cover;
    background-position:
      ${({ $isSidebarPresent, $isSidebarCollapsed }) => {
        const expanded = $isSidebarPresent && !$isSidebarCollapsed;
        const offset = expanded ? '140px' : '0px';
        const base = `calc(50% + ${offset}) 100%, calc(35% + ${offset}) 105%, calc(65% + ${offset}) 105%`;
        return expanded ? `${base}, 0% 105%` : base;
      }};
  }
  
  /* Hover lift disabled per request */
`;

const InputWrapper = styled.div<{ $isExpanded: boolean; $isDark: boolean; $animate: boolean; $hasText: boolean }>`
  position: relative;
  display: flex;
  align-items: center;
  margin-top: 0; /* base for hover lift when closed */
  background: ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.88)')};
  border: ${({ $isDark }) => ($isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(0, 0, 0, 0.06)')};
  border-radius: 32px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: ${({ $isDark }) => $isDark ? '0 4px 20px rgba(0, 0, 0, 0.15), 0 1px 3px rgba(0, 0, 0, 0.1)' : '0 2px 12px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06)'};
  /* Transiciones base (entrada hover):
     - Interior (::after) 200ms
     - Placeholder 200ms (ver override en el componente)
     - Borde (ring) 250ms */
  transition: box-shadow 250ms cubic-bezier(0.4, 0, 0.2, 1),
              border-color 250ms cubic-bezier(0.4, 0, 0.2, 1),
              background-color 250ms cubic-bezier(0.4, 0, 0.2, 1),
              transform 220ms cubic-bezier(0.4, 0, 0.2, 1);
  will-change: box-shadow, border-color, background-color, transform;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    /* Neutral grayish accent instead of bluish */
    background: ${({ $isDark }) => 
      `radial-gradient(600px 300px at 50% 0%, ${$isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.06)'}, transparent)`
    };
    pointer-events: none;
    border-radius: 32px;
  }

  /* Subtle modern glow ring (disabled on hover below) */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 32px;
    pointer-events: none;
    opacity: 0;
    transition: opacity 420ms cubic-bezier(0.4, 0, 0.2, 1), filter 420ms cubic-bezier(0.4, 0, 0.2, 1);
    /* Subtle interior glow inspired by open chatbot colors (very low alpha) */
    background:
      radial-gradient(120% 180% at 50% 0%,
        ${({ $isDark }) => $isDark ? 'rgba(56,189,248,0.06)' : 'rgba(56,189,248,0.05)'} 0%,
        transparent 62%
      ),
      linear-gradient(135deg,
        ${({ $isDark }) => $isDark ? 'rgba(59,130,246,0.08)' : 'rgba(59,130,246,0.07)'} 0%,
        ${({ $isDark }) => $isDark ? 'rgba(14,165,233,0.06)' : 'rgba(14,165,233,0.05)'} 45%,
        ${({ $isDark }) => $isDark ? 'rgba(99,102,241,0.05)' : 'rgba(99,102,241,0.04)'} 100%
      );
    filter: blur(4px);
  }
  /* Estado inicial: oculto y ligeramente desplazado; se corrige al animar */
  opacity: ${({ $animate }) => ($animate ? 1 : 0)};
  transform: ${({ $animate }) => ($animate ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.94)')};
  /* Animación al aparecer el input (primer render) */
  animation: ${({ $animate }) => ($animate ? slideUpSpringPunch : 'none')} 2500ms cubic-bezier(0.22, 1, 0.36, 1);
  animation-fill-mode: both;

  /* Hover effect only when chat is closed */
  /* Keep interior hover effect, remove border glow; add subtle lift */
  ${({ $isExpanded, $isDark }) => !$isExpanded && css`
    &:hover {
      /* no border-color or external glow changes */
      --placeholder-opacity: ${$isDark ? 0.78 : 0.72};
    }
    &:hover::after { opacity: 0.85; filter: blur(6px); transition-duration: 460ms; }
    &:hover .placeholder-overlay { transition: opacity 420ms cubic-bezier(0.4, 0, 0.2, 1), color 420ms cubic-bezier(0.4, 0, 0.2, 1); }
  `}
`;

// Nuevo keyframe para el efecto shiny del placeholder
const shine = keyframes`
  from { background-position: -125% 0; }
  to { background-position: 125% 0; }
`;

const ChatInput = styled.textarea<{ $isDark: boolean; $isExpanded: boolean }>`
  flex: 1;
  padding: 16px 12px 16px 18px; /* restored left padding to pre-icon spacing */
  border: none;
  outline: none;
  background: transparent;
  font-size: 16px;
  line-height: 1.4;
  resize: none;
  overflow-y: hidden; /* control via JS until max rows */
  overflow-x: hidden; /* keep single-line look when collapsed */
  /* Hide scrollbars but keep scrollable when overflow-y becomes auto */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar { display: none; width: 0; height: 0; }
  &::-webkit-scrollbar-thumb { background: transparent; }
  height: auto; /* adjusted via JS */
  color: ${({ $isDark, $isExpanded }) => (
    $isExpanded ? ($isDark ? '#ffffff' : '#000000') : ($isDark ? '#ffffff' : 'rgba(30, 30, 30, 0.8)')
  )};
  cursor: ${({ $isExpanded }) => ($isExpanded ? 'text' : 'pointer')};
  position: relative;
  z-index: 1;
  
  &::placeholder {
    color: transparent; /* usamos el overlay para mantener color y tipografía */
    position: relative;
    z-index: 1;
  }

  &:focus {
    outline: none;
    color: ${({ $isDark }) => ($isDark ? '#ffffff' : '#000000')};
  }
`;

// Nuevo componente para el overlay del efecto shiny del placeholder
const ShinyPlaceholderOverlay = styled.div<{ $isDark: boolean; $hasValue: boolean; $isFocused: boolean; $isExpanded: boolean }>`
  position: absolute;
  top: 50%;
  left: 18px; /* align with restored input left padding */
  transform: translateY(-50%);
  pointer-events: none;
  font-size: 16px;
  font-family: inherit;
  white-space: nowrap;
  z-index: 0;
  opacity: ${({ $hasValue }) => ($hasValue ? 0 : 1)};
  /* Entrada hover (desde InputWrapper): 200ms; salida hover se controla desde InputWrapper:hover */
  transition: opacity 200ms cubic-bezier(0.4, 0, 0.2, 1), color 200ms cubic-bezier(0.4, 0, 0.2, 1);
  
  color: ${({ $isDark }) => ($isDark 
    ? 'rgba(255, 255, 255, var(--placeholder-opacity, 0.6))' 
    : 'rgba(30, 30, 30, var(--placeholder-opacity, 0.6))')};
  
  &::before {
    content: attr(data-text);
    position: absolute;
    inset: 0;
    background: linear-gradient(
      115deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0) calc(50% - 12% / 2),
      rgba(255, 255, 255, 0.8) 50%,
      rgba(255, 255, 255, 0) calc(50% + 12% / 2),
      rgba(255, 255, 255, 0) 100%
    );
    background-size: 225% 100%;
    background-repeat: no-repeat;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    filter: drop-shadow(0 0 0.2em rgba(255, 255, 255, 0.15));
    /* Mantener la dirección original del brillo (reverse) cuando corresponde */
    animation: ${({ $isFocused, $isExpanded }) => ($isFocused || $isExpanded) ? 'none' : css`${shine} 3.5s linear infinite reverse 5s`};
    will-change: background-position;
    transform: translateZ(0);
  }
`;

// Nueva animación especial para mensaje de bienvenida 
const welcomeEntrance = keyframes`
  0% {
    opacity: 0;
    transform: translateY(40px) scale(0.85) rotateY(-15deg);
    filter: blur(8px);
  }
  30% {
    opacity: 0.6;
    transform: translateY(15px) scale(0.95) rotateY(-5deg);
    filter: blur(4px);
  }
  60% {
    opacity: 0.9;
    transform: translateY(-8px) scale(1.02) rotateY(2deg);
    filter: blur(1px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1) rotateY(0deg);
    filter: blur(0px);
  }
`;

const SendButton = styled.button<{ $isDark: boolean; $isExpanded: boolean; $hasValue: boolean; disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-right: 8px; /* right edge spacing as requested */
  border: none;
  border-radius: 50%;
  /* Transparent background so the SVG circle defines the visual shape (avoids any ring) */
  background: transparent;
  color: inherit;
  cursor: ${({ $isExpanded, disabled }) => (!$isExpanded ? 'pointer' : (disabled ? 'not-allowed' : 'pointer'))};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: ${({ $isExpanded, disabled }) => ($isExpanded && disabled ? 0.5 : 1)};
  padding: 0;
  outline: none;
  -webkit-tap-highlight-color: transparent;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    transition: left 0.5s ease;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: radial-gradient(
      circle,
      ${({ $isDark }) => $isDark ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)'}
    );
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
  }

  /* No hover animations for send button */
  &:hover { }

  &:active:not(:disabled) {
    /* Remove press/click visual effect */
    transform: none;
    transition: none;
  }
  
  &:focus {
    outline: none;
    box-shadow: none;
  }

  &:focus-visible {
    outline: none;
    box-shadow: none;
  }
`;




// Nuevo contenedor para mensajes flotantes
const FloatingMessagesContainer = styled.div<{ 
  $isVisible: boolean; 
  $isDark: boolean;
  $isSidebarPresent?: boolean;
  $isSidebarCollapsed?: boolean;
  $inputBarHeight: number;
  $bottomInset: number;
}>`
  position: fixed;
  /* Keep messages above the input AND keyboard overlay on mobile */
  bottom: ${({ $inputBarHeight, $bottomInset }) => {
    const bar = Math.max(0, Math.min(200, Math.round($inputBarHeight || 0)));
    const inset = Math.max(14, Math.round($bottomInset || 14));
    return `${inset + bar}px`;
  }};
  left: ${({ $isSidebarPresent, $isSidebarCollapsed }) => {
    if (!$isSidebarPresent) return '50%';
    const sidebarWidth = $isSidebarCollapsed ? '80px' : '280px';
    return `calc(50% + ${sidebarWidth} / 2)`;
  }};
  transform: translateX(-50%);
  z-index: 9999;
  width: 450px;
  max-height: 400px;
  pointer-events: ${({ $isVisible }) => ($isVisible ? 'auto' : 'none')};
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  visibility: ${({ $isVisible }) => ($isVisible ? 'visible' : 'hidden')};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  @media (max-width: 768px) {
    width: calc(100% - 32px);
    left: 16px;
    transform: none;
  }
`;

const FloatingMessagesScrollContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  overflow-x: hidden;
  scroll-behavior: smooth;
  display: flex;
  flex-direction: column;
  gap: 16px;
  /* Aleja el contenido del fade superior para que el primer mensaje no se oculte al tope */
  padding: 28px 16px 16px;
  position: relative;
  touch-action: pan-y;

  /* Un pequeño margen extra para el primer mensaje */
  & > *:first-child {
    margin-top: 8px;
  }
  
  /* Fade-out superior un poco más amplio: 0 antes del borde, sin línea */
  mask-image: linear-gradient(
    to top,
    rgba(0,0,0,1) 78%,
    rgba(0,0,0,0.4) 90%,
    rgba(0,0,0,0.15) 96%,
    rgba(0,0,0,0) 99%,
    rgba(0,0,0,0) 100%
  );
  -webkit-mask-image: linear-gradient(
    to top,
    rgba(0,0,0,1) 78%,
    rgba(0,0,0,0.4) 90%,
    rgba(0,0,0,0.15) 96%,
    rgba(0,0,0,0) 99%,
    rgba(0,0,0,0) 100%
  );
  
  scrollbar-width: none;
  -ms-overflow-style: none;
  
  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
`;

// Textura de ruido para efecto acrílico tipo Windows 11


const MessageBubble = styled.div<{ $isUser: boolean; $isDark: boolean; $index: number }>`
  position: relative;
  max-width: 85%;
  padding: 12px 16px; /* unified inner padding for user and AI bubbles */
  border-radius: 24px;
  align-self: ${props => (props.$isUser ? 'flex-end' : 'flex-start')};
  /* Ensure long text/URLs wrap inside the bubble */
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: anywhere;
  
  /* Efecto translúcido para mensajes del usuario */
  background: ${({ $isUser, $isDark }) =>
    $isUser
      ? $isDark
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(255, 255, 255, 0.15)'
      : 'transparent'
  };
  
  /* Múltiples capas de glassmorphism */
  background-size: 200px 200px, 100%;
  background-repeat: repeat, no-repeat;
  
  /* Borde con efecto de cristal - MÁS VISIBLE */
  border: ${({ $isUser, $isDark }) =>
    $isUser
      ? $isDark
        ? '1px solid rgba(255, 255, 255, 0.1)'
        : '1px solid rgba(200, 200, 200, 0.4)'
      : 'transparent'
  };
  
  color: ${({ $isDark }) => ($isDark ? '#ffffff' : '#000000')};
  
  /* Backdrop filter solo para mensajes del usuario */
  backdrop-filter: ${({ $isUser }) => $isUser ? 'blur(20px) saturate(180%) brightness(110%)' : 'none'};
  -webkit-backdrop-filter: ${({ $isUser }) => $isUser ? 'blur(20px) saturate(180%) brightness(110%)' : 'none'};
  
  /* Sombras solo para mensajes del usuario */
  box-shadow: ${({ $isUser }) => $isUser ? `
    0 8px 32px rgba(0, 0, 0, 0.22),
    0 2px 8px rgba(0, 0, 0, 0.18),
    inset 0 1px 0 rgba(255, 255, 255, 0.25),
    inset 0 -1px 0 rgba(255, 255, 255, 0.15)
  ` : 'none'};

  /* Tipografía unificada */
  font-size: 14px;
  line-height: 1.5;
  font-family: ${({ theme }) => theme.fonts.body};

  /* Normalización del Markdown */
  & :where(p) {
    margin: 0;
    font-size: inherit;
    line-height: inherit;
    font-family: inherit;
    white-space: inherit;
    word-break: inherit;
    overflow-wrap: inherit;
  }
  & :where(p + p) {
    margin-top: 0.5em;
  }
  & :where(ul, ol, li, code, pre, strong, em, a) {
    font-size: inherit;
    line-height: inherit;
    font-family: inherit;
    white-space: inherit;
    word-break: inherit;
    overflow-wrap: inherit;
  }
  & :where(h1, h2, h3, h4, h5, h6) {
    font-size: 1em;
    line-height: inherit;
    font-weight: 600;
    margin: 0;
    white-space: inherit;
    word-break: inherit;
    overflow-wrap: inherit;
  }

  /* Mensajes del usuario: sin delay y animación más rápida */
  animation: ${({ $index, $isUser }) => 
    $isUser
      ? css`${floatIn} 0.3s ease-out`
      : ($index === 0
          ? css`${welcomeEntrance} 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)`
          : css`${floatIn} 0.5s ease-out`)
  };
  animation-delay: ${props => props.$isUser ? '0s' : (props.$index === 0 ? '0s' : `${props.$index * 0.1}s`)};
  animation-fill-mode: both;

  pointer-events: auto;

  /* Removemos el movimiento continuo (gentleFloat) en mensajes de la AI */
  ${({ $isUser, $index }) => !$isUser && $index !== 0 && css`
    animation: ${css`${floatIn} 0.5s ease-out`};
  `}

  ${({ $isUser, $index }) => !$isUser && $index === 0 && css`
    animation: ${css`${welcomeEntrance} 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)`};
  `}

  /* Pseudo-elemento para resplandor adicional en burbujas del usuario */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 24px;
    background: 'transparent';
    z-index: -1;
    opacity: 0.6;
  }

  /* Efecto de resplandor exterior para burbujas del usuario */
  &::after {
    content: '';
    position: absolute;
    inset: -2px;
    border-radius: 26px;
    background: 'transparent';
    z-index: -2;
    filter: blur(6px);
    opacity: 0.4;
  }
`;

const LoadingDot = styled.div<{ $delay: number }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0.6;
  animation: ${pulse} 1s infinite;
  animation-delay: ${props => props.$delay}s;
`;

// Actions row under AI messages (copy, etc.)
const MessageActions = styled.div<{ $isDark: boolean; $alignRight?: boolean }>`
  display: flex;
  gap: 8px;
  margin-top: 6px;
  justify-content: flex-start;
  opacity: 0.8;
  user-select: none;
`;

const IconButton = styled.button<{ $isDark: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  background: transparent;
  color: ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)')};
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.2s ease, transform 0.08s ease, opacity 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease, backdrop-filter 0.2s ease;
  opacity: 0.85;

  &:hover {
    opacity: 1;
    background: ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)')};
    backdrop-filter: blur(8px);
    box-shadow: 0 2px 8px ${({ $isDark }) => ($isDark ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)')};
  }
  &:active { transform: scale(0.96); }
  &:focus-visible { outline: 2px solid ${({ $isDark }) => ($isDark ? '#fff' : '#000')}; outline-offset: 2px; }
`;

// Tooltip style matched to TechSlider/Sidebar hover feel
const CopyButtonWrapper = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const IconSwap = styled.span<{ $copied: boolean }>`
  position: relative;
  width: 16px;
  height: 16px;
  display: inline-block;
`;

const SwapIcon = styled.span<{ $show: boolean }>`
  position: absolute;
  inset: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transform: ${({ $show }) => ($show ? 'scale(1) rotate(0deg)' : 'scale(0.8) rotate(-8deg)')};
  transition: opacity 180ms ease, transform 220ms cubic-bezier(0.25, 0.1, 0.25, 1);
  pointer-events: none;
`;

const ChatTooltip = styled.div<{ $isDark: boolean }>`
  position: absolute;
  top: 50%;
  left: calc(100% + 8px); /* to the right of the icon */
  transform: translateY(-50%) translateX(4px) scale(0.95);
  padding: 8px 12px;
  border-radius: 100px;
  font-size: 12px;
  white-space: nowrap;
  /* Stronger blur and slightly darker bg for legibility */
  background: ${({ $isDark }) => ($isDark ? 'rgba(20, 20, 25, 0.88)' : 'rgba(240, 240, 245, 0.88)')};
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  box-shadow: 0 8px 25px rgba(0, 0, 0, ${({ $isDark }) => ($isDark ? '0.4' : '0.15')});
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)')};
  opacity: 0;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
  z-index: 20000;
  color: ${({ $isDark }) => ($isDark ? '#ffffff' : '#000000')};
  text-shadow: 0 1px 1px rgba(0,0,0,0.25);

  ${CopyButtonWrapper}:hover & {
    opacity: 1;
    transform: translateY(-50%) translateX(0) scale(1);
    transition-delay: 300ms;
  }
`;

const TooltipSwap = styled.span`
  display: inline-grid;
  align-items: center;
  justify-items: center;
`;

const TooltipText = styled.span<{ $show: boolean }>`
  grid-area: 1 / 1;
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transform: ${({ $show }) => ($show ? 'translateY(0) scale(1)' : 'translateY(2px) scale(0.98)')};
  transition: opacity 160ms ease, transform 180ms cubic-bezier(0.25, 0.1, 0.25, 1);
  pointer-events: none;
`;


// Main component
interface ChatbotAssistantProps {
  initialDelay?: number;
  n8nServerReady?: boolean;
  isSidebarPresent?: boolean;
  isSidebarCollapsed?: boolean;
}

const ChatbotAssistant: React.FC<ChatbotAssistantProps> = ({ 
  initialDelay = 0, 
  isSidebarPresent = false, 
  isSidebarCollapsed = false,
  n8nServerReady: _n8nServerReady = false,
}) => { 
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenExpanded, setHasBeenExpanded] = useState(false);
  const { t, i18n } = useTranslation();
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';
  // Nuevo: estado para disparar animación inicial del input
  const [inputAnimated, setInputAnimated] = useState(false);

  // Chat state
  const getWelcomeMessage = useCallback(() => {
    const lang = (i18n?.language || 'es').toLowerCase();
    if (lang.startsWith('en')) {
      return `Hi, I’m Alexis Vedia’s assistant. Developed with n8n and powered by AI, I’m here to help.\n\nWould you like a tour of projects, to talk about the stack, or to explore ideas for your next step?`;
    }
    return `Hola, soy el asistente de Alexis Vedia. Desarrollado con n8n y potenciado por IA, estoy acá para ayudarte.\n\n¿Te muestro proyectos, hablamos del stack o exploramos ideas para tu próximo paso?`;
  }, [i18n?.language]);

  // Placeholder según idioma
  const getPlaceholder = useCallback(() => {
    const lang = (i18n?.language || 'es').toLowerCase();
    if (lang.startsWith('en')) return 'Tell me how I can help…';
    return 'Contame en qué te ayudo…';
  }, [i18n?.language]);

  const [messages, setMessages] = useState(() => [{ text: getWelcomeMessage(), isUser: false }]);
  const [inputValue, setInputValue] = useState('');
  const [inputFocused, setInputFocused] = useState(false);
  // Dynamic bottom inset to avoid white gap above iOS keyboard
  const [bottomInset, setBottomInset] = useState<number>(14);
  const [isTyping, setIsTyping] = useState(false);
  const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);
  // Lock page scroll when chat is expanded
  useEffect(() => {
    const htmlEl = document.documentElement;
    const prevHtmlOverflow = htmlEl.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    if (isExpanded) {
      htmlEl.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      // Clear any lock if already removed
      htmlEl.style.overflow = '';
      document.body.style.overflow = '';
    }
    return () => {
      htmlEl.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [isExpanded]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [completedIndexes, setCompletedIndexes] = useState<Set<number>>(() => new Set());
  const isEn = (i18n?.language || 'es').toLowerCase().startsWith('en');
  const collapsed = !isExpanded && !inputValue.trim() && !inputFocused;
  const copyLabel = t('tooltip.copy', isEn ? 'Copy' : 'Copiar');
  const copiedLabel = t('tooltip.copied', isEn ? 'Copied' : 'Copiado');

  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputBarRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [inputBarHeight, setInputBarHeight] = useState<number>(0);

  // Reserve space in the sidebar for the collapsed chat input bar so it doesn't overlap controls
  useLayoutEffect(() => {
    try {
      const root = document.documentElement;
      if (!root) return;
      if (!isExpanded) {
        const h = inputBarRef.current?.getBoundingClientRect().height || inputBarHeight || 0;
        const reserve = Math.round(h) + 14; // 14px = FloatingInputContainer bottom offset
        root.style.setProperty('--chatbar-offset-bottom', `${reserve}px`);
      } else {
        root.style.setProperty('--chatbar-offset-bottom', '0px');
      }
    } catch {/* no-op */}
  }, [isExpanded, inputBarHeight]);

  // Initialize visibility
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [initialDelay]);

  // Cuando el overlay sea visible, disparamos la animación del input con un pequeño delay
  useEffect(() => {
    if (!isVisible) return;
    const t = setTimeout(() => setInputAnimated(true), 0);
    return () => clearTimeout(t);
  }, [isVisible]);

  // Measure input bar height (initial and on resize)
  useEffect(() => {
    const measure = () => {
      const h = inputBarRef.current?.getBoundingClientRect().height || 0;
      setInputBarHeight(h);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Handle mobile keyboard gap using VisualViewport API where available
  useEffect(() => {
    const vv = (window as unknown as { visualViewport?: VisualViewport }).visualViewport;
    if (!vv) {
      setBottomInset(14);
      return;
    }
    const compute = () => {
      const overlay = Math.max(0, document.documentElement.clientHeight - (vv.height + vv.offsetTop));
      setBottomInset(14 + Math.round(overlay));
    };
    if (inputFocused || isExpanded) {
      compute();
      vv.addEventListener('resize', compute);
      vv.addEventListener('scroll', compute);
      return () => {
        vv.removeEventListener('resize', compute);
        vv.removeEventListener('scroll', compute);
      };
    } else {
      setBottomInset(14);
    }
  }, [inputFocused, isExpanded]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      const insideInput = containerRef.current?.contains(target);
      const insideMessages = messagesContainerRef.current?.contains(target);
      if (isExpanded && !insideInput && !insideMessages) {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = '';
    };
  }, [isExpanded]);

  // Close on ESC key when expanded
  useEffect(() => {
    if (!isExpanded) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsExpanded(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  // Reset welcome message when language changes
  useEffect(() => {
    const newWelcome = getWelcomeMessage();
    setMessages([{ text: newWelcome, isUser: false }]);
    setHasBeenExpanded(false);
    setIsTyping(false);
    setInputValue('');
    setAutoScrollEnabled(true);
  }, [i18n?.language, getWelcomeMessage]);

  // Auto scroll messages
  useEffect(() => {
    if (messagesEndRef.current && isExpanded && autoScrollEnabled) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isExpanded, autoScrollEnabled]);

  // Handle scroll detection to disable auto-scroll
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;
      
      // If user scrolls up, disable auto-scroll
      if (!isAtBottom) {
        setAutoScrollEnabled(false);
      } else {
        // If user scrolls back to bottom, re-enable auto-scroll
        setAutoScrollEnabled(true);
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [isExpanded]);

  // Smooth auto-scroll while content grows (e.g., typewriter)
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer || !isExpanded) return;

    let rafId: number | null = null;

    const scrollToBottom = () => {
      if (!autoScrollEnabled) return;
      // Scroll only if we're near the bottom or auto-scroll explicitly on
      scrollContainer.scrollTo({ top: scrollContainer.scrollHeight, behavior: 'smooth' });
    };

    const scheduleScroll = () => {
      if (rafId != null) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        scrollToBottom();
      });
    };

    const observer = new MutationObserver(() => {
      // Any change in messages (including text updates) triggers a scheduled scroll
      scheduleScroll();
    });

    observer.observe(scrollContainer, {
      childList: true,
      subtree: true,
      characterData: true,
    });

    return () => {
      observer.disconnect();
      if (rafId != null) cancelAnimationFrame(rafId);
    };
  }, [isExpanded, autoScrollEnabled]);

  // Focus and caret handling when expanded handled below
  
  // Helper: place caret at the end of current input value
  const placeCaretAtEnd = useCallback(() => {
    const el = inputRef.current;
    if (!el) return;
    const len = el.value.length;
    try {
      el.setSelectionRange(len, len);
    } catch {
      // no-op in unsupported environments
    }
    // ensure view is scrolled to the bottom of the textarea
    el.scrollTop = el.scrollHeight;
  }, []);

  // When expanding (opening) the chat, focus and move caret to the end
  useEffect(() => {
    if (!isExpanded) return;
    const id = window.setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        placeCaretAtEnd();
      }
    }, 300);
    return () => window.clearTimeout(id);
  }, [isExpanded, placeCaretAtEnd]);

  // Auto-resize input up to 4 rows, then enable internal scroll
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;

    // Reset height to compute new scrollHeight from content only
    el.style.height = '0px';

    const cs = window.getComputedStyle(el);
    const lineHeight = parseFloat(cs.lineHeight || '20');
    const paddingTop = parseFloat(cs.paddingTop || '0');
    const paddingBottom = parseFloat(cs.paddingBottom || '0');
    const borderTop = parseFloat(cs.borderTopWidth || '0');
    const borderBottom = parseFloat(cs.borderBottomWidth || '0');
    const maxRows = 4;
    const maxHeight = lineHeight * maxRows + paddingTop + paddingBottom + borderTop + borderBottom;
    const baseHeight = lineHeight + paddingTop + paddingBottom + borderTop + borderBottom; // 1 row

    const hasText = inputValue.trim().length > 0;
    // When collapsed: if no text, force single-row; if has text, preserve content height (up to max)
    if (!isExpanded) {
      if (!hasText) {
        el.style.height = `${baseHeight}px`;
        el.style.overflowY = 'hidden';
        el.style.overflowX = 'hidden';
        el.scrollTop = 0;
        el.scrollLeft = 0;
      } else {
        const scrollHCollapsed = el.scrollHeight;
        const newHCollapsed = Math.min(Math.max(scrollHCollapsed, baseHeight), maxHeight);
        el.style.height = `${newHCollapsed}px`;
        el.style.overflowY = 'hidden'; // no internal scroll when collapsed
        el.style.overflowX = 'hidden';
        // Keep the last typed line visible within the collapsed viewport
        // Bottom is scrollHeight - clientHeight; assigning scrollHeight clamps to bottom
        el.scrollTop = el.scrollHeight;
      }
      requestAnimationFrame(() => {
        const h = inputBarRef.current?.getBoundingClientRect().height || 0;
        setInputBarHeight(h);
      });
      return;
    }

    const scrollH = el.scrollHeight;
    const newH = Math.min(Math.max(scrollH, baseHeight), maxHeight);
    el.style.height = `${newH}px`;
    el.style.overflowY = scrollH > newH ? 'auto' : 'hidden';
    // While typing open, keep caret line visible at bottom
    el.scrollTop = el.scrollHeight;

    // After resizing textarea, re-measure the input bar height next frame
    requestAnimationFrame(() => {
      const h = inputBarRef.current?.getBoundingClientRect().height || 0;
      setInputBarHeight(h);
    });
  }, [inputValue, isExpanded]);

  // Handle input click
  const handleInputClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setHasBeenExpanded(true);
    }
  };

  // Handle send message
  const handleSendMessage = async () => {
    // Block sending while assistant is typing
    if (isTyping) return;
    if (!inputValue.trim()) return;

    const userMessage = inputValue;
    
    // Add user message immediately
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setInputValue('');
    // Smoothly nudge scroll to bottom right after DOM updates
    requestAnimationFrame(() => {
      const sc = scrollContainerRef.current;
      if (sc) sc.scrollTo({ top: sc.scrollHeight, behavior: 'smooth' });
    });
    
    // Re-enable auto-scroll when sending a new message
    setAutoScrollEnabled(true);
    
    setIsTyping(true);

    try {
      const response = await sendMessageToN8N(userMessage);
      setIsTyping(false);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      setIsTyping(false);
      
      setMessages(prev => [
        ...prev,
        {
          text: '❌ **Error de conexión**\n\nHubo un problema al comunicarse con el servidor. Por favor, intenta de nuevo en unos momentos.',
          isUser: false,
        },
      ]);
      inputRef.current?.focus();
    }
  };

  const handleCopyMessage = async (index: number, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (e) {
      console.error('No se pudo copiar al portapapeles', e);
    }
  };

  const markMessageComplete = (index: number) => {
    setCompletedIndexes(prev => {
      const next = new Set(prev);
      next.add(index);
      return next;
    });
  };

  // Handle key press (send on Enter, prevent newline)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isTyping) return; // do not send while assistant is responding
      handleSendMessage();
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay fijo para blur y fondo negro - NO se mueve con sidebar */}
      <FixedBlurOverlay 
        $isVisible={isExpanded || inputFocused} 
        $isDark={isDark}
        onWheel={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onTouchMove={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            setIsExpanded(false);
          }
        }}
      />
      
      {/* Resplandor de colores que SÍ se mueve con el sidebar */}
      <ColorGlowOverlay 
        $isVisible={isExpanded || inputFocused} 
        $isDark={isDark}
        $isSidebarPresent={isSidebarPresent}
        $isSidebarCollapsed={isSidebarCollapsed}
        $bottomInset={bottomInset}
      />

      {/* Mensajes flotantes independientes del contenedor */}
      <FloatingMessagesContainer 
        ref={messagesContainerRef}
        $isVisible={isExpanded}
        $isDark={isDark}
        $isSidebarPresent={isSidebarPresent}
        $isSidebarCollapsed={isSidebarCollapsed}
        $inputBarHeight={inputBarHeight}
        $bottomInset={bottomInset}
      >
        <FloatingMessagesScrollContainer ref={scrollContainerRef}>
          {!hasBeenExpanded ? (
            <MessageBubble $isUser={false} $isDark={isDark} $index={0}>
              <ReactMarkdown>{getWelcomeMessage()}</ReactMarkdown>
              <MessageActions $isDark={isDark}>
                <CopyButtonWrapper>
                  <IconButton
                    $isDark={isDark}
                    aria-label={t('Copiar respuesta')}
                    onClick={(e) => { e.stopPropagation(); handleCopyMessage(0, getWelcomeMessage()); }}
                  >
                    <IconSwap $copied={copiedIndex === 0}>
                      <SwapIcon $show={copiedIndex !== 0}> 
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="9" y="9" width="10" height="12" rx="2" stroke="currentColor" strokeWidth="1.6"/>
                          <rect x="5" y="3" width="10" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" opacity="0.7"/>
                        </svg>
                      </SwapIcon>
                      <SwapIcon $show={copiedIndex === 0}> 
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </SwapIcon>
                    </IconSwap>
                  </IconButton>
                  <ChatTooltip $isDark={isDark}>
                    <TooltipSwap>
                      <TooltipText $show={copiedIndex !== 0}>{copyLabel}</TooltipText>
                      <TooltipText $show={copiedIndex === 0}>{copiedLabel}</TooltipText>
                    </TooltipSwap>
                  </ChatTooltip>
                </CopyButtonWrapper>
              </MessageActions>
            </MessageBubble>
          ) : (
            <>
              {messages.map((message, index) => (
                <MessageBubble key={index} $isUser={message.isUser} $isDark={isDark} $index={index}>
                  {message.isUser ? (
                    message.text
                  ) : (
                    <>
                      <TypewriterText
                        text={message.text}
                        speed={10}
                        delay={index === 0 ? 700 : 50}
                        onComplete={() => markMessageComplete(index)}
                      />
                      {completedIndexes.has(index) && (
                        <MessageActions $isDark={isDark}>
                          <CopyButtonWrapper>
                            <IconButton
                              $isDark={isDark}
                              aria-label={t('Copiar respuesta')}
                              onClick={(e) => { e.stopPropagation(); handleCopyMessage(index, message.text); }}
                            >
                              <IconSwap $copied={copiedIndex === index}>
                                <SwapIcon $show={copiedIndex !== index}> 
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="9" y="9" width="10" height="12" rx="2" stroke="currentColor" strokeWidth="1.6"/>
                                    <rect x="5" y="3" width="10" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" opacity="0.7"/>
                                  </svg>
                                </SwapIcon>
                                <SwapIcon $show={copiedIndex === index}> 
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M5 12l4 4L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </SwapIcon>
                              </IconSwap>
                            </IconButton>
                            <ChatTooltip $isDark={isDark}>
                              <TooltipSwap>
                                <TooltipText $show={copiedIndex !== index}>{copyLabel}</TooltipText>
                                <TooltipText $show={copiedIndex === index}>{copiedLabel}</TooltipText>
                              </TooltipSwap>
                            </ChatTooltip>
                          </CopyButtonWrapper>
                        </MessageActions>
                      )}
                    </>
                  )}
                </MessageBubble>
              ))}
              {isTyping && (
                <MessageBubble $isUser={false} $isDark={isDark} $index={messages.length}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <LoadingDot key={i} $delay={delay} />
                    ))}
                  </div>
                </MessageBubble>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </FloatingMessagesScrollContainer>
      </FloatingMessagesContainer>
      
      <Launcher
        type="button"
        $hidden={!collapsed}
        style={{ bottom: `${bottomInset}px` }}
        onClick={() => {
          // Foco dentro del gesto del toque: iOS solo levanta el teclado así.
          flushSync(handleInputClick);
          inputRef.current?.focus();
        }}
        aria-label={isEn ? 'Open the AI chat' : 'Abrir el chat con IA'}
        aria-expanded={!collapsed}
      >
        <LuSparkles aria-hidden="true" />
      </Launcher>

      <FloatingInputContainer 
        ref={containerRef}
        $isExpanded={isExpanded} 
        $isDark={isDark}
        $isSidebarPresent={isSidebarPresent}
        $isSidebarCollapsed={isSidebarCollapsed}
        $hasText={!!inputValue.trim()}
        $collapsed={collapsed}
        style={{ bottom: `${bottomInset}px` }}
      >
        {/* Input Bar */}
        <InputWrapper 
          ref={inputBarRef}
          $isExpanded={isExpanded} 
          $isDark={isDark}
          $animate={inputAnimated}
          $hasText={!!inputValue.trim()}
          onClick={handleInputClick}
          style={{ cursor: isExpanded ? 'text' : 'pointer' }}
        >
          <ChatInput
            ref={inputRef}
            rows={1}
            placeholder={getPlaceholder()}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            onFocus={() => {
              setInputFocused(true);
              // On refocus, put caret after existing text for immediate continuation
              // Use rAF to run after focus settles
              requestAnimationFrame(placeCaretAtEnd);
            }}
            onBlur={() => setInputFocused(false)}
            onClick={(e) => {
              e.stopPropagation();
              if (!isExpanded) {
                handleInputClick();
              }
            }}
            $isDark={isDark}
            $isExpanded={isExpanded}
          />
          <ShinyPlaceholderOverlay
            className="placeholder-overlay"
            $isDark={isDark}
            $hasValue={!!inputValue}
            $isFocused={inputFocused}
            $isExpanded={isExpanded}
            data-text={getPlaceholder()}
          >
            {getPlaceholder()}
          </ShinyPlaceholderOverlay>
          <SendButton
            $isDark={isDark}
            $isExpanded={isExpanded}
            $hasValue={!!inputValue.trim()}
            onClick={(e) => {
              e.stopPropagation();
              if (isTyping) return; // guard at UI level too
              if (!isExpanded) {
                if (inputValue.trim()) {
                  setIsExpanded(true);
                  setHasBeenExpanded(true);
                  handleSendMessage();
                } else {
                  handleInputClick();
                }
                return;
              }
              handleSendMessage();
            }}
            disabled={isExpanded ? (!inputValue.trim() || isTyping) : isTyping}
            aria-label={t('Enviar mensaje')}
          >

<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{border: 'none', outline: 'none'}}>
  <circle cx="20" cy="20" r="16" fill={isDark ? '#ffffff' : '#000000'} stroke="none" strokeWidth="0"/>
  <path d="M20 26 V14" stroke={isDark ? '#000000' : '#ffffff'} strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke"/>
  <path d="M14 20 L20 14 L26 20" stroke={isDark ? '#000000' : '#ffffff'} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke"/>
</svg>

          </SendButton>
        </InputWrapper>
      </FloatingInputContainer>
    </>
  );
};

export default ChatbotAssistant;
