import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled, { createGlobalStyle, css, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import i18n from 'i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import ConstructedWord from './ConstructedWord';
import RingPassage from './RingPassage';
import LandingVideo from '@/features/landing/LandingVideo';
import { ContactForm, SERVICES } from '@/features/landing/Landing';
import { CONTACT, CUBIQ, HERO, INK, NAV, OTHERS, ROUTE, STUDY, VOICES } from './content';
import jorge from '@/assets/images/testimonials/Jorge.jpeg';
import mauro from '@/assets/images/testimonials/Mauro.jpeg';
import milena from '@/assets/images/testimonials/Milena.jpeg';
import kodi from '@/assets/images/testimonials/Kodi.png';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

const PHOTOS: Record<string, string> = { jorge, mauro, milena, kodi };
const MOTION = '(prefers-reduced-motion: no-preference)';
const LOADER_KEY = 'poster-loader-seen';
const DISPLAY = `'Morganite', 'Arial Narrow', sans-serif`;
const TEXT = `'NHaas', 'Helvetica Neue', Arial, sans-serif`;

/* El idioma de esta página es fijo: todo en español aunque el detector elija otro. */
const t = i18n.getFixedT('es');

const fmt = (n: number) => Math.round(n).toLocaleString('es-AR');

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

      // Trayectoria: el riel crece y cada parada se marca al llegar.
      const rail = q('[data-rail]')[0];
      if (rail) {
        gsap.fromTo(
          rail,
          { scaleY: 0 },
          { scaleY: 1, ease: 'none', transformOrigin: '50% 0%', scrollTrigger: { trigger: rail.parentElement, start: 'top 70%', end: 'bottom 70%', scrub: true } }
        );
      }
      q('[data-stop-ring]').forEach(ring =>
        gsap.from(ring, {
          scale: 0,
          duration: 0.5,
          ease: 'back.out(2.4)',
          scrollTrigger: { trigger: ring, start: 'top 70%', toggleActions: 'play none none reverse' },
        })
      );

      // Cifras que cuentan hasta su valor una sola vez.
      const counters = q('[data-count]');
      counters.forEach(el => {
        const target = Number(el.dataset.count);
        const box = { v: 0 };
        gsap.to(box, {
          v: target,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = fmt(box.v);
          },
          scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        });
        el.textContent = fmt(0);
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
        counters.forEach(el => (el.textContent = fmt(Number(el.dataset.count))));
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
  children: React.ReactNode;
}

const Poster = forwardRef<HTMLElement, PosterProps>(
  ({ id, label, word, cols, ink, accent, accentGlyphs, flip, children }, ref) => (
    <Section id={id} ref={ref} aria-labelledby={`${id}-title`} data-poster="">
      <Grid $flip={flip}>
        <WordCol>
          <WordWrap data-word="">
            <ConstructedWord word={word} cols={cols} ink={ink} accent={accent} accentGlyphs={accentGlyphs} />
          </WordWrap>
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

const Services: React.FC = () => {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const s = SERVICES[active];

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (active + step + SERVICES.length) % SERVICES.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <ServicesWrap>
      <TabList role="tablist" aria-label="Servicios" onKeyDown={onKeyDown} data-reveal="">
        {SERVICES.map((srv, i) => (
          <Tab
            key={srv.key}
            ref={el => {
              tabs.current[i] = el;
            }}
            role="tab"
            id={`tab-${srv.key}`}
            aria-selected={i === active}
            aria-controls={`panel-${srv.key}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
          >
            {t(`landing.${srv.key}Title`)}
          </Tab>
        ))}
      </TabList>
      <Panel key={s.key} role="tabpanel" id={`panel-${s.key}`} aria-labelledby={`tab-${s.key}`}>
        <Media>
          {s.media.video ? (
            <LandingVideo src={s.media.video} poster={s.media.poster} label={t(`landing.${s.key}Alt`)} loop={s.media.loop} />
          ) : (
            <img src={s.media.image} alt={t(`landing.${s.key}Alt`)} loading="lazy" />
          )}
        </Media>
        <p>{t(`landing.${s.key}Text`)}</p>
        <Tags aria-label="Herramientas">
          {s.tags.map(tag => (
            <li key={tag}>{tag}</li>
          ))}
        </Tags>
        <ArrowLink as={Link} to={s.to}>
          {t('landing.learnMore')}: {t(`landing.${s.key}Title`)}
        </ArrowLink>
      </Panel>
    </ServicesWrap>
  );
};

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
        <Hero aria-labelledby="hero-name">
          <HeroWord data-hero-word="">
            <ConstructedWord word="AV" cols={1} ink={INK.cream} accent={INK.red} />
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

        <Poster id="about" label="Manifiesto" word="IDEA" cols={2} ink={INK.lime} accent={INK.red} flip>
          <Lead data-split="">{t('landing.lead')}</Lead>
          <Pair>
            <div data-reveal="">
              <h3>{t('landing.feature1Title')}</h3>
              <p>{t('landing.feature1Text')}</p>
            </div>
            <div data-reveal="">
              <h3>{t('landing.feature2Title')}</h3>
              <p>{t('landing.feature2Text')}</p>
            </div>
          </Pair>
        </Poster>

        <Poster id="experience" label="Trayectoria" word="RUTA" cols={2} ink={INK.blue} accent={INK.orange} accentGlyphs={[3]}>
          <Route>
            <Rail aria-hidden="true">
              <span data-rail="" />
            </Rail>
            <ol>
              {ROUTE.map(stop => (
                <Stop key={stop.company}>
                  <StopRing data-stop-ring="" aria-hidden="true" />
                  <div data-reveal="">
                    <Years>{stop.years}</Years>
                    <h3>
                      {stop.company} <span>{stop.role}</span>
                    </h3>
                    <p>{stop.text}</p>
                    {stop.to ? (
                      <ArrowLink as={Link} to={stop.to}>
                        {stop.linkLabel}
                      </ArrowLink>
                    ) : (
                      <ArrowLink href={`#${stop.anchor}`} onClick={scrollToId(stop.anchor ?? '')}>
                        {stop.linkLabel}
                      </ArrowLink>
                    )}
                  </div>
                </Stop>
              ))}
            </ol>
          </Route>
          <Small data-reveal="">{STUDY}</Small>
          <ArrowLink as={Link} to={OTHERS.to} data-reveal="">
            {OTHERS.label}
          </ArrowLink>
        </Poster>

        <Poster id="cubiq" label="Cubiq Digital" word="NODO" cols={2} ink={INK.red} accent={INK.cream} flip>
          <Intro data-reveal="">{CUBIQ.intro}</Intro>
          {CUBIQ.beats.map(beat => (
            <BeatRow key={beat.title}>
              <h3 data-reveal="">{beat.title}</h3>
              <p data-reveal="">{beat.text}</p>
              {beat.stats && (
                <Stats>
                  {beat.stats.map(stat => (
                    <div key={stat.label} data-reveal="">
                      <dt>
                        <span aria-hidden="true" data-count={stat.value.replace(/\./g, '')}>
                          {stat.value}
                        </span>
                        <SrOnly>{stat.value}</SrOnly>
                      </dt>
                      <dd>{stat.label}</dd>
                    </div>
                  ))}
                </Stats>
              )}
            </BeatRow>
          ))}
          <Small data-reveal="">{CUBIQ.note}</Small>
        </Poster>

        <RingPassage />

        <Poster id="services" label="Servicios" word="OFICIO" cols={2} ink={INK.orange} accent={INK.teal}>
          <Services />
        </Poster>

        <Poster id="voces" label="Testimonios" word="VOCES" cols={2} ink={INK.violet} accent={INK.lime} flip>
          <Quotes>
            {VOICES.map(v => (
              <Quote key={v.key} data-reveal="">
                <blockquote>
                  <p>{t(`testimonials.${v.key}`)}</p>
                </blockquote>
                <figcaption>
                  <img src={PHOTOS[v.key]} alt="" loading="lazy" width={56} height={56} />
                  <span>
                    <strong>{v.name}</strong>
                    {v.role}
                  </span>
                </figcaption>
              </Quote>
            ))}
          </Quotes>
        </Poster>

        <Poster id="contact" ref={contactRef} label="Contacto" word="HOLA" cols={2} ink={INK.cream} accent={INK.red} accentGlyphs={[1]}>
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

const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;

const PosterGlobal = createGlobalStyle`
  /* GlobalStyles pone overflow-x: hidden en html y body, y eso convierte a body en contenedor
     de scroll: ningún position: sticky funciona. clip recorta igual sin crear el contenedor. */
  html,
  body {
    overflow-x: clip;
  }

  @font-face {
    font-family: 'Morganite';
    src: url('/fonts/Morganite/Morganite-Medium.ttf') format('truetype');
    font-weight: 500;
    font-display: swap;
  }
  @font-face {
    font-family: 'Morganite';
    src: url('/fonts/Morganite/Morganite-ExtraBold.ttf') format('truetype');
    font-weight: 800;
    font-display: swap;
  }
  @font-face {
    font-family: 'Morganite';
    src: url('/fonts/Morganite/Morganite-Black.ttf') format('truetype');
    font-weight: 900;
    font-display: swap;
  }
  @font-face {
    font-family: 'NHaas';
    src: url('/fonts/NHaasGrotesk/NHaasGroteskTXPro-55Rg.otf') format('opentype');
    font-weight: 400;
    font-display: swap;
  }

  html, body {
    background: ${INK.ground};
    color-scheme: dark;
    scrollbar-color: ${INK.red} ${INK.ground};
  }
  ::selection {
    background: ${INK.lime};
    color: ${INK.ground};
  }
  ::-webkit-scrollbar { width: 10px; }
  ::-webkit-scrollbar-track { background: ${INK.ground}; }
  ::-webkit-scrollbar-thumb { background: ${INK.red}; border-radius: 10px; border: 2px solid ${INK.ground}; }
`;

// createGlobalStyle reinyecta sus estilos en cada render (props nuevas): memo evita el parpadeo de las fuentes.
const PosterGlobalOnce = React.memo(PosterGlobal);

const pad = 'clamp(1.25rem, 4vw, 3.5rem)';

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
    outline: 3px solid ${INK.lime};
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
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr);
  align-items: end;
  gap: clamp(1.5rem, 4vw, 4rem);
  min-height: 100svh;
  padding: 6.5rem ${pad} clamp(2.5rem, 7vh, 4.5rem);

  @media (max-width: 860px) {
    grid-template-columns: auto minmax(0, 1fr);
    grid-template-rows: 1fr auto;
    align-items: stretch;
    padding-top: 5.5rem;
  }
`;

const HeroWord = styled.div`
  height: min(78svh, 46rem);
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

const Section = styled.section`
  padding: clamp(5rem, 14vh, 9rem) ${pad};
  scroll-margin-top: 4rem;
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
    `}

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
  }
