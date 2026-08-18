import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CITIES, CITY_CONNECTIONS, latLonToVector3, createGeodesicArc } from '../../../utils/geo'

export interface ConnectionArcsProps {
  radius?: number
}

export function ConnectionArcs({ radius = 2.008 }: ConnectionArcsProps) {
  const linesRef = useRef<THREE.LineSegments>(null!)

  // Map city IDs to data dictionary
  const cityMap = useMemo(() => {
    const map = new Map<string, (typeof CITIES)[0]>()
    CITIES.forEach((c) => map.set(c.id, c))
    return map
  }, [])

  // Generate smooth geodesic Great-Circle arcs between city pairs
  const lineGeometry = useMemo(() => {
    const allPoints: THREE.Vector3[] = []

    CITY_CONNECTIONS.forEach(({ fromId, toId }) => {
      const fromCity = cityMap.get(fromId)
      const toCity = cityMap.get(toId)

      if (fromCity && toCity) {
        const start = latLonToVector3(fromCity.lat, fromCity.lon, radius)
        const end = latLonToVector3(toCity.lat, toCity.lon, radius)

        const arcPoints = createGeodesicArc(start, end, radius, 28, 0.07)
        allPoints.push(...arcPoints)
      }
    })

    return new THREE.BufferGeometry().setFromPoints(allPoints)
  }, [cityMap, radius])

  // Subtle breathing luminescence
  useFrame(({ clock }) => {
    if (linesRef.current) {
      const mat = linesRef.current.material as THREE.LineBasicMaterial
      mat.opacity = 0.26 + Math.sin(clock.elapsedTime * 1.1) * 0.07
    }
  })

  return (
    <lineSegments ref={linesRef} geometry={lineGeometry}>
      <lineBasicMaterial
        color="#38bdf8"
        transparent
        opacity={0.28}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  )
}
