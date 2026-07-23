import { useEffect, useState } from "react";
import type * as THREE from "three";

export function CameraReadout({
  cameraRef,
  controlsRef,
}: {
  cameraRef: React.RefObject<THREE.Camera | null>;
  controlsRef: React.RefObject<{ target: THREE.Vector3 } | null>;
}) {
  const [text, setText] = useState("…");
  useEffect(() => {
    const f = (v: number) => v.toFixed(2);
    const id = window.setInterval(() => {
      const cam = cameraRef.current;
      const ctr = controlsRef.current;
      if (!cam || !ctr) return;
      const p = cam.position;
      const t = ctr.target;
      setText(
        `position: [${f(p.x)}, ${f(p.y)}, ${f(p.z)}],\n` +
          `target:   [${f(t.x)}, ${f(t.y)}, ${f(t.z)}],`,
      );
    }, 120);
    return () => window.clearInterval(id);
  }, [cameraRef, controlsRef]);

  return (
    <pre
      style={{
        position: "fixed",
        bottom: 12,
        left: 12,
        zIndex: 10001,
        margin: 0,
        padding: "8px 10px",
        background: "rgba(0,0,0,0.65)",
        color: "#9effa0",
        font: "11px/1.45 monospace",
        borderRadius: 6,
        pointerEvents: "none",
        whiteSpace: "pre",
      }}
    >
      {text}
    </pre>
  );
}
