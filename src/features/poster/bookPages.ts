import { FONT, INK, ROUTE, ROUTE_LEAD } from './content';
import type { Face, Layer, Leaf } from './caseBook';
import type { Shot, Work } from './WorkGallery';

type Ctx = CanvasRenderingContext2D;

const DARK = '#141210';
const COVER = '#171513';
const pad2 = (n: number) => String(n).padStart(2, '0');

/* Color pareja de cada acento para los recortes que contrastan: teal y violet no son acento de ningún caso. */
const PARTNER: Record<string, string> = {
  [INK.lime]: INK.violet,
  [INK.orange]: INK.teal,
  [INK.blue]: INK.orange,
  [INK.red]: INK.teal,
};
const partnerOf = (accent: string) => PARTNER[accent] ?? INK.violet;

const load = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

/**
 * Arma las hojas del libro: tapa, y por cada caso un pliego en collage de papel recortado (Alexis eligió la opción B,
 * 2026-11-08): los datos a la izquierda y las capturas pegadas a la derecha. La izquierda de un caso es el dorso de la
 * hoja con la derecha del anterior.
 */
export async function buildLeaves(
  work: Record<string, Work>,
  word: SVGSVGElement | null,
  pageH: number
): Promise<Leaf[]> {
  const pw = Math.round(pageH * 0.75);
  const ph = Math.round(pageH);
  const u = ph / 1400; // las medidas de abajo están pensadas para una página de 1050 × 1400

  const layer = (
    x: number,
    y: number,
    w: number,
    h: number,
    depth: number,
    draw: (c: Ctx, w: number, h: number) => void,
    res = 1
  ): Layer => {
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(w * pw * res));
    canvas.height = Math.max(1, Math.round(h * ph * res));
    const c = canvas.getContext('2d');
    if (c) draw(c, canvas.width, canvas.height);
    return { canvas, x, y, w, h, depth };
  };

  // Fuentes del sitio, ya declaradas en PosterGlobal: el canvas no las pide solo.
  await Promise.all(
    [`900 100px Morganite`, `800 100px Morganite`, `400 40px NHaas`].map(f =>
      document.fonts.load(f).catch(() => [])
    )
  );

  const shots = new Map<string, HTMLImageElement>();
  await Promise.all(
    Object.values(work).flatMap(w =>
      [w.main, w.float]
        .filter((s): s is Shot => !!s)
        .map(s => load(s.src).then(img => shots.set(s.src, img)))
    )
  );

  const display = (weight: number, size: number) => `${weight} ${size}px ${FONT.display}`;
  const text = (size: number) => `400 ${size}px ${FONT.text}`;

  /** Texto en varias líneas dentro de un ancho; devuelve la y donde terminó. */
  const wrap = (c: Ctx, str: string, x: number, y: number, maxW: number, lh: number) => {
    let line = '';
    for (const word of str.split(' ')) {
      const next = line ? `${line} ${word}` : word;
      if (c.measureText(next).width > maxW && line) {
        c.fillText(line, x, y);
        line = word;
        y += lh;
      } else line = next;
    }
    c.fillText(line, x, y);
    return y + lh;
  };

  /** Tamaño de fuente que entra en el ancho, sin pasar el máximo. */
  const fit = (c: Ctx, str: string, weight: number, max: number, maxW: number) => {
    c.font = display(weight, max);
    const w = c.measureText(str).width;
    const size = w > maxW ? (max * maxW) / w : max;
    c.font = display(weight, size);
    return size;
  };

  const cover = (
    c: Ctx,
    img: HTMLImageElement,
    x: number,
    y: number,
    w: number,
    h: number,
    pos = '50% 0%'
  ) => {
    const [px, py] = pos.split(' ').map(v => parseFloat(v) / 100);
    const s = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const sw = w / s;
    const sh = h / s;
    c.drawImage(
      img,
      (img.naturalWidth - sw) * px,
      (img.naturalHeight - sh) * py,
      sw,
      sh,
      x,
      y,
      w,
      h
    );
  };

  /**
   * Capa de recortes planos que pasa un poco el borde de la página, para que al correrse con el parallax no se vea su
   * corte. Se dibuja en unidades de ancho de página (x de 0 a 1, y de 0 a 4/3) y a media resolución: son colores planos.
   */
  const BLEED = 0.05;
  const shapes = (depth: number, draw: (c: Ctx) => void) =>
    layer(
      -BLEED,
      -BLEED,
      1 + 2 * BLEED,
      1 + 2 * BLEED,
      depth,
      (c, w) => {
        const s = w / (1 + 2 * BLEED);
        c.scale(s, s);
        c.translate(BLEED, BLEED * (ph / pw));
        draw(c);
      },
      0.5
    );
  const H = ph / pw;
  const disc = (c: Ctx, x: number, y: number, r: number, color: string) => {
    c.fillStyle = color;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
  };
  /* ---------- tapa ---------- */

  const coverFace = async (): Promise<Face> => {
    const layers: Layer[] = [];
    // La palabra CASOS sale del SVG de la intro: mismo alfabeto construido. Sin estilos inline por si quedó a medio animar.
    if (word) {
      const clone = word.cloneNode(true) as SVGSVGElement;
      clone.querySelectorAll('[style]').forEach(el => el.removeAttribute('style'));
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      const [, , vw, vh] = (clone.getAttribute('viewBox') ?? '0 0 3 2').split(/\s+/).map(Number);
      const box = { w: 0.8, h: 0.8 * (vh / vw) * 0.75 };
      clone.setAttribute('width', String(Math.round(box.w * pw)));
      clone.setAttribute('height', String(Math.round(box.h * ph)));
      const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(new XMLSerializer().serializeToString(clone))}`;
      const img = await load(url).catch(() => null);
      if (img)
        layers.push(
          layer(0.1, 0.12, box.w, box.h, 0.55, (c, w, h) => c.drawImage(img, 0, 0, w, h))
        );
    }
    layers.push(
      layer(0.1, 0.7, 0.8, 0.24, 0.2, (c, w) => {
        c.fillStyle = INK.cream;
        c.font = text(64 * u);
        c.textBaseline = 'top';
        c.fillText('Lo que construí', 0, 0);
        c.globalAlpha = 0.65;
        c.font = text(32 * u);
        wrap(c, ROUTE_LEAD, 0, 110 * u, w * 0.9, 44 * u);
      })
    );
    return { paper: COVER, layers };
  };

  /* ---------- pliego de cada caso: collage de papel recortado ---------- */

  // Las piezas del collage se miden en anchos de página (y de 0 a H) y se dibujan en px de lienzo: U px por ancho.
  const U = pw;

  /** Pieza en un lienzo justo: (x, y, w, h) en anchos de página; adentro se dibuja con el origen de la página. */
  const piece = (
    x: number,
    y: number,
    w: number,
    h: number,
    depth: number,
    draw: (c: Ctx) => void
  ) =>
    layer(x, y / H, w, h / H, depth, c => {
      c.translate(-x * U, -y * U);
      draw(c);
    });

  /** Parte un texto en líneas que entran en el ancho, con la fuente ya puesta. */
  const lines = (c: Ctx, str: string, maxW: number) => {
    const out: string[] = [];
    let line = '';
    for (const word of str.split(' ')) {
      const next = line ? `${line} ${word}` : word;
      if (c.measureText(next).width > maxW && line) {
        out.push(line);
        line = word;
      } else line = next;
    }
    out.push(line);
    return out;
  };

  /** Impresión pegada: borde blanco, sombra plana corrida (sin blur, como el sitio) y una cinta arriba. Centro en px. */
  const pasted = (
    c: Ctx,
    cx: number,
    cy: number,
    w: number,
    h: number,
    turn: number,
    shadow: string,
    tape: [number, number],
    fill: (x: number, y: number, w: number, h: number) => void
  ) => {
    const b = 0.016 * U;
    const off = 0.022 * U;
    c.save();
    c.translate(cx, cy);
    c.rotate(turn);
    c.fillStyle = shadow;
    c.fillRect(-w / 2 - b + off, -h / 2 - b + off, w + 2 * b, h + 2 * b);
    c.fillStyle = '#ffffff';
    c.fillRect(-w / 2 - b, -h / 2 - b, w + 2 * b, h + 2 * b);
    c.save();
    c.beginPath();
    c.rect(-w / 2, -h / 2, w, h);
    c.clip();
    fill(-w / 2, -h / 2, w, h);
    c.restore();
    c.translate(tape[0] * w, -h / 2 - b);
    c.rotate(tape[1]);
    c.fillStyle = 'rgba(239,230,200,0.82)';
    c.fillRect(-0.085 * U, -0.024 * U, 0.17 * U, 0.048 * U);
    c.restore();
  };

  /** Rótulo en píldora; con `right`, x es el borde derecho. */
  const pill = (
    c: Ctx,
    str: string,
    x: number,
    y: number,
    bg: string,
    fg: string,
    right = false
  ) => {
    c.font = text(0.027 * U);
    const pad = 0.022 * U;
    const w = c.measureText(str).width + 2 * pad;
    const h = 0.054 * U;
    const left = right ? x - w : x;
    c.fillStyle = bg;
    c.beginPath();
    c.roundRect(left, y, w, h, h / 2);
    c.fill();
    c.fillStyle = fg;
    c.textBaseline = 'middle';
    c.fillText(str, left + pad, y + h / 2 + 0.002 * U);
  };

  /* Izquierda: sticker con el número, el nombre grande sobre el círculo del caso y la tarjeta con el resumen. */
  const metaFace = (i: number): Face => {
    const stop = ROUTE[i];
    const w = work[stop.company] ?? { accent: INK.cream };
    const partner = partnerOf(w.accent);
    const sticker = w.accent === INK.red ? INK.ground : INK.red;
    return {
      paper: INK.cream,
      layers: [
        // El círculo cruza el lomo y sigue en la página derecha, a la misma profundidad. Abajo, un bloque del color pareja.
        shapes(0.15, c => {
          disc(c, 0.99, 0.565, 0.435, w.accent);
          c.fillStyle = partner;
          c.beginPath();
          c.roundRect(-0.1, 1.04, 0.73, 0.45, [0, 0.37, 0, 0]);
          c.fill();
        }),
        piece(0.04, 0.24, 0.92, 0.52, 0.55, c => {
          const name = stop.company.toUpperCase();
          const size = fit(c, name, 900, 0.43 * U, 0.86 * U);
          c.fillStyle = INK.ground;
          c.textBaseline = 'alphabetic';
          c.fillText(name, 0.074 * U, 0.315 * U + size * 0.8);
        }),
        piece(0.05, 0.69, 0.8, 0.62, 0.35, c => {
          const cw = 0.667 * U;
          const p = 0.042 * U;
          const lh = 0.04 * U;
          const headH = 0.056 * U;
          c.font = text(0.027 * U);
          const body = lines(c, stop.text, cw - 2 * p);
          const ch = p + headH + 0.022 * U + body.length * lh + 0.026 * U + 0.042 * U + p;
          c.save();
          c.translate(0.104 * U + cw / 2, 0.74 * U + ch / 2);
          c.rotate(0.026);
          c.translate(-cw / 2, -ch / 2);
          c.fillStyle = partner;
          c.fillRect(0.016 * U, 0.016 * U, cw, ch);
          c.fillStyle = INK.ground;
          c.fillRect(0, 0, cw, ch);
          c.textBaseline = 'top';
          const head = `${stop.years} · ${stop.role}`.toUpperCase();
          fit(c, head, 800, headH, cw - 2 * p);
          c.fillStyle = w.accent;
          c.fillText(head, p, p);
          let y = p + headH + 0.022 * U;
          c.font = text(0.027 * U);
          c.fillStyle = INK.cream;
          body.forEach(l => {
            c.fillText(l, p, y);
            y += lh;
          });
          y += 0.026 * U;
          const cta = `${stop.linkLabel} →`;
          c.font = text(0.031 * U);
          c.fillStyle = w.accent;
          c.fillText(cta, p, y);
          c.fillRect(p, y + 0.042 * U, c.measureText(cta).width, 0.004 * U);
          c.restore();
        }),
        piece(0.05, 0.05, 0.27, 0.27, 1.15, c => {
          c.translate(0.185 * U, 0.185 * U);
          c.rotate(-0.17);
          disc(c, 0, 0, 0.104 * U, sticker);
          c.fillStyle = INK.cream;
          c.font = display(900, 0.13 * U);
          c.textAlign = 'center';
          c.textBaseline = 'middle';
          c.fillText(pad2(i + 1), 0, 0.01 * U);
        }),
      ],
    };
  };

  /* Derecha: las capturas impresas y pegadas, con rótulos. Cubiq no tiene capturas: la red de nodos va como impresión. */
  const workFace = (i: number): Face => {
    const stop = ROUTE[i];
    const w = work[stop.company] ?? { accent: INK.cream };
    const partner = partnerOf(w.accent);
    const main = w.main && shots.get(w.main.src);
    const float = w.float && shots.get(w.float.src);
    const SHOT = 9 / 16;
    // Sin segunda captura (Cubiq) la impresión baja al centro y un bloque del color pareja llena la esquina de abajo.
    const solo = !(w.float && float);
    const cy = solo ? 0.6 : 0.37;
    const layers: Layer[] = [
      shapes(0.15, c => {
        disc(c, -0.01, 0.565, 0.435, w.accent);
        if (!solo) return;
        c.fillStyle = partner;
        c.beginPath();
        c.roundRect(0.45, 1.06, 0.7, 0.4, [0.35, 0, 0, 0]);
        c.fill();
      }),
      piece(0, cy - 0.35, 1, 0.72, 0.45, c => {
        const fw = 0.86 * U;
        pasted(c, 0.5 * U, cy * U, fw, fw * SHOT, 0.05, INK.ground, [0, -0.1], (x, y, sw, sh) => {
          if (w.main && main) return cover(c, main, x, y, sw, sh, w.main.pos);
          c.fillStyle = INK.ground;
          c.fillRect(x, y, sw, sh);
          c.translate(x, y);
          nodes(c, sw, sh);
        });
      }),
    ];
    if (w.float && float) {
      const shot = w.float;
      layers.push(
        piece(0.1, 0.64, 0.9, 0.58, 0.9, c => {
          const fw = 0.68 * U;
          pasted(
            c,
            0.56 * U,
            0.93 * U,
            fw,
            fw * SHOT,
            -0.07,
            partner,
            [-0.5, -0.7],
            (x, y, sw, sh) => cover(c, float, x, y, sw, sh, shot.pos)
          );
        })
      );
    }
    layers.push(
      piece(0, 0.5, 1, 0.78, 1.3, c => {
        pill(
          c,
          w.main?.label ?? 'Cinco canales, un solo nodo',
          0.95 * U,
          (cy + 0.23) * U,
          INK.red,
          INK.cream,
          true
        );
        if (!w.float?.label) return;
        // Flecha a mano alzada del rótulo a la segunda captura.
        c.strokeStyle = INK.red;
        c.lineWidth = 0.007 * U;
        c.lineCap = 'round';
        c.lineJoin = 'round';
        c.beginPath();
        c.moveTo(0.86 * U, 0.665 * U);
        c.bezierCurveTo(0.8 * U, 0.675 * U, 0.75 * U, 0.7 * U, 0.73 * U, 0.765 * U);
        c.stroke();
        c.beginPath();
        c.moveTo(0.7 * U, 0.738 * U);
        c.lineTo(0.73 * U, 0.772 * U);
        c.lineTo(0.765 * U, 0.748 * U);
        c.stroke();
        pill(c, w.float.label, 0.5 * U, 1.17 * U, w.accent, INK.ground);
      })
    );
    return { paper: INK.cream, layers };
  };

  // Tapa con el caso 1 al dorso; después cada hoja lleva la derecha de un caso y la izquierda del siguiente.
  const leaves: Leaf[] = [{ front: await coverFace(), back: metaFace(0) }];
  ROUTE.forEach((_, i) =>
    leaves.push({ front: workFace(i), back: ROUTE[i + 1] ? metaFace(i + 1) : undefined })
  );
  return leaves;
}

/** Red de nodos de Cubiq, la misma del SVG de la galería: cinco canales entran a un nodo y salen a tres destinos. */
function nodes(c: Ctx, w: number, h: number) {
  const k = Math.min(w / 400, h / 260);
  c.save();
  c.translate((w - 400 * k) / 2, (h - 260 * k) / 2);
  c.scale(k, k);
  const IN = [46, 88, 130, 172, 214];
  const OUT = [72, 130, 188];
  const colors = [INK.lime, INK.orange, INK.teal, INK.violet, INK.blue];
  c.lineCap = 'round';
  c.lineWidth = 4;
  IN.forEach((y, i) => {
    c.strokeStyle = colors[i];
    c.beginPath();
    c.moveTo(48, y);
    c.bezierCurveTo(128, y, 120, 130, 200, 130);
    c.stroke();
  });
  c.strokeStyle = INK.cream;
  OUT.forEach(y => {
    c.beginPath();
    c.moveTo(200, 130);
    c.bezierCurveTo(280, 130, 272, y, 352, y);
    c.stroke();
  });
  const ring = (x: number, y: number, r: number, col: string) => {
    c.fillStyle = col;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = DARK;
    c.beginPath();
    c.arc(x, y, r * 0.36, 0, Math.PI * 2);
    c.fill();
  };
  IN.forEach((y, i) => ring(48, y, 12, colors[i]));
  OUT.forEach(y => ring(352, y, 12, INK.cream));
  ring(200, 130, 30, INK.red);
  c.restore();
}
