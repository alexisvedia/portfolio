import React, { useLayoutEffect, useRef } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ConstructedWord from './ConstructedWord';
import { FONT, INK, ROUTE } from './content';
import xconsHome from '@/assets/poster/xcons-home.webp';
import xconsComercial from '@/assets/poster/xcons-comercial.webp';
import fusionApp from '@/assets/poster/fusion-app.webp';
import fusionDirections from '@/assets/poster/fusion-directions.webp';
import banditOnboarding from '@/assets/poster/bandit-onboarding.webp';
import banditHome from '@/assets/poster/bandit-home.webp';
import xconsLogo from '@/assets/images/projects/XCONS.svg';
import fusionLogo from '@/assets/images/projects/Fusionads.svg';
import banditLogo from '@/assets/images/projects/Bandit.svg';

gsap.registerPlugin(ScrollTrigger);

/* Desktop con movimiento: sección pineada que traslada el track. En cualquier otro caso, carrusel nativo. */
const PIN = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';
const TILT = '(pointer: fine) and (prefers-reduced-motion: no-preference)';

interface Shot {
  src: string;
  alt: string;
  w: number;
  h: number;
  pos?: string;
}

interface Work {
  accent: string;
  logo?: { src: string; w: number; h: number };
  main?: Shot;
  float?: Shot;
}

// Por nombre de empresa en ROUTE. Cubiq no lleva capturas: es confidencial.
const WORK: Record<string, Work> = {
  XCONS: {
    accent: INK.lime,
    logo: { src: xconsLogo, w: 102, h: 32 },
    main: {
      src: xconsHome,
      w: 1400,
      h: 788,
      alt: 'Home del e-commerce de XCONS con el cotizador que consulta varios corralones a la vez',
    },
    float: {
      src: xconsComercial,
      w: 1400,
      h: 788,
      alt: 'Landing comercial de XCONS: software para vender materiales de construcción en todos los canales',
    },
  },
  'FusionAds.ai': {
    accent: INK.orange,
    logo: { src: fusionLogo, w: 108, h: 19 },
    main: {
      src: fusionApp,
      w: 1400,
      h: 788,
      alt: 'Galería de plantillas de FusionAds.ai para elegir los diseños de una campaña',
    },
    float: {
      src: fusionDirections,
      w: 1400,
      h: 783,
      alt: 'Paso de FusionAds.ai que genera dos opciones de anuncio para la campaña',
    },
  },
  Bandit: {
    accent: INK.blue,
    logo: { src: banditLogo, w: 109, h: 40 },
    main: {
      src: banditOnboarding,
      w: 1400,
      h: 963,
      pos: '50% 40%',
      alt: 'Onboarding de Bandit: elección de rol junto a la foto de un músico con su guitarra',
    },
    float: {
      src: banditHome,
      w: 1400,
      h: 1011,
      alt: 'Home de Bandit con los artistas fijados y el listado de la agencia',
    },
  },
  'Cubiq Digital': { accent: INK.red },
};

/* ---------- Cubiq: red de nodos ---------- */

// Cinco canales entran a un nodo central y salen repartidos en tres destinos.
const CHANNELS = [INK.lime, INK.orange, INK.teal, INK.violet, INK.blue];
const IN_Y = [46, 88, 130, 172, 214];
const OUT_Y = [72, 130, 188];
const PATHS = [
  ...IN_Y.map(y => `M48,${y} C128,${y} 120,130 200,130`),
  ...OUT_Y.map(y => `M200,130 C280,130 272,${y} 352,${y}`),
];

const Ring: React.FC<{ x: number; y: number; r: number; color: string }> = ({ x, y, r, color }) => (
  <g>
    <circle cx={x} cy={y} r={r} fill={color} />
    <circle cx={x} cy={y} r={r * 0.36} fill={INK.ground} />
  </g>
);

