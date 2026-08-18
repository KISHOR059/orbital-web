import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Custom GLSL Shader for Rayleigh Atmospheric Scattering Glow
const AtmosphereShader = {
  vertexShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec3 vNormal;
    varying vec3 vPosition;
    uniform vec3 uColor;
    uniform float uIntensity;
    uniform float uPower;

    void main() {
      // View direction towards camera
      vec3 viewDir = normalize(-vPosition);
      
      // Fresnel rim calculation
      float fresnel = dot(viewDir, vNormal);
      fresnel = clamp(1.0 - fresnel, 0.0, 1.0);
      fresnel = pow(fresnel, uPower);

      // Atmospheric soft Rayleigh falloff
      vec3 glow = uColor * fresnel * uIntensity;
      gl_FragColor = vec4(glow, fresnel * 0.85);
    }
  `,
}

export function EarthAtmosphere({ radius = 2.07 }: { radius?: number }) {
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  const uniforms = useMemo(
    () => ({
      uColor: { value: new THREE.Color('#38bdf8') }, // Radiant cyan-blue atmospheric haze
      uIntensity: { value: 1.25 },
      uPower: { value: 3.8 },
    }),
    []
  )

  useFrame(() => {
    // Keeps shader uniforms reactive if needed
  })

  return (
    <mesh scale={[radius / 2, radius / 2, radius / 2]}>
      <sphereGeometry args={[2, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={AtmosphereShader.vertexShader}
        fragmentShader={AtmosphereShader.fragmentShader}
        uniforms={uniforms}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  )
}
