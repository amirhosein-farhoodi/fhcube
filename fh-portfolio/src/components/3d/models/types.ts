import type { RefObject } from "react";
import type * as THREE from "three";

export interface ModelProps {
  url: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: number | [number, number, number];
  layer?: number;
  castShadow?: boolean;
  receiveShadow?: boolean;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

export type ModelBodyProps = ModelProps & {
  groupRef: RefObject<THREE.Group | null>;
};