const Nodes: React.FC = () => (
  <NodeArt viewBox="0 0 400 260" aria-hidden="true" focusable="false">
    {PATHS.map((d, i) => (
      <path key={i} d={d} pathLength={1} data-wg-line="" />
    ))}
    {PATHS.map((d, i) => (
      <path
        key={`f${i}`}
        d={d}
        pathLength={1}
        data-wg-flow=""
        stroke={CHANNELS[i] ?? INK.cream}
        style={{ animationDelay: `${i * -0.37}s` }}
      />
    ))}
    {IN_Y.map((y, i) => (
      <Ring key={y} x={48} y={y} r={12} color={CHANNELS[i]} />
    ))}
    {OUT_Y.map(y => (
      <Ring key={y} x={352} y={y} r={12} color={INK.cream} />
    ))}
    <circle
      cx={200}
      cy={130}
      r={30}
      fill="none"
      stroke={INK.red}
      strokeWidth={4}
      data-wg-pulse=""
    />
    <Ring x={200} y={130} r={30} color={INK.red} />
  </NodeArt>
);

/* ---------- galería ---------- */

const pad2 = (n: number) => String(n).padStart(2, '0');

const WorkGallery: React.FC = () => {
  const root = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;
    const one = (sel: string) => section.querySelector<HTMLElement>(sel);
    const pin = one('[data-wg-pin]');
    const slider = one('[data-wg-slider]');
    const track = one('[data-wg-track]');
    const rail = one('[data-wg-rail]');
    if (!pin || !slider || !track || !rail) return;
    const cards = gsap.utils.toArray<HTMLElement>('[data-wg-card]', section);
    const mm = gsap.matchMedia(section);

    mm.add(PIN, () => {
      // El atributo cambia el layout a fila pineada: va antes de medir.
      section.dataset.pinned = '';
      track.removeAttribute('tabindex');
      const distance = () => Math.max(0, slider.offsetWidth - pin.clientWidth);

      // ease none en todo el timeline: containerAnimation necesita un avance lineal.
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: pin,
          pin: true,
          scrub: 0.8,
          start: 'top top',
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
          refreshPriority: 3,
          anticipatePin: 1,
        },
      });
      tl.to(slider, { x: () => -distance() }, 0)
        .fromTo(rail.firstElementChild, { scaleX: 0 }, { scaleX: 1 }, 0)
        .fromTo(rail.lastElementChild, { x: 0 }, { x: () => rail.offsetWidth }, 0)
        // Al final, el aro del hilo de abajo toma su lugar: la línea sigue y se arma el rulo.
        .set(rail.lastElementChild, { autoAlpha: 0 }, '>');

      // Parallax dentro de cada card: cada capa viaja a otra velocidad que el track.
      cards.forEach(card => {
        const drift = (sel: string, from: gsap.TweenVars, to: gsap.TweenVars) => {
          const el = card.querySelectorAll(sel);
          if (!el.length) return;
          gsap.fromTo(el, from, {
            ...to,
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              containerAnimation: tl,
              start: 'left right',
              end: 'right left',
              scrub: true,
            },
          });
        };
        drift('[data-wg-num]', { xPercent: 28 }, { xPercent: -28 });
        drift('[data-wg-shot]', { xPercent: -3 }, { xPercent: 3 });
        drift('[data-wg-glow]', { xPercent: -10 }, { xPercent: 10 });
        drift(
          '[data-wg-float]',
          { xPercent: 30, yPercent: 10, rotation: 4 },
          { xPercent: -30, yPercent: -10, rotation: -3 }
        );

        const lines = card.querySelectorAll('[data-wg-line]');
        if (lines.length) {
          gsap.fromTo(
            lines,
            { strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              ease: 'none',
              stagger: 0.06,
              scrollTrigger: {
                trigger: card,
                containerAnimation: tl,
                start: 'left 90%',
                end: 'center 55%',
                scrub: true,
              },
            }
          );
        }
      });

      // Con el track trasladado, el foco por teclado puede caer fuera de vista: se scrollea hasta la card.
      const onFocus = (e: FocusEvent) => {
        const target = e.target as HTMLElement;
        const card = target.closest<HTMLElement>('[data-wg-card]');
        const st = tl.scrollTrigger;
        if (!card || !st || !target.matches(':focus-visible')) return;
        const x = gsap.utils.clamp(
          0,
          distance(),
          card.offsetLeft - (pin.clientWidth - card.offsetWidth) / 2
        );
        window.scrollTo({ top: st.start + x, behavior: 'auto' });
      };
      slider.addEventListener('focusin', onFocus);

      return () => {
        slider.removeEventListener('focusin', onFocus);
        delete section.dataset.pinned;
        track.setAttribute('tabindex', '0');
      };
    });

    // Tilt 3D con el puntero. Rota el escenario, que no lleva parallax: así no pelean por el transform.
    mm.add(TILT, () => {
      const offs = cards.map(card => {
        const stage = card.querySelector<HTMLElement>('[data-wg-stage]');
        const glare = card.querySelector<HTMLElement>('[data-wg-glare]');
        if (!stage || !glare) return () => {};
        gsap.set(stage, { transformPerspective: 1100 });
        const rx = gsap.quickTo(stage, 'rotationX', { duration: 0.6, ease: 'power3' });
        const ry = gsap.quickTo(stage, 'rotationY', { duration: 0.6, ease: 'power3' });
        const shine = gsap.quickTo(glare, 'opacity', { duration: 0.4, ease: 'power2' });

        const move = (e: PointerEvent) => {
          const r = stage.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width;
          const py = (e.clientY - r.top) / r.height;
          ry((px - 0.5) * 14);
          rx((0.5 - py) * 10);
          shine(1);
          // El brillo vive dentro del marco (que lo recorta): se ubica sobre su propio rectángulo.
          const g = glare.getBoundingClientRect();
          glare.style.setProperty('--gx', `${((e.clientX - g.left) / g.width) * 100}%`);
          glare.style.setProperty('--gy', `${((e.clientY - g.top) / g.height) * 100}%`);
        };
        const leave = () => {
          rx(0);
          ry(0);
          shine(0);
        };
        card.addEventListener('pointermove', move);
        card.addEventListener('pointerleave', leave);
        return () => {
          card.removeEventListener('pointermove', move);
          card.removeEventListener('pointerleave', leave);
        };
      });
      return () => offs.forEach(off => off());
    });

    return () => mm.revert();
  }, []);

  return (
    <Section ref={root} id="casos" aria-labelledby="work-title">
      <Pin data-wg-pin="">
        <Slider data-wg-slider="">
          <Intro>
            <WordBox>
              <ConstructedWord
                word="CASOS"
                cols={3}
                ink={INK.cream}
                accent={INK.red}
                accentGlyphs={[3]}
              />
            </WordBox>
            <Title id="work-title">Lo que construí</Title>
            <Hint>
              <span data-wg-when="pin">Seguí bajando: los casos pasan de costado.</span>
              <span data-wg-when="swipe">Deslizá para ver más.</span>
            </Hint>
          </Intro>

          <Track data-wg-track="" tabIndex={0} aria-label="Casos de trabajo">
            {ROUTE.map((stop, i) => {
              const work = WORK[stop.company] ?? { accent: INK.cream };
              return (
                <Card
                  key={stop.company}
                  data-wg-card=""
                  style={{ '--wg-accent': work.accent } as React.CSSProperties}
                >
                  <Meta>
                    <Num aria-hidden="true" data-wg-num="">
                      {pad2(i + 1)}
                    </Num>
                    {work.logo ? (
                      <Logo
                        src={work.logo.src}
                        width={work.logo.w}
                        height={work.logo.h}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    ) : (
                      <Wordmark aria-hidden="true">
                        Cubiq
                        <Dot />
                      </Wordmark>
                    )}
                    <Years>{stop.years}</Years>
                    <Company>{stop.company}</Company>
                    <Role>{stop.role}</Role>
                    {stop.to ? (
                      <CardLink as={Link} to={stop.to}>
                        {stop.linkLabel}
                      </CardLink>
                    ) : (
                      <CardLink href={`#${stop.anchor ?? ''}`}>
                        {stop.linkLabel}
                        <SrOnly> de {stop.company}</SrOnly>
                      </CardLink>
                    )}
                  </Meta>

                  <Stage data-wg-stage="">
                    <Glow aria-hidden="true" data-wg-glow="" $art={!work.main} />
                    {work.main ? (
                      <Frame>
                        <Bar aria-hidden="true">
                          <i />
                          <i />
                          <i />
                          <b />
                        </Bar>
                        <ShotBox style={{ aspectRatio: `${work.main.w} / ${work.main.h}` }}>
                          <img
                            data-wg-shot=""
                            src={work.main.src}
                            alt={work.main.alt}
                            width={work.main.w}
                            height={work.main.h}
                            loading="lazy"
                            decoding="async"
                            style={{ objectPosition: work.main.pos ?? '50% 0%' }}
                          />
                        </ShotBox>
                        <Glare aria-hidden="true" data-wg-glare="" />
                      </Frame>
                    ) : (
                      <Frame $art>
                        <Nodes />
                        <Glare aria-hidden="true" data-wg-glare="" />
                      </Frame>
                    )}
                    {work.float && (
                      <FloatWrap data-wg-float="">
                        <Float style={{ aspectRatio: `${work.float.w} / ${work.float.h}` }}>
                          <img
                            src={work.float.src}
                            alt={work.float.alt}
                            width={work.float.w}
                            height={work.float.h}
                            loading="lazy"
                            decoding="async"
                          />
                        </Float>
                      </FloatWrap>
                    )}
                  </Stage>
                </Card>
              );
            })}
          </Track>
        </Slider>

        <Rail aria-hidden="true" data-wg-rail="">
          <span />
          <span />
        </Rail>
      </Pin>
    </Section>
  );
};

