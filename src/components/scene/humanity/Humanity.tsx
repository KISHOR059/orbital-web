import { CityMarkers } from './CityMarkers'
import { ConnectionArcs } from './ConnectionArcs'
import { DataPulses } from './DataPulses'

export interface HumanityProps {
  radius?: number
}

export function Humanity({ radius = 2.008 }: HumanityProps) {
  return (
    <group name="humanity-layer">
      {/* 1. Subtle Global City Light Markers */}
      <CityMarkers radius={radius} />

      {/* 2. Thin Inter-Continental Connection Arcs */}
      <ConnectionArcs radius={radius} />

      {/* 3. Traveling Data Packets on Connection Network */}
      <DataPulses radius={radius} />
    </group>
  )
}