`;

const WordCol = styled.div`
  position: sticky;
  top: 6rem;

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
    color: ${INK.cream};
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

const displayTitle = css`
  font-family: ${DISPLAY};
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  line-height: 0.9;
`;

const Pair = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(239, 230, 200, 0.14);

  h3 {
    ${displayTitle}
    font-size: clamp(2.4rem, 3.6vw, 3.4rem);
    color: ${INK.lime};
    margin-bottom: 0.6rem;
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Route = styled.div`
  position: relative;

  ol {
    display: grid;
    gap: clamp(2.5rem, 6vh, 4rem);
    margin: 0;
    padding: 0 0 0 3rem;
    list-style: none;
  }
`;

const Rail = styled.div`
  position: absolute;
  top: 0.6rem;
  bottom: 0.6rem;
  left: 0.85rem;
  width: 4px;
  border-radius: 4px;
  background: rgba(31, 134, 198, 0.2);

  span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: ${INK.blue};
    transform-origin: 50% 0%;
  }
`;

const Stop = styled.li`
  position: relative;

  h3 {
    font-size: clamp(1.5rem, 1.1rem + 1vw, 2.1rem);
    line-height: 1.1;
    color: ${INK.cream};
    margin-bottom: 0.6rem;

    span {
      display: block;
      font-size: 1rem;
      color: rgba(239, 230, 200, 0.6);
      margin-top: 0.3rem;
    }
  }

  p {
    margin-bottom: 0.9rem;
  }
`;

const StopRing = styled.span`
  position: absolute;
  left: -3rem;
  top: 0.35rem;
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: ${INK.orange};
  box-shadow: inset 0 0 0 0.5rem ${INK.orange}, inset 0 0 0 2rem ${INK.ground};
`;

const Years = styled.span`
  ${displayTitle}
  display: block;
  font-size: clamp(2rem, 2.8vw, 2.6rem);
  color: ${INK.orange};
  margin-bottom: 0.4rem;
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

const BeatRow = styled.div`
  display: grid;
  gap: 0.9rem;
  padding-top: 1.8rem;
  border-top: 1px solid rgba(239, 230, 200, 0.14);

  > h3 {
    ${displayTitle}
    font-size: clamp(2.6rem, 4vw, 3.8rem);
    color: ${INK.red};
  }
`;

const Stats = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(9.5rem, 1fr));
  gap: 1.5rem clamp(1.5rem, 3vw, 2.5rem);
  margin: 0.8rem 0 0;

  dt {
    ${displayTitle}
    font-weight: 900;
    font-size: clamp(4.2rem, 8vw, 7rem);
    color: ${INK.cream};
    font-variant-numeric: tabular-nums;
  }

  dd {
    margin: 0.4rem 0 0;
    font-size: 0.95rem;
    color: rgba(239, 230, 200, 0.7);
  }
`;

const ServicesWrap = styled.div`
  display: grid;
  gap: 2rem;
`;

const TabList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.2rem 1.6rem;
`;

const Tab = styled.button`
  ${displayTitle}
  font-size: clamp(2.2rem, 4.2vw, 3.8rem);
  padding: 0.2rem 0;
  background: none;
  border: 0;
  cursor: pointer;
  color: rgba(239, 230, 200, 0.3);
  transition: color 0.25s ease;

  &:hover {
    color: rgba(239, 230, 200, 0.7);
  }

  &[aria-selected='true'] {
    color: ${INK.orange};
  }
`;

const panelIn = keyframes`
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: none; }
`;

const Panel = styled.div`
  display: grid;
  gap: 1.3rem;
  animation: ${panelIn} 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Media = styled.div`
  aspect-ratio: 16 / 10;
  border-radius: 1.2rem;
  overflow: hidden;
  background: #1a1816;

  video,
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Tags = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    padding: 0.35rem 0.9rem;
    border-radius: 999px;
    font-size: 0.9rem;
    color: ${INK.teal};
    box-shadow: inset 0 0 0 1.5px ${INK.teal};
  }
`;

const Quotes = styled.div`
  display: grid;
  gap: clamp(2.5rem, 6vh, 4rem);
`;

const Quote = styled.figure`
  margin: 0;
  display: grid;
  gap: 1.2rem;

  &:nth-child(even) {
    padding-left: clamp(0rem, 6vw, 5rem);
  }

  blockquote {
    margin: 0;
  }

  blockquote p {
    font-size: clamp(1.2rem, 1rem + 0.7vw, 1.6rem);
    line-height: 1.35;
    color: ${INK.cream};
  }

  figcaption {
    display: flex;
    align-items: center;
    gap: 0.9rem;
    font-size: 0.95rem;
    color: rgba(239, 230, 200, 0.65);
  }

  img {
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 0 0 3px ${INK.ground}, 0 0 0 6px ${INK.violet};
  }

  strong {
    display: block;
    font-weight: 400;
    color: ${INK.cream};
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
