import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { INK } from './content';

gsap.registerPlugin(ScrollTrigger);

const QUERY = '(min-width: 1024px) and (prefers-reduced-motion: no-preference)';

/* Anillos del pasaje: el primero es el rojo de NODO, los siguientes anticipan los colores de OFICIO. */
const RINGS = [
  { color: INK.red, z: 0, tilt: 0.18 },
  { color: INK.orange, z: -6, tilt: -0.32 },
  { color: INK.teal, z: -12, tilt: 0.45 },
];

/**
 * Transición entre NODO y OFICIO: la cámara atraviesa tres anillos a medida que se scrollea.
 * Three.js se carga con import() solo en desktop y sin reduced motion; si no, queda un anillo plano en SVG.
 * Renderiza solo cuando cambia el scroll o el tamaño, sin loop de animación.
 */
const RingPassage: React.FC = () => {
  const [is3d, setIs3d] = useState(() => window.matchMedia(QUERY).matches);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const onChange = () => setIs3d(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Pasar de 3D a plano cambia el alto de la página en unos 160vh: los triggers de abajo se recalculan.
  useEffect(() => {
    ScrollTrigger.refresh();
  }, [is3d]);

  useEffect(() => {
    if (!is3d) return;
    let cancelled = false;
    let cleanup = () => {};

    import('three').then(THREE => {
      const stage = stageRef.current;
      const section = sectionRef.current;
      if (cancelled || !stage || !section) return;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true });
      } catch {
        // Sin WebGL (GPU bloqueada o software rendering): queda el anillo plano.
        setIs3d(false);
        return;
      }
      const geometry = new THREE.TorusGeometry(2.3, 0.62, 48, 160);
      const materials = RINGS.map(r => new THREE.MeshStandardMaterial({ color: r.color, roughness: 0.6 }));
      let trigger: ScrollTrigger | undefined;
      // El escenario cambia de ancho sin resize de window (sidebar que se anima al cambiar de ruta).
      const observer = new ResizeObserver(() => resize());
      cleanup = () => {
        trigger?.kill();
        observer.disconnect();
        geometry.dispose();
        materials.forEach(m => m.dispose());
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
      };

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(INK.ground);
      renderer.domElement.setAttribute('aria-hidden', 'true');
      stage.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);
      scene.add(new THREE.AmbientLight(0xffffff, 0.75));
      const sun = new THREE.DirectionalLight(0xffffff, 2.2);
      sun.position.set(4, 5, 8);
      scene.add(sun);

      const meshes = RINGS.map((r, i) => {
        const mesh = new THREE.Mesh(geometry, materials[i]);
        mesh.position.z = r.z;
        mesh.rotation.x = r.tilt;
        scene.add(mesh);
        return mesh;
      });

      const render = (progress: number) => {
        camera.position.set(Math.sin(progress * Math.PI) * 0.6, 0, 10 - progress * 25);
        camera.lookAt(0, 0, camera.position.z - 10);
        meshes.forEach((m, i) => {
          m.rotation.z = i * 0.7 + progress * 2.2;
          m.rotation.y = RINGS[i].tilt * (1 - progress);
        });
        renderer.render(scene, camera);
      };

      let progress = 0;
      const resize = () => {
        const { clientWidth: w, clientHeight: h } = stage;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        render(progress);
      };
      resize();
      observer.observe(stage);

      trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: self => {
          progress = self.progress;
          render(progress);
        },
      });
    }).catch(() => setIs3d(false));

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [is3d]);

  if (!is3d) {
    return (
      <Flat aria-hidden="true">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill={INK.red} />
          <circle cx="50" cy="50" r="14" fill={INK.ground} />
        </svg>
      </Flat>
    );
  }

  return (
    <Passage ref={sectionRef} aria-hidden="true">
      <Stage ref={stageRef} />
    </Passage>
  );
};

const Passage = styled.div`
  position: relative;
  height: 260vh;
`;

const Stage = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;

  canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

const Flat = styled.div`
  display: grid;
  place-items: center;
  padding-block: clamp(3rem, 10vh, 6rem);

  svg {
    width: clamp(7rem, 30vw, 11rem);
  }
`;

export default RingPassage;
