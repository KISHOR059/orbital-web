import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function DigitalGrid() {
  const linesRef = useRef<THREE.LineSegments>(null!)

  // Procedural geometric grid & coordinate guidelines
  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = []

    const gridSize = 60
    const step = 4
    const yLevel = -48

    // Longitudinal grid lines
    for (let x = -gridSize / 2; x <= gridSize / 2; x += step) {
      points.push(new THREE.Vector3(x, yLevel, -35))
      points.push(new THREE.Vector3(x, yLevel, -110))
    }

    // Lateral grid lines
    for (let z = -35; z >= -110; z -= step) {
      points.push(new THREE.Vector3(-gridSize / 2, yLevel, z))
      points.push(new THREE.Vector3(gridSize / 2, yLevel, z))
    }

    // Vertical structural telemetry pillars
    const pillarCoords = [
      [-15, -45],
      [15, -45],
      [-18, -75],
      [18, -75],
      [-12, -100],
      [12, -100],
    ]

    for (const [px, pz] of pillarCoords) {
      points.push(new THREE.Vector3(px, yLevel, pz))
      points.push(new THREE.Vector3(px, yLevel + 25, pz))
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    return geometry
  }, [])

  // Subtle pulsing grid shimmer
  useFrame(({ clock }) => {
    if (linesRef.current) {
      const mat = linesRef.current.material as THREE.LineBasicMaterial
      mat.opacity = 0.08 + Math.sin(clock.elapsedTime * 0.8) * 0.025
    }
  })

  return (
    <lineSegments ref={linesRef} geometry={lineGeometry}>
      <lineBasicMaterial
        color="#38bdf8"
        transparent
        opacity={0.09}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  )
}
