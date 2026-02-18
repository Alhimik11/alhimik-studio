"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

type ServicePreviewCanvasProps = {
  variant: "vr" | "ar" | "ai" | "bim";
};

function VariantMesh({ variant }: { variant: ServicePreviewCanvasProps["variant"] }) {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const geometry = useMemo(() => {
    switch (variant) {
      case "vr":
        return new THREE.TorusKnotGeometry(0.85, 0.22, 300, 44);
      case "ar":
        return new THREE.IcosahedronGeometry(1.1, 1);
      case "ai":
        return new THREE.SphereGeometry(1.02, 80, 80);
      case "bim":
        return new THREE.OctahedronGeometry(1.2, 0);
      default:
        return new THREE.BoxGeometry(1, 1, 1);
    }
  }, [variant]);

  useFrame((_, delta) => {
    if (!meshRef.current) {
      return;
    }

    meshRef.current.rotation.x += delta * 0.22;
    meshRef.current.rotation.y += delta * 0.5;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshPhysicalMaterial
        color="#6be9ff"
        metalness={0.86}
        roughness={0.18}
        emissive="#1f88a5"
        emissiveIntensity={0.15}
        clearcoat={1}
        clearcoatRoughness={0.2}
      />
    </mesh>
  );
}

export function ServicePreviewCanvas({ variant }: ServicePreviewCanvasProps) {
  return (
    <Canvas camera={{ position: [0, 0, 3.8], fov: 40 }} dpr={[1, 1.5]}>
      <color attach="background" args={["#07101b"]} />
      <ambientLight intensity={0.5} />
      <directionalLight intensity={1.35} position={[2, 2, 3]} color="#6ed9ff" />
      <directionalLight intensity={0.8} position={[-2, -1.5, -2]} color="#ffb36f" />
      <Suspense fallback={null}>
        <VariantMesh variant={variant} />
      </Suspense>
    </Canvas>
  );
}
