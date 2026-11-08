import type * as Three from 'three';

/** Página de 3:4. El lomo está en x = 0 y la hoja apoyada a la derecha ocupa de 0 a W. */
export const PAGE_W = 1;
export const PAGE_H = 4 / 3;

/** Capa recortada de una página, como los sprites del atlas de la referencia. Posición y tamaño en fracción de página. */
export interface Layer {
  canvas: HTMLCanvasElement;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Cuánto se corre con el puntero y al pasar la hoja: 0 queda pegada al papel, 1 es la capa de más arriba. */
  depth: number;
}

export interface Face {
  paper: string;
  grid?: boolean;
  layers: Layer[];
}

/** Hoja que se da vuelta: frente a la derecha, dorso a la izquierda cuando ya pasó. */
export interface Leaf {
  front: Face;
  back?: Face;
}

export interface BookState {
  /** Avance de cada hoja, de 0 (apoyada a la derecha) a 1 (pasada a la izquierda). */
  flips: number[];
  /** Punto del libro que queda centrado, en x del libro. */
  focus: number;
  /** Puntero normalizado de -1 a 1. */
  px: number;
  py: number;
}

export interface Book {
  /** `top` y `bottom`: px del canvas que tapan la nav y el botón, fuera del encuadre. */
  resize: (w: number, h: number, single: boolean, top: number, bottom: number) => void;
  render: (s: BookState) => void;
  dispose: () => void;
}

const MAX_LAYERS = 3;

const VERT = /* glsl */ `
uniform float uFlip;
uniform float uCurl;
uniform float uZ;
uniform float uMirror;
uniform float uLift;
varying vec2 vUv;
varying float vS;
varying vec3 vN;
const float PI = 3.141592653589793;

void main() {
  // La hoja gira sobre el lomo y el borde de afuera se queda atrás: el ángulo crece lineal a lo largo de la hoja,
  // así que la posición es la integral cerrada de (cos a, sin a).
  float s = position.x;
  float a0 = uFlip * PI;
  float k = -uCurl * sin(a0);
  float a = a0 + k * s;
  vec3 p = abs(k) < 1e-4
    ? vec3(s * cos(a0), position.y, s * sin(a0))
    : vec3((sin(a) - sin(a0)) / k, position.y, (cos(a0) - cos(a)) / k);
  // Las caras de la tapa dura se separan del cartón hacia afuera, una por lado.
  p += vec3(-sin(a), 0.0, cos(a)) * uLift;
  p.z += uZ;
  vN = normalize(normalMatrix * vec3(-sin(a), 0.0, cos(a)));
  vS = uv.x;
  vUv = vec2(mix(uv.x, 1.0 - uv.x, uMirror), uv.y);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

const FRAG = /* glsl */ `
uniform vec3 uPaper;
uniform float uGrid;
uniform vec3 uLine;
uniform sampler2D uTex[${MAX_LAYERS}];
uniform vec4 uRect[${MAX_LAYERS}];
uniform vec2 uOff[${MAX_LAYERS}];
uniform float uOn[${MAX_LAYERS}];
varying vec2 vUv;
varying float vS;
varying vec3 vN;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float gridLine(vec2 uv, vec2 cells) {
  vec2 g = abs(fract(uv * cells - 0.5) - 0.5) / fwidth(uv * cells);
  return 1.0 - min(min(g.x, g.y), 1.0);
}

vec4 layer(sampler2D t, vec4 r, vec2 o) {
  vec2 q = (vUv - o - r.xy) / r.zw;
  float inside = step(0.0, q.x) * step(q.x, 1.0) * step(0.0, q.y) * step(q.y, 1.0);
  return texture2D(t, clamp(q, 0.0, 1.0)) * inside;
}

