import React, { useLayoutEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styled from 'styled-components';

/* Efecto almohada: la sección real (no una captura) se dibuja en un canvas WebGL con la API HTML-in-Canvas
   (Chrome 157) y se hunde donde se aprieta, con un resorte al soltar. Sin soporte, se renderiza normal.
   ponytail: prototipo detrás de `?almohada` en la URL (mouse y touch); se abre sin flag cuando esté medido en el celular. */

const supported = () => {
  if (typeof document === 'undefined' || !new URLSearchParams(location.search).has('almohada')) return false;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  const c = document.createElement('canvas');
  c.setAttribute('content', 'drawable');
  const h = c as unknown as Partial<HtmlCanvas> & { content?: string };
  return h.content === 'drawable' && typeof h.requestPaint === 'function' && typeof h.getElementImageDefaultSize === 'function';
};

const VERT = `attribute vec2 a;varying vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}`;

/* La altura del pozo es h = -d·g, con g una gaussiana alrededor del toque. El contenido se toma de más afuera
   (se achica hacia el centro, como tela que se estira) y la luz, de arriba a la izquierda, sombrea las laderas. */
const FRAG = `precision highp float;
varying vec2 v;uniform sampler2D t;uniform vec2 p;uniform vec2 asp;uniform float d;uniform float R;
void main(){
  vec2 q=(v-p)*asp;float g=exp(-dot(q,q)/(R*R));
  vec4 c=texture2D(t,v+(v-p)*d*.3*g);
  vec2 grad=d*g*2.*q/(R*R)*R;
  vec3 L=normalize(vec3(-.4,.6,1.));
  float lit=dot(normalize(vec3(-grad*.55,1.)),L)-L.z;
  c.rgb*=1.-.16*d*g;
  c.rgb=clamp(c.rgb+lit*.55,0.,1.);
  gl_FragColor=c;
}`;

type HtmlCanvas = HTMLCanvasElement & {
  onpaint: ((e: Event & { changedElements?: Element[] }) => void) | null;
  requestPaint(): void;
  getElementImageDefaultSize(el: Element): { width: number; height: number };
  updateElementGeometry(el: Element, o: { canvasTransform: DOMMatrix }): void;
};
type Gl = WebGLRenderingContext & { texElementSubImage2D(t: number, l: number, x: number, y: number, el: Element): void };

const Almohada: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [on, setOn] = useState(supported);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  // Layout effect: el alto del canvas queda fijo antes de que ScrollTrigger mida la página (layout effect del padre).
  useLayoutEffect(() => {
    if (!on) return;
    const canvas = canvasRef.current as HtmlCanvas;
    const inner = innerRef.current!;
    const gl = canvas.getContext('webgl', { premultipliedAlpha: false, antialias: false, depth: false }) as Gl | null;
    if (!gl || typeof gl.texElementSubImage2D !== 'function') return setOn(false);

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.bindAttribLocation(prog, 0, 'a');
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return setOn(false);
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    const u = (n: string) => gl.getUniformLocation(prog, n);
    const [uP, uAsp, uD, uR] = [u('p'), u('asp'), u('d'), u('R')];
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);

    // Resorte: d va hacia `target` (1 apretado, 0 suelto) y rebota al soltar.
    let d = 0, vel = 0, target = 0, last = 0, size = '';
    const press = { x: 0.5, y: 0.5, sx: 0, sy: 0 };
    let painted = false;
    let dirty = true;

    const paint = (e: Event & { changedElements?: Element[] }) => {
      // Tras un resize la textura se vuelve a subir aunque el contenido no haya cambiado: su tamaño depende de la grilla.
      const changed = dirty || !e.changedElements || Array.from(e.changedElements).includes(inner);
      if (changed) {
        dirty = false;
        const def = canvas.getElementImageDefaultSize(inner);
        const [width, height] = [Math.ceil(def.width), Math.ceil(def.height)];
        if (Math.max(width, height) > gl.getParameter(gl.MAX_TEXTURE_SIZE)) return setOn(false);
        if (`${width}x${height}` !== size) {
          size = `${width}x${height}`;
          gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
        }
        gl.texElementSubImage2D(gl.TEXTURE_2D, 0, 0, 0, inner);
        canvas.updateElementGeometry(inner, { canvasTransform: new DOMMatrix() });
      }
      const now = performance.now();
      const dt = Math.min(0.033, last ? (now - last) / 1000 : 0.016);
      last = now;
      vel += (170 * (target - d) - (target ? 16 : 9) * vel) * dt;
      d += vel * dt;
      const settled = Math.abs(d - target) < 0.001 && Math.abs(vel) < 0.001;
      if (settled) {
        d = target;
        vel = last = 0;
      }

      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
      gl.uniform2f(uP, press.x, press.y);
      gl.uniform2f(uAsp, 1, canvas.height / canvas.width);
      gl.uniform1f(uD, d);
      gl.uniform1f(uR, 0.3);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      painted = true;
      if (!settled) canvas.requestPaint();
    };
    // Si algo de la API falla a mitad de camino, la sección quedaría sin contenido: se vuelve al render normal.
    canvas.onpaint = e => {
      try {
        paint(e);
      } catch {
        setOn(false);
      }
    };

    // El canvas no toma el alto de su contenido: lo copia, y en el mismo paso ajusta la grilla a píxeles físicos.
    // Un solo observer sobre inner: dos (canvas e inner) entran en loop y la grilla queda un cuadro atrasada.
    let tallest = inner.offsetHeight;
    canvas.style.height = `${tallest}px`;
    const fit = new ResizeObserver(([entry]) => {
      const { inlineSize: w, blockSize: h } = entry.borderBoxSize[0];
      canvas.style.height = `${h}px`;
      // Si cambia el alto (fuentes, SplitText), los pines de abajo quedan corridos: ScrollTrigger vuelve a medir.
      if (Math.abs(h - tallest) > 1) ScrollTrigger.refresh();
      tallest = h;
      canvas.width = Math.round(w * devicePixelRatio);
      canvas.height = Math.round(h * devicePixelRatio);
      // ponytail: si el navegador achica el buffer (canvas más alto que el máximo), se vuelve al render normal.
      if (gl.drawingBufferHeight < canvas.height) return setOn(false);
      dirty = true;
      canvas.requestPaint();
    });
    fit.observe(inner);

    let id = -1;
    const down = (e: PointerEvent) => {
      // Un solo dedo y solo el botón principal.
      if (e.button !== 0 || target) return;
      id = e.pointerId;
      const r = canvas.getBoundingClientRect();
      press.x = (e.clientX - r.left) / r.width;
      press.y = 1 - (e.clientY - r.top) / r.height;
      press.sx = e.clientX;
      press.sy = e.clientY;
      target = 1;
      canvas.requestPaint();
    };
    const up = (e?: Event) => {
      if (!target || (e instanceof PointerEvent && e.pointerId !== id)) return;
      target = 0;
      canvas.requestPaint();
    };
    // Si el dedo arrastra, es scroll: se suelta.
    const move = (e: PointerEvent) => target && e.pointerId === id && Math.hypot(e.clientX - press.sx, e.clientY - press.sy) > 8 && up();
    canvas.addEventListener('pointerdown', down, { passive: true });
    canvas.addEventListener('pointermove', move, { passive: true });
    for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) canvas.addEventListener(ev, up, { passive: true });
    window.addEventListener('scroll', up, { passive: true });
    const lost = () => setOn(false);
    canvas.addEventListener('webglcontextlost', lost);
    canvas.requestPaint();

    // Si el navegador no pinta el canvas, la sección quedaría en blanco: se vuelve al render normal.
    // Una pestaña oculta no pinta: el plazo corre desde que se ve.
    let guard = 0;
    const arm = () => {
      if (document.visibilityState !== 'visible' || guard) return;
      guard = window.setTimeout(() => !painted && setOn(false), 1000);
    };
    arm();
    document.addEventListener('visibilitychange', arm);
    return () => {
      window.clearTimeout(guard);
      document.removeEventListener('visibilitychange', arm);
      fit.disconnect();
      canvas.onpaint = null;
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) canvas.removeEventListener(ev, up);
      canvas.removeEventListener('webglcontextlost', lost);
      window.removeEventListener('scroll', up);
      gl.deleteTexture(tex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [on]);

  if (!on) return <>{children}</>;
  return (
    <Canvas ref={canvasRef} {...CANVAS_ATTRS} data-almohada="">
      <Inner ref={innerRef} {...DRAWABLE}>
        {children}
      </Inner>
    </Canvas>
  );
};

// Atributos de HTML-in-Canvas que React todavía no tipa.
const CANVAS_ATTRS = { content: 'drawable' } as Record<string, string>;
const DRAWABLE = { drawable: '' } as Record<string, string>;

const Canvas = styled.canvas`
  display: block;
  width: 100%;
  border-radius: inherit;
`;

const Inner = styled.div.withConfig({ shouldForwardProp: () => true })`
  box-sizing: border-box;
  width: 100%;
  padding: var(--section-pad);
  background: var(--poster-ground, transparent);
`;

export default Almohada;
