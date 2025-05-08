# Spline en React

## ¿Qué es Spline?

Spline es una herramienta para diseñar y crear elementos 3D interactivos para la web. Permite crear escenas 3D con una interfaz visual y luego exportarlas para usarlas en aplicaciones web.

## Características principales:

- Diseño visual de escenas 3D
- Animaciones y efectos interactivos
- Fácil integración con React
- Objetos 3D prediseñados
- Exportación en múltiples formatos

## Cómo usar el componente SplineScene

```jsx
import { SplineScene } from '../xcons';

function MiComponente() {
  return (
    <div style={{ width: '100%', height: '500px' }}>
      <SplineScene />
    </div>
  );
}
```

## Personalización

Si deseas usar una escena diferente, puedes crear tu propia escena en [Spline](https://spline.design/) y luego modificar la URL en el componente SplineScene.

## Requisitos

Este componente requiere la instalación de `@splinetool/react-spline`:

```bash
npm install @splinetool/react-spline
```

## Recursos adicionales

- [Documentación oficial de Spline](https://docs.spline.design/)
- [Tutoriales de Spline](https://spline.design/learn)
- [Ejemplos de proyectos con Spline](https://spline.design/explore) 