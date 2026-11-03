import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CustomEase } from 'gsap/CustomEase';
import {
  PiArrowLeftBold,
  PiArrowRightBold,
  PiChatsCircleFill,
  PiClosedCaptioningFill,
  PiHandFill,
  PiHashFill,
  PiKanbanFill,
  PiMicrophoneFill,
  PiPaletteFill,
  PiPhoneDisconnectFill,
  PiPauseFill,
  PiPlayFill,
  PiRobotFill,
  PiTreeStructureFill,
  PiVideoCameraFill,
  PiWarningCircleFill,
} from 'react-icons/pi';
import { CUBIQ, FONT, INK } from './content';

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create('cubiqTravel', '0.45,0,0.1,1');
const TRAVEL = 'cubiqTravel';

/*
 * Historia de Cubiq contada con una UI falsa: reunión, tarea, tablero, agente, alerta y resultado.
 * Todo lo que aparece en la ventana es inventado; las únicas cifras salen de CUBIQ.beats.
 * Desktop con movimiento: bloque pineado, el paso avanza con el scroll y encaja por pasos.
 * Mobile y reduced motion: sin pin, se recorre con Anterior/Siguiente, swipe o la barra de pasos.
 */

const PIN_QUERY =
  '(min-width: 1024px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';
// La nav fija de la home mide unos 70px: el bloque se pinea por debajo.
const PIN_TOP = 84;
const COMPACT_BELOW = 560;

const STEPS = [
  {
    title: 'La reunión',
    line: 'Un grabador propio graba la llamada, separa quién dijo qué y va tomando notas.',
    hint: 'Probá pausar la grabación.',
  },
  { title: 'La tarea', line: 'De lo que se dijo sale una tarea, sin que nadie la anote.' },
  {
    title: 'El tablero',
    line: 'La tarjeta cae sola en el tablero del chat interno.',
    hint: 'Tocá la tarjeta para cambiarla de columna.',
  },
  {
    title: 'El agente',
    line: 'Un agente de IA la toma, la comenta y deja trazado el cambio en n8n.',
    hint: 'Tocá la tarjeta para cambiarla de columna.',
  },
  {
    title: 'La alerta',
    line: 'Si un workflow falla, el aviso llega solo a una sala y el agente explica la causa.',
  },
  {
    title: 'El resultado',
    line: 'Conversación, tareas, diseños y bots en un solo lugar, con datos propios.',
  },
];
const N = STEPS.length;
// Dónde descansa el scroll en cada paso, como progreso del pin: el centro de cada tramo.
const SNAPS = STEPS.map((_, i) => (i === 0 ? 0 : i === N - 1 ? 1 : (i + 0.5) / N));

type Slot = 'msg' | 'todo' | 'doing' | 'unfurl' | 'review';
type Col = 'todo' | 'doing' | 'review';
type View = 'producto' | 'tablero' | 'alertas';

const VIEW: View[] = ['producto', 'producto', 'tablero', 'tablero', 'alertas', 'tablero'];
const STEP_SLOT: (Slot | null)[] = [null, 'msg', 'todo', 'doing', 'unfurl', 'review'];
const NEXT_COL: Record<Col, Col> = { todo: 'doing', doing: 'review', review: 'todo' };
const STATUS = ['Por hacer', 'En curso', 'En revisión'];
const STATUS_OF: Record<Slot, number> = { msg: 0, todo: 0, doing: 1, unfurl: 2, review: 2 };

/* Tema de la app falsa: neutros oscuros con un paso de luz por superficie y acentos de INK. */
const APP = {
  chrome: '#141416',
  surface: '#1a1a1d',
  raised: '#232327',
  rec: '#121214',
  line: 'rgba(255, 255, 255, 0.08)',
  ink1: 'rgba(255, 255, 255, 0.05)',
  ink2: 'rgba(255, 255, 255, 0.07)',
  ink3: 'rgba(255, 255, 255, 0.1)',
  text: '#9d9da1',
  body: '#cfcfd3',
  strong: '#ececee',
  faint: '#6c6c70',
  icon: '#8f8f95',
};
/* Paleta de la llamada: la de Google Meet en modo oscuro. */
const MEET = { ground: '#202124', tile: '#3c4043', blue: '#8ab4f8', red: '#ea4335' };

const STATUS_DOT = [APP.faint, INK.lime, INK.teal];
const SHADOW_REST = '0 0 0 1px rgba(255, 255, 255, 0.07), 0 1px 2px 0 rgba(0, 0, 0, 0.35)';
const SHADOW_LIFT = '0 0 0 1px rgba(255, 255, 255, 0.14), 0 18px 34px -6px rgba(0, 0, 0, 0.7)';

interface Person {
  name: string;
  initials: string;
  bg: string;
  fg: string;
  bot?: boolean;
}

const WHO: Record<string, Person> = {
  producto: { name: 'Producto', initials: 'P', bg: INK.orange, fg: INK.ground },
  desarrollo: { name: 'Desarrollo', initials: 'D', bg: INK.blue, fg: '#fff' },
  cliente: { name: 'Cliente', initials: 'C', bg: INK.violet, fg: '#fff' },
  recorder: { name: 'MeetRecorder', initials: 'MR', bg: INK.red, fg: '#fff', bot: true },
  agent: { name: 'Agente de n8n', initials: 'AN', bg: INK.teal, fg: '#fff', bot: true },
  monitor: { name: 'Monitor de n8n', initials: 'MN', bg: INK.cream, fg: INK.ground, bot: true },
};

const SPEAKERS = [WHO.producto, WHO.desarrollo, WHO.cliente];
const LINES = [
  { who: WHO.cliente, text: 'Si el ERP se cae, los pedidos se traban.' },
  { who: WHO.producto, text: 'Que se reintenten solos y nos avise.' },
  { who: WHO.desarrollo, text: 'Lo sumo al workflow de pedidos.' },
];
const FRAGMENT = 'Que se reintenten solos y nos avise';
// Una nota por línea de la transcripción: aparece cuando el grabador la escucha.
const NOTES = [
  { text: 'Si el ERP se cae, los pedidos quedan trabados.' },
  { text: 'Reintentar solos los pedidos y avisar al equipo.', task: true },
  { text: 'Desarrollo lo suma al workflow de pedidos.' },
];

const COLS: { id: Col; fillers: { tag: string; w: [number, number] }[] }[] = [
  {
    id: 'todo',
    fillers: [
      { tag: INK.blue, w: [72, 46] },
      { tag: INK.orange, w: [58, 64] },
    ],
  },
  {
    id: 'doing',
    fillers: [
      { tag: INK.violet, w: [64, 40] },
      { tag: INK.blue, w: [50, 68] },
    ],
  },
  { id: 'review', fillers: [{ tag: INK.orange, w: [66, 52] }] },
];

const STATS = CUBIQ.beats
  .flatMap(beat => beat.stats ?? [])
  .map(stat => ({ ...stat, n: Number(stat.value.replace(/\./g, '')) }));
const HERO_STAT = STATS.find(stat => stat.label.includes('tarjetas')) ?? STATS[0];
const MORE_STATS = STATS.filter(stat => stat !== HERO_STAT);

const fmt = (n: number) => Math.round(n).toLocaleString('es-AR');
const on = (cond: boolean) => (cond ? '' : undefined);
const delay = (s: number) => ({ '--d': `${s}s` }) as React.CSSProperties;
const clampStep = (i: number) => Math.max(0, Math.min(N - 1, i));

/* Posición de un nodo dentro de un ancestro posicionado, en px de diseño: ignora transforms y escala. */
const within = (el: HTMLElement, root: HTMLElement) => {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    const parent = node.offsetParent as HTMLElement | null;
    if (parent && parent !== root) {
      x += parent.clientLeft;
      y += parent.clientTop;
    }
    node = parent;
  }
  return { x, y };
};

/* ---------- piezas chicas ---------- */

const Avatar: React.FC<{ who: Person; size?: number }> = ({ who, size = 26 }) => (
  <AvatarDisc
    aria-hidden="true"
    $bot={who.bot}
    style={{ background: who.bg, color: who.fg, width: size, height: size }}
  >
    {who.initials}
  </AvatarDisc>
);

const Roll: React.FC<{ items: string[]; index: number }> = ({ items, index }) => (
  <RollBox aria-hidden="true">
    {items.map((item, i) => (
      <span key={item} data-pos={i < index ? 'up' : i > index ? 'down' : 'on'}>
        {item}
      </span>
    ))}
  </RollBox>
);

