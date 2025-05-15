import React, { useState, useRef } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import emailjs from '@emailjs/browser';
import Toast, { ToastType } from '../Toast/Toast';
import confetti from 'canvas-confetti';
import Tooltip from '../Tooltip/Tooltip';

const SectionContainer = styled.section`
  padding: ${({ theme }) => theme.space['2xl']} 0;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  text-transform: uppercase;
  margin-bottom: 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  position: relative;
  font-family: ${({ theme }) => theme.fonts.body};
  width: auto;
`;

const ContactContent = styled.div`
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.space.lg};
`;

const ContactText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  text-align: center;
  margin-bottom: 0;
  color: ${({ theme }) => `${theme.colors.text}ee`};
  width: auto;
  max-width: 600px;
  padding: 0;

  a {
    color: inherit;
    text-decoration: underline;
    transition: opacity 0.2s ease;
    
    &:hover {
      opacity: 0.8;
    }
  }
`;

// Estilo glass unificado y reforzado que mantiene consistencia
const glassEffect = css`
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  will-change: backdrop-filter;
`;

const Form = styled.form<{ $isDark: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
  padding: 1.5rem 2.5rem 2.5rem;
  border-radius: 20px;
  transition: all 0.3s ease;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  background: transparent;
  backdrop-filter: blur(20px) saturate(150%);
  -webkit-backdrop-filter: blur(20px) saturate(150%);
  border: 1px solid
    ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.1)')};

  /* Textura granular superpuesta */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.03;
    pointer-events: none;
    background-image: url('/images/AcrylicTexture.png');
    background-repeat: repeat;
    mix-blend-mode: ${({ $isDark }) => ($isDark ? 'overlay' : 'multiply')};
  }

  @media (max-width: 768px) {
    padding: 0.5rem 0.5rem 1.5rem 0.5rem;
    border-radius: 0;
    background: none;
    border: none;
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    width: 100%;
    box-shadow: none;
    position: static;
    &::before {
      display: none;
    }
  }
`;

const FormDivider = styled.hr<{ $isDark: boolean }>`
  width: 100%;
  border: none;
  height: 1px;
  background-color: ${({ $isDark, theme }) =>
    $isDark ? theme.colors.border + '55' : theme.colors.border + '88'};
  margin-top: 0;
  margin-bottom: 0;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  align-items: center;
  width: 100%;
  max-width: 500px;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.md};
  margin-bottom: ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.text};
  width: 100%;
  box-sizing: border-box;
  padding-left: ${({ theme }) => theme.space.xs};
  text-align: left;
`;

const Input = styled.input<{ $isDark: boolean }>`
  padding: ${({ theme }) => `${theme.space.md} ${theme.space.lg}`};
  border-radius: 12px;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)')};
  ${glassEffect}
  background: ${({ $isDark }) => ($isDark ? 'rgba(40, 40, 45, 0.7)' : 'rgba(245, 245, 250, 0.75)')};

  &:focus {
    outline: none;
    border-color: ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)')};
    box-shadow: 0 0 0 2px
      ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)')};
  }
`;

const Textarea = styled.textarea<{ $isDark: boolean }>`
  padding: ${({ theme }) => `${theme.space.md} ${theme.space.lg}`};
  border-radius: 12px;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  resize: vertical;
  min-height: 120px;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;
  border: 1px solid ${({ $isDark }) => ($isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)')};
  ${glassEffect}
  background: ${({ $isDark }) => ($isDark ? 'rgba(40, 40, 45, 0.7)' : 'rgba(245, 245, 250, 0.75)')};

  &:focus {
    outline: none;
    border-color: ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)')};
    box-shadow: 0 0 0 2px
      ${({ $isDark }) => ($isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)')};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
`;

const SubmitButton = styled.button<{ $isDark: boolean }>`
  padding: 1rem 1.5rem;
  color: ${({ $isDark }) => ($isDark ? 'black !important' : 'white !important')};
  border: none;
  border-radius: 8px;
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  width: auto;
  background: ${({ $isDark }) => ($isDark ? 'white !important' : 'black !important')};

  &:disabled {
    background: ${({ $isDark }) =>
      $isDark ? 'rgba(200, 200, 205, 0.5) !important' : 'rgba(60, 60, 65, 0.5) !important'};
    color: ${({ $isDark }) =>
      $isDark ? 'rgba(0,0,0,0.4) !important' : 'rgba(255,255,255,0.4) !important'};
    cursor: not-allowed;
    transform: none;
  }
`;

