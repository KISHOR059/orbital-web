import { useMemo, useRef } from 'react'
import * as THREE from 'three'

// Physically-inspired Rayleigh Atmospheric Scattering Shader
const AtmosphereShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vViewPosition;
    varying vec3 vWorldNormal;

    void main() {
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
      vec3 worldNormal = normalize(vWorldNormal);
      vec3 sunDir = normalize(uSunPosition);

      // 1. Fresnel / Rim falloff (steep power curve: 0 across Earth disc, active only at glancing limb)
      float NdotV = clamp(dot(normal, viewDir), 0.0, 1.0);
      float fresnel = pow(1.0 - NdotV, uPower);

      // 2. Sunlight alignment (strictly 0.0 on shadow/night hemisphere)
      float sunDot = dot(worldNormal, sunDir);
      float sunLight = max(0.0, sunDot);
      float nightCutoff = smoothstep(0.0, 0.3, sunDot);

      // 3. Rayleigh forward/side scattering phase function
      float cosTheta = dot(viewDir, sunDir);
      float rayleighPhase = 0.75 * (1.0 + 0.5 * cosTheta * cosTheta);

      // 4. Combined atmospheric scattering intensity (zero emission, purely scattered light)
      float scattering = fresnel * sunLight * nightCutoff * rayleighPhase * uIntensity;

      // 5. Restrained natural color blend
      vec3 color = mix(uAtmosphereColor, uSunlitColor, clamp(sunDot * 0.7 + 0.3, 0.0, 1.0));

      float alpha = clamp(scattering, 0.0, 1.0);
      if (alpha < 0.002) discard;

      gl_FragColor = vec4(color * alpha, alpha);
    }
  `,
}

export interface EarthAtmosphereProps {
  radius?: number
  sunPosition?: THREE.Vector3
}

export function EarthAtmosphere({
  radius = 2.008,
  sunPosition = new THREE.Vector3(6, 2.5, 4.5),
}: EarthAtmosphereProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  const uniforms = useMemo(
    () => ({
      uSunPosition: { value: sunPosition },
      uAtmosphereColor: { value: new THREE.Color('#3b82f6') }, // Restrained Rayleigh space blue
      uSunlitColor: { value: new THREE.Color('#e0f2fe') },     // Soft daylight white-cyan limb
      uIntensity: { value: 0.75 },
      uPower: { value: 6.5 },                                  // High exponent = razor-thin haze
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
