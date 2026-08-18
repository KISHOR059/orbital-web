import { CityMarkers } from './CityMarkers'
import { ConnectionNetwork } from './ConnectionNetwork'

export interface HumanityProps {
  radius?: number
}

export function Humanity({ radius = 2.008 }: HumanityProps) {
  return (
    <group name="humanity-layer">
      {/* 1. Subtle Global City Light Markers */}
      <CityMarkers radius={radius} />

      {/* 2. Elevated Great-Circle Routes with Data Signals and Destination Pulses */}
      <ConnectionNetwork radius={radius} />
    </group>
  )
}
