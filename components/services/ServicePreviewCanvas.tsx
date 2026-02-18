"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

type ServicePreviewCanvasProps = {
  variant: "vr" | "ar" | "ai" | "bim";
  compact?: boolean;
};

function VRHeadset() {
  const groupRef = useRef<THREE.Group | null>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) {
      return;
    }
    groupRef.current.rotation.y += delta * 0.45;
    groupRef.current.rotation.x = Math.sin(performance.now() * 0.00065) * 0.15;
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.86, 0.2, 22, 80, Math.PI]} />
        <meshPhysicalMaterial color="#d2b474" metalness={0.96} roughness={0.22} />
      </mesh>
      <mesh position={[0, -0.1, 0.25]}>
        <boxGeometry args={[1.15, 0.48, 0.4]} />
        <meshPhysicalMaterial color="#9a66ff" roughness={0.1} transmission={0.9} thickness={0.7} />
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

function ARCrystal() {
  const meshRef = useRef<THREE.Mesh | null>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) {
      return;
    }
    meshRef.current.rotation.y += delta * 0.55;
    meshRef.current.rotation.x += delta * 0.18;
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
      />
    </mesh>
  );
}

function AINetwork() {
  const groupRef = useRef<THREE.Group | null>(null);

  const { points, lines } = useMemo(() => {
    const nodes = Array.from({ length: 18 }).map(() => {
      return new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(2),
        THREE.MathUtils.randFloatSpread(2),
        THREE.MathUtils.randFloatSpread(1.6),
      );
    });

    const linePositions: number[] = [];
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        if (nodes[i].distanceTo(nodes[j]) < 1.1) {
          linePositions.push(
            nodes[i].x,
            nodes[i].y,
            nodes[i].z,
            nodes[j].x,
            nodes[j].y,
            nodes[j].z,
          );
        }
      }
    }

    const pointPositions = new Float32Array(nodes.length * 3);
    nodes.forEach((point, index) => {
      pointPositions[index * 3 + 0] = point.x;
      pointPositions[index * 3 + 1] = point.y;
      pointPositions[index * 3 + 2] = point.z;
    });

    return {
      points: pointPositions,
      lines: new Float32Array(linePositions),
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return;
    }
    groupRef.current.rotation.y += delta * 0.25;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.7) * 0.2;
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[points, 3]} />
        </bufferGeometry>
        <pointsMaterial color="#b987ff" size={0.08} transparent opacity={0.88} />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[lines, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#e3c98f" transparent opacity={0.4} />
      </lineSegments>
    </group>
  );
}

function BIMBuild() {
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
      const target = Math.abs(Math.sin(state.clock.elapsedTime * 1.2 + index * 0.4)) * bars[index].height + 0.2;
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
          <meshPhysicalMaterial color="#d6b97f" metalness={0.9} roughness={0.22} emissive="#5a33a2" emissiveIntensity={0.12} />
        </mesh>
      ))}
    </group>
  );
}

function VariantObject({ variant }: { variant: ServicePreviewCanvasProps["variant"] }) {
  switch (variant) {
    case "vr":
      return <VRHeadset />;
    case "ar":
      return <ARCrystal />;
    case "ai":
      return <AINetwork />;
    case "bim":
      return <BIMBuild />;
    default:
      return <ARCrystal />;
  }
}

export function ServicePreviewCanvas({ variant, compact = false }: ServicePreviewCanvasProps) {
  return (
    <Canvas
      camera={{ position: compact ? [0, 0, 3.4] : [0, 0, 3.9], fov: compact ? 45 : 40 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={compact ? ["#100720"] : ["#0f071d"]} />
      <ambientLight intensity={0.45} />
      <directionalLight intensity={1.1} position={[2.4, 2, 2]} color="#b987ff" />
      <directionalLight intensity={0.85} position={[-2.4, -1.8, -1.8]} color="#d8b67b" />
      <Suspense fallback={null}>
        <VariantObject variant={variant} />
      </Suspense>
    </Canvas>
  );
}