const RecTimer: React.FC<{ running: boolean }> = ({ running }) => {
  const [seconds, setSeconds] = useState(12 * 60 + 48);
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setSeconds(s => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [running]);
  return <>{`${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`}</>;
};

const Facepile: React.FC<{ people: Person[] }> = ({ people }) => (
  <Pile aria-hidden="true">
    {people.map(p => (
      <Avatar key={p.initials} who={p} size={20} />
    ))}
  </Pile>
);

const Filler: React.FC<{ tag: string; w: [number, number] }> = ({ tag, w }) => (
  <FillerCard aria-hidden="true">
    <Bar style={{ width: 18, height: 5, background: tag }} />
    <Bar style={{ width: `${w[0]}%` }} />
    <Bar style={{ width: `${w[1]}%` }} />
  </FillerCard>
);

/* ---------- componente ---------- */

const CubiqStory: React.FC = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const winRef = useRef<HTMLDivElement>(null);
  const sideRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLButtonElement>(null);
  const chipRef = useRef<HTMLSpanElement>(null);
  const fragRef = useRef<HTMLSpanElement>(null);
  const recRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const ctxRef = useRef<gsap.Context | null>(null);
  const stepRef = useRef(0);

  const [step, setStep] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [still, setStill] = useState(false);
  const [compact, setCompact] = useState(false);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(true);
  const [heard, setHeard] = useState(0);
  const [moved, setMoved] = useState<{ step: number; col: Col } | null>(null);
  const [fontsTick, setFontsTick] = useState(0);

  const view = VIEW[step];
  const override = moved && moved.step === step ? moved.col : null;
  const slot: Slot | null = override ?? STEP_SLOT[step];
  const status = slot ? STATUS_OF[slot] : 0;
  const movable = step === 2 || step === 3;
  const recording = playing && visible && step <= 1 && !still;
  const heardShown = still || step >= 1 ? LINES.length : heard;
  const speaking = recording ? LINES[Math.max(0, heardShown - 1)].who : null;
  const back = step === N - 1;

  const show = useCallback((i: number) => {
    const next = clampStep(i);
    if (next === stepRef.current) return;
    stepRef.current = next;
    setStep(next);
  }, []);

  // Con pin, cambiar de paso es mover el scroll: si no, el próximo tick del scroll pisa el click.
  const goTo = useCallback(
    (i: number) => {
      const next = clampStep(i);
      const st = stRef.current;
      if (st) {
        const top = st.start + (st.end - st.start) * SNAPS[next];
        const inside = window.scrollY > st.start - 4 && window.scrollY < st.end + 4;
        window.scrollTo({ top, behavior: inside ? 'instant' : 'smooth' });
      }
      show(next);
    },
    [show]
  );

  /* Contexto de GSAP para los tweens que disparan los cambios de estado. */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {});
    ctxRef.current = ctx;
    return () => {
      ctx.revert();
      ctxRef.current = null;
    };
  }, []);

  /* Modo: pin con scroll en desktop, pasos sueltos en mobile; reduced motion apaga transiciones. */
  useLayoutEffect(() => {
    const pin = pinRef.current;
    if (!pin) return;
    const mm = gsap.matchMedia();
    mm.add(PIN_QUERY, () => {
      setPinned(true);
      stRef.current = ScrollTrigger.create({
        trigger: pin,
        pin: true,
        start: `top top+=${PIN_TOP}`,
        end: () => `+=${Math.round(window.innerHeight * 0.75 * (N - 1))}`,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: 2,
        snap: {
          snapTo: SNAPS,
          duration: { min: 0.2, max: 0.5 },
          delay: 0.12,
          ease: 'power2.inOut',
        },
        onUpdate: self => show(Math.min(N - 1, Math.floor(self.progress * N))),
      });
      return () => {
        stRef.current = null;
        setPinned(false);
      };
    });
    mm.add(REDUCED_QUERY, () => {
      setStill(true);
      return () => setStill(false);
    });
    return () => mm.revert();
  }, [show]);

  /* Escala de la maqueta: se diseña a 720 x 460 (o 358 x 600 en formato teléfono) y se ajusta al ancho. */
  useLayoutEffect(() => {
    const root = rootRef.current;
    const frame = frameRef.current;
    if (!root || !frame) return;
    const measure = () => {
      const isCompact = root.clientWidth < COMPACT_BELOW;
      setCompact(isCompact);
      frame.style.setProperty('--cs-s', String(frame.clientWidth / (isCompact ? 358 : 720)));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    ro.observe(frame);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let alive = true;
    document.fonts?.ready.then(() => alive && setFontsTick(t => t + 1));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: '-20% 0px',
    });
    io.observe(root);
    return () => io.disconnect();
  }, []);

  /* La transcripción avanza solo mientras se graba y se ve. */
  useEffect(() => {
    if (!recording || heard >= LINES.length) return;
    const id = window.setTimeout(() => setHeard(h => h + 1), heard === 0 ? 500 : 1300);
    return () => window.clearTimeout(id);
  }, [recording, heard]);

  /* La tarjeta: un solo objeto que viaja entre ranuras (mensaje, columnas, respuesta). */
  const placeRef = useRef({ shown: false, step: 0, key: '' });
  const liftRef = useRef<gsap.core.Timeline | null>(null);
  useLayoutEffect(() => {
    const card = cardRef.current;
    const win = winRef.current;
    const ctx = ctxRef.current;
    if (!card || !win || !ctx) return;
    const prev = placeRef.current;
    const key = `${compact}-${fontsTick}`;
    const snap = still || prev.key !== key;
    const from = prev.step;
    placeRef.current = { ...prev, step, key };
    const target = slot ? win.querySelector<HTMLElement>(`[data-cs-slot="${slot}"]`) : null;

    ctx.add(() => {
      if (!target) {
        placeRef.current.shown = false;
        gsap.to(card, { opacity: 0, scale: 0.97, duration: snap ? 0 : 0.25, overwrite: 'auto' });
        return;
      }
      const { x, y } = within(target, win);
      const width = target.offsetWidth;
      if (!placeRef.current.shown || snap) {
        // Recién creada desde la reunión: aparece cuando aterriza el fragmento.
        const landing = !snap && !placeRef.current.shown && from === 0 && step === 1;
        placeRef.current.shown = true;
        liftRef.current?.kill();
        gsap.killTweensOf(card);
        gsap.set(card, { x, y, width, rotation: 0, boxShadow: SHADOW_REST });
        gsap.to(card, {
          opacity: 1,
          scale: 1,
          duration: snap ? 0 : 0.45,
          delay: landing ? 1.45 : 0,
          ease: 'power2.out',
        });
        return;
      }
      const wait = step === 4 && from !== 4 ? 0.55 : 0.05;
      const dir = x >= Number(gsap.getProperty(card, 'x')) ? 1 : -1;
      liftRef.current?.kill();
      gsap.to(card, {
        x,
        y,
        width,
        opacity: 1,
        duration: 0.95,
        delay: wait,
        ease: TRAVEL,
        overwrite: 'auto',
      });
      liftRef.current = gsap
        .timeline({ delay: wait })
        .to(card, {
          scale: 1.04,
          rotation: 1.5 * dir,
          boxShadow: SHADOW_LIFT,
          duration: 0.28,
          ease: 'power2.out',
        })
        .to(
          card,
          { scale: 1, rotation: 0, boxShadow: SHADOW_REST, duration: 0.5, ease: 'power2.inOut' },
          0.5
        );
    });
  }, [slot, step, compact, still, fontsTick]);

  /* La llamada pasa de ocupar la maqueta (paso 1) a su esquina sobre el chat: FLIP con translate y scale,
     que no tocan offsetLeft/Top, así within() mide la posición final. */
  const recBoxRef = useRef<{ x: number; y: number; w: number; compact: boolean } | null>(null);
  useLayoutEffect(() => {
    const rec = recRef.current;
    const ctx = ctxRef.current;
    if (!rec || !ctx) return;
    const box = { x: rec.offsetLeft, y: rec.offsetTop, w: rec.offsetWidth, compact };
    const prev = recBoxRef.current;
    recBoxRef.current = box;
    if (still || !prev || prev.compact !== compact || prev.w === box.w) return;
    ctx.add(() => {
      gsap.fromTo(
        rec,
        { '--fx': `${prev.x - box.x}px`, '--fy': `${prev.y - box.y}px`, '--fs': prev.w / box.w },
        { '--fx': '0px', '--fy': '0px', '--fs': 1, duration: 0.6, ease: TRAVEL, overwrite: 'auto' }
      );
    });
  }, [step, compact, still]);

  /* El fragmento resaltado vuela de la transcripción a la tarjeta nueva. */
  const chipStepRef = useRef(0);
  useLayoutEffect(() => {
    const from = chipStepRef.current;
    chipStepRef.current = step;
    const chip = chipRef.current;
    const frag = fragRef.current;
    const stage = stageRef.current;
    const target = winRef.current?.querySelector<HTMLElement>('[data-cs-slot="msg"]');
    const ctx = ctxRef.current;
    if (still || from !== 0 || step !== 1 || !chip || !frag || !stage || !target || !ctx) return;
    const a = within(frag, stage);
    const b = within(target, stage);
    ctx.add(() => {
      gsap.killTweensOf(chip);
      gsap
        .timeline({ delay: 0.6 })
        .set(chip, { x: a.x - 6, y: a.y - 3, opacity: 0, scale: 1 })
        .to(chip, { opacity: 1, duration: 0.15 })
        .to(chip, { x: b.x + 10, y: b.y + 26, duration: 0.85, ease: TRAVEL })
        .to(chip, { opacity: 0, scale: 0.92, duration: 0.25 }, '-=0.12');
    });
  }, [step, still]);

  /* La selección de la barra lateral se desliza a la vista activa (al montar, sin recorrido). */
  const pillReadyRef = useRef(false);
  useLayoutEffect(() => {
    const item = sideRef.current?.querySelector<HTMLElement>(`[data-cs-item="${view}"]`);
    const pill = pillRef.current;
    const ctx = ctxRef.current;
    if (!item || !pill || !ctx) return;
    const instant = still || !pillReadyRef.current;
    pillReadyRef.current = true;
    ctx.add(() =>
      gsap.to(pill, {
        y: item.offsetTop,
        duration: instant ? 0 : 0.45,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    );
  }, [view, still, compact]);

  /* Cifras: cuentan una sola vez, la primera vez que se llega al resultado. */
  const countedRef = useRef(false);
  useLayoutEffect(() => {
    const ctx = ctxRef.current;
    if (step !== N - 1 || still || countedRef.current || !ctx) return;
    countedRef.current = true;
    const nodes = statsRef.current?.querySelectorAll<HTMLElement>('[data-cs-num]') ?? [];
    ctx.add(() =>
      nodes.forEach((el, i) => {
        const target = Number(el.dataset.csNum);
        const box = { v: 0 };
        el.textContent = fmt(0);
        gsap.to(box, {
          v: target,
          duration: 1.3,
          delay: 0.35 + i * 0.07,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = fmt(box.v);
          },
        });
      })
    );
  }, [step, still]);

  /* Swipe horizontal en la maqueta cuando no hay pin. */
  const swipeRef = useRef<{ x: number; y: number } | null>(null);
  const swipedRef = useRef(false);
  const onPointerDown = (e: React.PointerEvent) => {
    swipedRef.current = false;
    swipeRef.current = pinned ? null : { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const start = swipeRef.current;
    swipeRef.current = null;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      swipedRef.current = true;
      goTo(stepRef.current + (dx < 0 ? 1 : -1));
    }
  };

  const onCard = () => {
    if (!movable || swipedRef.current || !slot) return;
    setMoved({ step, col: NEXT_COL[slot as Col] });
  };

  const cardLabel = slot
    ? `Tarjeta ${step >= 2 ? 'T-12' : 'nueva'}, ${STATUS[status]}.${movable ? ` Moverla a ${STATUS[STATUS_OF[NEXT_COL[slot as Col]]]}.` : ''}`
    : undefined;
  const current = STEPS[step];

  return (
    <Root
      ref={rootRef}
      role="group"
      aria-label="Historia de Cubiq en seis pasos: de una reunión a un sistema con IA"
      data-cs-compact={on(compact)}
      data-still={on(still)}
      data-cs-pinned={on(pinned)}
    >
      <Pin ref={pinRef}>
        <Steps aria-label="Pasos">
          <Track aria-hidden="true">
            <span style={{ '--p': step / (N - 1) } as React.CSSProperties} />
          </Track>
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <StepButton
                type="button"
                aria-current={i === step ? 'step' : undefined}
                data-done={on(i < step)}
                onClick={() => goTo(i)}
              >
                <Ring aria-hidden="true" />
                <StepLabel>
                  <span aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                  <StepTitle>{s.title}</StepTitle>
                </StepLabel>
              </StepButton>
            </li>
          ))}
        </Steps>

        <Caption>
          <SrOnly aria-live="polite" aria-atomic="true">
            {`Paso ${step + 1} de ${N}: ${current.title}. ${current.line}`}
          </SrOnly>
          <CapNum aria-hidden="true">{String(step + 1).padStart(2, '0')}</CapNum>
          {/* Los seis textos apilados en una celda: el alto es el del más largo y la maqueta no salta. */}
          <CapStack aria-hidden="true">
            {STEPS.map((s, i) => (
              <CapBody key={s.title} data-on={on(i === step)}>
                <CapTitle>{s.title}</CapTitle>
                <CapLine>{s.line}</CapLine>
                {s.hint && <CapHint>{s.hint}</CapHint>}
              </CapBody>
            ))}
          </CapStack>
        </Caption>

        <Frame
          ref={frameRef}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerCancel={() => (swipeRef.current = null)}
        >
          <Stage ref={stageRef}>
            <Window ref={winRef} data-back={on(back)}>
              <Side ref={sideRef}>
                <Workspace aria-hidden="true">Cubiq</Workspace>
                <SidePill ref={pillRef} aria-hidden="true" />
                <SideList>
                  <SideButton
                    type="button"
                    data-cs-item="tablero"
                    data-active={on(view === 'tablero')}
                    disabled={back}
                    onClick={() => goTo(2)}
                    aria-label="Tablero, ir al paso 3"
                  >
                    <PiKanbanFill aria-hidden="true" />
                    Tablero
                  </SideButton>
                  <SideItem aria-hidden="true">
                    <PiPaletteFill />
                    Diseño
                  </SideItem>
                  <SideItem aria-hidden="true">
                    <PiRobotFill />
                    Bots
                  </SideItem>
                </SideList>
                <SideHead aria-hidden="true">Salas</SideHead>
                <SideList>
                  <SideItem aria-hidden="true">
                    <PiHashFill />
                    general
                  </SideItem>
                  <SideButton
                    type="button"
                    data-cs-item="producto"
                    data-active={on(view === 'producto')}
                    disabled={back}
                    onClick={() => goTo(0)}
                    aria-label="Sala producto, ir al paso 1"
                  >
                    <PiHashFill aria-hidden="true" />
                    producto
                  </SideButton>
                  <SideButton
                    type="button"
                    data-cs-item="alertas"
                    data-active={on(view === 'alertas')}
                    disabled={back}
                    onClick={() => goTo(4)}
                    aria-label="Sala alertas, ir al paso 5"
                  >
                    <PiHashFill aria-hidden="true" />
                    alertas
                  </SideButton>
                </SideList>
                <SideFoot aria-hidden="true">
                  <Facepile people={[WHO.producto, WHO.desarrollo, WHO.agent, WHO.recorder]} />
                </SideFoot>
              </Side>

              <Main>
                {/* Sala producto: acá llega la tarea que sale de la reunión. */}
                <ViewPane data-on={on(view === 'producto')} aria-hidden="true">
                  <ViewHead>
                    <PiHashFill />
                    <span>producto</span>
                    <Facepile people={[WHO.producto, WHO.desarrollo, WHO.recorder]} />
                  </ViewHead>
                  <Thread>
                    <Msg>
                      <Avatar who={WHO.producto} />
                      <MsgHead>
                        <strong>{WHO.producto.name}</strong>
                        <time>15:02</time>
                      </MsgHead>
                      <MsgText>Arranco la reunión con la distribuidora.</MsgText>
                    </Msg>
                    <Msg data-appear="" data-on={on(step >= 1)} style={delay(0.3)}>
                      <Avatar who={WHO.recorder} />
                      <MsgHead>
                        <strong>{WHO.recorder.name}</strong>
                        <BotTag>bot</BotTag>
                        <time>15:15</time>
                      </MsgHead>
                      <MsgText>Detecté una tarea en la reunión.</MsgText>
                      <MsgSlot data-cs-slot="msg" />
                    </Msg>
                  </Thread>
                  <Composer>Escribí en #producto</Composer>
                </ViewPane>

                {/* Tablero: la tarjeta entra en Por hacer y el agente la mueve. */}
                <ViewPane data-on={on(view === 'tablero')} aria-hidden="true">
                  <ViewHead>
                    <PiKanbanFill />
                    <span>Tablero</span>
                    <Facepile people={[WHO.producto, WHO.desarrollo, WHO.agent]} />
                  </ViewHead>
                  <Board>
                    {COLS.map((col, ci) => (
                      <Column key={col.id}>
                        <ColHead>
                          <Dot style={{ background: STATUS_DOT[ci] }} />
                          {STATUS[ci]}
                        </ColHead>
                        <BoardSlot data-cs-slot={col.id} data-open={on(slot === col.id)}>
                          {col.id === 'doing' && (
                            <Popover data-on={on(step === 3 && !override)} style={delay(1)}>
                              <PopHead>
                                <Avatar who={WHO.agent} size={22} />
                                <strong>{WHO.agent.name}</strong>
                                <time>ahora</time>
                              </PopHead>
                              <PopText>Tomo la tarea. Sumo reintentos al envío al ERP.</PopText>
                              <Diff>
                                <DiffHead>
                                  <PiTreeStructureFill />
                                  Sync de pedidos
                                  <span>Enviar al ERP</span>
                                </DiffHead>
                                <DiffLine data-kind="del">- retryOnFail: false</DiffLine>
                                <DiffLine data-kind="add">+ retryOnFail: true</DiffLine>
                                <DiffLine data-kind="add">+ maxTries: 3</DiffLine>
                              </Diff>
                              <Traced>
                                <Dot style={{ background: INK.teal }} />
                                Cambio trazado
                              </Traced>
                            </Popover>
                          )}
                        </BoardSlot>
                        {col.fillers.map((f, fi) => (
                          <Filler key={fi} tag={f.tag} w={f.w} />
                        ))}
                      </Column>
                    ))}
                  </Board>
                </ViewPane>

                {/* Sala alertas: el aviso llega solo y el agente responde con la causa. */}
                <ViewPane data-on={on(view === 'alertas')} aria-hidden="true">
                  <ViewHead>
                    <PiHashFill />
                    <span>alertas</span>
                    <Facepile people={[WHO.monitor, WHO.agent]} />
                  </ViewHead>
                  <Thread>
                    <Msg data-appear="" data-on={on(step === 4)} style={delay(0.25)}>
                      <Avatar who={WHO.monitor} />
                      <MsgHead>
                        <strong>{WHO.monitor.name}</strong>
                        <BotTag>bot</BotTag>
                        <time>15:40</time>
                      </MsgHead>
                      <Alert>
                        <AlertTitle>
                          <PiWarningCircleFill />
                          Falló «Sync de pedidos»
                        </AlertTitle>
                        <span>Nodo Enviar al ERP · Error 502</span>
                      </Alert>
                    </Msg>
                    <Msg data-appear="" data-on={on(step === 4)} style={delay(0.7)}>
                      <Avatar who={WHO.agent} />
                      <MsgHead>
                        <strong>{WHO.agent.name}</strong>
                        <BotTag>agente</BotTag>
                        <time>15:41</time>
                      </MsgHead>
                      <MsgText>
                        El ERP de la distribuidora no respondía. Los reintentos lo resolvieron: te
                        dejo la tarjeta para revisar.
                      </MsgText>
                      <MsgSlot data-cs-slot="unfurl" />
                    </Msg>
                  </Thread>
                  <Composer>Escribí en #alertas</Composer>
                </ViewPane>

                <TabBar aria-hidden="true">
                  <span data-active={on(view !== 'tablero')}>
                    <PiChatsCircleFill />
                    Salas
                  </span>
                  <span data-active={on(view === 'tablero')}>
                    <PiKanbanFill />
                    Tablero
                  </span>
                  <span>
                    <PiPaletteFill />
                    Diseño
                  </span>
                  <span>
                    <PiRobotFill />
                    Bots
                  </span>
                </TabBar>
              </Main>

              <Card
                ref={cardRef}
                type="button"
                disabled={!movable}
                aria-hidden={slot ? undefined : true}
                aria-label={cardLabel}
                onClick={onCard}
                style={{ '--cs-roll': step === 4 ? '1.6s' : '0.3s' } as React.CSSProperties}
              >
                <CardTop>
                  <CardId>
                    <Roll items={['Nueva', 'T-12']} index={step >= 2 ? 1 : 0} />
                  </CardId>
                  <AvatarSwap aria-hidden="true">
                    <span data-on={on(step < 3)}>
                      <Avatar who={WHO.recorder} size={20} />
                    </span>
                    <span data-on={on(step >= 3)} style={delay(0.45)}>
                      <Avatar who={WHO.agent} size={20} />
                    </span>
                  </AvatarSwap>
                </CardTop>
                <CardTitle aria-hidden="true">Reintentar pedidos</CardTitle>
                <CardFoot aria-hidden="true">
                  <Dot style={{ background: STATUS_DOT[status] }} />
                  <Roll items={STATUS} index={status} />
                  <Tag>n8n</Tag>
                </CardFoot>
              </Card>
            </Window>

            <Recorder ref={recRef} data-on={on(step <= 1)} data-full={on(step === 0)}>
              <MeetTop>
                <span aria-hidden="true">Distribuidora · pedidos</span>
                <RecBadge>
                  <RecDot data-live={on(recording)} aria-hidden="true" />
                  <strong aria-hidden="true">{playing ? 'REC' : 'Pausa'}</strong>
                  <time aria-hidden="true">
                    <RecTimer running={recording} />
                  </time>
                  <PlayButton
                    type="button"
                    aria-label={playing ? 'Pausar la grabación' : 'Reanudar la grabación'}
                    disabled={step > 1}
                    onClick={() => setPlaying(p => !p)}
                  >
                    {playing ? <PiPauseFill aria-hidden="true" /> : <PiPlayFill aria-hidden="true" />}
                  </PlayButton>
                </RecBadge>
              </MeetTop>
              <Tiles aria-hidden="true">
                {SPEAKERS.map(p => (
                  <Tile key={p.name} data-on={on(speaking === p)}>
                    <Avatar who={p} size={30} />
                    <TileName>{p.name}</TileName>
                    <Talk>
                      <i />
                      <i />
                      <i />
                    </Talk>
                  </Tile>
                ))}
              </Tiles>
              <Transcript aria-hidden="true">
                {LINES.map((line, i) => (
                  <TLine key={line.text} data-on={on(i < heardShown)}>
                    <span style={{ color: line.who.bg }}>{line.who.name}</span>
                    {line.text.startsWith(FRAGMENT) ? (
                      <span>
                        <Frag ref={fragRef} data-on={on(step >= 1)}>
                          {FRAGMENT}
                        </Frag>
                        {line.text.slice(FRAGMENT.length)}
                      </span>
                    ) : (
                      <span>{line.text}</span>
                    )}
                  </TLine>
                ))}
              </Transcript>
              <Notes aria-hidden="true">
                <NotesHead>
                  <Avatar who={WHO.recorder} size={20} />
                  <span>Notas de MeetRecorder</span>
                </NotesHead>
                <ol>
                  {NOTES.map((note, i) => (
                    <Note key={note.text} data-on={on(i < heardShown)} data-task={on(!!note.task)}>
                      {note.task && <b>Tarea</b>}
                      {note.text}
                    </Note>
                  ))}
                </ol>
                <NotesFoot data-on={on(recording && heardShown < LINES.length)}>Escribiendo…</NotesFoot>
              </Notes>
              <MeetControls aria-hidden="true">
                <time>15:14</time>
                <span>
                  <MeetBtn>
                    <PiMicrophoneFill />
                  </MeetBtn>
                  <MeetBtn>
                    <PiVideoCameraFill />
                  </MeetBtn>
                  <MeetBtn data-on="">
                    <PiClosedCaptioningFill />
                  </MeetBtn>
                  <MeetBtn>
                    <PiHandFill />
                  </MeetBtn>
                  <HangUp>
                    <PiPhoneDisconnectFill />
                  </HangUp>
                </span>
              </MeetControls>
            </Recorder>

            <FlyChip ref={chipRef} aria-hidden="true">
              {FRAGMENT}
            </FlyChip>
          </Stage>

          <Stats ref={statsRef} data-on={on(back)} style={delay(0.35)}>
            <dl>
              <HeroStat>
                <dt>
                  <span aria-hidden="true" data-cs-num={HERO_STAT.n}>
                    {HERO_STAT.value}
                  </span>
                  <SrOnly>{HERO_STAT.value}</SrOnly>
                </dt>
                <dd>{HERO_STAT.label}</dd>
              </HeroStat>
            </dl>
            <MoreStats>
              {MORE_STATS.map(stat => (
                <div key={stat.label}>
                  <dt>
                    <span aria-hidden="true" data-cs-num={stat.n}>
                      {stat.value}
                    </span>
                    <SrOnly>{stat.value}</SrOnly>
                  </dt>
                  <dd>{stat.label}</dd>
                </div>
              ))}
            </MoreStats>
          </Stats>
        </Frame>

        <Controls>
          <NavButton type="button" onClick={() => goTo(step - 1)} disabled={step === 0}>
            <PiArrowLeftBold aria-hidden="true" />
            Anterior
          </NavButton>
          <Count aria-hidden="true">
            {step + 1}
            <span>/{N}</span>
          </Count>
          <NavButton
            type="button"
            data-primary=""
            onClick={() => goTo(step + 1)}
            disabled={step === N - 1}
          >
            Siguiente
            <PiArrowRightBold aria-hidden="true" />
          </NavButton>
        </Controls>
      </Pin>
    </Root>
  );
};

