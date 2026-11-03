import React, { useEffect, useLayoutEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import PosterGlobalOnce from './PosterGlobal';
import ConstructedWord from './ConstructedWord';
import { CASE_PATH, CASES, type CaseSlug, type Piece } from './cases';
import { FONT, HERO, INK } from './content';

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

const MOTION = '(prefers-reduced-motion: no-preference)';
/* Desktop con movimiento: las piezas viajan en una fila pineada. En cualquier otro caso, carrusel nativo. */
const PIN = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';
const ORDER: CaseSlug[] = ['xcons', 'fusionads', 'bandit'];
// Margen lateral con tope: en pantallas anchas el contenido no pasa de 1320px.
const pad = 'max(clamp(1.25rem, 4vw, 3.5rem), calc((100% - 1320px) / 2))';
const cream = (a: number) => `rgba(239, 230, 200, ${a})`;
const pad2 = (n: number) => String(n).padStart(2, '0');
/* Una captura más alta que el marco se recorre adentro en vez de recortarse. */
const isTall = (p: Piece) => p.h / p.w > 1.1;

/* ---------- movimiento ---------- */

const useCaseMotion = (root: React.RefObject<HTMLDivElement>) => {
  useLayoutEffect(() => {
    const scope = root.current;
    if (!scope) return;
    const q = gsap.utils.selector(scope);
    const mm = gsap.matchMedia(scope);

    mm.add(MOTION, () => {
      // Entrada: la palabra se construye trazo por trazo mientras el texto sube. Una sola ola, menos de 1,2 s.
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .fromTo(
          q('[data-hero-word] [data-stroke]'),
          { drawSVG: '0% 0%' },
          { drawSVG: '0% 100%', duration: 0.8, ease: 'power2.inOut', stagger: 0.07 }
        )
        .from(q('[data-hero-word] [data-ring]'), { scale: 0, transformOrigin: '50% 50%', duration: 0.5, ease: 'back.out(2)' }, 0.45)
        .from(q('[data-hero-text] > *'), { opacity: 0, y: 24, duration: 0.6, stagger: 0.06 }, 0.15);

      // Viaje hacia adentro del mockup: crece hasta llenar la pantalla.
      const dive = q('[data-dive]')[0];
      if (dive) {
        gsap.fromTo(
          q('[data-dive-frame]'),
          { scale: 0.72, borderRadius: '1.2rem' },
          {
            scale: 1,
            borderRadius: '0rem',
            ease: 'none',
            scrollTrigger: { trigger: dive, start: 'top 85%', end: 'top 5%', scrub: true },
          }
        );
      }

      // Palabras que se dibujan con el scroll (el link al siguiente caso).
      q('[data-scrub-word]').forEach(word => {
        gsap.fromTo(
          word.querySelectorAll('[data-stroke]'),
          { drawSVG: '0% 0%' },
          { drawSVG: '0% 100%', ease: 'none', stagger: 0.1, scrollTrigger: { trigger: word, start: 'top 90%', end: 'clamp(top 35%)', scrub: 0.6 } }
        );
      });

      // Bloques de texto: solo opacity (no autoAlpha) para que sigan enfocables.
      const reveal = q('[data-reveal]');
      gsap.set(reveal, { opacity: 0, y: 28 });
      ScrollTrigger.batch(reveal, {
        start: 'top 88%',
        once: true,
        onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.07 }),
      });

      // Sellos de resultados: caen y se asientan con su giro.
      gsap.from(q('[data-stamp]'), {
        opacity: 0,
        scale: 1.3,
        duration: 0.5,
        ease: 'back.out(1.6)',
        stagger: 0.12,
        scrollTrigger: { trigger: q('[data-stamps]')[0], start: 'top 80%', once: true },
      });
    });

    mm.add(PIN, () => {
      const pin = q('[data-pieces-pin]')[0];
      const track = q('[data-pieces-track]')[0];
      if (!pin || !track) return;
      // El atributo pasa el track de carrusel a fila: va antes de medir.
      pin.dataset.pinned = '';
      const distance = () => Math.max(0, track.scrollWidth - pin.clientWidth);
      track.removeAttribute('tabindex');
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: pin,
          pin: true,
          scrub: 0.8,
          start: 'top top',
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          // Va primero en el refresh: los triggers de abajo miden con el espacio que suma el pin.
          refreshPriority: 1,
        },
      });
      // Con el track trasladado, el foco por teclado puede caer fuera de vista: se scrollea hasta la pieza.
      const onFocus = (e: Event) => {
        const piece = (e.target as HTMLElement).closest('li');
        const st = tween.scrollTrigger;
        if (!piece || !st) return;
        const x = gsap.utils.clamp(0, distance(), piece.offsetLeft - (pin.clientWidth - piece.offsetWidth) / 2);
        window.scrollTo({ top: st.start + x, behavior: 'auto' });
      };
      pin.addEventListener('focusin', onFocus);
      return () => {
        pin.removeEventListener('focusin', onFocus);
        delete pin.dataset.pinned;
        track.setAttribute('tabindex', '0');
      };
    });

    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => mm.revert();
  }, [root]);
};

