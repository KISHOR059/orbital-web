import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteConfig } from '../../data/site'

gsap.registerPlugin(ScrollTrigger)

export interface ContactContentProps {
  scrollTriggerElement?: HTMLElement | string | null
}

export function ContactContent({ scrollTriggerElement = '#scroll-track' }: ContactContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const contactCardRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const trigger = scrollTriggerElement || '#scroll-track'

    const ctx = gsap.context(() => {
      // Starting hidden state
      gsap.set(contactCardRef.current, {
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

      // Contact activates in the closing narrative range (17.0 -> 20.0 units)
      tl.to(
        contactCardRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'power1.out',
          duration: 1.0,
        },
        17.0
      )
    }, containerRef)

    return () => {
      ctx.revert()
    }
  }, [scrollTriggerElement])

  return (
    <div ref={containerRef} className="contact-overlay" aria-live="polite">
      <article ref={contactCardRef} className="contact-content-card" aria-label="Contact Kishor">
        <div className="narrative-badge">
          <span className="badge-dot" />
          <span>09 // CONTACT</span>
        </div>

        <h2 className="contact-heading">
          LET'S BUILD<br />
          SOMETHING<br />
          INTERESTING.
        </h2>

        <p className="contact-lead">Have an idea, a project, or simply want to talk?</p>

        <nav className="contact-links-group" aria-label="Direct Contact Links">
          <a
            href={siteConfig.email}
            className="contact-link-pill"
            aria-label="Send email to Kishor"
          >
            <span>EMAIL</span>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link-pill"
            aria-label="View Kishor's GitHub profile"
          >
            <span>GITHUB</span>
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M2.5 9.5L9.5 2.5M9.5 2.5H4.5M9.5 2.5V7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>

          <a
            href={siteConfig.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="contact-link-pill"
            aria-label="Connect on LinkedIn"
          >
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