export default WorkGallery;

/* ---------- estilos ---------- */

// Margen lateral con tope: en pantallas anchas el contenido no pasa de 1320px.
const pad = 'max(clamp(1.25rem, 4vw, 3.5rem), calc((100% - 1320px) / 2))';
const cream = (a: number) => `rgba(239, 230, 200, ${a})`;
const pinned = '[data-pinned] &';
const desktop = '@media (min-width: 1024px)';
const mobileMotion = '@media (max-width: 1023px) and (prefers-reduced-motion: no-preference)';

/* Anillo con punto, el acento del afiche. */
const ringDot = (color: string, hole = '32%') => css`
  border-radius: 50%;
  background: radial-gradient(circle, ${INK.ground} 0 ${hole}, ${color} calc(${hole} + 2%));
`;

// Parallax en mobile con scroll-driven animations: solo donde existen, el resto queda quieto.
const shotDrift = keyframes`
  from { transform: translateX(-6%); }
  to { transform: translateX(6%); }
`;
const floatDrift = keyframes`
  from { transform: translateX(16%) rotate(3deg); }
  to { transform: translateX(-16%) rotate(-2deg); }
`;
const flow = keyframes`
  from { stroke-dashoffset: 1; }
  to { stroke-dashoffset: 0; }
`;
const pulse = keyframes`
  from { transform: scale(1); opacity: 0.8; }
  to { transform: scale(2.1); opacity: 0; }
`;

