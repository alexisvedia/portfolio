import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import PosterGlobalOnce from './PosterGlobal';
import { Link } from 'react-router-dom';
import i18n from 'i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import ConstructedWord from './ConstructedWord';
import Portal from './Portal';
import DepthField from './DepthField';
import HalftonePortrait from './HalftonePortrait';
import Stitch from './Stitch';
import ServiceDeck, { CUBE } from './ServiceDeck';
import WorkGallery from './WorkGallery';
import CubiqStory from './CubiqStory';
import TeamVoice from './TeamVoice';
import { ContactForm } from '@/features/landing/Landing';
import { CONTACT, CUBIQ, FONT, HERO, INK, NAV, OTHERS, ROUTE_LEAD, STUDY, VOICES } from './content';
import jorge from '@/assets/images/testimonials/Jorge.jpeg';
import mauro from '@/assets/images/testimonials/Mauro.jpeg';
import milena from '@/assets/images/testimonials/Milena.jpeg';
import kodi from '@/assets/images/testimonials/Kodi.png';
import rutaArt from '@/assets/poster/ruta.webp';
import holaArt from '@/assets/poster/hola.webp';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

const PHOTOS: Record<string, string> = { jorge, mauro, milena, kodi };
/* Cada testimonio es un afiche de una tinta: fondo y texto con contraste AA. */
const VOICE_SKIN = [
  { '--q-bg': INK.violet, '--q-fg': INK.cream },
  { '--q-bg': INK.lime, '--q-fg': INK.ground },
  { '--q-bg': INK.orange, '--q-fg': INK.ground },
  { '--q-bg': INK.teal, '--q-fg': INK.cream },
];
const MOTION = '(prefers-reduced-motion: no-preference)';
const LOADER_KEY = 'poster-loader-seen';
const DISPLAY = FONT.display;
const TEXT = FONT.text;

/* El idioma de esta página es fijo: todo en español aunque el detector elija otro. */
const t = i18n.getFixedT('es');

const scrollToId = (id: string) => (e: React.MouseEvent) => {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  // El ancla nativa mueve el punto de partida del foco; con preventDefault hay que hacerlo a mano.
  if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '-1');
  el.focus({ preventScroll: true });
  history.replaceState(history.state, '', `#${id}`);
};

/* ---------- loader ---------- */

const Loader: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ onComplete: onDone });
      tl.fromTo(
        '[data-stroke]',
        { drawSVG: '0% 0%', autoAlpha: 0 },
        { drawSVG: '0% 100%', autoAlpha: 1, duration: 0.6, ease: 'power2.inOut', stagger: 0.09 }
      ).to(el, { clipPath: 'circle(0% at 50% 50%)', duration: 0.6, ease: 'power3.inOut' }, '+=0.12');
    }, el);
    return () => ctx.revert();
  }, [onDone]);

  return (
    <LoaderVeil ref={ref} aria-hidden="true">
      <ConstructedWord word="AV" cols={2} ink={INK.cream} accent={INK.red} />
    </LoaderVeil>
  );
};

/* ---------- motion ---------- */