/* Los videos arrancan solo en pantalla y nunca con reduced motion. Siempre llevan controles para pausarlos. */
const useInViewVideos = (root: React.RefObject<HTMLDivElement>) => {
  useEffect(() => {
    const scope = root.current;
    if (!scope || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const io = new IntersectionObserver(
      entries =>
        entries.forEach(({ target, isIntersecting }) => {
          const video = target as HTMLVideoElement;
          if (isIntersecting) video.play().catch(() => undefined);
          else video.pause();
        }),
      { threshold: 0.4 }
    );
    scope.querySelectorAll('video').forEach(v => io.observe(v));
    return () => io.disconnect();
  }, [root]);
};

/* ---------- piezas ---------- */

const PieceMedia: React.FC<{ piece: Piece }> = ({ piece }) => {
  if (piece.video) {
    return (
      <video
        src={piece.video}
        poster={piece.src}
        muted
        loop
        playsInline
        preload="none"
        controls
        aria-label={piece.title}
        width={piece.w}
        height={piece.h}
      />
    );
  }
  return <img src={piece.src} alt={piece.title} width={piece.w} height={piece.h} loading="lazy" decoding="async" />;
};

/* ---------- página ---------- */

const CaseStudy: React.FC<{ slug: CaseSlug }> = ({ slug }) => {
  const root = useRef<HTMLDivElement>(null);
  const c = CASES[slug];
  const next = CASES[c.next];

  // Cada caso arranca arriba: el router no restaura el scroll.
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
    const prev = document.title;
    document.title = `${c.name} | ${HERO.name}`;
    return () => {
      document.title = prev;
    };
  }, [c.name]);

  useCaseMotion(root);
  useInViewVideos(root);

  return (
    <Page ref={root} style={{ '--accent': c.accent } as React.CSSProperties}>
      <PosterGlobalOnce />

      <Nav aria-label="Navegación">
        <Mark to="/" aria-label="Alexis Vedia, inicio">
          <ConstructedWord word="AV" cols={2} ink={INK.cream} accent={INK.red} />
        </Mark>
        <NavLink to="/#casos">Todos los casos</NavLink>
        <NavCta to="/#contact">Escribime</NavCta>
      </Nav>

      <main>
        <Hero aria-labelledby="case-title">
          <HeroWord data-hero-word="">
            <ConstructedWord word={c.word} cols={c.cols} ink={INK.cream} accent={c.accent} guides />
          </HeroWord>
          <HeroText data-hero-text="">
            <Index>
              Caso {pad2(ORDER.indexOf(slug) + 1)} / {pad2(ORDER.length)}
            </Index>
            <Title id="case-title">{c.name}</Title>
            <Meta>
              <span>{c.years}</span>
              <span>{c.role}</span>
            </Meta>
            <p>{c.lead}</p>
            <Logo src={c.logo} alt="" width={140} height={40} />
          </HeroText>
        </Hero>

        <Dive data-dive="">
          <DiveFrame data-dive-frame="">
            <Bar aria-hidden="true">
              <i />
              <i />
              <i />
              <b />
            </Bar>
            <img src={c.hero.src} alt={c.hero.alt} width={c.hero.w} height={c.hero.h} fetchPriority="high" />
          </DiveFrame>
        </Dive>

        <Tools aria-label="Herramientas">
          <Marquee>
            {[0, 1].map(copy => (
              <ul key={copy} aria-hidden={copy === 1 ? true : undefined}>
                {c.tools.map(tool => (
                  <li key={tool}>{tool}</li>
                ))}
              </ul>
            ))}
          </Marquee>
        </Tools>

        <Tasks aria-labelledby="tasks-title">
          <SectionTitle id="tasks-title" data-reveal="">
            Qué hice
          </SectionTitle>
          <TaskList>
            {c.tasks.map((task, i) => (
              <li key={task} data-reveal="">
                <TaskNum aria-hidden="true">{pad2(i + 1)}</TaskNum>
                <span>{task}</span>
              </li>
            ))}
          </TaskList>
        </Tasks>

        <Pieces aria-labelledby="pieces-title">
          <PiecesPin data-pieces-pin="">
            <PiecesHead>
              <SectionTitle id="pieces-title">Piezas</SectionTitle>
              <Hint>{c.pieces.some(isTall) ? 'Las capturas largas se recorren adentro del marco.' : `${c.pieces.length} piezas del proyecto.`}</Hint>
            </PiecesHead>
            <Track data-pieces-track="" tabIndex={0} aria-label="Piezas, desplazá para ver más">
              {c.pieces.map((piece, i) => (
                <Card key={piece.title}>
                  <Shot>
                    <Bar aria-hidden="true">
                      <i />
                      <i />
                      <i />
                      <b />
                    </Bar>
                    <ShotBox $tall={isTall(piece)} tabIndex={isTall(piece) ? 0 : undefined} aria-label={isTall(piece) ? `${piece.title}, captura completa` : undefined}>
                      <PieceMedia piece={piece} />
                    </ShotBox>
                  </Shot>
                  <Caption>
                    <PieceNum aria-hidden="true">{pad2(i + 1)}</PieceNum>
                    <h3>{piece.title}</h3>
                    <p>{piece.text}</p>
                  </Caption>
                </Card>
              ))}
            </Track>
          </PiecesPin>
        </Pieces>

        <Results aria-labelledby="results-title">
          <SectionTitle id="results-title" data-reveal="">
            Resultados
          </SectionTitle>
          <Stamps data-stamps="">
            {c.results.map((r, i) => (
              <Stamp key={r.text} data-stamp="" $i={i}>
                <strong>{r.big}</strong>
                <span>{r.text}</span>
              </Stamp>
            ))}
          </Stamps>
        </Results>

        <Next to={CASE_PATH[next.slug]} style={{ '--next': next.accent } as React.CSSProperties}>
          <NextWord data-scrub-word="">
            <ConstructedWord word={next.word} cols={next.cols} ink={INK.cream} accent={next.accent} />
          </NextWord>
          <NextText>
            <small>Siguiente caso</small>
            <span>{next.name}</span>
            <em aria-hidden="true">→</em>
          </NextText>
        </Next>
      </main>

      <Footer>
        <span>{HERO.name}</span>
        <Link to="/">Volver al inicio</Link>
      </Footer>
    </Page>
  );
};

