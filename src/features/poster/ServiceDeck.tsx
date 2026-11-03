import React, { useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import i18n from 'i18next';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react';
import LandingVideo from '@/features/landing/LandingVideo';
import { SERVICES, type Service } from '@/features/landing/Landing';
import { FONT, INK } from './content';

gsap.registerPlugin(ScrollTrigger);

/* Mismo criterio que PosterHome: la página es solo en español. */
const t = i18n.getFixedT('es');

const MOTION = '(prefers-reduced-motion: no-preference)';
const REDUCE = '(prefers-reduced-motion: reduce)';
/* 860 es el corte donde el Poster pasa a una columna. */
const MOBILE = '(max-width: 860px)';
/* El stack sticky necesita que la card entre entera en la pantalla; más bajo queda una lista común. */
const STACK = '(min-width: 861px) and (min-height: 601px)';
const FINE = '(hover: hover) and (pointer: fine)';
/* Desktop con movimiento: las cuatro cards son las caras de un cubo que gira con el scroll. */
const CUBE = `${STACK} and ${MOTION}`;
/* Alto de la card pegada: 6rem de nav y aire abajo. */
const CARD_H = 'min(calc(100svh - 9.5rem), 46rem)';
/* Mismo margen lateral que las secciones de PosterHome (no se importa: PosterHome importa este archivo). */
// Margen lateral con tope: en pantallas anchas el contenido no pasa de 1320px.
const pad = 'max(clamp(1.25rem, 4vw, 3.5rem), calc((100% - 1320px) / 2))';
const cardPad = 'clamp(1.1rem, 3.2vw, 2rem)';

/* Una tinta por card. Las cuatro pasan 4,5:1 con texto INK.ground encima; teal y violet no, por eso quedan afuera. */
const ACCENT: Record<Service['key'], string> = {
  ai: INK.lime,
  front: INK.blue,
  wp: INK.orange,
  design: INK.red,
};

const pad2 = (n: number) => String(n).padStart(2, '0');

/* La card muestra solo la primera oración del texto de i18n; el detalle vive en la página del caso. */
const lead = (text: string) => text.match(/^.*?\.(?=\s|$)/)?.[0] ?? text;

/**
 * Scroll de la ventana en el que la card i queda pegada arriba. Se mide desde el <ul>, que no se mueve:
 * los <li> sticky cambian de lugar con el scroll y medirlos directo da posiciones falsas.
 */
const stuckY = (list: HTMLElement, i: number) => {
  const cards = Array.from(list.children) as HTMLElement[];
  const gap = parseFloat(getComputedStyle(list).rowGap) || 0;
  const flow = cards.slice(0, i).reduce((y, c) => y + c.offsetHeight + gap, 0);
  return (
    list.getBoundingClientRect().top +
    window.scrollY +
    flow -
    (parseFloat(getComputedStyle(cards[i]).top) || 0)
  );
};

/**
 * Servicios como mazo de afiches.
 * Mobile: carrusel con scroll-snap, botones grandes y "02 / 04"; cambiar de servicio nunca obliga a volver arriba.
 * Desktop: stack sticky; cada card tapa a la anterior, que se achica y se oscurece. Spotlight con el mouse.
 */
const ServiceDeck: React.FC = () => {
  const listRef = useRef<HTMLUListElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const cubeRef = useRef<ScrollTrigger | null>(null);
  const [active, setActive] = useState(0);
  const total = SERVICES.length;

  useLayoutEffect(() => {
    const list = listRef.current;
    const wrap = wrapRef.current;
    if (!list || !wrap) return;
    const mm = gsap.matchMedia(list);

    // Cubo: el <ul> gira 90° por servicio con el scroll; cada card es una cara a media arista del centro.
    mm.add(CUBE, () => {
      const cards = Array.from(list.children) as HTMLElement[];
      const turns = cards.length - 1;
      const half = () => list.offsetWidth / 2;
      list.dataset.cube = '';
      // Las cuatro caras ocupan la misma celda y todas "se ven" para el IntersectionObserver: solo corre el video de frente.
      const videos = cards.map(c => c.querySelector('video'));
      let front = 0; // Antes del pin, la cara de frente es la primera.
      const playFront = (i: number) => {
        if (i === front) return;
        front = i;
        videos.forEach((v, j) => {
          if (!v) return;
          if (j !== i) return v.pause();
          if (v.ended) v.currentTime = 0;
          v.play().catch(() => {});
        });
      };
      // El observer de LandingVideo puede dar play después: una cara de costado se vuelve a pausar.
      const offs = videos.map((v, j) => {
        if (!v) return () => {};
        const hold = () => {
          if (j !== front) v.pause();
        };
        v.addEventListener('play', hold);
        return () => v.removeEventListener('play', hold);
      });
      const setHalf = () => list.style.setProperty('--half', `${half()}px`);
      setHalf();
      gsap.set(wrap, { perspective: 2400 });

      // z negativo: la cara de frente queda en el plano de la página y no se agranda con la perspectiva.
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: wrap,
          pin: true,
          // Centrado en el alto que deja la nav (6rem; ScrollTrigger no entiende rem).
          start: () => `center ${(parseFloat(getComputedStyle(document.documentElement).fontSize) * 6 + window.innerHeight) / 2}px`,
          end: () => `+=${Math.round(window.innerHeight * 0.8 * turns)}`,
          scrub: 0.6,
          snap: { snapTo: (v: number) => Math.round(v * turns) / turns, inertia: false, delay: 0.15, duration: { min: 0.2, max: 0.5 }, ease: 'power2.inOut' },
          invalidateOnRefresh: true,
          // Los pins de arriba pueden crearse después (otro breakpoint): sin prioridad, este start no los descuenta.
          refreshPriority: 1,
          onRefresh: setHalf,
          onUpdate: self => playFront(Math.round(self.progress * turns)),
        },
      });
      cubeRef.current = tl.scrollTrigger ?? null;
      // Giran las caras, no el <ul>: con el <ul> de canto (-90°, -270°) Chrome no detecta el clic en la cara de frente.
      tl.fromTo(list, { '--turn': '0deg' }, { '--turn': `${-90 * turns}deg`, duration: turns }, 0);
      // En cada giro el cubo se aleja un poco y vuelve, como un carrusel que toma impulso.
      for (let i = 0; i < turns; i++) {
        tl.to(list, { scale: 0.88, duration: 0.5, ease: 'sine.out' }, i).to(
          list,
          { scale: 1, duration: 0.5, ease: 'sine.in' },
          i + 0.5
        );
      }
      cards.forEach((card, i) => {
        if (i > 0) tl.from(card.querySelector('[data-deck-num]'), { yPercent: 55, duration: 1 }, i - 1);
      });

      return () => {
        offs.forEach(off => off());
        cubeRef.current = null;
        delete list.dataset.cube;
        list.style.removeProperty('--half');
      };
    });

    return () => mm.revert();
  }, []);

  const go = (to: number, focus = false) => {
    const list = listRef.current;
    if (!list) return;
    const cards = Array.from(list.children) as HTMLElement[];
    const card = cards[(to + total) % total];
    list.scrollTo({
      left: card.offsetLeft - cards[0].offsetLeft,
      behavior: window.matchMedia(REDUCE).matches ? 'auto' : 'smooth',
    });
    if (focus) card.querySelector('a')?.focus({ preventScroll: true });
  };

  const onScroll = (e: React.UIEvent<HTMLUListElement>) => {
    const list = e.currentTarget;
    const cards = Array.from(list.children) as HTMLElement[];
    const step = cards[1].offsetLeft - cards[0].offsetLeft;
    if (step > 0) setActive(Math.min(total - 1, Math.round(list.scrollLeft / step)));
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const dir = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!dir || !window.matchMedia(MOBILE).matches) return;
    e.preventDefault();
    go(active + dir, true);
  };

  // Con Shift + Tab el foco puede caer en una card tapada por la siguiente: se scrollea hasta que quede arriba.
  // En el cubo, se gira hasta la cara enfocada.
  const onFocus = (i: number) => (e: React.FocusEvent<HTMLLIElement>) => {
    const cube = cubeRef.current;
    if (cube) {
      // Con mouse el foco llega en el mousedown: scrollear ahí saca el link de abajo del puntero.
      if (!(e.target as Element).matches(':focus-visible')) return;
      window.scrollTo({ top: cube.start + ((cube.end - cube.start) * i) / (total - 1), behavior: 'auto' });
      return;
    }
    const list = listRef.current;
    const next = e.currentTarget.nextElementSibling;
    if (!list || !next || !window.matchMedia(STACK).matches) return;
    if ((e.target as Element).getBoundingClientRect().bottom <= next.getBoundingClientRect().top)
      return;
    window.scrollTo({ top: stuckY(list, i), behavior: 'auto' });
  };

  const onPointerMove = (e: React.PointerEvent<HTMLLIElement>) => {
    if (e.pointerType !== 'mouse') return;
    const el = e.currentTarget;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  };

  // Los clips no tienen loop y quedan en el último cuadro: el hover los vuelve a armar.
  const onPointerEnter = (e: React.PointerEvent<HTMLLIElement>) => {
    if (e.pointerType !== 'mouse' || window.matchMedia(REDUCE).matches) return;
    const video = e.currentTarget.querySelector('video');
    if (!video?.ended) return;
    video.currentTime = 0;
    video.play().catch(() => {});
  };

  const current = SERVICES[active];

  return (
    <Wrap ref={wrapRef}>
      <Deck
        ref={listRef}
        role="list"
        aria-label="Servicios"
        onScroll={onScroll}
        onKeyDown={onKeyDown}
      >
        {SERVICES.map((s, i) => {
          const title = t(`landing.${s.key}Title`);
          const alt = t(`landing.${s.key}Alt`);
          return (
            <Card
              key={s.key}
              data-active={i === active}
              style={{ '--accent': ACCENT[s.key], '--i': i } as React.CSSProperties}
              onFocus={onFocus(i)}
              onPointerMove={onPointerMove}
              onPointerEnter={onPointerEnter}
            >
              <Head>
                <Title>{title}</Title>
                <Num data-deck-num="" aria-hidden="true">
                  {pad2(i + 1)}
                  <small>/{pad2(total)}</small>
                </Num>
              </Head>
              <Line>{lead(t(`landing.${s.key}Text`))}</Line>
              <MediaBox>
                <Frame>
                  {s.media.video ? (
                    <LandingVideo
                      src={s.media.video}
                      poster={s.media.poster}
                      label={alt}
                      loop={s.media.loop}
                    />
                  ) : (
                    <img src={s.media.image} alt={alt} loading="lazy" decoding="async" />
                  )}
                </Frame>
                <Badge aria-hidden="true">
                  <s.Icon strokeWidth={2} />
                </Badge>
              </MediaBox>
              <Foot>
                <Chips role="list" aria-label="Herramientas">
                  {s.tags.map(tag => (
                    <li key={tag}>{tag}</li>
                  ))}
                </Chips>
                <More to={s.to} aria-label={`${t('landing.learnMore')}: ${title}`}>
                  {t('landing.learnMore')}
                  <ArrowUpRight aria-hidden="true" />
                </More>
              </Foot>
              <Shade data-deck-shade="" aria-hidden="true" />
            </Card>
          );
        })}
      </Deck>

      <Controls>
        <StepButton type="button" aria-label="Servicio anterior" onClick={() => go(active - 1)}>
          <ArrowLeft aria-hidden="true" />
        </StepButton>
        <Meter aria-hidden="true">
          <Count>
            {pad2(active + 1)} / {pad2(total)}
          </Count>
          <Dots>
            {SERVICES.map((s, i) => (
              <Dot
                key={s.key}
                $on={i === active}
                style={{ '--accent': ACCENT[s.key] } as React.CSSProperties}
              />
            ))}
          </Dots>
        </Meter>
        <StepButton type="button" aria-label="Servicio siguiente" onClick={() => go(active + 1)}>
          <ArrowRight aria-hidden="true" />
        </StepButton>
        <SrOnly aria-live="polite">
          Servicio {active + 1} de {total}: {t(`landing.${current.key}Title`)}
        </SrOnly>
      </Controls>
    </Wrap>
  );
};

