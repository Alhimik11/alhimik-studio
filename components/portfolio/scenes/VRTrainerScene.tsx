"use client";

import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

/**
 * VR Safety Training scene
 * -- wireframe dodecahedron "helmet" with pulsing warning spheres at vertices --
 * Renders inside an existing R3F <Canvas>. Does NOT create its own Canvas.
 */

function WarningNodes({ vertices }: { vertices: THREE.Vector3[] }) {
  const groupRef = useRef<THREE.Group>(null!);
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  const sphereGeo = useMemo(() => new THREE.SphereGeometry(0.045, 8, 6), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    materialsRef.current.forEach((mat, i) => {
      // staggered pulse per vertex
      const phase = t * 2.5 + i * 0.6;
      const pulse = 0.4 + 0.6 * ((Math.sin(phase) + 1) * 0.5);
      mat.emissiveIntensity = pulse * 2.2;
      // alternate between amber and red
      const mix = (Math.sin(t * 0.8 + i * 1.1) + 1) * 0.5;
      mat.emissive.lerpColors(
        new THREE.Color("#ff4444"),
        new THREE.Color("#ffaa33"),
        mix,
      );
    });
  });

  return (
    <group ref={groupRef}>
      {vertices.map((v, i) => (
        <mesh key={i} position={v} geometry={sphereGeo}>
          <meshStandardMaterial
            ref={(el) => {
              if (el) materialsRef.current[i] = el;
            }}
            color="#ffaa33"
            emissive="#ffaa33"
            emissiveIntensity={1}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

export function VRTrainerScene() {
  const helmetRef = useRef<THREE.Group>(null!);

  // extract unique vertices from a dodecahedron
  const vertices = useMemo(() => {
    const geo = new THREE.DodecahedronGeometry(1.15, 0);
    const posAttr = geo.getAttribute("position");
    const seen = new Map<string, THREE.Vector3>();

    for (let i = 0; i < posAttr.count; i++) {
      const x = Math.round(posAttr.getX(i) * 1000) / 1000;
      const y = Math.round(posAttr.getY(i) * 1000) / 1000;
      const z = Math.round(posAttr.getZ(i) * 1000) / 1000;
      const key = `${x},${y},${z}`;
      if (!seen.has(key)) {
        seen.set(key, new THREE.Vector3(x, y, z));
      }
    }

    geo.dispose();
    return Array.from(seen.values());
  }, []);

  useFrame(({ clock }) => {
    if (!helmetRef.current) return;
    const t = clock.getElapsedTime();
    helmetRef.current.rotation.y = t * 0.15;
    helmetRef.current.rotation.x = Math.sin(t * 0.1) * 0.12;
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.15} color="#331800" />
      <directionalLight
        position={[3, 4, 5]}
        intensity={0.7}
        color="#ffaa33"
      />
      <directionalLight
        position={[-2, -1, -3]}
        intensity={0.3}
        color="#ff4444"
      />

      <group ref={helmetRef}>
        {/* Main wireframe dodecahedron helmet */}
        <mesh>
          <dodecahedronGeometry args={[1.15, 0]} />
          <meshStandardMaterial
            color="#0a0400"
            transparent
            opacity={0.05}
          />
          <Edges
            threshold={15}
            color="#ffaa33"
            lineWidth={1.2}
          />
        </mesh>

        {/* Inner glow core */}
        <mesh>
          <dodecahedronGeometry args={[0.5, 0]} />
          <meshStandardMaterial
            color="#1a0800"
            emissive="#ff4444"
            emissiveIntensity={0.4}
            transparent
            opacity={0.15}
          />
        </mesh>

        {/* Pulsing warning nodes at each vertex */}
        <WarningNodes vertices={vertices} />
      </group>
    </>
  );
}
