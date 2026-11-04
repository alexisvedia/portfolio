import React, { useLayoutEffect, useRef } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type * as Three from 'three';
import { INK } from './content';
import { GLYPHS, STROKE } from './glyphs';
import { cut, SHADOW } from './cut';

gsap.registerPlugin(ScrollTrigger);

const MOTION = '(prefers-reduced-motion: no-preference)';
const DESKTOP = '(min-width: 1024px)';

/* Radio del agujero de la O como fracción de su ancho: trazo de 20 sobre r=40 en una celda de 100. */
const HOLE = (40 - STROKE / 2) / 100;
/* Profundidad de cada capa con la O en z=1: el fondo (z>1) se mueve más lento y el primer plano (z<1) más rápido. */
const Z_FAR = 2.4;
const Z_MID = 1.3;
const Z_NEAR = 0.5;
/* Tramos del recorrido fijo (0 a 1): el iris llena el agujero y la cámara entra hasta que el color tapa todo. */
const IRIS_END = 0.24;
const ZOOM_START = 0.06;
const COVER = 0.88;
/* Desde acá el escenario se apaga y deja ver la sección siguiente, que ya está en su lugar debajo. */
const REVEAL = 0.9;
/* Iris de papel recortado (docs/estilo-recorte.md): un corte a mano de radio 1 que se escala en px alrededor del centro.
   IRIS_IN es su inradio medido (0,658 para la semilla 7, ninguna de 1 a 20 baja de 0,65): al dividir por él el corte
   tapa todo el agujero, y su vértice más lejano (1,56) queda bajo el trazo, que llega a 1,67 veces el agujero. */
const IRIS_CUT = cut(0, 0, 1, 7);
const IRIS_IN = 0.65;
/* Poses del iris: crece a saltos, como stop motion, y gira un poco en cada pose. */
const IRIS_POSES = 7;
const IRIS_TURN = 0.07;
/* La astilla negra se corre abajo a la derecha en proporción al radio (mínimo 3 px para que se lea de chica): entra bajo el trazo con el iris abierto. */
const IRIS_SHADOW = 0.05;

const clamp01 = gsap.utils.clamp(0, 1);

interface Mark {
  char: string;
  color: string;
  /** Centro en % del escenario. */
  x: number;
  y: number;
  /** Ancho en vmin. */
  size: number;
  rotate: number;
}

const FAR: Mark[] = [
  { char: 'A', color: INK.teal, x: 14, y: 20, size: 9, rotate: -10 },
  { char: 'V', color: INK.blue, x: 83, y: 15, size: 7, rotate: 8 },
  { char: 'S', color: INK.violet, x: 9, y: 74, size: 8, rotate: 6 },
  { char: 'N', color: INK.lime, x: 88, y: 66, size: 6, rotate: -6 },
  { char: 'I', color: INK.cream, x: 33, y: 90, size: 5, rotate: 90 },
  { char: 'T', color: INK.teal, x: 64, y: 7, size: 5, rotate: 0 },
  { char: 'O', color: INK.blue, x: 70, y: 88, size: 4, rotate: 0 },
  { char: 'L', color: INK.lime, x: 36, y: 8, size: 4, rotate: 180 },
];

const MID: Mark[] = [
  { char: 'H', color: INK.cream, x: 22, y: 30, size: 14, rotate: -8 },
  { char: 'F', color: INK.blue, x: 78, y: 34, size: 12, rotate: 12 },
  { char: 'R', color: INK.lime, x: 24, y: 70, size: 16, rotate: 8 },
  { char: 'A', color: INK.cream, x: 77, y: 74, size: 13, rotate: -16 },
  { char: 'U', color: INK.violet, x: 50, y: 6, size: 12, rotate: 180 },
  { char: 'S', color: INK.teal, x: 50, y: 95, size: 12, rotate: 0 },
];