export default ServiceDeck;

/* ---------- estilos ---------- */

const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;

const Wrap = styled.div`
  display: grid;
  gap: 1.25rem;
  min-width: 0;
`;

const Deck = styled.ul`
  position: relative;
  display: flex;
  margin: 0;
  padding: 0;
  list-style: none;

  @media ${MOBILE} {
    gap: 0.75rem;
    /* Carrusel de borde a borde; el padding vertical deja lugar al outline de foco. */
    margin-inline: calc(-1 * ${pad});
    padding: 0.5rem ${pad} 0.75rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-padding-inline: ${pad};
    overscroll-behavior-x: contain;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  &[data-cube] {
    display: grid;
    transform-style: preserve-3d;
    /* La cara de frente comparte el plano del <ul>: sin esto, el redondeo a veces deja el clic en la lista. */
    pointer-events: none;
  }

  @media (min-width: 861px) {
    flex-direction: column;
    /* Cuánto scroll queda la card entera a la vista antes de que llegue la siguiente. */
    gap: clamp(3rem, 14svh, 9rem);
  }
`;

const Card = styled.li`
  container-type: inline-size;
  position: relative;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  gap: clamp(0.9rem, 2.2vh, 1.25rem);
  padding: ${cardPad};
  border-radius: clamp(1.25rem, 2.4vw, 2rem);
  overflow: hidden;
  background: var(--accent);
  color: ${INK.ground};
  transform-origin: 50% 0;

  /* Spotlight: luz blanca en soft-light que sigue al mouse. */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 2;
    pointer-events: none;
    background: radial-gradient(
      circle 24rem at var(--mx, 50%) var(--my, 30%),
      rgba(255, 255, 255, 0.6),
      transparent 70%
    );
    mix-blend-mode: soft-light;
    opacity: 0;
    transition: opacity 0.4s ease;
  }

  @media ${FINE} {
    &:hover::after {
      opacity: 1;
    }
  }

  @media ${MOBILE} {
    flex: 0 0 calc(100% - 2.75rem);
    scroll-snap-align: start;
  }

  @media ${MOBILE} and ${MOTION} {
    [data-deck-num] {
      transition: transform 0.7s cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    &[data-active='false'] [data-deck-num] {
      transform: translateY(45%);
    }
  }

  @media ${STACK} {
    position: sticky;
    top: calc(6rem + var(--i) * 0.75rem);
    /* 6rem de nav, 3 x 0,75rem de escalones y aire abajo: la card entra entera en la pantalla. */
    height: ${CARD_H};
  }

  /* Cara del cubo: todas en la misma celda, giradas 90° entre sí y a media arista del centro. */
  [data-cube] > & {
    position: relative;
    top: auto;
    grid-area: 1 / 1;
    height: ${CARD_H};
    transform: translateZ(calc(-1 * var(--half, 0px))) rotateY(calc(var(--i) * 90deg + var(--turn, 0deg)))
      translateZ(var(--half, 0px));
    backface-visibility: hidden;
    pointer-events: auto;
  }
`;

