# Estilo recorte: análisis de las tres referencias

Fecha: 2026-11-04. Referencias: un pino contra el cielo, dos gallos (uno con campera) y un colchón de hojas de
capuchina con flores rojas, vistas desde arriba. Las tres son del mismo lenguaje, aunque cambie el tema.

## La idea en una oración

El volumen se construye con **parches planos de bordes rectos** apilados, con **tres tonos por material y el negro
como cuarto tono**, nunca con degradados ni líneas de contorno.

## Cómo están hechas

Son ilustración digital pintada con pincel de borde duro y una textura de grano muy leve (se nota en el cielo del
pino y en el blanco del fondo de los gallos). El proceso que se lee en los bordes:

1. Una mancha de color medio para cada masa (copa, cuerpo, hoja). La silueta sale de cortes rectos: un polígono de 6
   a 12 lados, nunca un círculo perfecto. Las curvas existen, pero como facetas.
2. Encima, el tono claro en la cara que da a la luz. Es un segundo polígono más chico, recortado por la mancha de
   abajo, corrido hacia arriba y a la izquierda.
3. Debajo y a la derecha, la sombra en **negro puro**, como un bloque separado que asoma por detrás. No es un
   oscurecimiento del verde: es otra pieza.
4. Al final, los detalles de línea fina: ramitas, las nervaduras de la capuchina, las rayas del buzo. Son trazos de
   grosor constante, más claros que el plano que cruzan.

No hay contorno en ningún lado. El borde de una forma es el cambio de color contra la de atrás.

## Reglas del estilo

### Forma

- **Polígono antes que curva.** Cada redondez se resuelve con 3 a 5 cortes rectos. Las hojas de capuchina son
  "círculos" de 9 o 10 lados; las flores son polígonos con una mordida, una entrada en V que rompe la simetría.
- **Ángulos sueltos, no geométricos.** Los cortes no siguen 45° ni 90°. Parecen hechos con tijera a mano alzada:
  ese desvío es lo que hace que no se vea vectorial.
- **Masas que se pisan.** Ninguna forma está aislada. En el pino, cada copa tapa a la de atrás; en la capuchina, las
  hojas se superponen hasta tapar casi todo el fondo.
- **Escala variada en racimos.** Una forma grande, dos medianas y varias chicas alrededor. En la capuchina conviven
  hojas de 4 tamaños distintos en el mismo cuadro.

### Color

- **Tres tonos por material, decididos de antemano.** En el pino, medidos con cuantización a 10 colores: verde oscuro `#27471b`,
  verde medio `#406e2e`, luz `#c9cb44` y negro `#030404`. La luz no es un verde más claro: tira al amarillo. La sombra fría tampoco: es negro.
- **El negro es el cuarto tono de todos los materiales.** Aparece en el pino, en el gallo y entre las hojas. Unifica
  la paleta y da el contraste fuerte.
- **Un fondo plano y saturado** (cian del cielo, celeste del agua, blanco puro) contra el que todo recorta. El fondo
  asoma entre las formas y funciona como un color más.
- **Un acento caliente que interrumpe** el campo dominante: las flores rojas sobre los verdes, el naranja y el rosa
  del gallo sobre el negro. Un acento cada tanto, no parejo.
- Los colores son de imprenta: planos, sin degradado, como tinta en serigrafía o papel de color.

### Luz

- **Una sola luz, de arriba a la izquierda**, y todo la respeta. Las caras claras miran arriba; las sombras negras
  caen abajo a la derecha.
- La luz no modela la forma con suavidad: la **parte en dos o tres zonas planas**, como un mapa.

### Línea

- La línea se usa solo para lo que es fino de verdad: ramas chicas, nervaduras, rayas de un tejido.
- Es de grosor constante, con punta redondeada, y va **en un tono más claro que el plano** cuando cruza un relleno
  (nervaduras amarillo verdoso sobre verde), o negra cuando va contra el fondo (ramitas contra el cielo).
