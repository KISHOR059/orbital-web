import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface EarthInteriorProps {
  scrollTriggerElement?: HTMLElement | string | null
}

export function EarthInterior({ scrollTriggerElement }: EarthInteriorProps) {
  const interiorGroupRef = useRef<THREE.Group>(null!)
  const interiorRotationGroupRef = useRef<THREE.Group>(null!)
  const cutawayWedgeRef = useRef<THREE.Group>(null!)
  const coreMeshRef = useRef<THREE.Mesh>(null!)
  const mantleMeshRef = useRef<THREE.Mesh>(null!)
  const crustMeshRef = useRef<THREE.Mesh>(null!)

  // Normalized scroll-driven lifecycle states
  const crustProgress = useRef(0)
  const mantleProgress = useRef(0)
  const coreProgress = useRef(0)
  const cutawaySeparation = useRef(0)
  const overallVisibility = useRef(0)

  // Drag interaction state refs (zero React re-renders)
  const isDragging = useRef(false)
  const lastPointer = useRef({ x: 0, y: 0 })
  const velocity = useRef({ x: 0, y: 0 })
  const targetRotation = useRef({ x: 0, y: 0 })
  const currentRotation = useRef({ x: 0, y: 0 })

  // Vertical pitch limit (+/- 30 degrees)
  const maxPitch = THREE.MathUtils.degToRad(30)

  useLayoutEffect(() => {
    const trigger = scrollTriggerElement || '#scroll-track'

    // Long, slow, cinematic Earth Interior scroll progression spanning 0.30 to 0.68 of the page
    const st = ScrollTrigger.create({
      trigger: trigger,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const p = self.progress

        // Check if within Earth Interior window (0.30 to 0.68)
        if (p < 0.30 || p > 0.68) {
          overallVisibility.current = 0
          crustProgress.current = 0
          mantleProgress.current = 0
          coreProgress.current = 0
          cutawaySeparation.current = 0
          return
        }

        // 1. Overall interior visibility
        if (p >= 0.30 && p < 0.36) {
          overallVisibility.current = (p - 0.30) / 0.06 // Smooth fade in
        } else if (p <= 0.62) {
          overallVisibility.current = 1.0 // Full visibility throughout interior journey
        } else {
          overallVisibility.current = 1.0 - (p - 0.62) / 0.06 // Smooth dissolve into technology
        }

        // 2. LAYER 1 — CRUST (0.30 -> 0.40)
        crustProgress.current = THREE.MathUtils.clamp((p - 0.30) / 0.10, 0, 1)

        // 3. LAYER 2 — MANTLE (0.36 -> 0.54: largest scroll allocation)
        mantleProgress.current = THREE.MathUtils.clamp((p - 0.36) / 0.18, 0, 1)

        // 4. LAYER 3 — CORE (0.50 -> 0.62: gradual appearance and cinematic hold)
        coreProgress.current = THREE.MathUtils.clamp((p - 0.50) / 0.12, 0, 1)

        // 5. PHYSICAL CUTAWAY WEDGE SEPARATION (0.32 -> 0.58)
        const sepP = THREE.MathUtils.clamp((p - 0.32) / 0.26, 0, 1)
        cutawaySeparation.current = sepP * 0.32
      },
    })

    return () => {
      st.kill()
    }
  }, [scrollTriggerElement])

  // Concentric 3D Spherical Geometries (Scientific Relative Proportions)
  // Crust: extremely thin outer shell (1.98 to 2.00)
  // Mantle: vast intermediate shell (0.70 to 1.95)
  // Core: centered incandescent sphere (0.0 to 0.70)
  const { coreGeom, mantleGeom, crustGeom, wedgeCrustGeom, wedgeMantleGeom } = useMemo(() => {
    const cutAngle = Math.PI * 1.5 // 270 degree cross-section for base planet
    const wedgeAngle = Math.PI * 0.5 // 90 degree wedge section for separation

    const core = new THREE.SphereGeometry(0.70, 48, 48) // Concentric Core
    const mantle = new THREE.SphereGeometry(1.94, 48, 48, 0, cutAngle, 0, Math.PI)
    const crust = new THREE.SphereGeometry(1.995, 48, 48, 0, cutAngle, 0, Math.PI)

    // 90-degree separated cutaway wedge
    const wMantle = new THREE.SphereGeometry(1.94, 32, 32, cutAngle, wedgeAngle, 0, Math.PI)
    const wCrust = new THREE.SphereGeometry(1.995, 32, 32, cutAngle, wedgeAngle, 0, Math.PI)

    return {
      coreGeom: core,
      mantleGeom: mantle,
      crustGeom: crust,
      wedgeCrustGeom: wCrust,
      wedgeMantleGeom: wMantle,
    }
  }, [])

  // Frame loop: tightly scrubbed layer progression, manual rotation damping & inertia
  useFrame(({ clock }, delta) => {
    if (!interiorGroupRef.current) return

    const vis = overallVisibility.current
    interiorGroupRef.current.visible = vis > 0.005

    if (interiorGroupRef.current.visible) {
      // 1. Manual user rotation physics & inertia damping
      if (!isDragging.current) {
        targetRotation.current.y += velocity.current.x
        targetRotation.current.x += velocity.current.y

        velocity.current.x *= 0.92
        velocity.current.y *= 0.92
      }

      // Clamp vertical pitch within safe geological limits
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

      if (interiorRotationGroupRef.current) {
        interiorRotationGroupRef.current.rotation.x = currentRotation.current.x
        interiorRotationGroupRef.current.rotation.y = currentRotation.current.y
      }

      // 2. Physical 3D Cutaway Wedge Separation
      if (cutawayWedgeRef.current) {
        const sep = cutawaySeparation.current
        cutawayWedgeRef.current.position.set(sep * 0.7, sep * 0.35, sep * 0.62)
      }

      // 3. CRUST: Dark brown / copper / burnt orange outer ring
      if (crustMeshRef.current) {
        const mat = crustMeshRef.current.material as THREE.MeshStandardMaterial
        mat.opacity = crustProgress.current * vis * 0.95
      }

      // 4. MANTLE: Deep orange-red / dark terracotta vast intermediate body
      if (mantleMeshRef.current) {
        const mat = mantleMeshRef.current.material as THREE.MeshStandardMaterial
        mat.opacity = mantleProgress.current * vis * 0.98
      }

      // 5. CORE: Bright warm orange / golden yellow incandescent center
      if (coreMeshRef.current) {
        const mat = coreMeshRef.current.material as THREE.MeshStandardMaterial
        const coreAlpha = coreProgress.current * vis
        mat.opacity = coreAlpha
        mat.emissiveIntensity = (0.85 + Math.sin(clock.elapsedTime * 1.5) * 0.1) * coreAlpha
      }
    }
  })

  // Pointer Event Handlers for Left-Click Drag on Earth Interior
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    // Only accept desktop left mouse button when Earth Interior is actively visible
    if (e.pointerType !== 'mouse' || e.button !== 0 || overallVisibility.current < 0.15) return

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
    <group ref={interiorGroupRef} name="earth-interior-cutaway">
      {/* Parent rotation group rotating all concentric layers together */}
      <group ref={interiorRotationGroupRef}>
        {/* 1. Concentric Core (Bright warm orange / golden yellow with radiant emission) */}
        <mesh ref={coreMeshRef} geometry={coreGeom}>
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#f59e0b"
            emissiveIntensity={0.85}
            roughness={0.3}
            metalness={0.25}
            transparent
            opacity={0}
          />
        </mesh>

        {/* 2. Main 270° Mantle Body (Deep orange-red / dark terracotta) */}
        <mesh ref={mantleMeshRef} geometry={mantleGeom}>
          <meshStandardMaterial
            color="#c2410c"
            emissive="#7c2d12"
            emissiveIntensity={0.25}
            roughness={0.7}
            metalness={0.1}
            side={THREE.DoubleSide}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>

        {/* 3. Main 270° Thin Crust Ring (Dark brown / copper / burnt orange) */}
        <mesh ref={crustMeshRef} geometry={crustGeom}>
          <meshStandardMaterial
            color="#78350f"
            emissive="#451a03"
            emissiveIntensity={0.15}
            roughness={0.85}
            metalness={0.15}
            side={THREE.DoubleSide}
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>

        {/* Separating 90° Cutaway Wedge Section */}
        <group ref={cutawayWedgeRef}>
          <mesh geometry={wedgeMantleGeom}>
            <meshStandardMaterial
              color="#c2410c"
              emissive="#7c2d12"
              emissiveIntensity={0.25}
              roughness={0.7}
              metalness={0.1}
              side={THREE.DoubleSide}
              transparent
              opacity={0.85}
              depthWrite={false}
            />
          </mesh>
          <mesh geometry={wedgeCrustGeom}>
            <meshStandardMaterial
              color="#78350f"
              emissive="#451a03"
              emissiveIntensity={0.15}
              roughness={0.85}
              metalness={0.15}
              side={THREE.DoubleSide}
              transparent
              opacity={0.85}
              depthWrite={false}
            />
          </mesh>
        </group>

        {/* Interactive Desktop Drag Hit Sphere for Earth Interior */}
        <mesh
          visible={false}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <sphereGeometry args={[2.05, 32, 32]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>
    </group>
  )
}
