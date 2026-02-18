"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArcRotateCamera,
  Color3,
  Color4,
  CubeTexture,
  DirectionalLight,
  DynamicTexture,
  GlowLayer,
  HemisphericLight,
  Mesh,
  MeshBuilder,
  PBRMaterial,
  Scene,
  StandardMaterial,
  Texture,
  TransformNode,
  Vector3,
  WebGPUEngine,
} from "@babylonjs/core";

type HeroWebGPUCanvasProps = {
  active: boolean;
  explodeProgress: number;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(value, max));

async function createKeyedLogoTexture(scene: Scene, imagePath: string) {
  const image = new Image();
  image.decoding = "async";
  image.src = imagePath;

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error("Failed to load logo image"));
  });

  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  const sourceCanvas = document.createElement("canvas");
  sourceCanvas.width = width;
  sourceCanvas.height = height;
  const sourceCtx = sourceCanvas.getContext("2d");

  if (!sourceCtx) {
    throw new Error("Canvas context not available");
  }

  sourceCtx.drawImage(image, 0, 0, width, height);
  const frame = sourceCtx.getImageData(0, 0, width, height);
  const pixels = frame.data;

  for (let i = 0; i < pixels.length; i += 4) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const maxChannel = Math.max(r, g, b);
    const minChannel = Math.min(r, g, b);
    const brightness = (r + g + b) / 3;
    const chroma = maxChannel - minChannel;

    const alpha = clamp((brightness - 6) * 8 + chroma * 2.6, 0, 255);
    pixels[i + 3] = alpha;
  }

  sourceCtx.putImageData(frame, 0, 0);

  const texture = new DynamicTexture(
    "logo-keyed",
    { width, height },
    scene,
    false,
    Texture.TRILINEAR_SAMPLINGMODE,
  );

  const textureCtx = texture.getContext();
  textureCtx.clearRect(0, 0, width, height);
  textureCtx.drawImage(sourceCanvas, 0, 0, width, height);
  texture.hasAlpha = true;
  texture.wrapU = Texture.CLAMP_ADDRESSMODE;
  texture.wrapV = Texture.CLAMP_ADDRESSMODE;
  texture.update(false);

  return texture;
}

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
      scene.ambientColor = new Color3(0.14, 0.09, 0.22);

      const camera = new ArcRotateCamera("hero-camera", -Math.PI / 2, Math.PI / 2.16, 6.55, Vector3.Zero(), scene);
      camera.fov = 0.72;
      camera.lowerRadiusLimit = 5.9;
      camera.upperRadiusLimit = 7.8;
      camera.lowerBetaLimit = 1.0;
      camera.upperBetaLimit = 1.85;
      camera.panningSensibility = 0;
      camera.wheelDeltaPercentage = 0;

      const environmentTexture = CubeTexture.CreateFromPrefilteredData(
        "https://assets.babylonjs.com/environments/environmentSpecular.env",
        scene,
      );
      environmentTexture.rotationY = Math.PI * 0.18;
      scene.environmentTexture = environmentTexture;
      scene.environmentIntensity = 1.5;

      const hemiLight = new HemisphericLight("hemi", new Vector3(0, 1, 0), scene);
      hemiLight.intensity = 0.74;
      hemiLight.diffuse = new Color3(0.72, 0.55, 1.0);
      hemiLight.specular = new Color3(0.98, 0.9, 1.0);
      hemiLight.groundColor = new Color3(0.08, 0.04, 0.12);

      const keyLight = new DirectionalLight("key", new Vector3(-0.5, -1, 0.34), scene);
      keyLight.position = new Vector3(3.4, 4.2, -2.2);
      keyLight.intensity = 2.15;
      keyLight.diffuse = new Color3(0.96, 0.85, 0.72);

      const rimLight = new DirectionalLight("rim", new Vector3(0.78, -0.95, -0.34), scene);
      rimLight.position = new Vector3(-3.6, 2.6, 3.4);
      rimLight.intensity = 2.5;
      rimLight.diffuse = new Color3(0.74, 0.48, 1.0);

      const glowLayer = new GlowLayer("hero-glow", scene, { blurKernelSize: 64 });
      glowLayer.intensity = 0.34;

      const root = new TransformNode("logo-root", scene);

      let logoTexture: Texture;
      try {
        logoTexture = await createKeyedLogoTexture(scene, "/logo.png");
      } catch {
        logoTexture = new Texture("/logo.png", scene, true, false, Texture.TRILINEAR_SAMPLINGMODE);
      }

      logoTexture.anisotropicFilteringLevel = 16;
      logoTexture.vScale = -1;
      logoTexture.vOffset = 1;

      const logoMaterial = new PBRMaterial("logo-material", scene);
      logoMaterial.albedoTexture = logoTexture;
      logoMaterial.useAlphaFromAlbedoTexture = true;
      logoMaterial.metallic = 0.12;
      logoMaterial.roughness = 0.5;
      logoMaterial.environmentIntensity = 1.24;
      logoMaterial.emissiveColor = new Color3(0.08, 0.05, 0.12);
      logoMaterial.alphaCutOff = 0.08;
      logoMaterial.backFaceCulling = false;
      logoMaterial.forceAlphaTest = true;

      const glowMaterial = new StandardMaterial("logo-glow-material", scene);
      glowMaterial.emissiveColor = Color3.FromHexString("#b379ff").scale(0.42);
      glowMaterial.diffuseColor = new Color3(0, 0, 0);
      glowMaterial.opacityTexture = logoTexture;
      glowMaterial.disableLighting = true;
      glowMaterial.alpha = 0.2;
      glowMaterial.backFaceCulling = false;

      const logoPlane = MeshBuilder.CreatePlane(
        "logo-plane",
        { width: 5.45, height: 5.45, sideOrientation: Mesh.DOUBLESIDE },
        scene,
      );
      logoPlane.parent = root;
      logoPlane.material = logoMaterial;

      const glowPlane = MeshBuilder.CreatePlane(
        "logo-glow-plane",
        { width: 5.56, height: 5.56, sideOrientation: Mesh.DOUBLESIDE },
        scene,
      );
      glowPlane.parent = root;
      glowPlane.position.z = -0.03;
      glowPlane.material = glowMaterial;

      const sparks: Mesh[] = [];
      const sparkCount = 110;
      const sparkMaterial = new StandardMaterial("spark-material", scene);
      sparkMaterial.emissiveColor = Color3.FromHexString("#d8b67b").scale(0.85);
      sparkMaterial.diffuseColor = new Color3(0, 0, 0);
      sparkMaterial.disableLighting = true;

      for (let i = 0; i < sparkCount; i += 1) {
        const spark = MeshBuilder.CreateSphere(`spark-${i}`, { diameter: 0.03, segments: 4 }, scene);
        spark.material = sparkMaterial;
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
        const motion = activeRef.current ? 1 : 0.28;

        const alphaTarget = -Math.PI / 2 + pointer.x * 0.12;
        const betaTarget = Math.PI / 2.16 - pointer.y * 0.05;
        const radiusTarget = 6.55 + explode * 0.6;

        camera.alpha += (alphaTarget - camera.alpha) * 0.05 * motion;
        camera.beta += (betaTarget - camera.beta) * 0.05 * motion;
        camera.radius += (radiusTarget - camera.radius) * 0.06 * motion;

        root.rotation.y += (pointer.x * 0.16 + explode * 0.08 - root.rotation.y) * 0.06 * motion;
        root.rotation.x += (-pointer.y * 0.08 + explode * 0.03 - root.rotation.x) * 0.06 * motion;
        root.position.y = Math.sin(elapsed * 0.94) * 0.07;
        const scale = 1 + Math.sin(elapsed * 0.7) * 0.01;
        root.scaling.setAll(scale);

        logoPlane.position.x = -explode * 0.08;
        glowPlane.position.x = explode * 0.08;
        glowPlane.rotation.z = Math.sin(elapsed * 0.42) * 0.01;
        glowPlane.scaling.setAll(1.0 + 0.015 + explode * 0.01);
        glowLayer.intensity = 0.34 + explode * 0.12;

        for (let i = 0; i < sparkCount; i += 1) {
          const spark = sparks[i];
          const seed = i / sparkCount;
          const angle = elapsed * (0.24 + seed * 0.36) + seed * Math.PI * 9;
          const radius = 2.75 + Math.sin(elapsed * 1.2 + i * 0.41) * 0.24 + explode * 0.55;
          spark.position.set(
            Math.cos(angle) * radius,
            Math.sin(elapsed * 1.6 + i * 0.37) * 1.25,
            Math.sin(angle) * radius * 0.45,
          );
          const sparkScale = 0.28 + Math.sin(elapsed * 2 + i * 0.3) * 0.1;
          spark.scaling.setAll(Math.max(0.06, sparkScale));
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