export default CubiqStory;

/* ---------- estilos: página ---------- */

const EASE_IN = 'cubic-bezier(0.25, 0.8, 0.25, 1)';
const EASE_TRAVEL = 'cubic-bezier(0.45, 0, 0.1, 1)';

const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
`;

const Root = styled.div`
  font-family: ${FONT.text};
  color: ${INK.cream};
  line-height: 1.4;

  /* Reduced motion: cada paso es un estado fijo, sin recorridos. */
  &[data-still] *,
  &[data-still] *::before,
  &[data-still] *::after {
    transition-duration: 0s !important;
    transition-delay: 0s !important;
    animation: none !important;
  }
`;

/* El contenedor de queries va en Pin y no en Root: la contención de Root rompería el position: fixed del pin. */
const Pin = styled.div`
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  gap: clamp(0.9rem, 2.2vh, 1.4rem);
  padding-bottom: 0.5rem;

  /* Pineado, el scroll baja: los pasos van en columna, a la izquierda del texto y la maqueta. */
  [data-cs-pinned] & {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    align-content: start;
    column-gap: clamp(2rem, 4vw, 3.5rem);
  }
`;

const Steps = styled.ol`
  position: relative;
  display: grid;
  grid-template-columns: repeat(${N}, minmax(0, 1fr));
  margin: 0;
  padding: 0;
  list-style: none;

  [data-cs-pinned] & {
    grid-row: 1 / span 2;
    align-self: start;
    grid-template-columns: none;
    align-content: start;
    gap: 0.6rem;
    padding-top: 0.4rem;
  }
