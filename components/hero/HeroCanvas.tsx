"use client";

import { Suspense, useMemo, useRef } from "react";
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
import logoCrystalVertex from "@/shaders/hero/logoCrystal.vert.glsl";
import logoCrystalFragment from "@/shaders/hero/logoCrystal.frag.glsl";
import { useAppStore } from "@/lib/store/useAppStore";
import { TransmutationEffect } from "@/components/hero/TransmutationEffect";

type HeroCanvasProps = {
  active: boolean;
  explodeProgress: number;
};

type Vec3Tuple = [number, number, number];

const toVector3 = (value: Vec3Tuple) => new THREE.Vector3(value[0], value[1], value[2]);

function CameraRig({ explodeProgress }: { explodeProgress: number }) {
  const { camera, pointer } = useThree();

  useFrame((_, delta) => {
    camera.position.x = THREE.MathUtils.damp(camera.position.x, pointer.x * 0.5, 3.5, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, pointer.y * 0.34, 3.5, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, 5.2 + explodeProgress * 1.25, 3, delta);
    camera.lookAt(0, 0, 0);
  });

  return null;
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

function AlchemyLogo({ explodeProgress }: { explodeProgress: number }) {
  const rootRef = useRef<THREE.Group | null>(null);
  const outerFrameRef = useRef<THREE.Group | null>(null);
  const innerFrameRef = useRef<THREE.Group | null>(null);
  const letterARef = useRef<THREE.Group | null>(null);
  const letterZRef = useRef<THREE.Group | null>(null);
  const shardRefs = useRef<Array<THREE.Mesh | null>>([]);
  const crystalMaterialRef = useRef<THREE.ShaderMaterial | null>(null);
  const { pointer } = useThree();

  const crystalUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new THREE.Color("#9f62ff") },
      uColorB: { value: new THREE.Color("#6239d0") },
    }),
    [],
  );

  const shards = useMemo(() => {
    return Array.from({ length: 24 }).map(() => {
      const base = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(1.8),
        THREE.MathUtils.randFloatSpread(1.6),
        THREE.MathUtils.randFloat(-0.3, 0.7),
      );
      const explode = base.clone().normalize().multiplyScalar(THREE.MathUtils.randFloat(1.8, 3.8));
      return {
        base,
        explode,
        scale: THREE.MathUtils.randFloat(0.06, 0.16),
      };
    });
  }, []);

  useFrame((state, delta) => {
    crystalUniforms.uTime.value = state.clock.getElapsedTime();
    if (crystalMaterialRef.current) {
      crystalMaterialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }

    if (rootRef.current) {
      const pointerY = pointer.y * 0.22;
      const pointerX = pointer.x * 0.25;
      rootRef.current.rotation.x = THREE.MathUtils.damp(
        rootRef.current.rotation.x,
        pointerY + explodeProgress * 0.08,
        4,
        delta,
      );
      rootRef.current.rotation.y = THREE.MathUtils.damp(
        rootRef.current.rotation.y,
        pointerX + explodeProgress * 0.16,
        4,
        delta,
      );
    }

    const setPose = (
      target: THREE.Group | null,
      base: Vec3Tuple,
      explode: Vec3Tuple,
      rotationBase: Vec3Tuple = [0, 0, 0],
      rotationExplode: Vec3Tuple = [0, 0, 0],
    ) => {
      if (!target) {
        return;
      }

      const targetPosition = toVector3(base).add(toVector3(explode).multiplyScalar(explodeProgress * 1.4));
      target.position.lerp(targetPosition, 0.09);

      target.rotation.x = THREE.MathUtils.damp(
        target.rotation.x,
        rotationBase[0] + rotationExplode[0] * explodeProgress,
        5,
        delta,
      );
      target.rotation.y = THREE.MathUtils.damp(
        target.rotation.y,
        rotationBase[1] + rotationExplode[1] * explodeProgress,
        5,
        delta,
      );
      target.rotation.z = THREE.MathUtils.damp(
        target.rotation.z,
        rotationBase[2] + rotationExplode[2] * explodeProgress,
        5,
        delta,
      );
    };

    setPose(outerFrameRef.current, [0, 0, 0], [0.95, 0.32, -0.65], [0, 0, Math.PI / 6], [0.2, -0.8, 0.5]);
    setPose(innerFrameRef.current, [0, 0, 0.06], [-1.2, -0.48, 0.8], [0, 0, Math.PI / 6], [-0.28, 0.7, -0.2]);
    setPose(letterARef.current, [-0.08, -0.03, 0.2], [-1.62, -0.82, 1.24], [0, 0, 0], [0.9, -0.2, 0.38]);
    setPose(letterZRef.current, [0.24, -0.04, 0.35], [1.53, 0.62, 1.35], [0, 0, 0], [-0.82, 0.18, -0.56]);

    shardRefs.current.forEach((mesh, index) => {
      if (!mesh) {
        return;
      }

      const shard = shards[index];
      const pose = shard.base.clone().add(shard.explode.clone().multiplyScalar(explodeProgress));
      mesh.position.lerp(pose, 0.08);
      mesh.rotation.x += delta * (0.5 + index * 0.02);
      mesh.rotation.y += delta * (0.62 + index * 0.03);
    });
  });

  return (
    <group ref={rootRef}>
      <group ref={outerFrameRef}>
        <mesh>
          <ringGeometry args={[1.58, 1.9, 6]} />
          <meshPhysicalMaterial color="#d7b87f" metalness={0.98} roughness={0.18} clearcoat={1} clearcoatRoughness={0.16} />
        </mesh>
      </group>

      <group ref={innerFrameRef}>
        <mesh>
          <ringGeometry args={[1.37, 1.56, 6]} />
          <shaderMaterial
            ref={crystalMaterialRef}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            vertexShader={logoCrystalVertex}
            fragmentShader={logoCrystalFragment}
            uniforms={crystalUniforms}
          />
        </mesh>
      </group>

      <group ref={letterARef}>
        <mesh position={[-0.37, -0.01, 0]} rotation={[0, 0, 0.28]}>
          <boxGeometry args={[0.24, 1.45, 0.22]} />
          <meshPhysicalMaterial color="#d7b87f" metalness={1} roughness={0.19} clearcoat={1} />
        </mesh>
        <mesh position={[0.04, -0.01, 0]} rotation={[0, 0, -0.25]}>
          <boxGeometry args={[0.24, 1.45, 0.22]} />
          <meshPhysicalMaterial color="#d7b87f" metalness={1} roughness={0.19} clearcoat={1} />
        </mesh>
        <mesh position={[-0.15, -0.25, 0.03]}>
          <boxGeometry args={[0.53, 0.2, 0.2]} />
          <meshPhysicalMaterial color="#d7b87f" metalness={1} roughness={0.19} clearcoat={1} />
        </mesh>
      </group>

      <group ref={letterZRef}>
        <mesh position={[0.56, 0.42, 0.05]}>
          <boxGeometry args={[0.82, 0.19, 0.2]} />
          <shaderMaterial
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            vertexShader={logoCrystalVertex}
            fragmentShader={logoCrystalFragment}
            uniforms={crystalUniforms}
          />
        </mesh>
        <mesh position={[0.58, -0.46, 0.05]}>
          <boxGeometry args={[0.82, 0.19, 0.2]} />
          <shaderMaterial
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            vertexShader={logoCrystalVertex}
            fragmentShader={logoCrystalFragment}
            uniforms={crystalUniforms}
          />
        </mesh>
        <mesh position={[0.55, -0.01, 0.06]} rotation={[0, 0, -0.67]}>
          <boxGeometry args={[0.2, 1.1, 0.2]} />
          <shaderMaterial
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            vertexShader={logoCrystalVertex}
            fragmentShader={logoCrystalFragment}
            uniforms={crystalUniforms}
          />
        </mesh>
      </group>

      {shards.map((shard, index) => (
        <mesh
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          ref={(node) => {
            shardRefs.current[index] = node;
          }}
          position={shard.base.toArray() as Vec3Tuple}
          scale={shard.scale}
        >
          <tetrahedronGeometry args={[1, 0]} />
          <shaderMaterial
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            vertexShader={logoCrystalVertex}
            fragmentShader={logoCrystalFragment}
            uniforms={crystalUniforms}
          />
        </mesh>
      ))}
    </group>
  );
}

