import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

export function EarthSurface() {
  const [dayMap, normalMap, specularMap] = useTexture([
    '/textures/earth/earth_day.jpg',
    '/textures/earth/earth_normal.jpg',
    '/textures/earth/earth_specular.jpg',
  ])

  // Enhance texture sampling sharpness & color space
  dayMap.colorSpace = THREE.SRGBColorSpace

  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        map={dayMap}
        normalMap={normalMap}
        normalScale={new THREE.Vector2(0.85, 0.85)}
        roughnessMap={specularMap}
        roughness={0.65}
        metalness={0.1}
      />
    </mesh>
  )
}
