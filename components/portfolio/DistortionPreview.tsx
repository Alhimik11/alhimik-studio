"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import distortionVertexShader from "@/shaders/portfolio/distortion.vert.glsl";
import distortionFragmentShader from "@/shaders/portfolio/distortion.frag.glsl";

type DistortionPreviewProps = {
  imageUrl: string;
  hovered: boolean;
};

function DistortedImage({ imageUrl, hovered }: DistortionPreviewProps) {
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const hoverValueRef = useRef(0);
  const invalidate = useThree((state) => state.invalidate);

  const texture = useTexture(imageUrl);
  const displacement = useTexture("/textures/displacement.svg");
  const uniforms = useMemo(
    () => ({
      uTexture: { value: texture },
      uDisplacement: { value: displacement },
      uHover: { value: 0 },
    }),
    [displacement, texture],
  );

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    displacement.wrapS = THREE.RepeatWrapping;
    displacement.wrapT = THREE.RepeatWrapping;
    displacement.needsUpdate = true;
  }, [displacement, texture]);

  useEffect(() => {
    invalidate();
  }, [hovered, invalidate]);

  useFrame((_, delta) => {
    if (!materialRef.current) {
      return;
    }

    const target = hovered ? 1 : 0;
    hoverValueRef.current = THREE.MathUtils.damp(hoverValueRef.current, target, 6, delta);
    materialRef.current.uniforms.uHover.value = hoverValueRef.current;

    if (Math.abs(hoverValueRef.current - target) > 0.002) {
      invalidate();
    }
  });

  return (
    <mesh>
      <planeGeometry args={[1.8, 1.25, 1, 1]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={distortionVertexShader}
        fragmentShader={distortionFragmentShader}
      />
    </mesh>
  );
}

export function DistortionPreview({ imageUrl, hovered }: DistortionPreviewProps) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 2.5], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
    >
      <DistortedImage imageUrl={imageUrl} hovered={hovered} />
    </Canvas>
  );
}
