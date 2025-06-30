import React, { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Leva } from 'leva'
import LiquidGlass from './LiquidGlass-liquid-glass'
import Effects from './postprocessing/Effects-liquid-glass'

function App() {
  return (
    <>
      <Leva collapsed={false} />
      <Canvas
        camera={{
          position: [0, 0, 5],
          fov: 35,
          near: 0.1,
          far: 1000
        }}
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance'
        }}
        style={{
          background: '#141414',
          width: '100vw',
          height: '100vh'
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#141414')
        }}
      >
        <Suspense fallback={null}>
          <LiquidGlass />
          <Effects />
        </Suspense>
      </Canvas>
    </>
  )
}

export default App