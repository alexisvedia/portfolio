/* Geometría de papel recortado (docs/estilo-recorte.md): polígonos de corte a mano con semilla fija.
   Luz arriba a la izquierda; la sombra es una pieza negra corrida abajo a la derecha y solo se usa sobre superficies de color. */

export const SHADOW = '#030404';

// Semilla fija: el mismo dibujo en cada visita.
export const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

export type Pt = [number, number];
/** Polígono de 8 a 11 lados con radio irregular y una mordida: una "redondez" hecha con tijera. */
export const cut = (cx: number, cy: number, r: number, seed: number): Pt[] => {
  const rand = rng(seed);
  const n = 8 + Math.floor(rand() * 4);
  const bite = Math.floor(rand() * n);
  return Array.from({ length: n }, (_, i) => {
    const a = ((i + (rand() - 0.5) * 0.5) / n) * Math.PI * 2;
    const k = i === bite ? 0.68 : 0.86 + rand() * 0.2;
    return [cx + Math.cos(a) * r * k, cy + Math.sin(a) * r * k];
  });
};
export const pts = (p: Pt[], dx = 0, dy = 0, s = 1, [cx, cy]: Pt = [0, 0]) =>
  p.map(([x, y]) => `${(cx + (x - cx) * s + dx).toFixed(1)},${(cy + (y - cy) * s + dy).toFixed(1)}`).join(' ');

