import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface AboutContentProps {
  scrollTriggerElement?: HTMLElement | string | null
}

// Data-driven content for easy modification
const ABOUT_DATA = {
  greeting: "HI, I'M KISHOR.",
  lead: 'Software engineer building thoughtful, high-performance experiences for the web.',
  focusAreas: ['Web Platforms', '3D & Realtime Graphics', 'Interactive Systems'],
}

export function AboutContent({ scrollTriggerElement = '#scroll-track' }: AboutContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const aboutCardRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const trigger = scrollTriggerElement || '#scroll-track'

    const ctx = gsap.context(() => {
      // Starting hidden state
      gsap.set(aboutCardRef.current, {
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

      // About phase activates in the narrative timeline range (14.0 -> 17.0 units)
      tl.to(
        aboutCardRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'power1.out',
          duration: 0.8,
        },
        14.0
      )
      tl.to(
        aboutCardRef.current,
        {
          opacity: 0,
          y: -40,
          scale: 1.02,
          ease: 'power1.in',
          duration: 0.8,
        },
        16.4
      )
    }, containerRef)


    return () => {
      ctx.revert()
    }
  }, [scrollTriggerElement])

  return (
    <div ref={containerRef} className="about-overlay" aria-live="polite">
      <article ref={aboutCardRef} className="about-content-card" aria-label="About Kishor">
        <div className="narrative-badge">
          <span className="badge-dot" />
          <span>08 // ABOUT</span>
        </div>

        <h2 className="about-heading">{ABOUT_DATA.greeting}</h2>

        <p className="about-lead">{ABOUT_DATA.lead}</p>

        <div className="about-details">
          <div className="about-focus-group">
            <span className="focus-label">FOCUS AREAS //</span>
            <div className="focus-pills">
              {ABOUT_DATA.focusAreas.map((area) => (
                <span key={area} className="tech-pill">
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </article>
    </div>
  )
}