void main() {
  // Papel: grano fino y, en las páginas oscuras, la grilla de la plancha de corte (mayor cada 7, menor cada 28).
  vec3 c = uPaper * (0.965 + 0.07 * hash(floor(vUv * vec2(640.0, 853.0))));
  vec2 cells = vec2(7.0, 9.333);
  c = mix(c, uLine, uGrid * (0.11 * gridLine(vUv, cells) + 0.045 * gridLine(vUv, cells * 4.0)));

  ${Array.from(
    { length: MAX_LAYERS },
    (_, i) => `
  if (uOn[${i}] > 0.5) {
    vec4 l${i} = layer(uTex[${i}], uRect[${i}], uOff[${i}]);
    c = mix(c, l${i}.rgb, l${i}.a);
  }`
  ).join('')}

  // Luz de arriba a la izquierda según cómo está doblada la hoja, y la canaleta del lomo.
  vec3 n = normalize(gl_FrontFacing ? vN : -vN);
  float shade = 0.8 + 0.2 * clamp(dot(n, normalize(vec3(-0.35, 0.45, 1.0))), 0.0, 1.0);
  shade *= mix(0.7, 1.0, smoothstep(0.0, 0.09, vS));
  shade *= mix(0.9, 1.0, smoothstep(0.0, 0.015, 1.0 - vS));
  gl_FragColor = vec4(c * shade, 1.0);
}
`;

/** Hex a vec3 sin pasar por la gestión de color: el shader trabaja en sRGB, igual que los canvas. */
const rgb = (THREE: typeof Three, hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  return new THREE.Vector3(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};

/**
 * Libro de casos: hojas que se curvan al pasar y páginas armadas con capas que se corren a distinta velocidad.
 * Devuelve null si el navegador no da contexto WebGL.
 */
export function mountBook(
  THREE: typeof Three,
  host: HTMLElement,
  leaves: Leaf[],
  ground: string
): Book | null {
  const desktop = window.matchMedia('(min-width: 1024px)').matches;
  let renderer: Three.WebGLRenderer;
  try {
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  } catch {
    return null;
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, desktop ? 2 : 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(22, 1, 0.1, 60);
  const tilt = new THREE.Group();
  const book = new THREE.Group();
  tilt.add(book);
  scene.add(tilt);

  const textures: Three.Texture[] = [];
  const materials: Three.Material[] = [];
  const geometry = new THREE.PlaneGeometry(PAGE_W, PAGE_H, 56, 1).translate(PAGE_W / 2, 0, 0);
  const blank = new THREE.DataTexture(new Uint8Array(4), 1, 1);
  blank.needsUpdate = true;

  const toTexture = (canvas: HTMLCanvasElement) => {
    const t = new THREE.CanvasTexture(canvas);
    t.generateMipmaps = false;
    t.minFilter = THREE.LinearFilter;
    t.anisotropy = renderer.capabilities.getMaxAnisotropy();
    textures.push(t);
    return t;
  };

  interface FaceUniforms {
    layers: Layer[];
    off: Three.Vector2[];
  }
  const faces: { u: FaceUniforms; leaf: number; back: boolean }[] = [];

  const faceMaterial = (
    face: Face,
    shared: Record<string, Three.IUniform>,
    back: boolean,
    lift: number
  ) => {
    const layers = face.layers.slice(0, MAX_LAYERS);
    const off = Array.from({ length: MAX_LAYERS }, () => new THREE.Vector2());
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      side: back ? THREE.BackSide : THREE.FrontSide,
      uniforms: {
        ...shared,
        uMirror: { value: back ? 1 : 0 },
        uLift: { value: back ? -lift : lift },
        uPaper: { value: rgb(THREE, face.paper) },
        uGrid: { value: face.grid ? 1 : 0 },
        uLine: { value: rgb(THREE, '#efe6c8') },
        uTex: {
          value: Array.from({ length: MAX_LAYERS }, (_, i) =>
            layers[i] ? toTexture(layers[i].canvas) : blank
          ),
        },
        // Las capas se miden desde arriba (canvas) y el uv de la hoja desde abajo.
        uRect: {
          value: Array.from({ length: MAX_LAYERS }, (_, i) => {
            const l = layers[i];
            return l
              ? new THREE.Vector4(l.x, 1 - l.y - l.h, l.w, l.h)
              : new THREE.Vector4(0, 0, 1, 1);
          }),
        },
        uOff: { value: off },
        uOn: { value: Array.from({ length: MAX_LAYERS }, (_, i) => (layers[i] ? 1 : 0)) },
      },
    });
    materials.push(material);
    return { material, u: { layers, off } };
  };

  // La hoja de arriba de la pila es la 0. A la derecha se apilan al revés de como quedan a la izquierda.
  const EPS = 0.004;
  // La hoja 0 es la tapa: un cartón rígido con grosor, que no se curva y lleva una cara de cada lado.
  const THICK = 0.006;
  const n = leaves.length;
  const leafUniforms = leaves.map((leaf, i) => {
    const shared = {
      uFlip: { value: 0 },
      uCurl: { value: i === 0 ? 0 : 0.85 },
      uZ: { value: (n - i) * EPS },
    };
    const lift = i === 0 ? THICK / 2 + 0.0005 : 0;
    const front = faceMaterial(leaf.front, shared, false, lift);
    book.add(new THREE.Mesh(geometry, front.material));
    faces.push({ u: front.u, leaf: i, back: false });
    if (leaf.back) {
      const back = faceMaterial(leaf.back, shared, true, lift);
      book.add(new THREE.Mesh(geometry, back.material));
      faces.push({ u: back.u, leaf: i, back: true });
    }
    return shared;
  });

  // Tapas duras, un poco más grandes que la hoja: la de atrás queda quieta y la de adelante gira con la hoja 0.
  const M = 0.025;
  const boardGeometry = new THREE.PlaneGeometry(PAGE_W + M, PAGE_H + 2 * M);
  const coverGeometry = new THREE.BoxGeometry(PAGE_W + M, PAGE_H + 2 * M, THICK).translate(
    (PAGE_W + M) / 2,
    0,
    0
  );
  const boardMaterial = new THREE.MeshBasicMaterial({ color: '#1f1c19' });
  materials.push(boardMaterial);
  const rightBoard = new THREE.Mesh(boardGeometry, boardMaterial);
  rightBoard.position.set((PAGE_W + M) / 2, 0, -EPS);
  const coverPivot = new THREE.Group();
  coverPivot.add(new THREE.Mesh(coverGeometry, boardMaterial));
  book.add(rightBoard, coverPivot);

  // Sombra apoyada debajo del libro: un degradé suave, sin luces de verdad.
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = shadowCanvas.height = 128;
  const sctx = shadowCanvas.getContext('2d');
  if (sctx) {
    const g = sctx.createRadialGradient(64, 64, 8, 64, 64, 64);
    g.addColorStop(0, 'rgba(0,0,0,0.55)');
    g.addColorStop(1, 'rgba(0,0,0,0)');
    sctx.fillStyle = g;
    sctx.fillRect(0, 0, 128, 128);
  }
  const shadowMaterial = new THREE.MeshBasicMaterial({
    map: toTexture(shadowCanvas),
    color: ground,
    transparent: true,
    depthWrite: false,
  });
  materials.push(shadowMaterial);
  const shadowGeometry = new THREE.PlaneGeometry(1, 1);
  const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
  shadow.position.z = -0.08;
  book.add(shadow);

  let single = false;
  return {
    resize: (w, h, isSingle, top, bottom) => {
      single = isSingle;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      // Encuadre: el pliego entero en desktop, una sola página en mobile, con aire alrededor y dentro de la franja
      // libre entre la nav y el botón. El canvas ocupa todo el alto para que la hoja que se levanta no se corte.
      const band = Math.max(1, h - top - bottom) / h;
      const needW = single ? PAGE_W * 1.22 : 2 * PAGE_W * 1.1;
      // Arriba sobra lugar para la hoja que se levanta y, por la perspectiva, crece al acercarse.
      const needH = (PAGE_H * 1.22) / band;
      const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const d = Math.max(needH / 2 / t, needW / 2 / t / camera.aspect);
      // El centro de la franja queda corrido del centro del canvas: la cámara se corre igual, sin girar.
      const y = ((top - bottom) / 2 / h) * 2 * d * t;
      camera.position.set(0, y, d);
      camera.lookAt(0, y, 0);
      camera.updateProjectionMatrix();
    },
    render: s => {
      leafUniforms.forEach((u, i) => {
        const f = s.flips[i] ?? 0;
        u.uFlip.value = f;
        u.uZ.value = THREE.MathUtils.lerp((n - i) * EPS, (i + 1) * EPS, f);
      });
      // Cada capa se corre con el puntero según su profundidad, y se desliza mientras su hoja está en el aire.
      faces.forEach(({ u, leaf, back }) => {
        const lift = Math.sin((s.flips[leaf] ?? 0) * Math.PI) * (back ? -1 : 1);
        u.layers.forEach((l, i) =>
          u.off[i].set((s.px * 0.012 - lift * 0.035) * l.depth, -s.py * 0.01 * l.depth)
        );
      });
      const open = s.flips[0] ?? 0;
      // Mismo giro que el shader con curva 0: rotar -a sobre y lleva (s, 0, 0) a (s cos a, 0, s sin a).
      coverPivot.rotation.y = -open * Math.PI;
      coverPivot.position.z = leafUniforms[0]?.uZ.value ?? 0;
      shadow.position.x = THREE.MathUtils.lerp(PAGE_W / 2, 0, open);
      shadow.scale.set(THREE.MathUtils.lerp(PAGE_W, 2 * PAGE_W, open) * 1.25, PAGE_H * 1.2, 1);
      book.position.x = -s.focus;
      // Inclinación leve: con más, la hoja que se levanta hacia la cámara también sube y se mete bajo la nav.
      tilt.rotation.set(-0.1 + s.py * 0.04, s.px * (single ? 0.05 : 0.08), 0);
      renderer.render(scene, camera);
    },
    dispose: () => {
      textures.forEach(t => t.dispose());
      materials.forEach(m => m.dispose());
      blank.dispose();
      geometry.dispose();
      boardGeometry.dispose();
      coverGeometry.dispose();
      shadowGeometry.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