const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;

const Section = styled.section`
  position: relative;
  padding-block: clamp(4rem, 10vh, 7rem);
  scroll-margin-top: 4rem;

  &[data-pinned] {
    padding-block: 0;
  }

  [data-wg-when='pin'] {
    display: none;
  }
  &[data-pinned] [data-wg-when='pin'] {
    display: inline;
  }
  &[data-pinned] [data-wg-when='swipe'] {
    display: none;
  }
`;

const Pin = styled.div`
  ${pinned} {
    position: relative;
    height: 100vh;
    overflow: clip;
    display: flex;
    align-items: center;
    padding-top: 4.5rem;
  }
`;

const Slider = styled.div`
  position: relative;

  ${pinned} {
    display: flex;
    align-items: center;
    width: max-content;
    padding-inline: ${pad} clamp(4rem, 14vw, 12rem);
    will-change: transform;
  }
`;

const Intro = styled.div`
  display: grid;
  gap: 1.1rem;
  padding: 0 ${pad} clamp(1.5rem, 4vh, 2.5rem);

  ${pinned} {
    flex: none;
    width: clamp(17rem, 24vw, 24rem);
    margin-right: clamp(3rem, 6vw, 6rem);
    padding: 0;
  }
`;

const WordBox = styled.div`
  width: min(56vw, 15rem);

  ${pinned} {
    width: 100%;
  }

  svg {
    display: block;
    width: 100%;
    height: auto;
  }
`;