const Head = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem;
`;

const Title = styled.h3`
  && {
    margin: 0;
    font-family: ${FONT.display};
    font-weight: 800;
    min-width: 0;
    font-size: clamp(2.2rem, 11cqi, 5.4rem);
    line-height: 0.86;
    letter-spacing: 0.01em;
    text-transform: uppercase;
    text-wrap: balance;
    /* Si una palabra no entra al lado del número, se corta antes que empujarlo fuera de la card. */
    overflow-wrap: anywhere;
    color: ${INK.ground};
  }
`;

const Num = styled.span`
  flex: none;
  display: flex;
  align-items: flex-end;
  margin: 0 -0.03em 0 0;
  font-family: ${FONT.display};
  font-weight: 900;
  font-size: clamp(6.5rem, 30cqi, 13rem);
  line-height: 0.8;
  color: transparent;
  -webkit-text-stroke: clamp(1.5px, 0.5cqi, 3px) ${INK.ground};

  small {
    margin: 0 0 0.35em 0.15em;
    font-family: ${FONT.text};
    font-size: 0.85rem;
    line-height: 1;
    color: ${INK.ground};
    -webkit-text-stroke: 0;
  }
`;

const Line = styled.p`
  && {
    margin: 0;
    max-width: 42ch;
    font-size: clamp(0.98rem, 0.92rem + 0.3vw, 1.12rem);
    line-height: 1.4;
    color: ${INK.ground};
  }