export default CaseStudy;

/* ---------- estilos ---------- */

const desktop = '@media (min-width: 1024px)';

const Page = styled.div`
  --poster-ground: ${INK.ground};
  position: relative;
  background: ${INK.ground};
  color: ${INK.cream};
  font-family: ${FONT.text};
  font-size: clamp(1rem, 0.94rem + 0.25vw, 1.15rem);
  line-height: 1.55;
  overflow-x: clip;

  p {
    margin: 0;
    max-width: 62ch;
    color: ${cream(0.82)};
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

const pill = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 2.6rem;
  padding: 0 1.4rem;
  border-radius: 999px;
  font-size: 1rem;
  text-decoration: none;
  transition: background-color 0.25s ease, color 0.25s ease, transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1);

  &:active {
    transform: scale(0.97);
  }
`;

const Nav = styled.nav`
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: clamp(1rem, 2.4vw, 2rem);
  padding: 0.9rem ${pad};
  background: rgba(13, 12, 11, 0.86);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid ${cream(0.08)};
`;

const Mark = styled(Link)`
  display: block;
  width: 3.4rem;
  flex: none;

  svg {
    display: block;
    width: 100%;
  }
`;

const NavLink = styled(Link)`
  margin-left: auto;
  color: ${INK.cream};
  text-decoration: none;
  font-size: 0.95rem;

  &:hover {
    color: var(--accent);
  }
`;

