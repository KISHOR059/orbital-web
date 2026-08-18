import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { EarthSurface } from './EarthSurface'
import { EarthClouds } from './EarthClouds'
import { EarthAtmosphere } from './EarthAtmosphere'
import { EarthInterior } from '../earth-interior/EarthInterior'
import { Humanity } from '../humanity/Humanity'

gsap.registerPlugin(ScrollTrigger)

export interface EarthProps {
  scrollTriggerElement?: HTMLElement | string | null
}

export function Earth({ scrollTriggerElement }: EarthProps) {
  const userRotationGroupRef = useRef<THREE.Group>(null!)

  // Fixed celestial sun position matching key directional light
  const sunPosition = useMemo(() => new THREE.Vector3(6, 2.5, 4.5), [])

  // Earth's natural axial tilt (~23.44 degrees)
  const axialTilt = THREE.MathUtils.degToRad(23.44)

  // Track if we are currently in the Earth Interior scroll window
  const isInteriorActive = useRef(false)

  // Drag interaction state refs (zero React re-renders)
  const isDragging = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const targetRotation = useRef({ x: 0, y: 0 })
  const currentRotation = useRef({ x: 0, y: 0 })

  // Vertical tilt constraints (+/- 30 degrees)
  const maxPitch = THREE.MathUtils.degToRad(30)

  useLayoutEffect(() => {
    const trigger = scrollTriggerElement || '#scroll-track'

    const st = ScrollTrigger.create({
      trigger: trigger,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const p = self.progress
        // Earth Interior is active between progress 0.30 and 0.68
        isInteriorActive.current = p >= 0.30 && p <= 0.68
      },
    })

    return () => {
      st.kill()
    }
  }, [scrollTriggerElement])

  // Organic, frame-rate independent celestial rotation with long-period micro-variation
  useFrame(({ clock }, delta) => {
    if (!userRotationGroupRef.current) return

    if (!isDragging.current) {
      // Natural organic rotation rate (~0.011 rad/s base with subtle long-period variation)
      const organicSpeed = 0.011 + Math.sin(clock.elapsedTime * 0.05) * 0.0012
      targetRotation.current.y += delta * organicSpeed

      // Momentum inertia decay with friction
      targetRotation.current.y += velocity.current.x
      targetRotation.current.x += velocity.current.y

      velocity.current.x *= 0.92
      velocity.current.y *= 0.92
    }

    // Clamp vertical pitch within astronomical comfort limits
    targetRotation.current.x = THREE.MathUtils.clamp(
      targetRotation.current.x,
      -maxPitch,
      maxPitch
    )

    // Smooth lerp damping
    const lerpFactor = Math.min(1, delta * 10)
    currentRotation.current.x = THREE.MathUtils.lerp(
      currentRotation.current.x,
      targetRotation.current.x,
      lerpFactor
    )
    currentRotation.current.y = THREE.MathUtils.lerp(
      currentRotation.current.y,
      targetRotation.current.y,
      lerpFactor
    )

    userRotationGroupRef.current.rotation.x = currentRotation.current.x
    userRotationGroupRef.current.rotation.y = currentRotation.current.y
  })

  // Pointer Event Handlers for Left-Click Drag Interaction on Exterior Earth
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    // If Interior phase is active, do NOT intercept or stop propagation; let EarthInterior handle it
    if (isInteriorActive.current) return

    // Only accept desktop left mouse button (e.button === 0 and pointerType === 'mouse')
    if (e.pointerType !== 'mouse' || e.button !== 0) return

    e.stopPropagation()
    isDragging.current = true
    lastPointer.current = { x: e.clientX, y: e.clientY }
    velocity.current = { x: 0, y: 0 }

    const domElement = (e.nativeEvent.target as HTMLElement)
    domElement.setPointerCapture?.(e.pointerId)
  }

  const handlePointerMove = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) return

    const deltaX = e.clientX - lastPointer.current.x
    const deltaY = e.clientY - lastPointer.current.y
    lastPointer.current = { x: e.clientX, y: e.clientY }

    const sensX = 0.007
    const sensY = 0.004

    targetRotation.current.y += deltaX * sensX
    targetRotation.current.x += deltaY * sensY

    velocity.current = {
      x: deltaX * sensX,
      y: deltaY * sensY,
    }
  }

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    if (!isDragging.current) return
    isDragging.current = false

    const domElement = (e.nativeEvent.target as HTMLElement)
    domElement.releasePointerCapture?.(e.pointerId)
  }

  return (
    <group rotation={[0, 0, axialTilt]}>
      <group ref={userRotationGroupRef}>
        {/* Core Planetary Surface (Locked) */}
        <EarthSurface />

        {/* Dedicated 3D Concentric Earth Interior: Crust, Mantle, Core */}
        <EarthInterior scrollTriggerElement={scrollTriggerElement} />

        {/* Independent Dynamic Cloud Layer (Locked) */}
        <EarthClouds radius={2.004} />

        {/* Cinematic Atmospheric Rayleigh Glow (Locked) */}
        <EarthAtmosphere radius={2.008} sunPosition={sunPosition} />

        {/* Subtle Signs of Human Civilization & Cities */}
        <Humanity radius={2.008} scrollTriggerElement={scrollTriggerElement} />

        {/* Interactive Desktop Drag Hit Sphere for Exterior Earth */}
        <mesh
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <sphereGeometry args={[2.08, 32, 32]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
      </group>
    </group>
  )
}
