export interface Project {
  id: string
  number: string
  title: string
  shortTitle: string
  subtitle: string
  category: string
  year: string
  description: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  accentColor: string
  // 3D positioning and orientation in digital space coordinates
  position: [number, number, number]
  rotation: [number, number, number]
}

export const PROJECTS: Project[] = [
  {
    id: 'project-01',
    number: '01',
    title: 'NEXUS OS',
    shortTitle: 'NEXUS',
    subtitle: 'SPATIAL OPERATING SYSTEM',
    category: 'Spatial Computing // Realtime WebGL',
    year: '2026',
    description:
      'A WebGL-native spatial workspace exploring future computing paradigms, real-time particle graphs, and multi-modal sensory feedback for high-density information architecture.',
    technologies: ['Three.js', 'WebGPU', 'React', 'GLSL', 'TypeScript'],
    liveUrl: 'https://example.com/nexus-os',
    githubUrl: 'https://github.com/example/nexus-os',
    accentColor: '#38bdf8',
    position: [-2.5, -28, -52],
    rotation: [0, 0.35, 0],
  },
  {
    id: 'project-02',
    number: '02',
    title: 'AETHER ENGINE',
    shortTitle: 'AETHER',
    subtitle: 'PROCEDURAL SHADER PIPELINE',
    category: 'Generative Graphics // Tooling',
    year: '2025',
    description:
      'A node-based procedural raymarching and volumetric cloud synthesis toolkit enabling cinematic real-time visual effects directly in modern web browsers.',
    technologies: ['GLSL Shaders', 'WebAudio API', 'Vite', 'Zustand'],
    liveUrl: 'https://example.com/aether-engine',
    githubUrl: 'https://github.com/example/aether-engine',
    accentColor: '#818cf8',
    position: [2.8, -35, -68],
    rotation: [0, -0.42, 0],
  },
  {
    id: 'project-03',
    number: '03',
    title: 'SYNAPSE PROTOCOL',
    shortTitle: 'SYNAPSE',
    subtitle: 'DECENTRALIZED TELEMETRY STREAM',
    category: 'Data Visualization // Systems Architecture',
    year: '2025',
    description:
      'Ultra-low-latency 3D network topology and global telemetry visualization platform tracking thousands of distributed peer nodes in real time.',
    technologies: ['WebSockets', 'Canvas 3D', 'Next.js', 'Rust WASM'],
    liveUrl: 'https://example.com/synapse-protocol',
    githubUrl: 'https://github.com/example/synapse-protocol',
    accentColor: '#34d399',
    position: [-0.5, -43, -84],
    rotation: [0.08, 0.15, 0],
  },
]
