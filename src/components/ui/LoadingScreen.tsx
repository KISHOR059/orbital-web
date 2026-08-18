import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'

export function LoadingScreen() {
  const { active, progress } = useProgress()
  const [isDone, setIsDone] = useState(false)
  const [shouldRender, setShouldRender] = useState(true)

  useEffect(() => {
    // When assets are 100% loaded and active becomes false
    if (!active && progress >= 100) {
      const timer = setTimeout(() => {
        setIsDone(true)
      }, 350)
      const removeTimer = setTimeout(() => {
        setShouldRender(false)
      }, 950)
      return () => {
        clearTimeout(timer)
        clearTimeout(removeTimer)
      }
    }
  }, [active, progress])

  if (!shouldRender) return null

  return (
    <div
      className={`loading-screen-overlay ${isDone ? 'loading-screen-fade' : ''}`}
      aria-live="polite"
      aria-label="Orbital System Loading"
    >
      <div className="loading-content">
        <div className="loading-badge">
          <span className="loading-dot" />
          <span>SYS // 01 · INITIALIZATION</span>
        </div>

        <div className="loading-title">ORBITAL</div>

        <div className="loading-bar-track" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="loading-bar-fill"
            style={{ transform: `scaleX(${Math.max(0.06, progress / 100)})` }}
          />
        </div>

        <div className="loading-status">
          <span>INITIALIZING 3D ENVIRONMENT</span>
          <span className="loading-pct">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  )
}
