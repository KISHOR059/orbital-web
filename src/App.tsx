import { Scene } from './components/scene/Scene'

export default function App() {
  return (
    <main className="app-container">
      {/* Isolated 3D Canvas Layer */}
      <Scene />

      {/* Website UI overlay layer will go here */}
    </main>
  )
}


