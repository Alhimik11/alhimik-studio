"use client";

import { useFrame } from "@react-three/fiber";
import { RoundedBox, Edges } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

/**
 * AR Product Configurator scene
 * -- RoundedBox product that cycles between gold/purple materials,
 *    surrounded by a thin wireframe phone frame --
 * Renders inside an existing R3F <Canvas>. Does NOT create its own Canvas.
 */

const COLOR_GOLD = new THREE.Color("#d4a843");
const COLOR_PURPLE = new THREE.Color("#8b5cf6");
const EMISSIVE_GOLD = new THREE.Color("#b8922e");
const EMISSIVE_PURPLE = new THREE.Color("#6d28d9");

function ProductBox() {
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);

  const currentColor = useMemo(() => new THREE.Color(), []);
  const currentEmissive = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }) => {
    if (!materialRef.current || !meshRef.current) return;
    const t = clock.getElapsedTime();

    // smooth color lerp between gold and purple
    const mix = (Math.sin(t * 0.6) + 1) * 0.5;
    currentColor.copy(COLOR_GOLD).lerp(COLOR_PURPLE, mix);
    currentEmissive.copy(EMISSIVE_GOLD).lerp(EMISSIVE_PURPLE, mix);
    materialRef.current.color.copy(currentColor);
    materialRef.current.emissive.copy(currentEmissive);

    // gentle bobbing
    meshRef.current.position.y = Math.sin(t * 1.2) * 0.08;
    meshRef.current.rotation.y = t * 0.25;
    meshRef.current.rotation.x = Math.sin(t * 0.4) * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <RoundedBox args={[0.9, 0.9, 0.9]} radius={0.12} smoothness={4}>
        <meshStandardMaterial
          ref={materialRef}
          color={COLOR_GOLD}
          emissive={EMISSIVE_GOLD}
          emissiveIntensity={0.25}
          metalness={0.6}
          roughness={0.25}
        />
      </RoundedBox>
    </mesh>
  );
}

function PhoneFrame() {
  const frameRef = useRef<THREE.Group>(null!);

  useFrame(({ clock }) => {
    if (!frameRef.current) return;
    const t = clock.getElapsedTime();
    // subtle counter-sway to the product
    frameRef.current.position.y = Math.sin(t * 1.2 + Math.PI) * 0.03;
    frameRef.current.rotation.z = Math.sin(t * 0.3) * 0.03;
  });

  // phone-shaped rectangle: portrait aspect (roughly 9:16-ish)
  const frameWidth = 1.6;
  const frameHeight = 2.6;

  return (
    <group ref={frameRef} position={[0, 0, -0.05]}>
      {/* main frame outline */}
      <mesh>
        <planeGeometry args={[frameWidth, frameHeight, 1, 1]} />
        <meshStandardMaterial
          color="#080412"
          transparent
          opacity={0.03}
          side={THREE.DoubleSide}
        />
        <Edges color="#8b5cf6" lineWidth={1} />
      </mesh>

      {/* inner screen outline */}
      <mesh position={[0, 0, 0.01]}>
        <planeGeometry args={[frameWidth - 0.2, frameHeight - 0.3, 1, 1]} />
        <meshStandardMaterial
          color="#0a0515"
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
        />
        <Edges color="#d4a843" lineWidth={0.6} />
      </mesh>

      {/* "camera" dot at top */}
      <mesh position={[0, frameHeight * 0.5 - 0.18, 0.02]}>
        <circleGeometry args={[0.04, 12]} />
        <meshStandardMaterial
          color="#6d28d9"
          emissive="#8b5cf6"
          emissiveIntensity={1.5}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

export function ARConfiguratorScene() {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.2} color="#1a0d2e" />
      <directionalLight
        position={[4, 3, 5]}
        intensity={0.9}
        color="#f5e6c8"
      />
      <directionalLight
        position={[-3, -2, -2]}
        intensity={0.35}
        color="#8b5cf6"
      />

      <ProductBox />
      <PhoneFrame />
    </>
  );
}