`;

const Track = styled.span`
  position: absolute;
  top: 10px;
  left: calc(100% / ${N * 2});
  right: calc(100% / ${N * 2});
  height: 2px;
  border-radius: 2px;
  background: rgba(239, 230, 200, 0.16);

  span {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: ${INK.red};
    transform: scaleX(var(--p));
    transform-origin: 0 50%;
    transition: transform 0.5s ${EASE_TRAVEL};
  }

  /* En columna, la línea une el centro del primer anillo con el del último. */
  [data-cs-pinned] & {
    top: calc(0.4rem + 22px);
    bottom: 22px;
    left: 10px;
    right: auto;
    width: 2px;
    height: auto;

    span {
      transform: scaleY(var(--p));
      transform-origin: 50% 0;
    }
  }
`;

const Ring = styled.span`
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${INK.ground};
  box-shadow: inset 0 0 0 2px rgba(239, 230, 200, 0.32);
  transition:
    box-shadow 0.3s ease,
    background-color 0.3s ease,
    transform 0.3s ${EASE_IN};
`;

const StepLabel = styled.span`
  display: grid;
  justify-items: center;
  gap: 0.1rem;

  [data-cs-pinned] & {
    grid-auto-flow: column;
    align-items: baseline;
    gap: 0.6rem;
  }

  > span:first-child {
    font-family: ${FONT.display};
    font-weight: 800;
    font-size: 1.3rem;
    line-height: 1;
    letter-spacing: 0.04em;
  }
