import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CITIES, latLonToVector3 } from '../../../utils/geo'

export interface CityMarkersProps {
  radius?: number
}

export function CityMarkers({ radius = 2.008 }: CityMarkersProps) {
  const pointsRef = useRef<THREE.Points>(null!)

  // Precision Cartesian mapping for all 22 major global cities
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(CITIES.length * 3)
    const col = new Float32Array(CITIES.length * 3)

    const colorCyan = new THREE.Color('#38bdf8')
    const colorWhite = new THREE.Color('#f8fafc')
    const colorAmber = new THREE.Color('#fbbf24')

    CITIES.forEach((city, i) => {
      const vec = latLonToVector3(city.lat, city.lon, radius)
      pos[i * 3 + 0] = vec.x
      pos[i * 3 + 1] = vec.y
      pos[i * 3 + 2] = vec.z

      const chosen = city.tier === 1 ? (i % 2 === 0 ? colorWhite : colorCyan) : colorAmber
      col[i * 3 + 0] = chosen.r
      col[i * 3 + 1] = chosen.g
      col[i * 3 + 2] = chosen.b
    })

    return { positions: pos, colors: col }
  }, [radius])

  // Subtle breathing luminescence
  useFrame(({ clock }) => {
    if (pointsRef.current) {
      const mat = pointsRef.current.material as THREE.PointsMaterial
      mat.opacity = 0.7 + Math.sin(clock.elapsedTime * 1.6) * 0.15
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.034}
        vertexColors
        transparent
        opacity={0.75}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}
