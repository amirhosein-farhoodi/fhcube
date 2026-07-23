import { createContext, useContext } from "react";
import type * as THREE from "three";
import type { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";

export interface CSS3DBridgeValue {
  cssScene: THREE.Scene;
  cssRenderer: CSS3DRenderer;
}

export const CSS3DCtx = createContext<CSS3DBridgeValue | null>(null);

export function useCSS3D() {
  const ctx = useContext(CSS3DCtx);
  if (!ctx)
    throw new Error("useCSS3D must be used inside <CSS3DBridgeProvider>");
  return ctx;
}
