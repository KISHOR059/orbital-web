import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

// Shader for Clouds reacting to Sunlight Terminator
const CloudsShader = {
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vWorldNormal;

    void main() {
      vUv = uv;
      vWorldNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    varying vec2 vUv;
    varying vec3 vWorldNormal;
    uniform sampler2D uCloudMap;
    uniform vec3 uSunPosition;

    void main() {
      vec3 sunDir = normalize(uSunPosition);
      vec3 worldNormal = normalize(vWorldNormal);

      float cloudDensity = texture2D(uCloudMap, vUv).r;
      if (cloudDensity < 0.02) discard;

      float sunDot = dot(worldNormal, sunDir);
      float dayFactor = smoothstep(-0.15, 0.25, sunDot);

      // Sunlit clouds: crisp white with diffuse shadow depth
      float diffuse = max(0.0, sunDot);
      vec3 dayCloudColor = vec3(1.0, 1.0, 1.0) * (diffuse * 1.1 + 0.05);

      // Night clouds: faint, dark silhouette over city lights
      vec3 nightCloudColor = vec3(0.12, 0.15, 0.22) * 0.25;

      vec3 finalCloudColor = mix(nightCloudColor, dayCloudColor, dayFactor);
      float alpha = cloudDensity * mix(0.28, 0.82, dayFactor);

      gl_FragColor = vec4(finalCloudColor, alpha);
    }
  `,
}

export interface EarthCloudsProps {
  radius?: number
  sunPosition?: THREE.Vector3
}

export function EarthClouds({
  radius = 2.004,
  sunPosition = new THREE.Vector3(6, 2.5, 4.5),
}: EarthCloudsProps) {
  const cloudsRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)
  const cloudsMap = useTexture('/textures/earth/earth_clouds.jpg')

  const uniforms = useMemo(
    () => ({
      uCloudMap: { value: cloudsMap },
      uSunPosition: { value: sunPosition },
    }),
    [cloudsMap, sunPosition]
  )

  // Smooth independent cloud drift
  useFrame((_, delta) => {
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.035
    }
  })

  return (
    <mesh ref={cloudsRef} scale={[radius / 2, radius / 2, radius / 2]}>
      <sphereGeometry args={[2, 64, 64]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={CloudsShader.vertexShader}
        fragmentShader={CloudsShader.fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  )
}
