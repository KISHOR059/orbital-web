import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export function DigitalGrid() {
  const linesRef = useRef<THREE.LineSegments>(null!)

  // Procedural geometric grid & fine coordinate guidelines
  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = []

    const gridSize = 50
    const step = 5
    const yLevel = -46

    // Longitudinal grid lines
    for (let x = -gridSize / 2; x <= gridSize / 2; x += step) {
      points.push(new THREE.Vector3(x, yLevel, -38))
      points.push(new THREE.Vector3(x, yLevel, -100))
    }

    // Lateral grid lines
    for (let z = -38; z >= -100; z -= step) {
      points.push(new THREE.Vector3(-gridSize / 2, yLevel, z))
      points.push(new THREE.Vector3(gridSize / 2, yLevel, z))
    }

    // Subtle vertical telemetry guide markers
    const markerCoords = [
      [-12, -48],
      [12, -48],
      [-14, -70],
      [14, -70],
      [-8, -92],
      [8, -92],
    ]

    for (const [px, pz] of markerCoords) {
      points.push(new THREE.Vector3(px, yLevel, pz))
      points.push(new THREE.Vector3(px, yLevel + 8, pz))
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(points)
    return geometry
  }, [])

  // Subtle breathing opacity
  useFrame(({ clock }) => {
    if (linesRef.current) {
      const mat = linesRef.current.material as THREE.LineBasicMaterial
      mat.opacity = 0.055 + Math.sin(clock.elapsedTime * 0.6) * 0.015
    }
  })

  return (
    <lineSegments ref={linesRef} geometry={lineGeometry}>
      <lineBasicMaterial
        color="#38bdf8"
        transparent
        opacity={0.06}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  )
}