`;

const StepTitle = styled.span`
  font-size: 0.8rem;
  line-height: 1.2;
  text-align: center;

  [data-cs-pinned] & {
    font-size: 0.95rem;
    text-align: left;
    white-space: nowrap;
  }

  @container (max-width: 560px) {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
`;

const StepButton = styled.button`
  display: grid;
  justify-items: center;
  gap: 0.45rem;
  width: 100%;
  min-height: 44px;
  padding: 0 0.15rem 0.2rem;
  border: 0;
  background: none;
  font: inherit;
  color: rgba(239, 230, 200, 0.5);
  cursor: pointer;
  transition: color 0.25s ease;

  &:hover {
    color: ${INK.cream};
  }

  [data-cs-pinned] & {
    grid-auto-flow: column;
    grid-template-columns: 22px auto;
    justify-content: start;
    align-items: center;
    gap: 0.9rem;
    padding: 0;
  }

  &[data-done] ${Ring} {
    box-shadow: inset 0 0 0 2px ${INK.red};
  }

  /* El paso activo: círculo con punto, como los anillos del afiche. */
  &[aria-current='step'] {
    color: ${INK.cream};
  }

  &[aria-current='step'] ${Ring} {
    background: ${INK.red};
    box-shadow:
      inset 0 0 0 2px ${INK.red},
      inset 0 0 0 6px ${INK.ground};
    transform: scale(1.12);
  }
`;

const Caption = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: start;
  gap: 0 clamp(0.9rem, 2.5vw, 1.6rem);
`;

const CapNum = styled.span`
  font-family: ${FONT.display};
  font-weight: 900;
  font-size: clamp(3.6rem, 7.5vw, 6rem);
  line-height: 0.78;
  color: ${INK.red};
`;

const CapStack = styled.div`
  display: grid;
`;

const CapBody = styled.div`
  grid-area: 1 / 1;
  display: grid;
  align-content: start;
  justify-items: start;
  gap: 0.35rem;
  opacity: 0;
  visibility: hidden;
  transform: translateY(10px);
  transition:
    opacity 0.2s ease,
    transform 0.2s ease,
    visibility 0s linear 0.2s;

  &[data-on] {
    opacity: 1;
    visibility: visible;
    transform: none;
    transition:
      opacity 0.4s ease 0.1s,
      transform 0.5s ${EASE_IN} 0.1s,
      visibility 0s;
  }
`;

const CapTitle = styled.div`
  font-family: ${FONT.display};
  font-weight: 800;
  font-size: clamp(2.2rem, 4.2vw, 3.4rem);
  line-height: 0.9;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: ${INK.cream};
`;

const CapLine = styled.div`
  max-width: 46ch;
  font-size: clamp(0.95rem, 0.9rem + 0.2vw, 1.05rem);
  color: rgba(239, 230, 200, 0.8);
`;

const CapHint = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: ${INK.lime};

  &::before {
    content: '';
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${INK.lime};
    box-shadow:
      inset 0 0 0 2px ${INK.lime},
      inset 0 0 0 3.5px ${INK.ground};
  }
`;

const Frame = styled.div`
  position: relative;
  width: 100%;
  max-width: 1240px;
  aspect-ratio: 720 / 460;
  container-type: inline-size;
  touch-action: pan-y;

  [data-cs-compact] & {
    aspect-ratio: 358 / 600;
    max-width: 430px;
    margin-inline: auto;
  }

  /* Pineado, la maqueta entra en el alto de la pantalla junto con la barra y el texto. */
  @media ${PIN_QUERY} {
    width: min(100%, calc((100svh - 18rem) * 720 / 460));

    [data-cs-compact] & {
      width: min(100%, calc((100svh - 18rem) * 358 / 600));
    }
  }
`;

const Stats = styled.div`
  position: absolute;
  inset: 0;
  z-index: 30;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.4fr);
  align-items: center;
  gap: 1.2rem 6cqw;
  padding: clamp(1.2rem, 6cqw, 3rem);
  border-radius: calc(14px * var(--cs-s, 1));
  background: rgba(13, 12, 11, 0.9);
  opacity: 0;
  transform: translateY(14px);
  pointer-events: none;
  transition:
    opacity 0.35s ease,
    transform 0.6s ${EASE_IN};

  &[data-on] {
    opacity: 1;
    transform: none;
    pointer-events: auto;
    transition-delay: var(--d, 0s);
  }

  dl {
    margin: 0;
  }

  dt {
    font-family: ${FONT.display};
    font-weight: 900;
    line-height: 0.82;
    color: ${INK.cream};
    font-variant-numeric: tabular-nums;
  }

  dd {
    margin: 0.35rem 0 0;
    font-size: clamp(0.72rem, 0.66rem + 0.5cqw, 0.85rem);
    line-height: 1.3;
    color: rgba(239, 230, 200, 0.72);
  }

  [data-cs-compact] & {
    grid-template-columns: 1fr;
    align-content: center;
  }
