import { useRef } from 'react'
import { Scene } from './components/scene/Scene'
import { Navigation } from './components/ui/Navigation'
import { HeroContent } from './components/ui/HeroContent'
import { WorkContent } from './components/ui/WorkContent'
import { PhaseIndicator } from './components/ui/PhaseIndicator'
import { ScrollIndicator } from './components/ui/ScrollIndicator'

export default function App() {
  const scrollTrackRef = useRef<HTMLDivElement>(null)

  return (
    <div className="app-container">
      {/* Fixed Background 3D Canvas Layer */}
      <Scene scrollTriggerElement="#scroll-track" />

      {/* Fixed UI Overlay Layers */}
      <Navigation />
      <HeroContent scrollTriggerElement="#scroll-track" />
      <WorkContent scrollTriggerElement="#scroll-track" />
      <PhaseIndicator scrollTriggerElement="#scroll-track" />
      <ScrollIndicator scrollTriggerElement="#scroll-track" />

      {/* Cinematic 8-Phase Scroll Track (800vh distance for continuous pacing) */}
      <main id="scroll-track" ref={scrollTrackRef} className="scroll-track">
        <section className="scroll-phase" data-phase="1" aria-label="Phase 1: Deep Space" />
        <section className="scroll-phase" data-phase="2" aria-label="Phase 2: Approach" />
        <section className="scroll-phase" data-phase="3" aria-label="Phase 3: Orbital Flyby" />
        <section className="scroll-phase" data-phase="4" aria-label="Phase 4: Planetary Approach" />
        <section className="scroll-phase" data-phase="5" aria-label="Phase 5: Digital Ingress" />
        <section className="scroll-phase" data-phase="6" aria-label="Phase 6: Selected Work" />
        <section className="scroll-phase" data-phase="7" aria-label="Phase 7: Nexus OS" />
        <section className="scroll-phase" data-phase="8" aria-label="Phase 8: Aether Engine & Synapse" />
      </main>
    </div>
  )
}