const NavCta = styled(Link)`
  ${pill}
  background: ${INK.red};
  color: ${INK.ground};

  &:hover {
    background: ${INK.cream};
  }
`;

const Hero = styled.section`
  display: grid;
  gap: clamp(2rem, 5vw, 5rem);
  align-items: center;
  min-height: 86svh;
  padding: 8rem ${pad} clamp(3rem, 6vw, 5rem);

  ${desktop} {
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  }
`;

const HeroWord = styled.div`
  width: min(100%, 34rem);

  svg {
    display: block;
    width: 100%;
  }

  /* La grilla de construcción aparece solo al pasar el mouse, como en la home. */
  [data-guide] {
    opacity: 0;
    transition: opacity 0.4s ease;
  }
  &:hover [data-guide] {
    opacity: 0.6;
  }
`;

const HeroText = styled.div`
  display: grid;
  gap: 1.1rem;
  justify-items: start;
`;

const Index = styled.span`
  font-size: 0.9rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
`;

const Title = styled.h1`
  margin: 0;
  font-family: ${FONT.display};
  font-weight: 900;
  font-size: clamp(5rem, 3rem + 9vw, 11rem);
  line-height: 0.82;
  letter-spacing: 0.005em;
  text-transform: uppercase;
`;

const Meta = styled.p`
  && {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem 0.8rem;
    color: ${INK.cream};
  }

  span + span::before {
    content: '';
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    margin-right: 0.8rem;
    border-radius: 50%;
    background: var(--accent);
    vertical-align: middle;
  }
`;

const Logo = styled.img`
  width: auto;
  height: 2rem;
  margin-top: 0.6rem;
  opacity: 0.85;
  filter: brightness(0) invert(0.92) sepia(0.2);
`;

const Dive = styled.section`
  padding: 0 ${pad} clamp(4rem, 8vw, 7rem);
`;

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  height: clamp(1.5rem, 2.2vw, 2rem);
  padding: 0 0.75rem;
  background: #221f1b;

  i {
    width: 0.62rem;
    height: 0.62rem;
    border-radius: 50%;
    background: ${cream(0.35)};
  }
  i:first-child {
    background: var(--accent);
  }
  b {
    flex: 0 1 45%;
    height: 0.85rem;
    margin-left: 0.6rem;
    border-radius: 999px;
    background: ${cream(0.08)};
  }
`;

const DiveFrame = styled.div`
  overflow: clip;
  border-radius: 1.2rem;
  background: #1a1816;
  box-shadow:
    0 0 0 1.5px ${cream(0.14)},
    0 40px 90px -30px rgba(0, 0, 0, 0.9);
  transform-origin: 50% 0%;

  img {
    display: block;
    width: 100%;
    height: auto;
  }
`;

const scroll = keyframes`
  to { transform: translateX(-50%); }
