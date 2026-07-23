import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { forwardRef, useEffect, useRef } from "react";
import * as THREE from "three";
import type { ModelBodyProps } from "./types";

export const GltfModel = forwardRef<THREE.Group, ModelBodyProps>(
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
    const { scene, animations } = useGLTF(url);
    const mixerRef = useRef<THREE.AnimationMixer | null>(null);

    useEffect(() => {
      if (layer === undefined) return;
      scene.traverse((obj) => obj.layers.set(layer));
    }, [layer, scene]);

    useEffect(() => {
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          obj.castShadow = castShadow;
          obj.receiveShadow = receiveShadow;
        }
      });
    }, [scene, castShadow, receiveShadow]);

    useEffect(() => {
      if (animations && animations.length > 0 && groupRef.current) {
        const mixer = new THREE.AnimationMixer(groupRef.current);
        mixerRef.current = mixer;
        animations.forEach((clip) => mixer.clipAction(clip).play());
      }
    }, [animations, groupRef]);

    useFrame((_, delta) => {
      mixerRef.current?.update(delta);
    });

    return (
      <group ref={ref} position={position} rotation={rotation} scale={scale}>
        <primitive
          ref={groupRef}
          object={scene}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
        />
      </group>
    );
  },
);
GltfModel.displayName = "GltfModel";
