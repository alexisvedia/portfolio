import React, { forwardRef, useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';
import { Brain, CodeXml, FileCode2, PenTool, LucideIcon } from 'lucide-react';
import LandingVideo from './LandingVideo';
import { TITLE_PATHS, TITLE_VIEWBOX } from './titlePaths';

gsap.registerPlugin(ScrollTrigger);

const A = '/assets/home';
const DESKTOP = '(min-width: 1024px)';
const CONTACT_WEBHOOK = 'https://n8n-fly-misty-resonance-9294.fly.dev/webhook/contact-form';

interface Service {
  key: 'ai' | 'front' | 'wp' | 'design';
  Icon: LucideIcon;
  tags: string[];
  to: string;
  media: { video?: string; image?: string; poster: string; loop?: boolean };
}

const SERVICES: Service[] = [
  {
    key: 'ai',
    Icon: Brain,
    tags: ['n8n', 'AI', 'Chatbots', 'Web Scraping'],
    to: '/otros',
    media: { video: `${A}/n8n.mp4`, poster: `${A}/n8n-poster.jpg` },
  },
  {
    key: 'front',
    Icon: CodeXml,
    tags: ['React', 'TypeScript', 'Node.js', 'API Rest'],
    to: '/fusionads',
    media: { video: `${A}/code.mp4`, poster: `${A}/code-poster.jpg` },
  },
  {
    key: 'wp',
    Icon: FileCode2,
    tags: ['WordPress', 'Plugins', 'Custom Themes', 'WooCommerce'],
    to: '/xcons',
    media: { video: `${A}/wordpress.mp4`, poster: `${A}/wordpress-poster.jpg` },
  },
  {
    key: 'design',
    Icon: PenTool,
    tags: ['User Research', 'Figma', 'RRSS', 'Prototyping'],
    to: '/bandit',
    media: { image: `${A}/design-figma.webp`, poster: `${A}/design-figma.webp` },
  },
];

/* Contact icons: position in %, size in px, depth drives parallax speed and blur. */
const FLOATERS = [
  { top: '6%', left: '-3%', size: 92, depth: 1, rotate: -14 },
  { top: '30%', left: '88%', size: 70, depth: 0.6, rotate: 12 },
  { top: '64%', left: '84%', size: 96, depth: 1.3, rotate: -8 },
  { top: '84%', left: '-6%', size: 150, depth: 1.7, rotate: 18 },
];

/* ---------- styles ---------- */

const Root = styled.div`
  position: relative;
  color: #fff;
  background: #000;
  font-family: var(--font-satoshi);
  overflow-x: clip;
  -webkit-font-smoothing: antialiased;

  /* body keeps a side gutter on small screens; the landing goes edge to edge. */
  @media (max-width: 1023px) {
    margin: 0 calc(50% - 50vw);
  }
`;

const Hero = styled.section`
  position: relative;
  min-height: 100svh;
  padding: 7.5rem 1.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  isolation: isolate;
  overflow: hidden;

  @media ${DESKTOP} {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    align-items: center;
    gap: 3rem;
    padding: 6rem clamp(2rem, 6vw, 6rem) 4rem;
  }
`;

const Topo = styled.div`
  position: absolute;
  inset: -15% 0 0;
  z-index: -2;
  background: url(${A}/topo.svg) center / 1200px auto repeat;
  will-change: transform;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 35%, #000 92%);
  }
`;

const TitleBlock = styled.div`
  text-align: center;
  will-change: transform;

  @media ${DESKTOP} {
    text-align: left;
  }
`;

const Title = styled.h1`
  margin: 0 auto;
  width: min(86vw, 27rem);

  svg {
    display: block;
    width: 100%;
    height: auto;
    overflow: visible;
  }

  path {
    fill: #fff;
    will-change: transform;
  }

  @media ${DESKTOP} {
    margin: 0;
    width: clamp(30rem, 40vw, 46rem);
  }
`;

const Roles = styled.p`
  margin: 1.25rem 0 0;
  font-size: clamp(1.05rem, 4.4vw, 1.25rem);
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.82);

  span {
    display: block;
  }

  @media ${DESKTOP} {
    font-size: clamp(1.25rem, 1.6vw, 1.6rem);
    margin-top: 2rem;
  }
`;

const ArchIn = styled.div`
  position: relative;
  width: min(25rem, 100%);
  margin-top: 3.5rem;

  @media ${DESKTOP} {
    width: min(34rem, 100%);
    margin: 0 auto;
    perspective: 1200px;
  }
`;

const ArchGlow = styled.div`
  position: absolute;
  inset: 4% -12% 10%;
  z-index: -1;
  border-radius: 50% 50% 30% 30%;
  background: radial-gradient(closest-side, rgba(255, 120, 10, 0.75), rgba(255, 90, 0, 0.25) 60%, transparent);
  filter: blur(40px);
  will-change: transform, opacity;
`;

const ArchFloat = styled.div`
  will-change: transform;
`;

const ArchTilt = styled.div`
  transform-style: preserve-3d;
  will-change: transform;
`;

const Arch = styled.div`
  position: relative;
  aspect-ratio: 400 / 430;
  border-radius: 999px 999px 0 0;
  overflow: hidden;
  background: #ff7a00;
  box-shadow: 0 30px 80px -20px rgba(255, 110, 0, 0.45);

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 40%;
    display: block;
    will-change: transform;
  }

  &::after {
    content: '';
    position: absolute;
    inset: auto 0 0;
    height: 18%;
    background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.55));
  }
`;

const Section = styled.section`
  position: relative;
  padding: 5rem 1.5rem 4rem;
  max-width: 76rem;
  margin: 0 auto;

  @media ${DESKTOP} {
    padding: 9rem clamp(2rem, 6vw, 6rem) 7rem;
  }
`;

const Lead = styled.p`
  font-size: clamp(1.05rem, 4.2vw, 1.2rem);
  line-height: 1.6;
  max-width: 54rem;

  @media ${DESKTOP} {
    font-size: clamp(1.75rem, 2.5vw, 2.6rem);
    line-height: 1.3;
    letter-spacing: -0.01em;
    margin: 0 auto;
    text-align: center;
  }
`;

const Word = styled.span`
  display: inline;
`;

const Features = styled.div`
  display: grid;
  gap: 3rem;
  margin-top: 2.75rem;

  @media ${DESKTOP} {
    grid-template-columns: 1fr 1fr;
    gap: 2.5rem;
    margin-top: 6rem;

    & > :nth-child(2) {
      margin-top: 6rem;
    }
  }
`;

const Media = styled.div`
  position: relative;
  border-radius: 1rem;
  overflow: hidden;
  aspect-ratio: 16 / 8;
  background: #111;
  transform: translateZ(0);

  video,
  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    will-change: transform;
  }
`;

const Card = styled.article`
  h3 {
    font-size: clamp(1.4rem, 6vw, 1.6rem);
    font-weight: 700;
    margin: 0.85rem 0 0.35rem;
  }

  p {
    color: rgba(255, 255, 255, 0.72);
    line-height: 1.6;
    font-size: 1.05rem;
  }

  @media ${DESKTOP} {
    ${Media} {
      aspect-ratio: 16 / 10;
      border-radius: 1.5rem;
    }

    h3 {
      font-size: 2rem;
      margin-top: 1.5rem;
    }

    p {
      font-size: 1.15rem;
      max-width: 32rem;
    }
  }
`;

const ServicesPanel = styled.section`
  position: relative;
  background: #222;
  border-radius: 2.5rem 2.5rem 0 0;
  padding: 3rem 1.5rem 3.5rem;
  will-change: transform;

  @media ${DESKTOP} {
    border-radius: 4rem 4rem 0 0;
    padding: 6rem clamp(2rem, 6vw, 6rem) 7rem;
  }
`;

const ServicesTitle = styled.h2`
  text-align: center;
  font-size: clamp(1.75rem, 7vw, 2rem);
  font-weight: 700;
  margin: 0 0 2rem;

  @media ${DESKTOP} {
    font-size: clamp(2.75rem, 4vw, 4rem);
    margin-bottom: 5rem;
  }
`;

const ServiceList = styled.div`
  max-width: 76rem;
  margin: 0 auto;
`;

const ServiceRow = styled.article`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 1.1rem;
  padding: 2.75rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.12);

  &:first-child {
    border-top: 0;
    padding-top: 0;
  }

  h3 {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-size: clamp(1.4rem, 6vw, 1.6rem);
    font-weight: 700;
    margin: 0;
  }

  p {
    color: rgba(255, 255, 255, 0.72);
    line-height: 1.6;
    font-size: 1.05rem;
  }

  @media ${DESKTOP} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
    grid-template-areas:
      'head media'
      'text media'
      'tags media'
      'cta media';
    grid-template-rows: auto auto auto 1fr;
    column-gap: 4rem;
    row-gap: 1.5rem;
    padding: 5rem 0;
    align-items: start;

    &:nth-child(even) {
      grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr);
      grid-template-areas:
        'media head'
        'media text'
        'media tags'
        'media cta';
    }

    h3 {
      grid-area: head;
      font-size: clamp(2rem, 2.8vw, 2.75rem);
    }

    p {
      grid-area: text;
      font-size: 1.2rem;
    }
  }
`;

const ServiceMedia = styled(Media)`
  aspect-ratio: 16 / 9.6;
  background: #161616;

  @media ${DESKTOP} {
    grid-area: media;
    border-radius: 1.5rem;
    align-self: center;
  }
`;

const Tags = styled.ul`
  list-style: none;
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin: 0.25rem 0 0;
  padding: 0 0.6rem;
  font-size: clamp(0.8rem, 3.6vw, 0.95rem);
  white-space: nowrap;
  flex-wrap: wrap;

  @media ${DESKTOP} {
    grid-area: tags;
    justify-content: flex-start;
    flex-wrap: wrap;
    gap: 0.6rem;
    padding: 0;

    li {
      padding: 0.45rem 1rem;
      border: 1px solid rgba(255, 255, 255, 0.16);
      border-radius: 999px;
    }
  }
`;

const pill = `
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 3.1rem;
  border-radius: 999px;
  font-size: 1.05rem;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.25s ease, border-color 0.25s ease, transform 0.25s ease;

  &:focus-visible {
    outline: 2px solid #ff8a1f;
    outline-offset: 3px;
  }
`;

const MoreLink = styled(Link)`
  ${pill}
  margin-top: 0.75rem;
  color: #fff;
  background: #333;
  border: 1px solid rgba(255, 255, 255, 0.22);

  &:hover {
    background: #3d3d3d;
    border-color: rgba(255, 255, 255, 0.4);
  }

  @media ${DESKTOP} {
    grid-area: cta;
    width: auto;
    justify-self: start;
    padding: 0 2.5rem;
    margin-top: 1rem;
  }
`;

const ContactWrap = styled.section`
  position: relative;
  padding: 5rem 1.5rem 7rem;
  overflow: hidden;
  isolation: isolate;
  background:
    radial-gradient(90% 45% at 100% 100%, rgba(255, 106, 20, 0.6), transparent 70%),
    radial-gradient(80% 40% at 0% 100%, rgba(118, 43, 196, 0.5), transparent 70%),
    #000;

  @media ${DESKTOP} {
    padding: 9rem 2rem 10rem;
  }
`;

const Floater = styled.div`
  position: absolute;
  z-index: -1;
  pointer-events: none;
  will-change: transform;

  img {
    display: block;
    width: 100%;
    height: auto;
    mix-blend-mode: screen;
    -webkit-mask-image: radial-gradient(closest-side, #000 72%, transparent);
    mask-image: radial-gradient(closest-side, #000 72%, transparent);
  }

  @media ${DESKTOP} {
    scale: 1.35;
  }
`;

const ContactInner = styled.div`
  max-width: 21rem;
  margin: 0 auto;

  @media (min-width: 480px) {
    max-width: 28rem;
  }

  @media ${DESKTOP} {
    max-width: 36rem;
  }
`;

const ContactTitle = styled.h2`
  text-align: center;
  font-size: clamp(1.75rem, 7vw, 2rem);
  font-weight: 700;
  margin: 0;

  @media ${DESKTOP} {
    font-size: clamp(2.75rem, 4vw, 4rem);
  }
`;

const ContactSub = styled.p`
  text-align: center;
  margin: 0.4rem 0 1.5rem;
  color: rgba(255, 255, 255, 0.85);
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.25);

  @media ${DESKTOP} {
    font-size: 1.2rem;
    margin-bottom: 2.5rem;
  }
`;

const Field = styled.div`
  display: grid;
  gap: 0.55rem;
  margin-bottom: 1.4rem;

  label {
    font-size: 1rem;
  }

  input,
  textarea {
    width: 100%;
    font: inherit;
    font-size: 1rem;
    color: #fff;
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 0.6rem;
    padding: 0.95rem 1.4rem;
    transition: border-color 0.2s ease, background-color 0.2s ease;
    backdrop-filter: blur(6px);

    &::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }

    &:focus {
      outline: none;
      border-color: #ff8a1f;
      background: rgba(0, 0, 0, 0.5);
    }
  }

  textarea {
    min-height: 7.5rem;
    resize: vertical;
  }
`;

const SubmitButton = styled.button`
  ${pill}
  border: 0;
  cursor: pointer;
  color: #000;
  background: #fff;
  margin-top: 0.5rem;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
  }

  &:disabled {
    opacity: 0.7;
    cursor: progress;
  }
`;

const Status = styled.p<{ $error: boolean }>`
  min-height: 1.5rem;
  margin-top: 1rem;
  text-align: center;
  color: ${({ $error }) => ($error ? '#ffb4a8' : '#c8ffd4')};
`;

/* ---------- pieces ---------- */

/* ALEXIS = first 6 outlines, VEDIA = last 5. Each line is clipped so letters rise from a mask. */
const TitleMark = ({ label }: { label: string }) => (
  <Title aria-label={label}>
    <svg viewBox={TITLE_VIEWBOX} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id="av-line-1">
          <rect x="-20" y="-20" width="440" height="125" />
        </clipPath>
        <clipPath id="av-line-2">
          <rect x="-20" y="93" width="440" height="125" />
        </clipPath>
      </defs>
      <g clipPath="url(#av-line-1)">
        {TITLE_PATHS.slice(0, 6).map((d, i) => (
          <path key={i} d={d} fillRule="evenodd" data-a="letter" />
        ))}
      </g>
      <g clipPath="url(#av-line-2)">
        {TITLE_PATHS.slice(6).map((d, i) => (
          <path key={i} d={d} fillRule="evenodd" data-a="letter" />
        ))}
      </g>
    </svg>
  </Title>
);

type FormState = { name: string; title: string; email: string; message: string };
const EMPTY_FORM: FormState = { name: '', title: '', email: '', message: '' };

const ContactForm = () => {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(CONTACT_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.title,
          message: form.message,
        }),
      });
      if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
      setForm(EMPTY_FORM);
      setStatus('sent');
      confetti({ particleCount: 140, spread: 90, origin: { y: 0.7 }, colors: ['#ff7a00', '#8b3dff', '#ffffff'] });
    } catch (error) {
      console.error('Contact form failed', error);
      setStatus('error');
    }
  };

  const fields: { name: keyof FormState; type: string; label: string; ph: string }[] = [
    { name: 'name', type: 'text', label: t('landing.name'), ph: t('landing.namePh') },
    { name: 'title', type: 'text', label: t('landing.subject'), ph: t('landing.subjectPh') },
    { name: 'email', type: 'email', label: t('landing.email'), ph: t('landing.emailPh') },
  ];

  return (
    <form onSubmit={onSubmit}>
      {fields.map(f => (
        <Field key={f.name} data-a="field">
          <label htmlFor={`contact-${f.name}`}>{f.label}</label>
          <input
            id={`contact-${f.name}`}
            name={f.name}
            type={f.type}
            value={form[f.name]}
            onChange={onChange}
            placeholder={f.ph}
            autoComplete={f.name === 'title' ? 'off' : f.name}
            required
          />
        </Field>
      ))}
      <Field data-a="field">
        <label htmlFor="contact-message">{t('landing.message')}</label>
        <textarea
          id="contact-message"
          name="message"
          value={form.message}
          onChange={onChange}
          placeholder={t('landing.messagePh')}
          required
        />
      </Field>
      <SubmitButton type="submit" disabled={status === 'sending'} data-a="field">
        {status === 'sending' ? t('landing.sending') : t('landing.send')}
      </SubmitButton>
      <Status role="status" aria-live="polite" $error={status === 'error'}>
        {status === 'sent' && t('landing.sent')}
        {status === 'error' && t('landing.error')}
      </Status>
    </form>
  );
};

