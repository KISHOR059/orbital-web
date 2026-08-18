import { useRef } from 'react'
import { Scene } from './components/scene/Scene'
import { Navigation } from './components/ui/Navigation'
import { HeroContent } from './components/ui/HeroContent'
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
      <PhaseIndicator scrollTriggerElement="#scroll-track" />
      <ScrollIndicator scrollTriggerElement="#scroll-track" />

      {/* Cinematic Scroll Track for Deep Space -> Earth -> Humanity */}
      <main id="scroll-track" ref={scrollTrackRef} className="scroll-track">
        <section className="scroll-phase" data-phase="1" aria-label="Stage 1: Deep Space" />
        <section className="scroll-phase" data-phase="2" aria-label="Stage 2: Earth" />
        <section className="scroll-phase" data-phase="3" aria-label="Stage 3: Humanity" />
      </main>
    </div>
  )
}