`;

const MediaBox = styled.div`
  position: relative;
  aspect-ratio: 16 / 10;

  @media ${STACK} {
    flex: 1 1 0;
    /* En pantallas bajas cede alto para que el pie de la card no se corte. */
    min-height: min(7rem, 11svh);
    aspect-ratio: auto;
  }
`;

const Frame = styled.div`
  position: absolute;
  inset: 0;
  border-radius: clamp(0.8rem, 1.6vw, 1.25rem);
  overflow: hidden;
  background: ${INK.ground};

  video,
  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

/* Círculo con punto: el ícono va en un disco negro, con anillo de la tinta, en la esquina del video. */
const Badge = styled.span`
  position: absolute;
  z-index: 1;
  top: clamp(0.6rem, 2.5cqi, 1rem);
  left: clamp(0.6rem, 2.5cqi, 1rem);
  display: grid;
  place-items: center;
  width: clamp(3rem, 12cqi, 4.25rem);
  aspect-ratio: 1;
  border-radius: 50%;
  background: ${INK.ground};
  color: var(--accent);
  box-shadow: 0 0 0 clamp(0.3rem, 1cqi, 0.45rem) var(--accent);

  svg {
    width: 46%;
    height: 46%;
  }
`;

const Foot = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1rem;
`;

const Chips = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    padding: 0.3rem 0.75rem;
    border-radius: 999px;
    font-size: clamp(0.8rem, 0.76rem + 0.2vw, 0.9rem);
    line-height: 1.2;
    box-shadow: inset 0 0 0 1.5px ${INK.ground};
  }
`;

