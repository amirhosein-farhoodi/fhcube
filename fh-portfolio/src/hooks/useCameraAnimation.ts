import { useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

interface CameraAnimationOptions {
  duration?: number;
  easingPower?: number;
  onComplete?: () => void;
}

interface CameraRefs {
  camera: THREE.Camera | null;
  controls: OrbitControlsImpl | null;
}

export function useCameraAnimation() {
  const animationIdRef = useRef<number | null>(null);

  const animate = (
    refs: CameraRefs,
    targetPosition: [number, number, number],
    targetLookAt: [number, number, number],
    options: CameraAnimationOptions = {}
  ) => {
    const { duration = 1000, easingPower = 3, onComplete } = options;

    const { camera, controls } = refs;
    if (!camera || !controls) {
      console.warn("Camera or controls not available");
      return;
    }

    if (animationIdRef.current !== null) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }

    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();
    const targetPos = new THREE.Vector3(...targetPosition);
    const targetLook = new THREE.Vector3(...targetLookAt);
    const startTime = Date.now();

    const animateFrame = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const easeProgress = 1 - Math.pow(1 - progress, easingPower);

      camera.position.lerpVectors(startPosition, targetPos, easeProgress);

      controls.target.lerpVectors(startTarget, targetLook, easeProgress);

      controls.update();

      if (progress < 1) {
        const id = requestAnimationFrame(animateFrame);
        animationIdRef.current = id;
      } else {
        animationIdRef.current = null;
        if (onComplete) {
          onComplete();
        }
      }
    };

    const id = requestAnimationFrame(animateFrame);
    animationIdRef.current = id;
  };

  const cancel = () => {
    if (animationIdRef.current !== null) {
      cancelAnimationFrame(animationIdRef.current);
      animationIdRef.current = null;
    }
  };

  return { animate, cancel };
}
