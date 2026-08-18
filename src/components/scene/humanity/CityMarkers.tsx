import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CITIES, latLonToVector3 } from '../../../utils/geo'

gsap.registerPlugin(ScrollTrigger)

export interface CityMarkersProps {
  radius?: number
  scrollTriggerElement?: HTMLElement | string | null
}

export function CityMarkers({ radius = 2.008, scrollTriggerElement }: CityMarkersProps) {
  const pointsRef = useRef<THREE.Points>(null!)
  const markerOpacity = useRef(0)

  // Smooth scroll-driven entrance during Humanity narrative phase
  useLayoutEffect(() => {
    const trigger = scrollTriggerElement || '#scroll-track'

    const st = ScrollTrigger.create({
      trigger: trigger,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const rawP = self.progress
        // Markers smoothly fade in during Earth Approach (0.15) and reach full subtle presence by Humanity (0.30)
        // They remain visible through Earth & Humanity until descent into Technology (> 0.55)
        let opacity = 0
        if (rawP >= 0.15 && rawP <= 0.60) {
          if (rawP < 0.30) {
            opacity = (rawP - 0.15) / 0.15 // Fade in
          } else if (rawP <= 0.52) {
            opacity = 1.0 // Fully settled subtle state
          } else {
            opacity = 1.0 - (rawP - 0.52) / 0.08 // Fade out as camera descends into digital world
          }
        }
        markerOpacity.current = THREE.MathUtils.clamp(opacity * 0.72, 0, 0.72)
      },
    })

    return () => {
      st.kill()
    }
  }, [scrollTriggerElement])

  // Precision Cartesian mapping for major global cities
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(CITIES.length * 3)
    const col = new Float32Array(CITIES.length * 3)

    const colorCyan = new THREE.Color('#38bdf8')
    const colorWhite = new THREE.Color('#f8fafc')

    CITIES.forEach((city, i) => {
      const vec = latLonToVector3(city.lat, city.lon, radius)
      pos[i * 3 + 0] = vec.x
      pos[i * 3 + 1] = vec.y
      pos[i * 3 + 2] = vec.z

      const chosen = city.tier === 1 ? colorWhite : colorCyan
      col[i * 3 + 0] = chosen.r
      col[i * 3 + 1] = chosen.g
      col[i * 3 + 2] = chosen.b
    })

    return { positions: pos, colors: col }
  }, [radius])

  // Frame loop: updates settled opacity without allocation
  useFrame(() => {
    if (pointsRef.current) {
      const mat = pointsRef.current.material as THREE.PointsMaterial
      mat.opacity = markerOpacity.current
      pointsRef.current.visible = markerOpacity.current > 0.005
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.026}
        vertexColors
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}
