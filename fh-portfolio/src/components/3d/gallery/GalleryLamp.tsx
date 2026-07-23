import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { SCENE_CONFIG } from "../../../constants/scene";
import { Model } from "../models/Model";

const { GALLERY } = SCENE_CONFIG;

RectAreaLightUniformsLib.init();

export function GalleryLamp() {
  const { LAMP } = GALLERY;
  const targetRef = useRef<THREE.Object3D>(null);
  const rectRef = useRef<THREE.RectAreaLight>(null);

  useEffect(() => {
    if (rectRef.current && targetRef.current) {
      const v = new THREE.Vector3();
      targetRef.current.updateWorldMatrix(true, false);
      targetRef.current.getWorldPosition(v);
      rectRef.current.lookAt(v);
    }
  }, []);

  return (
    <group position={[0, LAMP.Y, 0]}>
      <Model
        url={LAMP.MODEL_URL}
        position={LAMP.MODEL_POSITION}
        rotation={LAMP.MODEL_ROTATION}
        scale={LAMP.MODEL_SCALE}
      />

      <rectAreaLight
        ref={rectRef}
        position={[0, -LAMP.RADIUS + 0.1, LAMP.Z]}
        color={LAMP.GLOW_COLOR}
        intensity={LAMP.GLOW_INTENSITY}
        width={LAMP.GLOW_WIDTH}
        height={LAMP.GLOW_HEIGHT}
      />

      <pointLight
        position={[0, 0, LAMP.FILL_OFFSET]}
        color={LAMP.FILL_COLOR}
        intensity={LAMP.FILL_INTENSITY}
        decay={LAMP.FILL_DECAY}
        distance={LAMP.FILL_DISTANCE}
      />

      <object3D ref={targetRef} position={[0, -LAMP.Y, 0.02]} />
    </group>
  );
}
