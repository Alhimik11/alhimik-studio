"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";

type ServicePreviewCanvasProps = {
  variant: "vr" | "ar" | "ai" | "bim";
  compact?: boolean;
  interactive?: boolean;
};

function VRHeadset({ intensity }: { intensity: number }) {
  const groupRef = useRef<THREE.Group | null>(null);

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return;
    }

    const speed = 0.45 + intensity * 0.65;
    groupRef.current.rotation.y += delta * speed;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * (0.9 + intensity * 0.8)) * (0.15 + intensity * 0.08);
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <torusGeometry args={[0.86, 0.2, 22, 80, Math.PI]} />
        <meshPhysicalMaterial color="#d2b474" metalness={0.96} roughness={0.22} />
      </mesh>
      <mesh position={[0, -0.1, 0.25]}>
        <boxGeometry args={[1.15, 0.48, 0.4]} />
        <meshPhysicalMaterial color="#9a66ff" roughness={0.1} transmission={0.9} thickness={0.7} emissive="#7e43ea" emissiveIntensity={0.16 + intensity * 0.18} />
      </mesh>
      <mesh position={[-0.62, -0.08, 0.13]}>
        <boxGeometry args={[0.16, 0.42, 0.3]} />
        <meshStandardMaterial color="#cfaf70" metalness={0.9} roughness={0.26} />
      </mesh>
      <mesh position={[0.62, -0.08, 0.13]}>
        <boxGeometry args={[0.16, 0.42, 0.3]} />
        <meshStandardMaterial color="#cfaf70" metalness={0.9} roughness={0.26} />
      </mesh>
    </group>
  );
}

function ARCrystal({ intensity }: { intensity: number }) {
  const meshRef = useRef<THREE.Mesh | null>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) {
      return;
    }

    const speedY = 0.45 + intensity * 0.7;
    const speedX = 0.16 + intensity * 0.28;
    meshRef.current.rotation.y += delta * speedY;
    meshRef.current.rotation.x += delta * speedX;
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[1.05, 1]} />
      <meshPhysicalMaterial
        color="#9f62ff"
        roughness={0.04}
        transmission={0.95}
        thickness={0.85}
        ior={1.4}
        metalness={0.08}
        emissive="#8c54f6"
        emissiveIntensity={0.14 + intensity * 0.25}
      />
    </mesh>
  );
}

