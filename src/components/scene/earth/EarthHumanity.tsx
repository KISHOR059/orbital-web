import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Helper: Convert Lat/Lon (degrees) to 3D Cartesian coordinates on sphere
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return new THREE.Vector3(x, y, z)
}

// Major Global Hubs (Lat, Lon)
const GLOBAL_HUBS: [string, number, number][] = [
  ['New York', 40.7128, -74.006],
  ['San Francisco', 37.7749, -122.4194],
  ['London', 51.5074, -0.1278],
  ['Paris', 48.8566, 2.3522],
  ['Tokyo', 35.6762, 139.6503],
  ['Singapore', 1.3521, 103.8198],
  ['Bengaluru', 12.9716, 77.5946],
  ['Dubai', 25.2048, 55.2708],
  ['Sydney', -33.8688, 151.2093],
  ['São Paulo', -23.5505, -46.6333],
  ['Frankfurt', 50.1109, 8.6821],
  ['Seoul', 37.5665, 126.978],
]

// Network Connections between Hubs
const CONNECTIONS: [number, number][] = [
  [0, 1], // New York - San Francisco
  [0, 2], // New York - London
  [1, 4], // San Francisco - Tokyo
  [2, 3], // London - Paris
  [2, 7], // London - Dubai
  [3, 10], // Paris - Frankfurt
  [4, 11], // Tokyo - Seoul
  [4, 5], // Tokyo - Singapore
  [5, 6], // Singapore - Bengaluru
  [6, 7], // Bengaluru - Dubai
  [5, 8], // Singapore - Sydney
  [0, 9], // New York - São Paulo
]

export function EarthHumanity({ radius = 2.006 }: { radius?: number }) {
  const pointsRef = useRef<THREE.Points>(null!)
  const linesRef = useRef<THREE.LineSegments>(null!)
  const orbitRef = useRef<THREE.LineSegments>(null!)

  // 1. Hub Points Positions & Dynamic Colors
  const { nodePositions, nodeColors } = useMemo(() => {
    const positions = new Float32Array(GLOBAL_HUBS.length * 3)
    const colors = new Float32Array(GLOBAL_HUBS.length * 3)

    const cyanColor = new THREE.Color('#38bdf8')
    const amberColor = new THREE.Color('#fbbf24')

    GLOBAL_HUBS.forEach(([, lat, lon], i) => {
      const vec = latLonToVector3(lat, lon, radius)
      positions[i * 3 + 0] = vec.x
      positions[i * 3 + 1] = vec.y
      positions[i * 3 + 2] = vec.z

      // Primary tech hubs warm cyan, auxiliary soft amber
      const color = i % 3 === 0 ? amberColor : cyanColor
      colors[i * 3 + 0] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b
    })

    return { nodePositions: positions, nodeColors: colors }
  }, [radius])

  // 2. Great Circle Curved Arcs between Hubs
  const lineGeometry = useMemo(() => {
    const points: THREE.Vector3[] = []

    CONNECTIONS.forEach(([startIndex, endIndex]) => {
      const start = latLonToVector3(GLOBAL_HUBS[startIndex][1], GLOBAL_HUBS[startIndex][2], radius)
      const end = latLonToVector3(GLOBAL_HUBS[endIndex][1], GLOBAL_HUBS[endIndex][2], radius)

      // Subdivide arc along spherical geodesic with slight altitude curve
      const segments = 24
      for (let s = 0; s < segments; s++) {
        const t1 = s / segments
        const t2 = (s + 1) / segments

        // Slerp interpolation on sphere
        const v1 = new THREE.Vector3().lerpVectors(start, end, t1)
        const v2 = new THREE.Vector3().lerpVectors(start, end, t2)

        // Arc elevation above sphere
        const altitude1 = Math.sin(t1 * Math.PI) * 0.08
        const altitude2 = Math.sin(t2 * Math.PI) * 0.08

        v1.normalize().multiplyScalar(radius + altitude1)
        v2.normalize().multiplyScalar(radius + altitude2)

        points.push(v1, v2)
      }
    })

    return new THREE.BufferGeometry().setFromPoints(points)
  }, [radius])

  // 3. Subtle Equatorial/Orbital Path Segments
  const orbitGeometry = useMemo(() => {
    const points: THREE.Vector3[] = []
    const segments = 96
    const orbitRadius = radius + 0.12

    for (let i = 0; i < segments; i++) {
      const angle1 = (i / segments) * Math.PI * 2
      const angle2 = ((i + 1) / segments) * Math.PI * 2

      points.push(
        new THREE.Vector3(
          Math.cos(angle1) * orbitRadius,
          Math.sin(angle1 * 2) * 0.08,
          Math.sin(angle1) * orbitRadius
        ),
        new THREE.Vector3(
          Math.cos(angle2) * orbitRadius,
          Math.sin(angle2 * 2) * 0.08,
          Math.sin(angle2) * orbitRadius
        )
      )
    }

    return new THREE.BufferGeometry().setFromPoints(points)
  }, [radius])

  // Gentle breathing luminescence
  useFrame(({ clock }) => {
    const t = clock.elapsedTime

    if (pointsRef.current) {
      const mat = pointsRef.current.material as THREE.PointsMaterial
      mat.opacity = 0.65 + Math.sin(t * 1.5) * 0.15
    }

    if (linesRef.current) {
      const mat = linesRef.current.material as THREE.LineBasicMaterial
      mat.opacity = 0.28 + Math.sin(t * 1.2) * 0.08
    }

    if (orbitRef.current) {
      const mat = orbitRef.current.material as THREE.LineBasicMaterial
      mat.opacity = 0.12 + Math.sin(t * 0.8) * 0.04
    }
  })

  return (
    <group name="earth-humanity">
      {/* 1. Global Connection Nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[nodeColors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.038}
          vertexColors
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>

      {/* 2. Thin Geographic Arc Lines */}
      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial
          color="#38bdf8"
          transparent
          opacity={0.32}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* 3. Minimal Orbital Trajectory Line */}
      <lineSegments ref={orbitRef} geometry={orbitGeometry}>
        <lineBasicMaterial
          color="#94a3b8"
          transparent
          opacity={0.14}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  )
}