const usePosterMotion = (root: React.RefObject<HTMLDivElement>, ready: boolean) => {
  const hero = useRef<gsap.core.Timeline | null>(null);
  // Si reduced motion cambia en la sesión, mm.add vuelve a correr después de que el loader terminó.
  const readyRef = useRef(ready);
  readyRef.current = ready;

  useLayoutEffect(() => {
    const scope = root.current;
    if (!scope) return;
    const mm = gsap.matchMedia(scope);

    mm.add(MOTION, ctx => {
      let alive = true;
      const q = gsap.utils.selector(scope);

      // Entrada del hero: una sola ola, por debajo de 1,2 s.
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });
      tl.fromTo(
        q('[data-hero-word] [data-stroke]'),
        { drawSVG: '0% 0%', autoAlpha: 0 },
        { drawSVG: '0% 100%', autoAlpha: 1, duration: 0.8, ease: 'power2.inOut', stagger: 0.08 }
      )
        .fromTo(q('[data-hero-name]'), { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.9 }, 0.05)
        .from(q('[data-hero-text] > *'), { autoAlpha: 0, y: 24, duration: 0.6, stagger: 0.07 }, 0.25)
        .from(q('[data-hero-portrait]'), { autoAlpha: 0, scale: 0.92, duration: 0.9 }, 0.15)
        .from(q('[data-nav]'), { autoAlpha: 0, y: -16, duration: 0.5 }, 0.3);
      hero.current = tl;
      if (readyRef.current) tl.play();

      // Cada palabra construida se dibuja con el scroll, trazo por trazo.
      q('[data-poster]').forEach(section => {
        const word = section.querySelector('[data-word]');
        if (!word) return;
        const rings = word.querySelectorAll('[data-ring]');
        const draw = gsap
          .timeline({ scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 10%', scrub: 0.6 } })
          .fromTo(
            word.querySelectorAll('[data-stroke]'),
            { drawSVG: '0% 0%', autoAlpha: 0 },
            { drawSVG: '0% 100%', autoAlpha: 1, ease: 'none', stagger: 0.12 }
          );
        if (rings.length) draw.from(rings, { scale: 0, transformOrigin: '50% 50%', ease: 'back.out(2)', stagger: 0.1 }, '-=0.3');
      });

      // Manifiesto: el texto se ilumina palabra por palabra.
      // SplitText instancia Intl.Segmenter al cargar: se importa aparte para que sin él no caiga todo el sitio.
      const splits = q('[data-split]');
      if (splits.length && 'Segmenter' in Intl) {
        import('gsap/SplitText').then(({ SplitText }) => {
          if (!alive) return;
          gsap.registerPlugin(SplitText);
          ctx.add(() =>
            splits.forEach(el => {
              // autoSplit vuelve a partir cuando cargan las fuentes o cambia el ancho.
              SplitText.create(el, {
                type: 'words',
                tag: 'span',
                aria: 'none',
                autoSplit: true,
                onSplit: self =>
                  gsap.fromTo(
                    self.words,
                    { opacity: 0.16 },
                    { opacity: 1, ease: 'none', stagger: 0.08, scrollTrigger: { trigger: el, start: 'top 75%', end: 'bottom 45%', scrub: true } }
                  ),
              });
            })
          );
        });
      }

      // Secciones que pisan a la anterior: la de atrás se achica y oscurece mientras la nueva sube.
      q('[data-overlap]').forEach(sec => {
        const prev = sec.previousElementSibling;
        if (!prev) return;
        gsap.fromTo(
          prev,
          { scale: 1, opacity: 1 },
          { scale: 0.9, opacity: 0.35, ease: 'none', transformOrigin: '50% 100%', scrollTrigger: { trigger: sec, start: 'clamp(top bottom)', end: 'top top', scrub: true } }
        );
      });

      // Bloques de texto: entran con un desplazamiento corto. Solo opacity (no autoAlpha) para que sigan enfocables.
      const reveal = q('[data-reveal]');
      gsap.set(reveal, { opacity: 0, y: 28 });
      ScrollTrigger.batch(reveal, {
        start: 'top 88%',
        once: true,
        onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.07 }),
      });

      return () => {
        alive = false;
        hero.current = null;
      };
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => mm.revert();
  }, [root]);

  useEffect(() => {
    if (!ready) return;
    hero.current?.play();
    ScrollTrigger.refresh();
  }, [ready]);
};

/* ---------- secciones ---------- */

interface PosterProps {
  id: string;
  label: string;
  word: string;
  cols: number;
  ink: string;
  accent: string;
  accentGlyphs?: number[];
  flip?: boolean;
  /** Fondo de color plano: la sección cambia el clima de la página. */
  bg?: string;
  fg?: string;
  /** La sección sube y tapa a la anterior, que se achica detrás. */
  overlap?: boolean;
  /** Ilustración debajo de la palabra (solo desktop). */
  art?: string;
  /** La palabra se centra en el alto bajo la nav, a la par de un bloque pineado centrado. */
  centerWord?: boolean;
  children: React.ReactNode;
}

