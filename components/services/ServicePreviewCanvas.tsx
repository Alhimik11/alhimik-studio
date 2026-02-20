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
    <group ref={groupRef} position={[0, -0.52, 0]} scale={7.32}>
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
  const groupRef = useRef<THREE.Group>(null);
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const linesRef = useRef<THREE.LineSegments>(null);
  const pulsesRef = useRef<THREE.InstancedMesh>(null);

  const NODE_COUNT = 80;
  const CONNECTION_DIST = 1.3;
  const PULSE_COUNT = 25; 

  const { nodes, connections, pulses } = useMemo(() => {
    const nodesData = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      const phi = Math.acos(-1 + (2 * i) / NODE_COUNT);
      const theta = Math.sqrt(NODE_COUNT * Math.PI) * phi;
      const radius = 1.8 + Math.random() * 0.4;
      
      const basePos = new THREE.Vector3(
        radius * Math.cos(theta) * Math.sin(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(phi)
      );

      nodesData.push({
        basePos,
        currentPos: basePos.clone(),
        driftSpeed: 0.2 + Math.random() * 0.5,
        driftOffset: new THREE.Vector3(Math.random() * 10, Math.random() * 10, Math.random() * 10),
        pulseSpeed: 1 + Math.random() * 2,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    const connectionsData = [];
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (nodesData[i].basePos.distanceTo(nodesData[j].basePos) < CONNECTION_DIST) {
          connectionsData.push([i, j]);
        }
      }
    }

    const pulsesData = [];
    for (let i = 0; i < PULSE_COUNT; i++) {
      const connIndex = Math.floor(Math.random() * connectionsData.length);
      const [startNode, endNode] = connectionsData[connIndex];
      
      pulsesData.push({
        source: startNode,
        target: endNode,
        progress: Math.random(),
        speed: 0.02 + Math.random() * 0.03,
      });
    }

    return { nodes: nodesData, connections: connectionsData, pulses: pulsesData };
  }, []);

  const lineGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(connections.length * 6);
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [connections]);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!groupRef.current || !nodesRef.current || !linesRef.current || !pulsesRef.current) return;
    
    const t = state.clock.elapsedTime;
    
    // -----------------------------------------------------------------
    // МАГИЯ МЫШИ (Параллакс и вращение)
    // state.mouse хранит координаты от -1 до +1
    // Мы комбинируем базовое медленное вращение с позицией мыши
    // -----------------------------------------------------------------
    const targetRotationX = (state.mouse.y * 0.5) + (t * 0.05);
    const targetRotationY = (state.mouse.x * 0.5) + (t * 0.1);
    
    // THREE.MathUtils.lerp делает движение плавным (сглаживание 5%)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.05);

    // Сетка немного "тянется" в сторону курсора
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, state.mouse.x * 0.4, 0.05);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, state.mouse.y * 0.4, 0.05);


    // Обновляем узлы (дрейф и пульсация)
    nodes.forEach((node, i) => {
      const driftX = Math.sin(t * node.driftSpeed + node.driftOffset.x) * 0.15;
      const driftY = Math.cos(t * node.driftSpeed + node.driftOffset.y) * 0.15;
      const driftZ = Math.sin(t * node.driftSpeed + node.driftOffset.z) * 0.15;
      
      node.currentPos.set(
        node.basePos.x + driftX,
        node.basePos.y + driftY,
        node.basePos.z + driftZ
      );

      dummy.position.copy(node.currentPos);
      const scale = 1 + Math.sin(t * node.pulseSpeed + node.pulseOffset) * 0.4;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      nodesRef.current!.setMatrixAt(i, dummy.matrix);
    });
    nodesRef.current.instanceMatrix.needsUpdate = true;

    // Обновляем линии
    const positions = linesRef.current.geometry.attributes.position.array as Float32Array;
    let posIdx = 0;
    connections.forEach(([a, b]) => {
      positions[posIdx++] = nodes[a].currentPos.x;
      positions[posIdx++] = nodes[a].currentPos.y;
      positions[posIdx++] = nodes[a].currentPos.z;
      positions[posIdx++] = nodes[b].currentPos.x;
      positions[posIdx++] = nodes[b].currentPos.y;
      positions[posIdx++] = nodes[b].currentPos.z;
    });
    linesRef.current.geometry.attributes.position.needsUpdate = true;

    // Обновляем импульсы
    pulses.forEach((pulse, i) => {
      pulse.progress += pulse.speed + (intensity * 0.02); 
      
      if (pulse.progress >= 1) {
        pulse.progress = 0;
        pulse.source = pulse.target;
        const possibleConnections = connections.filter(c => c[0] === pulse.source || c[1] === pulse.source);
        if (possibleConnections.length > 0) {
          const nextConn = possibleConnections[Math.floor(Math.random() * possibleConnections.length)];
          pulse.target = nextConn[0] === pulse.source ? nextConn[1] : nextConn[0];
        } else {
          const randomConn = connections[Math.floor(Math.random() * connections.length)];
          pulse.source = randomConn[0];
          pulse.target = randomConn[1];
        }
      }

      const sourcePos = nodes[pulse.source].currentPos;
      const targetPos = nodes[pulse.target].currentPos;
      dummy.position.lerpVectors(sourcePos, targetPos, pulse.progress);
      
      dummy.scale.set(0.6, 0.6, 0.6); 
      dummy.updateMatrix();
      pulsesRef.current!.setMatrixAt(i, dummy.matrix);
    });
    pulsesRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <group ref={groupRef}>
      <instancedMesh ref={nodesRef} args={[undefined, undefined, NODE_COUNT]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshBasicMaterial color="#a760ff" transparent opacity={0.6} />
      </instancedMesh>

      <lineSegments ref={linesRef} geometry={lineGeometry}>
        <lineBasicMaterial color="#7b42cc" transparent opacity={0.25} />
      </lineSegments>

      <instancedMesh ref={pulsesRef} args={[undefined, undefined, PULSE_COUNT]}>
        <sphereGeometry args={[0.06, 8, 8]} />
        {/* HDR Цвет для яркого свечения: значения больше 1 делают объект источником света для Bloom */}
        <meshBasicMaterial color={[1.5, 3.5, 4.0]} toneMapped={false} />
      </instancedMesh>
    </group>
  );
}
function BIMBuild({ intensity }: { intensity: number }) {
  const buildingRefs = useRef<Array<THREE.Group | null>>([]);
  const floorRefs = useRef<Array<Array<THREE.Group | null>>>([]);
  const crownRefs = useRef<Array<THREE.Mesh | null>>([]);
  const buildings = useMemo(() => {
    return [
      { id: "b1", x: -1.02, z: 0.03, width: 0.21, depth: 0.18, floors: 5, phase: 0.16 },
      { id: "b2", x: -0.67, z: -0.04, width: 0.26, depth: 0.22, floors: 8, phase: 0.95 },
      { id: "b3", x: -0.3, z: 0.06, width: 0.24, depth: 0.2, floors: 6, phase: 1.82 },
      { id: "b4", x: 0.06, z: -0.05, width: 0.28, depth: 0.23, floors: 10, phase: 2.63 },
      { id: "b5", x: 0.43, z: 0.04, width: 0.23, depth: 0.19, floors: 7, phase: 3.48 },
      { id: "b6", x: 0.82, z: -0.02, width: 0.31, depth: 0.25, floors: 11, phase: 4.36 },
    ];
  }, []);
  const floorStep = 0.18;

  useFrame((state) => {
    const elapsed = state.clock.elapsedTime;
    buildings.forEach((building, buildingIndex) => {
      const root = buildingRefs.current[buildingIndex];
      if (root) {
        root.rotation.y = THREE.MathUtils.lerp(
          root.rotation.y,
          Math.sin(elapsed * 0.25 + buildingIndex * 0.8) * 0.025,
          0.04,
        );
      }

      const speed = 0.42 + intensity * 0.28;
      const timeline = elapsed * speed + building.phase;
      const triangle = 1 - Math.abs((timeline % 2) - 1);
      const progress = triangle * triangle * (3 - 2 * triangle);
      const floorsProgress = progress * (building.floors + 0.85);

      for (let floorIndex = 0; floorIndex < building.floors; floorIndex += 1) {
        const floorGroup = floorRefs.current[buildingIndex]?.[floorIndex];
        if (!floorGroup) {
          continue;
        }

        const local = THREE.MathUtils.clamp(floorsProgress - floorIndex, 0, 1);
        const eased = local * local * (3 - 2 * local);
        floorGroup.visible = eased > 0.01;
        floorGroup.scale.y = THREE.MathUtils.lerp(floorGroup.scale.y, Math.max(0.001, eased), 0.14);
        floorGroup.position.y = THREE.MathUtils.lerp(
          floorGroup.position.y,
          0.16 + floorIndex * floorStep + floorGroup.scale.y * floorStep * 0.5,
          0.14,
        );
      }

      const crown = crownRefs.current[buildingIndex];
      if (crown) {
        const cap = THREE.MathUtils.clamp(floorsProgress - building.floors + 0.1, 0, 1);
        const capEased = cap * cap * (3 - 2 * cap);
        crown.visible = capEased > 0.01;
        crown.scale.y = THREE.MathUtils.lerp(crown.scale.y, Math.max(0.001, capEased), 0.12);
        crown.position.y = 0.18 + building.floors * floorStep + crown.scale.y * 0.09;
      }
    });
  });

  return (
    <group position={[0, -0.74, 0]}>
      {buildings.map((building, buildingIndex) => {
        return (
          <group
            key={building.id}
            ref={(node) => {
              buildingRefs.current[buildingIndex] = node;
            }}
            position={[building.x, 0, building.z]}
          >
            <mesh position={[0, 0.06, 0]} scale={[building.width * 1.4, 0.12, building.depth * 1.35]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshPhysicalMaterial
                color="#7a5ea5"
                metalness={0.7}
                roughness={0.35}
                emissive="#2b1246"
                emissiveIntensity={0.2}
              />
            </mesh>

            {Array.from({ length: building.floors }).map((_, floorIndex) => {
              const taper = 1 - Math.min(0.22, floorIndex * 0.03);
              const floorWidth = building.width * taper;
              const floorDepth = building.depth * (1 - Math.min(0.18, floorIndex * 0.025));
              const warmWindow = (floorIndex + buildingIndex) % 2 === 0;
              const windowColor = warmWindow ? "#d8b67b" : "#9f62ff";
              const windowBase = warmWindow ? "#2d1a08" : "#150b27";
              const frontCols = Math.max(2, Math.min(5, Math.round(floorWidth * 14)));
              const sideCols = Math.max(1, Math.min(3, Math.round(floorDepth * 16)));
              const frontXs = Array.from({ length: frontCols }).map((__, col) =>
                THREE.MathUtils.lerp(-floorWidth * 0.34, floorWidth * 0.34, col / Math.max(1, frontCols - 1)),
              );
              const sideZs = Array.from({ length: sideCols }).map((__, col) =>
                THREE.MathUtils.lerp(-floorDepth * 0.32, floorDepth * 0.32, col / Math.max(1, sideCols - 1)),
              );
              const windowWFront = Math.max(0.026, Math.min(0.058, floorWidth * 0.16));
              const windowWSide = Math.max(0.022, Math.min(0.05, floorDepth * 0.19));
              const windowH = 0.062;

              return (
                <group
                  key={`${building.id}-floor-${floorIndex}`}
                  ref={(node) => {
                    if (!floorRefs.current[buildingIndex]) {
                      floorRefs.current[buildingIndex] = [];
                    }
                    floorRefs.current[buildingIndex][floorIndex] = node;
                  }}
                  position={[0, 0.16 + floorIndex * floorStep, 0]}
                  scale={[1, 0.001, 1]}
                >
                  <mesh scale={[floorWidth, floorStep * 0.9, floorDepth]}>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshPhysicalMaterial
                      color="#d6b97f"
                      metalness={0.9}
                      roughness={0.24}
                      clearcoat={0.8}
                      emissive="#40215f"
                      emissiveIntensity={0.15 + intensity * 0.16}
                    />
                  </mesh>

                  {frontXs.map((x, col) => (
                    <mesh key={`${building.id}-win-f-${floorIndex}-${col}`} position={[x, 0, floorDepth * 0.505]}>
                      <planeGeometry args={[windowWFront, windowH]} />
                      <meshStandardMaterial
                        color={windowBase}
                        emissive={windowColor}
                        emissiveIntensity={0.82 + ((floorIndex + col + buildingIndex) % 2) * 0.35 + intensity * 0.18}
                        roughness={0.35}
                        metalness={0.04}
                      />
                    </mesh>
                  ))}
                  {frontXs.map((x, col) => (
                    <mesh
                      key={`${building.id}-win-b-${floorIndex}-${col}`}
                      position={[x, 0, -floorDepth * 0.505]}
                      rotation={[0, Math.PI, 0]}
                    >
                      <planeGeometry args={[windowWFront, windowH]} />
                      <meshStandardMaterial
                        color={windowBase}
                        emissive={windowColor}
                        emissiveIntensity={0.78 + ((floorIndex + col + buildingIndex + 1) % 2) * 0.31 + intensity * 0.16}
                        roughness={0.35}
                        metalness={0.04}
                      />
                    </mesh>
                  ))}
                  {sideZs.map((z, col) => (
                    <mesh
                      key={`${building.id}-win-l-${floorIndex}-${col}`}
                      position={[-floorWidth * 0.505, 0, z]}
                      rotation={[0, -Math.PI / 2, 0]}
                    >
                      <planeGeometry args={[windowWSide, windowH]} />
                      <meshStandardMaterial
                        color={windowBase}
                        emissive={windowColor}
                        emissiveIntensity={0.72 + ((floorIndex + col + buildingIndex) % 2) * 0.28 + intensity * 0.14}
                        roughness={0.35}
                        metalness={0.04}
                      />
                    </mesh>
                  ))}
                  {sideZs.map((z, col) => (
                    <mesh
                      key={`${building.id}-win-r-${floorIndex}-${col}`}
                      position={[floorWidth * 0.505, 0, z]}
                      rotation={[0, Math.PI / 2, 0]}
                    >
                      <planeGeometry args={[windowWSide, windowH]} />
                      <meshStandardMaterial
                        color={windowBase}
                        emissive={windowColor}
                        emissiveIntensity={0.72 + ((floorIndex + col + buildingIndex + 1) % 2) * 0.24 + intensity * 0.14}
                        roughness={0.35}
                        metalness={0.04}
                      />
                    </mesh>
                  ))}
                </group>
              );
            })}

            <mesh
              ref={(node) => {
                crownRefs.current[buildingIndex] = node;
              }}
              position={[0, 0.18 + building.floors * floorStep, 0]}
              scale={[building.width * 0.42, 0.001, building.depth * 0.42]}
            >
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color="#e3c98f" metalness={0.95} roughness={0.2} />
            </mesh>

            <mesh position={[building.width * 0.66, 0.32, building.depth * 0.1]} scale={[building.width * 0.46, 0.46, building.depth * 0.6]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshPhysicalMaterial
                color="#b79556"
                metalness={0.84}
                roughness={0.26}
                emissive="#331650"
                emissiveIntensity={0.18 + intensity * 0.16}
              />
            </mesh>
          </group>
        );
      })}
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
      <EffectComposer enableNormalPass={false} multisampling={8}>
        <Bloom 
          luminanceThreshold={1} // Светится только то, что ярче единицы (наши HDR молнии)
          mipmapBlur={true}      // Красивое, широкое размытие света
          intensity={1.5}        // Сила свечения
        />
      </EffectComposer>
    </Canvas>
  );
}

useGLTF.preload(PICO_MODEL_PATH);
useGLTF.preload(ROBOT_MODEL_PATH);