const ContactSection: React.FC = () => {
  const { t } = useTranslation();
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';
  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);

  // Estados para el tooltip
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipText, setTooltipText] = useState(t('tooltip.copyEmail'));

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    message: '',
  });

  // Reemplazamos el estado de status con estados para el Toast
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    visible: boolean;
    message: string;
    type: ToastType;
  }>({
    visible: false,
    message: '',
    type: 'success',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const copyEmailToClipboard = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    const email = 'alexisleonelvedia@gmail.com';
    
    // Actualizar posición del tooltip
    if (emailRef.current) {
      const rect = emailRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top
      });
    }
    
    navigator.clipboard.writeText(email)
      .then(() => {
        // Mostrar mensaje de copiado exitoso
        setTooltipText(t('tooltip.copied'));
        setTooltipVisible(true);
        
        // Ocultar el tooltip después de 1.5 segundos
        setTimeout(() => {
          setTooltipVisible(false);
        }, 1500);
      })
      .catch(err => {
        console.error('No se pudo copiar al portapapeles', err);
      });
  };

  // Función para mostrar el tooltip con la instrucción
  const handleEmailMouseEnter = () => {
    if (emailRef.current) {
      const rect = emailRef.current.getBoundingClientRect();
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top
      });
    }
    setTooltipText(t('tooltip.copyEmail'));
    setTooltipVisible(true);
  };

  const handleEmailMouseLeave = () => {
    setTooltipVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      // Credenciales de EmailJS proporcionadas por el usuario
      const serviceId = 'service_srdurzn';
      const templateId = 'template_efoo7fz';
      const publicKey = 'CoI3CL1-8DQHvdStw';

      // Preparar los datos para enviar
      const templateParams = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        title: formData.title,
        time: new Date().toLocaleString(),
      };

      // Enviar el correo usando el método send
      const result = await emailjs.send(serviceId, templateId, templateParams, publicKey);

      console.log('SUCCESS!', result.text);
      setIsLoading(false);
      setFormData({ name: '', title: '', email: '', message: '' });

      // Mostrar Toast de éxito
      setToast({
        visible: true,
        message: t('messageSent'),
        type: 'success',
      });

      // ¡Lanzar confeti!
      confetti({
        particleCount: 150, // Más partículas
        spread: 90, // Mayor dispersión
        origin: { y: 0.6 }, // Origen un poco más abajo de la mitad
        colors: ['#bb0000', '#ffffff', '#00ff00'], // Colores (puedes personalizar)
      });
    } catch (error) {
      console.error('FAILED...', error);
      setIsLoading(false);

      // Mostrar Toast de error
      setToast({
        visible: true,
        message: t('messageError'),
        type: 'error',
      });
    }
  };

  // Función para cerrar el Toast
  const closeToast = () => {
    setToast(prev => ({ ...prev, visible: false }));
  };

  return (
    <SectionContainer id="contact">
      <ContactContent>
        <Form onSubmit={handleSubmit} $isDark={isDark} ref={formRef}>
          <SectionTitle>{t('contact')}</SectionTitle>
          <ContactText>
            {t('contactText').split('alexisleonelvedia@gmail.com').map((part, i) => {
              if (i === 0) {
                return (
                  <React.Fragment key={i}>
                    {part}
                    <a
                      ref={emailRef}
                      href="#"
                      onClick={copyEmailToClipboard}
                      onMouseEnter={handleEmailMouseEnter}
                      onMouseLeave={handleEmailMouseLeave}
                      style={{ cursor: 'pointer' }}
                    >
                      alexisleonelvedia@gmail.com
                    </a>
                  </React.Fragment>
                );
              }
              return part;
            })}
          </ContactText>
          <FormDivider $isDark={isDark} />
          <FormGroup>
            <Label htmlFor="name">{t('name')}</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              $isDark={isDark}
              placeholder={t('namePlaceholder', 'Ej: Steve Jobs')}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="title">{t('subject', 'Asunto')}</Label>
            <Input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              $isDark={isDark}
              placeholder={t('subjectPlaceholder', 'Ej: Consulta sobre proyecto')}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              $isDark={isDark}
              placeholder={t('emailPlaceholder', 'example@example.com')}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="message">{t('message')}</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              $isDark={isDark}
              placeholder={t('messagePlaceholder', 'Escribe un mensaje...')}
            />
          </FormGroup>
          <ButtonContainer>
            <SubmitButton type="submit" disabled={isLoading} $isDark={isDark}>
              {isLoading ? t('sending') : t('send')}
            </SubmitButton>
          </ButtonContainer>
        </Form>
      </ContactContent>

      {/* Componente Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.visible}
        onClose={closeToast}
        duration={5000}
      />

      {/* Tooltip para la copia del email */}
      <Tooltip 
        text={tooltipText}
        isVisible={tooltipVisible}
        position={tooltipPosition}
      />
    </SectionContainer>
  );
};

export default ContactSection;