/* ---------- animations ---------- */

const useLandingMotion = (root: React.RefObject<HTMLDivElement>) => {
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;

    const mm = gsap.matchMedia(el);
    mm.add(
      { desktop: DESKTOP, reduce: '(prefers-reduced-motion: reduce)' },
      context => {
        const { desktop, reduce } = context.conditions as { desktop: boolean; reduce: boolean };
        if (reduce) return;
        const q = gsap.utils.selector(el);
        const hero = q('[data-a=hero]')[0] as HTMLElement | undefined;

        // Entrance: one wave, everything done in ~1.2 s.
        gsap
          .timeline({ defaults: { ease: 'power3.out' } })
          .from(q('[data-a=letter]'), { y: 115, rotate: 8, transformOrigin: '0% 100%', duration: 0.95, stagger: 0.045 })
          .from(q('[data-a=role]'), { y: 18, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, 0.3)
          .from(q('[data-a=arch-in]'), { y: 90, scale: 0.9, autoAlpha: 0, duration: 1.15 }, 0.12)
          .from(q('[data-a=glow]'), { scale: 0.6, autoAlpha: 0, duration: 1.4 }, 0.3);

        // Hero depth on scroll: background, title and arch move at different speeds.
        const heroScrub = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
        gsap.to(q('[data-a=topo]'), { yPercent: 18, ease: 'none', scrollTrigger: heroScrub });
        gsap.to(q('[data-a=title]'), {
          yPercent: desktop ? -25 : -40,
          scale: 0.92,
          autoAlpha: 0.15,
          ease: 'none',
          scrollTrigger: heroScrub,
        });
        gsap.to(q('[data-a=arch-float]'), { y: desktop ? -60 : -30, ease: 'none', scrollTrigger: heroScrub });
        gsap.fromTo(
          q('[data-a=arch-media]'),
          { scale: 1.02 },
          { scale: 1.14, ease: 'none', scrollTrigger: heroScrub }
        );
        gsap.to(q('[data-a=glow]'), { scale: 1.25, opacity: 0.55, ease: 'none', scrollTrigger: heroScrub });

        // Lead paragraph lights up word by word.
        gsap.fromTo(
          q('[data-a=word]'),
          { opacity: 0.18 },
          {
            opacity: 1,
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: { trigger: q('[data-a=lead]')[0], start: 'top 85%', end: 'bottom 55%', scrub: true },
          }
        );

        q('[data-a=card]').forEach(card => {
          const media = card.querySelector('[data-a=media]');
          gsap.from(card, {
            y: 70,
            autoAlpha: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 88%' },
          });
          if (media) {
            gsap.fromTo(
              media,
              { yPercent: -7, scale: 1.18 },
              {
                yPercent: 7,
                scale: 1.18,
                ease: 'none',
                scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: true },
              }
            );
          }
        });

        const panel = q('[data-a=panel]')[0];
        gsap.from(panel, {
          y: 120,
          ease: 'none',
          scrollTrigger: { trigger: panel, start: 'top bottom', end: 'top 55%', scrub: true },
        });
        gsap.from(q('[data-a=services-title]'), {
          y: 30,
          autoAlpha: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: panel, start: 'top 75%' },
        });

        q('[data-a=service]').forEach(row => {
          const s = gsap.utils.selector(row);
          gsap
            .timeline({
              defaults: { ease: 'power3.out', duration: 0.8 },
              scrollTrigger: { trigger: row, start: 'top 80%' },
            })
            .from(s('[data-a=icon]'), { scale: 0, rotate: -120, duration: 0.7, ease: 'back.out(2)' })
            .from(s('[data-a=s-title]'), { x: -24, autoAlpha: 0 }, 0.05)
            .from(s('[data-a=s-text]'), { y: 20, autoAlpha: 0 }, 0.12)
            .from(
              s('[data-a=s-media]'),
              {
                y: 60,
                rotateX: 16,
                transformPerspective: 1100,
                transformOrigin: '50% 100%',
                autoAlpha: 0,
                duration: 1.1,
              },
              0.1
            )
            .from(s('[data-a=tag]'), { y: 12, autoAlpha: 0, stagger: 0.06, duration: 0.5 }, 0.35)
            .from(s('[data-a=cta]'), { y: 16, autoAlpha: 0, duration: 0.6 }, 0.45);

          const inner = s('[data-a=s-media] video, [data-a=s-media] img');
          gsap.fromTo(
            inner,
            { yPercent: -5, scale: 1.12 },
            {
              yPercent: 5,
              scale: 1.12,
              ease: 'none',
              scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          );
        });

        const contact = q('[data-a=contact]')[0];
        q('[data-a=floater]').forEach(f => {
          const depth = Number(f.dataset.depth) || 1;
          gsap.fromTo(
            f,
            { y: 140 * depth, rotate: -10 * depth },
            {
              y: -140 * depth,
              rotate: 10 * depth,
              ease: 'none',
              scrollTrigger: { trigger: contact, start: 'top bottom', end: 'bottom top', scrub: true },
            }
          );
          gsap.to(f.querySelector('img'), {
            y: -12,
            rotate: 4,
            duration: 2.6 + depth,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1,
          });
        });
        gsap.from(q('[data-a=contact-head]'), {
          y: 30,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: contact, start: 'top 75%' },
        });
        gsap.from(q('[data-a=field]'), {
          y: 24,
          autoAlpha: 0,
          duration: 0.6,
          stagger: 0.07,
          ease: 'power3.out',
          scrollTrigger: { trigger: q('form')[0], start: 'top 85%' },
        });

        // Desktop only: the arch leans towards the pointer.
        if (desktop && hero) {
          const tilt = q('[data-a=arch-tilt]')[0];
          const rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.8, ease: 'power3.out' });
          const ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.8, ease: 'power3.out' });
          const onMove = (e: PointerEvent) => {
            const r = hero.getBoundingClientRect();
            ry(((e.clientX - r.left) / r.width - 0.5) * 10);
            rx(-((e.clientY - r.top) / r.height - 0.5) * 8);
          };
          const onLeave = () => {
            rx(0);
            ry(0);
          };
          hero.addEventListener('pointermove', onMove);
          hero.addEventListener('pointerleave', onLeave);
          return () => {
            hero.removeEventListener('pointermove', onMove);
            hero.removeEventListener('pointerleave', onLeave);
          };
        }
      }
    );

    // Start positions depend on the web font metrics and image sizes.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);

    return () => {
      window.removeEventListener('load', refresh);
      mm.revert();
    };
  }, [root]);
};

