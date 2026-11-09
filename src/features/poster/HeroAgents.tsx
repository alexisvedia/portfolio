import React from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { FONT, INK } from './content';
import { AI_AGENTS } from './aiAgents';
import HiloMark from './HiloMark';

/* Mismo corte que el hero mobile de PosterHome: abajo de este ancho no hay agentes, cada pieza entra sola. */
export const HERO_MOBILE = '(max-width: 860px)';

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
    {/* El logo arranca en el centro: los agentes se llevan el trazo a la nav y el anillo al hero. */}
    <IntroLogo data-intro-logo="">
      <HiloMark ink={INK.cream} accent="transparent" />
    </IntroLogo>
    <IntroRing data-intro-ring="">
      <svg viewBox="193 18 44 44">
        <path fill={INK.red} fillRule="evenodd" d="M215 18a22 22 0 1 1 0 44a22 22 0 1 1 0-44zm0 14a8 8 0 1 0 0 16a8 8 0 1 0 0-16z" />
      </svg>
    </IntroRing>
    <Frame id="claude-name" color={INK.red} ink={INK.cream} />
    <Frame id="qwen-text" color={INK.violet} ink={INK.cream} />
    <Frame id="grok-cta" color={INK.cream} ink={INK.ground} />
    <Frame id="openai" color={INK.lime} ink={INK.ground}>
      <Upload data-upload="">
        <span>retrato.webp</span>
        <b>
          <em data-upload-bar="" />
        </b>
      </Upload>
    </Frame>
    <Caret data-caret="" />
    {AI_AGENTS.map(({ id, color }) => (
      <Pulse key={id} data-pulse={id} style={{ borderColor: color }} />
    ))}
    {AI_AGENTS.map(({ id, name, color, ink, Icon }) => (
      <Agent key={id} data-agent={id}>
        <svg viewBox="0 0 16 22" width={18} height={24}>
          <path d="M1 1v17l4.6-4.4 3.3 7.2 3.1-1.4-3.2-7h6.4z" fill={color} stroke={INK.ground} strokeWidth={1.4} strokeLinejoin="round" />
        </svg>
        <Tag style={{ background: color, color: ink }}>
          <Icon aria-hidden="true" />
          <span>{name}</span>
        </Tag>
      </Agent>
    ))}
  </Layer>
);

type Rect = { x: number; y: number; w: number; h: number };
type Id = (typeof AI_AGENTS)[number]['id'];
const ZERO: Rect = { x: 0, y: 0, w: 0, h: 0 };

/**
 * Entrada del hero. Arranca el logo Hilo en el centro y aparecen los siete agentes alrededor.
 * GLM se lleva el trazo del logo a la nav y DeepSeek arrastra el anillo hasta el círculo de la foto y lo traza.
 * Claude escribe el nombre, Gemini traza la grilla, ChatGPT sube la foto, Qwen suelta el texto y Grok los botones.
 * Al terminar se van: Alexis (2026-11-08) no quiere la fila de íconos en el hero.
 * Las posiciones se miden al arrancar (con las fuentes ya cargadas), relativas al hero.
 * En mobile no hay agentes: cada pieza entra sola con su propia animación (softIntro).
 */