const Title = styled.h2`
  && {
    margin: 0;
    font-family: ${FONT.text};
    font-weight: 400;
    font-size: clamp(1.8rem, 1.2rem + 1.8vw, 3rem);
    line-height: 1;
    letter-spacing: -0.02em;
    color: ${INK.cream};
  }
`;

const Hint = styled.p`
  && {
    margin: 0;
    font-size: 0.95rem;
    color: ${cream(0.6)};
  }
`;

const Track = styled.ol`
  display: flex;
  gap: clamp(1rem, 4vw, 2.5rem);
  margin: 0;
  padding: 0.75rem ${pad} 1.75rem;
  list-style: none;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: ${pad};
  scrollbar-width: thin;
  scrollbar-color: ${cream(0.3)} transparent;

  ${pinned} {
    gap: clamp(4rem, 8vw, 8rem);
    padding: 0;
    overflow: visible;
    scroll-snap-type: none;
  }
`;

const Card = styled.li`
  --wg-accent: ${INK.cream};
  position: relative;
  flex: none;
  display: grid;
  grid-template-rows: auto auto;
  gap: 1rem;
  width: min(84vw, 26rem);
  scroll-snap-align: center;
  cursor: pointer;

  ${desktop} {
    grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.6fr);
    grid-template-rows: 1fr;
    gap: clamp(1.25rem, 2.4vw, 2.5rem);
    width: clamp(40rem, 66vw, 64rem);
    height: min(68vh, 42rem);
  }
`;

const Meta = styled.div`
  /* Mobile: el número va a la derecha para que el bloque no crezca. */
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  column-gap: 1rem;
  align-items: start;
  justify-items: start;
  padding: clamp(1.1rem, 2vw, 1.8rem);

  > * {
    grid-column: 1;
  }

  ${desktop} {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  border-radius: 1.3rem;
  background: var(--wg-accent);
  color: ${INK.ground};
  /* Recorta el número gigante cuando se desliza. */
  overflow: hidden;
`;

const displayType = css`
  font-family: ${FONT.display};
  text-transform: uppercase;
  line-height: 0.86;
`;

const Num = styled.span`
  ${displayType}
  display: block;
  font-weight: 900;
  font-size: clamp(5rem, 24vw, 7rem);
  line-height: 0.74;
  font-variant-numeric: tabular-nums;

  && {
    grid-column: 2;
    grid-row: 1 / span 4;
  }

  ${desktop} {
    font-size: clamp(9rem, 26vh, 17rem);
    margin: 0 0 1.2rem -0.04em;
  }
`;

const Logo = styled.img`
  && {
    width: auto;
    height: clamp(1.4rem, 2vw, 1.9rem);
    max-width: 100%;
    margin-top: auto;
    /* Los logos vienen en blanco: sobre el bloque de color van en negro. */
    filter: brightness(0);
    opacity: 0.88;
  }
`;

