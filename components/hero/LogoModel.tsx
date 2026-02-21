"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { LightningEffect } from "@/components/hero/LightningEffect";

type LogoModelProps = {
  explodeProgress: number;
};

const MODEL_PATHS = {
  alhimik: "/models/ALHIMIK.glb",
  a: "/models/A.glb",
  z: "/models/Z.glb",
  ramki: "/models/Ramki.glb",
  ramka: "/models/Ramka.glb",
} as const;

const TARGET_SIZE = 3.6;

export function LogoModel({ explodeProgress }: LogoModelProps) {
  const alhimik = useGLTF(MODEL_PATHS.alhimik);
  const letterA = useGLTF(MODEL_PATHS.a);
  const letterZ = useGLTF(MODEL_PATHS.z);
  const ramki = useGLTF(MODEL_PATHS.ramki);
  const ramka = useGLTF(MODEL_PATHS.ramka);

  const rootRef = useRef<THREE.Group | null>(null);
  const contentRef = useRef<THREE.Group | null>(null);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);
  const { pointer } = useThree();

  const allGltf = useMemo(
    () => [alhimik, letterA, letterZ, ramki, ramka],
    [alhimik, letterA, letterZ, ramki, ramka],
  );

  /* ---------- Комбинированный bbox → autoScale + centerOffset ---------- */
  const { autoScale, centerOffset } = useMemo(() => {
    const combined = new THREE.Box3();
    allGltf.forEach(({ scene: s }) => {
      combined.union(new THREE.Box3().setFromObject(s));
    });

    const size = new THREE.Vector3();
    combined.getSize(size);
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = maxDim === 0 ? 1 : TARGET_SIZE / maxDim;

    const center = new THREE.Vector3();
    combined.getCenter(center);
    const offset = center.negate().multiplyScalar(scale);

    return { autoScale: scale, centerOffset: offset };
  }, [allGltf]);

  /* ---------- Начальные позиции И ВРАЩЕНИЯ для explode ---------- */
  const childData = useMemo(() => {
    const data: Array<{
      object: THREE.Object3D;
      basePosition: THREE.Vector3;
      baseRotation: THREE.Euler;
      explodeDirection: THREE.Vector3;
    }> = [];

    allGltf.forEach(({ scene: s }) => {
      s.traverse((child) => {
        if (child === s) return;
        if (!(child as THREE.Mesh).isMesh) return;

        const base = child.position.clone();
        const baseRot = child.rotation.clone();
        const worldPos = new THREE.Vector3();
        child.getWorldPosition(worldPos);

        const dir = worldPos.clone().normalize();
        if (dir.length() < 0.01) {
          dir
            .set(
              THREE.MathUtils.randFloatSpread(1),
              THREE.MathUtils.randFloatSpread(1),
              THREE.MathUtils.randFloatSpread(1),
            )
            .normalize();
        }

        data.push({
          object: child,
          basePosition: base,
          baseRotation: baseRot,
          explodeDirection: dir.multiplyScalar(THREE.MathUtils.randFloat(2.5, 5.0)),
        });
      });
    });

    return data;
  }, [allGltf]);

  /* ---------- Улучшаем оригинальные материалы ---------- */
  useEffect(() => {
    allGltf.forEach(({ scene: s }, partIndex) => {
      s.traverse((child) => {
        if (!(child as THREE.Mesh).isMesh) return;
        const mesh = child as THREE.Mesh;

        // partIndex 1 = letterA — делаем ярко-золотым
        if (partIndex === 1) {
          mesh.material = new THREE.MeshPhysicalMaterial({
            color: "#d7b87f",
            metalness: 0.95,
            roughness: 0.2,
            clearcoat: 1,
            clearcoatRoughness: 0.15,
            emissive: "#6b4e1f",
            emissiveIntensity: 0.6,
            envMapIntensity: 2.0,
          });
          return;
        }

        // Остальные модели — усиливаем оригинальные материалы
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((mat) => {
          if (mat instanceof THREE.MeshStandardMaterial) {
            mat.metalness = Math.max(mat.metalness, 0.7);
            mat.roughness = Math.min(mat.roughness, 0.35);
            mat.envMapIntensity = 1.5;
            mat.needsUpdate = true;
          }
        });
      });
    });
  }, [allGltf]);

  /* ---------- Встроенные анимации ---------- */
  useEffect(() => {
    const allAnims = allGltf.flatMap((g) => g.animations);
    if (allAnims.length === 0) return;

    const mixer = new THREE.AnimationMixer(alhimik.scene);
    mixerRef.current = mixer;
    allGltf.forEach((g) => {
      g.animations.forEach((clip) => {
        mixer.clipAction(clip, g.scene).play();
      });
    });

    return () => {
      mixer.stopAllAction();
      mixerRef.current = null;
    };
  }, [allGltf, alhimik.scene]);

  /* ---------- Per-frame ---------- */
  useFrame((state, delta) => {
    if (!rootRef.current) return;
    const elapsed = state.clock.getElapsedTime();

    mixerRef.current?.update(delta);

    // idle + pointer
    const idleTiltX = Math.sin(elapsed * 0.44) * 0.08;
    const idleTiltY = Math.cos(elapsed * 0.36) * 0.1;
    const pointerY = pointer.y * 0.22;
    const pointerX = pointer.x * 0.25;

    rootRef.current.rotation.x = THREE.MathUtils.damp(
      rootRef.current.rotation.x,
      pointerY + idleTiltX + explodeProgress * 0.08,
      4,
      delta,
    );
    rootRef.current.rotation.y = THREE.MathUtils.damp(
      rootRef.current.rotation.y,
      pointerX + idleTiltY + explodeProgress * 0.16,
      4,
      delta,
    );

    // float
    rootRef.current.position.y = THREE.MathUtils.damp(
      rootRef.current.position.y,
      Math.sin(elapsed * 0.7) * 0.06,
      4,
      delta,
    );

    // дыхание
    if (contentRef.current) {
      const s = autoScale * (1 + Math.sin(elapsed * 0.9) * 0.02);
      contentRef.current.scale.setScalar(
        THREE.MathUtils.damp(contentRef.current.scale.x, s, 4, delta),
      );
    }

    // explode / reset
    childData.forEach(({ object, basePosition, baseRotation, explodeDirection }) => {
      const target = basePosition
        .clone()
        .add(explodeDirection.clone().multiplyScalar(explodeProgress * 1.4));

      // Lerp позиции — более быстрый возврат при малом explodeProgress
      const lerpFactor = explodeProgress < 0.05 ? 0.15 : 0.09;
      object.position.lerp(target, lerpFactor);

      // Вращение при разлёте, но сброс к оригиналу при возврате
      if (explodeProgress > 0.05) {
        object.rotation.x += delta * explodeProgress * 0.5;
        object.rotation.y += delta * explodeProgress * 0.62;
      } else {
        // Возвращаем к исходным вращениям
        object.rotation.x = THREE.MathUtils.damp(
          object.rotation.x,
          baseRotation.x,
          5,
          delta,
        );
        object.rotation.y = THREE.MathUtils.damp(
          object.rotation.y,
          baseRotation.y,
          5,
          delta,
        );
        object.rotation.z = THREE.MathUtils.damp(
          object.rotation.z,
          baseRotation.z,
          5,
          delta,
        );
      }

      // Жёсткий сброс, если совсем близко к исходному состоянию
      if (explodeProgress < 0.001) {
        object.position.copy(basePosition);
        object.rotation.copy(baseRotation);
      }
    });
  });

  return (
    <group ref={rootRef}>
      <group ref={contentRef} scale={autoScale} position={centerOffset.toArray()}>
        <primitive object={alhimik.scene} />
        <primitive object={letterA.scene} />
        <primitive object={letterZ.scene} />
        <primitive object={ramki.scene} />
        <primitive object={ramka.scene} />
      </group>
      {/* Молнии вдоль рёбер лого */}
      <group scale={autoScale} position={centerOffset.toArray()}>
        <LightningEffect
          scenes={[alhimik.scene, letterA.scene, letterZ.scene, ramki.scene, ramka.scene]}
        />
      </group>
    </group>
  );
}

Object.values(MODEL_PATHS).forEach((p) => useGLTF.preload(p));