`;

const HeroStat = styled.div`
  dt {
    font-size: clamp(5rem, 21cqw, 10rem);
    color: ${INK.red};
  }

  dd {
    max-width: 16ch;
    font-size: clamp(0.85rem, 0.7rem + 0.9cqw, 1.05rem);
    color: ${INK.cream};
  }
`;

const MoreStats = styled.dl`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(0.8rem, 3cqw, 1.4rem) clamp(1rem, 4cqw, 1.8rem);

  dt {
    font-size: clamp(2rem, 7cqw, 3.4rem);
  }
`;

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media ${PIN_QUERY} {
    display: none;
  }
`;

const NavButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.55rem;
  min-height: 3.25rem;
  padding: 0 1.4rem;
  border: 0;
  border-radius: 999px;
  font: inherit;
  font-size: 1rem;
  color: ${INK.cream};
  background: none;
  box-shadow: inset 0 0 0 2px rgba(239, 230, 200, 0.35);
  cursor: pointer;
  transition:
    background-color 0.25s ease,
    box-shadow 0.25s ease,
    transform 0.2s ease;

  &[data-primary] {
    background: ${INK.red};
    color: ${INK.ground};
    box-shadow: none;
  }

  &:hover:not(:disabled) {
    box-shadow: inset 0 0 0 2px ${INK.cream};
  }

  &[data-primary]:hover:not(:disabled) {
    background: ${INK.cream};
    box-shadow: none;
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.35;
    cursor: default;
  }
`;

const Count = styled.span`
  font-family: ${FONT.display};
  font-weight: 800;
  font-size: 1.8rem;
  line-height: 1;

  span {
    color: rgba(239, 230, 200, 0.45);
  }
`;

/* ---------- estilos: app falsa (px de diseño, escalada) ---------- */

const appear = css`
  opacity: 0;
  transform: translateY(-6px);
  transition:
    opacity 0.3s ease,
    transform 0.5s ${EASE_IN};

  &[data-on] {
    opacity: 1;
    transform: none;
    transition-delay: var(--d, 0s);
  }
`;

const Stage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 720px;
  height: 460px;
  transform: scale(var(--cs-s, 1));
  transform-origin: 0 0;
  font-family: ${FONT.text};
  font-size: 12.5px;
  line-height: 1.35;
  color: ${APP.text};
  -webkit-font-smoothing: antialiased;

  svg {
    flex: none;
    width: 14px;
    height: 14px;
  }

  button {
    font: inherit;
  }

  [data-cs-compact] & {
    width: 358px;
    height: 600px;
  }
`;

const Window = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  overflow: hidden;
  isolation: isolate;
  border-radius: 14px;
  background: ${APP.surface};
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.08),
    0 30px 60px -12px rgba(0, 0, 0, 0.6);
  transition: transform 0.6s ${EASE_TRAVEL};

  &[data-back] {
    transform: scale(0.97);
  }

  [data-cs-compact] & {
    border-radius: 28px;
  }
`;

const Side = styled.div`
  position: relative;
  flex: none;
  display: flex;
  flex-direction: column;
  width: 168px;
  padding: 0 8px 12px;
  background: ${APP.chrome};
  box-shadow: inset -1px 0 0 ${APP.line};

  [data-cs-compact] & {
    display: none;
  }
`;

const Workspace = styled.div`
  display: flex;
  align-items: center;
  height: 44px;
  padding: 0 8px;
  font-size: 14px;
  color: ${APP.strong};
`;

const SidePill = styled.span`
  position: absolute;
  top: 0;
  left: 8px;
  right: 8px;
  height: 30px;
  border-radius: 6px;
  background: ${APP.ink3};
`;

const SideList = styled.div`
  display: grid;
  gap: 2px;
`;

const sideRow = css`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 30px;
  padding: 0 8px;
  border: 0;
  border-radius: 6px;
  background: none;
  color: ${APP.text};
  text-align: left;

  svg {
    color: ${APP.icon};
  }
`;

const SideItem = styled.span`
  ${sideRow}
`;

const SideButton = styled.button`
  ${sideRow}
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover:not(:disabled),
  &[data-active] {
    color: ${APP.strong};
  }

  &[data-active] svg {
    color: ${APP.strong};
  }

  &:disabled {
    cursor: default;
  }
`;

const SideHead = styled.div`
  margin: 14px 8px 4px;
  font-size: 11px;
  color: ${APP.faint};
`;

const SideFoot = styled.div`
  margin-top: auto;
  padding: 0 8px;
`;

const AvatarDisc = styled.span<{ $bot?: boolean }>`
  flex: none;
  display: inline-grid;
  place-items: center;
  border-radius: ${({ $bot }) => ($bot ? '7px' : '50%')};
  font-size: 9.5px;
  letter-spacing: 0.02em;
  line-height: 1;
`;

const Pile = styled.span`
  display: inline-flex;
  margin-left: auto;

  > span {
    box-shadow: 0 0 0 2px ${APP.surface};
  }

  > span + span {
    margin-left: -5px;
  }

  ${Side} & > span {
    box-shadow: 0 0 0 2px ${APP.chrome};
  }
`;

const Main = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;
`;

const ViewPane = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  opacity: 0;
  visibility: hidden;
  transition:
    opacity 0.3s ease,
    visibility 0s linear 0.3s;

  &[data-on] {
    opacity: 1;
    visibility: visible;
    transition:
      opacity 0.35s ease 0.1s,
      visibility 0s;
  }
`;

const ViewHead = styled.div`
  flex: none;
  display: flex;
  align-items: center;
  gap: 7px;
  height: 44px;
  padding: 0 20px;
  font-size: 13.5px;
  color: ${APP.strong};
  box-shadow: inset 0 -1px 0 ${APP.line};

  > svg {
    color: ${APP.icon};
  }

  [data-cs-compact] & {
    height: 48px;
    padding: 0 12px;
    font-size: 14px;
  }
`;

const Thread = styled.div`
  display: grid;
  align-content: start;
  gap: 12px;
  padding: 10px 20px;

  [data-cs-compact] & {
    padding: 12px;
  }
`;

const Msg = styled.div`
  display: grid;
  grid-template-columns: 26px minmax(0, 1fr);
  column-gap: 10px;
  align-items: start;

  > span:first-child {
    grid-row: span 3;
    margin-top: 1px;
  }

  &[data-appear] {
    ${appear}
  }
`;

const MsgHead = styled.div`
  display: flex;
  align-items: baseline;
  gap: 6px;
  min-height: 17px;

  strong {
    font-weight: 400;
    color: ${APP.strong};
  }

  time {
    font-size: 11px;
    color: ${APP.faint};
  }
`;

const BotTag = styled.span`
  padding: 1px 5px;
  border-radius: 4px;
  background: ${APP.ink2};
  font-size: 10px;
  color: ${APP.text};
`;

const MsgText = styled.div`
  color: ${APP.body};
`;

const MsgSlot = styled.div`
  width: 162px;
  height: var(--card-h, 88px);
  margin-top: 6px;

  [data-cs-compact] & {
    width: 100%;
    --card-h: 78px;
  }
