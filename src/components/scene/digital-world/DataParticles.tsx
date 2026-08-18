import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Deterministic PRNG for pure render compliance
function createPrng(seed = 1337) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

export function DataParticles({ count = 600 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!)

  const [positions, colors] = useMemo(() => {
    const random = createPrng(42)
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    const color1 = new THREE.Color('#38bdf8') // Cyan accent
    const color2 = new THREE.Color('#ffffff') // Soft white
    const color3 = new THREE.Color('#818cf8') // Indigo accent

    for (let i = 0; i < count; i++) {
      // Spread across digital world coordinate space [x: -25..25, y: -55..-20, z: -100..-40]
      pos[i * 3 + 0] = (random() - 0.5) * 50
      pos[i * 3 + 1] = -20 - random() * 35
      pos[i * 3 + 2] = -40 - random() * 60

      const randVal = random()
      const chosenColor = randVal > 0.6 ? color1 : randVal > 0.3 ? color2 : color3
      col[i * 3 + 0] = chosenColor.r
      col[i * 3 + 1] = chosenColor.g
      col[i * 3 + 2] = chosenColor.b
    }

    return [pos, col]
  }, [count])

  // Gentle subtle vertical drift
  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.015
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        vertexColors
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}
