import type { ThreeEvent } from "@react-three/fiber";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { SCENE_CONFIG } from "../../../constants/scene";
import { GalleryLabel } from "./GalleryLabel";
import { GalleryLamp } from "./GalleryLamp";
import { localToWorld } from "./localToWorld";
import { PhotoFrame } from "./PhotoFrame";

const { GALLERY } = SCENE_CONFIG;

export interface GalleryHandle {
  deactivate: () => void;
  step: (direction: number) => void;
}

interface GalleryProps {
  isActive: boolean;
  onFrameActivate?: (
    worldPos: [number, number, number] | null,
    zoomPos: [number, number, number] | null,
  ) => void;
  onWallClick?: () => void;
  wallPosition?: [number, number, number];
  wallRotation?: [number, number, number];
}

export const Gallery = forwardRef<GalleryHandle, GalleryProps>(function Gallery(
  {
    isActive,
    onFrameActivate,
    onWallClick,
    wallPosition = GALLERY.WALL_POSITION,
    wallRotation = GALLERY.WALL_ROTATION,
  },
  ref,
) {
  const activeFrameRef = useRef<number | null>(null);
  const hoveredSet = useRef(new Set<number>());

  const wallNormal = useRef<THREE.Vector3>(new THREE.Vector3());
  useEffect(() => {
    const n = new THREE.Vector3(0, 0, 1);
    n.applyEuler(new THREE.Euler(...wallRotation));
    wallNormal.current = n;
  }, [wallRotation]);

  const activateFrame = (index: number) => {
    activeFrameRef.current = index;

    if (!onFrameActivate) return;

    const localPos = GALLERY.FRAME_POSITIONS[index];
    if (!localPos) return;

    const worldPos = localToWorld(localPos, wallPosition, wallRotation);
    const n = wallNormal.current;
    const zoomPos: [number, number, number] = [
      worldPos[0] + n.x * GALLERY.CAMERA_OFFSET,
      worldPos[1],
      worldPos[2] + n.z * GALLERY.CAMERA_OFFSET,
    ];

    onFrameActivate(worldPos, zoomPos);
  };

  const handleHoverChange = (index: number, hovered: boolean) => {
    if (hovered) {
      hoveredSet.current.add(index);
    } else {
      hoveredSet.current.delete(index);
    }
  };

  useImperativeHandle(ref, () => ({
    deactivate: () => {
      activeFrameRef.current = null;
    },
    step: (direction: number) => {
      const total = GALLERY.IMAGES.length;
      const current = activeFrameRef.current;

      const base = current === null ? (direction > 0 ? -1 : 0) : current;
      activateFrame((((base + direction) % total) + total) % total);
    },
  }));

  const handleGroupClick = (e: ThreeEvent<MouseEvent>) => {
    if (!isActive && onWallClick) {
      e.stopPropagation();
      onWallClick();
    }
  };

  return (
    <group
      position={wallPosition}
      rotation={wallRotation}
      onClick={handleGroupClick}
    >
      <GalleryLamp />
      <GalleryLabel />

      {GALLERY.IMAGES.map((imageUrl, index) => (
        <PhotoFrame
          key={index}
          imageUrl={imageUrl}
          position={GALLERY.FRAME_POSITIONS[index] || [0, 0, 0]}
          size={GALLERY.FRAME.BASE_SIZE}
          interactive={isActive}
          onActivate={() => activateFrame(index)}
          onHoverChange={(h) => handleHoverChange(index, h)}
        />
      ))}
    </group>
  );
});
