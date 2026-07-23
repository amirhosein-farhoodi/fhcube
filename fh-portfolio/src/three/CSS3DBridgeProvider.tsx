import { useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { CSS3DCtx, type CSS3DBridgeValue } from "./css3dContext";

export function CSS3DBridgeProvider({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const value = useMemo<CSS3DBridgeValue>(() => {
    return {
      cssScene: new THREE.Scene(),
      cssRenderer: new CSS3DRenderer(),
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const el = value.cssRenderer.domElement;
    el.style.position = "absolute";
    el.style.top = "0";
    el.style.left = "0";

    el.style.pointerEvents = "auto";
    container.appendChild(el);

    const viewEl = el.firstElementChild as HTMLElement | null;
    if (viewEl) viewEl.style.pointerEvents = "auto";

    const onResize = () => {
      value.cssRenderer.setSize(window.innerWidth, window.innerHeight);
    };
    onResize();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (el.parentNode === container) container.removeChild(el);
    };
  }, [value]);

  return (
    <CSS3DCtx.Provider value={value}>
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background: "#070710",
          pointerEvents: "auto",
        }}
      />
      {children}
    </CSS3DCtx.Provider>
  );
}
