import React, { useLayoutEffect, useRef, useState } from 'react';
import Almohada from './Almohada';
import styled, { css, keyframes } from 'styled-components';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ConstructedWord from './ConstructedWord';
import { FONT, INK, ROUTE } from './content';
import type { Book, BookState } from './caseBook';
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

/* Con movimiento y WebGL, los casos son un libro 3D que pasa las hojas con el scroll. En cualquier otro caso, carrusel nativo. */
/** Con esta media query el libro muestra el rail de avance, del que nace el hilo de abajo (Stitch). */
export const PIN = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';
const BOOK = '(prefers-reduced-motion: no-preference)';
// Ancho de página del libro (PAGE_W en caseBook, que se carga aparte con three).
const PAGE_W = 1;

export interface Shot {
  src: string;
  alt: string;
  w: number;
  h: number;
  pos?: string;
  /** Rótulo corto para el collage del libro. */
  label?: string;
}

export interface Work {
  accent: string;
  logo?: { src: string; w: number; h: number };
  main?: Shot;
  float?: Shot;
}

// Por nombre de empresa en ROUTE. Cubiq no lleva capturas: es confidencial.
const WORK: Record<string, Work> = {
  XCONS: {
    accent: '#108048', // color de la marca, medido en sus capturas
    logo: { src: xconsLogo, w: 102, h: 32 },
    main: {
      src: xconsHome,
      w: 1400,
      h: 788,
      alt: 'Home del e-commerce de XCONS con el cotizador que consulta varios corralones a la vez',
      label: 'Cotizador multi corralón',
    },
    float: {
      src: xconsComercial,
      w: 1400,
      h: 788,
      alt: 'Landing comercial de XCONS: software para vender materiales de construcción en todos los canales',
      label: 'Landing comercial',
    },
  },
  'FusionAds.ai': {
    accent: '#f04810', // color de la marca, medido en sus capturas
    logo: { src: fusionLogo, w: 108, h: 19 },
    main: {
      src: fusionApp,
      w: 1400,
      h: 788,
      alt: 'Galería de plantillas de FusionAds.ai para elegir los diseños de una campaña',
      label: 'Galería de plantillas',
    },
    float: {
      src: fusionDirections,
      w: 1400,
      h: 783,
      alt: 'Paso de FusionAds.ai que genera dos opciones de anuncio para la campaña',
      label: 'Opciones de anuncio',
    },
  },
  Bandit: {
    accent: '#f01040', // color de la marca, medido en sus capturas
    logo: { src: banditLogo, w: 109, h: 40 },
    main: {
      src: banditOnboarding,
      w: 1400,
      h: 963,
      pos: '50% 40%',
      alt: 'Onboarding de Bandit: elección de rol junto a la foto de un músico con su guitarra',
      label: 'Onboarding por rol',
    },
    float: {
      src: banditHome,
      w: 1400,
      h: 1011,
      alt: 'Home de Bandit con los artistas fijados y el listado de la agencia',
      label: 'Home de la agencia',
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

/** Contexto WebGL de prueba, que se suelta enseguida. Sin él queda la galería de tarjetas. */
const hasWebGL = () => {
  const gl = document.createElement('canvas').getContext('webgl2');
  gl?.getExtension('WEBGL_lose_context')?.loseContext();
  return !!gl;
};

const WorkGallery: React.FC = () => {
  const root = useRef<HTMLElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  // Caso abierto en el libro: -1 con la tapa cerrada.
  const [active, setActive] = useState(-1);

  useLayoutEffect(() => {
    const section = root.current;
    if (!section) return;
    const one = (sel: string) => section.querySelector<HTMLElement>(sel);
    const pin = one('[data-wg-pin]');
    const slider = one('[data-wg-slider]');
    const host = one('[data-wg-book]');
    const rail = one('[data-wg-rail]');
    if (!pin || !slider || !host || !rail) return;
    const word = section.querySelector<SVGSVGElement>('[data-wg-word] svg');
    const mm = gsap.matchMedia(section);
    let noBook = false;

    // Libro de casos con Three.js. Con reduced motion o sin WebGL quedan las tarjetas.
    mm.add({ desk: '(min-width: 1024px)', motion: BOOK }, ctx => {
      const { desk, motion } = ctx.conditions as { desk: boolean; motion: boolean };
      if (!motion || noBook || !hasWebGL()) return;

      const single = !desk;
      const half = PAGE_W / 2;
      // Una hoja por caso: la tapa deja ver el caso 1 y cada hoja siguiente, el próximo.
      const flips = ROUTE.map(() => 0);
      const state: BookState = { flips, focus: half, px: 0, py: 0 };
      let dirty = true;
      let last = -1;
      const onUpdate = () => {
        dirty = true;
        // Caso abierto: el de la última hoja que ya pasó la mitad.
        const open = flips.filter(f => f > 0.5).length - 1;
        if (open !== last) setActive((last = open));
      };

      // Desktop: se abre la tapa y pasan las hojas. Mobile, una página por vez: la cámara va de la izquierda
      // (los datos del caso) a la derecha (las capturas) y la hoja pasa mientras vuelve a la izquierda.
      const HOLD = 0.7;
      const PAN = 0.8;
      const tl = gsap.timeline({ defaults: { ease: 'power1.inOut' }, onUpdate });
      let t = 0;
      ROUTE.forEach((_, i) => {
        tl.to(flips, { [i]: 1, duration: 1 }, t).to(
          state,
          { focus: single ? -half : 0, duration: 1 },
          t
        );
        t += 1;
        tl.addLabel(`case${i}`, t + (single ? 0 : HOLD / 2));
        t += HOLD;
        if (single) {
          tl.to(state, { focus: half, duration: PAN }, t);
          t += PAN + HOLD;
        }
      });
      const total = t;

      const syncRing = (s: ScrollTrigger) => {
        rail.toggleAttribute('data-done', s.progress === 1);
        document.documentElement.toggleAttribute('data-rail-done', s.progress === 1);
      };
      section.dataset.pinned = '';
      ScrollTrigger.create({
        animation: tl,
        trigger: pin,
        pin: true,
        scrub: 0.8,
        start: 'top top',
        end: () => `+=${total * window.innerHeight * (single ? 0.42 : 0.55)}`,
        invalidateOnRefresh: true,
        refreshPriority: 3,
        anticipatePin: 1,
        // Al terminar el libro, el aro del hilo de abajo toma el lugar del aro del rail (solo desktop, ver Stitch).
        onLeave: syncRing,
        onEnterBack: syncRing,
        onRefresh: syncRing,
      });

      // Rail de avance: la línea se llena con todo el libro y en el último tramo se pone roja y el aro crece.
      tl.fromTo(
        rail.firstElementChild,
        { scaleX: 0 },
        { scaleX: 1, ease: 'none', duration: total },
        0
      )
        .fromTo(
          rail.lastElementChild,
          { x: 0 },
          { x: () => rail.offsetWidth, ease: 'none', duration: total },
          0
        )
        .fromTo(
          rail.firstElementChild,
          { backgroundColor: INK.cream },
          { backgroundColor: INK.red, ease: 'none', duration: total * 0.12 },
          total * 0.88
        )
        .fromTo(
          rail.lastElementChild,
          { scale: 1 },
          {
            // El aro del hilo escala con el ancho del svg: se mide en cada refresh en vez de fijar un factor.
            scale: () => {
              const ring = rail.lastElementChild as HTMLElement;
              const bead = document.querySelector('[data-from-rail] [data-bead] circle');
              return bead && ring.offsetWidth
                ? bead.getBoundingClientRect().width / ring.offsetWidth
                : 2;
            },
            ease: 'none',
            duration: total * 0.12,
          },
          total * 0.88
        );

      // El puntero inclina el libro y corre las capas; se suaviza en el ticker.
      const aim = { x: 0, y: 0 };
      const move = (e: PointerEvent) => {
        if (e.pointerType !== 'mouse') return;
        const r = pin.getBoundingClientRect();
        aim.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        aim.y = ((e.clientY - r.top) / r.height) * 2 - 1;
      };
      const leave = () => {
        aim.x = aim.y = 0;
      };
      pin.addEventListener('pointermove', move);
      pin.addEventListener('pointerleave', leave);

      let book: Book | null = null;
      let cancelled = false;
      const tick = () => {
        const dx = aim.x - state.px;
        const dy = aim.y - state.py;
        if (Math.abs(dx) + Math.abs(dy) > 1e-4) {
          state.px += dx * 0.08;
          state.py += dy * 0.08;
          dirty = true;
        }
        if (book && dirty) {
          dirty = false;
          book.render(state);
        }
      };
      // Solo dibuja con la sección a la vista.
      const visible = ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: s => (s.isActive ? gsap.ticker.add(tick) : gsap.ticker.remove(tick)),
      });

      const resize = () => {
        // Franjas que tapan la nav con la pista de arriba y el botón con el rail de abajo.
        const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
        book?.resize(
          host.clientWidth,
          host.clientHeight,
          single,
          8 * rem,
          (desk ? 6.5 : 5) * rem
        );
        dirty = true;
      };
      const ro = new ResizeObserver(resize);
      ro.observe(host);

      // Three, las páginas y sus imágenes se piden una pantalla antes de llegar.
      const io = new IntersectionObserver(
        entries => {
          if (!entries.some(en => en.isIntersecting)) return;
          io.disconnect();
          // Alto de página en px de textura: el de pantalla con el pixel ratio, con piso y techo.
          const pageH = gsap.utils.clamp(
            900,
            1600,
            host.clientHeight * 0.85 * Math.min(window.devicePixelRatio, 2)
          );
          Promise.all([import('three'), import('./caseBook'), import('./bookPages')])
            .then(async ([THREE, { mountBook }, { buildLeaves }]) => {
              const leaves = await buildLeaves(WORK, word, pageH);
              if (cancelled) return;
              book = mountBook(THREE, host, leaves, INK.ground);
              if (!book) throw new Error('webgl');
              section.dataset.book = 'ready';
              resize();
            })
            .catch(() => {
              // Sin libro vuelven las tarjetas.
              if (cancelled) return;
              noBook = true;
              mm.revert();
              ScrollTrigger.refresh();
            });
        },
        { rootMargin: '100% 0px' }
      );
      io.observe(section);

      // Las tarjetas quedan para teclado y lectores de pantalla: el foco lleva el libro hasta ese caso.
      const onFocus = (e: FocusEvent) => {
        const target = e.target as HTMLElement;
        const card = target.closest<HTMLElement>('[data-wg-card]');
        const st = tl.scrollTrigger;
        if (!card || !st) return;
        const i = [...slider.querySelectorAll('[data-wg-card]')].indexOf(card);
        const at = tl.labels[`case${i}`] ?? 0;
        window.scrollTo({
          top: st.start + (at / tl.duration()) * (st.end - st.start),
          behavior: 'auto',
        });
        ctaRef.current?.toggleAttribute('data-kbd', target.matches(':focus-visible'));
      };
      const onBlur = () => ctaRef.current?.removeAttribute('data-kbd');
      slider.addEventListener('focusin', onFocus);
      slider.addEventListener('focusout', onBlur);
      const open = () => ctaRef.current?.click();
      host.addEventListener('click', open);

      return () => {
        cancelled = true;
        io.disconnect();
        ro.disconnect();
        visible.kill();
        gsap.ticker.remove(tick);
        pin.removeEventListener('pointermove', move);
        pin.removeEventListener('pointerleave', leave);
        slider.removeEventListener('focusin', onFocus);
        slider.removeEventListener('focusout', onBlur);
        host.removeEventListener('click', open);
        // Al revertir el pin el ticker puede volver a llamar a tick: sin libro no dibuja sobre un contexto ya perdido.
        book?.dispose();
        book = null;
        delete section.dataset.pinned;
        delete section.dataset.book;
        rail.removeAttribute('data-done');
        document.documentElement.removeAttribute('data-rail-done');
        setActive(-1);
      };
    });

    return () => mm.revert();
  }, []);

  const stop = ROUTE[active];

  return (
    <Section ref={root} id="casos" aria-labelledby="work-title">
      <Almohada>
        <Pin data-wg-pin="">
          <Slider data-wg-slider="">
            <Intro>
              <WordBox data-wg-word="">
                <ConstructedWord
                  word="CASOS"
                  cols={3}
                  ink={INK.cream}
                  accent={INK.red}
                  accentGlyphs={[3]}
                />
              </WordBox>
              <Title id="work-title">Lo que construí</Title>
              <Hint>Deslizá para ver más.</Hint>
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
                      <Num aria-hidden="true">{pad2(i + 1)}</Num>
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

                    <Stage>
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
                              src={work.main.src}
                              alt={work.main.alt}
                              width={work.main.w}
                              height={work.main.h}
                              loading="lazy"
                              decoding="async"
                              style={{ objectPosition: work.main.pos ?? '50% 0%' }}
                            />
                          </ShotBox>
                        </Frame>
                      ) : (
                        <Frame $art>
                          <Nodes />
                        </Frame>
                      )}
                      {work.float && (
                        <FloatWrap>
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

          {/* El libro es decorativo: el contenido accesible son las tarjetas, ocultas a la vista mientras está el libro. */}
          <BookHost data-wg-book="" aria-hidden="true" />
          <BookHint aria-hidden="true">Seguí bajando: las páginas pasan solas.</BookHint>
          {stop?.to ? (
            <Cta ref={ctaRef} as={Link} to={stop.to} tabIndex={-1} aria-hidden="true">
              {stop.linkLabel}
            </Cta>
          ) : (
            <Cta
              ref={ctaRef}
              href={`#${stop?.anchor ?? ''}`}
              data-hidden={stop ? undefined : ''}
              tabIndex={-1}
              aria-hidden="true"
            >
              {stop?.linkLabel}
            </Cta>
          )}

          <Rail aria-hidden="true" data-wg-rail="">
            <span />
            <span />
          </Rail>
        </Pin>
      </Almohada>
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
`;

const Pin = styled.div`
  position: relative;

  /* Tablero de trabajo: grilla de plancha de corte (menor cada 1,5rem, mayor cada 6rem) que se apaga hacia los bordes.
     Va en el bloque pineado: el tablero queda quieto y los casos pasan por encima. */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background:
      linear-gradient(to right, rgba(239, 230, 200, 0.12) 1px, transparent 1px) 0 0 / 6rem 6rem,
      linear-gradient(to bottom, rgba(239, 230, 200, 0.12) 1px, transparent 1px) 0 0 / 6rem 6rem,
      linear-gradient(to right, rgba(239, 230, 200, 0.05) 1px, transparent 1px) 0 0 / 1.5rem 1.5rem,
      linear-gradient(to bottom, rgba(239, 230, 200, 0.05) 1px, transparent 1px) 0 0 / 1.5rem 1.5rem;
    -webkit-mask-image: radial-gradient(ellipse 75% 70% at 50% 50%, #000 40%, transparent 100%);
    mask-image: radial-gradient(ellipse 75% 70% at 50% 50%, #000 40%, transparent 100%);
  }

  ${pinned} {
    height: 100svh;
    overflow: clip;
  }
  ${desktop} {
    ${pinned} {
      height: 100vh;
    }
  }
`;

const Slider = styled.div`
  position: relative;

  /* Con el libro, las tarjetas siguen ahí para teclado y lectores de pantalla, fuera de la vista. */
  ${pinned} {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
`;

const Intro = styled.div`
  display: grid;
  gap: 1.1rem;
  padding: 0 ${pad} clamp(1.5rem, 4vh, 2.5rem);
`;

const WordBox = styled.div`
  width: min(56vw, 15rem);

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

const Frame = styled.div<{ $art?: boolean }>`
  position: absolute;
  top: 4%;
  left: 0;
  width: 94%;
  border-radius: 0.9rem;
  /* clip y no hidden: hidden lo vuelve contenedor de scroll y ata ahí el view(inline) de la captura. */
  overflow: clip;
  background: #1a1816;
  /* Placa plana del color del caso, corrida abajo a la derecha como pieza de papel aparte: sin blur, como el resto
     del sitio (docs/estilo-recorte.md). */
  box-shadow:
    0 0 0 1.5px ${cream(0.14)},
    clamp(0.6rem, 1.2vw, 1rem) clamp(0.6rem, 1.2vw, 1rem) 0 var(--wg-accent);

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

  ${desktop} {
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
  }

  &[data-done] span:last-child {
    visibility: hidden;
  }
  /* Cuña al final del rail: engrosa de 3 px al ancho del hilo (7 unidades del viewBox a 1320 px, unos 8 px) para que el paso no salte. */
  &[data-done]::after {
    content: '';
    position: absolute;
    right: 0;
    top: 50%;
    width: clamp(6rem, 12vw, 11rem);
    height: 8px;
    margin-top: -4px;
    background: ${INK.red};
    clip-path: polygon(0 31.25%, 100% 0, 100% 100%, 0 68.75%);
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

/* ---------- libro ---------- */

const BookHost = styled.div`
  display: none;

  ${pinned} {
    display: block;
    position: absolute;
    inset: 0;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.6s ease;
  }
  [data-book='ready'] & {
    opacity: 1;
  }

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

const BookHint = styled.p`
  display: none;

  && {
    margin: 0;
    font-size: 0.95rem;
    color: ${cream(0.6)};
  }
  ${pinned} {
    display: block;
    position: absolute;
    top: 5rem;
    left: ${pad};
  }
`;

const Cta = styled.a`
  display: none;

  ${pinned} {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    position: absolute;
    left: 50%;
    bottom: 2.25rem;
    transform: translateX(-50%);
    padding: 0.8rem 1.4rem;
    border-radius: 999px;
    background: ${INK.cream};
    color: ${INK.ground};
    font-size: 1rem;
    text-decoration: none;
    white-space: nowrap;
    transition: opacity 0.3s ease;
  }
  ${desktop} {
    ${pinned} {
      bottom: 3.75rem;
    }
  }
  &::after {
    content: '→';
  }
  &[data-hidden] {
    opacity: 0;
    pointer-events: none;
  }
  /* El foco real está en la tarjeta oculta: el anillo se dibuja acá, donde se ve. */
  &[data-kbd] {
    outline: 3px solid ${INK.red};
    outline-offset: 4px;
  }
`;