const NEAR: Mark[] = [
  { char: 'C', color: INK.cream, x: 3, y: 38, size: 30, rotate: -14 },
  { char: 'U', color: INK.teal, x: 95, y: 82, size: 26, rotate: 18 },
  { char: 'E', color: INK.lime, x: 90, y: 4, size: 18, rotate: -24 },
  { char: 'D', color: INK.violet, x: 14, y: 97, size: 20, rotate: 10 },
];

/** Un glifo suelto del alfabeto construido, dibujado igual que en ConstructedWord pero sin sus data-* (PosterHome los anima). */
const Glyph: React.FC<{ mark: Mark }> = ({ mark: m }) => {
  const g = GLYPHS[m.char];
  return (
    <svg
      viewBox="-10 -10 120 120"
      style={{ left: `${m.x}%`, top: `${m.y}%`, width: `${m.size}vmin`, transform: `translate(-50%, -50%) rotate(${m.rotate}deg)` }}
    >
      {g.strokes.map(d => (
        <path key={d} d={d} fill="none" stroke={m.color} strokeWidth={STROKE} strokeLinecap="round" strokeLinejoin="round" />
      ))}
      {g.rings?.map(r => (
        <g key={`${r.cx}-${r.cy}`}>
          <circle cx={r.cx} cy={r.cy} r={r.r} fill={m.color} />
          <circle cx={r.cx} cy={r.cy} r={r.r * 0.36} fill={INK.ground} />
        </g>
      ))}
    </svg>
  );
};

interface Depth {
  resize: (w: number, h: number) => void;
  render: (q: number) => void;
  dispose: () => void;
}

/**
 * Túnel de anillos y polvo que la cámara atraviesa detrás de la O. Sin luces: colores planos y niebla hacia el fondo.
 * Devuelve null si el navegador no da contexto WebGL; la transición CSS sigue igual.
 */
