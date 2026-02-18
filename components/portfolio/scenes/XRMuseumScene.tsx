"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Edges } from "@react-three/drei";
import * as THREE from "three";

/* -------------------------------------------------------------------------- */
/*  XR Museum Installation Scene                                               */
/*  6 cubes in a 3x2 grid, each slowly rotating on different axes.            */
/*  Glowing edges with emissive material. 60 tiny particle dust motes         */
/*  drifting slowly. Warm purple / amber colour palette.                       */
/* -------------------------------------------------------------------------- */

const CUBE_SIZE = 0.38;
const GRID_COLS = 3;
const GRID_ROWS = 2;
const SPACING_X = 1.1;
const SPACING_Y = 1.1;
const PARTICLE_COUNT = 60;
const PARTICLE_SPREAD = 3.5;

/** Colour pairs [face colour, edge emissive colour] per cube */
const CUBE_STYLES: [string, string][] = [
  ["#5a2d82", "#e8a0ff"], // deep purple / light purple glow
  ["#6b3fa0", "#ffb347"], // medium purple / amber glow
  ["#7c4daa", "#ff9f1c"], // lighter purple / orange glow
  ["#4a2070", "#dda0ff"], // dark purple / lavender glow
  ["#8b5cf6", "#ffc470"], // vivid purple / warm gold glow
  ["#6d28d9", "#ffaa55"], // indigo-purple / amber glow
];

/** Rotation axis weights per cube index — ensures visual variety */
const ROTATION_AXES: [number, number, number][] = [
  [1, 0.3, 0],
  [0, 1, 0.5],
  [0.4, 0, 1],
  [0.7, 1, 0.2],
  [0, 0.5, 1],
  [1, 1, 0],
];

/* -------------------------------- Cube ------------------------------------ */

interface MuseumCubeProps {
  position: [number, number, number];
  faceColor: string;
  edgeColor: string;
  rotAxis: [number, number, number];
  speed: number;
}

function MuseumCube({
  position,
  faceColor,
  edgeColor,
  rotAxis,
  speed,
}: MuseumCubeProps) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * speed;
    ref.current.rotation.x = rotAxis[0] * t;
    ref.current.rotation.y = rotAxis[1] * t;
    ref.current.rotation.z = rotAxis[2] * t;
  });

  return (
    <mesh ref={ref} position={position}>
      <boxGeometry args={[CUBE_SIZE, CUBE_SIZE, CUBE_SIZE]} />
      <meshStandardMaterial
        color={faceColor}
        roughness={0.5}
        metalness={0.2}
        transparent
        opacity={0.75}
      />
      <Edges
        threshold={15}
        lineWidth={1.5}
      >
        <lineBasicMaterial color={edgeColor} />
      </Edges>
    </mesh>
  );
}

/* ----------------------------- Dust Particles ----------------------------- */

function DustParticles() {
  const pointsRef = useRef<THREE.Points>(null!);

  /** Initial random positions */
  const positions = useMemo(() => {
    const arr = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * PARTICLE_SPREAD;
      arr[i * 3 + 1] = (Math.random() - 0.5) * PARTICLE_SPREAD;
      arr[i * 3 + 2] = (Math.random() - 0.5) * PARTICLE_SPREAD;
    }
    return arr;
  }, []);

  /** Pre-computed per-particle drift velocities */
  const velocities = useMemo(() => {
    const arr: [number, number, number][] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr.push([
        (Math.random() - 0.5) * 0.003,
        (Math.random() - 0.5) * 0.002 + 0.001, // slight upward bias
        (Math.random() - 0.5) * 0.003,
      ]);
    }
    return arr;
  }, []);

  useFrame(() => {
    const geo = pointsRef.current.geometry;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    const arr = pos.array as Float32Array;
    const halfSpread = PARTICLE_SPREAD / 2;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;
      arr[ix] += velocities[i][0];
      arr[ix + 1] += velocities[i][1];
      arr[ix + 2] += velocities[i][2];

      /* Wrap around when a mote drifts out of bounds */
      if (arr[ix] > halfSpread) arr[ix] = -halfSpread;
      if (arr[ix] < -halfSpread) arr[ix] = halfSpread;
      if (arr[ix + 1] > halfSpread) arr[ix + 1] = -halfSpread;
      if (arr[ix + 1] < -halfSpread) arr[ix + 1] = halfSpread;
      if (arr[ix + 2] > halfSpread) arr[ix + 2] = -halfSpread;
      if (arr[ix + 2] < -halfSpread) arr[ix + 2] = halfSpread;
    }

    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={PARTICLE_COUNT}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ffd699"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

/* ------------------------------ Main Scene -------------------------------- */

export function XRMuseumScene() {
  /** Build the 3x2 grid of cubes */
  const cubes = useMemo(() => {
    const items: {
      position: [number, number, number];
      faceColor: string;
      edgeColor: string;
      rotAxis: [number, number, number];
      speed: number;
    }[] = [];

    let idx = 0;
    const offsetX = ((GRID_COLS - 1) * SPACING_X) / 2;
    const offsetY = ((GRID_ROWS - 1) * SPACING_Y) / 2;

    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        items.push({
          position: [
            col * SPACING_X - offsetX,
            row * SPACING_Y - offsetY,
            0,
          ],
          faceColor: CUBE_STYLES[idx][0],
          edgeColor: CUBE_STYLES[idx][1],
          rotAxis: ROTATION_AXES[idx],
          speed: 0.2 + idx * 0.06,
        });
        idx++;
      }
    }
    return items;
  }, []);

  return (
    <group>
      {/* Lighting — warm tones to match palette */}
      <ambientLight intensity={0.4} color="#e8d0ff" />
      <directionalLight
        position={[3, 4, 5]}
        intensity={0.9}
        color="#fff0dd"
      />
      <directionalLight
        position={[-4, 2, -3]}
        intensity={0.4}
        color="#d8a0ff"
      />
      <pointLight
        position={[0, 0, 2]}
        intensity={0.5}
        color="#ffb347"
        distance={6}
      />

      {/* Cube grid */}
      {cubes.map((props, i) => (
        <MuseumCube key={i} {...props} />
      ))}

      {/* Floating dust particles */}
      <DustParticles />
    </group>
  );
}
