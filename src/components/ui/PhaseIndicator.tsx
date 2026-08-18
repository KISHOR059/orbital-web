import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const PHASES = [
  { index: '01 / 05', name: 'DEEP SPACE', coord: 'LAT 00°00\'N // ALT 36,000 KM' },
  { index: '02 / 05', name: 'APPROACH', coord: 'LAT 12°40\'N // ALT 18,500 KM' },
  { index: '03 / 05', name: 'ORBITAL FLYBY', coord: 'LAT 24°15\'N // ALT 8,200 KM' },
  { index: '04 / 05', name: 'PLANETARY VECTOR', coord: 'LAT 37°50\'N // ALT 1,400 KM' },
  { index: '05 / 05', name: 'FINAL POSITION', coord: 'LAT 45°00\'N // ALT 420 KM' },
]

export interface PhaseIndicatorProps {
  scrollTriggerElement?: HTMLElement | string | null
}

export function PhaseIndicator({ scrollTriggerElement = '#scroll-track' }: PhaseIndicatorProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const indexRef = useRef<HTMLSpanElement>(null)
  const nameRef = useRef<HTMLSpanElement>(null)
  const coordRef = useRef<HTMLSpanElement>(null)
  const progressFillRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const trigger = scrollTriggerElement || '#scroll-track'

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: trigger,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const progress = self.progress
          const phaseIndex = Math.min(PHASES.length - 1, Math.floor(progress * PHASES.length))
          const current = PHASES[phaseIndex]

          if (indexRef.current) indexRef.current.textContent = current.index
          if (nameRef.current) nameRef.current.textContent = current.name
          if (coordRef.current) coordRef.current.textContent = current.coord
          if (progressFillRef.current) {
            progressFillRef.current.style.transform = `scaleX(${progress})`
          }
        },
      })
    }, containerRef)

    return () => {
      ctx.revert()
    }
  }, [scrollTriggerElement])

  return (
    <aside ref={containerRef} className="phase-indicator" aria-label="Orbital Telemetry">
      <div className="phase-telemetry">
        <span ref={indexRef} className="phase-number">
          01 / 05
        </span>
        <span className="telemetry-separator" aria-hidden="true">
          //
        </span>
        <span ref={nameRef} className="phase-name">
          DEEP SPACE
        </span>
      </div>

      <div className="phase-progress-bar" role="progressbar" aria-label="Mission Scroll Progress">
        <div ref={progressFillRef} className="phase-progress-fill" />
      </div>

      <div className="phase-coord">
        <span ref={coordRef}>LAT 00°00'N // ALT 36,000 KM</span>
      </div>
    </aside>
  )
}
