import { useMemo, useRef } from 'react'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

// Custom GLSL Shader for Earth Surface with Realistic Terminator & City Lights
const EarthSurfaceShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldNormal;
    varying vec3 vViewPosition;

    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldNormal;
    varying vec3 vViewPosition;

    uniform sampler2D uDayMap;
    uniform sampler2D uSpecularMap;
    uniform sampler2D uNightMap;
    uniform vec3 uSunPosition;

    void main() {
      vec3 sunDir = normalize(uSunPosition);
      vec3 worldNormal = normalize(vWorldNormal);
      vec3 viewDir = normalize(vViewPosition);

      // Sample Earth Maps
      vec3 dayColor = texture2D(uDayMap, vUv).rgb;
      vec3 nightColor = texture2D(uNightMap, vUv).rgb;
      float oceanSpecularMask = texture2D(uSpecularMap, vUv).r;

      // 1. Calculate Sun Alignment on planetary curvature
      float sunDot = dot(worldNormal, sunDir);

      // 2. Physically realistic smooth terminator transition
      // Twilight zone smoothly spans from -0.15 (early dawn/dusk) to 0.25 (full daylight)
      float dayFactor = smoothstep(-0.15, 0.25, sunDot);
      float nightFactor = 1.0 - smoothstep(-0.05, 0.18, sunDot);

      // 3. Daylight diffuse illumination + subtle deep-space ambient fill
      float diffuse = max(0.0, sunDot);
      vec3 dayLight = dayColor * (diffuse * 1.12 + 0.025);

      // 4. Subtle ocean sunlight glint (specular reflection only on water surface)
      vec3 reflectDir = reflect(-sunDir, worldNormal);
      float specAngle = max(dot(viewDir, reflectDir), 0.0);
      float specular = pow(specAngle, 32.0) * oceanSpecularMask * 0.75 * dayFactor;
      vec3 oceanGlint = vec3(0.92, 0.96, 1.0) * specular;

      // 5. Night side: warm subtle city lights + dark terrain silhouette
      // City lights are warm amber, geographically concentrated, strictly absent in daylight
      vec3 cityLights = nightColor * vec3(1.15, 0.90, 0.62) * 1.4 * nightFactor;
      vec3 nightBase = dayColor * 0.015; // Faint terrain silhouette in deep space

      // 6. Final Composite blending day, specular glint, and city lights across terminator
      vec3 finalColor = mix(nightBase + cityLights, dayLight + oceanGlint, dayFactor);

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `,
}

export interface EarthSurfaceProps {
  sunPosition?: THREE.Vector3
}

export function EarthSurface({ sunPosition = new THREE.Vector3(6, 2.5, 4.5) }: EarthSurfaceProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  const [dayMap, specularMap, nightMap] = useTexture([
    '/textures/earth/earth_day.jpg',
    '/textures/earth/earth_specular.jpg',
    '/textures/earth/earth_night.jpg',
  ])

  const uniforms = useMemo(
    () => ({
      uDayMap: { value: dayMap },
      uSpecularMap: { value: specularMap },
      uNightMap: { value: nightMap },
      uSunPosition: { value: sunPosition },
    }),
    [dayMap, specularMap, nightMap, sunPosition]
  )

  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={EarthSurfaceShader.vertexShader}
        fragmentShader={EarthSurfaceShader.fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}
