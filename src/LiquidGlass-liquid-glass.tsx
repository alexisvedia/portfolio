import React, { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, useTexture } from '@react-three/drei'
import { useControls } from 'leva'
import * as THREE from 'three'

const LiquidGlass: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null!)
  const { camera, mouse } = useThree()
  
  // Leva controls
  const {
    ior,
    thickness,
    roughness,
    clearcoatRoughness,
    transmission,
    clearcoat
  } = useControls('Material', {
    ior: { value: 1.52, min: 1.0, max: 2.5, step: 0.01 },
    thickness: { value: 0.2, min: 0.0, max: 5.0, step: 0.01 },
    roughness: { value: 0.0, min: 0.0, max: 1.0, step: 0.01 },
    clearcoatRoughness: { value: 0.0, min: 0.0, max: 1.0, step: 0.01 },
    transmission: { value: 1.0, min: 0.0, max: 1.0, step: 0.01 },
    clearcoat: { value: 1.0, min: 0.0, max: 1.0, step: 0.01 }
  })

  // Shader uniforms
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
  }), [])

  // Custom shader code
  const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `

  const fragmentShader = `
    uniform float uTime;
    uniform vec2 uResolution;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    // SDF functions
    float sdSphere(vec3 p, float r) {
      return length(p) - r;
    }
    
    float opSmoothUnion(float d1, float d2, float k) {
      float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
      return mix(d2, d1, h) - k * h * (1.0 - h);
    }
    
    float map(vec3 p) {
      // Animate spheres
      vec3 p1 = p - vec3(sin(uTime * 0.5) * 0.5, cos(uTime * 0.3) * 0.3, 0.0);
      vec3 p2 = p - vec3(-sin(uTime * 0.7) * 0.4, -cos(uTime * 0.4) * 0.4, sin(uTime * 0.2) * 0.2);
      
      float sphere1 = sdSphere(p1, 0.3 + sin(uTime) * 0.1);
      float sphere2 = sdSphere(p2, 0.25 + cos(uTime * 1.2) * 0.08);
      
      return opSmoothUnion(sphere1, sphere2, 0.2);
    }
    
    vec3 calcNormal(vec3 p) {
      const float eps = 0.001;
      return normalize(vec3(
        map(p + vec3(eps, 0.0, 0.0)) - map(p - vec3(eps, 0.0, 0.0)),
        map(p + vec3(0.0, eps, 0.0)) - map(p - vec3(0.0, eps, 0.0)),
        map(p + vec3(0.0, 0.0, eps)) - map(p - vec3(0.0, 0.0, eps))
      ));
    }
    
    float rayMarch(vec3 ro, vec3 rd) {
      float t = 0.0;
      for (int i = 0; i < 64; i++) {
        vec3 p = ro + rd * t;
        float d = map(p);
        if (d < 0.001 || t > 10.0) break;
        t += d * 0.8;
      }
      return t;
    }
    
    void main() {
      vec2 uv = (vUv - 0.5) * 2.0;
      uv.x *= uResolution.x / uResolution.y;
      
      vec3 ro = vec3(0.0, 0.0, 2.0);
      vec3 rd = normalize(vec3(uv, -1.0));
      
      float t = rayMarch(ro, rd);
      
      if (t < 10.0) {
        vec3 p = ro + rd * t;
        vec3 n = calcNormal(p);
        
        // Lighting
        vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
        float diff = max(dot(n, lightDir), 0.0);
        
        // Fresnel effect
        float fresnel = pow(1.0 - max(dot(-rd, n), 0.0), 3.0);
        
        // Color based on position and time
        vec3 color = vec3(0.1, 0.3, 0.8) + sin(p * 3.0 + uTime) * 0.1;
        color = mix(color, vec3(1.0), fresnel * 0.5);
        color *= diff * 0.8 + 0.2;
        
        gl_FragColor = vec4(color, 0.8);
      } else {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
      }
    }
  `

  // Animation loop
  useFrame((state) => {
    if (materialRef.current) {
      // Update time uniform
      const material = materialRef.current as any
      if (material.userData.shader) {
        material.userData.shader.uniforms.uTime.value = state.clock.elapsedTime
      }
    }
    
    // Parallax effect
    camera.position.x = mouse.x * 0.1
    camera.position.y = mouse.y * 0.1
    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      {/* Environment map */}
      <Environment files="/royal_esplanade_1k.hdr" />
      
      {/* Main liquid glass mesh */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <planeGeometry args={[4, 3, 128, 128]} />
        <meshPhysicalMaterial
          ref={materialRef}
          transparent
          transmission={transmission}
          ior={ior}
          thickness={thickness}
          roughness={roughness}
          clearcoat={clearcoat}
          clearcoatRoughness={clearcoatRoughness}
          envMapIntensity={1}
          onBeforeCompile={(shader) => {
            // Add custom uniforms
            shader.uniforms.uTime = uniforms.uTime
            shader.uniforms.uResolution = uniforms.uResolution
            
            // Modify vertex shader
            shader.vertexShader = `
              varying vec2 vUv;
              varying vec3 vPosition;
              varying vec3 vNormal;
              
              ${shader.vertexShader.replace(
                '#include <begin_vertex>',
                `
                #include <begin_vertex>
                vUv = uv;
                vPosition = position;
                vNormal = normal;
                `
              )}
            `
            
            // Modify fragment shader
            shader.fragmentShader = `
              uniform float uTime;
              uniform vec2 uResolution;
              varying vec2 vUv;
              varying vec3 vPosition;
              varying vec3 vNormal;
              
              // SDF functions
              float sdSphere(vec3 p, float r) {
                return length(p) - r;
              }
              
              float opSmoothUnion(float d1, float d2, float k) {
                float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
                return mix(d2, d1, h) - k * h * (1.0 - h);
              }
              
              float map(vec3 p) {
                vec3 p1 = p - vec3(sin(uTime * 0.5) * 0.5, cos(uTime * 0.3) * 0.3, 0.0);
                vec3 p2 = p - vec3(-sin(uTime * 0.7) * 0.4, -cos(uTime * 0.4) * 0.4, sin(uTime * 0.2) * 0.2);
                
                float sphere1 = sdSphere(p1, 0.3 + sin(uTime) * 0.1);
                float sphere2 = sdSphere(p2, 0.25 + cos(uTime * 1.2) * 0.08);
                
                return opSmoothUnion(sphere1, sphere2, 0.2);
              }
              
              vec3 calcNormal(vec3 p) {
                const float eps = 0.001;
                return normalize(vec3(
                  map(p + vec3(eps, 0.0, 0.0)) - map(p - vec3(eps, 0.0, 0.0)),
                  map(p + vec3(0.0, eps, 0.0)) - map(p - vec3(0.0, eps, 0.0)),
                  map(p + vec3(0.0, 0.0, eps)) - map(p - vec3(0.0, 0.0, eps))
                ));
              }
              
              float rayMarch(vec3 ro, vec3 rd) {
                float t = 0.0;
                for (int i = 0; i < 64; i++) {
                  vec3 p = ro + rd * t;
                  float d = map(p);
                  if (d < 0.001 || t > 10.0) break;
                  t += d * 0.8;
                }
                return t;
              }
              
              ${shader.fragmentShader.replace(
                '#include <output_fragment>',
                `
                vec2 screenUv = (vUv - 0.5) * 2.0;
                screenUv.x *= uResolution.x / uResolution.y;
                
                vec3 ro = vec3(0.0, 0.0, 2.0);
                vec3 rd = normalize(vec3(screenUv, -1.0));
                
                float t = rayMarch(ro, rd);
                
                if (t < 10.0) {
                  vec3 p = ro + rd * t;
                  vec3 n = calcNormal(p);
                  
                  vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
                  float diff = max(dot(n, lightDir), 0.0);
                  
                  float fresnel = pow(1.0 - max(dot(-rd, n), 0.0), 3.0);
                  
                  vec3 liquidColor = vec3(0.1, 0.3, 0.8) + sin(p * 3.0 + uTime) * 0.1;
                  liquidColor = mix(liquidColor, vec3(1.0), fresnel * 0.5);
                  liquidColor *= diff * 0.8 + 0.2;
                  
                  gl_FragColor = vec4(mix(gl_FragColor.rgb, liquidColor, 0.3), gl_FragColor.a);
                } else {
                  #include <output_fragment>
                }
                `
              )}
            `
            
            // Store shader reference for animation
            materialRef.current.userData.shader = shader
          }}
        />
      </mesh>
    </>
  )
}

export default LiquidGlass