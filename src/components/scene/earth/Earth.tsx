import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { EarthSurface } from './EarthSurface'
import { EarthClouds } from './EarthClouds'
import { EarthAtmosphere } from './EarthAtmosphere'
import { EarthHumanity } from './EarthHumanity'

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
        {/* Core Planetary Surface (Frozen) */}
        <EarthSurface />

        {/* Independent Dynamic Cloud Layer (Frozen) */}
        <EarthClouds radius={2.004} />

        {/* Cinematic Atmospheric Rayleigh Glow (Frozen) */}
        <EarthAtmosphere radius={2.008} sunPosition={sunPosition} />

        {/* Subtle Humanity Global Network & Connection Visualization */}
        <EarthHumanity radius={2.006} />
      </group>
    </group>
  )
}
