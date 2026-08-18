import { CityMarkers } from './CityMarkers'

export interface HumanityProps {
  radius?: number
  scrollTriggerElement?: HTMLElement | string | null
}

export function Humanity({ radius = 2.008, scrollTriggerElement }: HumanityProps) {
  return (
    <group name="humanity-layer">
      {/* Subtle Individual Global City Civilization Light Markers */}
      <CityMarkers radius={radius} scrollTriggerElement={scrollTriggerElement} />
    </group>
  )
}