const Poster = forwardRef<HTMLElement, PosterProps>(
  ({ id, label, word, cols, ink, accent, accentGlyphs, flip, bg, fg, overlap, art, centerWord, children }, ref) => (
    <Section
      id={id}
      ref={ref}
      aria-labelledby={`${id}-title`}
      data-poster=""
      data-overlap={overlap ? '' : undefined}
      $overlap={overlap}
      style={bg ? ({ background: bg, color: fg, '--poster-ground': bg, '--focus': fg } as React.CSSProperties) : undefined}
    >
      <Grid $flip={flip}>
        <WordCol $center={centerWord}>
          <WordWrap data-word="">
            <ConstructedWord word={word} cols={cols} ink={ink} accent={accent} accentGlyphs={accentGlyphs} guides />
          </WordWrap>
          {art && <WordArt src={art} alt="" loading="lazy" width={1000} height={747} data-reveal="" />}
        </WordCol>
        <Body>
          <Label id={`${id}-title`} style={{ color: ink }}>
            {label}
          </Label>
          {children}
        </Body>
      </Grid>
    </Section>
  )
);
Poster.displayName = 'Poster';

/* ---------- página ---------- */

const PosterHome = forwardRef<HTMLElement>((_, contactRef) => {
  const root = useRef<HTMLDivElement>(null);
  const [showLoader] = useState(
    () => window.matchMedia(MOTION).matches && !sessionStorage.getItem(LOADER_KEY) && !window.location.hash
  );
  const [ready, setReady] = useState(!showLoader);
  const onLoaderDone = useRef(() => {
    sessionStorage.setItem(LOADER_KEY, '1');
    setReady(true);
  }).current;

  usePosterMotion(root, ready);

  // Al llegar desde un caso con `/#casos` o `/#contact`, el router no scrollea: se espera a las fuentes y a los pines.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    // Sin hash ("Volver al inicio" desde un caso) el router conserva el scroll del caso: se arranca arriba.
    if (!id) {
      window.scrollTo(0, 0);
      return;
    }
    let alive = true;
    document.fonts.ready.then(() => {
      if (!alive) return;
      ScrollTrigger.refresh();
      document.getElementById(id)?.scrollIntoView({ block: 'start' });
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <Page ref={root}>
      <PosterGlobalOnce />
      {showLoader && !ready && <Loader onDone={onLoaderDone} />}

      <Nav data-nav="" aria-label="Secciones">
        <Mark href="#home" onClick={scrollToId('home')} aria-label="Alexis Vedia, inicio">
          <ConstructedWord word="AV" cols={2} ink={INK.cream} accent={INK.red} />
        </Mark>
        <NavLinks>
          {NAV.map(item => (
            <li key={item.id}>
              <a href={`#${item.id}`} onClick={scrollToId(item.id)}>
                {item.label}
              </a>
            </li>
          ))}
        </NavLinks>
        <NavCta href="#contact" onClick={scrollToId('contact')}>
          {HERO.ctaPrimary}
        </NavCta>
      </Nav>

      <main>
        <Hero aria-labelledby="hero-name" data-hero="">
          <DepthField />
          <HeroPortrait>
            <HalftonePortrait />
          </HeroPortrait>
          <HeroWord data-hero-word="">
            <ConstructedWord word="AV" cols={1} ink={INK.cream} accent={INK.red} guides />
          </HeroWord>
          <HeroName id="hero-name" data-hero-name="">
            {HERO.name}
          </HeroName>
          <HeroText data-hero-text="">
            <HeroRole>{HERO.role}</HeroRole>
            <p>{HERO.line}</p>
            <Ctas>
              <Button href="#contact" onClick={scrollToId('contact')}>
                {HERO.ctaPrimary}
              </Button>
              <GhostButton href="#experience" onClick={scrollToId('experience')}>
                {HERO.ctaSecondary}
              </GhostButton>
            </Ctas>
            <Small>{HERO.place}</Small>
          </HeroText>
        </Hero>

        <Poster id="about" label="Manifiesto" word="IDEA" cols={2} ink={INK.ground} accent={INK.red} flip bg={INK.lime} fg={INK.ground} overlap>
          <Lead data-split="">{t('landing.lead')}</Lead>
        </Poster>

        <Poster id="experience" label="Trayectoria" word="RUTA" cols={2} ink={INK.blue} accent={INK.orange} accentGlyphs={[3]}>
          <Intro data-reveal="">{ROUTE_LEAD}</Intro>
          <Small data-reveal="">{STUDY}</Small>
          <ArrowLink as={Link} to={OTHERS.to} data-reveal="">
            {OTHERS.label}
          </ArrowLink>
          <RouteArt src={rutaArt} alt="" loading="lazy" width={1400} height={781} data-reveal="" />
        </Poster>

        <Stitch color={INK.blue} />
        <WorkGallery />
        <Stitch color={INK.red} flip fromRail />

        <Poster id="cubiq" label="Cubiq Digital" word="NODO" cols={2} ink={INK.red} accent={INK.cream} flip>
          <Intro data-reveal="">{CUBIQ.intro}</Intro>
          <CubiqStory />
          <Small data-reveal="">{CUBIQ.note}</Small>
        </Poster>

        <Portal to={INK.cream} />

        <Poster id="services" label="Servicios" word="OFICIO" cols={2} ink={INK.ground} accent={INK.red} bg={INK.cream} fg={INK.ground} centerWord>
          <ServiceDeck />
        </Poster>

        <Poster id="voces" label="Testimonios" word="VOCES" cols={2} ink={INK.violet} accent={INK.lime} flip>
          <TeamVoice />
          <Quotes>
            {VOICES.map((v, i) => (
              <Quote key={v.key} data-reveal="" style={VOICE_SKIN[i % VOICE_SKIN.length] as React.CSSProperties}>
                <blockquote>
                  <p>{t(`testimonials.${v.key}`)}</p>
                </blockquote>
                <figcaption>
                  <img src={PHOTOS[v.key]} alt="" loading="lazy" width={80} height={80} />
                  <span>
                    <strong>{v.name}</strong>
                    {v.role}
                  </span>
                </figcaption>
              </Quote>
            ))}
          </Quotes>
        </Poster>

        <Poster id="contact" ref={contactRef} label="Contacto" word="HOLA" cols={2} ink={INK.cream} accent={INK.red} accentGlyphs={[1]} art={holaArt}>
          <Intro data-reveal="">{t('landing.contactSubtitle')}.</Intro>
          <p data-reveal="">{CONTACT.lead}</p>
          <FormSkin data-reveal="">
            <ContactForm t={t} confettiColors={[INK.red, INK.lime, INK.cream, INK.teal]} />
          </FormSkin>
          <ContactLinks data-reveal="">
            <li>
              <ArrowLink href={`mailto:${CONTACT.email}`}>{CONTACT.email}</ArrowLink>
            </li>
            {CONTACT.links.map(l => (
              <li key={l.href}>
                <ArrowLink href={l.href} target="_blank" rel="noopener noreferrer">
                  {l.label}
                </ArrowLink>
              </li>
            ))}
          </ContactLinks>
        </Poster>
      </main>

      <Footer>
        <span>{CONTACT.footer}</span>
        <a href="#home" onClick={scrollToId('home')}>
          Volver arriba
        </a>
      </Footer>
    </Page>
  );
});
PosterHome.displayName = 'PosterHome';

export default PosterHome;

/* ---------- estilos ---------- */



// Margen lateral con tope: en pantallas anchas el contenido no pasa de 1320px.
const pad = 'max(clamp(1.25rem, 4vw, 3.5rem), calc((100% - 1320px) / 2))';

const Page = styled.div`
  --poster-ground: ${INK.ground};
  position: relative;
  background: ${INK.ground};
  color: ${INK.cream};
  font-family: ${TEXT};
  font-size: clamp(1rem, 0.94rem + 0.25vw, 1.15rem);
  line-height: 1.55;
  overflow-x: clip;

  p {
    margin: 0;
    max-width: 62ch;
    color: rgba(239, 230, 200, 0.82);
  }

  h3 {
    margin: 0;
    font-weight: 400;
  }

  :focus-visible {
    outline: 3px solid var(--focus, ${INK.lime});
    outline-offset: 4px;
    border-radius: 4px;
  }
`;

const LoaderVeil = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  background: ${INK.ground};
  clip-path: circle(75% at 50% 50%);

  svg {
    width: clamp(9rem, 28vmin, 16rem);
  }
`;

const Nav = styled.nav`
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 0.9rem ${pad};
  background: rgba(13, 12, 11, 0.86);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(239, 230, 200, 0.08);
`;

const Mark = styled.a`
  display: block;
  width: 3.4rem;
  flex: none;

  svg {
    display: block;
    width: 100%;
  }
`;

const NavLinks = styled.ul`
  display: flex;
  gap: clamp(1rem, 2.4vw, 2.2rem);
  margin: 0 0 0 auto;
  padding: 0;
  list-style: none;

  a {
    color: rgba(239, 230, 200, 0.72);
    text-decoration: none;
    font-size: 0.98rem;
    transition: color 0.2s ease;

    &:hover {
      color: ${INK.cream};
    }
  }

  @media (max-width: 860px) {
    display: none;
  }
`;

const pill = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 3rem;
  padding: 0 1.6rem;
  border-radius: 999px;
  font-size: 1rem;
  text-decoration: none;
  transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);

  &:active {
    transform: scale(0.97);
  }
`;

const NavCta = styled.a`
  ${pill}
  min-height: 2.6rem;
  background: ${INK.red};
  color: ${INK.ground};

  &:hover {
    background: ${INK.cream};
  }

  @media (max-width: 860px) {
    margin-left: auto;
  }
`;

const Button = styled.a`
  ${pill}
  background: ${INK.cream};
  color: ${INK.ground};

  &:hover {
    background: ${INK.red};
  }
`;

const GhostButton = styled.a`
  ${pill}
  color: ${INK.cream};
  box-shadow: inset 0 0 0 2px rgba(239, 230, 200, 0.4);

  &:hover {
    box-shadow: inset 0 0 0 2px ${INK.cream};
  }
`;

const Hero = styled.section`
  position: relative;
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr);
  align-items: end;
  gap: clamp(1.5rem, 4vw, 4rem);
  min-height: 100svh;
  /* + 12vh: la sección siguiente sube 12vh encima (overlap) y no tiene que tapar la última línea. */
  padding: 6.5rem ${pad} calc(clamp(2.5rem, 7vh, 4.5rem) + 12vh);

  @media (max-width: 860px) {
    grid-template-columns: auto minmax(0, 1fr);
    grid-template-rows: 1fr auto;
    align-items: stretch;
    padding-top: 5.5rem;
  }
`;

/* Retrato en semitono en el hueco de arriba a la derecha, encima de la bajada. */
const HeroPortrait = styled.div`
  position: absolute;
  z-index: 1;
  top: 5.5rem;
  right: ${pad};
  height: min(46svh, 30rem);
  mask-image: linear-gradient(#000 72%, transparent);
  aspect-ratio: 700 / 820;

  @media (max-width: 860px) {
    top: auto;
    bottom: calc(clamp(2.5rem, 7vh, 4.5rem) + 12vh + 15rem);
    height: min(34svh, 18rem);
    /* Queda detrás del nombre: tenue para que el texto crema siga legible. */
    opacity: 0.3;
  }
`;

const HeroWord = styled.div`
  position: relative;
  z-index: 1;
  height: min(78svh, 46rem);

  [data-guide] {
    opacity: 0;
    transition: opacity 0.35s ease;
  }
  &:hover [data-guide] {
    opacity: 0.6;
  }

  align-self: center;

  svg {
    display: block;
    height: 100%;
    width: auto;
  }

  @media (max-width: 860px) {
    height: auto;
    width: 38vw;
    align-self: start;

    svg {
      width: 100%;
      height: auto;
    }
  }
`;

const HeroName = styled.h1`
  position: relative;
  z-index: 1;
  margin: 0;
  align-self: stretch;
  writing-mode: vertical-rl;
  transform: rotate(180deg);
  font-family: ${DISPLAY};
  font-weight: 900;
  font-size: clamp(7rem, 23svh, 15rem);
  line-height: 0.8;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  color: ${INK.cream};
  white-space: nowrap;
  text-align: end;

  @media (max-width: 860px) {
    justify-self: end;
    font-size: clamp(5.5rem, 30vw, 8rem);
    text-align: start;
  }
`;

const HeroText = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  gap: 1.3rem;
  max-width: 34rem;
  padding-bottom: 0.4rem;

  @media (max-width: 860px) {
    grid-column: 1 / -1;
  }
`;

const HeroRole = styled.p`
  && {
    font-size: clamp(1.6rem, 1.1rem + 1.6vw, 2.5rem);
    line-height: 1.12;
    color: ${INK.cream};
    letter-spacing: -0.01em;
  }
`;

const Ctas = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
`;

const Small = styled.p`
  && {
    font-size: 0.92rem;
    color: rgba(239, 230, 200, 0.58);
  }
`;

const Section = styled.section<{ $overlap?: boolean }>`
  position: relative;
  padding: clamp(5rem, 14vh, 9rem) ${pad};
  scroll-margin-top: 4rem;

  /* La maqueta de Cubiq es la pieza central: en pantallas anchas pasa el tope de 1320px. */
  @media (min-width: 1024px) {
    &#cubiq {
      padding-inline: max(clamp(1.25rem, 4vw, 3.5rem), calc((100% - 1760px) / 2));
    }
  }

  ${({ $overlap }) =>
    $overlap &&
    css`
      z-index: 2;
      margin-top: -12vh;
      border-radius: clamp(1.5rem, 4vw, 3.5rem) clamp(1.5rem, 4vw, 3.5rem) 0 0;
      box-shadow: 0 -2rem 4rem rgba(0, 0, 0, 0.45);
    `}

  /* La grilla de construcción de cada letra aparece al pasar el mouse por la palabra. */
  [data-guide] {
    opacity: 0;
    transition: opacity 0.35s ease;
  }
  [data-word]:hover [data-guide] {
    opacity: 0.55;
  }
`;

const Grid = styled.div<{ $flip?: boolean }>`
  display: grid;
  grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
  gap: clamp(2rem, 6vw, 7rem);
  align-items: start;

  ${({ $flip }) =>
    $flip &&
    css`
      @media (min-width: 861px) {
        grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
        > :first-child {
          order: 2;
        }
      }
      /* Cubiq lleva los pasos en columna al lado de la maqueta: la palabra cede ancho.
         Mismo corte que el pin de CubiqStory (PIN_QUERY). */
      @media (min-width: 1024px) {
        #cubiq & {
          grid-template-columns: minmax(0, 3fr) minmax(0, 1fr);
        }
      }
      @media (min-width: 1440px) {
        #cubiq & {
          grid-template-columns: minmax(0, 5fr) minmax(0, 1fr);
        }
      }
    `}

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const WordCol = styled.div<{ $center?: boolean }>`
  position: sticky;
  top: 6rem;

  ${({ $center }) =>
    $center &&
    css`
      /* Misma condición que el cubo de ServiceDeck: sin cubo, las cards quedan arriba y la palabra también. */
      @media ${CUBE} {
        height: calc(100svh - 6rem);
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    `}

  @media (max-width: 860px) {
    position: static;
  }
