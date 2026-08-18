import { useRef, useState, useCallback } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import * as THREE from 'three'
import type { Project } from '../../../data/projects'

export interface ProjectObjectProps {
  project: Project
}

export function ProjectObject({ project }: ProjectObjectProps) {
  const groupRef = useRef<THREE.Group>(null!)
  const innerMeshRef = useRef<THREE.Mesh>(null!)
  const [hovered, setHovered] = useState(false)

  // Target values for smooth interpolation
  const targetScale = useRef(1.0)
  const currentScale = useRef(1.0)
  const mouseTilt = useRef({ x: 0, y: 0 })

  const accentColor = new THREE.Color(project.accentColor)

  const handlePointerOver = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHovered(true)
    targetScale.current = 1.035
    document.body.style.cursor = 'pointer'
  }, [])

  const handlePointerOut = useCallback(() => {
    setHovered(false)
    targetScale.current = 1.0
    mouseTilt.current = { x: 0, y: 0 }
    document.body.style.cursor = 'auto'
  }, [])

  const handlePointerMove = useCallback((e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    // Compute subtle tilt from intersection UV coordinates [-0.5..0.5]
    if (e.uv) {
      mouseTilt.current.x = (e.uv.y - 0.5) * 0.12
      mouseTilt.current.y = (e.uv.x - 0.5) * 0.16
    }
  }, [])

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation()
      const url = project.liveUrl || project.githubUrl
      if (url) {
        window.open(url, '_blank', 'noopener,noreferrer')
      }
    },
    [project.liveUrl, project.githubUrl]
  )

  // Smooth animation loop for hover scale, breathing, and tilt
  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return

    const damping = Math.min(1, delta * 8.0)

    // Smooth hover scale
    currentScale.current += (targetScale.current - currentScale.current) * damping
    groupRef.current.scale.setScalar(currentScale.current)

    // Base subtle ambient float & tilt
    const t = clock.elapsedTime * 0.6 + Number(project.number) * 2.0
    const floatY = project.position[1] + Math.sin(t) * 0.08

    groupRef.current.position.y += (floatY - groupRef.current.position.y) * damping

    // Base rotation + mouse tilt
    const rotX = project.rotation[0] + Math.sin(t * 0.7) * 0.012 + mouseTilt.current.x
    const rotY = project.rotation[1] + Math.cos(t * 0.5) * 0.015 + mouseTilt.current.y

    groupRef.current.rotation.x += (rotX - groupRef.current.rotation.x) * damping
    groupRef.current.rotation.y += (rotY - groupRef.current.rotation.y) * damping

    // Subtle internal lattice pulse
    if (innerMeshRef.current) {
      const mat = innerMeshRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = (hovered ? 0.28 : 0.16) + Math.sin(clock.elapsedTime * 1.5) * 0.04
    }
  })

  return (
    <group
      ref={groupRef}
      position={project.position}
      rotation={project.rotation}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onPointerMove={handlePointerMove}
      onClick={handleClick}
    >
      {/* 3D Physical Chassis with Subtle Depth (5.4 x 3.5 x 0.12) */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[5.4, 3.5, 0.12]} />
        <meshStandardMaterial
          color="#060b18"
          roughness={0.2}
          metalness={0.85}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Front Glass Surface Pane */}
      <mesh position={[0, 0, 0.065]}>
        <planeGeometry args={[5.32, 3.42]} />
        <meshStandardMaterial
          color="#040814"
          roughness={0.1}
          metalness={0.95}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Outer Sleek Perimeter Edge Frame */}
      <lineSegments position={[0, 0, 0.07]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(5.4, 3.5)]} />
        <lineBasicMaterial
          color={accentColor}
          transparent
          opacity={hovered ? 0.9 : 0.45}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* Top Browser / Telemetry Bar Line */}
      <lineSegments position={[0, 1.38, 0.075]}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[new Float32Array([-2.5, 0, 0, 2.5, 0, 0]), 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color={accentColor} transparent opacity={0.35} />
      </lineSegments>

      {/* 3D Header Telemetry Badges & Window Controls */}
      <group position={[-2.4, 1.52, 0.08]}>
        {/* Status Dot */}
        <mesh position={[0, 0, 0]}>
          <circleGeometry args={[0.04, 16]} />
          <meshBasicMaterial color={accentColor} />
        </mesh>
        <Text
          position={[0.15, -0.01, 0]}
          fontSize={0.11}
          color="#94a3b8"
          font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxTOlOV.woff"
          anchorX="left"
          anchorY="middle"
        >
          {`PROJECT_${project.number} // ${project.shortTitle}`}
        </Text>
      </group>

      {/* Year Tag on Top Right */}
      <Text
        position={[2.4, 1.51, 0.08]}
        fontSize={0.11}
        color={accentColor}
        font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxTOlOV.woff"
        anchorX="right"
        anchorY="middle"
      >
        {`// ${project.year}`}
      </Text>

      {/* Precision Corner Anchor Marks */}
      <group position={[0, 0, 0.08]}>
        {/* Top Left */}
        <lineSegments position={[-2.55, 1.6, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([-0.2, 0, 0, 0.2, 0, 0, 0, -0.2, 0, 0, 0.2, 0]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={accentColor} transparent opacity={hovered ? 1.0 : 0.8} />
        </lineSegments>

        {/* Top Right */}
        <lineSegments position={[2.55, 1.6, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([-0.2, 0, 0, 0.2, 0, 0, 0, -0.2, 0, 0, 0.2, 0]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={accentColor} transparent opacity={hovered ? 1.0 : 0.8} />
        </lineSegments>

        {/* Bottom Left */}
        <lineSegments position={[-2.55, -1.6, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([-0.2, 0, 0, 0.2, 0, 0, 0, -0.2, 0, 0, 0.2, 0]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={accentColor} transparent opacity={hovered ? 1.0 : 0.8} />
        </lineSegments>

        {/* Bottom Right */}
        <lineSegments position={[2.55, -1.6, 0]}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([-0.2, 0, 0, 0.2, 0, 0, 0, -0.2, 0, 0, 0.2, 0]), 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={accentColor} transparent opacity={hovered ? 1.0 : 0.8} />
        </lineSegments>
      </group>

      {/* Internal Abstract Schematic Data Grid / Preview Visual */}
      <mesh ref={innerMeshRef} position={[0, -0.15, 0.075]}>
        <planeGeometry args={[4.8, 2.5, 10, 6]} />
        <meshBasicMaterial
          color={accentColor}
          wireframe
          transparent
          opacity={0.16}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Interactive Call-to-action Hint on Portal */}
      <Text
        position={[0, -1.38, 0.08]}
        fontSize={0.095}
        color={hovered ? '#ffffff' : '#64748b'}
        font="https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxTOlOV.woff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
      >
        {hovered ? 'CLICK TO OPEN PROJECT ↗' : 'PROJECT ARTIFACT // CLICK TO VIEW'}
      </Text>
    </group>
  )
}
