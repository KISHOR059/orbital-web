import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Project } from '../../../data/projects'

export interface ProjectObjectProps {
  project: Project
}

export function ProjectObject({ project }: ProjectObjectProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const innerMeshRef = useRef<THREE.Mesh>(null!)

  // Subtle floating levitation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const t = clock.elapsedTime + Number(project.number) * 1.5
      groupRef.current.position.y = project.position[1] + Math.sin(t * 0.9) * 0.12
    }
    if (innerMeshRef.current) {
      innerMeshRef.current.rotation.z = Math.sin(clock.elapsedTime * 0.5) * 0.05
    }
  })

  const accentColor = new THREE.Color(project.accentColor)

  return (
    <group
      ref={groupRef}
      position={project.position}
      rotation={project.rotation}
    >
      {/* 3D Glass / Interface Backing Plane */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[5.2, 3.4]} />
        <meshStandardMaterial
          color="#0b1329"
          roughness={0.2}
          metalness={0.8}
          transparent
          opacity={0.82}
        />
      </mesh>

      {/* Outer Wireframe & Sleek Frame Border */}
      <lineSegments position={[0, 0, 0.01]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(5.2, 3.4)]} />
        <lineBasicMaterial
          color={accentColor}
          transparent
          opacity={0.5}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Decorative Corner Anchor Ticks */}
      <group position={[0, 0, 0.02]}>
        {/* Top Left */}
        <lineSegments position={[-2.4, 1.5, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([-0.2, 0, 0, 0.2, 0, 0, 0, -0.2, 0, 0, 0.2, 0]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={accentColor} transparent opacity={0.8} />
        </lineSegments>

        {/* Top Right */}
        <lineSegments position={[2.4, 1.5, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([-0.2, 0, 0, 0.2, 0, 0, 0, -0.2, 0, 0, 0.2, 0]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={accentColor} transparent opacity={0.8} />
        </lineSegments>

        {/* Bottom Left */}
        <lineSegments position={[-2.4, -1.5, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([-0.2, 0, 0, 0.2, 0, 0, 0, -0.2, 0, 0, 0.2, 0]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={accentColor} transparent opacity={0.8} />
        </lineSegments>

        {/* Bottom Right */}
        <lineSegments position={[2.4, -1.5, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([-0.2, 0, 0, 0.2, 0, 0, 0, -0.2, 0, 0, 0.2, 0]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={accentColor} transparent opacity={0.8} />
        </lineSegments>
      </group>

      {/* Internal Abstract Geometric Core Visual */}
      <mesh ref={innerMeshRef} position={[0, 0, 0.05]}>
        <planeGeometry args={[4.6, 2.8]} />
        <meshBasicMaterial
          color="#061126"
          wireframe
          transparent
          opacity={0.25}
        />
      </mesh>
    </group>
  )
}
