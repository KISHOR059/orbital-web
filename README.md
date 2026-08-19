# Orbital

> A cinematic 3D portfolio experience exploring the relationship between Earth, humanity, technology, and the person behind the interface.

[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.185-black?style=flat-square&logo=three.js&logoColor=white)](https://threejs.org/)
[![React Three Fiber](https://img.shields.io/badge/R3F-9.7-black?style=flat-square&logo=react&logoColor=white)](https://docs.pmnd.rs/react-three-fiber)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-88CE02?style=flat-square&logo=greensock&logoColor=white)](https://greensock.com/gsap/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)

---

## Overview

**Orbital** is an interactive, WebGL-powered 3D portfolio website. Built with React Three Fiber, Three.js, and GSAP ScrollTrigger, it guides the visitor through a seamless, scroll-driven journey that descends from the quiet expanse of deep space down to Earth's illuminated continents, dives into the geological interior of the planet, and transitions into an abstract digital coordinate space showcasing software engineering projects and developer identity.

The experience blends physically-inspired rendering, custom shaders, cinematic camera choreography, dual-axis gesture discrimination for touch and mouse, and responsive telemetry overlays.

---

## Experience

The continuous scroll narrative unfolds across nine distinct stages:

```text
  01 // DEEP SPACE       Floating perspective in the cosmic starfield
        ↓
  02 // EARTH            Planetary approach with atmospheric limb glow
        ↓
  03 // CONTINENTS       Orbital lateral glide across continental landmasses
        ↓
  04 // HUMANITY         Global connection hubs, geodesic flight arcs & city lights
        ↓
  05 // EARTH INTERIOR   Geological cross-section revealing Crust & Mantle
        ↓
  06 // PLANETARY CORE   Incandescent golden core with physical cutaway separation
        ↓
  07 // TECHNOLOGY       Descent into coordinate space, data particles & grid
        ↓
  08 // ABOUT KISHOR     Interactive 3D identity construct & engineering focus areas
        ↓
  09 // CONTACT          Serene finale with direct communication channels
```

---

## Visual Journey

```text
+-------------------------------------------------------------------------------+
|  [01 DEEP SPACE]         [02-04 EARTH & HUMANITY]      [05-06 EARTH INTERIOR] |
|   .   *   +   .           .---.   .-==-.  _             .---.   //\\\\\\\\\   |
|     *   .   *            /     \ ( City )  \           /  | /| ( CORE ) \\\\  |
|   +   .   *   .         | Earth | `-==-'    |         | C |M |  `----'   |||  |
|       *   +              \     /  ~Arcs~   /           \  | \| (MANTLE) ////  |
|  Cosmic Starfield         '---'   ~Nodes~ '             '---'   \\\\\\\\\\/   |
+-------------------------------------------------------------------------------+
|  [07 TECHNOLOGY SPACE]           [08 ABOUT KISHOR]        [09 CONTACT FINALE] |
|    +--[ 3D PROJECT CARD ]--+       / \   (O) Rings          [ EMAIL ]         |
|    | NEXUS OS // SPATIAL   |      | * |  Identity           [ GITHUB ]        |
|    | WebGL Particle Engine |       \ /   Construct          [ LINKEDIN ]      |
|    +-----------------------+      FOCUS: Web / 3D / Systems "Let's Build..."  |
+-------------------------------------------------------------------------------+
```

---

## Features

### 🌍 Interactive 3D Earth
- **Physically-Inspired Surface**: High-resolution day surface texture, normal bump mapping, and roughness/specular reflectance maps.
- **Atmospheric Rayleigh Scattering**: Custom GLSL shader with Fresnel rim falloff, sunlight direction alignment, and realistic limb glow.
- **Dynamic Cloud Layer**: Independent rotational drift above the planetary surface.
- **Astronomical Lighting & Tilt**: True 23.44° axial tilt illuminated by a key solar directional light and ambient deep-space fill.
- **Desktop Drag-to-Rotate**: Smooth pointer drag interaction with momentum physics, rotational inertia, friction decay, and clamped vertical pitch.

### 🔬 Earth Interior Cutaway
- **Geological Stratigraphy**: Scientifically proportioned concentric spheres representing Crust, Mantle, and Core.
- **Scroll-Driven Separation**: 270° base cross-section paired with a 90° separating cutaway wedge that translates outward along the scroll track.
- **Material Realism**:
  - *Crust*: Burnt copper/orange outer ring.
  - *Mantle*: Deep terracotta intermediate convective layer.
  - *Core*: Incandescent golden center with radiant emissive pulse.
- **Interactive Interior Rotation**: Independent drag and touch rotation allowing 360° inspection of internal layers.

### 🛰️ Scroll-Driven Choreography
- **GSAP ScrollTrigger Master Timeline**: Seamless, inertial camera path spanning all 9 narrative phases without jarring cuts.
- **Dynamic Camera Rig**: Real-time position, target vector, and field-of-view (FOV) interpolation with zero per-frame memory allocations.
- **Live Mission Telemetry HUD**: Persistent phase counter, coordinates, real-time scroll progress bar, and phase indicators.

### 💻 Digital Technology Space
- **Coordinate Grid & Spatial Guide Lines**: Procedurally generated 3D vector grid with subtle luminescent guidelines.
- **Volumetric Data Particles**: Multi-depth floating particle field with gentle ambient drift.
- **Interactive 3D Project Objects**: Floating spatial project cards with glass panels, wireframe telemetry backings, mouse tilt tracking, and external link triggers.
- **Identity Construct**: Abstract wireframe icosahedron with dual concentric orbital rings and harmonic oscillation.

### 📱 Responsive & Adaptive Architecture
- **Dual-Axis Touch Gesture Discrimination**: Intelligent touch handler that distinguishes between horizontal Earth rotation and vertical page scrolling based on movement vector analysis.
- **Device-Adaptive Camera**: Dynamic camera distance multipliers and FOV adaptation across desktop, tablet, and mobile breakpoints.
- **Performance Optimization**:
  - Dynamic pixel ratio clamping (`dpr={[1, 2]}` on desktop, `[1, 1.5]` on mobile).
  - Adaptive geometry subdivisions and reduced particle counts for mobile battery and GPU efficiency.
  - Pre-allocated persistent THREE vectors to prevent garbage collection spikes.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | Modern UI architecture and component state management |
| **TypeScript** | Strict static type safety across scene graphs and UI |
| **Three.js** | WebGL 3D rendering engine, shaders, and geometric math |
| **React Three Fiber (R3F)** | Declarative, component-driven Three.js scene orchestration |
| **@react-three/drei** | Three.js helpers (Textures, Stars, Text, Camera utilities) |
| **GSAP (GreenSock)** | High-performance animation engine |
| **GSAP ScrollTrigger** | Scroll-synchronized camera choreography and UI transitions |
| **Vite** | Next-generation frontend build tooling and HMR dev server |
| **Vanilla CSS** | Glassmorphism, typography, responsive layouts, and UI transitions |

---

## Architecture

```text
src/
├── App.tsx                          # Master layout, GSAP context & 9-phase scroll track
├── main.tsx                         # React 19 root entry point
├── index.css                        # Design system tokens, glassmorphism & responsive CSS
├── data/
│   ├── projects.ts                  # 3D project coordinates, metadata & URLs
│   └── site.ts                      # Contact endpoints & author configuration
├── utils/
│   └── geo.ts                       # Geodesic lat/lon-to-Cartesian coordinate mapping
└── components/
    ├── ui/                          # Fixed HUD & Telemetry Overlays
    │   ├── LoadingScreen.tsx        # Asset preloader & initialization bar
    │   ├── Navigation.tsx           # Global header & smooth-scroll triggers
    │   ├── NarrativeOverlay.tsx     # Stage-by-stage typography & cards
    │   ├── PhaseIndicator.tsx       # Live orbital telemetry HUD & progress bar
    │   └── ScrollIndicator.tsx      # Subtle entry scroll prompt
    └── scene/                       # Three.js / WebGL Scene Graph
        ├── Scene.tsx                # Canvas root, lighting, starfields & DPR config
        ├── camera/
        │   └── CameraRig.tsx        # GSAP-driven camera trajectory & lookAt solver
        ├── earth/
        │   ├── Earth.tsx            # Earth parent group, axial tilt & gesture physics
        │   ├── EarthSurface.tsx     # PBR Earth sphere (day, normal & specular maps)
        │   ├── EarthClouds.tsx      # Independent rotating cloud layer
        │   ├── EarthAtmosphere.tsx  # Custom Rayleigh scattering GLSL shader
        │   └── EarthHumanity.tsx    # Connection arcs, hubs & orbital lines
        ├── earth-interior/
        │   └── EarthInterior.tsx    # Concentric Crust, Mantle, Core & separating wedge
        ├── humanity/
        │   ├── Humanity.tsx         # Humanity layer root
        │   └── CityMarkers.tsx      # Geographic Cartesian city lights
        ├── technology/
        │   └── TechnologySpace.tsx  # Coordinate grid, guide lines & particle space
        ├── digital-world/
        │   ├── DigitalWorld.tsx     # Digital world environment wrapper
        │   ├── DigitalGrid.tsx      # Procedural 3D ground plane grid
        │   ├── DataParticles.tsx    # Floating volumetric data particles
        │   └── ProjectObject.tsx    # Interactive 3D project chassis & mouse tilt
        └── identity/
            └── IdentityObject.tsx   # Geometric wireframe core & orbital rings
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/) / [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/KISHOR059/orbital-web.git
   cd orbital-web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser to explore Orbital.

4. **Build for production:**
   ```bash
   npm run build
   ```

5. **Preview production build:**
   ```bash
   npm run preview
   ```

---

## Controls & Interaction

- **Scroll (Wheel / Touch)**: Guides the camera through all 9 narrative stages.
- **Left-Click & Drag (Desktop)**: Interactively rotate the Earth or the Earth Interior with realistic rotational momentum and friction.
- **Horizontal Swipe (Mobile)**: Rotates the 3D globe / interior while preserving normal vertical scrolling when swiping vertically.
- **Hover & Click (3D Projects)**: Hover over floating 3D project cards in the Technology space for interactive tilt and click to view external project repositories/demos.
- **Navigation Links**: Click header links (`EARTH`, `ABOUT`, `CONTACT`) to smoothly glide directly to key mission milestones.

---

## Author

**Kishor** — Software Engineer
- **GitHub**: [@KISHOR059](https://github.com/KISHOR059)
- **LinkedIn**: [Kishor M](https://linkedin.com/in/kishor-m-567b95297)
- **Email**: [mtkishor07@gmail.com](mailto:mtkishor07@gmail.com)

---

## License

This project is private / portfolio software. All rights reserved.
