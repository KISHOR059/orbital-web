import { useLayoutEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface CameraRigProps {
  scrollTriggerElement?: HTMLElement | string | null
}

export function CameraRig({ scrollTriggerElement }: CameraRigProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null!)
  const { size } = useThree()

  // Responsive scale factor (desktop vs tablet vs mobile)
  const isMobile = size.width < 768
  const isTablet = size.width >= 768 && size.width < 1024
  const distanceMultiplier = isMobile ? 1.35 : isTablet ? 1.15 : 1.0

  // Animated camera coordinate state proxy
  const camState = useRef({
    x: 0,
    y: 0.4,
    z: 13.5 * distanceMultiplier,
    targetX: 0,
    targetY: 0,
    targetZ: 0,
    fov: isMobile ? 46 : 40,
  })

  // Current interpolated values for silky smooth damping
  const currentPos = useRef(new THREE.Vector3(0, 0.4, 13.5 * distanceMultiplier))
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0))

  useLayoutEffect(() => {
    const trigger = scrollTriggerElement || document.body
    const mult = distanceMultiplier
    const baseFov = isMobile ? 46 : 40

    // Initialize coordinates
    camState.current.x = 0
    camState.current.y = 0.4
    camState.current.z = 13.5 * mult
    camState.current.targetX = 0
    camState.current.targetY = 0
    camState.current.targetZ = 0
    camState.current.fov = baseFov

    const ctx = gsap.context(() => {
      // Master ScrollTrigger timeline spanning Space -> Earth -> Humanity (0 to 10 units)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2, // Smooth inertial scrub
          invalidateOnRefresh: true,
        },
      })

      // STAGE 01: Deep Space (0 -> 3.2 units)
      tl.to(
        camState.current,
        {
          x: 0,
          y: 0.35,
          z: 7.8 * mult,
          targetX: 0,
          targetY: 0,
          targetZ: 0,
          fov: baseFov - 1,
          ease: 'power1.inOut',
          duration: 3.2,
        },
        0
      )

      // STAGE 02: Earth Approach & Orbital Sweep (3.2 -> 6.5 units)
      tl.to(
        camState.current,
        {
          x: 1.4 * (isMobile ? 0.5 : 1.0),
          y: 0.28,
          z: 4.2 * mult,
          targetX: 0.1,
          targetY: 0,
          targetZ: 0,
          fov: baseFov - 2,
          ease: 'power1.inOut',
          duration: 3.3,
        },
        3.2
      )

      // STAGE 03: Humanity & Geographic Visualization (6.5 -> 10.0 units)
      tl.to(
        camState.current,
        {
          x: 1.85 * (isMobile ? 0.45 : 1.0),
          y: 0.05,
          z: 2.55 * mult,
          targetX: -0.38 * (isMobile ? 0.5 : 1.0),
          targetY: 0.02,
          targetZ: 0,
          fov: baseFov - 4,
          ease: 'power2.out',
          duration: 3.5,
        },
        6.5
      )
    })

    return () => {
      ctx.revert()
    }
  }, [scrollTriggerElement, distanceMultiplier, isMobile])

  // Frame loop: smooth interpolation and robust lookAt targeting
  useFrame((_, delta) => {
    if (!cameraRef.current) return

    const damping = Math.min(1, delta * 6.5)

    // Smooth position interpolation
    currentPos.current.x += (camState.current.x - currentPos.current.x) * damping
    currentPos.current.y += (camState.current.y - currentPos.current.y) * damping
    currentPos.current.z += (camState.current.z - currentPos.current.z) * damping

    // Smooth target interpolation
    currentTarget.current.x += (camState.current.targetX - currentTarget.current.x) * damping
    currentTarget.current.y += (camState.current.targetY - currentTarget.current.y) * damping
    currentTarget.current.z += (camState.current.targetZ - currentTarget.current.z) * damping

    cameraRef.current.position.copy(currentPos.current)
    cameraRef.current.lookAt(currentTarget.current)

    if (Math.abs(cameraRef.current.fov - camState.current.fov) > 0.01) {
      cameraRef.current.fov += (camState.current.fov - cameraRef.current.fov) * damping
      cameraRef.current.updateProjectionMatrix()
    }
  })

  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault
      position={[0, 0.4, 13.5 * distanceMultiplier]}
      fov={isMobile ? 46 : 40}
      near={0.1}
      far={1000}
    />
  )
}
