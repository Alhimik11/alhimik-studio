"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { VRTrainerScene } from "@/components/portfolio/scenes/VRTrainerScene";
import { ARConfiguratorScene } from "@/components/portfolio/scenes/ARConfiguratorScene";
import { AIEngineScene } from "@/components/portfolio/scenes/AIEngineScene";
import { BIMTwinScene } from "@/components/portfolio/scenes/BIMTwinScene";
import { ShowroomScene } from "@/components/portfolio/scenes/ShowroomScene";
import { XRMuseumScene } from "@/components/portfolio/scenes/XRMuseumScene";

type CaseSceneProps = {
  caseId: number;
  active: boolean;
};

function SceneContent({ caseId }: { caseId: number }) {
  switch (caseId) {
    case 1:
      return <VRTrainerScene />;
    case 2:
      return <ARConfiguratorScene />;
    case 3:
      return <AIEngineScene />;
    case 4:
      return <BIMTwinScene />;
    case 5:
      return <ShowroomScene />;
    case 6:
      return <XRMuseumScene />;
    default:
      return <VRTrainerScene />;
  }
}

export function CaseScene({ caseId, active }: CaseSceneProps) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 3.5], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
    >
      <color attach="background" args={["#0a0515"]} />
      <Suspense fallback={null}>
        <SceneContent caseId={caseId} />
      </Suspense>
    </Canvas>
  );
}