/** `still`: con movimiento reducido no se anima la nav. */
export const heroIntro = (hero: HTMLElement, nav: HTMLElement | null, still = false) => {
  if (!still && window.matchMedia(HERO_MOBILE).matches) return softIntro(hero, nav);
  const q = gsap.utils.selector(hero);
  const name = q('[data-hero-name]')[0] as HTMLElement;
  const figure = q('[data-hero-portrait]')[0] as HTMLElement;
  const img = figure.querySelector('img') as HTMLElement;
  const text = q('[data-hero-text]')[0] as HTMLElement;
  const ctas = q('[data-hero-ctas]')[0] as HTMLElement;
  const vLines = q('[data-guide-v]');
  const hLines = q('[data-guide-h]');
  const ring = q('[data-guide-circle]')[0];
  const dot = q('[data-guide-dot]')[0];
  const logo = q('[data-intro-logo]')[0] as HTMLElement;
  const logoRing = q('[data-intro-ring]')[0] as HTMLElement;
  const mark = nav?.querySelector('svg') ?? null;
  const agent = Object.fromEntries(AI_AGENTS.map(a => [a.id, q(`[data-agent="${a.id}"]`)[0]])) as Record<Id, HTMLElement>;
  const pulse = Object.fromEntries(AI_AGENTS.map(a => [a.id, q(`[data-pulse="${a.id}"]`)[0]])) as Record<Id, HTMLElement>;
  const frame = (id: string) => q(`[data-frame="${id}"]`)[0] as HTMLElement;
  const [nameBox, textBox, ctaBox, photoBox] = ['claude-name', 'qwen-text', 'grok-cta', 'openai'].map(frame);
  const caret = q('[data-caret]')[0];
  const bar = q('[data-upload-bar]')[0];

  const box = { hero: ZERO, name: ZERO, h1: ZERO, figure: ZERO, text: ZERO, cta: ZERO, ring: ZERO, mark: ZERO, logo: ZERO, logoRing: ZERO };
  let mobile = false;
  // Después de cada letra: borde derecho y línea (en mobile el nombre ocupa dos). Coordenadas del h1.
  let steps: { x: number; line: number }[] = [];
  let lineH = 0;
  let lines = 1;
  let capH = 0;
  let capTops: number[] = [];
  const measure = () => {
    const h = hero.getBoundingClientRect();
    // Medidas en px del hero sin escalar: el scrub del Manifiesto lo achica, y la nav es fixed (no se corre con el scroll).
    const k = h.width / hero.offsetWidth || 1;
    const rel = (r: DOMRect): Rect => ({ x: (r.left - h.left) / k, y: (r.top - h.top) / k, w: r.width / k, h: r.height / k });
    const fixed = (r: DOMRect): Rect => ({ x: r.left, y: r.top, w: r.width, h: r.height });
    mobile = window.matchMedia(HERO_MOBILE).matches;
    const range = document.createRange();
    range.selectNodeContents(name);
    box.name = rel(range.getBoundingClientRect());
    box.h1 = rel(name.getBoundingClientRect());
    box.figure = rel(figure.getBoundingClientRect());
    box.text = rel(text.getBoundingClientRect());
    box.cta = rel(ctas.getBoundingClientRect());
    box.ring = rel(ring.getBoundingClientRect());
    box.mark = mark ? fixed(mark.getBoundingClientRect()) : ZERO;
    box.hero = { x: 0, y: 0, w: hero.offsetWidth, h: hero.offsetHeight };
    // El logo ocupa el centro; el anillo está en (215, 40) con radio 22 dentro del viewBox de 256.
    const s = Math.min(box.hero.w * 0.3, box.hero.h * 0.3, 220);
    // Centrado en la pantalla visible, no en el hero (puede ser más alto), y por el dibujo: el trazo del AV ocupa
    // x 28 a 237 e y 18 a 214 del viewBox, así que se corre lo que le falta a su centro para caer en el de la caja.
    const cy = Math.min(box.hero.h, window.innerHeight) / 2;
    box.logo = { x: box.hero.w / 2 - s / 2 - (4.5 / 256) * s, y: cy - s / 2 + (12 / 256) * s, w: s, h: s };
    box.logoRing = { x: box.logo.x + (193 / 256) * s, y: box.logo.y + (18 / 256) * s, w: (44 / 256) * s, h: (44 / 256) * s };
    const node = name.firstChild;
    const chars: { x: number; top: number; space: boolean }[] = [];
    if (node?.nodeType === Node.TEXT_NODE) {
      const str = node.textContent ?? '';
      for (let i = 0; i < str.length; i++) {
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        const r = range.getBoundingClientRect();
        chars.push({ x: (r.right - h.left) / k - box.h1.x, top: r.top, space: !str[i].trim() });
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
    capTops = tops.length ? tops.map(t => (t - h.top) / k + capOff) : [box.h1.y];
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
  // La etiqueta mide unos 100 px (30 en mobile): el cursor no pasa de ahí para que no se corte contra el borde.
  const clampX = (x: number) => Math.min(x, box.hero.w - (mobile ? 40 : 110));
  const at = (k: keyof typeof box, fx: number, fy: number) => ({
    x: () => clampX(box[k].x + box[k].w * fx),
    y: () => box[k].y + box[k].h * fy,
  });
  const place = (k: keyof typeof box) => ({ x: () => box[k].x, y: () => box[k].y, width: () => box[k].w, height: () => box[k].h });
  const frameAt = (k: keyof typeof box) => ({ x: () => box[k].x, y: () => box[k].y, width: 0, height: 0, autoAlpha: 1 });
  const grow = (k: keyof typeof box, el: HTMLElement) => ({
    width: () => box[k].w,
    height: () => box[k].h,
    onUpdate: () => {
      const label = el.querySelector('[data-size]');
      if (label) label.textContent = `${Math.round(el.offsetWidth)} × ${Math.round(el.offsetHeight)}`;
    },
  });
  // Pulso de clic en la punta del cursor.
  const click = (id: Id, t: number) =>
    tl
      .set(pulse[id], { x: () => Number(gsap.getProperty(agent[id], 'x')), y: () => Number(gsap.getProperty(agent[id], 'y')) }, t)
      .fromTo(pulse[id], { scale: 0.2, autoAlpha: 1 }, { scale: 1.6, autoAlpha: 0, duration: 0.45, ease: 'power2.out', immediateRender: false }, t);
  // Al terminar su parte, el agente se achica y se va donde está.
  const park = (id: Id, t: number) =>
    tl.to(agent[id], { autoAlpha: 0, scale: 0.6, transformOrigin: '0 0', duration: 0.4, ease: 'power2.in' }, t);

  const typing = { i: 0 };
  const orbit = { p: 0 };
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power3.inOut' } }).timeScale(1.3);

  // Logo: se dibuja en el centro y los siete agentes aparecen a su alrededor.
  const around = (i: number) => {
    const a = -Math.PI / 2 + (i * Math.PI * 2) / AI_AGENTS.length;
    const r = box.logo.w * 0.95;
    return { x: box.logo.x + box.logo.w / 2 + r * Math.cos(a) - (mobile ? 14 : 50), y: box.logo.y + box.logo.h / 2 + r * Math.sin(a) - 16 };
  };
  tl.set(name, { clipPath: 'inset(0% 100% 0% 0%)', immediateRender: true }, 0)
    .call(measure, [], 0)
    .set(logo, { ...place('logo'), autoAlpha: 1 }, 0)
    .set(logoRing, { ...place('logoRing'), scale: 0, autoAlpha: 1 }, 0)
    .fromTo(q('[data-intro-logo] [data-stroke]'), { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.5, ease: 'power2.inOut', stagger: 0.12 }, 0)
    .to(logoRing, { scale: 1, duration: 0.35, ease: 'back.out(2.5)' }, 0.45);
  // En fromTo, lo que no está en el destino no se aplica: la posición va en un set aparte.
  AI_AGENTS.forEach(({ id }, i) =>
    tl
      .set(agent[id], { x: () => around(i).x, y: () => around(i).y }, 0.3 + i * 0.05)
      .fromTo(agent[id], { scale: 0.4, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.35, ease: 'back.out(2)', immediateRender: false }, 0.3 + i * 0.05)
  );

  // GLM toma el trazo y lo lleva a la nav, que aparece cuando llega.
  tl.to(agent.glm, { ...at('logo', 0.3, 0.55), duration: 0.25 }, 0.8)
    .to(logo, { ...place('mark'), duration: 0.5 }, 1.05)
    .to(agent.glm, { ...at('mark', 1, 1), duration: 0.5 }, 1.05);
  if (nav && !still) tl.from(nav, { autoAlpha: 0, duration: 0.25, ease: 'none' }, 1.45);
  tl.to(logo, { autoAlpha: 0, duration: 0.15 }, 1.6);
  park('glm', 1.7);

  // DeepSeek arrastra el anillo hasta el círculo de la foto, lo traza dando la vuelta y marca el centro.
  tl.to(agent.deepseek, { ...at('logoRing', 0.5, 0.5), duration: 0.25 }, 0.8)
    .to(logoRing, { ...place('ring'), duration: 0.5 }, 1.05)
    .to(agent.deepseek, { ...at('ring', 0.5, 0.5), duration: 0.5 }, 1.05)
    .to(agent.deepseek, { ...at('ring', 1, 0.5), duration: 0.2 }, 1.55)
    .fromTo(ring, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.8, ease: 'power1.inOut' }, 1.75)
    .to(logoRing, { autoAlpha: 0, duration: 0.5 }, 1.75)
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
          gsap.set(agent.deepseek, { x: box.ring.x + r + r * Math.cos(a), y: box.ring.y + r + r * Math.sin(a) });
        },
      },
      1.75
    )
    .to(agent.deepseek, { ...at('ring', 0.5, 0.5), duration: 0.3 }, 2.6)
    .fromTo(dot, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.3, ease: 'back.out(3)' }, 2.9);
  click('deepseek', 2.9);
  park('deepseek', 3.2);

  // Desde acá trabajan los otros cinco, en paralelo.
  const O = 1;

  // Claude: arrastra la caja del nombre, escribe letra por letra con el cursor de texto y suelta la caja.
  tl.to(agent.claude, { ...at('name', 0, 0), duration: 0.5 }, O)
    .set(nameBox, frameAt('name'), O + 0.5)
    .to(nameBox, { ...grow('name', nameBox), duration: 0.45 }, O + 0.5)
    .to(agent.claude, { ...at('name', 1, 1), duration: 0.45 }, O + 0.5)
    .set(caret, { x: () => caretAt(steps[0]).x, y: () => caretAt(steps[0]).y, height: () => capH, autoAlpha: 1 }, O + 0.95)
    .to(agent.claude, { x: () => clampX(caretAt(steps[0]).x + 8), y: () => caretAt(steps[0]).y + capH * 0.7, duration: 0.2 }, O + 0.95)
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
          gsap.set(agent.claude, { x: clampX(c.x + 8), y: c.y + capH * 0.7 });
        },
      },
      O + 1.15
    )
    .set(name, { clearProps: 'clipPath' }, O + 2.16)
    .to([nameBox, caret], { autoAlpha: 0, duration: 0.2 }, O + 2.2);
  park('claude', O + 2.3);

  // Qwen: marca la caja del texto y lo suelta línea por línea adentro.
  tl.to(agent.qwen, { ...at('text', 0, 0), duration: 0.5 }, O + 0.6)
    .set(textBox, frameAt('text'), O + 1.1)
    .to(textBox, { ...grow('text', textBox), duration: 0.4 }, O + 1.1)
    .to(agent.qwen, { ...at('text', 1, 0.4), duration: 0.4 }, O + 1.1)
    .from([...text.children].filter(c => c !== ctas), { autoAlpha: 0, y: 14, duration: 0.4, ease: 'power3.out', stagger: 0.09 }, O + 1.45)
    .to(textBox, { autoAlpha: 0, duration: 0.25 }, O + 2);
  park('qwen', O + 2.05);

  // Grok: marca los botones, los suelta y hace clic en el principal.
  tl.to(agent.grok, { ...at('cta', 0, 0), duration: 0.5 }, O + 0.9)
    .set(ctaBox, frameAt('cta'), O + 1.4)
    .to(ctaBox, { ...grow('cta', ctaBox), duration: 0.35 }, O + 1.4)
    .to(agent.grok, { ...at('cta', 1, 1), duration: 0.35 }, O + 1.4)
    .from(ctas.children, { autoAlpha: 0, y: 10, scale: 0.94, duration: 0.35, ease: 'back.out(2)', stagger: 0.1 }, O + 1.75)
    .to(agent.grok, { ...at('cta', 0.2, 0.6), duration: 0.3 }, O + 1.85);
  click('grok', O + 2.15);
  tl.to(ctaBox, { autoAlpha: 0, duration: 0.25 }, O + 2.25);
  park('grok', O + 2.35);

  // Gemini: baja las verticales recorriendo el borde de arriba y cruza las horizontales bajando por la izquierda.
  tl.to(agent.gemini, { ...at('figure', 0, 0), duration: 0.5 }, O)
    .fromTo(vLines, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.35, ease: 'power2.out', stagger: 0.05 }, O + 0.65)
    .to(agent.gemini, { ...at('figure', 0.95, 0), duration: 0.5, ease: 'none' }, O + 0.65)
    .fromTo(hLines, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 0.35, ease: 'power2.out', stagger: 0.04 }, O + 1.2)
    .to(agent.gemini, { ...at('figure', 0, 0.75), duration: 0.5, ease: 'none' }, O + 1.2);
  park('gemini', O + 1.8);

  // ChatGPT: marca el cuadro de la foto, la sube con una barra de carga y la suelta con un clic.
  tl.to(agent.openai, { ...at('figure', 0.02, 0.04), duration: 0.5 }, O)
    .set(photoBox, frameAt('figure'), O + 0.7)
    .to(photoBox, { ...grow('figure', photoBox), duration: 0.6 }, O + 0.7)
    .to(agent.openai, { ...at('figure', 1, 1), duration: 0.6 }, O + 0.7)
    .to(agent.openai, { ...at('figure', 0.5, 0.92), duration: 0.35 }, O + 1.35)
    .fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 0.7, ease: 'power1.inOut', immediateRender: false }, O + 1.4)
    .fromTo(img, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.8, ease: 'power2.inOut', clearProps: 'clipPath' }, O + 2.1)
    .to(agent.openai, { ...at('figure', 0.5, 0.5), duration: 0.4 }, O + 2.1)
    .to(q('[data-upload]'), { autoAlpha: 0, duration: 0.2 }, O + 2.15);
  click('openai', O + 2.6);
  tl.to(photoBox, { autoAlpha: 0, duration: 0.3 }, O + 2.75);
  park('openai', O + 2.75);

  return tl;
};

