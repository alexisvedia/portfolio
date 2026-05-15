import React, { useState, useRef, forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../context/ThemeContext';
import confetti from 'canvas-confetti';
import Tooltip from '../Tooltip';

const SectionContainer = styled.section`
  /* Keep current top spacing, slightly increased bottom spacing (reduced) */
  padding: ${({ theme }) => theme.space['2xl']} 0;
  padding-bottom: ${({ theme }) => theme.space['2xl']};
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.space.xl} ${({ theme }) => theme.space.md};
    padding-bottom: ${({ theme }) => theme.space.xl};
  }
  
  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.space.lg} ${({ theme }) => theme.space.sm};
    padding-bottom: ${({ theme }) => theme.space.lg};
  }
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

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const ContactContent = styled.div`
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.space.lg};
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 0 ${({ theme }) => theme.space.md};
  }
  
  @media (max-width: 480px) {
    padding: 0 ${({ theme }) => theme.space.sm};
  }
`;

const ContactText = styled.p`
  font-size: 1.2rem;
  text-align: left;
  margin-bottom: 0;
  color: ${({ theme }) => `${theme.colors.text}ee`};
  width: auto;
  max-width: 600px;
  padding: 0;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }

  a {
    color: inherit;
    text-decoration: underline;
    transition: opacity 0.2s ease;
    
    &:hover {
      opacity: 0.8;
    }
  }
`;


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
  padding: 3rem 2rem;
  border-radius: 24px;
  transition: all 0.3s ease;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(600px 300px at 50% 0%, rgba(56, 189, 248, 0.1), transparent);
    pointer-events: none;
  }

  @media (max-width: 768px) {
    padding: 0;
    border-radius: 0;
    min-height: auto;
    background: none;
    backdrop-filter: none;
    border: none;
    box-shadow: none;

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

  @media (max-width: 768px) {
    background: transparent;
  }

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

  @media (max-width: 768px) {
    background: transparent;
  }

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

  @media (max-width: 768px) {
    justify-content: center;
  }
`;

const SubmitButton = styled.button<{ $isDark: boolean }>`
  position: relative;
  padding: 14px 28px;
  border: none;
  border-radius: 9999px;
  background: ${({ $isDark }) => ($isDark ? '#ffffff' : '#000000')};
  color: ${({ $isDark }) => ($isDark ? '#000000' : '#ffffff')};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: 600;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: auto;

  @media (max-width: 768px) {
    width: 100%;
    max-width: 340px;
  }
  
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
    pointer-events: none;
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
      ${({ $isDark }) => ($isDark ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.05)')}
    );
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: none;
  }

  &:hover:not(:disabled) {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    background: ${({ $isDark }) => ($isDark ? '#f8f8f8' : '#333333')};

    &::before {
      left: 100%;
    }

    &::after {
      width: 300px;
      height: 300px;
    }
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    transition: all 0.1s ease;
  }

  &:focus-visible {
    outline: 2px solid ${props => props.$isDark ? '#ffffff' : '#000000'};
    outline-offset: 2px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;


interface ContactSectionProps {
  id?: string;
}

const ContactSection = forwardRef<HTMLDivElement, ContactSectionProps>(({ id }, ref) => {
  const { t } = useTranslation();
  const { themeMode } = useTheme();
  const isDark = themeMode === 'dark';
  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    title: '',
    email: '',
    message: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [emailCopied, setEmailCopied] = useState(false);

  const copyEmailToClipboard = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const email = 'alexisleonelvedia@gmail.com';
    navigator.clipboard.writeText(email)
      .then(() => {
        setEmailCopied(true);
        setTimeout(() => setEmailCopied(false), 2000);
      })
      .catch(err => {
        console.error('No se pudo copiar al portapapeles', err);
      });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const response = await fetch(
        'https://n8n-fly-misty-resonance-9294.fly.dev/webhook/contact-form',
        {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.title,
          message: formData.message,
        }),
      },
      );

      if (!response.ok) {
        throw new Error(`Webhook responded ${response.status}`);
      }

      setIsLoading(false);
      setFormData({ name: '', title: '', email: '', message: '' });

      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#bb0000', '#ffffff', '#00ff00'],
      });
    } catch (error) {
      console.error('FAILED...', error);
      setIsLoading(false);
    }
  };



  return (
    <SectionContainer ref={ref} id={id}>
      <ContactContent>
        <Form onSubmit={handleSubmit} $isDark={isDark} ref={formRef}>
          <SectionTitle>{t('contact')}</SectionTitle>
          <ContactText>
            {t('contactText').split('alexisleonelvedia@gmail.com').map((part, i) => {
              if (i === 0) {
                return (
                  <React.Fragment key={i}>
                    {part}
                    <Tooltip content={emailCopied ? t('tooltip.copied') : t('tooltip.copyEmail')}>
                      <a
                        ref={emailRef}
                        href="#"
                        onClick={copyEmailToClipboard}
                        style={{ cursor: 'pointer' }}
                      >
                        alexisleonelvedia@gmail.com
                      </a>
                    </Tooltip>
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
            <SubmitButton
              type="submit"
              disabled={isLoading}
              $isDark={isDark}
            >
              {isLoading ? t('sending') : t('send')}
            </SubmitButton>
          </ButtonContainer>
        </Form>
      </ContactContent>


    </SectionContainer>
  );
});

export default ContactSection;
