"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import type { GLTF } from "three-stdlib";

type ServicePreviewCanvasProps = {
  variant: "vr" | "ar" | "ai" | "bim";
  compact?: boolean;
  interactive?: boolean;
};

type LoadedGLTF = GLTF & {
  scene: THREE.Group;
};

const PICO_MODEL_PATH = "/models/services/pico4/9d28311efdd749df803d10626bb5bf3d_Textured.gltf";
const ROBOT_MODEL_PATH = "/models/services/360_sphere_robot_no_glass.glb";

function prepareScene(scene: THREE.Group, envIntensity: number) {
  const cloned = scene.clone(true);
  cloned.traverse((node) => {
    const mesh = node as THREE.Mesh;
    if (!mesh.isMesh) {
      return;
    }

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((material) => {
      const standard = material as THREE.MeshStandardMaterial;
      if ("envMapIntensity" in standard) {
        standard.envMapIntensity = envIntensity;
      }
      if ("metalness" in standard && typeof standard.metalness === "number") {
        standard.metalness = Math.min(1, standard.metalness + 0.05);
      }
      standard.needsUpdate = true;
    });
  });
  return cloned;
}

function VRHeadsetModel({ intensity }: { intensity: number }) {
  const { pointer } = useThree();
  const groupRef = useRef<THREE.Group | null>(null);
  const gltf = useGLTF(PICO_MODEL_PATH) as LoadedGLTF;
  const model = useMemo(() => prepareScene(gltf.scene, 1.7), [gltf.scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return;
    }

    const speed = 0.16 + intensity * 0.5;
    groupRef.current.rotation.y += delta * speed;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      pointer.y * 0.22 + Math.sin(state.clock.elapsedTime * 0.9) * 0.06,
      0.08,
    );
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05 - 0.52;
  });

  return (
    <group ref={groupRef} position={[0, -0.52, 0]} scale={3.66}>
      <primitive object={model} />
    </group>
  );
}

function ARRobotModel({ intensity }: { intensity: number }) {
  const { pointer } = useThree();
  const groupRef = useRef<THREE.Group | null>(null);
  const gltf = useGLTF(ROBOT_MODEL_PATH) as LoadedGLTF;
  const model = useMemo(() => prepareScene(gltf.scene, 1.55), [gltf.scene]);

  useFrame((state, delta) => {
    if (!groupRef.current) {
      return;
    }

    const speed = 0.22 + intensity * 0.65;
    groupRef.current.rotation.y += delta * speed;
    groupRef.current.rotation.z = THREE.MathUtils.lerp(groupRef.current.rotation.z, -pointer.x * 0.18, 0.08);
    groupRef.current.position.y = Math.sin(state.clock.elapsedTime * (1.2 + intensity * 0.5)) * 0.08 - 0.26;
  });

  return (
    <group ref={groupRef} position={[0, -0.26, 0]} scale={4.65}>
      <primitive object={model} />
    </group>
  );
}

