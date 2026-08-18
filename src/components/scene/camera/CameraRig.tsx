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
      // Master ScrollTrigger timeline spanning the entire 3D journey (0 to 20 units)
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2, // Smooth inertial scrub
          invalidateOnRefresh: true,
        },
      })

      // ==========================================
      // ACT I: SPACE & EARTH PHASES (0 -> 10 units)
      // ==========================================

      // Phase 1: Deep Space (0 -> 2 units)
      tl.to(
        camState.current,
        {
          x: 0,
          y: 0.3,
          z: 8.5 * mult,
          targetX: 0,
          targetY: 0,
          targetZ: 0,
          fov: baseFov - 1,
          ease: 'power1.inOut',
          duration: 2,
        },
        0
      )

      // Phase 2: Approach (2 -> 4.5 units)
      tl.to(
        camState.current,
        {
          x: 0.8 * (isMobile ? 0.4 : 1.0),
          y: 0.35,
          z: 4.8 * mult,
          targetX: 0.1,
          targetY: 0,
          targetZ: 0,
          fov: baseFov - 2,
          ease: 'power1.inOut',
          duration: 2.5,
        },
        2
      )

      // Phase 3: Orbital Flyby (4.5 -> 7 units)
      tl.to(
        camState.current,
        {
          x: 2.3 * (isMobile ? 0.6 : 1.0),
          y: 0.25,
          z: 3.2 * mult,
          targetX: -0.15 * (isMobile ? 0.5 : 1.0),
          targetY: 0.0,
          targetZ: 0,
          fov: baseFov - 4,
          ease: 'power2.inOut',
          duration: 2.5,
        },
        4.5
      )

      // Phase 4: Planetary Approach (7 -> 9 units)
      tl.to(
        camState.current,
        {
          x: 2.0 * (isMobile ? 0.5 : 1.0),
          y: -0.12,
          z: 2.3 * mult,
          targetX: -0.35 * (isMobile ? 0.5 : 1.0),
          targetY: 0.04,
          targetZ: 0,
          fov: baseFov - 5,
          ease: 'power2.inOut',
          duration: 2,
        },
        7
      )

      // Phase 5: Terminal Earth Position (9 -> 10 units)
      tl.to(
        camState.current,
        {
          x: 1.75 * (isMobile ? 0.45 : 1.0),
          y: 0.0,
          z: 2.45 * mult,
          targetX: -0.45 * (isMobile ? 0.5 : 1.0),
          targetY: 0.0,
          targetZ: 0,
          fov: baseFov - 4,
          ease: 'power1.out',
          duration: 1,
        },
        9
      )

      // ========================================================
      // ACT II: ATMOSPHERIC DIVE & DIGITAL SPACE (10 -> 20 units)
      // ========================================================

      // Phase 6: Atmospheric Dive & Digital Ingress (10 -> 12.5 units)
      // Camera moves through the horizon and dives into the digital coordinates
      tl.to(
        camState.current,
        {
          x: 0.2,
          y: -22.0,
          z: -38.0,
          targetX: 0.0,
          targetY: -26.0,
          targetZ: -50.0,
          fov: baseFov - 3,
          ease: 'power2.inOut',
          duration: 2.5,
        },
        10
      )

      // Phase 7: WORK Introduction (12.5 -> 14.5 units)
      // Smooth descent offering a wide overview of the digital workspace
      tl.to(
        camState.current,
        {
          x: 0.0,
          y: -25.5,
          z: -43.0,
          targetX: -0.5,
          targetY: -27.5,
          targetZ: -54.0,
          fov: baseFov - 3,
          ease: 'power1.inOut',
          duration: 2,
        },
        12.5
      )

      // Phase 8: Project 01 — NEXUS OS (14.5 -> 16.5 units)
      // Dedicated angled hero composition for Project 01
      tl.to(
        camState.current,
        {
          x: isMobile ? -1.8 : -0.6,
          y: -28.0,
          z: isMobile ? -45.5 : -47.8,
          targetX: -2.5,
          targetY: -28.0,
          targetZ: -52.0,
          fov: baseFov - 4,
          ease: 'power2.inOut',
          duration: 2,
        },
        14.5
      )

      // Phase 9: Project 02 — AETHER ENGINE (16.5 -> 18.5 units)
      // Sweeps upward and across into Project 02 composition
      tl.to(
        camState.current,
        {
          x: isMobile ? 2.0 : 1.2,
          y: -34.8,
          z: isMobile ? -61.0 : -63.5,
          targetX: 2.8,
          targetY: -35.0,
          targetZ: -68.0,
          fov: baseFov - 4,
          ease: 'power2.inOut',
          duration: 2,
        },
        16.5
      )

      // Phase 10: Project 03 — SYNAPSE PROTOCOL (18.5 -> 20 units)
      // Traverses diagonally to establish Project 03 composition
      tl.to(
        camState.current,
        {
          x: isMobile ? -0.5 : -0.7,
          y: -42.8,
          z: isMobile ? -77.5 : -79.6,
          targetX: -0.5,
          targetY: -43.0,
          targetZ: -84.0,
          fov: baseFov - 4,
          ease: 'power2.inOut',
          duration: 1.5,
        },
        18.5
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
