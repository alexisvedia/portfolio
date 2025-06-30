import React from 'react'
import { EffectComposer, Bloom, DepthOfField, Vignette } from '@react-three/postprocessing'
import { useControls } from 'leva'

const Effects: React.FC = () => {
  const {
    bloomThreshold,
    bloomStrength,
    bloomRadius,
    dofFocusDistance,
    dofFocalLength,
    dofBokehScale
  } = useControls('Post Processing', {
    bloomThreshold: { value: 0.95, min: 0.0, max: 1.0, step: 0.01 },
    bloomStrength: { value: 0.6, min: 0.0, max: 3.0, step: 0.01 },
    bloomRadius: { value: 0.85, min: 0.0, max: 1.0, step: 0.01 },
    dofFocusDistance: { value: 0.02, min: 0.0, max: 0.2, step: 0.001 },
    dofFocalLength: { value: 0.02, min: 0.0, max: 0.2, step: 0.001 },
    dofBokehScale: { value: 2.0, min: 0.0, max: 10.0, step: 0.1 }
  })

  return (
    <EffectComposer
      multisampling={8}
      stencilBuffer={false}
      depthBuffer={true}
    >
      <Bloom
        intensity={bloomStrength}
        luminanceThreshold={bloomThreshold}
        luminanceSmoothing={0.9}
        radius={bloomRadius}
        mipmapBlur={true}
      />
      <DepthOfField
        focusDistance={dofFocusDistance}
        focalLength={dofFocalLength}
        bokehScale={dofBokehScale}
        height={480}
      />
      <Vignette
        offset={0.1}
        darkness={0.3}
        eskil={false}
      />
    </EffectComposer>
  )
}

export default Effects