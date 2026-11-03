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

/* Caja de selección de un agente: borde punteado, cuatro manijas y la medida en vivo. */
const Frame: React.FC<{ id: string; color: string; ink: string; children?: React.ReactNode }> = ({ id, color, ink, children }) => (
  <Box data-frame={id} style={{ '--c': color } as React.CSSProperties}>
    <i />
    <i />
    <i />
    <i />
    <Size data-size="" style={{ background: color, color: ink }} />
    {children}
  </Box>
);

const HeroAgents: React.FC = () => (
  <Layer aria-hidden="true">
    <Frame id="claude-name" color={INK.red} ink={INK.cream} />
    <Frame id="claude-text" color={INK.red} ink={INK.cream} />
    <Frame id="openai" color={INK.lime} ink={INK.ground}>
      <Upload data-upload="">
        <span>retrato.webp</span>
        <b>
          <em data-upload-bar="" />
        </b>
      </Upload>
    </Frame>
    <Caret data-caret="" />
    <Pulse data-pulse="gemini" style={{ borderColor: INK.blue }} />
    <Pulse data-pulse="openai" style={{ borderColor: INK.lime }} />
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

type Rect = { x: number; y: number; w: number; h: number };
const ZERO: Rect = { x: 0, y: 0, w: 0, h: 0 };

/**
 * Entrada del hero: cada agente arma su parte a la vista.
 * Claude arrastra una caja sobre el nombre y lo escribe letra por letra; después marca el texto y lo suelta.
 * Gemini traza la grilla línea por línea y dibuja el círculo con el cursor sobre el trazo.
 * ChatGPT marca el cuadro de la foto, la sube con una barra de carga y la suelta con un clic.
 * Las posiciones se miden al arrancar (con las fuentes ya cargadas), relativas al hero.
 */
export const heroIntro = (hero: HTMLElement) => {
  const q = gsap.utils.selector(hero);
  const name = q('[data-hero-name]')[0] as HTMLElement;
  const figure = q('[data-hero-portrait]')[0] as HTMLElement;
  const img = figure.querySelector('img') as HTMLElement;
  const text = q('[data-hero-text]')[0] as HTMLElement;
  const vLines = q('[data-guide-v]');
  const hLines = q('[data-guide-h]');
  const ring = q('[data-guide-circle]')[0];
  const dot = q('[data-guide-dot]')[0];
  const [claude, gemini, openai] = ['claude', 'gemini', 'openai'].map(id => q(`[data-agent="${id}"]`)[0]);
  const [nameBox, textBox, photoBox] = ['claude-name', 'claude-text', 'openai'].map(id => q(`[data-frame="${id}"]`)[0] as HTMLElement);
  const caret = q('[data-caret]')[0];
  const bar = q('[data-upload-bar]')[0];
  const [geminiPulse, openaiPulse] = ['gemini', 'openai'].map(id => q(`[data-pulse="${id}"]`)[0]);

  const box = { hero: ZERO, name: ZERO, h1: ZERO, figure: ZERO, text: ZERO, ring: ZERO };
  // Después de cada letra: borde derecho y línea (en mobile el nombre ocupa dos). Coordenadas del h1.
  let steps: { x: number; line: number }[] = [];
  let lineH = 0;
  let lines = 1;
  let capH = 0;
  let capTops: number[] = [];
  const measure = () => {
    const h = hero.getBoundingClientRect();
    const rel = (r: DOMRect): Rect => ({ x: r.left - h.left, y: r.top - h.top, w: r.width, h: r.height });
    const range = document.createRange();
    range.selectNodeContents(name);
    box.name = rel(range.getBoundingClientRect());
    box.h1 = rel(name.getBoundingClientRect());
    box.figure = rel(figure.getBoundingClientRect());
    box.text = rel(text.getBoundingClientRect());
    box.ring = rel(ring.getBoundingClientRect());
    box.hero = { x: 0, y: 0, w: h.width, h: h.height };
    const node = name.firstChild;
    const chars: { x: number; top: number; space: boolean }[] = [];
    if (node?.nodeType === Node.TEXT_NODE) {
      const str = node.textContent ?? '';
      for (let i = 0; i < str.length; i++) {
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        const r = range.getBoundingClientRect();
        chars.push({ x: r.right - h.left - box.h1.x, top: r.top, space: !str[i].trim() });
      }
    }
    const tops = [...new Set(chars.filter(c => !c.space).map(c => Math.round(c.top)))].sort((a, b) => a - b);
    lines = Math.max(1, tops.length);
    lineH = box.h1.h / lines;
    // Alto de las mayúsculas y su distancia al borde de la caja de contenido de cada línea (el range la incluye entera).
    const cs = getComputedStyle(name);
    const ctx = document.createElement('canvas').getContext('2d');
    if (ctx) ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const m = ctx?.measureText('A');
    capH = m ? m.actualBoundingBoxAscent : lineH;
    const capOff = m && Number.isFinite(m.fontBoundingBoxAscent) ? m.fontBoundingBoxAscent - m.actualBoundingBoxAscent : 0;
    capTops = tops.length ? tops.map(t => t - h.top + capOff) : [box.h1.y];
    box.name = { ...box.name, y: capTops[0], h: capTops[capTops.length - 1] + capH - capTops[0] };
    const lineOf = (top: number) => Math.max(0, tops.findIndex(v => Math.abs(v - top) < lineH / 2));
    const first = chars.find(c => !c.space);
    steps = [{ x: box.name.x - box.h1.x, line: 0 }];
    // El espacio del salto de línea no tiene caja propia: hereda la línea de la letra anterior.
    chars.forEach(c => steps.push(c.space ? { ...steps[steps.length - 1] } : { x: c.x, line: lineOf(c.top) }));
    if (!first) steps.push({ x: box.name.x + box.name.w - box.h1.x, line: 0 });
  };
  /* Muestra las líneas de arriba enteras y la actual hasta x. La primera se abre hacia arriba y la última hacia abajo. */
  const clip = ({ x, line }: { x: number; line: number }) => {
    // Corta justo arriba de las mayúsculas de cada línea: con line-height 0.8 sobresalen del renglón.
    const edge = (i: number) => (capTops[i] ?? box.h1.y + i * lineH) - box.h1.y - 2;
    const top = line === 0 ? -1000 : edge(line);
    const bot = line === lines - 1 ? 10000 : edge(line + 1);
    const w = box.h1.w + 1000;
    return `polygon(-1000px -1000px, ${w}px -1000px, ${w}px ${top}px, ${x}px ${top}px, ${x}px ${bot}px, -1000px ${bot}px)`;
  };
  const caretAt = (s: { x: number; line: number }) => ({ x: box.h1.x + s.x, y: capTops[s.line] ?? box.h1.y });
  // La etiqueta mide unos 100 px: el cursor no pasa de ahí para que no se corte contra el borde.
  const clampX = (x: number) => Math.min(x, box.hero.w - 110);
  const at = (k: keyof typeof box, fx: number, fy: number) => ({
    x: () => clampX(box[k].x + box[k].w * fx),
    y: () => box[k].y + box[k].h * fy,
  });
  const frameAt = (k: keyof typeof box) => ({ x: () => box[k].x, y: () => box[k].y, width: 0, height: 0, autoAlpha: 1 });
  const grow = (k: keyof typeof box, frame: HTMLElement) => ({
    width: () => box[k].w,
    height: () => box[k].h,
    onUpdate: () => {
      const label = frame.querySelector('[data-size]');
      if (label) label.textContent = `${Math.round(frame.offsetWidth)} × ${Math.round(frame.offsetHeight)}`;
    },
  });
  // Pulso de clic en la punta del cursor.
  const click = (pulse: Element, agent: Element, t: number) =>
    tl.fromTo(
      pulse,
      { x: () => Number(gsap.getProperty(agent, 'x')), y: () => Number(gsap.getProperty(agent, 'y')), scale: 0.2, autoAlpha: 1 },
      { scale: 1.6, autoAlpha: 0, duration: 0.45, ease: 'power2.out', immediateRender: false },
      t
    );

  const typing = { i: 0 };
  const orbit = { p: 0 };
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut' } }).timeScale(1.3);
  tl.set(name, { clipPath: 'inset(0% 100% 0% 0%)' }, 0)
    .call(measure, [], 0)
    // Cada cursor entra desde un borde distinto. Sin immediateRender: las posiciones se leen después de medir.
    .fromTo(claude, { x: () => -60, y: () => box.hero.h * 0.2, autoAlpha: 0 }, { ...at('name', 0, 0), autoAlpha: 1, duration: 0.5, immediateRender: false }, 0)
    .fromTo(gemini, { x: () => box.hero.w + 40, y: () => box.hero.h * 0.1, autoAlpha: 0 }, { ...at('figure', 0, 0), autoAlpha: 1, duration: 0.55, immediateRender: false }, 0.1)
    .fromTo(openai, { x: () => box.hero.w * 0.7, y: () => box.hero.h + 40, autoAlpha: 0 }, { ...at('figure', 0.02, 0.04), autoAlpha: 1, duration: 0.55, immediateRender: false }, 0.15);

  // Claude: arrastra la caja del nombre, escribe letra por letra con el cursor de texto y suelta la caja.
  tl.set(nameBox, frameAt('name'), 0.5)
    .to(nameBox, { ...grow('name', nameBox), duration: 0.45 }, 0.5)
    .to(claude, { ...at('name', 1, 1), duration: 0.45 }, 0.5)
    .set(caret, { x: () => caretAt(steps[0]).x, y: () => caretAt(steps[0]).y, height: () => capH, autoAlpha: 1 }, 0.95)
    .to(claude, { x: () => clampX(caretAt(steps[0]).x + 8), y: () => caretAt(steps[0]).y + capH * 0.7, duration: 0.2 }, 0.95)
    .fromTo(
      typing,
      { i: 0 },
      {
        i: () => steps.length - 1,
        duration: 1,
        ease: 'none',
        immediateRender: false,
        onUpdate: () => {
          const s = steps[Math.round(typing.i)];
          const c = caretAt(s);
          gsap.set(name, { clipPath: clip(s) });
          gsap.set(caret, c);
          gsap.set(claude, { x: clampX(c.x + 8), y: c.y + capH * 0.7 });
        },
      },
      1.15
    )
    .set(name, { clearProps: 'clipPath' }, 2.16)
    .to([nameBox, caret], { autoAlpha: 0, duration: 0.2 }, 2.2)

    // Claude: marca la caja del texto y lo suelta línea por línea adentro.
    .to(claude, { ...at('text', 0, 0), duration: 0.4 }, 2.2)
    .set(textBox, frameAt('text'), 2.6)
    .to(textBox, { ...grow('text', textBox), duration: 0.4 }, 2.6)
    .to(claude, { ...at('text', 1, 1), duration: 0.4 }, 2.6)
    .from(text.children, { autoAlpha: 0, y: 14, duration: 0.4, ease: 'power3.out', stagger: 0.07 }, 2.95)
    .to(textBox, { autoAlpha: 0, duration: 0.25 }, 3.4);

  // Gemini: baja las verticales recorriendo el borde de arriba, cruza las horizontales bajando por la izquierda,
  // dibuja el círculo con el cursor sobre el trazo y marca el centro con un clic.
  tl.fromTo(vLines, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.35, ease: 'power2.out', stagger: 0.05 }, 0.65)
    .to(gemini, { ...at('figure', 0.95, 0), duration: 0.5, ease: 'none' }, 0.65)
    .fromTo(hLines, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.35, ease: 'power2.out', stagger: 0.04 }, 1.2)
    .to(gemini, { ...at('figure', 0, 0.75), duration: 0.5, ease: 'none' }, 1.2)
    .to(gemini, { ...at('ring', 1, 0.5), duration: 0.35 }, 1.75)
    .fromTo(ring, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.8, ease: 'power1.inOut' }, 2.1)
    .fromTo(
      orbit,
      { p: 0 },
      {
        p: 1,
        duration: 0.8,
        ease: 'power1.inOut',
        immediateRender: false,
        onUpdate: () => {
          const r = box.ring.w / 2;
          const a = orbit.p * Math.PI * 2;
          gsap.set(gemini, { x: box.ring.x + r + r * Math.cos(a), y: box.ring.y + r + r * Math.sin(a) });
        },
      },
      2.1
    )
    .to(gemini, { ...at('ring', 0.5, 0.5), duration: 0.3 }, 2.95)
    .fromTo(dot, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.3, ease: 'back.out(3)' }, 3.25);
  click(geminiPulse, gemini, 3.25);

  // ChatGPT: marca el cuadro de la foto, la sube con una barra de carga y la suelta con un clic.
  tl.set(photoBox, frameAt('figure'), 0.7)
    .to(photoBox, { ...grow('figure', photoBox), duration: 0.6 }, 0.7)
    .to(openai, { ...at('figure', 1, 1), duration: 0.6 }, 0.7)
    .to(openai, { ...at('figure', 0.5, 0.92), duration: 0.35 }, 1.35)
    .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power1.inOut', immediateRender: false }, 1.4)
    .fromTo(img, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'power2.inOut', clearProps: 'clipPath' }, 2.1)
    .to(openai, { ...at('figure', 0.5, 0.5), duration: 0.4 }, 2.1)
    .to(q('[data-upload]'), { autoAlpha: 0, duration: 0.2 }, 2.15);
  click(openaiPulse, openai, 2.6);
  tl.to(photoBox, { autoAlpha: 0, duration: 0.3 }, 2.75);

  // Terminan y se van, cada uno por su lado.
  tl.to([openai, gemini, claude], { x: '+=28', y: '+=18', autoAlpha: 0, duration: 0.4, ease: 'power2.in', stagger: 0.15 }, 3.3);

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

