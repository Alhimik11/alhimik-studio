"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, Noise } from "@react-three/postprocessing";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";
import heroVertexShader from "@/shaders/hero/hero.vert.glsl";
import heroFragmentShader from "@/shaders/hero/hero.frag.glsl";

type HeroCanvasProps = {
  active: boolean;
};

function CameraRig() {
  const { camera, pointer } = useThree();

  useFrame((_, delta) => {
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.x * 0.28, 5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, pointer.y * 0.22, 5, delta);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points | null>(null);
  const sprite = useTexture("/textures/displacement.svg");
  const positions = useMemo(() => {
    const count = 850;
    const data = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const radius = THREE.MathUtils.randFloat(2.4, 5.2);
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(0, Math.PI);
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);

      data[i * 3 + 0] = x;
      data[i * 3 + 1] = y;
      data[i * 3 + 2] = z;
    }

    return data;
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) {
      return;
    }
    pointsRef.current.rotation.y += delta * 0.025;
    pointsRef.current.rotation.x += delta * 0.013;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.022}
        map={sprite}
        alphaMap={sprite}
        color="#79ebff"
        transparent
        opacity={0.45}
        depthWrite={false}
      />
    </points>
  );
}

function LiquidCore() {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const smoothMouse = useRef(new THREE.Vector2(0.5, 0.5));
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
    }),
    [],
  );
  const pointer = useThree((state) => state.pointer);

  useFrame((state, delta) => {
    if (!materialRef.current || !meshRef.current) {
      return;
    }

    const normalizedMouse = new THREE.Vector2(pointer.x * 0.5 + 0.5, pointer.y * 0.5 + 0.5);
    smoothMouse.current.lerp(normalizedMouse, 0.08);

    materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    materialRef.current.uniforms.uMouse.value.copy(smoothMouse.current);

    meshRef.current.rotation.y += delta * 0.24;
    meshRef.current.rotation.x += delta * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.8, 42]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={heroFragmentShader}
        vertexShader={heroVertexShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export function HeroCanvas({ active }: HeroCanvasProps) {
  return (
    <Canvas
      dpr={[1, 1.6]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      camera={{ position: [0, 0, 4.8], fov: 45 }}
    >
      <color attach="background" args={["#07080d"]} />
      <fog attach="fog" args={["#06090f", 4.5, 10]} />

      <Suspense fallback={null}>
        <ambientLight intensity={0.45} />
        <directionalLight position={[2.8, 2.5, 2]} intensity={1.1} color="#83ecff" />
        <directionalLight position={[-2, -1.4, -1.8]} intensity={0.5} color="#ffb16a" />
        <ParticleField />
        <LiquidCore />
        <CameraRig />
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.58} luminanceThreshold={0.22} mipmapBlur />
          <Noise opacity={0.03} />
        </EffectComposer>
      </Suspense>
    </Canvas>
  );
}