function mountDepth(THREE: typeof Three, host: HTMLElement, to: string): Depth | null {
  const desktop = window.matchMedia(DESKTOP).matches;
  let renderer: Three.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: desktop, alpha: true });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, desktop ? 2 : 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(INK.ground, 4, 30);
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 60);

  // Anillos finos y gruesos alternados, como el contraste de trazos del afiche.
  const [radial, tubular] = desktop ? [8, 120] : [6, 72];
  const geometries = [new THREE.TorusGeometry(3.4, 0.035, radial, tubular), new THREE.TorusGeometry(3.4, 0.11, radial, tubular)];
  const palette = [INK.red, INK.teal, INK.cream, INK.blue, INK.lime, INK.violet, to];
  const materials = palette.map(color => new THREE.MeshBasicMaterial({ color }));
  for (let i = 0; i < 12; i++) {
    const ring = new THREE.Mesh(geometries[i % 2], materials[i % palette.length]);
    ring.position.set(Math.sin(i * 0.9) * 0.5, Math.cos(i * 0.7) * 0.35, -i * 4);
    ring.rotation.set(Math.sin(i) * 0.25, Math.cos(i * 1.3) * 0.25, i);
    scene.add(ring);
  }

  // Polvo en un cilindro alrededor del eje: puntos redondos, más cerca pasan más grandes.
  const count = desktop ? 520 : 260;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 1.5 + Math.random() * 8;
    positions.set([Math.cos(a) * r, Math.sin(a) * r, 8 - Math.random() * 58], i * 3);
  }
  const dust = new THREE.BufferGeometry();
  dust.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const sprite = document.createElement('canvas');
  sprite.width = sprite.height = 32;
  const ctx = sprite.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#fff';
    ctx.arc(16, 16, 15, 0, Math.PI * 2);
    ctx.fill();
  }
  const dot = new THREE.CanvasTexture(sprite);
  const dustMaterial = new THREE.PointsMaterial({ color: INK.cream, size: 0.07, map: dot, transparent: true, depthWrite: false });
  scene.add(new THREE.Points(dust, dustMaterial));

  return {
    resize: (w, h) => {
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    },
    render: q => {
      camera.position.z = 7 - q * 30;
      camera.rotation.z = q * 0.9;
      renderer.render(scene, camera);
    },
    dispose: () => {
      geometries.forEach(g => g.dispose());
      materials.forEach(m => m.dispose());
      dust.dispose();
      dustMaterial.dispose();
      dot.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}

/**
 * Transición hacia la sección siguiente: una O enorme del alfabeto construido, con glifos en varias profundidades.
 * Con el scroll la cámara entra por el agujero de la O y del otro lado está el color `to`, que termina tapando la pantalla.
 * El escenario queda fijo con sticky; todo se calcula en onUpdate de ScrollTrigger, sin loop de animación.
 * Three.js suma un túnel de anillos detrás, se carga con import() al acercarse y solo lo apaga reduced motion.
 * Con reduced motion queda una franja estática: la O y un corte de color plano hacia `to`.
 */
const Portal: React.FC<{ to: string }> = ({ to }) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const track = ref.current;
    if (!track) return;
    const part = <T extends Element = HTMLElement>(name: string) => track.querySelector(`[data-part="${name}"]`) as T;
    const mm = gsap.matchMedia();

    mm.add(MOTION, () => {
      const desktop = window.matchMedia(DESKTOP);
      const stage = part('stage');
      const depthHost = part('depth');
      const far = part('far');
      const mid = part('mid');
      const near = part('near');
      const core = part('core');
      const rim = part('rim');
      const iris = part('iris');
      const sliver = part('sliver');
      const stroke = part<SVGPathElement>('stroke');
      const disc = part<SVGGElement>('disc');
      const zoomEase = gsap.parseEase('sine.inOut');
      const irisEase = gsap.parseEase('power2.inOut');
      const popEase = gsap.parseEase('back.out(2)');

      let e = 0; // entrada: el escenario sube hasta quedar fijo
      let d = 0; // recorrido fijo: la cámara entra en la O
      let vh = 0;
      let hole = 1;
      let sMax = 1;
      let hinted = false;
      let cancelled = false;
      let depth: Depth | null = null;

      const measure = () => {
        const { clientWidth: w, clientHeight: h } = stage;
        vh = window.innerHeight;
        hole = Math.max(HOLE * rim.clientWidth, 1);
        // Escala a la que el borde interno del anillo pasa las esquinas: depende del formato de pantalla.
        sMax = (Math.hypot(w, h) / 2 / hole) * 1.15;
        depth?.resize(w, h);
      };

      const apply = () => {
        const rem = (1 - e) * vh;
        // Escala exponencial: a velocidad de cámara constante el zoom se percibe parejo.
        const s = sMax ** zoomEase(clamp01((d - ZOOM_START) / (COVER - ZOOM_START)));
        const cam = 1 - 1 / s;
        const layer = (el: HTMLElement, z: number) => {
          el.style.transform = `translate(0, ${rem * (1 / z - 1)}px) scale(${z / Math.max(z - cam, 0.05)})`;
        };
        layer(far, Z_FAR);
        layer(mid, Z_MID);
        layer(near, Z_NEAR);
        far.style.opacity = String(e);
        near.style.opacity = String(clamp01((Z_NEAR - cam) / 0.2));

        core.style.transform = rim.style.transform = `scale(${s})`;
        const covered = d >= COVER;
        // El progreso se cuantiza antes de suavizar: cada pose dura el mismo tramo de scroll. El tamaño entre poses
        // igual acompaña el zoom de la O (s), que es continuo, para que el corte no se despegue del anillo.
        const pose = Math.floor(clamp01(d / IRIS_END) * IRIS_POSES);
        const r = hole * s * irisEase(pose / IRIS_POSES);
        // +2 px: el iris queda apenas debajo del trazo y no se ve la costura.
        const k = r ? (r + 2) / IRIS_IN : 0;
        const turn = pose * IRIS_TURN;
        const [cos, sin] = [Math.cos(turn), Math.sin(turn)];
        const shape = (off: number) =>
          `polygon(${IRIS_CUT.map(
            ([x, y]) => `calc(50% + ${((x * cos - y * sin) * k + off).toFixed(1)}px) calc(50% + ${((x * sin + y * cos) * k + off).toFixed(1)}px)`
          ).join(', ')})`;
        iris.style.clipPath = covered ? 'none' : shape(0);
        sliver.style.visibility = covered || !r ? 'hidden' : '';
        if (r && !covered) sliver.style.clipPath = shape(Math.max(3, r * IRIS_SHADOW));

        // Mientras sube, el borde de arriba del escenario se funde con la sección anterior: sin línea de corte.
        stage.style.setProperty('--fade', `${(1 - e) * 40}vh`);

        const drawn = clamp01((e - 0.1) / 0.6) * 100;
        stroke.style.strokeDasharray = `${drawn} 200`;
        stroke.style.opacity = drawn ? '1' : '0';
        disc.style.transform = `scale(${popEase(clamp01((e - 0.55) / 0.4))})`;

        // La sección siguiente sube debajo del escenario (margen negativo del Track): al final el escenario se apaga
        // y el contenido aparece en su lugar, sin un viewport de color vacío antes.
        // En mobile la sección no queda debajo (Track sin margen negativo): sube con el scroll y su palabra se dibuja mientras sube.
        const reveal = desktop.matches ? clamp01((d - REVEAL) / (1 - REVEAL)) : 0;
        stage.style.opacity = String(1 - reveal);
        // El Track va encima de la sección siguiente. Mientras el escenario se apaga, el color tapa solo lo que está
        // arriba de esa sección (sin franja oscura bajo la nav); antes, su fondo tapa la franja que queda debajo del
        // escenario de 100svh cuando la barra de mobile se esconde.
        track.style.background = reveal ? `linear-gradient(${to}, ${to}) top / 100% calc(100% - 100svh) no-repeat` : covered ? to : INK.ground;

        const active = e > 0 && d < 1;
        if (active !== hinted) {
          hinted = active;
          far.style.willChange = mid.style.willChange = near.style.willChange = active ? 'transform' : '';
        }
        depth?.render(e * 0.12 + d * 0.88);
      };

      measure();
      const enter = ScrollTrigger.create({
        trigger: track,
        start: 'top bottom',
        end: 'top top',
        onUpdate: self => {
          e = self.progress;
          apply();
        },
      });
      const dive = ScrollTrigger.create({
        trigger: track,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: self => {
          d = self.progress;
          apply();
        },
      });
      // Si la página carga a mitad del recorrido, arranca en el estado correcto.
      e = enter.progress;
      d = dive.progress;
      apply();

      // El escenario cambia de tamaño sin resize de window (barra de mobile, sidebar que se anima).
      const ro = new ResizeObserver(() => {
        measure();
        apply();
      });
      ro.observe(stage);

      // Three se pide una pantalla antes de llegar. Con reduced motion este bloque nunca corre.
      const io = new IntersectionObserver(
        entries => {
          if (!entries.some(en => en.isIntersecting)) return;
          io.disconnect();
          import('three')
            .then(THREE => {
              if (cancelled) return;
              depth = mountDepth(THREE, depthHost, to);
              measure();
              apply();
            })
            .catch(() => {
              // Sin three queda la transición CSS, que se sostiene sola.
            });
        },
        { rootMargin: '100% 0px' }
      );
      io.observe(track);

      // mm.revert() mata los triggers, pero no deshace lo escrito a mano en onUpdate.
      return () => {
        cancelled = true;
        io.disconnect();
        ro.disconnect();
        depth?.dispose();
        [track, stage, far, mid, near, core, rim, sliver, iris, stroke, disc].forEach(el => el.removeAttribute('style'));
      };
    });

    return () => mm.revert();
  }, [to]);

  return (
    <Track ref={ref} aria-hidden="true">
      <Stage data-part="stage">
        <Layer data-part="depth" />
        <Layer data-part="far" $far>
          {FAR.map(m => (
            <Glyph key={m.char} mark={m} />
          ))}
        </Layer>
        <Layer data-part="mid">
          {MID.map(m => (
            <Glyph key={m.char} mark={m} />
          ))}
        </Layer>
        <OBox data-part="core">
          <svg viewBox="0 0 100 100" focusable="false">
            <g data-part="disc">
              <circle cx={50} cy={50} r={15} fill={INK.cream} />
              <circle cx={50} cy={50} r={5.4} fill={to} />
            </g>
          </svg>
        </OBox>
        <Sliver data-part="sliver" />
        <Iris data-part="iris" $to={to} />
        <OBox data-part="rim">
          <svg viewBox="0 0 100 100" focusable="false">
            <path
              data-part="stroke"
              d={GLYPHS.O.strokes[0]}
              pathLength={100}
              fill="none"
              stroke={INK.red}
              strokeWidth={STROKE}
              strokeLinecap="round"
            />
          </svg>
        </OBox>
        <Layer data-part="near" $near>
          {NEAR.map(m => (
            <Glyph key={m.char} mark={m} />
          ))}
        </Layer>
      </Stage>
    </Track>
  );
};

