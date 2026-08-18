import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { PROJECTS } from '../../data/projects'

gsap.registerPlugin(ScrollTrigger)

export interface WorkContentProps {
  scrollTriggerElement?: HTMLElement | string | null
}

export function WorkContent({ scrollTriggerElement = '#scroll-track' }: WorkContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const p1Ref = useRef<HTMLDivElement>(null)
  const p2Ref = useRef<HTMLDivElement>(null)
  const p3Ref = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const trigger = scrollTriggerElement || '#scroll-track'

    const ctx = gsap.context(() => {
      // Starting hidden states
      gsap.set([introRef.current, p1Ref.current, p2Ref.current, p3Ref.current], {
        opacity: 0,
        y: 40,
        scale: 0.97,
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

      // Work section timeline corresponds to CameraRig units 10 -> 20 (mapped out of 20 total):

      // --- WORK INTRO (11.5 -> 14.5 units) ---
      tl.to(
        introRef.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'power1.out',
          duration: 0.8,
        },
        11.5
      )
      tl.to(
        introRef.current,
        {
          opacity: 0,
          y: -40,
          scale: 1.02,
          ease: 'power1.in',
          duration: 0.8,
        },
        13.6
      )

      // --- PROJECT 01 (14.5 -> 16.5 units) ---
      tl.to(
        p1Ref.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'power1.out',
          duration: 0.8,
        },
        14.5
      )
      tl.to(
        p1Ref.current,
        {
          opacity: 0,
          y: -40,
          scale: 1.02,
          ease: 'power1.in',
          duration: 0.8,
        },
        16.0
      )

      // --- PROJECT 02 (16.5 -> 18.5 units) ---
      tl.to(
        p2Ref.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'power1.out',
          duration: 0.8,
        },
        16.5
      )
      tl.to(
        p2Ref.current,
        {
          opacity: 0,
          y: -40,
          scale: 1.02,
          ease: 'power1.in',
          duration: 0.8,
        },
        18.0
      )

      // --- PROJECT 03 (18.5 -> 20 units) ---
      tl.to(
        p3Ref.current,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          ease: 'power1.out',
          duration: 0.8,
        },
        18.5
      )
    }, containerRef)

    return () => {
      ctx.revert()
    }
  }, [scrollTriggerElement])

  const p1 = PROJECTS[0]
  const p2 = PROJECTS[1]
  const p3 = PROJECTS[2]

  return (
    <div ref={containerRef} className="work-narrative-overlay" aria-live="polite">
      {/* WORK INTRODUCTION */}
      <section ref={introRef} className="work-card intro-card">
        <div className="narrative-badge">
          <span className="badge-dot" />
          <span>01 // PORTFOLIO</span>
        </div>
        <h2 className="work-heading">
          SELECTED<br />
          WORK.
        </h2>
        <p className="narrative-body">
          Selected projects and experiments across software, interfaces, and immersive web.
        </p>
      </section>

      {/* PROJECT 01 */}
      {p1 && (
        <section ref={p1Ref} className="work-card project-card">
          <div className="narrative-badge">
            <span className="badge-dot" style={{ background: p1.accentColor, boxShadow: `0 0 8px ${p1.accentColor}` }} />
            <span>PROJECT {p1.number} // {p1.category}</span>
          </div>
          <h2 className="project-title">{p1.title}</h2>
          <div className="project-meta-line">
            <span className="project-subtitle">{p1.subtitle}</span>
            <span className="project-year">// {p1.year}</span>
          </div>
          <p className="project-desc">{p1.description}</p>
          <div className="tech-tags">
            {p1.technologies.map((tech) => (
              <span key={tech} className="tech-pill">
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* PROJECT 02 */}
      {p2 && (
        <section ref={p2Ref} className="work-card project-card align-right">
          <div className="narrative-badge">
            <span className="badge-dot" style={{ background: p2.accentColor, boxShadow: `0 0 8px ${p2.accentColor}` }} />
            <span>PROJECT {p2.number} // {p2.category}</span>
          </div>
          <h2 className="project-title">{p2.title}</h2>
          <div className="project-meta-line">
            <span className="project-subtitle">{p2.subtitle}</span>
            <span className="project-year">// {p2.year}</span>
          </div>
          <p className="project-desc">{p2.description}</p>
          <div className="tech-tags">
            {p2.technologies.map((tech) => (
              <span key={tech} className="tech-pill">
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* PROJECT 03 */}
      {p3 && (
        <section ref={p3Ref} className="work-card project-card">
          <div className="narrative-badge">
            <span className="badge-dot" style={{ background: p3.accentColor, boxShadow: `0 0 8px ${p3.accentColor}` }} />
            <span>PROJECT {p3.number} // {p3.category}</span>
          </div>
          <h2 className="project-title">{p3.title}</h2>
          <div className="project-meta-line">
            <span className="project-subtitle">{p3.subtitle}</span>
            <span className="project-year">// {p3.year}</span>
          </div>
          <p className="project-desc">{p3.description}</p>
          <div className="tech-tags">
            {p3.technologies.map((tech) => (
              <span key={tech} className="tech-pill">
                {tech}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
