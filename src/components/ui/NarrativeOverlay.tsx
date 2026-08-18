import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteConfig } from '../../data/site'

gsap.registerPlugin(ScrollTrigger)

export interface NarrativeOverlayProps {
  scrollTriggerElement?: HTMLElement | string | null
}

const ABOUT_DATA = {
  greeting: "HI, I'M KISHOR.",
  lead: 'Software engineer building thoughtful, high-performance experiences for the web.',
  focusAreas: ['Web Platforms', '3D & Realtime Graphics', 'Interactive Systems'],
}

export function NarrativeOverlay({ scrollTriggerElement = '#scroll-track' }: NarrativeOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Stage element refs (1 through 9)
  const s1Ref = useRef<HTMLDivElement>(null)
  const s2Ref = useRef<HTMLDivElement>(null)
  const s3Ref = useRef<HTMLDivElement>(null)
  const s4Ref = useRef<HTMLDivElement>(null)
  const s7Ref = useRef<HTMLDivElement>(null)
  const s8Ref = useRef<HTMLDivElement>(null)
  const s9Ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const trigger = scrollTriggerElement || '#scroll-track'

    const ctx = gsap.context(() => {
      // Initialize starting visual states with GPU-accelerated transforms
      gsap.set(s1Ref.current, { opacity: 1, y: 0, scale: 1, force3D: true })
      gsap.set(
        [
          s2Ref.current,
          s3Ref.current,
          s4Ref.current,
          s7Ref.current,
          s8Ref.current,
          s9Ref.current,
        ],
        {
          opacity: 0,
          y: 35,
          scale: 0.97,
          force3D: true,
        }
      )

      // Single Unified Master UI Timeline across 20 units
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.0,
          invalidateOnRefresh: true,
        },
      })

      // Helper for clean, non-overlapping cinematic fade transitions
      const animateStage = (
        el: HTMLElement | null,
        inStart: number,
        inEnd: number,
        outStart: number,
        outEnd: number
      ) => {
        if (!el) return
        tl.to(
          el,
          { opacity: 1, y: 0, scale: 1, ease: 'power2.out', duration: inEnd - inStart },
          inStart
        )
        tl.to(
          el,
          { opacity: 0, y: -35, scale: 1.02, ease: 'power2.in', duration: outEnd - outStart },
          outStart
        )
      }

      // STAGE 01: Deep Space (0.0 -> 1.8 units)
      tl.to(s1Ref.current, { opacity: 0, y: -35, scale: 1.02, ease: 'power2.in', duration: 0.6 }, 1.2)

      // STAGE 02: One World (2.0 -> 3.6 units)
      animateStage(s2Ref.current, 2.0, 2.6, 3.0, 3.6)

      // STAGE 03: Countless Stories (4.0 -> 5.2 units)
      animateStage(s3Ref.current, 4.0, 4.5, 4.8, 5.2)

      // STAGE 04: Humanity (5.5 -> 6.8 units)
      animateStage(s4Ref.current, 5.5, 6.0, 6.4, 6.8)

      // (STAGES 05 & 06: Pure visual Earth Interior Cutaway from 7.0 to 13.5 - Zero text overlays)

      // STAGE 07: Technology (14.2 -> 15.8 units) - Completely 0 opacity by 15.8
      animateStage(s7Ref.current, 14.2, 14.8, 15.2, 15.8)

      // STAGE 08: About Me (16.2 -> 18.0 units) - Starts at 16.2, completely 0 opacity by 18.0
      animateStage(s8Ref.current, 16.2, 16.8, 17.5, 18.0)

      // STAGE 09: Contact (18.4 -> 20.0 units) - Settles as the serene finale
      tl.to(
        s9Ref.current,
        { opacity: 1, y: 0, scale: 1, ease: 'power2.out', duration: 0.8 },
        18.4
      )
    }, containerRef)

    return () => {
      ctx.revert()
    }
  }, [scrollTriggerElement])

  return (
    <div ref={containerRef} className="narrative-master-layer" aria-live="polite">
      {/* 01: DEEP SPACE */}
      <section ref={s1Ref} className="narrative-section stage-left">
        <div className="narrative-badge">
          <span className="badge-dot" />
          <span>01 // DEEP SPACE</span>
        </div>
        <h1 className="narrative-heading">
          <span className="heading-line">BUILDING</span>
          <span className="heading-line">DIGITAL</span>
          <span className="heading-line">WORLDS.</span>
        </h1>
      </section>

      {/* 02: ONE WORLD */}
      <section ref={s2Ref} className="narrative-section stage-left">
        <div className="narrative-badge">
          <span className="badge-dot" />
          <span>02 // EARTH</span>
        </div>
        <h2 className="narrative-heading">
          <span className="heading-line">ONE</span>
          <span className="heading-line">WORLD.</span>
        </h2>
      </section>

      {/* 03: COUNTLESS STORIES */}
      <section ref={s3Ref} className="narrative-section stage-left">
        <div className="narrative-badge">
          <span className="badge-dot" />
          <span>03 // CONTINENTS</span>
        </div>
        <h2 className="narrative-heading">
          <span className="heading-line">COUNTLESS</span>
          <span className="heading-line">STORIES.</span>
        </h2>
      </section>

      {/* 04: HUMANITY */}
      <section ref={s4Ref} className="narrative-section stage-left">
        <div className="narrative-badge">
          <span className="badge-dot" />
          <span>04 // HUMANITY</span>
        </div>
        <h2 className="narrative-heading">
          <span className="heading-line">WE</span>
          <span className="heading-line">CONNECT.</span>
        </h2>
      </section>

      {/* 07: TECHNOLOGY */}
      <section ref={s7Ref} className="narrative-section stage-left">
        <div className="narrative-badge">
          <span className="badge-dot" />
          <span>07 // TECHNOLOGY</span>
        </div>
        <h2 className="narrative-heading">
          <span className="heading-line">TECHNOLOGY</span>
          <span className="heading-line">BRINGS IT</span>
          <span className="heading-line">TOGETHER.</span>
        </h2>
      </section>

      {/* 08: ABOUT ME */}
      <article ref={s8Ref} className="narrative-section stage-left about-card" aria-label="About Kishor">
        <div className="narrative-badge">
          <span className="badge-dot" />
          <span>08 // ABOUT</span>
        </div>
        <h2 className="about-heading">
          <span className="heading-line">HI, I'M</span>
          <span className="heading-line">KISHOR.</span>
        </h2>
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

      {/* 09: CONTACT */}
      <article ref={s9Ref} className="narrative-section stage-center contact-card" aria-label="Contact Kishor">
        <div className="narrative-badge">
          <span className="badge-dot" />
          <span>09 // CONTACT</span>
        </div>
        <h2 className="contact-heading">
          <span className="heading-line">LET'S BUILD</span>
          <span className="heading-line">SOMETHING</span>
          <span className="heading-line">INTERESTING.</span>
        </h2>
        <p className="contact-lead">Have an idea, a project, or simply want to talk?</p>
        <nav className="contact-links-group" aria-label="Direct Contact Links">
          <a href={siteConfig.email} className="contact-link-pill" aria-label="Send email to Kishor">
            <span>EMAIL</span>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href={siteConfig.github} target="_blank" rel="noopener noreferrer" className="contact-link-pill" aria-label="View Kishor's GitHub profile">
            <span>GITHUB</span>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href={siteConfig.linkedin} target="_blank" rel="noopener noreferrer" className="contact-link-pill" aria-label="Connect on LinkedIn">
            <span>LINKEDIN</span>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </nav>
      </article>
    </div>
  )
}