`;

const WordWrap = styled.div`
  svg {
    display: block;
    width: min(100%, 30rem);
    max-height: 78vh;
  }

  @media (max-width: 860px) {
    svg {
      width: min(64vw, 17rem);
    }
  }
`;

const WordArt = styled.img`
  display: block;
  width: min(100%, 30rem);
  height: auto;
  margin-top: 2.5rem;

  @media (max-width: 860px) {
    display: none;
  }
`;

const RouteArt = styled.img`
  display: block;
  width: 100%;
  height: auto;
  margin-top: 1rem;
`;

const Body = styled.div`
  display: grid;
  gap: 2rem;
  min-width: 0;
`;

const Label = styled.h2`
  margin: 0;
  font-family: ${TEXT};
  font-weight: 400;
  font-size: clamp(1.8rem, 1.2rem + 1.8vw, 3rem);
  line-height: 1;
  letter-spacing: -0.02em;
`;

const Lead = styled.p`
  && {
    font-size: clamp(1.55rem, 1rem + 1.9vw, 2.7rem);
    line-height: 1.18;
    color: inherit;
    letter-spacing: -0.015em;
    max-width: 24ch;
  }
`;

const Intro = styled(Lead)`
  && {
    font-size: clamp(1.35rem, 1rem + 1.2vw, 2rem);
    max-width: 32ch;
  }
