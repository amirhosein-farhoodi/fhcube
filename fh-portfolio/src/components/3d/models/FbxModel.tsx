import { useFrame, useLoader } from "@react-three/fiber";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import type { ModelBodyProps } from "./types";

export const FbxModel = forwardRef<THREE.Group, ModelBodyProps>(
  (
    {
      url,
      position,
      rotation,
      scale,
      layer,
      castShadow = true,
      receiveShadow = true,
      onPointerOver,
      onPointerOut,
      groupRef,
    },
    ref,
  ) => {
    const original = useLoader(FBXLoader, url);
    const fbx = useMemo(() => original.clone(true), [original]);
    const mixerRef = useRef<THREE.AnimationMixer | null>(null);

    useEffect(() => {
      if (layer === undefined) return;
      fbx.traverse((obj) => obj.layers.set(layer));
    }, [layer, fbx]);

    useEffect(() => {
      fbx.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          obj.castShadow = castShadow;
          obj.receiveShadow = receiveShadow;
        }
      });
    }, [fbx, castShadow, receiveShadow]);

    useEffect(() => {
      if (fbx.animations && fbx.animations.length > 0) {
        const mixer = new THREE.AnimationMixer(fbx);
        mixerRef.current = mixer;
        fbx.animations.forEach((clip) => mixer.clipAction(clip).play());
      }
    }, [fbx]);

    useFrame((_, delta) => {
      mixerRef.current?.update(delta);
    });

    return (
      <group ref={ref} position={position} rotation={rotation} scale={scale}>
        <primitive
          ref={groupRef}
          object={fbx}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
        />
      </group>
    );
  },
);
FbxModel.displayName = "FbxModel";
