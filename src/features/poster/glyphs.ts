// Alfabeto construido: cada glifo vive en una celda de 100 x 100 y se dibuja con un trazo de ancho fijo
// (STROKE) sobre la línea central, con remates redondos. Los anillos con punto son el acento de color.

export const CELL = 100;
export const STROKE = 20;
export const GAP = 8;

export interface Ring {
  cx: number;
  cy: number;
  r: number;
}

export interface Glyph {
  strokes: string[];
  rings?: Ring[];
}

const ARCH = 'M10,90 V50 A40,40 0 0 1 90,50 V90';

export const GLYPHS: Record<string, Glyph> = {
  A: { strokes: [ARCH, 'M10,62 H90'] },
  B: { strokes: ['M10,90 V24 Q10,10 24,10 H58 A20,20 0 0 1 58,50 H10', 'M10,50 H64 A20,20 0 0 1 64,90 H10'] },
  C: { strokes: ['M84.6,30 A40,40 0 1 0 84.6,70', 'M60,40 A14,14 0 1 0 60,60'] },
  D: { strokes: ['M50,10 H24 Q10,10 10,24 V76 Q10,90 24,90 H50 A40,40 0 0 0 50,10'] },
  E: { strokes: ['M90,10 H24 Q10,10 10,24 V76 Q10,90 24,90 H90', 'M10,50 H72'] },
  F: { strokes: ['M90,10 H24 Q10,10 10,24 V90', 'M10,50 H72'] },
  H: { strokes: ['M10,10 V90', 'M90,10 V90', 'M10,50 H90'] },
  I: { strokes: ['M10,10 H90', 'M50,10 V90', 'M10,90 H90'], rings: [{ cx: 50, cy: 50, r: 17 }] },
  L: { strokes: ['M10,10 V76 Q10,90 24,90 H90'] },
  N: { strokes: ['M10,90 V24 Q10,10 18,21 L82,79 Q90,90 90,76 V10'] },
  O: { strokes: ['M50,10 A40,40 0 1 1 49.99,10'], rings: [{ cx: 50, cy: 50, r: 15 }] },
  R: { strokes: ['M10,90 V24 Q10,10 24,10 H58 A22,22 0 0 1 58,54 H10', 'M52,54 A38,36 0 0 1 90,90'] },
  S: { strokes: ['M90,10 H31 A20,20 0 0 0 31,50 H69 A20,20 0 0 1 69,90 H10'] },
  T: { strokes: ['M10,10 H90', 'M50,10 V90'] },
  U: { strokes: ['M10,10 V50 A40,40 0 0 0 90,50 V10'] },
  V: { strokes: ['M10,10 L43,77 Q50,90 57,77 L90,10'] },
  X: { strokes: ['M10,10 L90,90', 'M90,10 L10,90'], rings: [{ cx: 50, cy: 50, r: 17 }] },
};

export interface PlacedGlyph {
  char: string;
  x: number;
  y: number;
  glyph: Glyph;
}

/** Ubica las letras de `word` en una grilla de `cols` columnas, como un bloque de kanji. */
export function layoutWord(word: string, cols: number) {
  const chars = [...word.toUpperCase()].filter((c) => GLYPHS[c]);
  const rows = Math.ceil(chars.length / cols);
  const pad = STROKE / 2;
  const placed: PlacedGlyph[] = chars.map((char, i) => ({
    char,
    x: (i % cols) * (CELL + GAP),
    y: Math.floor(i / cols) * (CELL + GAP),
    glyph: GLYPHS[char],
  }));
  const width = cols * CELL + (cols - 1) * GAP;
  const height = rows * CELL + (rows - 1) * GAP;
  return { placed, viewBox: `${-pad} ${-pad} ${width + STROKE} ${height + STROKE}`, width, height };
}
