import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export function SceneReadySignal({ onReady }: { onReady: () => void }) {
  const frames = useRef(0);
  useFrame(() => {
    frames.current += 1;
    if (frames.current === 2) onReady();
  });
  return null;
}