`;

const Composer = styled.div`
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 14px;
  display: flex;
  align-items: center;
  height: 34px;
  padding: 0 12px;
  border-radius: 8px;
  background: ${APP.ink1};
  box-shadow: inset 0 0 0 1px ${APP.line};
  color: ${APP.faint};

  [data-cs-compact] & {
    left: 12px;
    right: 12px;
    bottom: 68px;
  }
`;

const Board = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 162px);
  gap: 13px;
  align-items: start;
  padding: 16px 20px;

  [data-cs-compact] & {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
    padding: 12px;
  }
`;

const Column = styled.div`
  display: grid;
  gap: 10px;

  [data-cs-compact] & {
    gap: 8px;

    > :nth-child(n + 4) {
      display: none;
    }
  }
`;

const ColHead = styled.div`
  display: flex;
  align-items: center;
  gap: 7px;
  height: 22px;
  font-size: 12px;
  color: ${APP.strong};
`;

const Dot = styled.span`
  flex: none;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  transition: background-color 0.2s ease var(--cs-roll, 0s);
`;

/* Ranura de columna: se abre mientras la tarjeta viaja hacia ella. */
const BoardSlot = styled.div`
  --card-h: 88px;
  position: relative;
  height: 0;
  margin-bottom: -10px;
  transition:
    height 0.5s ${EASE_TRAVEL},
    margin-bottom 0.5s ${EASE_TRAVEL};

  &[data-open] {
    height: var(--card-h);
    margin-bottom: 0;
  }

  /* En compact las ranuras se apilan: sin transición, así la medición de la tarjeta coincide con el layout final. */
  [data-cs-compact] & {
    --card-h: 78px;
    margin-bottom: -8px;
    transition: none;
  }

  [data-cs-compact] &[data-open] {
    margin-bottom: 0;
  }
`;

const FillerCard = styled.div`
  display: grid;
  align-content: start;
  gap: 7px;
  height: 64px;
  padding: 11px 10px;
  border-radius: 8px;
  background: ${APP.raised};
  box-shadow: ${SHADOW_REST};

  [data-cs-compact] & {
    height: 52px;
  }
`;

const Bar = styled.span`
  display: block;
  height: 6px;
  border-radius: 3px;
  background: ${APP.ink3};
`;

const Popover = styled.div`
  position: absolute;
  z-index: 3;
  top: calc(100% + 10px);
  left: 50%;
  display: grid;
  gap: 9px;
  width: 300px;
  margin-left: -150px;
  padding: 12px;
  border-radius: 10px;
  background: #26262a;
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.1),
    0 14px 32px -8px rgba(0, 0, 0, 0.7),
    0 4px 10px -4px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  ${appear}

  [data-cs-compact] & {
    left: 0;
    width: 100%;
    margin-left: 0;
  }
`;

const PopHead = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  strong {
    font-weight: 400;
    color: ${APP.strong};
  }

  time {
    margin-left: auto;
    font-size: 11px;
    color: ${APP.faint};
  }
`;

const PopText = styled.div`
  color: ${APP.body};
`;

const Diff = styled.div`
  overflow: hidden;
  border-radius: 7px;
  background: ${APP.rec};
  box-shadow: inset 0 0 0 1px ${APP.line};
  padding-bottom: 5px;
`;

const DiffHead = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 28px;
  padding: 0 10px;
  font-size: 11.5px;
  color: ${APP.strong};

  svg {
    color: ${INK.orange};
  }

  span {
    color: ${APP.faint};
  }
`;

const DiffLine = styled.div`
  padding: 1px 10px;
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 11px;
  line-height: 17px;

  &[data-kind='del'] {
    background: rgba(230, 59, 63, 0.14);
    color: #f08a8c;
  }

  &[data-kind='add'] {
    background: rgba(200, 223, 42, 0.1);
    color: ${INK.lime};
  }
`;

const Traced = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  color: ${APP.text};
`;

const Alert = styled.div`
  display: grid;
  gap: 3px;
  margin-top: 5px;
  padding: 8px 10px;
  border-radius: 7px;
  background: rgba(230, 59, 63, 0.1);
  box-shadow: inset 2px 0 0 ${INK.red};
  font-size: 11.5px;
  color: ${APP.text};
`;

const AlertTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: ${APP.strong};

  svg {
    color: ${INK.red};
  }
`;

const TabBar = styled.div`
  display: none;

  [data-cs-compact] & {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    height: 56px;
    padding: 0 8px 4px;
    background: ${APP.chrome};
    box-shadow: inset 0 1px 0 ${APP.line};
  }

  span {
    display: grid;
    justify-items: center;
    align-content: center;
    gap: 3px;
    font-size: 10.5px;
    color: ${APP.faint};
    transition: color 0.25s ease;
  }

  svg {
    width: 18px;
    height: 18px;
  }

  [data-active] {
    color: ${APP.strong};
  }
`;

/* La tarjeta que viaja: siempre montada, la posiciona GSAP. */
const Card = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  display: grid;
  grid-template-rows: auto 1fr auto;
  gap: 5px;
  width: 162px;
  height: 88px;
  padding: 9px 10px;
  border: 0;
  border-radius: 8px;
  background: ${APP.raised};
  box-shadow: ${SHADOW_REST};
  color: ${APP.text};
  text-align: left;
  opacity: 0;
  will-change: transform;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover:not(:disabled) {
    background: #2a2a2f;
  }

  &:disabled {
    cursor: default;
  }

  [data-cs-compact] & {
    height: 78px;
  }
`;

const CardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const CardId = styled.span`
  font-family: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  font-size: 10.5px;
  color: ${APP.text};
`;

const CardTitle = styled.span`
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 12.5px;
  line-height: 1.3;
  color: ${APP.strong};
`;

const CardFoot = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
`;

const Tag = styled.span`
  margin-left: auto;
  padding: 1px 6px;
  border-radius: 4px;
  background: rgba(238, 122, 43, 0.16);
  color: ${INK.orange};
  font-size: 10px;
`;

const RollBox = styled.span`
  display: inline-grid;
  overflow: hidden;
  padding-block: 1px;
  vertical-align: top;

  > span {
    grid-area: 1 / 1;
    white-space: nowrap;
    transition:
      transform 0.5s ${EASE_TRAVEL} var(--cs-roll, 0s),
      opacity 0.3s ease var(--cs-roll, 0s);
  }

  > [data-pos='up'] {
    transform: translateY(-100%);
    opacity: 0;
  }

  > [data-pos='down'] {
    transform: translateY(100%);
    opacity: 0;
  }
`;

const AvatarSwap = styled.span`
  display: grid;

  > span {
    grid-area: 1 / 1;
    display: grid;
    opacity: 0;
    transform: scale(0.6);
    transition:
      opacity 0.25s ease,
      transform 0.4s ${EASE_IN};
  }

  > span[data-on] {
    opacity: 1;
    transform: none;
    transition-delay: var(--d, 0s);
  }
`;

/* Grabador: ventana aparte, delante del chat mientras dura la reunión. */
const Recorder = styled.div`
  position: absolute;
  z-index: 10;
  top: 234px;
  left: 340px;
  width: 360px;
  overflow: hidden;
  border-radius: 12px;
  background: ${MEET.ground};
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.1),
    0 24px 48px -12px rgba(0, 0, 0, 0.75),
    0 6px 14px -6px rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transform: translateY(28px) scale(0.95);
  transition:
    opacity 0.35s ease,
    transform 0.5s ${EASE_TRAVEL},
    visibility 0s linear 0.5s;

  &[data-on] {
    opacity: 1;
    visibility: visible;
    transform: none;
    transition:
      opacity 0.35s ease,
      transform 0.6s ${EASE_IN},
      visibility 0s;
  }

  [data-cs-compact] & {
    top: 246px;
    left: 12px;
    width: 334px;
  }

  /* FLIP entre la llamada a pantalla completa y la esquina. */
  translate: var(--fx, 0px) var(--fy, 0px);
  scale: var(--fs, 1);
  transform-origin: 0 0;

  /* Paso 1: la llamada es la protagonista, con el panel de notas al costado. */
  &[data-full] {
    top: 0;
    left: 0;
    width: 720px;
    height: 460px;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 220px;
    grid-template-rows: 40px minmax(0, 1fr) auto 54px;
    grid-template-areas: 'top top' 'tiles notes' 'cc notes' 'ctl notes';
    border-radius: 14px;
  }

  [data-cs-compact] &[data-full] {
    top: 0;
    left: 0;
    width: 358px;
    height: 600px;
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: 40px auto auto minmax(0, 1fr) 54px;
    grid-template-areas: 'top' 'tiles' 'cc' 'notes' 'ctl';
    border-radius: 28px;
  }
`;

