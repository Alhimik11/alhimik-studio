"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* -------------------------------------------------------------------------- */
/*  Interactive Showroom Scene                                                 */
/*  Reflective circular platform with a floating abstract glass shape above.   */
/*  Shape morphs rotation speed over time. Spotlight sweeps around it.         */
/*  Copper / gold palette.                                                     */
/* -------------------------------------------------------------------------- */

const PLATFORM_RADIUS = 1.8;
const PLATFORM_HEIGHT = 0.1;
const PLATFORM_SEGMENTS = 48;

function Platform() {
  return (
    <mesh position={[0, -0.6, 0]}>
      <cylinderGeometry
        args={[
          PLATFORM_RADIUS,
          PLATFORM_RADIUS,
          PLATFORM_HEIGHT,
          PLATFORM_SEGMENTS,
        ]}
      />
      <meshPhysicalMaterial
        color="#b87333"
        metalness={0.95}
        roughness={0.12}
        reflectivity={1}
        clearcoat={1}
        clearcoatRoughness={0.05}
      />
    </mesh>
  );
}

function FloatingShape() {
  const meshRef = useRef<THREE.Mesh>(null!);

  /** Low-poly icosahedron for the abstract glass object */
  const geometry = useMemo(() => {
    return new THREE.IcosahedronGeometry(0.65, 1);
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    /* Morphing rotation speed — accelerates and decelerates */
    const speedFactor = 0.4 + 0.3 * Math.sin(t * 0.3);
    meshRef.current.rotation.x += speedFactor * 0.012;
    meshRef.current.rotation.y += speedFactor * 0.018;
    meshRef.current.rotation.z += speedFactor * 0.006;

    /* Gentle hover bob */
    meshRef.current.position.y = 0.55 + Math.sin(t * 0.7) * 0.12;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, 0.55, 0]}>
      <meshPhysicalMaterial
        color="#e8c170"
        metalness={0.1}
        roughness={0.05}
        transmission={0.85}
        thickness={0.6}
        ior={1.5}
        transparent
        opacity={0.9}
        envMapIntensity={1}
      />
    </mesh>
  );
}

function SweepingSpotlight() {
  const lightRef = useRef<THREE.SpotLight>(null!);
  const targetRef = useRef<THREE.Object3D>(null!);

  /** Invisible target the spotlight tracks */
  const target = useMemo(() => new THREE.Object3D(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const angle = t * 0.5;
    const radius = 2.2;

    /* Sweep the light source around the scene */
    lightRef.current.position.set(
      Math.cos(angle) * radius,
      3.5,
      Math.sin(angle) * radius
    );

    /* Target stays at the floating object */
    target.position.set(0, 0.5, 0);
    lightRef.current.target = target;
  });

  return (
    <>
      <primitive object={target} />
      <spotLight
        ref={lightRef}
        intensity={4}
        color="#ffd699"
        angle={0.35}
        penumbra={0.7}
        distance={10}
        castShadow={false}
      />
    </>
  );
}

export function ShowroomScene() {
  return (
    <group>
      {/* Base lighting */}
      <ambientLight intensity={0.3} color="#ffe6cc" />
      <directionalLight
        position={[3, 5, 2]}
        intensity={0.8}
        color="#fff0dd"
      />

      {/* Sweeping accent spotlight */}
      <SweepingSpotlight />

      {/* Reflective platform */}
      <Platform />

      {/* Floating glass abstract shape */}
      <FloatingShape />

      {/* Rim / fill lights for depth */}
      <pointLight
        position={[-3, 1, -2]}
        intensity={0.6}
        color="#cc8844"
        distance={8}
      />
      <pointLight
        position={[2, 0.5, 3]}
        intensity={0.4}
        color="#ffc366"
        distance={6}
      />
    </group>
  );
}
