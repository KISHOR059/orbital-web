import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Scene } from './components/scene/Scene'
import { Navigation } from './components/ui/Navigation'
import { NarrativeOverlay } from './components/ui/NarrativeOverlay'
import { PhaseIndicator } from './components/ui/PhaseIndicator'
import { ScrollIndicator } from './components/ui/ScrollIndicator'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const scrollTrackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Ensure all ScrollTriggers calculate accurate layout dimensions after initial mount
    const timer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="app-container">
      {/* Fixed Background 3D Canvas Layer */}
      <Scene scrollTriggerElement="#scroll-track" />

      {/* Fixed UI Overlay Layers */}
      <Navigation />
      <NarrativeOverlay scrollTriggerElement="#scroll-track" />
      <PhaseIndicator scrollTriggerElement="#scroll-track" />
      <ScrollIndicator scrollTriggerElement="#scroll-track" />

      {/* Complete 9-Phase Cinematic Narrative Scroll Track */}
      <main id="scroll-track" ref={scrollTrackRef} className="scroll-track">
        <section className="scroll-phase" data-phase="1" aria-label="Stage 1: Deep Space" />
        <section className="scroll-phase" data-phase="2" aria-label="Stage 2: One World" />
        <section className="scroll-phase" data-phase="3" aria-label="Stage 3: Continents" />
        <section className="scroll-phase" data-phase="4" aria-label="Stage 4: Humanity" />
        <section className="scroll-phase" data-phase="5" aria-label="Stage 5: Ideas Move" />
        <section className="scroll-phase" data-phase="6" aria-label="Stage 6: Data Flows" />
        <section className="scroll-phase" data-phase="7" aria-label="Stage 7: Technology" />
        <section className="scroll-phase" data-phase="8" aria-label="Stage 8: About Kishor" />
        <section className="scroll-phase" data-phase="9" aria-label="Stage 9: Contact" />
      </main>
    </div>
  )
}
