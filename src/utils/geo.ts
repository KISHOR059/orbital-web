import * as THREE from 'three'

export interface CityData {
  id: string
  name: string
  lat: number
  lon: number
  tier: 1 | 2 // 1 = major global hub, 2 = auxiliary regional hub
}

export interface ConnectionData {
  fromId: string
  toId: string
}

// 22 Geographically accurate major global locations
export const CITIES: CityData[] = [
  { id: 'nyc', name: 'New York', lat: 40.7128, lon: -74.006, tier: 1 },
  { id: 'lax', name: 'Los Angeles', lat: 34.0522, lon: -118.2437, tier: 1 },
  { id: 'tor', name: 'Toronto', lat: 43.6532, lon: -79.3832, tier: 2 },
  { id: 'sao', name: 'São Paulo', lat: -23.5505, lon: -46.6333, tier: 1 },
  { id: 'lon', name: 'London', lat: 51.5074, lon: -0.1278, tier: 1 },
  { id: 'par', name: 'Paris', lat: 48.8566, lon: 2.3522, tier: 1 },
  { id: 'ber', name: 'Berlin', lat: 52.52, lon: 13.405, tier: 2 },
  { id: 'cai', name: 'Cairo', lat: 30.0444, lon: 31.2357, tier: 2 },
  { id: 'nbo', name: 'Nairobi', lat: -1.2921, lon: 36.8219, tier: 2 },
  { id: 'dxb', name: 'Dubai', lat: 25.2048, lon: 55.2708, tier: 1 },
  { id: 'bom', name: 'Mumbai', lat: 19.076, lon: 72.8777, tier: 1 },
  { id: 'del', name: 'Delhi', lat: 28.6139, lon: 77.209, tier: 2 },
  { id: 'blr', name: 'Bengaluru', lat: 12.9716, lon: 77.5946, tier: 1 },
  { id: 'sin', name: 'Singapore', lat: 1.3521, lon: 103.8198, tier: 1 },
  { id: 'hkg', name: 'Hong Kong', lat: 22.3193, lon: 114.1694, tier: 1 },
  { id: 'tyo', name: 'Tokyo', lat: 35.6762, lon: 139.6503, tier: 1 },
  { id: 'sel', name: 'Seoul', lat: 37.5665, lon: 126.978, tier: 1 },
  { id: 'syd', name: 'Sydney', lat: -33.8688, lon: 151.2093, tier: 1 },
]

// Selected meaningful inter-continental connection pairs
export const CITY_CONNECTIONS: ConnectionData[] = [
  { fromId: 'nyc', toId: 'lon' }, // New York -> London
  { fromId: 'nyc', toId: 'lax' }, // New York -> Los Angeles
  { fromId: 'lon', toId: 'par' }, // London -> Paris
  { fromId: 'lon', toId: 'dxb' }, // London -> Dubai
  { fromId: 'dxb', toId: 'bom' }, // Dubai -> Mumbai
  { fromId: 'bom', toId: 'sin' }, // Mumbai -> Singapore
  { fromId: 'sin', toId: 'tyo' }, // Singapore -> Tokyo
  { fromId: 'tyo', toId: 'lax' }, // Tokyo -> Los Angeles
  { fromId: 'sin', toId: 'syd' }, // Singapore -> Sydney
  { fromId: 'nyc', toId: 'sao' }, // New York -> São Paulo
  { fromId: 'del', toId: 'blr' }, // Delhi -> Bengaluru
  { fromId: 'tyo', toId: 'sel' }, // Tokyo -> Seoul
]

/**
 * Converts Latitude and Longitude coordinates (in degrees) to a 3D Cartesian Vector3
 * on a sphere of a given radius matching Earth's standard equirectangular texture projection.
 */
export function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return new THREE.Vector3(x, y, z)
}

/**
 * Creates Great-Circle geodesic arc points between two 3D points on a sphere.
 */
export function createGeodesicArc(
  start: THREE.Vector3,
  end: THREE.Vector3,
  radius: number,
  segments = 28,
  maxAltitude = 0.075
): THREE.Vector3[] {
  const points: THREE.Vector3[] = []

  for (let s = 0; s < segments; s++) {
    const t1 = s / segments
    const t2 = (s + 1) / segments

    // Spherical linear interpolation between start & end
    const v1 = new THREE.Vector3().lerpVectors(start, end, t1)
    const v2 = new THREE.Vector3().lerpVectors(start, end, t2)

    // Smooth parabolic arc height above planetary radius
    const alt1 = Math.sin(t1 * Math.PI) * maxAltitude
    const alt2 = Math.sin(t2 * Math.PI) * maxAltitude

    v1.normalize().multiplyScalar(radius + alt1)
    v2.normalize().multiplyScalar(radius + alt2)

    points.push(v1, v2)
  }

  return points
}
