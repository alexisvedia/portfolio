# Liquid Glass - Apple Clone

Un clon pixel-perfect del efecto "Liquid Glass" de Apple usando React + TypeScript + Three.js.

## Características

- ✨ Efecto Liquid Glass con ray-marching SDF
- 🌟 Post-processing con Bloom y Depth of Field
- 🎮 Controles interactivos con Leva
- 🖱️ Parallax con movimiento del mouse
- 🔄 Animaciones fluidas a 60 FPS
- 🎨 Material físico con transmisión y clearcoat

## Instalación

1. Instala las dependencias:
```bash
npm install
```

2. **IMPORTANTE**: Descarga el archivo HDRI:
   - Ve a [Poly Haven](https://polyhaven.com/a/royal_esplanade)
   - Descarga `royal_esplanade_1k.hdr`
   - Colócalo en la carpeta `public/` del proyecto

3. Ejecuta el proyecto:
```bash
npm run dev
```

## Estructura del Proyecto

```
src/
├── App-liquid-glass.tsx          # Componente principal con Canvas
├── LiquidGlass-liquid-glass.tsx   # Mesh con shader personalizado
├── main-liquid-glass.tsx          # Punto de entrada
├── index-liquid-glass.css         # Estilos globales
└── postprocessing/
    └── Effects-liquid-glass.tsx   # Bloom + DOF
```

## Controles

### Material
- **IOR**: Índice de refracción (1.0 - 2.5)
- **Thickness**: Grosor del material (0.0 - 5.0)
- **Roughness**: Rugosidad de la superficie (0.0 - 1.0)
- **Clearcoat Roughness**: Rugosidad del clearcoat (0.0 - 1.0)
- **Transmission**: Transmisión de luz (0.0 - 1.0)
- **Clearcoat**: Intensidad del clearcoat (0.0 - 1.0)

### Post Processing
- **Bloom Threshold**: Umbral para el bloom (0.0 - 1.0)
- **Bloom Strength**: Intensidad del bloom (0.0 - 3.0)
- **Bloom Radius**: Radio del bloom (0.0 - 1.0)
- **DOF Focus Distance**: Distancia de enfoque (0.0 - 0.2)
- **DOF Focal Length**: Longitud focal (0.0 - 0.2)
- **DOF Bokeh Scale**: Escala del bokeh (0.0 - 10.0)

## Tecnologías

- **React 18** + **TypeScript**
- **Three.js** + **@react-three/fiber**
- **@react-three/drei** para utilidades
- **@react-three/postprocessing** para efectos
- **Leva** para controles de interfaz
- **Vite** como bundler

## Shader Features

- Ray-marching con SDF (Signed Distance Functions)
- Unión suave de dos esferas animadas
- Cálculo de normales procedural
- Efectos de Fresnel
- Iluminación dinámica
- Colores animados basados en posición y tiempo

## Performance

- Optimizado para 60 FPS
- Ray-marching limitado a 64 iteraciones
- Multisampling x8 para anti-aliasing
- Shaders compilados en GPU

## Interactividad

- **Mouse**: Parallax sutil en la cámara
- **Leva Controls**: Ajuste en tiempo real de parámetros
- **Responsive**: Se adapta a diferentes resoluciones

---

**Nota**: Asegúrate de tener una GPU compatible con WebGL 2.0 para el mejor rendimiento.