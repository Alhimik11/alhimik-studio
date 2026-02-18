"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArcRotateCamera,
  Color3,
  Color4,
  CubeTexture,
  DirectionalLight,
  GlowLayer,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  PBRMaterial,
  Scene,
  TransformNode,
  Vector3,
  WebGPUEngine,
} from "@babylonjs/core";

type HeroWebGPUCanvasProps = {
  active: boolean;
  explodeProgress: number;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

export function HeroWebGPUCanvas({ active, explodeProgress }: HeroWebGPUCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRef(active);
  const explodeRef = useRef(explodeProgress);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [gpuState, setGpuState] = useState<"pending" | "ready" | "unsupported">("pending");

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    explodeRef.current = explodeProgress;
  }, [explodeProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    let engine: WebGPUEngine | null = null;
    let scene: Scene | null = null;
    let disposed = false;

    const onPointerMove = (event: PointerEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = (event.clientY / window.innerHeight) * 2 - 1;
      pointerRef.current.x = clamp(x, -1, 1);
      pointerRef.current.y = clamp(y, -1, 1);
    };

    const setupScene = async () => {
      const supported = await WebGPUEngine.IsSupportedAsync;
      if (!supported) {
        if (!disposed) {
          setGpuState("unsupported");
        }
        return;
      }

      engine = new WebGPUEngine(canvas, {
        antialias: true,
        adaptToDeviceRatio: true,
      });

      await engine.initAsync();
      if (disposed) {
        engine.dispose();
        return;
      }

      setGpuState("ready");
      scene = new Scene(engine);
      scene.clearColor = new Color4(0, 0, 0, 0);
      scene.ambientColor = new Color3(0.12, 0.08, 0.2);

      const camera = new ArcRotateCamera("hero-camera", -Math.PI / 2, Math.PI / 2.22, 6.4, Vector3.Zero(), scene);
      camera.fov = 0.76;
      camera.lowerRadiusLimit = 5.7;
      camera.upperRadiusLimit = 7.8;
      camera.lowerBetaLimit = 0.95;
      camera.upperBetaLimit = 1.8;
      camera.panningSensibility = 0;
      camera.wheelDeltaPercentage = 0;

      const environmentTexture = CubeTexture.CreateFromPrefilteredData(
        "https://assets.babylonjs.com/environments/environmentSpecular.env",
        scene,
      );
      environmentTexture.rotationY = Math.PI * 0.28;
      scene.environmentTexture = environmentTexture;
      scene.environmentIntensity = 1.45;

      const hemiLight = new HemisphericLight("hemi", new Vector3(0, 1, 0), scene);
      hemiLight.intensity = 0.7;
      hemiLight.diffuse = new Color3(0.67, 0.48, 1);
      hemiLight.specular = new Color3(0.92, 0.84, 1);
      hemiLight.groundColor = new Color3(0.12, 0.06, 0.18);

      const keyLight = new DirectionalLight("key", new Vector3(-0.55, -1, 0.35), scene);
      keyLight.position = new Vector3(3.4, 4.2, -2);
      keyLight.intensity = 2.4;
      keyLight.diffuse = new Color3(0.95, 0.84, 1);

      const rimLight = new DirectionalLight("rim", new Vector3(0.75, -0.95, -0.45), scene);
      rimLight.position = new Vector3(-4.5, 2.4, 3.5);
      rimLight.intensity = 2.1;
      rimLight.diffuse = new Color3(0.95, 0.78, 0.46);

      const glowLayer = new GlowLayer("hero-glow", scene, { blurKernelSize: 48 });
      glowLayer.intensity = 0.6;

      const goldMaterial = new PBRMaterial("gold", scene);
      goldMaterial.albedoColor = Color3.FromHexString("#d8b67b");
      goldMaterial.reflectivityColor = new Color3(0.95, 0.83, 0.6);
      goldMaterial.metallic = 1;
      goldMaterial.roughness = 0.2;
      goldMaterial.environmentIntensity = 1.85;
      goldMaterial.clearCoat.isEnabled = true;
      goldMaterial.clearCoat.intensity = 1;
      goldMaterial.clearCoat.roughness = 0.08;

      const crystalMaterial = new PBRMaterial("crystal", scene);
      crystalMaterial.albedoColor = Color3.FromHexString("#7d42ff");
      crystalMaterial.emissiveColor = Color3.FromHexString("#6c31d8").scale(0.4);
      crystalMaterial.metallic = 0.05;
      crystalMaterial.roughness = 0.07;
      crystalMaterial.alpha = 0.58;
      crystalMaterial.environmentIntensity = 2.2;
      crystalMaterial.clearCoat.isEnabled = true;
      crystalMaterial.clearCoat.intensity = 1;
      crystalMaterial.clearCoat.roughness = 0.05;
      crystalMaterial.subSurface.isRefractionEnabled = true;
      crystalMaterial.subSurface.indexOfRefraction = 1.45;
      crystalMaterial.subSurface.tintColor = Color3.FromHexString("#b379ff");
      crystalMaterial.subSurface.tintColorAtDistance = 2.4;

      const root = new TransformNode("alchemy-root", scene);

      const outerFrame = MeshBuilder.CreateTorus(
        "outer-frame",
        { diameter: 3.7, thickness: 0.28, tessellation: 6 },
        scene,
      );
      outerFrame.parent = root;
      outerFrame.rotation.set(Math.PI / 2, 0, Math.PI / 6);
      outerFrame.material = goldMaterial;

      const innerFrame = MeshBuilder.CreateTorus(
        "inner-frame",
        { diameter: 3.15, thickness: 0.18, tessellation: 6 },
        scene,
      );
      innerFrame.parent = root;
      innerFrame.rotation.set(Math.PI / 2, 0, Math.PI / 6);
      innerFrame.position.z = 0.08;
      innerFrame.material = crystalMaterial;

      const letterA = new TransformNode("letter-a", scene);
      letterA.parent = root;
      letterA.position.set(-0.14, -0.04, 0.2);

      const aLeft = MeshBuilder.CreateBox("a-left", { width: 0.24, height: 1.58, depth: 0.2 }, scene);
      aLeft.parent = letterA;
      aLeft.rotation.z = 0.28;
      aLeft.position.x = -0.35;
      aLeft.material = goldMaterial;

      const aRight = MeshBuilder.CreateBox("a-right", { width: 0.24, height: 1.58, depth: 0.2 }, scene);
      aRight.parent = letterA;
      aRight.rotation.z = -0.28;
      aRight.position.x = 0.06;
      aRight.material = goldMaterial;

      const aCross = MeshBuilder.CreateBox("a-cross", { width: 0.56, height: 0.2, depth: 0.2 }, scene);
      aCross.parent = letterA;
      aCross.position.set(-0.13, -0.24, 0.02);
      aCross.material = goldMaterial;

      const letterZ = new TransformNode("letter-z", scene);
      letterZ.parent = root;
      letterZ.position.set(0.55, -0.04, 0.34);

      const zTop = MeshBuilder.CreateBox("z-top", { width: 0.86, height: 0.2, depth: 0.2 }, scene);
      zTop.parent = letterZ;
      zTop.position.y = 0.45;
      zTop.material = crystalMaterial;

      const zBottom = MeshBuilder.CreateBox("z-bottom", { width: 0.86, height: 0.2, depth: 0.2 }, scene);
      zBottom.parent = letterZ;
      zBottom.position.y = -0.45;
      zBottom.material = crystalMaterial;

      const zMiddle = MeshBuilder.CreateBox("z-middle", { width: 0.2, height: 1.12, depth: 0.2 }, scene);
      zMiddle.parent = letterZ;
      zMiddle.rotation.z = -0.67;
      zMiddle.material = crystalMaterial;

      const sparks: Mesh[] = [];
      const sparkCount = 120;

      for (let i = 0; i < sparkCount; i += 1) {
        const spark = MeshBuilder.CreateSphere(`spark-${i}`, { diameter: 0.03, segments: 4 }, scene);
        spark.material = i % 3 === 0 ? goldMaterial : crystalMaterial;
        sparks.push(spark);
      }

      let elapsed = 0;
      engine.runRenderLoop(() => {
        if (!scene) {
          return;
        }

        const deltaSeconds = scene.getEngine().getDeltaTime() * 0.001;
        elapsed += deltaSeconds;

        const pointer = pointerRef.current;
        const explode = clamp(explodeRef.current, 0, 1);
        const motion = activeRef.current ? 1 : 0.25;

        const alphaTarget = -Math.PI / 2 + pointer.x * 0.26;
        const betaTarget = Math.PI / 2.22 - pointer.y * 0.08;
        const radiusTarget = 6.4 + explode * 1.2;

        camera.alpha += (alphaTarget - camera.alpha) * 0.05 * motion;
        camera.beta += (betaTarget - camera.beta) * 0.05 * motion;
        camera.radius += (radiusTarget - camera.radius) * 0.06 * motion;

        root.rotation.y += (pointer.x * 0.33 + explode * 0.38 - root.rotation.y) * 0.05 * motion;
        root.rotation.x += (-pointer.y * 0.2 + explode * 0.08 - root.rotation.x) * 0.05 * motion;
        root.position.y = Math.sin(elapsed * 0.95) * 0.08;

        outerFrame.position.set(explode * 0.92, explode * 0.26, -explode * 0.55);
        outerFrame.rotation.x = Math.PI / 2 + explode * 0.4;
        outerFrame.rotation.y = explode * 0.8;

        innerFrame.position.set(-explode * 1.04, -explode * 0.2, explode * 0.66);
        innerFrame.rotation.x = Math.PI / 2 - explode * 0.35;
        innerFrame.rotation.y = -explode * 0.72;

        letterA.position.set(-0.14 - explode * 1.24, -0.04 - explode * 0.55, 0.2 + explode * 1.05);
        letterA.rotation.set(explode * 0.62, -explode * 0.18, explode * 0.38);

        letterZ.position.set(0.55 + explode * 1.36, -0.04 + explode * 0.36, 0.34 + explode * 1.2);
        letterZ.rotation.set(-explode * 0.56, explode * 0.24, -explode * 0.44);

        for (let i = 0; i < sparkCount; i += 1) {
          const spark = sparks[i];
          const seed = i / sparkCount;
          const angle = elapsed * (0.33 + seed * 0.42) + seed * Math.PI * 10;
          const radius = 2.2 + Math.sin(elapsed * 1.4 + i * 0.37) * 0.32 + explode * 1.1;
          spark.position.set(
            Math.cos(angle) * radius,
            Math.sin(elapsed * 1.8 + i * 0.42) * 1.05,
            Math.sin(angle) * radius * 0.56,
          );

          const scale = 0.35 + Math.sin(elapsed * 2.2 + i) * 0.18;
          spark.scaling.setAll(Math.max(0.08, scale));
        }

        scene.render();
      });

      const onResize = () => {
        engine?.resize();
      };

      window.addEventListener("resize", onResize);

      scene.onDisposeObservable.add(() => {
        glowLayer.dispose();
        window.removeEventListener("resize", onResize);
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    void setupScene();

    return () => {
      disposed = true;
      window.removeEventListener("pointermove", onPointerMove);
      scene?.dispose();
      engine?.dispose();
    };
  }, []);

  return (
    <div className="absolute inset-0">
      <canvas ref={canvasRef} className="h-full w-full" aria-hidden="true" />
      {gpuState === "unsupported" && (
        <div className="absolute inset-0 grid place-items-center px-6 text-center">
          <p className="rounded-2xl border border-copper-300/40 bg-black/40 px-5 py-3 text-xs uppercase tracking-[0.2em] text-copper-100 backdrop-blur-md">
            WebGPU не поддерживается в текущем браузере
          </p>
        </div>
      )}
    </div>
  );
}
