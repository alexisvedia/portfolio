import { FONT, INK, ROUTE, ROUTE_LEAD } from './content';
import type { Face, Layer, Leaf } from './caseBook';
import type { Shot, Work } from './WorkGallery';

type Ctx = CanvasRenderingContext2D;

const CONFIDENTIAL = 'Trabajo confidencial';
const COVER = '#171513';
const pad2 = (n: number) => String(n).padStart(2, '0');

/** Tonos de un color: t > 0 lo aclara hacia blanco, t < 0 lo oscurece hacia negro; `a` es la opacidad. */
const shade = (hex: string) => {
  const n = parseInt(hex.slice(1), 16);
  const rgb = [n >> 16, (n >> 8) & 255, n & 255];
  return (t: number, a = 1) => {
    const [r, g, b] = rgb.map(v => Math.round(t > 0 ? v + (255 - v) * t : v * (1 + t)));
    return `rgba(${r},${g},${b},${a})`;
  };
};

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
  // Los logos vienen en blanco: van tal cual sobre la etiqueta del color de la marca.
  const logos = new Map<string, HTMLImageElement>();
  await Promise.all(
    Object.values(work).map(w =>
      w.logo ? load(w.logo.src).then(img => logos.set(w.logo!.src, img)).catch(() => null) : null
    )
  );

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

  /** Impresión pegada: borde blanco y sombra plana corrida (sin blur, como el sitio). Centro en px. */
  /** Glow, grano y vidrio: el pliego sigue el estilo "luz difusa" (Portfolio/estilo-luz-difusa.md, 2026-11-09). */
  const grain = (() => {
    const n = document.createElement('canvas');
    n.width = n.height = 128;
    const g = n.getContext('2d');
    if (!g) return null;
    const img = g.createImageData(128, 128);
    for (let k = 0; k < img.data.length; k += 4) {
      const v = Math.random() * 255;
      img.data[k] = img.data[k + 1] = img.data[k + 2] = v;
      img.data[k + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    return n;
  })();

  /** Campo de color con viñeta y grano; `draw` pinta el gradiente en unidades de ancho de página. */
  const field = (draw: (c: Ctx) => void) =>
    shapes(0.12, c => {
      draw(c);
      if (!grain) return;
      c.setTransform(1, 0, 0, 1, 0, 0);
      const pat = c.createPattern(grain, 'repeat');
      if (!pat) return;
      c.globalAlpha = 0.045; // la capa va a media resolución: más alto se ve manchado
      c.globalCompositeOperation = 'overlay';
      c.fillStyle = pat;
      c.fillRect(0, 0, c.canvas.width, c.canvas.height);
    });

  const glow = (c: Ctx, x: number, y: number, r: number, color: string) => {
    const g = c.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, color);
    g.addColorStop(1, 'rgba(255,255,255,0)');
    c.fillStyle = g;
    c.fillRect(x - r, y - r, 2 * r, 2 * r);
  };

  /** Píldora de vidrio: relleno blanco translúcido y borde de 1 px, sin sombra. Devuelve el ancho. */
  const glass = (c: Ctx, x: number, y: number, w: number, h: number) => {
    c.beginPath();
    c.roundRect(x, y, w, h, h / 2);
    c.fillStyle = 'rgba(255,255,255,0.14)';
    c.fill();
    c.strokeStyle = 'rgba(255,255,255,0.38)';
    c.lineWidth = Math.max(1, 0.002 * U);
    c.stroke();
  };

  const M = 0.091; // margen de página, en anchos

  /* Izquierda: campo del color de la empresa con un halo claro, datos en blanco y el único botón sólido. */
  const metaFace = (i: number): Face => {
    const stop = ROUTE[i];
    const w = work[stop.company] ?? { accent: INK.red };
    const tone = shade(w.accent);
    const logo = w.logo && logos.get(w.logo.src);
    return {
      paper: w.accent,
      layers: [
        field(c => {
          const g = c.createLinearGradient(0, 0, 0.6, H);
          g.addColorStop(0, tone(0.3));
          g.addColorStop(0.45, w.accent);
          g.addColorStop(1, tone(-0.4));
          c.fillStyle = g;
          c.fillRect(-0.1, -0.1, 1.2, H + 0.2);
          glow(c, 0.85, 0.2, 0.5, tone(0.8, 0.75));
          glow(c, 0.1, H + 0.1, 0.8, tone(-0.6, 0.8));
        }),
        piece(0, 0, 1, H, 0.45, c => {
          const x = M * U;
          const maxW = (1 - 2 * M - 0.08) * U;
          c.textBaseline = 'top';
          c.fillStyle = '#fff';
          // Chip con el número y los años.
          c.font = text(0.026 * U);
          const chip = `Caso ${pad2(i + 1)} · ${stop.years}`;
          const ch = 0.062 * U;
          const cw = c.measureText(chip).width + 0.064 * U;
          glass(c, x, M * U, cw, ch);
          c.fillStyle = '#fff';
          c.fillText(chip, x + 0.032 * U, M * U + 0.018 * U);
          // Nombre en la grotesca del sitio, regular y grande.
          let size = 0.17 * U;
          c.font = text(size);
          const nw = c.measureText(stop.company).width;
          if (nw > maxW) size = (size * maxW) / nw;
          c.font = text(size);
          let y = M * U + ch + 0.05 * U;
          c.fillText(stop.company, x - size * 0.04, y);
          y += size * 1.02;
          c.font = text(0.032 * U);
          c.globalAlpha = 0.6;
          c.fillText(stop.role, x, y);
          y += 0.075 * U;
          c.globalAlpha = 0.82;
          c.font = text(0.03 * U);
          lines(c, stop.text, maxW).forEach(l => {
            c.fillText(l, x, y);
            y += 0.046 * U;
          });
          c.globalAlpha = 1;
          // Fila de vidrio con el rótulo y el botón blanco, el único elemento sólido del pliego.
          y += 0.05 * U;
          const label = w.main?.label ?? CONFIDENTIAL;
          c.font = text(0.026 * U);
          const lw = c.measureText(label).width;
          const cta = `${stop.linkLabel} →`;
          const tw = c.measureText(cta).width;
          const p = 0.014 * U;
          const bh = 0.082 * U;
          const bw = tw + 0.07 * U;
          const rw = 0.03 * U + lw + 0.03 * U + bw + p;
          glass(c, x, y, rw, bh + 2 * p);
          c.fillStyle = '#fff';
          c.textBaseline = 'middle';
          c.fillText(label, x + 0.03 * U, y + p + bh / 2);
          const bx = x + rw - p - bw;
          c.beginPath();
          c.roundRect(bx, y + p, bw, bh, bh / 2);
          c.fill();
          c.fillStyle = tone(-0.55);
          c.fillText(cta, bx + 0.035 * U, y + p + bh / 2);
          // Línea de avance a la derecha, como la del reproductor.
          const lx = (1 - M) * U;
          c.fillStyle = 'rgba(255,255,255,0.55)';
          c.fillRect(lx, M * U, Math.max(1, 0.002 * U), (H - 2 * M) * U);
          c.font = text(0.024 * U);
          c.textAlign = 'right';
          c.textBaseline = 'top';
          c.globalAlpha = 0.85;
          c.fillText(pad2(i + 1), lx - 0.02 * U, M * U);
          c.textBaseline = 'bottom';
          c.fillText(pad2(ROUTE.length), lx - 0.02 * U, (H - M) * U);
        }),
        ...(logo && w.logo
          ? [
              piece(0, H - 0.25, 1, 0.25, 0.6, c => {
                const lh = 0.06 * U;
                const lw = Math.min(0.3 * U, (lh * w.logo!.w) / w.logo!.h);
                c.drawImage(logo, M * U, (H - M) * U - (lw * w.logo!.h) / w.logo!.w, lw, (lw * w.logo!.h) / w.logo!.w);
              }),
            ]
          : []),
      ],
    };
  };

  /* Derecha: la captura nítida adelante; detrás, una copia barrida que disuelven tres bandas de vidrio y un brillo. */
  const workFace = (i: number): Face => {
    const stop = ROUTE[i];
    const w = work[stop.company] ?? { accent: INK.red };
    const tone = shade(w.accent);
    const main = w.main && shots.get(w.main.src);
    const sw = 0.877;
    const sh = sw * (9 / 16) * (w.main ? Math.min(1.2, w.main.h / w.main.w / (9 / 16)) : 1);
    const sy = 0.333;
    const layers: Layer[] = [
      field(c => {
        const g = c.createLinearGradient(1, 0, 0.3, H);
        g.addColorStop(0, tone(0.85));
        g.addColorStop(0.4, tone(0.45));
        g.addColorStop(1, w.accent);
        c.fillStyle = g;
        c.fillRect(-0.1, -0.1, 1.2, H + 0.2);
      }),
    ];
    // Copia barrida: el canvas sin `filter` (Safari viejo) la saltea y queda el campo liso.
    if (main) {
      const probe = document.createElement('canvas').getContext('2d');
      if (probe && 'filter' in probe)
        layers.push(
          piece(0, 0, 1, H, 0.25, c => {
            c.filter = `blur(${Math.round(0.04 * U)}px) saturate(130%)`;
            c.globalAlpha = 0.8;
            c.drawImage(main, 0.1 * U, (sy + 0.03) * U, 1.1 * U, sh * U);
          })
        );
    }
    layers.push(
      piece(0, 0, 1, H, 0.3, c => {
        // Bandas cada vez más lavadas hacia el borde, con su filo claro.
        [
          [0.58, 0.16, 0.08],
          [0.74, 0.14, 0.16],
          [0.88, 0.14, 0.28],
        ].forEach(([x, bw, a]) => {
          c.fillStyle = `rgba(255,255,255,${a})`;
          c.fillRect(x * U, 0, bw * U, H * U);
          c.fillStyle = 'rgba(255,255,255,0.5)';
          c.fillRect(x * U, 0, Math.max(1, 0.002 * U), H * U);
        });
        glow(c, 1.05 * U, 0.6 * U, 0.45 * U, 'rgba(255,255,255,0.75)');
      }),
      piece(0, sy - 0.1, 1, sh + 0.25, 0.5, c => {
        const x = 0.06 * U;
        const y = sy * U;
        const r = 0.02 * U;
        c.save();
        c.shadowColor = tone(-0.7, 0.45);
        c.shadowBlur = 0.1 * U;
        c.shadowOffsetY = 0.04 * U;
        c.beginPath();
        c.roundRect(x, y, sw * U, sh * U, r);
        c.fillStyle = main ? '#fff' : 'rgba(255,255,255,0.16)';
        c.fill();
        c.restore();
        if (w.main && main) {
          c.save();
          c.clip();
          cover(c, main, x, y, sw * U, sh * U, w.main.pos);
          c.restore();
          return;
        }
        // Sin capturas (Cubiq, trabajo confidencial): una placa de vidrio con lo que hice, sin mostrar sistemas.
        c.strokeStyle = 'rgba(255,255,255,0.4)';
        c.lineWidth = Math.max(1, 0.002 * U);
        c.stroke();
        c.fillStyle = '#fff';
        c.textBaseline = 'middle';
        c.font = text(0.045 * U);
        const items = stop.text.split(':')[1]?.replace(/\.$/, '').split(/, | y /) ?? [];
        items.forEach((it, k) => {
          const ty = y + ((k + 1) * sh * U) / (items.length + 1);
          c.globalAlpha = 0.5;
          c.fillText(pad2(k + 1), x + 0.06 * U, ty);
          c.globalAlpha = 1;
          c.fillText(it.trim().replace(/^./, m => m.toUpperCase()), x + 0.16 * U, ty);
        });
      }),
      piece(0, H - 0.25, 1, 0.25, 0.6, c => {
        c.fillStyle = '#fff';
        c.textBaseline = 'bottom';
        c.font = text(0.03 * U);
        c.globalAlpha = 0.75;
        const y = (H - M) * U;
        c.fillText(w.main?.label ?? CONFIDENTIAL, M * U, y);
        c.globalAlpha = 0.92;
        c.font = text(0.024 * U);
        (c as Ctx & { letterSpacing?: string }).letterSpacing = `${0.004 * U}px`;
        c.fillText(`${stop.company} · ${stop.years}`.toUpperCase(), M * U, y - 0.05 * U);
      })
    );
    return { paper: w.accent, layers };
  };

  // Tapa con el caso 1 al dorso; después cada hoja lleva la derecha de un caso y la izquierda del siguiente.
  const leaves: Leaf[] = [{ front: await coverFace(), back: metaFace(0) }];
  ROUTE.forEach((_, i) =>
    leaves.push({ front: workFace(i), back: ROUTE[i + 1] ? metaFace(i + 1) : undefined })
  );
  return leaves;
}
