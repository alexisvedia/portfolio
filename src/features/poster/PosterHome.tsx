import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
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
import HiloMark from './HiloMark';
import HeroAgents, { heroIntro } from './HeroAgents';
import Stitch from './Stitch';
import Almohada from './Almohada';
import ServiceDeck, { CARD_H, CUBE, cubeTop } from './ServiceDeck';
import WorkGallery from './WorkGallery';
import CubiqStory from './CubiqStory';
import TeamVoice from './TeamVoice';
import AiStack from './AiStack';
import { ContactForm } from '@/features/landing/Landing';
import { AI_STACK, CONTACT, CUBIQ, FONT, HERO, INK, NAV, OTHERS, ROUTE_LEAD, STUDY, VOICES } from './content';
import jorge from '@/assets/images/testimonials/Jorge.jpeg';
import mauro from '@/assets/images/testimonials/Mauro.jpeg';
import milena from '@/assets/images/testimonials/Milena.jpeg';
import kodi from '@/assets/images/testimonials/Kodi.png';
import rutaArt from '@/assets/poster/ruta.webp';
import holaArt from '@/assets/poster/hola.webp';
import retrato from '@/assets/poster/retrato.webp';

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

/* ---------- motion ---------- */

const usePosterMotion = (root: React.RefObject<HTMLDivElement>) => {

  useLayoutEffect(() => {
    const scope = root.current;
    if (!scope) return;
    const mm = gsap.matchMedia(scope);

    // Movimiento reducido: sin intro, los agentes quedan estacionados en el hero desde el principio.
    mm.add('(prefers-reduced-motion: reduce)', () => {
      const q = gsap.utils.selector(scope);
      heroIntro(q('[data-hero]')[0] as HTMLElement, q('[data-nav]')[0] as HTMLElement, true).progress(1);
    });

    mm.add(MOTION, ctx => {
      let alive = true;
      const q = gsap.utils.selector(scope);

      // Entrada del hero: arranca el logo y los siete agentes arman el hero (HeroAgents); GLM se lleva el logo a la nav.
      const heroRoot = q('[data-hero]')[0] as HTMLElement;
      const tl = heroIntro(heroRoot, q('[data-nav]')[0] as HTMLElement);
      // QA cuadro por cuadro: en dev la timeline queda en window.__heroIntro.
      if (import.meta.env.DEV) (window as unknown as { __heroIntro?: gsap.core.Timeline }).__heroIntro = tl;
      // Se mide al arrancar: sin Morganite cargada el nombre mide el doble y los cursores apuntan mal.
      // Con hash (/#contact) el hero no está en pantalla: la intro salta al final y la nav queda usable.
      (document.fonts?.ready ?? Promise.resolve()).then(() => { if (!alive) return; if (location.hash) tl.progress(1); else tl.play(); });

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

      // El Manifiesto tapa al hero: el hero queda fijo desde que se ve entero hasta que el verde llega arriba,
      // y mientras tanto se achica y se apaga.
      const heroEl = q('[data-hero]')[0];
      const cover = q('[data-overlap]')[0];
      if (heroEl && cover) {
        ScrollTrigger.create({ trigger: heroEl, start: 'bottom bottom', endTrigger: cover, end: 'top top', pin: true, pinSpacing: false, anticipatePin: 1 });
        gsap.fromTo(
          heroEl,
          { scale: 1, opacity: 1 },
          {
            scale: 0.92,
            opacity: 0.35,
            transformOrigin: '50% 100%',
            ease: 'none',
            scrollTrigger: { trigger: cover, start: 'top bottom', end: 'top top', scrub: 0.6 },
          }
        );
      }

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
      };
    });

    // Cada palabra construida se dibuja con el scroll, trazo por trazo. La de Servicios, pineada con el cubo, se dibuja sola
    // cuando la grilla llega al centro: con scrub se dibujaba mientras subía desde abajo y se veía a medias.
    mm.add({ motion: MOTION, cube: CUBE }, ctx => {
      if (!ctx.conditions?.motion) return;
      gsap.utils.toArray<HTMLElement>('[data-poster]', scope).forEach(section => {
        const word = section.querySelector('[data-word]');
        if (!word) return;
        const strokes = word.querySelectorAll('[data-stroke]');
        const rings = word.querySelectorAll('[data-ring]');
        const draw =
          ctx.conditions?.cube && section.hasAttribute('data-center-word')
            ? gsap
                .timeline({
                  // Un poco antes que el pin del cubo (ServiceDeck), con el Portal ya casi apagado.
                  scrollTrigger: { trigger: section, start: () => `top ${cubeTop(section) + 40}px`, toggleActions: 'play none none reverse', invalidateOnRefresh: true },
                })
                .fromTo(strokes, { drawSVG: '0% 0%', autoAlpha: 0 }, { drawSVG: '0% 100%', autoAlpha: 1, duration: 0.7, ease: 'power2.inOut', stagger: 0.08 })
            : gsap
                .timeline({ scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 10%', scrub: 0.6 } })
                .fromTo(strokes, { drawSVG: '0% 0%', autoAlpha: 0 }, { drawSVG: '0% 100%', autoAlpha: 1, ease: 'none', stagger: 0.12 });
        if (rings.length) draw.from(rings, { scale: 0, transformOrigin: '50% 50%', ease: 'back.out(2)', duration: 0.5, stagger: 0.1 }, '-=0.3');
      });
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => mm.revert();
  }, [root]);
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
  /** Efecto almohada al apretar (prototipo, ver Almohada.tsx). */
  pillow?: boolean;
  children: React.ReactNode;
}

const Poster = forwardRef<HTMLElement, PosterProps>(
  ({ id, label, word, cols, ink, accent, accentGlyphs, flip, bg, fg, overlap, art, centerWord, pillow, children }, ref) => {
    const grid = (
      <Grid $flip={flip}>
        <WordCol $center={centerWord}>
          <WordWrap data-word="">
            <ConstructedWord word={word} cols={cols} ink={ink} accent={accent} accentGlyphs={accentGlyphs} guides />
          </WordWrap>
          {art && <WordArt src={art} alt="" loading="lazy" width={1000} height={747} data-reveal="" />}
        </WordCol>
        <Body>
          <Label id={`${id}-title`} style={{ color: ink }} $hidden={centerWord}>
            {label}
          </Label>
          {children}
        </Body>
      </Grid>
    );
    return (
      <Section
        id={id}
        ref={ref}
        aria-labelledby={`${id}-title`}
        data-poster=""
        data-center-word={centerWord ? '' : undefined}
        data-overlap={overlap ? '' : undefined}
        $overlap={overlap}
        style={bg ? ({ background: bg, color: fg, '--poster-ground': bg, '--focus': fg } as React.CSSProperties) : undefined}
      >
        {pillow ? <Almohada>{grid}</Almohada> : grid}
      </Section>
    );
  }
);
Poster.displayName = 'Poster';

/* ---------- página ---------- */

const PosterHome = forwardRef<HTMLElement>((_, contactRef) => {
  const root = useRef<HTMLDivElement>(null);
  usePosterMotion(root);

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

      <Nav data-nav="" aria-label="Secciones">
        <Mark href="#home" onClick={scrollToId('home')} aria-label="Alexis Vedia, inicio">
          <HiloMark ink={INK.cream} accent={INK.red} />
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
          <HeroAgents />
          {/* Capas de atrás hacia adelante: nombre, foto, grilla, copy. */}
          <HeroName id="hero-name" data-hero-name="">
            {HERO.name}
          </HeroName>
          <HeroFigure data-hero-portrait="">
            <img src={retrato} alt="" width={722} height={964} fetchPriority="high" decoding="async" />
            <HeroGuides />
          </HeroFigure>
          <HeroCopy>
            <HeroText data-hero-text="">
              <HeroRole>{HERO.role}</HeroRole>
              <p>{HERO.line}</p>
              <Ctas data-hero-ctas="">
                <Button href="#contact" onClick={scrollToId('contact')}>
                  {HERO.ctaPrimary}
                </Button>
                <GhostButton href="#experience" onClick={scrollToId('experience')}>
                  {HERO.ctaSecondary}
                </GhostButton>
              </Ctas>
              <Small>{HERO.place}</Small>
            </HeroText>
          </HeroCopy>
        </Hero>

        <Poster id="about" label="Manifiesto" word="IDEA" cols={2} ink={INK.ground} accent={INK.red} flip bg={INK.lime} fg={INK.ground} overlap pillow>
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

        <Poster id="stack" label="Stack de IA" word="IA" cols={2} ink={INK.teal} accent={INK.lime}>
          <Intro data-reveal="">{AI_STACK.intro}</Intro>
          <AiStack />
          <Small data-reveal="">{AI_STACK.note}</Small>
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
  width: 2.3rem;
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

/* Grilla y círculo con punto sobre la foto, en coordenadas de la foto original (el recorte arranca en 170, 60). */
const GUIDE_X = Array.from({ length: 10 }, (_, i) => 232 + 72 * i);
const GUIDE_Y = Array.from({ length: 12 }, (_, i) => 123 + 83 * i);
const HeroGuides: React.FC = () => (
  <Guides viewBox="170 60 722 964" aria-hidden="true" focusable="false" data-hero-guides="">
    {/* Líneas sueltas: Gemini las traza de a una en la entrada. */}
    <g stroke={INK.cream} strokeOpacity={0.3} strokeWidth={1.5}>
      {GUIDE_X.map(x => (
        <line key={`x${x}`} data-guide-v="" x1={x} y1={60} x2={x} y2={1024} vectorEffect="non-scaling-stroke" />
      ))}
      {GUIDE_Y.map(y => (
        <line key={`y${y}`} data-guide-h="" x1={170} y1={y} x2={892} y2={y} vectorEffect="non-scaling-stroke" />
      ))}
    </g>
    <circle data-guide-circle="" cx={482} cy={300} r={190} fill="none" stroke={INK.cream} strokeOpacity={0.55} strokeWidth={2} vectorEffect="non-scaling-stroke" />
    <circle data-guide-dot="" cx={482} cy={300} r={6} fill={INK.red} />
  </Guides>
);

const Hero = styled.section`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  /* El copy arranca debajo del nombre (su margin-top reserva el alto); no se va al fondo. */
  align-items: start;
  min-height: 100svh;
  padding: 6.5rem ${pad} 0;
  overflow: clip;
  /* Cuerpo del nombre y su tope. El tope despeja la nav: Morganite asoma 0,05em por encima de su caja con line-height 0,8. */
  --name-size: min(calc((100vw - 2 * clamp(1.25rem, 4vw, 3.5rem)) / 2.66), calc(1320px / 2.66), 62svh);
  --name-top: max(clamp(5.5rem, 13svh, 8rem), calc(4.75rem + 0.05 * var(--name-size)));

  /* En mobile el hero entero (nombre, foto, texto y botones) entra en el primer pantallazo: el copy se apoya abajo. */
  @media (max-width: 860px) {
    padding-top: 5.5rem;
    align-content: end;
  }
`;

/* El nombre ocupa el ancho en una línea, detrás de la foto. 2.66 es el ancho de "ALEXIS VEDIA" en Morganite por cada em. */
const HeroName = styled.h1`
  position: absolute;
  z-index: 1;
  top: var(--name-top);
  left: 0;
  right: 0;
  margin: 0;
  text-align: center;
  white-space: nowrap;
  font-family: ${DISPLAY};
  font-weight: 900;
  font-size: var(--name-size);
  line-height: 0.8;
  letter-spacing: 0.01em;
  text-transform: uppercase;
  color: ${INK.cream};

  /* En mobile, una palabra por línea. 1.37 es el ancho de "ALEXIS" por cada em. */
  @media (max-width: 860px) {
    white-space: normal;
    width: min-content;
    margin-inline: auto;
    font-size: min(calc((100vw - 2 * clamp(1.25rem, 4vw, 3.5rem)) / 1.37), 27svh, calc((100svh - 26.5rem) / 1.6));
  }
`;

/* La foto se apoya en el borde de abajo, corrida a la derecha para dejar lugar al copy. */
const HeroFigure = styled.div`
  position: absolute;
  z-index: 2;
  bottom: 0;
  /* Dentro del ancho de 1320 px, como el resto: en pantallas anchas no se va al borde de la ventana. */
  right: calc(${pad} + clamp(0rem, 4vw, 4rem));
  height: min(calc(100svh - 5rem), 62vw, 66rem);
  aspect-ratio: 722 / 964;

  img {
    display: block;
    width: 100%;
    height: 100%;
  }

  @media (max-width: 860px) {
    right: auto;
    /* Centrada y corrida 6,5 %: la cara está a la izquierda del centro de la foto y así queda en el eje de la pantalla. */
    left: 50%;
    translate: -43.5% 0;
    /* Anclada abajo; puede tapar parte del nombre (Alexis, 2026-11-03: no importa si la foto pisa el título). */
    height: min(72svh, 125vw);
    /* El copy se apoya sobre el torso: la foto se funde en el fondo. */
    -webkit-mask-image: linear-gradient(#000 38%, transparent 80%);
    mask-image: linear-gradient(#000 38%, transparent 80%);
  }
`;

const Guides = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: visible;
  pointer-events: none;
`;

const HeroCopy = styled.div`
  position: relative;
  /* Sobre la foto y las piezas del frente del DepthField (z-index 3): el texto no se tapa. */
  z-index: 4;
  padding-bottom: clamp(2.5rem, 7vh, 4.5rem);
  /* Reserva el alto del nombre: en pantallas bajas el hero crece en vez de montar el copy sobre "ALEXIS". */
  margin-top: calc(var(--name-top) + 0.8 * var(--name-size) - 6.5rem + 2rem);

  @media (max-width: 860px) {
    margin-top: 0;
    /* Despeja el botón redondo del chat (56 px a 16 px del borde). */
    padding-bottom: 4.75rem;
  }
`;

const HeroText = styled.div`
  position: relative;
  z-index: 1;
  display: grid;
  gap: 1.3rem;
  max-width: min(30rem, 36vw);

  @media (max-width: 860px) {
    max-width: 34rem;
    gap: 0.85rem;
  }
`;

const HeroRole = styled.p`
  && {
    font-size: clamp(1.6rem, 1.1rem + 1.6vw, 2.5rem);
    line-height: 1.12;
    color: ${INK.cream};
    letter-spacing: -0.01em;

    @media (max-width: 860px) {
      font-size: 1.45rem;
    }
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
  --section-pad: clamp(5rem, 14vh, 9rem) ${pad};
  position: relative;
  padding: var(--section-pad);
  scroll-margin-top: 4rem;

  /* Con la almohada, el padding pasa adentro del canvas para que el fondo también se hunda. */
  &:has(> [data-almohada]) {
    padding: 0;
  }

  /* Servicios sube debajo del Portal, que termina de apagarse cuando su borde llega arriba: el ancla cae ahí.
     El padding de la sección ya despeja la nav. */
  &#services {
    scroll-margin-top: 0;
  }

  /* El pin del cubo no puede arrancar antes de que el borde llegue arriba. En pantallas altas el padding baja la grilla
     hasta el centro del alto que deja la nav: así ya está centrada cuando se fija. */
  @media ${CUBE} {
    &#services {
      padding-top: max(clamp(5rem, 14vh, 9rem), calc((6rem + 100vh) / 2 - ${CARD_H} / 2));
    }
  }

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
      border-radius: clamp(1.5rem, 4vw, 3.5rem) clamp(1.5rem, 4vw, 3.5rem) 0 0;
      box-shadow: 0 -2rem 4rem rgba(0, 0, 0, 0.45);
    `}

  /* La sección que sigue a la que tapa al hero también es opaca y va encima: el hero fijo no asoma por debajo
     y la que tapa no necesita un viewport de alto. */
  [data-overlap] + & {
    z-index: 2;
    background: ${INK.ground};
  }

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
      /* Pasos a la izquierda y palabra a la derecha con el mismo ancho y el mismo hueco: la maqueta queda en el eje de la página. */
      @media (min-width: 1440px) {
        #cubiq & {
          grid-template-columns: minmax(0, 1fr) 12rem;
          column-gap: clamp(2rem, 4vw, 3.5rem);
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
      /* Misma condición que el cubo de ServiceDeck, que pinea la grilla entera: la palabra se centra al lado del cubo y viaja con él. */
      @media ${CUBE} {
        position: static;
        align-self: center;
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

/* Con el cubo (Servicios) cada cara ya trae su título: el rótulo queda solo para lectores de pantalla. */
const Label = styled.h2<{ $hidden?: boolean }>`
  ${({ $hidden }) =>
    $hidden &&
    css`
      @media ${CUBE} {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
      }
    `}
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
