import { FONT, INK, ROUTE, ROUTE_LEAD } from './content';
import type { Face, Layer, Leaf } from './caseBook';
import type { Shot, Work } from './WorkGallery';

type Ctx = CanvasRenderingContext2D;

const DARK = '#141210';
const COVER = '#171513';
const pad2 = (n: number) => String(n).padStart(2, '0');

/** Mezcla dos hex en sRGB: t=0 da a, t=1 da b. Así salen los tonos claros y oscuros de cada acento. */
const mix = (a: string, b: string, t: number) => {
  const ch = (hex: string, k: number) => parseInt(hex.slice(1 + k * 2, 3 + k * 2), 16);
  return `#${[0, 1, 2]
    .map(k =>
      Math.round(ch(a, k) + (ch(b, k) - ch(a, k)) * t)
        .toString(16)
        .padStart(2, '0')
    )
    .join('')}`;
};

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
 * Arma las hojas del libro: tapa, y por cada caso una página de color con los datos (izquierda) y una oscura con las
 * capturas (derecha). La izquierda de un caso es el dorso de la hoja con la derecha del anterior.
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
  const logos = new Map<string, HTMLImageElement>();
  await Promise.all(
    Object.values(work).flatMap(w => [
      ...[w.main, w.float]
        .filter((s): s is Shot => !!s)
        .map(s => load(s.src).then(img => shots.set(s.src, img))),
      ...(w.logo ? [load(w.logo.src).then(img => logos.set(w.logo!.src, img))] : []),
    ])
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

  /** Logo blanco pintado del color de la tinta: dibujo y después source-in. */
  const tinted = (img: HTMLImageElement, w: number, h: number, color: string) => {
    const t = document.createElement('canvas');
    t.width = Math.round(w);
    t.height = Math.round(h);
    const c = t.getContext('2d');
    if (c) {
      c.drawImage(img, 0, 0, t.width, t.height);
      c.globalCompositeOperation = 'source-in';
      c.fillStyle = color;
      c.fillRect(0, 0, t.width, t.height);
    }
    return t;
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
  const ring = (c: Ctx, x: number, y: number, r: number, width: number, color: string) => {
    c.strokeStyle = color;
    c.lineWidth = width;
    c.beginPath();
    c.arc(x, y, r - width / 2, 0, Math.PI * 2);
    c.stroke();
  };

  const ringDot = (c: Ctx, x: number, y: number, r: number, color: string, hole: string) => {
    c.fillStyle = color;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
    c.fillStyle = hole;
    c.beginPath();
    c.arc(x, y, r * 0.34, 0, Math.PI * 2);
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
    return { paper: COVER, grid: true, layers };
  };

  /* ---------- izquierda: el caso en el color de acento ---------- */

  const metaFace = (i: number): Face => {
    const stop = ROUTE[i];
    const w = work[stop.company] ?? { accent: INK.cream };
    const ink = INK.ground;
    const logo = w.logo && logos.get(w.logo.src);
    const tint = mix(w.accent, INK.cream, 0.38);
    const shade = mix(w.accent, INK.ground, 0.32);
    const partner = partnerOf(w.accent);
    return {
      paper: w.accent,
      layers: [
        // Fondo: aro grande en el tono claro que entra desde abajo y medio disco en el tono oscuro.
        shapes(0.15, c => {
          ring(c, 0.98, H * 0.86, 0.62, 0.22, tint);
          disc(c, 0, H, 0.34, shade);
        }),
        // El número con su sombra plana corrida, en el tono oscuro: el recorte de papel del resto del sitio.
        layer(0.06, 0.02, 0.9, 0.46, 0.7, (c, cw, ch) => {
          c.textBaseline = 'alphabetic';
          c.font = display(900, ch * 1.12);
          c.fillStyle = shade;
          c.fillText(pad2(i + 1), -0.02 * cw + 16 * u, ch * 0.98 + 12 * u);
          c.fillStyle = ink;
          c.fillText(pad2(i + 1), -0.02 * cw, ch * 0.98);
        }),
        layer(0.08, 0.5, 0.84, 0.46, 0.22, (c, cw) => {
          c.fillStyle = ink;
          c.textBaseline = 'top';
          let y = 0;
          if (w.logo && logo) {
            const h = 52 * u;
            c.globalAlpha = 0.88;
            c.drawImage(tinted(logo, (w.logo.w / w.logo.h) * h, h, ink), 0, y);
            c.globalAlpha = 1;
            y += h + 34 * u;
          } else {
            c.font = display(800, 76 * u);
            c.fillText('CUBIQ', 0, y);
            ringDot(c, c.measureText('CUBIQ').width + 34 * u, y + 30 * u, 22 * u, ink, w.accent);
            c.fillStyle = ink;
            y += 92 * u;
          }
          c.font = display(800, 60 * u);
          c.fillText(stop.years.toUpperCase(), 0, y);
          y += 64 * u;
          const size = fit(c, stop.company.toUpperCase(), 900, 190 * u, cw);
          c.fillText(stop.company.toUpperCase(), 0, y);
          y += size * 0.9;
          c.font = text(34 * u);
          y = wrap(c, stop.role, 0, y, cw, 44 * u) + 20 * u;
          const cta = `${stop.linkLabel} →`;
          c.fillText(cta, 0, y);
          c.fillRect(0, y + 44 * u, c.measureText(cta).width, 3 * u);
        }),
        // Adelante, en el color pareja: cuarto de disco en la esquina y un aro chico que pisa el número.
        shapes(1.2, c => {
          disc(c, 1, 0, 0.26, partner);
          disc(c, 0.74, H * 0.4, 0.05, partner);
          disc(c, 0.74, H * 0.4, 0.018, w.accent);
        }),
      ],
    };
  };

  /* ---------- derecha: las capturas sobre la plancha ---------- */

  const frame = (
    c: Ctx,
    img: HTMLImageElement,
    shot: Shot,
    x: number,
    y: number,
    w: number,
    accent: string
  ) => {
    const bar = 54 * u;
    const h = w * (shot.h / shot.w);
    const r = 22 * u;
    c.save();
    c.beginPath();
    c.roundRect(x, y, w, bar + h, r);
    c.clip();
    c.fillStyle = '#221f1b';
    c.fillRect(x, y, w, bar);
    [accent, INK.cream, INK.cream].forEach((col, k) => {
      c.globalAlpha = k ? 0.4 : 1;
      ringDot(c, x + 30 * u + k * 30 * u, y + bar / 2, 9 * u, col, '#221f1b');
    });
    c.globalAlpha = 1;
    c.fillStyle = 'rgba(239,230,200,0.08)';
    c.beginPath();
    c.roundRect(x + 140 * u, y + bar / 2 - 12 * u, w * 0.4, 24 * u, 12 * u);
    c.fill();
    cover(c, img, x, y + bar, w, h, shot.pos);
    c.restore();
    return bar + h;
  };

  const workFace = (i: number): Face => {
    const stop = ROUTE[i];
    const w = work[stop.company] ?? { accent: INK.cream };
    const layers: Layer[] = [];
    const main = w.main && shots.get(w.main.src);
    const float = w.float && shots.get(w.float.src);
    const deep = mix(w.accent, INK.ground, 0.8);
    const mid = mix(w.accent, INK.ground, 0.55);
    const tint = mix(w.accent, INK.cream, 0.38);
    const partner = partnerOf(w.accent);
    // Fondo: disco en el tono medio detrás de la captura y un arco del color pareja que entra desde abajo.
    layers.push(
      shapes(0.18, c => {
        disc(c, 0.6, H * 0.36, 0.44, mid);
        ring(c, 0.06, H * 0.97, 0.34, 0.1, partner);
      })
    );
    if (w.main && main) {
      const shot = w.main;
      const fw = 0.86 * pw;
      const off = 22 * u;
      const fh = 54 * u + fw * (shot.h / shot.w);
      layers.push(
        layer(0.05, 0.08, (fw + off) / pw + 0.01, (fh + off) / ph + 0.01, 0.45, c => {
          // Placa plana del color del caso corrida abajo a la derecha, como en el resto del sitio: sin blur.
          c.fillStyle = w.accent;
          c.beginPath();
          c.roundRect(off, off, fw, fh, 22 * u);
          c.fill();
          frame(c, main, shot, 0, 0, fw, w.accent);
        })
      );
    } else {
      layers.push(layer(0.06, 0.14, 0.88, 0.58, 0.35, (c, cw, ch) => nodes(c, cw, ch)));
    }
    if (float) {
      const fw = 0.54 * pw;
      const fh = fw * (10 / 16);
      const b = 6 * u;
      const off = 16 * u;
      layers.push(
        layer(0.42, 0.5, (fw + off + b * 2) / pw, (fh + off + b * 2) / ph, 0.95, c => {
          c.fillStyle = 'rgba(0,0,0,0.55)';
          c.beginPath();
          c.roundRect(off, off, fw + b * 2, fh + b * 2, 18 * u);
          c.fill();
          c.fillStyle = w.accent;
          c.beginPath();
          c.roundRect(0, 0, fw + b * 2, fh + b * 2, 18 * u);
          c.fill();
          c.save();
          c.beginPath();
          c.roundRect(b, b, fw, fh, 14 * u);
          c.clip();
          cover(c, float, b, b, fw, fh);
          c.restore();
        })
      );
    }
    // Adelante: recortes chicos que pisan el borde de las capturas, con el rótulo del caso al pie.
    layers.push(
      shapes(1.4, c => {
        disc(c, 0.03, H * 0.07, 0.09, tint);
        disc(c, 0.93, H * 0.5, 0.05, partner);
        disc(c, 0.93, H * 0.5, 0.018, deep);
      }),
      layer(0.06, 0.9, 0.6, 0.06, 0.12, (c, _cw, ch) => {
        c.fillStyle = INK.cream;
        c.globalAlpha = 0.75;
        c.font = text(28 * u);
        c.textBaseline = 'middle';
        c.fillText(`${pad2(i + 1)} · ${stop.company}`, 0, ch / 2);
      })
    );
    return { paper: deep, grid: true, layers };
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