`;

const ArrowLink = styled.a`
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: ${INK.cream};
  text-decoration: none;
  background: linear-gradient(currentColor, currentColor) 0 100% / 0% 2px no-repeat;
  padding-bottom: 0.2rem;
  transition: background-size 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);

  &::after {
    content: '→';
    transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  &:hover {
    background-size: 100% 2px;
  }

  &:hover::after {
    transform: translateX(4px);
  }
`;

const Quotes = styled.div`
  display: grid;
  gap: clamp(2.5rem, 6vh, 4rem);
`;

const Quote = styled.figure`
  position: relative;
  margin: 0;
  display: grid;
  gap: 1.4rem;
  padding: clamp(1.6rem, 3vw, 2.6rem);
  padding-top: clamp(3.4rem, 6vw, 4.6rem);
  border-radius: clamp(1.2rem, 2vw, 2rem);
  background: var(--q-bg);
  color: var(--q-fg);
  /* rotate y translate sueltos: el reveal de GSAP escribe transform y no los pisa. */
  rotate: -1.2deg;
  transition: rotate 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), translate 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);

  &:nth-child(even) {
    margin-left: clamp(0rem, 6vw, 5rem);
    rotate: 1.4deg;
  }

  @media (hover: hover) {
    &:hover {
      rotate: 0deg;
      translate: 0 -6px;
    }
  }

  /* Comilla gigante en la tipografía de los afiches. */
  &::before {
    content: '“';
    position: absolute;
    top: -0.12em;
    left: 0.12em;
    font-family: ${DISPLAY};
    font-weight: 900;
    font-size: clamp(7rem, 12vw, 10rem);
    line-height: 1;
    color: var(--q-fg);
    opacity: 0.9;
    pointer-events: none;
  }

  blockquote {
    margin: 0;
  }

  blockquote p {
    font-size: clamp(1.1rem, 0.95rem + 0.6vw, 1.45rem);
    line-height: 1.38;
    color: inherit;
  }

  figcaption {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.95rem;
  }

  img {
    width: 4.5rem;
    height: 4.5rem;
    border-radius: 50%;
    object-fit: cover;
    filter: grayscale(1) contrast(1.1);
    box-shadow: 0 0 0 4px var(--q-bg), 0 0 0 9px var(--q-fg);
    transition: filter 0.4s ease;
  }

  &:hover img {
    filter: none;
  }

  strong {
    display: block;
    font-family: ${DISPLAY};
    font-weight: 800;
    font-size: 1.9rem;
    line-height: 1;
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  @media (prefers-reduced-motion: reduce) {
    &,
    &:nth-child(even),
    &:hover {
      rotate: none;
      translate: none;
    }
  }
`;

const FormSkin = styled.div`
  && label {
    color: rgba(239, 230, 200, 0.8);
    font-size: 0.95rem;
  }

  && input,
  && textarea {
    color: ${INK.cream};
    background: #171513;
    border: 1.5px solid rgba(239, 230, 200, 0.16);
    border-radius: 0.8rem;
    backdrop-filter: none;

    &::placeholder {
      color: rgba(239, 230, 200, 0.38);
    }

    &:focus {
      border-color: ${INK.lime};
      background: #1c1a17;
    }
  }

  && button[type='submit'] {
    ${pill}
    border: 0;
    width: 100%;
    background: ${INK.red};
    color: ${INK.ground};
    cursor: pointer;

    &:hover:not(:disabled) {
      background: ${INK.cream};
      transform: none;
    }
  }
`;

const ContactLinks = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem 2rem;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Footer = styled.footer`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  padding: 2rem ${pad} 2.5rem;
  border-top: 1px solid rgba(239, 230, 200, 0.1);
  font-size: 0.9rem;
  color: rgba(239, 230, 200, 0.55);

  a {
    color: inherit;
  }
`;
