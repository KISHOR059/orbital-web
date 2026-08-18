import * as THREE from 'three'

export interface CityData {
  id: string
  name: string
  lat: number
  lon: number
  tier: 1 | 2 // 1 = major global hub, 2 = auxiliary regional hub
}

export interface ConnectionData {
  id: string
  fromId: string
  toId: string
}

// 18 Geographically accurate major global locations
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

// Sequentially choreographed inter-continental routes establishing global network
export const SEQUENTIAL_ROUTES: ConnectionData[] = [
  { id: 'r1', fromId: 'nyc', toId: 'lon' }, // Route 1: New York -> London (Trans-Atlantic)
  { id: 'r2', fromId: 'lon', toId: 'par' }, // Route 2: London -> Paris (Continental)
  { id: 'r3', fromId: 'lon', toId: 'dxb' }, // Route 3: London -> Dubai (Eurasian Hub)
  { id: 'r4', fromId: 'dxb', toId: 'bom' }, // Route 4: Dubai -> Mumbai (Arabian Sea)
  { id: 'r5', fromId: 'bom', toId: 'sin' }, // Route 5: Mumbai -> Singapore (Indian Ocean)
  { id: 'r6', fromId: 'sin', toId: 'tyo' }, // Route 6: Singapore -> Tokyo (East Asia)
  { id: 'r7', fromId: 'tyo', toId: 'lax' }, // Route 7: Tokyo -> Los Angeles (Trans-Pacific)
  { id: 'r8', fromId: 'lax', toId: 'nyc' }, // Route 8: Los Angeles -> New York (Trans-Continental)
  { id: 'r9', fromId: 'nyc', toId: 'sao' }, // Route 9: New York -> São Paulo (Americas)
  { id: 'r10', fromId: 'sin', toId: 'syd' }, // Route 10: Singapore -> Sydney (Australasia)
]

export const CITY_CONNECTIONS = SEQUENTIAL_ROUTES

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
 * Computes angular distance (in radians) between two vectors on a unit sphere.
 */
export function getAngularDistance(v1: THREE.Vector3, v2: THREE.Vector3): number {
  const u1 = v1.clone().normalize()
  const u2 = v2.clone().normalize()
  const dot = THREE.MathUtils.clamp(u1.dot(u2), -1, 1)
  return Math.acos(dot)
}

/**
 * Creates high-fidelity 3D Great-Circle orbital curve points between two geographic coordinates,
 * with altitude dynamically scaled according to spherical distance.
 */
export function createElevatedGreatCirclePoints(
  start: THREE.Vector3,
  end: THREE.Vector3,
  radius: number,
  segments = 48
): THREE.Vector3[] {
  const points: THREE.Vector3[] = []
  const angle = getAngularDistance(start, end)

  // Distance-proportional altitude: short routes ~0.035, trans-oceanic routes ~0.12
  const maxAltitude = Math.min(0.12, Math.max(0.035, angle * 0.048))

  for (let i = 0; i <= segments; i++) {
    const t = i / segments

    // Smooth spherical interpolation (slerp along great circle)
    const pt = new THREE.Vector3().lerpVectors(start, end, t).normalize()

    // Smooth parabolic altitude curve peaking at midpoint
    const altitude = Math.sin(t * Math.PI) * maxAltitude
    pt.multiplyScalar(radius + altitude)

    points.push(pt)
  }

  return points
}