- Las nervaduras salen **radiales de un punto descentrado**, no del centro de la hoja. Esa asimetría las hace creíbles.

### Composición

- **Encuadre que corta.** La capuchina y el pino salen del cuadro por los bordes: la imagen es un pedazo de algo más
  grande. Los gallos, en cambio, son figuras sueltas sobre blanco, como fichas de personaje.
- **Ritmo de repetición con variación.** Mismo motivo (copa, hoja, mancha redonda en el gallo) repetido con cambios
  de tamaño, giro y tono. Nada se repite idéntico.
- **Papelitos sueltos.** Pequeños rectángulos y puntos del color de acento flotan entre las formas (los rojos entre
  las hojas, las motas en las alas del gallo). Agregan vibración sin sumar objetos.
- **Mucha masa, poco detalle.** El detalle fino se concentra en uno o dos lugares (los ojos de los gallos, las
  nervaduras) y el resto es plano.

## Qué tiene en común con el portfolio y qué cambia

El portfolio ya comparte tres decisiones: colores planos de imprenta, fondo negro `#0d0c0b` y trazo de grosor
constante. Lo que estas referencias suman es lo que le faltaba: **volumen sin degradado**, con la regla de tres tonos
más negro, y **bordes cortados a mano** en vez de círculos y barras perfectos.

Para no contradecir el alfabeto construido del sitio, los fustes de las letras siguen con trazo constante. El recorte
va donde hay color, porque la sombra negra solo se lee sobre una superficie clara o saturada: sobre `#0d0c0b` es
invisible. Cada pieza usa los colores de la sección donde aparece.

## Dónde vive en el sitio

| Pieza | Archivo | Qué hace |
|---|---|---|
| Generador de cortes | `src/features/poster/cut.ts` | `cut()` arma polígonos de corte a mano con semilla fija; `SHADOW` es el negro `#030404` |
| Bordes entre secciones | `src/features/poster/ScissorEdge.tsx` | El papel de cada sección sube en dientes de tijera sobre la anterior, con filo claro y sombra-pieza; salta entre tres poses con el scroll |
| Citas | `src/features/poster/PosterHome.tsx` (`Quote`) | Esquinas cortadas, faceta de luz arriba a la izquierda y de sombra abajo a la derecha; el hover salta en tres poses |
| Chat de VOCES | `src/features/poster/TeamVoice.tsx` | Burbuja de "escribiendo" y reacciones recortadas, con entrada en `steps()` |
| Portal | `src/features/poster/Portal.tsx` | El iris abre como un polígono recortado que crece en siete poses, con astilla negra detrás |
| Hilo y confetti | `Stitch.tsx`, `src/features/landing/Landing.tsx` | Papelitos de 4 a 6 lados que aparecen a lo largo del hilo y salen del formulario enviado |
| Almohada | `src/features/poster/Almohada.tsx` | La sección se hunde donde se aprieta y rebota con un resorte; filtro SVG `feDisplacementMap`, funciona en Chrome y Firefox |

## Cómo se traduce a SVG

| Regla | En el SVG |
|---|---|
| Polígono antes que curva | `polygon` de 8 a 11 vértices con radio irregular (semilla fija, mismo dibujo en cada visita) |
| Tres tonos más negro | base en el color de la sección, luz en el tono de acento recortada con `clipPath`, sombra negra corrida abajo a la derecha |
| Una luz arriba a la izquierda | la luz siempre se corre hacia `-x, -y`; la sombra hacia `+x, +y` |
| Nervaduras radiales descentradas | `line` desde un punto corrido del centro hacia cada vértice, en tono claro |
| Papelitos | rectángulos chicos girados, en el acento |
| Movimiento de papel recortado | animación con `steps()`: la forma salta entre posiciones como en stop motion, en vez de deslizarse |

El movimiento sigue la lógica de animación de recortes: pocas poses por segundo, giros chicos, la luz que se corre
como una hoja que se da vuelta con el viento. Se apaga con `prefers-reduced-motion` y se pausa fuera de pantalla.
