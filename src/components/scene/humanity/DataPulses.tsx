import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CITIES, CITY_CONNECTIONS, latLonToVector3, createGeodesicArc } from '../../../utils/geo'

export interface DataPulsesProps {
  radius?: number
  count?: number
}

interface PulseState {
  arcPoints: THREE.Vector3[]
  speed: number
  offset: number
}

export function DataPulses({ radius = 2.008 }: DataPulsesProps) {
  const pointsRef = useRef<THREE.Points>(null!)

  // Map city data for quick lookup
  const cityMap = useMemo(() => {
    const map = new Map<string, (typeof CITIES)[0]>()
    CITIES.forEach((c) => map.set(c.id, c))
    return map
  }, [])

  // Pre-calculate arcs and pulse parameters for moving data packets
  const pulses = useMemo(() => {
    const pulseList: PulseState[] = []
    const connections = CITY_CONNECTIONS

    connections.forEach(({ fromId, toId }, idx) => {
      const fromCity = cityMap.get(fromId)
      const toCity = cityMap.get(toId)

      if (fromCity && toCity) {
        const start = latLonToVector3(fromCity.lat, fromCity.lon, radius)
        const end = latLonToVector3(toCity.lat, toCity.lon, radius)
        const arc = createGeodesicArc(start, end, radius, 36, 0.075)

        // 1-2 particles per active connection line
        pulseList.push({
          arcPoints: arc,
          speed: 0.22 + (idx % 3) * 0.05,
          offset: (idx * 0.17) % 1.0,
        })
        if (idx % 2 === 0) {
          pulseList.push({
            arcPoints: arc,
            speed: 0.18 + (idx % 2) * 0.04,
            offset: (idx * 0.17 + 0.5) % 1.0,
          })
        }
      }
    })

    return pulseList
  }, [cityMap, radius])

  // Geometry for dynamic particle positions and colors
  const geom = useMemo(() => {
    const numPulses = pulses.length
    const pos = new Float32Array(numPulses * 3)
    const col = new Float32Array(numPulses * 3)

    const colorCyan = new THREE.Color('#38bdf8')
    const colorWhite = new THREE.Color('#ffffff')

    for (let i = 0; i < numPulses; i++) {
      const chosen = i % 3 === 0 ? colorWhite : colorCyan
      col[i * 3 + 0] = chosen.r
      col[i * 3 + 1] = chosen.g
      col[i * 3 + 2] = chosen.b
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(col, 3))

    return geometry
  }, [pulses])

  // Animate data pulses along Great-Circle arcs
  useFrame(({ clock }) => {
    if (!pointsRef.current) return

    const t = clock.elapsedTime
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const posArray = posAttr.array as Float32Array

    pulses.forEach((pulse, i) => {
      const progress = (t * pulse.speed + pulse.offset) % 1.0
      const arc = pulse.arcPoints
      const index = Math.min(arc.length - 1, Math.floor(progress * arc.length))
      const pt = arc[index]

      if (pt) {
        posArray[i * 3 + 0] = pt.x
        posArray[i * 3 + 1] = pt.y
        posArray[i * 3 + 2] = pt.z
      }
    })

    posAttr.needsUpdate = true
  })

  return (
    <points ref={pointsRef} geometry={geom}>
      <pointsMaterial
        size={0.042}
        vertexColors
        transparent
        opacity={0.85}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}
