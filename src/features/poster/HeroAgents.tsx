import React from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { SiClaude, SiGooglegemini, SiOpenai } from 'react-icons/si';
import { FONT, INK } from './content';

/* Agentes que arman el hero en la entrada: cada uno con su cursor de color y su etiqueta con el ícono en un solo tono. */
const AGENTS = [
  { id: 'claude', name: 'Claude', color: INK.red, ink: INK.cream, Icon: SiClaude },
  { id: 'gemini', name: 'Gemini', color: INK.blue, ink: INK.cream, Icon: SiGooglegemini },
  { id: 'openai', name: 'ChatGPT', color: INK.lime, ink: INK.ground, Icon: SiOpenai },
] as const;

const HeroAgents: React.FC = () => (
  <Layer aria-hidden="true">
    {AGENTS.map(({ id, name, color, ink, Icon }) => (
      <Agent key={id} data-agent={id}>
        <svg viewBox="0 0 16 22" width={18} height={24}>
          <path d="M1 1v17l4.6-4.4 3.3 7.2 3.1-1.4-3.2-7h6.4z" fill={color} stroke={INK.ground} strokeWidth={1.4} strokeLinejoin="round" />
        </svg>
        <Tag style={{ background: color, color: ink }}>
          <Icon aria-hidden="true" />
          {name}
        </Tag>
      </Agent>
    ))}
  </Layer>
);

type Box = { x: number; y: number; w: number; h: number };

/**
 * Entrada del hero en orquesta: Claude escribe el nombre y después el texto, Gemini traza la grilla y ChatGPT sube la foto.
 * Las posiciones se miden al arrancar (con las fuentes ya cargadas), relativas al hero.
 */
export const heroIntro = (hero: HTMLElement) => {
  const q = gsap.utils.selector(hero);
  const name = q('[data-hero-name]')[0] as HTMLElement;
  const figure = q('[data-hero-portrait]')[0] as HTMLElement;
  const text = q('[data-hero-text]')[0] as HTMLElement;
  const strokes = q('[data-hero-guides] [data-stroke]');
  const [claude, gemini, openai] = ['claude', 'gemini', 'openai'].map(id => q(`[data-agent="${id}"]`)[0]);

  const box: Record<'name' | 'figure' | 'text' | 'hero' | 'h1', Box> = {
    h1: { x: 0, y: 0, w: 0, h: 0 },
    name: { x: 0, y: 0, w: 0, h: 0 },
    figure: { x: 0, y: 0, w: 0, h: 0 },
    text: { x: 0, y: 0, w: 0, h: 0 },
    hero: { x: 0, y: 0, w: 0, h: 0 },
  };
  const measure = () => {
    const h = hero.getBoundingClientRect();
    const rel = (r: DOMRect, dy = 0): Box => ({ x: r.left - h.left, y: r.top - h.top - dy, w: r.width, h: r.height });
    // El nombre ocupa todo el ancho del hero: se mide el texto, no la caja.
    const range = document.createRange();
    range.selectNodeContents(name);
    box.name = rel(range.getBoundingClientRect());
    box.h1 = rel(name.getBoundingClientRect());
    // La foto y el texto arrancan corridos hacia abajo: se descuenta para apuntar a su lugar final.
    box.figure = rel(figure.getBoundingClientRect(), Number(gsap.getProperty(figure, 'y')));
    box.text = rel(text.getBoundingClientRect());
    box.hero = { x: 0, y: 0, w: h.width, h: h.height };
  };
  const at = (k: keyof typeof box, fx: number, fy: number) => ({
    // La etiqueta mide unos 100 px: el cursor no pasa de ahí para que no se corte contra el borde.
    x: () => Math.min(box[k].x + box[k].w * fx, box.hero.w - 110),
    y: () => box[k].y + box[k].h * fy,
  });

  // El recorte se mide sobre la caja del h1 (todo el ancho) pero sigue al texto, que en pantallas anchas es más angosto.
  const clipRight = (fx: number) => () => `inset(0px ${Math.max(0, box.h1.x + box.h1.w - (box.name.x + box.name.w * fx))}px 0px 0px)`;

  // Un 30 % más rápida que la escala de tiempos de abajo: la entrada completa dura unos 2,1 s.
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut' } }).timeScale(1.3);
  tl.set(name, { clipPath: 'inset(0% 100% 0% 0%)' }, 0)
    .call(measure, [], 0)
    // Cada cursor entra desde un borde distinto. Sin immediateRender: las posiciones se leen después de medir.
    .fromTo(claude, { x: () => -60, y: () => box.hero.h * 0.2, autoAlpha: 0 }, { ...at('name', 0, 0.55), autoAlpha: 1, duration: 0.55, immediateRender: false }, 0)
    .fromTo(gemini, { x: () => box.hero.w + 40, y: () => box.hero.h * 0.1, autoAlpha: 0 }, { ...at('figure', 0.12, 0.08), autoAlpha: 1, duration: 0.6, immediateRender: false }, 0.1)
    .fromTo(openai, { x: () => box.hero.w * 0.7, y: () => box.hero.h + 40, autoAlpha: 0 }, { ...at('figure', 0.5, 1.05), autoAlpha: 1, duration: 0.6, immediateRender: false }, 0.2)

    // Claude barre el nombre de izquierda a derecha y el nombre aparece detrás del cursor.
    .fromTo(name, { clipPath: clipRight(0) }, { clipPath: clipRight(1), duration: 0.95, clearProps: 'clipPath', immediateRender: false }, 0.55)
    .to(claude, { ...at('name', 1, 0.55), duration: 0.95 }, 0.55)

    // Gemini traza la grilla y el círculo mientras baja en diagonal.
    .fromTo(strokes, { drawSVG: '0% 0%', autoAlpha: 0 }, { drawSVG: '0% 100%', autoAlpha: 1, duration: 0.7, ease: 'power2.inOut', stagger: 0.05 }, 0.7)
    .to(gemini, { ...at('figure', 0.88, 0.62), duration: 1.1 }, 0.7)

    // ChatGPT sube la foto a su lugar.
    .fromTo(figure, { autoAlpha: 0, y: 64 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'power3.out' }, 0.85)
    .to(openai, { ...at('figure', 0.5, 0.78), duration: 0.9, ease: 'power3.out' }, 0.85)

    // Claude pasa al texto y lo va soltando línea por línea.
    .to(claude, { ...at('text', 0, 0), duration: 0.45 }, 1.5)
    .from(text.children, { autoAlpha: 0, y: 18, duration: 0.5, ease: 'power3.out', stagger: 0.08 }, 1.85)
    .to(claude, { ...at('text', 0.02, 0.92), duration: 0.6, ease: 'power2.inOut' }, 1.85)

    // Terminan y se van, cada uno por su lado.
    .to([gemini, openai, claude], { x: '+=28', y: '+=18', autoAlpha: 0, duration: 0.45, ease: 'power2.in', stagger: 0.12 }, 2.3);

  return tl;
};

const Layer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 6;
  pointer-events: none;
  overflow: clip;
`;

const Agent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
  will-change: transform;

  svg {
    display: block;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.35));
  }
`;

const Tag = styled.span`
  position: absolute;
  top: 20px;
  left: 14px;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.28rem 0.6rem 0.3rem 0.45rem;
  border-radius: 999px;
  font-family: ${FONT.text};
  font-size: 0.8rem;
  font-weight: 500;
  line-height: 1;
  white-space: nowrap;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);

  svg {
    width: 0.95rem;
    height: 0.95rem;
    filter: none;
  }
`;

export default HeroAgents;
