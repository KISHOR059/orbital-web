import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { CITIES, SEQUENTIAL_ROUTES, latLonToVector3, createElevatedGreatCirclePoints } from '../../../utils/geo'

export interface ConnectionNetworkProps {
  radius?: number
}

interface RouteVisualData {
  id: string
  fromId: string
  toId: string
  fromVec: THREE.Vector3
  toVec: THREE.Vector3
  curvePoints: THREE.Vector3[]
  segmentCount: number
  startTime: number
  duration: number
}

export function ConnectionNetwork({ radius = 2.008 }: ConnectionNetworkProps) {
  const linesRef = useRef<THREE.LineSegments>(null!)
  const signalsRef = useRef<THREE.Points>(null!)
  const pulsesRef = useRef<THREE.Points>(null!)

  // City lookup table
  const cityMap = useMemo(() => {
    const map = new Map<string, (typeof CITIES)[0]>()
    CITIES.forEach((c) => map.set(c.id, c))
    return map
  }, [])

  // Pre-calculate 3D orbital Great-Circle paths and sequential timing for all routes
  const routesData = useMemo<RouteVisualData[]>(() => {
    const list: RouteVisualData[] = []
    const routes = SEQUENTIAL_ROUTES

    routes.forEach((route, idx) => {
      const fromCity = cityMap.get(route.fromId)
      const toCity = cityMap.get(route.toId)

      if (fromCity && toCity) {
        const fromVec = latLonToVector3(fromCity.lat, fromCity.lon, radius)
        const toVec = latLonToVector3(toCity.lat, toCity.lon, radius)
        const curvePoints = createElevatedGreatCirclePoints(fromVec, toVec, radius, 48)

        list.push({
          id: route.id,
          fromId: route.fromId,
          toId: route.toId,
          fromVec,
          toVec,
          curvePoints,
          segmentCount: curvePoints.length - 1,
          startTime: idx * 1.4, // Staggered sequence
          duration: 2.2,
        })
      }
    })

    return list
  }, [cityMap, radius])

  // Total lines buffer allocation (pre-allocated once for all line segments)
  const { lineGeometry, linePositions, lineColors } = useMemo(() => {
    let totalSegments = 0
    routesData.forEach((r) => {
      totalSegments += r.segmentCount
    })

    const pos = new Float32Array(totalSegments * 2 * 3)
    const col = new Float32Array(totalSegments * 2 * 3)

    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geom.setAttribute('color', new THREE.BufferAttribute(col, 3))

    return { lineGeometry: geom, linePositions: pos, lineColors: col }
  }, [routesData])

  // Data Signal and Trail particles buffer (Head + 7 trailing points per route)
  const TRAIL_LENGTH = 8
  const { signalsGeometry, signalsPositions, signalsColors } = useMemo(() => {
    const totalSignalPoints = routesData.length * TRAIL_LENGTH
    const pos = new Float32Array(totalSignalPoints * 3)
    const col = new Float32Array(totalSignalPoints * 3)

    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geom.setAttribute('color', new THREE.BufferAttribute(col, 3))

    return { signalsGeometry: geom, signalsPositions: pos, signalsColors: col }
  }, [routesData])

  // Destination response pulse buffers (1 expanding radial ring point per destination city)
  const { pulsesGeometry, pulsesPositions, pulsesColors } = useMemo(() => {
    const totalPulses = routesData.length * 12
    const pos = new Float32Array(totalPulses * 3)
    const col = new Float32Array(totalPulses * 3)

    const geom = new THREE.BufferGeometry()
    geom.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    geom.setAttribute('color', new THREE.BufferAttribute(col, 3))

    return { pulsesGeometry: geom, pulsesPositions: pos, pulsesColors: col }
  }, [routesData])

  // Frame Loop: Smooth progressive drawing, packet transit, and destination responses
  useFrame(({ clock }) => {
    const elapsedTime = clock.elapsedTime
    const totalCycle = routesData.length * 1.4 + 4.0
    const timeInCycle = elapsedTime % totalCycle

    let linePtr = 0
    let signalPtr = 0
    let pulsePtr = 0

    const colorActiveHead = new THREE.Color('#ffffff')
    const colorActiveLine = new THREE.Color('#38bdf8')
    const colorSettledLine = new THREE.Color('#0284c7')
    const colorHidden = new THREE.Color('#000000')

    routesData.forEach((route) => {
      const { curvePoints, startTime, duration, toVec } = route
      const routeAge = timeInCycle - startTime

      // Progress along route: 0.0 (unformed) to 1.0 (fully established)
      const progress = THREE.MathUtils.clamp(routeAge / duration, 0, 1)
      const isTransmitting = routeAge >= 0 && routeAge <= duration * 1.35
      const isEstablished = routeAge > duration

      const numPoints = curvePoints.length
      const visibleSegments = Math.floor(progress * (numPoints - 1))

      // 1. UPDATE GREAT-CIRCLE LINE SEGMENTS
      for (let s = 0; s < numPoints - 1; s++) {
        const p1 = curvePoints[s]
        const p2 = curvePoints[s + 1]

        // Position indices
        const idx1 = linePtr * 6
        linePositions[idx1 + 0] = p1.x
        linePositions[idx1 + 1] = p1.y
        linePositions[idx1 + 2] = p1.z
        linePositions[idx1 + 3] = p2.x
        linePositions[idx1 + 4] = p2.y
        linePositions[idx1 + 5] = p2.z

        // Segment Color & Opacity
        let segColor: THREE.Color = colorHidden
        if (s <= visibleSegments && progress > 0) {
          if (isTransmitting && s >= visibleSegments - 2) {
            segColor = colorActiveHead
          } else if (isTransmitting) {
            segColor = colorActiveLine
          } else if (isEstablished) {
            segColor = colorSettledLine
          }
        }

        lineColors[idx1 + 0] = segColor.r * 0.45
        lineColors[idx1 + 1] = segColor.g * 0.45
        lineColors[idx1 + 2] = segColor.b * 0.45
        lineColors[idx1 + 3] = segColor.r * 0.45
        lineColors[idx1 + 4] = segColor.g * 0.45
        lineColors[idx1 + 5] = segColor.b * 0.45

        linePtr++
      }

      // 2. UPDATE TRAVELLING DATA SIGNAL & SHORT TRAIL
      if (isTransmitting && progress > 0.05 && progress < 1.0) {
        const currentIdx = Math.floor(progress * (numPoints - 1))

        for (let tr = 0; tr < TRAIL_LENGTH; tr++) {
          const trailIdx = Math.max(0, currentIdx - tr * 2)
          const trailPoint = curvePoints[trailIdx]
          const sigIdx = signalPtr * 3

          signalsPositions[sigIdx + 0] = trailPoint.x
          signalsPositions[sigIdx + 1] = trailPoint.y
          signalsPositions[sigIdx + 2] = trailPoint.z

          const fade = Math.pow(1 - tr / TRAIL_LENGTH, 1.8)
          const col = tr === 0 ? colorActiveHead : colorActiveLine

          signalsColors[sigIdx + 0] = col.r * fade
          signalsColors[sigIdx + 1] = col.g * fade
          signalsColors[sigIdx + 2] = col.b * fade

          signalPtr++
        }
      } else {
        // Hide signal off-frame when not active
        for (let tr = 0; tr < TRAIL_LENGTH; tr++) {
          const sigIdx = signalPtr * 3
          signalsPositions[sigIdx + 0] = 0
          signalsPositions[sigIdx + 1] = 0
          signalsPositions[sigIdx + 2] = 0
          signalsColors[sigIdx + 0] = 0
          signalsColors[sigIdx + 1] = 0
          signalsColors[sigIdx + 2] = 0
          signalPtr++
        }
      }

      // 3. DESTINATION RESPONSE (Expanding pulse upon arrival)
      const arrivalAge = routeAge - duration
      if (arrivalAge >= 0 && arrivalAge <= 0.8) {
        const pulseProgress = arrivalAge / 0.8
        const pulseRadius = 0.02 + pulseProgress * 0.05
        const pulseAlpha = (1 - pulseProgress) * 0.65

        // Construct a small ring of 12 points around destination vector
        for (let k = 0; k < 12; k++) {
          const theta = (k / 12) * Math.PI * 2
          const pIdx = pulsePtr * 3

          // Offset orthogonally to destination normal
          pulsesPositions[pIdx + 0] = toVec.x + Math.cos(theta) * pulseRadius
          pulsesPositions[pIdx + 1] = toVec.y + Math.sin(theta) * pulseRadius
          pulsesPositions[pIdx + 2] = toVec.z

          pulsesColors[pIdx + 0] = colorActiveLine.r * pulseAlpha
          pulsesColors[pIdx + 1] = colorActiveLine.g * pulseAlpha
          pulsesColors[pIdx + 2] = colorActiveLine.b * pulseAlpha

          pulsePtr++
        }
      } else {
        for (let k = 0; k < 12; k++) {
          const pIdx = pulsePtr * 3
          pulsesPositions[pIdx + 0] = 0
          pulsesPositions[pIdx + 1] = 0
          pulsesPositions[pIdx + 2] = 0
          pulsesColors[pIdx + 0] = 0
          pulsesColors[pIdx + 1] = 0
          pulsesColors[pIdx + 2] = 0
          pulsePtr++
        }
      }
    })

    // Mark geometry attributes for GPU update
    if (linesRef.current) {
      linesRef.current.geometry.attributes.position.needsUpdate = true
      linesRef.current.geometry.attributes.color.needsUpdate = true
    }
    if (signalsRef.current) {
      signalsRef.current.geometry.attributes.position.needsUpdate = true
      signalsRef.current.geometry.attributes.color.needsUpdate = true
    }
    if (pulsesRef.current) {
      pulsesRef.current.geometry.attributes.position.needsUpdate = true
      pulsesRef.current.geometry.attributes.color.needsUpdate = true
    }
  })

  return (
    <group name="connection-network">
      {/* 1. Progressive Great-Circle Route Line Segments */}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* 2. Travelling Data Signals & Short Trails */}
      <points ref={signalsRef} geometry={signalsGeometry}>
        <pointsMaterial
          size={0.048}
          vertexColors
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* 3. Destination Response Pulses */}
      <points ref={pulsesRef} geometry={pulsesGeometry}>
        <pointsMaterial
          size={0.032}
          vertexColors
          transparent
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  )
}