`;

const Tools = styled.section`
  overflow: clip;
  padding: 1.4rem 0;
  border-block: 1px solid ${cream(0.12)};
`;

const Marquee = styled.div`
  display: flex;
  width: max-content;
  animation: ${scroll} 38s linear infinite;

  ul {
    display: flex;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li {
    display: flex;
    align-items: center;
    gap: 2rem;
    padding-right: 2rem;
    font-family: ${FONT.display};
    font-weight: 700;
    font-size: clamp(2.6rem, 2rem + 2.4vw, 4.4rem);
    line-height: 1;
    text-transform: uppercase;
    white-space: nowrap;
  }

  li::after {
    content: '';
    width: 0.9rem;
    height: 0.9rem;
    border-radius: 50%;
    border: 4px solid var(--accent);
  }

  @media (prefers-reduced-motion: reduce) {
    width: auto;
    padding: 0 ${pad};
    animation: none;

    ul {
      flex-wrap: wrap;
    }
    ul + ul {
      display: none;
    }
  }
`;

const SectionTitle = styled.h2`
  && {
    color: inherit;
  }
  margin: 0;
  font-family: ${FONT.text};
  font-weight: 400;
  font-size: clamp(1.8rem, 1.2rem + 1.8vw, 3rem);
  line-height: 1;
  letter-spacing: -0.02em;
`;

const Tasks = styled.section`
  --poster-ground: var(--accent);
  --focus: ${INK.ground};
  display: grid;
  gap: clamp(2rem, 4vw, 3rem);
  padding: clamp(4rem, 9vw, 8rem) ${pad};
  background: var(--accent);
  color: ${INK.ground};

  ${desktop} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 2fr);
  }
`;

const TaskList = styled.ol`
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: grid;
    grid-template-columns: 4.5rem minmax(0, 1fr);
    gap: 1rem;
    align-items: baseline;
    padding: 1.3rem 0;
    border-top: 2px solid currentColor;
    font-size: clamp(1.25rem, 1rem + 1vw, 1.9rem);
    line-height: 1.2;
    letter-spacing: -0.01em;
  }
`;

const TaskNum = styled.span`
  font-family: ${FONT.display};
  font-weight: 900;
  font-size: clamp(2.6rem, 2rem + 2vw, 3.6rem);
  line-height: 0.8;
`;

const Pieces = styled.section`
  padding-top: clamp(4rem, 8vw, 7rem);
`;

const PiecesPin = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2rem;
  padding-bottom: clamp(3rem, 6vw, 5rem);

  &[data-pinned] {
    height: 100svh;
    align-content: center;
    padding-block: 5rem 2rem;
    overflow: clip;
  }
`;

const PiecesHead = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 ${pad};
`;

const Hint = styled.p`
  && {
    font-size: 0.95rem;
    color: ${cream(0.6)};
  }
`;

const Track = styled.ol`
  position: relative;
  display: flex;
  gap: clamp(1rem, 3vw, 2.5rem);
  margin: 0;
  padding: 0.5rem ${pad} 1.5rem;
  list-style: none;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: ${pad};
  overscroll-behavior-x: contain;

  [data-pinned] > & {
    width: max-content;
    overflow: visible;
    scroll-snap-type: none;
  }
`;

const Card = styled.li`
  display: grid;
  gap: 1rem;
  align-content: start;
  flex: none;
  width: min(84vw, 34rem);
  scroll-snap-align: start;

  ${desktop} {
    width: min(46vw, 44rem);
  }
`;

const Shot = styled.div`
  overflow: clip;
  border-radius: 0.9rem;
  background: #1a1816;
  box-shadow:
    0 0 0 1.5px ${cream(0.14)},
    0 30px 60px -26px rgba(0, 0, 0, 0.85);
