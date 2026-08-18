import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import { Earth } from './earth/Earth'
import { TechnologySpace } from './technology/TechnologySpace'
import { IdentityObject } from './identity/IdentityObject'
import { CameraRig } from './camera/CameraRig'

export interface SceneProps {
  scrollTriggerElement?: HTMLElement | string | null
}

export function Scene({ scrollTriggerElement }: SceneProps) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  const dprConfig: [number, number] = useMemo(() => {
    return isMobile ? [1, 1.5] : [1, 2]
  }, [isMobile])

  return (
    <div className="scene-container">
      <Canvas
        dpr={dprConfig}
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
        }}
      >
        {/* Cinematic Scroll-Driven Camera Rig */}
        <CameraRig scrollTriggerElement={scrollTriggerElement} />

        {/* Deep space cosmic background */}
        <color attach="background" args={['#02040a']} />

        {/* Low ambient light for deep space shadow contrast */}
        <ambientLight intensity={0.12} color="#ffffff" />

        {/* Sun-like key directional light */}
        <directionalLight
          position={[6, 2.5, 4.5]}
          intensity={3.2}
          color="#fffdf5"
        />

        {/* Deep space faint fill light */}
        <directionalLight
          position={[-6, -1.5, -3]}
          intensity={0.04}
          color="#60a5fa"
        />

        {/* Multi-depth cosmic starfields (adaptive count for mobile battery/GPU) */}
        <Stars
          radius={200}
          depth={80}
          count={isMobile ? 1200 : 3500}
          factor={3}
          saturation={0}
          fade
          speed={0.4}
        />
        <Stars
          radius={100}
          depth={50}
          count={isMobile ? 400 : 1000}
          factor={4.5}
          saturation={0.4}
          fade
          speed={0.7}
        />

        {/* Cinematic 3D Earth System */}
        <Suspense fallback={null}>
          <Earth scrollTriggerElement={scrollTriggerElement} />
        </Suspense>

        {/* Abstract Digital Technology Space */}
        <Suspense fallback={null}>
          <TechnologySpace />
        </Suspense>

        {/* Abstract 3D Identity Object */}
        <Suspense fallback={null}>
          <IdentityObject />
        </Suspense>
      </Canvas>
    </div>
  )
}
