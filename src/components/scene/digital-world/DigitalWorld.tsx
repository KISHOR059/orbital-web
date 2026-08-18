import { PROJECTS } from '../../../data/projects'
import { DigitalGrid } from './DigitalGrid'
import { DataParticles } from './DataParticles'
import { ProjectObject } from './ProjectObject'

export function DigitalWorld() {
  return (
    <group name="digital-world">
      {/* Subtle Coordinate Lines & Telemetry Grid */}
      <DigitalGrid />

      {/* Floating Volumetric Data Particles */}
      <DataParticles count={750} />

      {/* 3D Floating Project Objects */}
      {PROJECTS.map((project) => (
        <ProjectObject key={project.id} project={project} />
      ))}
    </group>
  )
}
