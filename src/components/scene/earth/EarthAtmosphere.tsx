import { useMemo, useRef } from 'react'
import * as THREE from 'three'

// Physically-inspired Rayleigh Atmospheric Scattering Shader
const AtmosphereShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldNormal;

    void main() {
      // View-space normal and world-space normal
      vNormal = normalize(normalMatrix * normal);
      vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldNormal;
    uniform vec3 uSunPosition;
    uniform vec3 uAtmosphereColor;
    uniform vec3 uSunlitColor;
    uniform float uIntensity;
    uniform float uPower;

    void main() {
      vec3 viewDir = normalize(-vViewPosition);
      vec3 normal = normalize(vNormal);

      // 1. Fresnel / Rim calculation (0 on center crust, 1 at outer planetary limb)
      float NdotV = clamp(dot(normal, viewDir), 0.0, 1.0);
      float rim = pow(1.0 - NdotV, uPower);

      // 2. Sunlight alignment in world space
      vec3 sunDirWorld = normalize(uSunPosition);
      float sunDot = dot(normalize(vWorldNormal), sunDirWorld);

      // Soft sunlit modulation: Bright along illuminated limb, 0 on dark side
      float sunFactor = smoothstep(-0.08, 0.38, sunDot);

      // 3. Natural Rayleigh color grading (restrained blue to soft blue-white on sunlit limb)
      vec3 atmosphereColor = mix(uAtmosphereColor, uSunlitColor, clamp(sunDot * 0.75 + 0.25, 0.0, 1.0));

      // 4. Calculate final atmospheric radiance
      float alpha = rim * sunFactor * uIntensity;
      alpha = smoothstep(0.0, 0.9, alpha);

      if (alpha < 0.001) discard;

      gl_FragColor = vec4(atmosphereColor * alpha, alpha);
    }
  `,
}

export interface EarthAtmosphereProps {
  radius?: number
  sunPosition?: THREE.Vector3
}

export function EarthAtmosphere({
  radius = 2.03,
  sunPosition = new THREE.Vector3(6, 2.5, 4.5),
}: EarthAtmosphereProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  const uniforms = useMemo(
    () => ({
      uSunPosition: { value: sunPosition },
      uAtmosphereColor: { value: new THREE.Color('#4ba3e3') }, // Subtle Rayleigh blue
      uSunlitColor: { value: new THREE.Color('#d4efff') },     // Soft blue-white illuminated limb
      uIntensity: { value: 0.95 },
      uPower: { value: 4.2 },
    }),
    [sunPosition]
  )

  return (
    <mesh scale={[radius / 2, radius / 2, radius / 2]}>
      <sphereGeometry args={[2, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={AtmosphereShader.vertexShader}
        fragmentShader={AtmosphereShader.fragmentShader}
        uniforms={uniforms}
        blending={THREE.AdditiveBlending}
        side={THREE.FrontSide}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  )
}