export function HeroCanvas({ active, explodeProgress }: HeroCanvasProps) {
  const aberrationOffset = useMemo(() => new THREE.Vector2(0.00075, 0.0012), []);
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
      camera={{ position: [0, 0.15, 5.2], fov: 41 }}
    >
      <color attach="background" args={["#080413"]} />
      <fogExp2 attach="fog" args={["#0b0718", 0.17]} />

      <Suspense fallback={null}>
        <ambientLight intensity={0.42} />
        <pointLight position={[2.6, 2.2, 2.1]} color="#b783ff" intensity={40} distance={8} decay={2.1} />
        <pointLight position={[-2.4, -2.2, 1.5]} color="#d5b575" intensity={28} distance={8} decay={2.1} />

        <Environment resolution={128}>
          <Lightformer intensity={2.4} color="#b783ff" position={[0, 2.1, 2]} scale={[3.6, 3.6, 1]} />
          <Lightformer intensity={1.8} color="#d5b575" position={[-1.8, -1.4, 2]} scale={[2.2, 2.2, 1]} />
          <mesh scale={18}>
            <sphereGeometry args={[1, 32, 32]} />
            <meshBasicMaterial side={THREE.BackSide} color="#12091f" />
          </mesh>
        </Environment>

        <ReactiveParticles count={particleCount} />
        <AlchemyLogo explodeProgress={explodeProgress} />
        {!reducedMotion && <TransmutationEffect explodeProgress={explodeProgress} />}
        <CameraRig explodeProgress={explodeProgress} />

        {enablePostProcessing && (
          <EffectComposer multisampling={0}>
            <Bloom intensity={0.9} luminanceThreshold={0.18} mipmapBlur />
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
