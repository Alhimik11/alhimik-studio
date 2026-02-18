"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";

/* -------------------------------------------------------------------------- */
/*  BIM Digital Twin Scene                                                     */
/*  5 thin flat boxes stacked vertically — an exploded architectural model.    */
/*  Floors slide together and apart cyclically. Wireframe edges on each floor. */
/*  Blue (#4488ff) and white theme.                                            */
/* -------------------------------------------------------------------------- */

const FLOOR_COUNT = 5;
const FLOOR_WIDTH = 2.4;
const FLOOR_DEPTH = 1.6;
const FLOOR_HEIGHT = 0.08;

/** Spacing when fully collapsed vs fully exploded */
const GAP_COLLAPSED = 0.12;
const GAP_EXPLODED = 0.52;

/** Per-floor colour tints — lightest at top, deepest blue at bottom */
const FLOOR_COLORS: string[] = [
  "#1a5cbf",
  "#2b6fd4",
  "#4488ff",
  "#6da6ff",
  "#a8ccff",
];

interface FloorProps {
  index: number;
  color: string;
  groupRef: React.RefObject<THREE.Group>;
}

function Floor({ index, color, groupRef }: FloorProps) {
  const meshRef = useRef<THREE.Mesh>(null!);

  /* We vary each floor's width/depth slightly for visual interest */
  const scale = useMemo(() => {
    const factor = 1 - index * 0.04;
    return [FLOOR_WIDTH * factor, FLOOR_HEIGHT, FLOOR_DEPTH * factor] as const;
  }, [index]);

  return (
    <mesh ref={meshRef} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.85}
        roughness={0.35}
        metalness={0.15}
      />
      <Edges threshold={15} color="#ffffff" lineWidth={1} />
    </mesh>
  );
}

export function BIMTwinScene() {
  const groupRef = useRef<THREE.Group>(null!);
  const floorsRef = useRef<THREE.Group>(null!);

  /* Animate floor positions each frame */
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    /* Smooth ping-pong between 0 and 1 */
    const cycle = (Math.sin(t * 0.6) + 1) / 2; // 0 → 1 → 0 ...
    const gap = THREE.MathUtils.lerp(GAP_COLLAPSED, GAP_EXPLODED, cycle);

    if (floorsRef.current) {
      const children = floorsRef.current.children;
      const totalHeight = (FLOOR_COUNT - 1) * (FLOOR_HEIGHT + gap);
      const startY = -totalHeight / 2;

      for (let i = 0; i < children.length; i++) {
        children[i].position.y = startY + i * (FLOOR_HEIGHT + gap);
      }
    }

    /* Gentle rotation of the whole model */
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.15;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Lighting */}
      <ambientLight intensity={0.5} color="#b8d4ff" />
      <directionalLight
        position={[4, 6, 3]}
        intensity={1.2}
        color="#ffffff"
      />
      <directionalLight
        position={[-3, 2, -4]}
        intensity={0.4}
        color="#4488ff"
      />

      {/* Floors group */}
      <group ref={floorsRef}>
        {FLOOR_COLORS.map((color, i) => (
          <Floor key={i} index={i} color={color} groupRef={groupRef} />
        ))}
      </group>

      {/* Ground reference plane — subtle grid feel */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.4, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial
          color="#1a2a44"
          transparent
          opacity={0.3}
          roughness={1}
        />
        <Edges threshold={1} color="#4488ff" lineWidth={0.5} />
      </mesh>
    </group>
  );
}
