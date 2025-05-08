import React, { useState, useRef } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import emailjs from '@emailjs/browser';
import Toast, { ToastType } from '../Toast/Toast';

const SectionContainer = styled.section`
  padding: ${({ theme }) => theme.space['2xl']} 0;
`;

const SectionTitle = styled.h2`
  font-size: 80px;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 3rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  position: relative;
  font-family: 'Morganite', sans-serif;
  letter-spacing: 0;
`;

const ContactContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.space.lg};
`;

const ContactText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space.xl};
  color: ${({ theme }) => `${theme.colors.text}ee`};
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

const Form = styled.form<{ $isDark: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
  padding: ${({ theme }) => theme.space.xl};
  border-radius: 16px;
  transition: all 0.3s ease;

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
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.fontSizes.md};
  margin-bottom: ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input<{ $isDark: boolean }>`
  padding: ${({ theme }) => theme.space.md};
  border-radius: 8px;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  transition: all 0.3s ease;

  ${({ $isDark }) => glassStyle($isDark)}
  background: ${({ $isDark }) => ($isDark ? 'rgba(20, 20, 25, 0.4)' : 'rgba(250, 250, 255, 0.4)')};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}33`};
  }
`;

const Textarea = styled.textarea<{ $isDark: boolean }>`
  padding: ${({ theme }) => theme.space.md};
  border-radius: 8px;
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.text};
  font-family: inherit;
  resize: vertical;
  min-height: 150px;
  transition: all 0.3s ease;

  ${({ $isDark }) => glassStyle($isDark)}
  background: ${({ $isDark }) => ($isDark ? 'rgba(20, 20, 25, 0.4)' : 'rgba(250, 250, 255, 0.4)')};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}33`};
  }
`;

const SubmitButton = styled.button<{ $isDark: boolean }>`
  padding: ${({ theme }) => `${theme.space.md} ${theme.space.xl}`};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${({ $isDark }) => glassStyle($isDark)}
  background: ${({ theme, $isDark }) =>
    $isDark
      ? `linear-gradient(rgba(40, 40, 45, 0.7), rgba(40, 40, 45, 0.7)), ${theme.colors.primary}`
      : `linear-gradient(rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.3)), ${theme.colors.primary}`};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  }

  &:disabled {
    background: ${({ $isDark }) =>
      $isDark ? 'rgba(60, 60, 65, 0.5)' : 'rgba(200, 200, 205, 0.5)'};
    cursor: not-allowed;
    transform: none;
  }
`;

const ContactSection: React.FC = () => {
  const { t } = useTranslation();
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';
  const formRef = useRef<HTMLFormElement>(null);

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
      <SectionTitle>{t('contact')}</SectionTitle>
      <ContactContent>
        <ContactText>{t('contactText')}</ContactText>
        <Form onSubmit={handleSubmit} $isDark={isDark} ref={formRef}>
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
          <SubmitButton type="submit" disabled={isLoading} $isDark={isDark}>
            {isLoading ? t('sending') : t('send')}
          </SubmitButton>
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
    </SectionContainer>
  );
};

export default ContactSection;