const Wordmark = styled.span`
  ${displayType}
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  margin-top: auto;
  font-weight: 800;
  font-size: clamp(2rem, 3vw, 2.6rem);
  line-height: 1;
  letter-spacing: 0.04em;
`;

const Dot = styled.span`
  width: 0.7em;
  height: 0.7em;
  border-radius: 50%;
  background: radial-gradient(circle, var(--wg-accent) 0 30%, ${INK.ground} 32%);
`;

const Years = styled.span`
  ${displayType}
  margin-top: 0.8rem;
  font-weight: 800;
  font-size: clamp(1.5rem, 2vw, 2rem);
  letter-spacing: 0.03em;
`;

const Company = styled.h3`
  && {
    ${displayType}
    margin: 0.15rem 0 0.35rem;
    font-weight: 900;
    font-size: clamp(3rem, 4.6vw, 5rem);
    letter-spacing: 0.01em;
    color: ${INK.ground};
    overflow-wrap: anywhere;
  }
`;

const Role = styled.span`
  font-size: 0.98rem;
  line-height: 1.3;
`;

const CardLink = styled.a`
  && {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    margin-top: 1rem;
    padding-bottom: 0.15rem;
    color: ${INK.ground};
    font-size: 1rem;
    text-decoration: none;
    background: linear-gradient(currentColor, currentColor) 0 100% / 0% 2px no-repeat;
    transition: background-size 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  &::after {
    content: '→';
    transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  /* Link estirado: toda la card es clickeable. */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 5;
    border-radius: 1.3rem;
  }

  ${Card}:hover && {
    background-size: 100% 2px;
  }
  ${Card}:hover &::after {
    transform: translateX(4px);
  }

  &&:focus-visible {
    outline: none;
  }
  &:focus-visible::before {
    outline: 3px solid ${INK.cream};
    outline-offset: 6px;
  }
`;

const Stage = styled.div`
  position: relative;
  aspect-ratio: 4 / 3.3;
  transform-style: preserve-3d;

  ${desktop} {
    aspect-ratio: auto;
    height: 100%;
  }
`;

/* Halo con degradés que se apagan antes del borde: sin filter, porque blur dentro del tilt 3D se recorta a la caja. */
const Glow = styled.div<{ $art?: boolean }>`
  position: absolute;
  inset: -4% -6%;
  opacity: 0.45;
  pointer-events: none;
  background: ${({ $art }) =>
    $art
      ? `radial-gradient(closest-side at 30% 40%, ${INK.red}, transparent),
         radial-gradient(closest-side at 70% 60%, ${INK.teal}, transparent),
         radial-gradient(closest-side at 50% 80%, ${INK.lime}, transparent)`
      : 'radial-gradient(closest-side, var(--wg-accent), transparent)'};
`;

const Frame = styled.div<{ $art?: boolean }>`
  position: absolute;
  top: 4%;
  left: 0;
  width: 94%;
  border-radius: 0.9rem;
  /* clip y no hidden: hidden lo vuelve contenedor de scroll y ata ahí el view(inline) de la captura. */
  overflow: clip;
  background: #1a1816;
  box-shadow:
    0 0 0 1.5px ${cream(0.14)},
    0 34px 70px -24px rgba(0, 0, 0, 0.85);

  ${({ $art }) =>
    $art &&
    css`
      inset: 4% 0 4% 3%;
      width: auto;
      display: grid;
      place-items: center;
      background:
        radial-gradient(${cream(0.14)} 1.5px, transparent 1.7px) 0 0 / 22px 22px,
        #141210;
    `}

  ${desktop} {
    top: 8%;
  }
`;