const Box = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
  border: 1.5px dashed var(--c);

  > i {
    position: absolute;
    width: 9px;
    height: 9px;
    background: ${INK.ground};
    border: 1.5px solid var(--c);
  }
  > i:nth-of-type(1) { top: -5px; left: -5px; }
  > i:nth-of-type(2) { top: -5px; right: -5px; }
  > i:nth-of-type(3) { bottom: -5px; left: -5px; }
  > i:nth-of-type(4) { bottom: -5px; right: -5px; }
`;

const Size = styled.span`
  position: absolute;
  top: -1.75rem;
  left: -1px;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: ${FONT.text};
  font-size: 0.7rem;
  font-variant-numeric: tabular-nums;
  line-height: 1;
  white-space: nowrap;

  /* El nombre arranca pegado a la nav: su medida va abajo de la caja. */
  [data-frame='claude-name'] > & {
    top: auto;
    bottom: -1.75rem;
  }
`;

const Upload = styled.div`
  position: absolute;
  left: 50%;
  bottom: 12%;
  width: min(60%, 14rem);
  translate: -50% 0;
  display: grid;
  gap: 0.4rem;
  padding: 0.6rem 0.7rem;
  border-radius: 6px;
  background: ${INK.ground};
  color: ${INK.cream};
  font-family: ${FONT.text};
  font-size: 0.75rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.4);

  b {
    display: block;
    height: 4px;
    border-radius: 2px;
    background: rgba(239, 230, 200, 0.2);
    overflow: hidden;
  }
  em {
    display: block;
    height: 100%;
    background: ${INK.lime};
    transform-origin: left;
    transform: scaleX(0);
  }
`;

const Caret = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  background: ${INK.red};
  visibility: hidden;
`;

const Pulse = styled.span`
  position: absolute;
  top: -18px;
  left: -18px;
  width: 36px;
  height: 36px;
  border: 2px solid;
  border-radius: 50%;
  visibility: hidden;
`;

export default HeroAgents;
