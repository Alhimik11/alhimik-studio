"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import transmutationVertex from "@/shaders/hero/transmutation.vert.glsl";
import transmutationFragment from "@/shaders/hero/transmutation.frag.glsl";

type Props = {
  explodeProgress: number;
};

const PARTICLE_COUNT = 200;

export function TransmutationEffect({ explodeProgress }: Props) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const attributes = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const aIndex = new Float32Array(PARTICLE_COUNT);
    const aSeed = new Float32Array(PARTICLE_COUNT);

    for (let i = 0; i < PARTICLE_COUNT; i += 1) {
      aIndex[i] = i;
      aSeed[i] = Math.random();
    }

    return { positions, aIndex, aSeed };
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uCount: { value: PARTICLE_COUNT },
      uColorGold: { value: new THREE.Color("#d7b87f") },
      uColorViolet: { value: new THREE.Color("#b379ff") },
    }),
    [],
  );

  useFrame((state) => {
    if (!materialRef.current) {
      return;
    }

    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    materialRef.current.uniforms.uProgress.value = explodeProgress;
  });

  if (explodeProgress < 0.68) {
    return null;
  }

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[attributes.positions, 3]} />
        <bufferAttribute attach="attributes-aIndex" args={[attributes.aIndex, 1]} />
        <bufferAttribute attach="attributes-aSeed" args={[attributes.aSeed, 1]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexShader={transmutationVertex}
        fragmentShader={transmutationFragment}
        uniforms={uniforms}
      />
    </points>
  );
}
