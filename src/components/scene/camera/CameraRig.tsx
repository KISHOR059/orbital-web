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
      // Master ScrollTrigger timeline spanning Deep Space -> Earth -> Humanity -> Technology -> About -> Contact (0 to 20 units)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2, // Smooth inertial scrub
          invalidateOnRefresh: true,
        },
      })

      // 1. STAGE 01: Deep Space (0 -> 2 units)
      tl.to(
        camState.current,
        {
          x: 0,
          y: 0.38,
          z: 9.0 * mult,
          targetX: 0,
          targetY: 0,
          targetZ: 0,
          fov: baseFov - 1,
          ease: 'power1.inOut',
          duration: 2.0,
        },
        0
      )

      // 2. STAGE 02: One World (2 -> 4 units)
      tl.to(
        camState.current,
        {
          x: 0.9 * (isMobile ? 0.45 : 1.0),
          y: 0.32,
          z: 5.8 * mult,
          targetX: 0.05,
          targetY: 0,
          targetZ: 0,
          fov: baseFov - 2,
          ease: 'power1.inOut',
          duration: 2.0,
        },
        2.0
      )

      // 3. STAGE 03: Countless Stories (4 -> 6 units)
      tl.to(
        camState.current,
        {
          x: 1.5 * (isMobile ? 0.5 : 1.0),
          y: 0.22,
          z: 3.8 * mult,
          targetX: -0.12 * (isMobile ? 0.5 : 1.0),
          targetY: 0.02,
          targetZ: 0,
          fov: baseFov - 3,
          ease: 'power2.inOut',
          duration: 2.0,
        },
        4.0
      )

      // 4. STAGE 04: Humanity & Civilization Network (6 -> 8 units)
      tl.to(
        camState.current,
        {
          x: 1.85 * (isMobile ? 0.45 : 1.0),
          y: 0.06,
          z: 2.65 * mult,
          targetX: -0.38 * (isMobile ? 0.5 : 1.0),
          targetY: 0.02,
          targetZ: 0,
          fov: baseFov - 4,
          ease: 'power2.out',
          duration: 2.0,
        },
        6.0
      )

      // 5. STAGE 05: Ideas Move / Network Flow (8 -> 10 units)
      tl.to(
        camState.current,
        {
          x: 1.7 * (isMobile ? 0.45 : 1.0),
          y: -0.05,
          z: 2.35 * mult,
          targetX: -0.42 * (isMobile ? 0.5 : 1.0),
          targetY: 0.01,
          targetZ: 0,
          fov: baseFov - 4,
          ease: 'power1.inOut',
          duration: 2.0,
        },
        8.0
      )

      // 6. STAGE 06: Data Flows / Descent past Earth into Digital Space (10 -> 12 units)
      tl.to(
        camState.current,
        {
          x: 0.3,
          y: -12.0,
          z: -16.0,
          targetX: 0.0,
          targetY: -18.0,
          targetZ: -32.0,
          fov: baseFov - 3,
          ease: 'power2.in',
          duration: 1.0,
        },
        10.0
      )
      tl.to(
        camState.current,
        {
          x: 0.0,
          y: -25.0,
          z: -42.0,
          targetX: 0.0,
          targetY: -28.0,
          targetZ: -55.0,
          fov: baseFov - 3,
          ease: 'power2.out',
          duration: 1.0,
        },
        11.0
      )

      // 7. STAGE 07: Technology Brings It Together (12 -> 14 units)
      tl.to(
        camState.current,
        {
          x: 0.0,
          y: -26.0,
          z: -45.0,
          targetX: 0.0,
          targetY: -28.5,
          targetZ: -60.0,
          fov: baseFov - 3,
          ease: 'power1.inOut',
          duration: 2.0,
        },
        12.0
      )

      // 8. STAGE 08: About Me (14 -> 17 units)
      tl.to(
        camState.current,
        {
          x: isMobile ? 0.0 : -0.8,
          y: -38.0,
          z: -69.5 * mult,
          targetX: isMobile ? 0.0 : 0.8,
          targetY: -38.0,
          targetZ: -75.0,
          fov: baseFov - 3,
          ease: 'power2.inOut',
          duration: 3.0,
        },
        14.0
      )

      // 9. STAGE 09: Contact / Final Calm Settled Composition (17 -> 20 units)
      tl.to(
        camState.current,
        {
          x: 0.0,
          y: -38.0,
          z: -78.0 * mult,
          targetX: 0.0,
          targetY: -38.0,
          targetZ: -84.0,
          fov: baseFov - 3,
          ease: 'power2.out',
          duration: 3.0,
        },
        17.0
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