const Bar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  height: clamp(1.5rem, 2.2vw, 2rem);
  padding: 0 0.75rem;
  background: #221f1b;

  i {
    ${ringDot(INK.cream)}
    width: 0.62rem;
    height: 0.62rem;
    opacity: 0.4;
  }
  i:first-child {
    ${ringDot('var(--wg-accent)')}
    opacity: 1;
  }
  b {
    flex: 0 1 45%;
    height: 0.85rem;
    margin-left: 0.6rem;
    border-radius: 999px;
    background: ${cream(0.08)};
  }
`;

const ShotBox = styled.div`
  aspect-ratio: 16 / 10;
  overflow: clip;

  img {
    display: block;
    width: 100%;
    max-width: none;
    height: 100%;
    object-fit: cover;
  }

  /* Desktop: el parallax mueve la captura un 3 % de su ancho; 4 % de sobra por lado tapa el borde. */
  ${desktop} {
    img {
      width: 108%;
      margin-left: -4%;
    }
  }

  ${mobileMotion} {
    @supports (animation-timeline: view()) {
      img {
        /* Más ancha que el marco solo con parallax: así nunca deja ver los bordes. */
        width: 120%;
        margin-left: -10%;
        animation: ${shotDrift} linear both;
        animation-timeline: view(inline);
      }
    }
  }
`;

const FloatWrap = styled.div`
  position: absolute;
  right: -2%;
  bottom: 0;
  z-index: 2;
  width: 54%;
  transform-style: preserve-3d;

  ${desktop} {
    right: -6%;
    bottom: 4%;
    width: 50%;
  }

  ${mobileMotion} {
    @supports (animation-timeline: view()) {
      animation: ${floatDrift} linear both;
      animation-timeline: view(inline);
    }
  }
`;

const Float = styled.div`
  aspect-ratio: 16 / 10;
  border-radius: 0.7rem;
  overflow: hidden;
  background: #1a1816;
  transform: translateZ(60px);
  box-shadow:
    0 0 0 3px var(--wg-accent),
    0 26px 56px -18px rgba(0, 0, 0, 0.9);

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 50% 0%;
  }
`;

const Glare = styled.div`
  position: absolute;
  inset: 0;
  /* El marco de arte es grid centrado: sin esto el brillo mide 0x0. */
  place-self: stretch;
  z-index: 3;
  opacity: 0;
  pointer-events: none;
  mix-blend-mode: overlay;
  background: radial-gradient(
    circle at var(--gx, 50%) var(--gy, 50%),
    rgba(255, 255, 255, 0.4),
    transparent 45%
  );
`;

const NodeArt = styled.svg`
  display: block;
  width: 92%;
  height: auto;
  max-height: 92%;
  overflow: visible;

  path {
    fill: none;
    stroke-linecap: round;
  }
  [data-wg-line] {
    stroke: ${cream(0.32)};
    stroke-width: 4;
    stroke-dasharray: 1;
  }
  [data-wg-flow] {
    display: none;
    stroke-width: 8;
    stroke-dasharray: 0.001 0.999;
  }
  [data-wg-pulse] {
    display: none;
    transform-box: fill-box;
    transform-origin: center;
  }

  @media (prefers-reduced-motion: no-preference) {
    [data-wg-flow] {
      display: inline;
      animation: ${flow} 2.6s linear infinite;
    }
    [data-wg-pulse] {
      display: inline;
      animation: ${pulse} 2.2s ease-out infinite;
    }
  }
`;

const Rail = styled.div`
  display: none;

  ${pinned} {
    display: block;
    position: absolute;
    left: ${pad};
    right: ${pad};
    bottom: clamp(1.25rem, 4vh, 2.5rem);
    height: 3px;
    border-radius: 3px;
    background: ${cream(0.12)};
  }

  span:first-child {
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background: ${INK.cream};
    transform-origin: 0 50%;
  }
  span:last-child {
    ${ringDot(INK.red)}
    position: absolute;
    top: 50%;
    left: 0;
    width: 1.1rem;
    height: 1.1rem;
    margin: -0.55rem 0 0 -0.55rem;
  }
`;
