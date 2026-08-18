import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { EarthSurface } from './EarthSurface'
import { EarthClouds } from './EarthClouds'
import { EarthAtmosphere } from './EarthAtmosphere'

export function Earth() {
  const earthGroupRef = useRef<THREE.Group>(null!)

  // Fixed celestial sun position matching key directional light
  const sunPosition = useMemo(() => new THREE.Vector3(6, 2.5, 4.5), [])

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
        <EarthSurface sunPosition={sunPosition} />

        {/* Independent Dynamic Cloud Layer */}
        <EarthClouds radius={2.004} sunPosition={sunPosition} />

        {/* Cinematic Atmospheric Rayleigh Glow */}
        <EarthAtmosphere radius={2.008} sunPosition={sunPosition} />
      </group>
    </group>
  )
}

