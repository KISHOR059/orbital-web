import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface ScrollIndicatorProps {
  scrollTriggerElement?: HTMLElement | string | null
}

export function ScrollIndicator({ scrollTriggerElement = '#scroll-track' }: ScrollIndicatorProps) {
  const indicatorRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const trigger = scrollTriggerElement || '#scroll-track'

    const ctx = gsap.context(() => {
      // Fades out gently as soon as the user scrolls past the start
      gsap.to(indicatorRef.current, {
        opacity: 0,
        y: 15,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: trigger,
          start: 'top top',
          end: 'top -80px',
          scrub: true,
        },
      })
    })

    return () => {
      ctx.revert()
    }
  }, [scrollTriggerElement])

  return (
    <div ref={indicatorRef} className="scroll-hint" aria-hidden="true">
      <span className="scroll-text">SCROLL TO EXPLORE</span>
      <div className="scroll-line">
        <span className="scroll-dot" />
      </div>
    </div>
  )
}
