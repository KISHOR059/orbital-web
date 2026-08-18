import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export function EarthClouds({ radius = 2.004 }: { radius?: number }) {
  const cloudsRef = useRef<THREE.Mesh>(null!)
  const cloudsMap = useTexture('/textures/earth/earth_clouds.jpg')

  // Smooth independent cloud drift
  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.035
    }
  })

  return (
    <mesh ref={cloudsRef} scale={[radius / 2, radius / 2, radius / 2]}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        map={cloudsMap}
        transparent={true}
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        roughness={1}
        metalness={0}
      />
    </mesh>
  )
}
