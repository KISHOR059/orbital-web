import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface HeroContentProps {
  scrollTriggerElement?: HTMLElement | string | null
}

export function HeroContent({ scrollTriggerElement = '#scroll-track' }: HeroContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const phase1Ref = useRef<HTMLDivElement>(null)
  const phase2Ref = useRef<HTMLDivElement>(null)
  const phase3Ref = useRef<HTMLDivElement>(null)
  const phase4Ref = useRef<HTMLDivElement>(null)
  const phase5Ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const trigger = scrollTriggerElement || '#scroll-track'

    const ctx = gsap.context(() => {
      // Initialize starting visual states
      gsap.set(phase1Ref.current, { opacity: 1, y: 0, scale: 1 })
      gsap.set([phase2Ref.current, phase3Ref.current, phase4Ref.current, phase5Ref.current], {
        opacity: 0,
        y: 40,
        scale: 0.96,
      })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.0,
          invalidateOnRefresh: true,
        },
      })

      // Timeline mapping matches the 5-phase camera rig (Total duration = 10 units):

      // --- PHASE 1 (0 -> 2 units | 0% - 20%) ---
      // Phase 1 stays active, then transitions out as Phase 2 enters
      tl.to(
        phase1Ref.current,
        {
          opacity: 0,
          y: -40,
          scale: 1.02,
          ease: 'power1.in',
          duration: 0.8,
        },
        1.5
      )

      // --- PHASE 2 (2 -> 4.5 units | 20% - 45%) ---
      tl.to(
        phase2Ref.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'power1.out',
          duration: 0.8,
        },
        2.0
      )
      tl.to(
        phase2Ref.current,
        {
          opacity: 0,
          y: -40,
          scale: 1.02,
          ease: 'power1.in',
          duration: 0.8,
        },
        3.8
      )

      // --- PHASE 3 (4.5 -> 7 units | 45% - 70%) ---
      tl.to(
        phase3Ref.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'power1.out',
          duration: 0.8,
        },
        4.5
      )
      tl.to(
        phase3Ref.current,
        {
          opacity: 0,
          y: -40,
          scale: 1.02,
          ease: 'power1.in',
          duration: 0.8,
        },
        6.3
      )

      // --- PHASE 4 (7 -> 9 units | 70% - 90%) ---
      tl.to(
        phase4Ref.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'power1.out',
          duration: 0.8,
        },
        7.0
      )
      tl.to(
        phase4Ref.current,
        {
          opacity: 0,
          y: -40,
          scale: 1.02,
          ease: 'power1.in',
          duration: 0.8,
        },
        8.6
      )

      // --- PHASE 5 (9 -> 10 units | 90% - 100%) ---
      tl.to(
        phase5Ref.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'power1.out',
          duration: 0.8,
        },
        9.0
      )
    }, containerRef)

    return () => {
      ctx.revert()
    }
  }, [scrollTriggerElement])

  return (
    <div ref={containerRef} className="narrative-overlay" aria-live="polite">
      {/* PHASE 1: DEEP SPACE */}
      <section ref={phase1Ref} className="narrative-section phase-1">
        <div className="narrative-badge">
          <span className="badge-dot" />
          <span>STAGE 01 // DEEP SPACE</span>
        </div>
        <h1 className="narrative-heading">
          BUILDING<br />
          DIGITAL<br />
          WORLDS.
        </h1>
        <p className="narrative-body">
          Software engineer creating immersive experiences at the intersection of technology, design, and the web.
        </p>
      </section>

      {/* PHASE 2: APPROACH */}
      <section ref={phase2Ref} className="narrative-section phase-2">
        <div className="narrative-badge">
          <span className="badge-dot" />
          <span>STAGE 02 // ORBITAL INGRESS</span>
        </div>
        <h2 className="narrative-heading">
          FROM<br />
          IDEA
        </h2>
        <p className="narrative-body">
          Bridging creative vision with robust mathematical and architectural foundations.
        </p>
      </section>

      {/* PHASE 3: ORBITAL FLYBY */}
      <section ref={phase3Ref} className="narrative-section phase-3">
        <div className="narrative-badge">
          <span className="badge-dot" />
          <span>STAGE 03 // PERIAPSIS SWEEP</span>
        </div>
        <h2 className="narrative-heading">
          TO<br />
          EXPERIENCE.
        </h2>
        <p className="narrative-body">
          Harnessing real-time WebGL, shaders, and dynamic 3D physics to create living interfaces.
        </p>
      </section>

      {/* PHASE 4: PLANETARY APPROACH */}
      <section ref={phase4Ref} className="narrative-section phase-4">
        <div className="narrative-badge">
          <span className="badge-dot" />
          <span>STAGE 04 // ATMOSPHERIC VECTOR</span>
        </div>
        <h2 className="narrative-heading">
          ENGINEERED<br />
          FOR THE WEB.
        </h2>
        <p className="narrative-body">
          High-performance, accessible, and uncompromising digital craftsmanship built for scale.
        </p>
      </section>

      {/* PHASE 5: FINAL POSITION */}
      <section ref={phase5Ref} className="narrative-section phase-5">
        <div className="narrative-badge">
          <span className="badge-dot" />
          <span>STAGE 05 // TERMINAL POSITION</span>
        </div>
        <h2 className="narrative-heading">
          ORBITAL<br />
          STATION.
        </h2>
        <p className="narrative-body">
          Ready to initiate project trajectory. Explore architectural systems and selected works below.
        </p>
      </section>
    </div>
  )
}
