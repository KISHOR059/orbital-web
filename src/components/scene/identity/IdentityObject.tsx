import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export interface IdentityObjectProps {
  position?: [number, number, number]
}

export function IdentityObject({ position = [0, -38, -75] }: IdentityObjectProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const innerCoreRef = useRef<THREE.Mesh>(null!)
  const ring1Ref = useRef<THREE.LineSegments>(null!)
  const ring2Ref = useRef<THREE.LineSegments>(null!)

  // Geometric concentric orbital rings and core vertices
  const { ring1Geo, ring2Geo } = useMemo(() => {
    const r1Points: THREE.Vector3[] = []
    const r2Points: THREE.Vector3[] = []
    const segments = 64

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2
      r1Points.push(new THREE.Vector3(Math.cos(theta) * 1.8, Math.sin(theta) * 1.8, 0))
      r2Points.push(new THREE.Vector3(0, Math.cos(theta) * 1.4, Math.sin(theta) * 1.4))
    }

    return {
      ring1Geo: new THREE.BufferGeometry().setFromPoints(r1Points),
      ring2Geo: new THREE.BufferGeometry().setFromPoints(r2Points),
    }
  }, [])

  // Calm, steady floating and rotation
  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime

    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(t * 0.5) * 0.08
    }

    if (innerCoreRef.current) {
      innerCoreRef.current.rotation.x += delta * 0.15
      innerCoreRef.current.rotation.y += delta * 0.2
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.08
      ring1Ref.current.rotation.x = Math.sin(t * 0.3) * 0.15
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.x += delta * 0.06
      ring2Ref.current.rotation.y = Math.cos(t * 0.25) * 0.2
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* 1. Subtle Central Geometric Core (Icosahedron wireframe) */}
      <mesh ref={innerCoreRef}>
        <icosahedronGeometry args={[0.5, 0]} />
        <meshBasicMaterial
          color="#38bdf8"
          wireframe
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* 2. Central Light Point */}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* 3. Outer Concentric Orbital Rings */}
      <lineSegments ref={ring1Ref} geometry={ring1Geo}>
        <lineBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.25}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      <lineSegments ref={ring2Ref} geometry={ring2Geo}>
        <lineBasicMaterial
          color="#94a3b8"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  )
}
