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

  // Pre-allocated persistent vectors for zero GC overhead during frame loops
  const currentPos = useRef(new THREE.Vector3(0, 0.4, 13.5 * distanceMultiplier))
  const currentTarget = useRef(new THREE.Vector3(0, 0, 0))

  useLayoutEffect(() => {
    const trigger = scrollTriggerElement || '#scroll-track'
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
      // Master ScrollTrigger timeline spanning all narrative phases (0 to 20 units)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2, // Silk-smooth inertial scrub
          invalidateOnRefresh: true,
        },
      })

      // 1. STAGE 01: Deep Space (0 -> 2 units) - Floating distant perspective
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

      // 2. STAGE 02: One World (2 -> 4 units) - Cinematic lateral orbital glide
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
          ease: 'power2.inOut',
          duration: 2.0,
        },
        2.0
      )

      // 3. STAGE 03: Countless Stories (4 -> 5.5 units) - Sweeping closer to planetary limb
      tl.to(
        camState.current,
        {
          x: 1.4 * (isMobile ? 0.5 : 1.0),
          y: 0.22,
          z: 3.8 * mult,
          targetX: -0.12 * (isMobile ? 0.5 : 1.0),
          targetY: 0.02,
          targetZ: 0,
          fov: baseFov - 3,
          ease: 'power2.inOut',
          duration: 1.5,
        },
        4.0
      )

      // 4. STAGE 04: Humanity (5.5 -> 7.0 units) - Intimate view of global civilization
      tl.to(
        camState.current,
        {
          x: 1.65 * (isMobile ? 0.45 : 1.0),
          y: 0.12,
          z: 2.75 * mult,
          targetX: -0.25 * (isMobile ? 0.5 : 1.0),
          targetY: 0.02,
          targetZ: 0,
          fov: baseFov - 3,
          ease: 'power2.out',
          duration: 1.5,
        },
        5.5
      )

      // 5. STAGE 05 & 06: SLOW CINEMATIC EARTH INTERIOR REVEAL (7.0 -> 13.0 units)
      // Phase A: Slow approach & Crust reveal (7.0 -> 8.8)
      tl.to(
        camState.current,
        {
          x: 0.85 * (isMobile ? 0.4 : 0.85),
          y: 0.16,
          z: 2.25 * mult,
          targetX: 0.0,
          targetY: 0.0,
          targetZ: 0.0,
          fov: baseFov - 4,
          ease: 'power2.inOut',
          duration: 1.8,
        },
        7.0
      )

      // Phase B: Slow, expansive Mantle exploration (8.8 -> 11.2)
      tl.to(
        camState.current,
        {
          x: 0.35 * (isMobile ? 0.2 : 0.35),
          y: 0.06,
          z: 1.85 * mult,
          targetX: 0.0,
          targetY: 0.02,
          targetZ: 0.0,
          fov: baseFov - 3,
          ease: 'power1.inOut',
          duration: 2.4,
        },
        8.8
      )

      // Phase C: Core reveal & framing (11.2 -> 12.4)
      tl.to(
        camState.current,
        {
          x: 0.0,
          y: -0.02,
          z: 1.55 * mult,
          targetX: 0.0,
          targetY: 0.04,
          targetZ: 0.0,
          fov: baseFov - 3,
          ease: 'power2.out',
          duration: 1.2,
        },
        11.2
      )

      // Phase D: Core cinematic hold / settle (12.4 -> 13.2)
      tl.to(
        camState.current,
        {
          x: 0.0,
          y: -0.02,
          z: 1.55 * mult,
          targetX: 0.0,
          targetY: 0.04,
          targetZ: 0.0,
          fov: baseFov - 3,
          ease: 'none',
          duration: 0.8,
        },
        12.4
      )

      // Transition from Core into Digital Space (13.2 -> 14.2)
      tl.to(
        camState.current,
        {
          x: 0.0,
          y: -22.0,
          z: -38.0,
          targetX: 0.0,
          targetY: -26.0,
          targetZ: -50.0,
          fov: baseFov - 3,
          ease: 'power2.in',
          duration: 1.0,
        },
        13.2
      )

      // 6. STAGE 07: Technology (14.2 -> 16.0 units) - Deep atmospheric digital coordinate plane
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
          ease: 'power2.inOut',
          duration: 1.8,
        },
        14.2
      )

      // 7. STAGE 08: About Me (16.0 -> 18.2 units) - Deceleration beside Identity Object
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
          duration: 2.2,
        },
        16.0
      )

      // 8. STAGE 09: Contact (18.2 -> 20.0 units) - Serene finale settling
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
          duration: 1.8,
        },
        18.2
      )
    })

    return () => {
      ctx.revert()
    }
  }, [scrollTriggerElement, distanceMultiplier, isMobile])

  // Frame loop: smooth damping with lookAt targeting and zero per-frame garbage collection
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
