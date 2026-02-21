"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

type Props = {
    scenes: THREE.Object3D[];
};

/**
 * Шейдерный оверлей поверх мешей логотипа.
 * Создаёт тонкие электрические разряды, бегущие по рёбрам модели:
 * — очень узкие полосы (WAVE_WIDTH = 0.06)
 * — видны ТОЛЬКО на краях/рёбрах (Fresnel ³)
 * — зубчатый шум для формы молнии
 * — мерцание
 */
export function LightningEffect({ scenes }: Props) {
    const groupRef = useRef<THREE.Group>(null!);

    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uWave0: { value: 0 },
            uWave1: { value: -2.5 },
            uWave2: { value: -5 },
        }),
        [],
    );

    const shaderMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms,
            transparent: true,
            depthWrite: false,
            side: THREE.FrontSide,
            blending: THREE.AdditiveBlending,
            vertexShader: /* glsl */ `
        varying vec3 vWorldPos;
        varying vec3 vViewDir;
        varying vec3 vNormal;

        void main() {
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPos = worldPos.xyz;
          vNormal = normalize((modelMatrix * vec4(normal, 0.0)).xyz);
          vViewDir = normalize(cameraPosition - worldPos.xyz);
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
            fragmentShader: /* glsl */ `
        uniform float uTime;
        uniform float uWave0;
        uniform float uWave1;
        uniform float uWave2;

        varying vec3 vWorldPos;
        varying vec3 vViewDir;
        varying vec3 vNormal;

        float hash(float n) {
          return fract(sin(n) * 43758.5453);
        }

        float noise1D(float x) {
          float i = floor(x);
          float f = fract(x);
          return mix(hash(i), hash(i + 1.0), f * f * (3.0 - 2.0 * f));
        }

        float boltWave(float coord, float wavePos, float width) {
          float dist = abs(coord - wavePos);
          // Зубчатость: шум делает ширину неравномерной
          float jagged = noise1D(coord * 40.0 + uTime * 8.0);
          float adjustedWidth = width * (0.3 + jagged * 0.7);
          float intensity = 1.0 - smoothstep(0.0, adjustedWidth, dist);
          // Мерцание
          float flicker = 0.6 + 0.4 * noise1D(uTime * 20.0 + coord * 5.0);
          return intensity * intensity * intensity * flicker;
        }

        void main() {
          // === Fresnel: ТОЛЬКО рёбра модели ===
          float NdotV = abs(dot(normalize(vNormal), normalize(vViewDir)));
          // Сильный Fresnel — видно только на рёбрах (silhouette)
          float fresnel = pow(1.0 - NdotV, 3.0);
          // Отсекаем всё кроме рёбер
          if (fresnel < 0.15) discard;

          float edgeMask = smoothstep(0.15, 0.6, fresnel);

          // === 3 волны по разным осям ===
          float w0 = boltWave(
            vWorldPos.x * 0.85 + vWorldPos.y * 0.35,
            uWave0, 0.06
          );
          float w1 = boltWave(
            vWorldPos.y * 0.9 + vWorldPos.x * 0.2,
            uWave1, 0.06
          );
          float w2 = boltWave(
            -vWorldPos.x * 0.5 + vWorldPos.y * 0.7 + vWorldPos.z * 0.3,
            uWave2, 0.06
          );

          float total = max(w0, max(w1, w2));
          total *= edgeMask;

          if (total < 0.01) discard;

          // Цвет: яркий core + фиолетовый ореол
          vec3 coreColor = vec3(0.9, 0.85, 1.0);
          vec3 glowColor = vec3(0.55, 0.3, 1.0);
          vec3 color = mix(glowColor, coreColor, total);

          gl_FragColor = vec4(color * (1.0 + total), total * 0.9);
        }
      `,
        });
    }, [uniforms]);

    /* ── клоны мешей с оверлей-шейдером ── */
    const overlayMeshes = useMemo(() => {
        const meshes: THREE.Mesh[] = [];
        scenes.forEach((scene) => {
            scene.updateMatrixWorld(true);
            scene.traverse((child) => {
                if (!(child as THREE.Mesh).isMesh) return;
                const src = child as THREE.Mesh;
                const overlay = new THREE.Mesh(src.geometry, shaderMaterial);
                overlay.matrixAutoUpdate = false;
                overlay.matrix.copy(src.matrixWorld);
                overlay.matrixWorldNeedsUpdate = true;
                overlay.frustumCulled = false;
                meshes.push(overlay);
            });
        });
        return meshes;
    }, [scenes, shaderMaterial]);

    useEffect(() => {
        const group = groupRef.current;
        overlayMeshes.forEach((m) => group.add(m));
        return () => {
            overlayMeshes.forEach((m) => group.remove(m));
        };
    }, [overlayMeshes]);

    const wavePos = useRef([0, -2.5, -5]);

    useFrame((state, delta) => {
        uniforms.uTime.value = state.clock.getElapsedTime();

        wavePos.current[0] += 0.6 * delta;
        wavePos.current[1] += 0.45 * delta;
        wavePos.current[2] += 0.35 * delta;

        for (let i = 0; i < 3; i++) {
            if (wavePos.current[i] > 3.5) {
                wavePos.current[i] = -3 - Math.random() * 2;
            }
        }

        uniforms.uWave0.value = wavePos.current[0];
        uniforms.uWave1.value = wavePos.current[1];
        uniforms.uWave2.value = wavePos.current[2];
    });

    return <group ref={groupRef} />;
}