/* ---------- page ---------- */

const Landing = forwardRef<HTMLElement>((_, contactRef) => {
  const { t } = useTranslation();
  const root = useRef<HTMLDivElement>(null);
  useLandingMotion(root);


  return (
    <Root ref={root}>
      <Hero id="home" data-a="hero">
        <Topo data-a="topo" aria-hidden="true" />
        <TitleBlock data-a="title">
          <TitleMark label={`${t('landing.firstName')} ${t('landing.lastName')}`} />
          <Roles>
            <span data-a="role">{t('landing.role1')}</span>
            <span data-a="role">{t('landing.role2')}</span>
          </Roles>
        </TitleBlock>
        <ArchIn data-a="arch-in">
          <ArchGlow data-a="glow" aria-hidden="true" />
          <ArchFloat data-a="arch-float">
            <ArchTilt data-a="arch-tilt">
              <Arch>
                <LandingVideo
                  data-a="arch-media"
                  src={`${A}/hero.mp4`}
                  poster={`${A}/hero-poster.jpg`}
                  label={t('landing.heroAlt')}
                  loop
                  preload="auto"
                />
              </Arch>
            </ArchTilt>
          </ArchFloat>
        </ArchIn>
      </Hero>

      <Section id="about">
        <Lead data-a="lead">
          {t('landing.lead')
            .split(' ')
            .map((w, i) => (
              <React.Fragment key={i}>
                <Word data-a="word">{w}</Word>{' '}
              </React.Fragment>
            ))}
        </Lead>
        <Features>
          <Card data-a="card">
            <Media>
              <LandingVideo
                data-a="media"
                src={`${A}/mobius.mp4`}
                poster={`${A}/mobius-poster.jpg`}
                label={t('landing.feature1Title')}
                loop
              />
            </Media>
            <h3>{t('landing.feature1Title')}</h3>
            <p>{t('landing.feature1Text')}</p>
          </Card>
          <Card data-a="card">
            <Media>
              <LandingVideo
                data-a="media"
                src={`${A}/coffee.mp4`}
                poster={`${A}/coffee-poster.jpg`}
                label={t('landing.feature2Title')}
                loop
              />
            </Media>
            <h3>{t('landing.feature2Title')}</h3>
            <p>{t('landing.feature2Text')}</p>
          </Card>
        </Features>
      </Section>

      <ServicesPanel id="services" data-a="panel">
        <ServicesTitle data-a="services-title">{t('landing.servicesTitle')}</ServicesTitle>
        {/* #experience keeps the sidebar "Proyectos" link alive: each service links to its case study. */}
        <ServiceList id="experience">
          {SERVICES.map(({ key, Icon, tags, to, media }) => (
            <ServiceRow key={key} data-a="service">
              <h3>
                <span data-a="icon" style={{ display: 'inline-flex' }}>
                  <Icon size={30} strokeWidth={1.8} aria-hidden="true" />
                </span>
                <span data-a="s-title">{t(`landing.${key}Title`)}</span>
              </h3>
              <p data-a="s-text">{t(`landing.${key}Text`)}</p>
              <ServiceMedia data-a="s-media">
                {media.video ? (
                  <LandingVideo src={media.video} poster={media.poster} label={t(`landing.${key}Alt`)} />
                ) : (
                  <img src={media.image} alt={t(`landing.${key}Alt`)} loading="lazy" decoding="async" />
                )}
              </ServiceMedia>
              <Tags>
                {tags.map(tag => (
                  <li key={tag} data-a="tag">
                    {tag}
                  </li>
                ))}
              </Tags>
              <MoreLink to={to} data-a="cta">
                {t('landing.learnMore')}
              </MoreLink>
            </ServiceRow>
          ))}
        </ServiceList>
      </ServicesPanel>

      <ContactWrap id="contact" ref={contactRef} data-a="contact">
        {FLOATERS.map((f, i) => (
          <Floater
            key={i}
            data-a="floater"
            data-depth={f.depth}
            aria-hidden="true"
            style={{
              top: f.top,
              left: f.left,
              width: f.size,
              filter: f.depth > 1.2 ? `blur(${(f.depth - 1) * 3}px)` : undefined,
            }}
          >
            <img src={`${A}/chart-icon.webp`} alt="" style={{ transform: `rotate(${f.rotate}deg)` }} />
          </Floater>
        ))}
        <ContactInner>
          <ContactTitle data-a="contact-head">{t('landing.contactTitle')}</ContactTitle>
          <ContactSub data-a="contact-head">{t('landing.contactSubtitle')}</ContactSub>
          <ContactForm />
        </ContactInner>
      </ContactWrap>
    </Root>
  );
});

Landing.displayName = 'Landing';

export default Landing;
