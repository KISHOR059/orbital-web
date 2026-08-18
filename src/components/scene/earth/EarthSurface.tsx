import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

const NORMAL_SCALE = new THREE.Vector2(0.85, 0.85)

export function EarthSurface() {
  const [dayMap, normalMap, specularMap] = useTexture([
    '/textures/earth/earth_day.jpg',
    '/textures/earth/earth_normal.jpg',
    '/textures/earth/earth_specular.jpg',
  ])

  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        map={dayMap}
        map-colorSpace={THREE.SRGBColorSpace}
        normalMap={normalMap}
        normalScale={NORMAL_SCALE}
        roughnessMap={specularMap}
        roughness={0.65}
        metalness={0.1}
      />
    </mesh>
  )
}
