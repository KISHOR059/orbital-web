import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { EarthSurface } from './EarthSurface'
import { EarthClouds } from './EarthClouds'
import { EarthAtmosphere } from './EarthAtmosphere'

export function Earth() {
  const earthGroupRef = useRef<THREE.Group>(null!)

  // Earth's natural axial tilt (~23.4 degrees)
  const axialTilt = THREE.MathUtils.degToRad(23.44)

  // Steady natural diurnal planetary rotation
  useFrame((_, delta) => {
    if (earthGroupRef.current) {
      earthGroupRef.current.rotation.y += delta * 0.02
    }
  })

  return (
    <group rotation={[0, 0, axialTilt]}>
      <group ref={earthGroupRef}>
        {/* Core Planetary Surface */}
        <EarthSurface />

        {/* Independent Dynamic Cloud Layer */}
        <EarthClouds radius={2.004} />

        {/* Cinematic Atmospheric Rayleigh Glow */}
        <EarthAtmosphere radius={2.008} />
      </group>
    </group>
  )
}
