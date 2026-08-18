import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function createPrng(seed = 1337) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

export function DataParticles({ count = 500 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points>(null!)

  const [positions, colors] = useMemo(() => {
    const random = createPrng(42)
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)

    const colorCyan = new THREE.Color('#38bdf8') // Soft cyan
    const colorWhite = new THREE.Color('#e2e8f0') // Soft white
    const colorMuted = new THREE.Color('#64748b') // Muted gray

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (random() - 0.5) * 44
      pos[i * 3 + 1] = -22 - random() * 28
      pos[i * 3 + 2] = -42 - random() * 52

      const randVal = random()
      const chosenColor = randVal > 0.65 ? colorCyan : randVal > 0.35 ? colorWhite : colorMuted
      col[i * 3 + 0] = chosenColor.r
      col[i * 3 + 1] = chosenColor.g
      col[i * 3 + 2] = chosenColor.b
    }

    return [pos, col]
  }, [count])

  // Gentle subtle vertical drift
  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.012
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
        size={0.045}
        vertexColors
        transparent
        opacity={0.48}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}