`;

const ShotBox = styled.div<{ $tall: boolean }>`
  aspect-ratio: 16 / 10;
  overflow: clip;

  img,
  video {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 0%;
  }

  ${({ $tall }) =>
    $tall &&
    css`
      @media (hover: hover) {
        img {
          transition: object-position 7s cubic-bezier(0.45, 0, 0.55, 1);
        }
        &:hover img,
        &:focus-visible img {
          object-position: 50% 100%;
        }
      }

      /* En pantallas táctiles la captura larga se recorre con el dedo, adentro del marco. */
      @media (hover: none) {
        overflow-y: auto;
        overscroll-behavior: contain;

        img {
          height: auto;
        }
      }
    `}
`;

const Caption = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 0.3rem 1rem;

  h3 {
    font-size: clamp(1.2rem, 1rem + 0.6vw, 1.6rem);
    line-height: 1.15;
  }

  p {
    grid-column: 2;
    font-size: 0.98rem;
  }
`;

const PieceNum = styled.span`
  grid-row: span 2;
  font-family: ${FONT.display};
  font-weight: 900;
  font-size: 2.6rem;
  line-height: 0.85;
  color: var(--accent);
`;

const Results = styled.section`
  display: grid;
  gap: clamp(2rem, 5vw, 4rem);
  padding: clamp(4rem, 9vw, 8rem) ${pad};
  border-top: 1px solid ${cream(0.1)};
`;

const Stamps = styled.ul`
  display: grid;
  gap: clamp(1.5rem, 4vw, 3rem);
  margin: 0;
  padding: 0;
  list-style: none;

  @media (min-width: 720px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

const TILTS = [-4, 3, -2];

const Stamp = styled.li<{ $i: number }>`
  display: grid;
  gap: 0.8rem;
  align-content: center;
  justify-items: center;
  aspect-ratio: 1;
  width: min(100%, 15rem);
  margin-inline: auto;
  padding: 1.8rem;

  @media (min-width: 720px) {
    width: min(100%, 20rem);
    padding: 2.4rem;
  }
  border: 4px solid var(--accent);
  border-radius: 50%;
  text-align: center;
  rotate: ${({ $i }) => TILTS[$i % TILTS.length]}deg;
  box-shadow: inset 0 0 0 10px ${INK.ground}, inset 0 0 0 12px ${cream(0.2)};

  strong {
    font-family: ${FONT.display};
    font-weight: 900;
    font-size: clamp(2.8rem, 2.2rem + 3vw, 5.6rem);
    line-height: 0.85;
    color: var(--accent);
    text-transform: uppercase;
  }

  span {
    max-width: 16ch;
    font-size: 1rem;
    line-height: 1.3;
  }
`;

const Next = styled(Link)`
  display: grid;
  gap: clamp(1.5rem, 4vw, 4rem);
  align-items: end;
  padding: clamp(4rem, 9vw, 8rem) ${pad};
  border-top: 1px solid ${cream(0.1)};
  color: ${INK.cream};
  text-decoration: none;
  transition: background-color 0.4s ease, color 0.4s ease;

  &:hover {
    background: var(--next);
    color: ${INK.ground};
  }

  ${desktop} {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
`;

const NextWord = styled.div`
  width: min(100%, 26rem);

  svg {
    display: block;
    width: 100%;
  }
`;

const NextText = styled.div`
  display: grid;
  gap: 0.6rem;

  small {
    font-size: 0.95rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  span {
    font-family: ${FONT.display};
    font-weight: 900;
    font-size: clamp(4rem, 2.6rem + 7vw, 9rem);
    line-height: 0.82;
    text-transform: uppercase;
  }

  em {
    font-style: normal;
    font-size: 2.4rem;
    line-height: 1;
    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  ${Next}:hover & em {
    transform: translateX(0.8rem);
  }
`;

const Footer = styled.footer`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
  padding: 2rem ${pad} 2.5rem;
  border-top: 1px solid ${cream(0.1)};
  font-size: 0.9rem;
  color: ${cream(0.55)};

  a {
    color: inherit;
  }
`;