function AINetwork({ intensity }: { intensity: number }) {
  const groupRef = useRef<THREE.Group | null>(null);
  const pointsGeometryRef = useRef<THREE.BufferGeometry | null>(null);
  const linesGeometryRef = useRef<THREE.BufferGeometry | null>(null);
  const dischargeGeometryRef = useRef<THREE.BufferGeometry | null>(null);
  const sparksGeometryRef = useRef<THREE.BufferGeometry | null>(null);
  const pointsMaterialRef = useRef<THREE.PointsMaterial | null>(null);
  const linesMaterialRef = useRef<THREE.LineBasicMaterial | null>(null);
  const dischargeMaterialRef = useRef<THREE.LineBasicMaterial | null>(null);
  const sparksMaterialRef = useRef<THREE.PointsMaterial | null>(null);
  const { pointer } = useThree();

  const {
    baseNodes,
    nodePositions,
    linePositions,
    edges,
    discharges,
    dischargePositions,
    sparkPositions,
    cols,
    rows,
  } = useMemo(() => {
    const colsCount = 11;
    const rowsCount = 7;
    const spacingX = 0.34;
    const spacingY = 0.3;

    const nodes: THREE.Vector3[] = [];
    for (let row = 0; row < rowsCount; row += 1) {
      for (let col = 0; col < colsCount; col += 1) {
        nodes.push(
          new THREE.Vector3(
            (col - (colsCount - 1) / 2) * spacingX,
            (row - (rowsCount - 1) / 2) * spacingY,
            THREE.MathUtils.randFloatSpread(0.18),
          ),
        );
      }
    }

    const links: Array<[number, number]> = [];
    for (let row = 0; row < rowsCount; row += 1) {
      for (let col = 0; col < colsCount; col += 1) {
        const index = row * colsCount + col;
        if (col < colsCount - 1) {
          links.push([index, index + 1]);
        }
        if (row < rowsCount - 1) {
          links.push([index, index + colsCount]);
        }
        if (col < colsCount - 1 && row < rowsCount - 1 && Math.random() > 0.35) {
          links.push([index, index + colsCount + 1]);
        }
        if (col > 0 && row < rowsCount - 1 && Math.random() > 0.52) {
          links.push([index, index + colsCount - 1]);
        }
      }
    }

    const points = new Float32Array(nodes.length * 3);
    nodes.forEach((node, index) => {
      const offset = index * 3;
      points[offset + 0] = node.x;
      points[offset + 1] = node.y;
      points[offset + 2] = node.z;
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

    const dischargeCount = 24;
    const dischargeConfigs = Array.from({ length: dischargeCount }).map(() => ({
      edgeIndex: THREE.MathUtils.randInt(0, Math.max(links.length - 1, 0)),
      speed: THREE.MathUtils.randFloat(0.24, 0.62),
      phase: Math.random(),
      span: THREE.MathUtils.randFloat(0.08, 0.18),
    }));

    return {
      baseNodes: nodes,
      nodePositions: points,
      linePositions: lines,
      edges: links,
      discharges: dischargeConfigs,
      dischargePositions: new Float32Array(dischargeCount * 6),
      sparkPositions: new Float32Array(dischargeCount * 3),
      cols: colsCount,
      rows: rowsCount,
    };
  }, []);

  useFrame((state, delta) => {
    if (
      !groupRef.current ||
      !pointsGeometryRef.current ||
      !linesGeometryRef.current ||
      !dischargeGeometryRef.current ||
      !sparksGeometryRef.current
    ) {
      return;
    }

    const pulse = 0.82 + intensity * 0.95;
    const elapsed = state.clock.elapsedTime;
    groupRef.current.rotation.y += delta * (0.11 + intensity * 0.16);
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      Math.sin(elapsed * 0.42) * 0.08 + pointer.y * 0.08,
      0.06,
    );
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, pointer.x * 0.18, 0.06);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, pointer.y * 0.14, 0.06);

    const attractionX = pointer.x * (0.3 + intensity * 0.22);
    const attractionY = pointer.y * (0.24 + intensity * 0.18);

    for (let i = 0; i < baseNodes.length; i += 1) {
      const base = baseNodes[i];
      const offset = i * 3;
      const col = i % cols;
      const row = Math.floor(i / cols);
      const gx = col / Math.max(1, cols - 1);
      const gy = row / Math.max(1, rows - 1);
      const wavePrimary = Math.sin(elapsed * (0.92 + intensity * 0.4) + gx * 5.8 + gy * 3.1);
      const waveSecondary = Math.cos(elapsed * (1.16 + intensity * 0.35) + gy * 6.3 - gx * 3.4);
      const drift = Math.sin(elapsed * 0.62 + col * 0.44 + row * 0.31) * 0.02;
      const weight = 0.28 + (row % 3) * 0.11 + (col % 2) * 0.07;

      const targetX = base.x + attractionX * weight + drift;
      const targetY = base.y + attractionY * weight;
      const targetZ = base.z + (wavePrimary * 0.13 + waveSecondary * 0.08) * pulse;

      nodePositions[offset + 0] = THREE.MathUtils.lerp(nodePositions[offset + 0], targetX, 0.11);
      nodePositions[offset + 1] = THREE.MathUtils.lerp(nodePositions[offset + 1], targetY, 0.11);
      nodePositions[offset + 2] = THREE.MathUtils.lerp(nodePositions[offset + 2], targetZ, 0.11);
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

    const edgeCount = Math.max(edges.length, 1);
    discharges.forEach((discharge, dischargeIndex) => {
      const progress = (elapsed * discharge.speed + discharge.phase) % 1;
      if (progress < 0.018 && Math.random() > 0.72) {
        discharge.edgeIndex = THREE.MathUtils.randInt(0, edgeCount - 1);
      }

      const [a, b] = edges[discharge.edgeIndex % edgeCount] ?? [0, 0];
      const aOffset = a * 3;
      const bOffset = b * 3;
      const tail = Math.max(0, progress - discharge.span);
      const head = Math.min(1, progress + discharge.span * 0.38);
      const ax = nodePositions[aOffset + 0];
      const ay = nodePositions[aOffset + 1];
      const az = nodePositions[aOffset + 2];
      const bx = nodePositions[bOffset + 0];
      const by = nodePositions[bOffset + 1];
      const bz = nodePositions[bOffset + 2];

      const dischargeOffset = dischargeIndex * 6;
      dischargePositions[dischargeOffset + 0] = THREE.MathUtils.lerp(ax, bx, tail);
      dischargePositions[dischargeOffset + 1] = THREE.MathUtils.lerp(ay, by, tail);
      dischargePositions[dischargeOffset + 2] = THREE.MathUtils.lerp(az, bz, tail);
      dischargePositions[dischargeOffset + 3] = THREE.MathUtils.lerp(ax, bx, head);
      dischargePositions[dischargeOffset + 4] = THREE.MathUtils.lerp(ay, by, head);
      dischargePositions[dischargeOffset + 5] = THREE.MathUtils.lerp(az, bz, head);

      const sparkOffset = dischargeIndex * 3;
      sparkPositions[sparkOffset + 0] = dischargePositions[dischargeOffset + 3];
      sparkPositions[sparkOffset + 1] = dischargePositions[dischargeOffset + 4];
      sparkPositions[sparkOffset + 2] = dischargePositions[dischargeOffset + 5];
    });

    pointsGeometryRef.current.attributes.position.needsUpdate = true;
    linesGeometryRef.current.attributes.position.needsUpdate = true;
    dischargeGeometryRef.current.attributes.position.needsUpdate = true;
    sparksGeometryRef.current.attributes.position.needsUpdate = true;

    if (pointsMaterialRef.current) {
      pointsMaterialRef.current.size = 0.05 + intensity * 0.04;
      pointsMaterialRef.current.opacity = 0.78 + intensity * 0.18;
    }
    if (linesMaterialRef.current) {
      linesMaterialRef.current.opacity = 0.26 + intensity * 0.22;
    }
    if (dischargeMaterialRef.current) {
      dischargeMaterialRef.current.opacity = 0.58 + intensity * 0.24;
    }
    if (sparksMaterialRef.current) {
      sparksMaterialRef.current.size = 0.09 + intensity * 0.05;
      sparksMaterialRef.current.opacity = 0.82 + intensity * 0.14;
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry ref={pointsGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={pointsMaterialRef}
          color="#be84ff"
          size={0.06}
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments>
        <bufferGeometry ref={linesGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial ref={linesMaterialRef} color="#b379ff" transparent opacity={0.3} />
      </lineSegments>

      <lineSegments>
        <bufferGeometry ref={dischargeGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[dischargePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={dischargeMaterialRef}
          color="#d8b67b"
          transparent
          opacity={0.7}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      <points>
        <bufferGeometry ref={sparksGeometryRef}>
          <bufferAttribute attach="attributes-position" args={[sparkPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={sparksMaterialRef}
          color="#f0d29b"
          size={0.1}
          transparent
          opacity={0.9}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
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
      return <VRHeadsetModel intensity={intensity} />;
    case "ar":
      return <ARRobotModel intensity={intensity} />;
    case "ai":
      return <AINetwork intensity={intensity} />;
    case "bim":
      return <BIMBuild intensity={intensity} />;
    default:
      return <ARRobotModel intensity={intensity} />;
  }
}

export function ServicePreviewCanvas({ variant, compact = false, interactive = false }: ServicePreviewCanvasProps) {
  const intensity = interactive ? 1 : 0.25;

  return (
    <Canvas
      camera={{ position: compact ? [0, 0, 3.4] : [0, 0, 4.1], fov: compact ? 45 : 38 }}
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

useGLTF.preload(PICO_MODEL_PATH);
useGLTF.preload(ROBOT_MODEL_PATH);
