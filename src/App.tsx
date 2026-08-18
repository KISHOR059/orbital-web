import { useRef } from 'react'
import { Scene } from './components/scene/Scene'

export default function App() {
  const scrollTrackRef = useRef<HTMLDivElement>(null)

  return (
    <main className="app-container">
      {/* Fixed Fullscreen 3D Canvas Layer */}
      <Scene scrollTriggerElement="#scroll-track" />

      {/* Cinematic 5-Phase Scroll Track (500vh distance for natural pacing) */}
      <div id="scroll-track" ref={scrollTrackRef} className="scroll-track">
        <section className="scroll-phase" data-phase="1" aria-label="Phase 1: Deep Space" />
        <section className="scroll-phase" data-phase="2" aria-label="Phase 2: Approach" />
        <section className="scroll-phase" data-phase="3" aria-label="Phase 3: Orbital Flyby" />
        <section className="scroll-phase" data-phase="4" aria-label="Phase 4: Planetary Approach" />
        <section className="scroll-phase" data-phase="5" aria-label="Phase 5: Final Position" />
      </div>
    </main>
  )
}