/* Barra superior de la llamada: título a la izquierda, el badge de la extensión a la derecha. */
const MeetTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  grid-area: top;
  height: 30px;
  padding: 0 8px 0 12px;
  font-size: 11.5px;
  color: ${APP.body};

  [data-full] > & {
    height: auto;
    padding: 0 12px 0 16px;
    font-size: 13px;
  }
`;

const RecBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 22px;
  padding: 0 3px 0 8px;
  border-radius: 999px;
  background: rgba(234, 67, 53, 0.16);
  font-size: 10.5px;
  color: #f6aea9;

  strong {
    font-weight: 500;
    letter-spacing: 0.04em;
  }

  time {
    font-variant-numeric: tabular-nums;
    color: ${APP.body};
  }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.35; }
`;

const RecDot = styled.span`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: ${MEET.red};

  &[data-live] {
    animation: ${pulse} 1.4s ease-in-out infinite;
  }
`;

const PlayButton = styled.button`
  position: relative;
  flex: none;
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: ${INK.cream};
  color: ${INK.ground};
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    transform 0.15s ease;

  /* Área táctil más grande que el círculo visible. */
  &::before {
    content: '';
    position: absolute;
    inset: -12px;
  }

  &:hover:not(:disabled) {
    background: #fff;
  }

  &:active:not(:disabled) {
    transform: scale(0.92);
  }

  /* Área táctil más grande que el círculo visible. */
  &::after {
    content: '';
    position: absolute;
    inset: -6px;
  }

  svg {
    width: 9px;
    height: 9px;
  }
`;

const Tiles = styled.div`
  grid-area: tiles;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 6px;
  padding: 0 8px;

  /* Tres participantes como en Meet: dos arriba y uno centrado abajo. */
  [data-full] > & {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-content: center;
    gap: 8px;
    padding: 4px 12px 0 16px;
  }
  [data-full] > & > :last-child {
    grid-column: 1 / -1;
    justify-self: center;
    width: calc(50% - 4px);
  }
  [data-cs-compact] [data-full] > & {
    padding: 4px 12px 0;
  }
`;

/* Mosaico de participante: el que habla lleva el borde y las barras de voz, como en Meet. */
const Tile = styled.div`
  position: relative;
  display: grid;
  place-items: center;
  height: 66px;
  border-radius: 8px;
  background: ${MEET.tile};

  [data-full] & {
    height: auto;
    aspect-ratio: 16 / 9;
    border-radius: 10px;
  }
  [data-full] & > :first-child {
    scale: 1.8;
  }
  box-shadow: inset 0 0 0 2px transparent;
  transition: box-shadow 0.25s ease;

  &[data-on] {
    box-shadow: inset 0 0 0 2px ${MEET.blue};
  }
`;

const TileName = styled.span`
  position: absolute;
  left: 7px;
  bottom: 5px;
  font-size: 10px;
  color: ${APP.strong};
`;

const talk = keyframes`
  0%, 100% { transform: scaleY(0.35); }
  50% { transform: scaleY(1); }
`;

const Talk = styled.span`
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  align-items: center;
  gap: 2px;
  width: 18px;
  height: 18px;
  justify-content: center;
  border-radius: 50%;
  background: ${MEET.blue};
  opacity: 0;
  transition: opacity 0.2s ease;

  i {
    width: 2px;
    height: 8px;
    border-radius: 1px;
    background: ${MEET.ground};
    transform: scaleY(0.35);
  }

  [data-on] > & {
    opacity: 1;
  }

  [data-on] > & i {
    animation: ${talk} 0.7s ease-in-out infinite;
  }

  [data-on] > & i:nth-child(2) {
    animation-delay: -0.25s;
  }

  [data-on] > & i:nth-child(3) {
    animation-delay: -0.45s;
  }
`;

const MeetControls = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  grid-area: ctl;
  height: 38px;
  padding: 0 10px;

  [data-full] > & {
    height: auto;
    padding: 0 16px;
  }

  time {
    font-size: 11px;
    color: ${APP.body};
    font-variant-numeric: tabular-nums;
  }

  > span {
    display: flex;
    gap: 6px;
  }
`;

const MeetBtn = styled.span`
  display: grid;
  place-items: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: ${MEET.tile};
  color: ${APP.strong};

  &[data-on] {
    background: ${MEET.blue};
    color: ${MEET.ground};
  }

  svg {
    width: 12px;
    height: 12px;
  }

  [data-full] & {
    width: 32px;
    height: 32px;
  }
`;

const HangUp = styled(MeetBtn)`
  width: 38px;

  [data-full] & {
    width: 46px;
  }

  border-radius: 999px;
  background: ${MEET.red};
  color: #fff;
`;

/* Subtítulos de la llamada: lo que el grabador transcribe, con quién lo dijo. */
const Transcript = styled.div`
  grid-area: cc;
  display: grid;
  gap: 4px;
  min-height: 60px;
  margin: 8px 8px 0;
  padding: 7px 9px;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.45);

  [data-full] > & {
    margin: 10px 12px 0 16px;
    padding: 9px 11px;
  }
`;

/* Panel de notas del grabador: solo con la llamada a pantalla completa. */
const Notes = styled.div`
  grid-area: notes;
  display: none;
  flex-direction: column;
  gap: 10px;
  margin: 4px 12px 12px 0;
  padding: 12px;
  border-radius: 10px;
  background: #2a2b2e;
  color: ${APP.body};

  [data-full] > & {
    display: flex;
  }
  [data-cs-compact] [data-full] > & {
    margin: 10px 12px 0;
  }

  ol {
    display: grid;
    gap: 9px;
    margin: 0;
    padding: 0;
    list-style: none;
  }
`;

const NotesHead = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 9px;
  border-bottom: 1px solid ${APP.line};
  font-size: 12px;
  font-weight: 500;
  color: ${APP.strong};
`;

/* Cada nota se escribe de izquierda a derecha cuando el grabador la escucha. */
const Note = styled.li`
  position: relative;
  padding-left: 12px;
  font-size: 11.5px;
  line-height: 1.4;
  clip-path: inset(0 100% 0 0);
  transition: clip-path 0.9s steps(26, end);

  &::before {
    content: '';
    position: absolute;
    top: 6px;
    left: 0;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${APP.faint};
  }

  &[data-on] {
    clip-path: inset(0 0 0 0);
  }

  &[data-task] {
    color: ${APP.strong};
  }
  &[data-task]::before {
    background: ${INK.lime};
  }

  b {
    display: block;
    margin-bottom: 2px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: ${INK.lime};
  }
`;

const NotesFoot = styled.span`
  margin-top: auto;
  font-size: 10.5px;
  color: #9a9aa0;
  opacity: 0;
  transition: opacity 0.3s ease;

  &[data-on] {
    opacity: 1;
    animation: ${pulse} 1.4s ease-in-out infinite;
  }
`;

const TLine = styled.div`
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: 8px;
  font-size: 12px;
  color: ${APP.body};
  ${appear}

  > span:first-child {
    font-size: 11px;
    line-height: 16px;
  }
`;

/* El resaltado barre el fragmento de izquierda a derecha antes de que vuele. */
const Frag = styled.span`
  position: relative;
  z-index: 0;
  transition: color 0.3s ease 0.15s;

  &::before {
    content: '';
    position: absolute;
    z-index: -1;
    inset: -1px -3px;
    border-radius: 3px;
    background: rgba(200, 223, 42, 0.26);
    transform: scaleX(0);
    transform-origin: 0 50%;
    transition: transform 0.5s ${EASE_TRAVEL} 0.1s;
  }

  &[data-on] {
    color: ${INK.lime};
  }

  &[data-on]::before {
    transform: none;
  }
`;

const FlyChip = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 20;
  padding: 3px 8px;
  border-radius: 6px;
  background: ${INK.lime};
  color: ${INK.ground};
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  box-shadow: 0 10px 24px -8px rgba(0, 0, 0, 0.6);
`;
