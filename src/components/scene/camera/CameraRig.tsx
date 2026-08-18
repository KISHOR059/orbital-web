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
  const distanceMultiplier = isMobile ? 1.4 : isTablet ? 1.18 : 1.0

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
    // Determine the trigger target
    const trigger = scrollTriggerElement || document.body

    const mult = distanceMultiplier
    const baseFov = isMobile ? 46 : 40

    // Set initial coordinates
    camState.current.x = 0
    camState.current.y = 0.4
    camState.current.z = 13.5 * mult
    camState.current.targetX = 0
    camState.current.targetY = 0
    camState.current.targetZ = 0
    camState.current.fov = baseFov

    const ctx = gsap.context(() => {
      // Build master ScrollTrigger timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.2, // Smooth inertial scrub
          invalidateOnRefresh: true,
        },
      })

      // Phase 1: Deep Space (0% -> 20%)
      // Earth starts distant and slowly glides into focus
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

      // Phase 2: Approach (20% -> 45%)
      // Camera moves closer, Earth grows significantly in frame
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

      // Phase 3: Orbital Flyby (45% -> 70%)
      // Lateral sweeping orbital trajectory around the terminator
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

      // Phase 4: Planetary Approach (70% -> 90%)
      // Close approach near the illuminated limb & atmospheric rim
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

      // Phase 5: Final Position (90% -> 100%)
      // Settles into a calm, cinematic heroic composition framing the space
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
    })

    return () => {
      ctx.revert() // 100% clean teardown on unmount / HMR
    }
  }, [scrollTriggerElement, distanceMultiplier, isMobile])

  // Frame loop: smooth interpolation and robust lookAt targeting
  useFrame((_, delta) => {
    if (!cameraRef.current) return

    // Dynamic smoothing factor
    const damping = Math.min(1, delta * 6.5)

    // Smooth position interpolation
    currentPos.current.x += (camState.current.x - currentPos.current.x) * damping
    currentPos.current.y += (camState.current.y - currentPos.current.y) * damping
    currentPos.current.z += (camState.current.z - currentPos.current.z) * damping

    // Smooth target interpolation
    currentTarget.current.x += (camState.current.targetX - currentTarget.current.x) * damping
    currentTarget.current.y += (camState.current.targetY - currentTarget.current.y) * damping
    currentTarget.current.z += (camState.current.targetZ - currentTarget.current.z) * damping

    // Apply to camera
    cameraRef.current.position.copy(currentPos.current)
    cameraRef.current.lookAt(currentTarget.current)

    // Update FOV if altered
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