/**
 * Entrada mobile: sin agentes ni cajas. Cada pieza entra sola y con su gesto: el nombre sube detrás de una máscara,
 * la foto se asienta desde un zoom leve, la grilla se abre desde el centro, el aro se traza, el texto se enfoca y los
 * botones caen con un rebote corto.
 */
const softIntro = (hero: HTMLElement, nav: HTMLElement | null) => {
  const q = gsap.utils.selector(hero);
  const name = q('[data-hero-name]')[0] as HTMLElement;
  const img = (q('[data-hero-portrait]')[0] as HTMLElement).querySelector('img') as HTMLElement;
  const text = q('[data-hero-text]')[0] as HTMLElement;
  const ctas = q('[data-hero-ctas]')[0] as HTMLElement;
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
  // La máscara pasa los bordes de la caja: con line-height 0.8 las mayúsculas sobresalen del renglón.
  tl.fromTo(name, { clipPath: 'inset(-30% -5% 100% -5%)', y: 28 }, { clipPath: 'inset(-30% -5% -30% -5%)', y: 0, duration: 1.2, clearProps: 'clipPath,transform' }, 0)
    .fromTo(img, { scale: 1.12, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 1.5, ease: 'power3.out', clearProps: 'transform' }, 0.15)
    .fromTo(q('[data-guide-v], [data-guide-h]'), { drawSVG: '50% 50%' }, { drawSVG: '0% 100%', duration: 1.1, ease: 'power2.inOut', stagger: 0.03 }, 0.3)
    .fromTo(q('[data-guide-circle]'), { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 1.2, ease: 'power2.inOut' }, 0.45)
    .fromTo(q('[data-guide-dot]'), { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.5, ease: 'back.out(3)' }, 1.4)
    .from([...text.children].filter(c => c !== ctas), { autoAlpha: 0, y: 18, filter: 'blur(6px)', duration: 0.9, ease: 'power3.out', stagger: 0.12, clearProps: 'filter' }, 0.6)
    .from(ctas.children, { autoAlpha: 0, y: 14, scale: 0.96, duration: 0.7, ease: 'back.out(1.6)', stagger: 0.1 }, 1.05);
  if (nav) tl.from(nav, { autoAlpha: 0, y: -12, duration: 0.7 }, 0.2);
  return tl;
};

const Layer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 6;
  pointer-events: none;
  overflow: clip;
`;

const IntroLogo = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;

  svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

const IntroRing = styled(IntroLogo)``;

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
