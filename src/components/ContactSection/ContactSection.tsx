import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';

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

const SuccessMessage = styled.div<{ $isDark: boolean }>`
  ${({ $isDark }) => glassStyle($isDark)}
  background: ${({ $isDark }) =>
    $isDark
      ? 'linear-gradient(rgba(30, 70, 40, 0.6), rgba(30, 70, 40, 0.6))'
      : 'linear-gradient(rgba(235, 255, 240, 0.6), rgba(235, 255, 240, 0.6))'};
  color: ${({ theme }) => theme.colors.success};
  padding: ${({ theme }) => theme.space.md};
  border-radius: 8px;
  text-align: center;
  margin-top: ${({ theme }) => theme.space.md};
`;

const ErrorMessage = styled.div<{ $isDark: boolean }>`
  ${({ $isDark }) => glassStyle($isDark)}
  background: ${({ $isDark }) =>
    $isDark
      ? 'linear-gradient(rgba(70, 30, 30, 0.6), rgba(70, 30, 30, 0.6))'
      : 'linear-gradient(rgba(255, 235, 235, 0.6), rgba(255, 235, 235, 0.6))'};
  color: ${({ theme }) => theme.colors.error};
  padding: ${({ theme }) => theme.space.md};
  border-radius: 8px;
  text-align: center;
  margin-top: ${({ theme }) => theme.space.md};
`;

const ContactSection: React.FC = () => {
  const { t } = useTranslation();
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    // Simulando el envío de formulario con un timeout
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    }, 1500);
  };

  return (
    <SectionContainer id="contact">
      <SectionTitle>{t('contact')}</SectionTitle>
      <ContactContent>
        <ContactText>{t('contactText')}</ContactText>
        <Form onSubmit={handleSubmit} $isDark={isDark}>
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
          <SubmitButton type="submit" disabled={status === 'submitting'} $isDark={isDark}>
            {status === 'submitting' ? t('sending') : t('send')}
          </SubmitButton>

          {status === 'success' && (
            <SuccessMessage $isDark={isDark}>{t('messageSent')}</SuccessMessage>
          )}

          {status === 'error' && <ErrorMessage $isDark={isDark}>{t('messageError')}</ErrorMessage>}
        </Form>
      </ContactContent>
    </SectionContainer>
  );
};

export default ContactSection;
