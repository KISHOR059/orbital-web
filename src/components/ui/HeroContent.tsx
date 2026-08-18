import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface HeroContentProps {
  scrollTriggerElement?: HTMLElement | string | null
}

export function HeroContent({ scrollTriggerElement = '#scroll-track' }: HeroContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stage1Ref = useRef<HTMLDivElement>(null)
  const stage2Ref = useRef<HTMLDivElement>(null)
  const stage3Ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const trigger = scrollTriggerElement || '#scroll-track'

    const ctx = gsap.context(() => {
      // Initialize starting visual states
      gsap.set(stage1Ref.current, { opacity: 1, y: 0, scale: 1 })
      gsap.set([stage2Ref.current, stage3Ref.current], {
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

      // ==========================================
      // STAGE 01: DEEP SPACE (0 -> 3.2 units)
      // ==========================================
      tl.to(
        stage1Ref.current,
        {
          opacity: 0,
          y: -40,
          scale: 1.02,
          ease: 'power1.in',
          duration: 0.8,
        },
        2.4
      )

      // ==========================================
      // STAGE 02: EARTH (3.2 -> 6.5 units)
      // "ONE WORLD. COUNTLESS STORIES."
      // ==========================================
      tl.to(
        stage2Ref.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'power1.out',
          duration: 0.8,
        },
        3.2
      )
      tl.to(
        stage2Ref.current,
        {
          opacity: 0,
          y: -40,
          scale: 1.02,
          ease: 'power1.in',
          duration: 0.8,
        },
        5.6
      )

      // ==========================================
      // STAGE 03: HUMANITY (6.5 -> 10.0 units)
      // "WE CONNECT. WE CREATE."
      // ==========================================
      tl.to(
        stage3Ref.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'power1.out',
          duration: 0.8,
        },
        6.5
      )
    }, containerRef)

    return () => {
      ctx.revert()
    }
  }, [scrollTriggerElement])

  return (
    <div ref={containerRef} className="narrative-overlay" aria-live="polite">
      {/* STAGE 01: DEEP SPACE */}
      <section ref={stage1Ref} className="narrative-section phase-1">
        <div className="narrative-badge">
          <span className="badge-dot" />
          <span>01 // DEEP SPACE</span>
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

      {/* STAGE 02: EARTH */}
      <section ref={stage2Ref} className="narrative-section phase-2">
        <div className="narrative-badge">
          <span className="badge-dot" />
          <span>02 // EARTH</span>
        </div>
        <h2 className="narrative-heading">
          ONE WORLD.<br />
          <span className="narrative-subheading">COUNTLESS STORIES.</span>
        </h2>
        <p className="narrative-body">
          A singular sphere drifting through cosmic quietude, carrying everything we know.
        </p>
      </section>

      {/* STAGE 03: HUMANITY */}
      <section ref={stage3Ref} className="narrative-section phase-3">
        <div className="narrative-badge">
          <span className="badge-dot" />
          <span>03 // HUMANITY</span>
        </div>
        <h2 className="narrative-heading">
          WE CONNECT.<br />
          WE CREATE.
        </h2>
        <p className="narrative-body">
          Eight billion lives, connected across continents through light, networks, and shared human imagination.
        </p>
      </section>
    </div>
  )
}
