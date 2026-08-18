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
  const stage4Ref = useRef<HTMLDivElement>(null)
  const stage5Ref = useRef<HTMLDivElement>(null)
  const stage6Ref = useRef<HTMLDivElement>(null)
  const stage7Ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const trigger = scrollTriggerElement || '#scroll-track'

    const ctx = gsap.context(() => {
      // Initialize starting visual states
      gsap.set(stage1Ref.current, { opacity: 1, y: 0, scale: 1 })
      gsap.set(
        [
          stage2Ref.current,
          stage3Ref.current,
          stage4Ref.current,
          stage5Ref.current,
          stage6Ref.current,
          stage7Ref.current,
        ],
        {
          opacity: 0,
          y: 40,
          scale: 0.96,
        }
      )

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.0,
          invalidateOnRefresh: true,
        },
      })

      // Total timeline: 14 units

      // 1. DEEP SPACE (0 -> 2 units)
      tl.to(
        stage1Ref.current,
        { opacity: 0, y: -40, scale: 1.02, ease: 'power1.in', duration: 0.8 },
        1.4
      )

      // 2. ONE WORLD (2 -> 4 units)
      tl.to(
        stage2Ref.current,
        { opacity: 1, y: 0, scale: 1, ease: 'power1.out', duration: 0.8 },
        2.0
      )
      tl.to(
        stage2Ref.current,
        { opacity: 0, y: -40, scale: 1.02, ease: 'power1.in', duration: 0.8 },
        3.4
      )

      // 3. COUNTLESS STORIES (4 -> 6 units)
      tl.to(
        stage3Ref.current,
        { opacity: 1, y: 0, scale: 1, ease: 'power1.out', duration: 0.8 },
        4.0
      )
      tl.to(
        stage3Ref.current,
        { opacity: 0, y: -40, scale: 1.02, ease: 'power1.in', duration: 0.8 },
        5.4
      )

      // 4. WE CONNECT (6 -> 8 units)
      tl.to(
        stage4Ref.current,
        { opacity: 1, y: 0, scale: 1, ease: 'power1.out', duration: 0.8 },
        6.0
      )
      tl.to(
        stage4Ref.current,
        { opacity: 0, y: -40, scale: 1.02, ease: 'power1.in', duration: 0.8 },
        7.4
      )

      // 5. IDEAS MOVE (8 -> 10 units)
      tl.to(
        stage5Ref.current,
        { opacity: 1, y: 0, scale: 1, ease: 'power1.out', duration: 0.8 },
        8.0
      )
      tl.to(
        stage5Ref.current,
        { opacity: 0, y: -40, scale: 1.02, ease: 'power1.in', duration: 0.8 },
        9.4
      )

      // 6. DATA FLOWS (10 -> 12 units)
      tl.to(
        stage6Ref.current,
        { opacity: 1, y: 0, scale: 1, ease: 'power1.out', duration: 0.8 },
        10.0
      )
      tl.to(
        stage6Ref.current,
        { opacity: 0, y: -40, scale: 1.02, ease: 'power1.in', duration: 0.8 },
        11.4
      )

      // 7. TECHNOLOGY BRINGS IT TOGETHER (12 -> 14 units)
      tl.to(
        stage7Ref.current,
        { opacity: 1, y: 0, scale: 1, ease: 'power1.out', duration: 0.8 },
        12.0
      )
      tl.to(
        stage7Ref.current,
        { opacity: 0, y: -40, scale: 1.02, ease: 'power1.in', duration: 0.8 },
        13.5
      )
    }, containerRef)


    return () => {
      ctx.revert()
    }
  }, [scrollTriggerElement])

  return (
    <div ref={containerRef} className="narrative-overlay" aria-live="polite">
      {/* 1. DEEP SPACE */}
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
      </section>

      {/* 2. ONE WORLD */}
      <section ref={stage2Ref} className="narrative-section phase-2">
        <div className="narrative-badge">
          <span className="badge-dot" />
          <span>02 // EARTH</span>
        </div>
        <h2 className="narrative-heading">
          ONE<br />
          WORLD.
        </h2>
      </section>

      {/* 3. COUNTLESS STORIES */}
      <section ref={stage3Ref} className="narrative-section phase-3">
        <div className="narrative-badge">
          <span className="badge-dot" />
          <span>03 // CONTINENTS</span>
        </div>
        <h2 className="narrative-heading">
          COUNTLESS<br />
          STORIES.
        </h2>
      </section>

      {/* 4. WE CONNECT */}
      <section ref={stage4Ref} className="narrative-section phase-4">
        <div className="narrative-badge">
          <span className="badge-dot" />
          <span>04 // HUMANITY</span>
        </div>
        <h2 className="narrative-heading">
          WE<br />
          CONNECT.
        </h2>
      </section>

      {/* 5. IDEAS MOVE */}
      <section ref={stage5Ref} className="narrative-section phase-5">
        <div className="narrative-badge">
          <span className="badge-dot" />
          <span>05 // NETWORK</span>
        </div>
        <h2 className="narrative-heading">
          IDEAS<br />
          MOVE.
        </h2>
      </section>

      {/* 6. DATA FLOWS */}
      <section ref={stage6Ref} className="narrative-section phase-6">
        <div className="narrative-badge">
          <span className="badge-dot" />
          <span>06 // DATA</span>
        </div>
        <h2 className="narrative-heading">
          DATA<br />
          FLOWS.
        </h2>
      </section>

      {/* 7. TECHNOLOGY BRINGS IT TOGETHER */}
      <section ref={stage7Ref} className="narrative-section phase-7">
        <div className="narrative-badge">
          <span className="badge-dot" />
          <span>07 // TECHNOLOGY</span>
        </div>
        <h2 className="narrative-heading">
          TECHNOLOGY<br />
          BRINGS IT<br />
          TOGETHER.
        </h2>
      </section>
    </div>
  )
}
