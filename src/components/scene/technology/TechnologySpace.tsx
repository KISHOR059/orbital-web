import { useMemo } from 'react'
import * as THREE from 'three'
import { DigitalGrid } from '../digital-world/DigitalGrid'
import { DataParticles } from '../digital-world/DataParticles'

export function TechnologySpace() {
  // Continuity light beams bridging the planetary sphere to deep digital space
  const bridgeGeometry = useMemo(() => {
    const points: THREE.Vector3[] = []

    const bridgeCoords = [
      [-1.5, 0.5, 2.0, -10, -35, -45],
      [1.8, -0.2, 2.2, 12, -38, -55],
      [0.0, -1.2, 1.8, -4, -42, -70],
      [2.2, 0.8, 1.5, 8, -45, -80],
    ]

    bridgeCoords.forEach(([x1, y1, z1, x2, y2, z2]) => {
      points.push(new THREE.Vector3(x1, y1, z1))
      points.push(new THREE.Vector3(x2, y2, z2))
    })

    return new THREE.BufferGeometry().setFromPoints(points)
  }, [])

  return (
    <group name="technology-space">
      {/* 1. Subtle Architectural Coordinate Grid */}
      <DigitalGrid />

      {/* 2. Multi-Depth Floating Data Particles */}
      <DataParticles count={450} />

      {/* 3. Subtle Structural Continuity Guide Lines */}
      <lineSegments geometry={bridgeGeometry}>
        <lineBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.07}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  )
}
