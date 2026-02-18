import type { CSSProperties, DetailedHTMLProps, HTMLAttributes } from "react";

type ModelViewerElementAttributes = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> & {
  src?: string;
  poster?: string;
  ar?: boolean;
  "ar-modes"?: string;
  "camera-controls"?: boolean;
  "shadow-intensity"?: string;
  style?: CSSProperties;
};

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerElementAttributes;
    }
  }
}

export {};
