"use client";

import { Suspense, useMemo, useRef, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { useAppStore } from "@/lib/store/useAppStore";
import { TransmutationEffect } from "@/components/hero/TransmutationEffect";
import { LogoModel } from "@/components/hero/LogoModel";

type HeroCanvasProps = {
  active: boolean;
  explodeProgress: number;
};

function CameraRig({ explodeProgress }: { explodeProgress: number }) {
  const { camera, pointer } = useThree();

  useFrame((_, delta) => {
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.x * 0.3, 3.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, pointer.y * 0.34, 3.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 5.2 + explodeProgress * 1.25, 3, delta);
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function StageOffset({ children }: { children: ReactNode }) {
  const groupRef = useRef<THREE.Group | null>(null);
  const { viewport, pointer } = useThree();

  useFrame((_, delta) => {
    if (!groupRef.current) {
      return;
    }

    const viewportOffset = Math.min(0.82, viewport.width * 0.11);
    const targetX = viewportOffset + pointer.x * 0.08;
    groupRef.current.position.x = THREE.MathUtils.damp(groupRef.current.position.x, targetX, 3.4, delta);
  });

  return <group ref={groupRef}>{children}</group>;
}

function ReactiveParticles({ count = 1400 }: { count?: number }) {
  const pointsRef = useRef<THREE.Points | null>(null);
  const { pointer } = useThree();

  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);

    for (let i = 0; i < count; i += 1) {
      const radius = THREE.MathUtils.randFloat(2.8, 8.2);
      const theta = THREE.MathUtils.randFloat(0, Math.PI * 2);
      const phi = THREE.MathUtils.randFloat(0, Math.PI);
      data[i * 3 + 0] = radius * Math.sin(phi) * Math.cos(theta);
      data[i * 3 + 1] = radius * Math.cos(phi) * 0.64;
      data[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }

    return data;
  }, [count]);

  useFrame((_, delta) => {
    if (!pointsRef.current) {
      return;
    }

    pointsRef.current.rotation.y += delta * 0.015;
    pointsRef.current.rotation.x += delta * 0.006;
    pointsRef.current.position.x = THREE.MathUtils.damp(pointsRef.current.position.x, pointer.x * 0.45, 5, delta);
    pointsRef.current.position.y = THREE.MathUtils.damp(pointsRef.current.position.y, pointer.y * 0.32, 5, delta);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#b987ff" size={0.02} transparent opacity={0.45} depthWrite={false} />
    </points>
  );
}

/* AlchemyLogo (primitive-based) removed — replaced by LogoModel (GLB) */

export function HeroCanvas({ active, explodeProgress }: HeroCanvasProps) {
  const aberrationOffset = useMemo(() => new THREE.Vector2(0.0011, 0.0017), []);
  const reducedMotion = useReducedMotion();
  const deviceTier = useAppStore((state) => state.deviceTier);

  const particleCount = deviceTier === "low" ? 400 : deviceTier === "mid" ? 800 : 1400;
  const dprRange: [number, number] = deviceTier === "low" ? [1, 1] : deviceTier === "mid" ? [1, 1.4] : [1, 1.8];
  const enablePostProcessing = deviceTier !== "low";

  return (
    <Canvas
      dpr={dprRange}
      frameloop={active && !reducedMotion ? "always" : "never"}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      camera={{ position: [0, 0.15, 5.1], fov: 40 }}
    >
      <color attach="background" args={["#080413"]} />
      <fogExp2 attach="fog" args={["#0b0718", 0.17]} />

      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <pointLight position={[2.6, 2.2, 2.1]} color="#b783ff" intensity={52} distance={9} decay={2.1} />
        <pointLight position={[-2.4, -2.2, 1.5]} color="#d5b575" intensity={38} distance={9} decay={2.1} />

        <Environment resolution={128}>
          <Lightformer intensity={3.5} color="#b783ff" position={[0, 2.1, 2]} scale={[3.8, 3.8, 1]} />
          <Lightformer intensity={2.7} color="#d5b575" position={[-1.8, -1.4, 2]} scale={[2.5, 2.5, 1]} />
          <mesh scale={18}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial side={THREE.BackSide} color="#12091f" />
          </mesh>
        </Environment>

        <ReactiveParticles count={particleCount} />
        <StageOffset>
          <LogoModel explodeProgress={explodeProgress} />
          {!reducedMotion && <TransmutationEffect explodeProgress={explodeProgress} />}
        </StageOffset>
        <CameraRig explodeProgress={explodeProgress} />

        {enablePostProcessing && (
          <EffectComposer multisampling={0}>
            <Bloom intensity={1.45} luminanceThreshold={0.08} luminanceSmoothing={0.35} mipmapBlur />
            {deviceTier === "high" ? (
              <ChromaticAberration
                blendFunction={BlendFunction.NORMAL}
                offset={aberrationOffset}
                radialModulation
                modulationOffset={0.35}
              />
            ) : (
              <></>
            )}
            <Noise opacity={0.05} premultiply blendFunction={BlendFunction.SOFT_LIGHT} />
          </EffectComposer>
        )}
      </Suspense>
    </Canvas>
  );
}
