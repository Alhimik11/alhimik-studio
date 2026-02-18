"use client";

import { useEffect } from "react";

type ARModelViewerProps = {
  src: string;
  poster?: string;
};

export function ARModelViewer({ src, poster }: ARModelViewerProps) {
  useEffect(() => {
    import("@google/model-viewer");
  }, []);

  return (
    <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#050a12]">
      <model-viewer
        src={src}
        ar
        ar-modes="webxr scene-viewer quick-look"
        camera-controls
        poster={poster}
        shadow-intensity="1"
        style={{ width: "100%", height: "65vh", backgroundColor: "#050a12" }}
      />
    </div>
  );
}