const More = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 2.75rem;
  padding: 0 1.05rem 0 1.25rem;
  border-radius: 999px;
  background: ${INK.ground};
  color: var(--accent);
  font-size: 0.98rem;
  text-decoration: none;
  transition:
    background-color 0.25s ease,
    color 0.25s ease;

  svg {
    width: 1.15rem;
    height: 1.15rem;
    transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  &:hover {
    background: ${INK.cream};
    color: ${INK.ground};
  }

  &:hover svg {
    transform: translate(2px, -2px);
  }

  /* El outline lima de PosterHome no se ve sobre la card lima. */
  &&:focus-visible {
    outline: 3px solid ${INK.ground};
    outline-offset: 3px;
  }
`;

const Shade = styled.span`
  position: absolute;
  inset: 0;
  z-index: 3;
  background: ${INK.ground};
  opacity: 0;
  pointer-events: none;
`;

const Controls = styled.div`
  display: none;

  @media ${MOBILE} {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
`;

const StepButton = styled.button`
  display: grid;
  place-items: center;
  width: 3.5rem;
  height: 3.5rem;
  flex: none;
  border: 0;
  border-radius: 50%;
  background: ${INK.cream};
  color: ${INK.ground};
  box-shadow: inset 0 0 0 2px ${INK.ground};
  cursor: pointer;
  transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1);

  &:active {
    transform: scale(0.92);
  }

  svg {
    width: 1.4rem;
    height: 1.4rem;
  }
`;

const Meter = styled.div`
  display: grid;
  justify-items: center;
  gap: 0.45rem;
`;

const Count = styled.span`
  font-family: ${FONT.display};
  font-weight: 800;
  font-size: 2.1rem;
  line-height: 0.9;
  letter-spacing: 0.04em;
  transition: color 0.3s ease;
`;

const Dots = styled.span`
  display: flex;
  align-items: center;
  gap: 0.45rem;
`;

const Dot = styled.span<{ $on: boolean }>`
  width: ${({ $on }) => ($on ? '1.1rem' : '0.55rem')};
  aspect-ratio: 1;
  border-radius: 50%;
  /* La activa es un anillo con punto, como los de las palabras construidas. */
  background: ${({ $on }) =>
    $on ? `radial-gradient(circle, ${INK.ground} 0 30%, var(--accent) 32%)` : 'var(--accent)'};
  opacity: ${({ $on }) => ($on ? 1 : 0.45)};
  transition:
    width 0.3s ease,
    opacity 0.3s ease;
`;