const Track = styled.div`
  position: relative;
  height: 180vh;
  height: 180svh;
  pointer-events: none;

  @media ${MOTION} {
    /* El último viewport se comparte con la sección siguiente, que queda debajo del escenario fijo. */
    z-index: 1;
  }

  @media ${DESKTOP} {
    height: 220vh;
  }

  /* Solo desktop: Alexis (2026-11-03) pidió que en mobile Oficio suba acompañando el scroll y no aparezca de golpe. */
  @media ${MOTION} and ${DESKTOP} {
    margin-bottom: -100vh;
    margin-bottom: -100svh;
  }

  @media (prefers-reduced-motion: reduce) {
    height: auto;
  }
`;

const Stage = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  height: 100svh;
  overflow: hidden;
  isolation: isolate;
  background: ${INK.ground};
  mask-image: linear-gradient(transparent, #000 var(--fade, 0px));

  @media (prefers-reduced-motion: reduce) {
    position: relative;
    height: clamp(24rem, 75vh, 42rem);
    height: clamp(24rem, 75svh, 42rem);
  }
`;

const Layer = styled.div<{ $far?: boolean; $near?: boolean }>`
  position: absolute;
  inset: 0;

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }

  svg {
    position: absolute;
    overflow: visible;
    opacity: ${({ $far, $near }) => ($far ? 0.5 : $near ? 0.9 : 0.8)};
  }

  ${({ $near }) =>
    $near &&
    `
    filter: blur(6px);

    @media (max-width: 1023px) {
      filter: blur(4px);
    }
  `}
`;

const OBox = styled.div`
  position: absolute;
  inset: 0;
  margin: auto;
  width: min(70vmin, 42rem);
  height: min(70vmin, 42rem);

  svg {
    display: block;
    width: 100%;
    height: 100%;
    overflow: visible;
  }

  [data-part='disc'] {
    transform-box: fill-box;
    transform-origin: center;
  }

  @media (prefers-reduced-motion: reduce) {
    width: min(52vmin, 26rem);
    height: min(52vmin, 26rem);
  }
`;

/* La sombra del iris: el mismo corte en negro, detrás y corrido abajo a la derecha. Sin JS o con reduced motion no existe. */
const Sliver = styled.div`
  position: absolute;
  inset: 0;
  background: ${SHADOW};
  clip-path: circle(0px at 50% 50%);

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

/* El otro lado: arranca cerrado en el centro del agujero y se abre como un corte a mano. Con reduced motion es un corte plano abajo. */
const Iris = styled.div<{ $to: string }>`
  position: absolute;
  inset: 0;
  background: ${({ $to }) => $to};
  clip-path: circle(0px at 50% 50%);

  @media (prefers-reduced-motion: reduce) {
    clip-path: inset(70% 0 0 0);
  }
`;

export default Portal;
