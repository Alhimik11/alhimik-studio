"use client";

import { useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

/**
 * AI Neural Network scene
 * -- 20 small sphere nodes orbiting a pulsing central hub,
 *    connected by gold lines when within distance threshold --
 * Renders inside an existing R3F <Canvas>. Does NOT create its own Canvas.
 */

const NODE_COUNT = 20;
const CONNECTION_DISTANCE = 2.0;
const NODE_COLOR = new THREE.Color("#b987ff");
const LINE_COLOR = new THREE.Color("#e3c98f");
const CORE_COLOR = new THREE.Color("#b987ff");

type NodeData = {
  offset: THREE.Vector3;
  orbitRadius: number;
  orbitSpeed: number;
  orbitPhase: number;
  orbitTilt: number;
  tiltAxis: THREE.Vector3;
};

function generateNodes(): NodeData[] {
  const nodes: NodeData[] = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    const radius = 1.0 + Math.random() * 1.4;
    const tiltAngle = (Math.random() - 0.5) * Math.PI * 0.8;
    nodes.push({
      offset: new THREE.Vector3(
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
        (Math.random() - 0.5) * 0.2,
      ),
      orbitRadius: radius,
      orbitSpeed: 0.15 + Math.random() * 0.25,
      orbitPhase: Math.random() * Math.PI * 2,
      orbitTilt: tiltAngle,
      tiltAxis: new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5,
      ).normalize(),
    });
  }
  return nodes;
}

function NetworkLines({
  nodePositions,
}: {
  nodePositions: React.MutableRefObject<THREE.Vector3[]>;
}) {
  const lineRef = useRef<THREE.LineSegments>(null!);

  // pre-allocate buffer for max possible connections (every pair)
  const maxSegments = (NODE_COUNT * (NODE_COUNT - 1)) / 2;
  const positionsBuffer = useMemo(
    () => new Float32Array(maxSegments * 6),
    [maxSegments],
  );
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(positionsBuffer, 3),
    );
    geo.setDrawRange(0, 0);
    return geo;
  }, [positionsBuffer]);

  const material = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color: LINE_COLOR,
        transparent: true,
        opacity: 0.35,
        depthWrite: false,
      }),
    [],
  );

  useFrame(() => {
    if (!lineRef.current) return;
    const positions = nodePositions.current;
    let vertexIndex = 0;

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dist = positions[i].distanceTo(positions[j]);
        if (dist < CONNECTION_DISTANCE) {
          const base = vertexIndex * 6;
          positionsBuffer[base] = positions[i].x;
          positionsBuffer[base + 1] = positions[i].y;
          positionsBuffer[base + 2] = positions[i].z;
          positionsBuffer[base + 3] = positions[j].x;
          positionsBuffer[base + 4] = positions[j].y;
          positionsBuffer[base + 5] = positions[j].z;
          vertexIndex++;
        }
      }
    }

    geometry.setDrawRange(0, vertexIndex * 2);
    geometry.attributes.position.needsUpdate = true;
  });

  return <lineSegments ref={lineRef} geometry={geometry} material={material} />;
}

function CentralCore() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null!);

  useFrame(({ clock }) => {
    if (!meshRef.current || !materialRef.current) return;
    const t = clock.getElapsedTime();

    // breathing pulse
    const scale = 1 + Math.sin(t * 1.8) * 0.12;
    meshRef.current.scale.setScalar(scale);
    materialRef.current.emissiveIntensity = 0.6 + Math.sin(t * 2.4) * 0.4;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[0.22, 16, 12]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#b987ff"
        emissive={CORE_COLOR}
        emissiveIntensity={0.8}
        toneMapped={false}
      />
    </mesh>
  );
}

export function AIEngineScene() {
  const nodesData = useMemo(() => generateNodes(), []);
  const nodeRefs = useRef<(THREE.Mesh | null)[]>([]);
  const nodePositions = useRef<THREE.Vector3[]>(
    Array.from({ length: NODE_COUNT }, () => new THREE.Vector3()),
  );

  const sphereGeo = useMemo(() => new THREE.SphereGeometry(0.06, 8, 6), []);
  const tempQuat = useMemo(() => new THREE.Quaternion(), []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    nodesData.forEach((node, i) => {
      const mesh = nodeRefs.current[i];
      if (!mesh) return;

      // base orbit position in XZ plane
      const angle = t * node.orbitSpeed + node.orbitPhase;
      const x = Math.cos(angle) * node.orbitRadius + node.offset.x;
      const y = node.offset.y;
      const z = Math.sin(angle) * node.orbitRadius + node.offset.z;

      // apply tilt rotation around the node's tilt axis
      const pos = nodePositions.current[i];
      pos.set(x, y, z);
      tempQuat.setFromAxisAngle(node.tiltAxis, node.orbitTilt);
      pos.applyQuaternion(tempQuat);

      mesh.position.copy(pos);
    });
  });

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.15} color="#0d0520" />
      <directionalLight
        position={[3, 5, 4]}
        intensity={0.6}
        color="#e3c98f"
      />
      <directionalLight
        position={[-4, -2, -3]}
        intensity={0.3}
        color="#b987ff"
      />

      {/* Central pulsing hub */}
      <CentralCore />

      {/* Orbiting nodes */}
      {nodesData.map((_, i) => (
        <mesh
          key={i}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          geometry={sphereGeo}
        >
          <meshStandardMaterial
            color="#b987ff"
            emissive={NODE_COLOR}
            emissiveIntensity={0.7}
            toneMapped={false}
          />
        </mesh>
      ))}

      {/* Dynamic connection lines */}
      <NetworkLines nodePositions={nodePositions} />
    </>
  );
}
