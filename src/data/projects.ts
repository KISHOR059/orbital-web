export interface Project {
  id: string
  number: string
  title: string
  subtitle: string
  category: string
  year: string
  description: string
  technologies: string[]
  url?: string
  accentColor: string
  // 3D positioning in digital space coordinates
  position: [number, number, number]
  rotation: [number, number, number]
}

export const PROJECTS: Project[] = [
  {
    id: 'project-01',
    number: '01',
    title: 'NEXUS OS',
    subtitle: 'SPATIAL OPERATING SYSTEM',
    category: 'Spatial Computing // Realtime WebGL',
    year: '2025',
    description:
      'A WebGL-native spatial workspace exploring future computing paradigms, real-time particle graphs, and multi-modal sensory feedback for high-density information architecture.',
    technologies: ['Three.js', 'WebGPU', 'React', 'GLSL', 'TypeScript'],
    url: 'https://github.com/example/nexus-os',
    accentColor: '#38bdf8',
    position: [-2.5, -28, -52],
    rotation: [0, 0.35, 0],
  },
  {
    id: 'project-02',
    number: '02',
    title: 'AETHER ENGINE',
    subtitle: 'PROCEDURAL SHADER PIPELINE',
    category: 'Generative Graphics // Tooling',
    year: '2024',
    description:
      'A node-based procedural raymarching and volumetric cloud synthesis toolkit enabling cinematic real-time visual effects directly in modern web browsers.',
    technologies: ['GLSL Shaders', 'WebAudio API', 'Vite', 'Zustand', 'Math.js'],
    url: 'https://github.com/example/aether-engine',
    accentColor: '#818cf8',
    position: [2.8, -35, -68],
    rotation: [0, -0.42, 0],
  },
  {
    id: 'project-03',
    number: '03',
    title: 'SYNAPSE PROTOCOL',
    subtitle: 'DECENTRALIZED TELEMETRY STREAM',
    category: 'Data Visualization // Systems Architecture',
    year: '2024',
    description:
      'Ultra-low-latency 3D network topology and global telemetry visualization platform tracking thousands of distributed peer nodes in real time.',
    technologies: ['WebSockets', 'Canvas2D/3D', 'Next.js', 'Tailwind', 'Rust WASM'],
    url: 'https://github.com/example/synapse-protocol',
    accentColor: '#34d399',
    position: [-0.5, -43, -84],
    rotation: [0.1, 0.15, 0],
  },
]
