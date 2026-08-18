import { useRef } from 'react'
import { Scene } from './components/scene/Scene'
import { Navigation } from './components/ui/Navigation'
import { HeroContent } from './components/ui/HeroContent'
import { AboutContent } from './components/ui/AboutContent'
import { ContactContent } from './components/ui/ContactContent'
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
      <AboutContent scrollTriggerElement="#scroll-track" />
      <ContactContent scrollTriggerElement="#scroll-track" />
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
