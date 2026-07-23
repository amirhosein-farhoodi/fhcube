import { forwardRef, useRef } from "react";
import * as THREE from "three";
import { resolveModelUrl } from "../../../lib/modelSource";
import { FbxModel } from "./FbxModel";
import { GltfModel } from "./GltfModel";
import type { ModelProps } from "./types";

function isFbx(url: string) {
  return url.toLowerCase().endsWith(".fbx");
}

export const Model = forwardRef<THREE.Group, ModelProps>((props, ref) => {
  const groupRef = useRef<THREE.Group>(null);
  const url = resolveModelUrl(props.url);
  return isFbx(url) ? (
    <FbxModel {...props} url={url} ref={ref} groupRef={groupRef} />
  ) : (
    <GltfModel {...props} url={url} ref={ref} groupRef={groupRef} />
  );
});
Model.displayName = "Model";