function AINetwork({ intensity }: { intensity: number }) {
  const groupRef = useRef<THREE.Group | null>(null);
  const pointsGeometryRef = useRef<THREE.BufferGeometry | null>(null);
  const linesGeometryRef = useRef<THREE.BufferGeometry | null>(null);
  const pointsMaterialRef = useRef<THREE.PointsMaterial | null>(null);
  const linesMaterialRef = useRef<THREE.LineBasicMaterial | null>(null);
  const { pointer } = useThree();

  const { baseNodes, nodePositions, linePositions, edges } = useMemo(() => {
    const nodes = Array.from({ length: 20 }).map(() => {
      return new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(2.1),
        THREE.MathUtils.randFloatSpread(2),
        THREE.MathUtils.randFloatSpread(1.5),
      );
    });

    const links: Array<[number, number]> = [];
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        if (nodes[i].distanceTo(nodes[j]) < 1.18) {
          links.push([i, j]);
        }
      }
    }

    const points = new Float32Array(nodes.length * 3);
    nodes.forEach((node, index) => {
      points[index * 3 + 0] = node.x;
      points[index * 3 + 1] = node.y;
      points[index * 3 + 2] = node.z;
    });

    const lines = new Float32Array(links.length * 6);
    links.forEach(([a, b], edgeIndex) => {
      const offset = edgeIndex * 6;
      lines[offset + 0] = nodes[a].x;
      lines[offset + 1] = nodes[a].y;
      lines[offset + 2] = nodes[a].z;
      lines[offset + 3] = nodes[b].x;
      lines[offset + 4] = nodes[b].y;
      lines[offset + 5] = nodes[b].z;
    });

    return {
      baseNodes: nodes,
      nodePositions: points,
      linePositions: lines,
      edges: links,
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current || !pointsGeometryRef.current || !linesGeometryRef.current) {
      return;
    }

    const pulse = 0.45 + intensity * 1.15;
    groupRef.current.rotation.y += delta * (0.25 + intensity * 0.35);
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * (0.7 + intensity)) * 0.15;

    const attractionX = pointer.x * 0.85 * intensity;
    const attractionY = pointer.y * 0.7 * intensity;

    for (let i = 0; i < baseNodes.length; i += 1) {
      const node = baseNodes[i];
      const index = i * 3;
      const wobble = Math.sin(state.clock.elapsedTime * 2.2 + i * 0.6) * 0.06 * pulse;
      const weight = 0.35 + (i % 5) * 0.12;
      const targetX = node.x + attractionX * weight;
      const targetY = node.y + attractionY * weight;
      const targetZ = node.z + wobble;

      nodePositions[index + 0] = THREE.MathUtils.lerp(nodePositions[index + 0], targetX, 0.08);
      nodePositions[index + 1] = THREE.MathUtils.lerp(nodePositions[index + 1], targetY, 0.08);
      nodePositions[index + 2] = THREE.MathUtils.lerp(nodePositions[index + 2], targetZ, 0.08);
    }

    edges.forEach(([a, b], edgeIndex) => {
      const offset = edgeIndex * 6;
      const aOffset = a * 3;
      const bOffset = b * 3;

      linePositions[offset + 0] = nodePositions[aOffset + 0];
      linePositions[offset + 1] = nodePositions[aOffset + 1];
      linePositions[offset + 2] = nodePositions[aOffset + 2];
      linePositions[offset + 3] = nodePositions[bOffset + 0];
      linePositions[offset + 4] = nodePositions[bOffset + 1];
      linePositions[offset + 5] = nodePositions[bOffset + 2];
    });

    pointsGeometryRef.current.attributes.position.needsUpdate = true;
    linesGeometryRef.current.attributes.position.needsUpdate = true;

    if (pointsMaterialRef.current) {
      pointsMaterialRef.current.size = 0.06 + intensity * 0.04;
      pointsMaterialRef.current.opacity = 0.82 + intensity * 0.16;
    }

    if (linesMaterialRef.current) {
      linesMaterialRef.current.opacity = 0.26 + intensity * 0.24;
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry ref={pointsGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial ref={pointsMaterialRef} color="#be84ff" size={0.06} transparent opacity={0.9} depthWrite={false} />
      </points>

      <lineSegments>
        <bufferGeometry ref={linesGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial ref={linesMaterialRef} color="#e3c98f" transparent opacity={0.3} />
      </lineSegments>
    </group>
  );
}

function BIMBuild({ intensity }: { intensity: number }) {
  const barsRef = useRef<Array<THREE.Mesh | null>>([]);
  const bars = useMemo(() => {
    return Array.from({ length: 10 }).map((_, index) => ({
      x: -0.9 + (index % 5) * 0.45,
      z: -0.5 + Math.floor(index / 5) * 0.5,
      height: THREE.MathUtils.randFloat(0.5, 1.8),
    }));
  }, []);

  useFrame((state) => {
    barsRef.current.forEach((mesh, index) => {
      if (!mesh) {
        return;
      }
      const pulse = 1.2 + intensity * 0.9;
      const target = Math.abs(Math.sin(state.clock.elapsedTime * pulse + index * 0.4)) * bars[index].height + 0.2;
      mesh.scale.y = THREE.MathUtils.lerp(mesh.scale.y, target, 0.08);
      mesh.position.y = mesh.scale.y * 0.22 - 0.4;
    });
  });

  return (
    <group>
      {bars.map((bar, index) => (
        <mesh
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          ref={(node) => {
            barsRef.current[index] = node;
          }}
          position={[bar.x, -0.2, bar.z]}
          scale={[1, 0.2, 1]}
        >
          <boxGeometry args={[0.26, 0.44, 0.26]} />
          <meshPhysicalMaterial
            color="#d6b97f"
            metalness={0.9}
            roughness={0.22}
            emissive="#5a33a2"
            emissiveIntensity={0.12 + intensity * 0.18}
          />
        </mesh>
      ))}
    </group>
  );
}

function VariantObject({
  variant,
  intensity,
}: {
  variant: ServicePreviewCanvasProps["variant"];
  intensity: number;
}) {
  switch (variant) {
    case "vr":
      return <VRHeadset intensity={intensity} />;
    case "ar":
      return <ARCrystal intensity={intensity} />;
    case "ai":
      return <AINetwork intensity={intensity} />;
    case "bim":
      return <BIMBuild intensity={intensity} />;
    default:
      return <ARCrystal intensity={intensity} />;
  }
}

export function ServicePreviewCanvas({ variant, compact = false, interactive = false }: ServicePreviewCanvasProps) {
  const intensity = interactive ? 1 : 0.25;

  return (
    <Canvas
      camera={{ position: compact ? [0, 0, 3.4] : [0, 0, 3.9], fov: compact ? 45 : 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={compact ? ["#0e061d"] : ["#0d0518"]} />
      <ambientLight intensity={0.34 + intensity * 0.18} />
      <directionalLight intensity={1.0 + intensity * 0.35} position={[2.4, 2, 2]} color="#be84ff" />
      <directionalLight intensity={0.76 + intensity * 0.32} position={[-2.4, -1.8, -1.8]} color="#d8b67b" />
      <Suspense fallback={null}>
        <VariantObject variant={variant} intensity={intensity} />
      </Suspense>
      <EffectComposer multisampling={0}>
        <Bloom
          intensity={0.35 + intensity * 0.9}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.42}
          mipmapBlur
          blendFunction={BlendFunction.SCREEN}
        />
      </EffectComposer>
    </Canvas>
  );
}
