import type { ThreeEvent } from "@react-three/fiber";
import { useEffect, useState } from "react";
import * as THREE from "three";
import { SCENE_CONFIG } from "../../../constants/scene";

const { GALLERY } = SCENE_CONFIG;

export interface PhotoFrameProps {
  imageUrl: string;
  position: [number, number, number];
  size: number;
  interactive: boolean;
  onActivate: () => void;
  onHoverChange: (hovered: boolean) => void;
}

export function PhotoFrame({
  imageUrl,
  position,
  size,
  interactive,
  onActivate,
  onHoverChange,
}: PhotoFrameProps) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(imageUrl, (tex) => {
      tex.flipY = true;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.needsUpdate = true;
      setTexture(tex);
    });
  }, [imageUrl]);

  const frameWidth = size * GALLERY.FRAME.WIDTH_MULTIPLIER;
  const frameHeight = size * GALLERY.FRAME.HEIGHT_MULTIPLIER;
  const molding = GALLERY.FRAME.MOLDING_WIDTH;
  const protrusion = GALLERY.FRAME.PROTRUSION;
  const matRecess = GALLERY.FRAME.MAT_RECESS;
  const matPadding = GALLERY.FRAME.MAT_PADDING;

  const openingWidth = frameWidth - molding * 2;
  const openingHeight = frameHeight - molding * 2;
  const imageWidth = openingWidth - matPadding * 2;
  const imageHeight = openingHeight - matPadding * 2;
  const matZ = protrusion - matRecess;
  const overlap = 0.006;

  const fillet = GALLERY.FRAME.FILLET_WIDTH;
  const filletDepth = GALLERY.FRAME.FILLET_DEPTH;
  const filletZ = matZ + filletDepth / 2;
  const filletBars: { args: [number, number, number]; pos: [number, number, number] }[] = [
    {
      args: [openingWidth, fillet, filletDepth],
      pos: [0, openingHeight / 2 - fillet / 2, filletZ],
    },
    {
      args: [openingWidth, fillet, filletDepth],
      pos: [0, -(openingHeight / 2 - fillet / 2), filletZ],
    },
    {
      args: [fillet, openingHeight - fillet * 2, filletDepth],
      pos: [-(openingWidth / 2 - fillet / 2), 0, filletZ],
    },
    {
      args: [fillet, openingHeight - fillet * 2, filletDepth],
      pos: [openingWidth / 2 - fillet / 2, 0, filletZ],
    },
  ];

  const handlePointerEnter = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!interactive) return;
    document.body.style.cursor = "pointer";
    onHoverChange(true);
  };

  const handlePointerLeave = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!interactive) return;
    document.body.style.cursor = "";
    onHoverChange(false);
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    if (!interactive) return;
    onActivate();
  };

  const frameColor = GALLERY.FRAME.COLORS.DEFAULT;

  return (
    <group position={position}>
      <mesh
        position={[0, 0, protrusion + 0.01]}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      >
        <planeGeometry args={[frameWidth + 0.01, frameHeight + 0.01]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      <mesh position={[0, 0, matZ - 0.004]}>
        <boxGeometry args={[frameWidth, frameHeight, 0.007]} />
        <meshStandardMaterial color="#2a211a" roughness={0.95} metalness={0} />
      </mesh>

      {[
        {
          args: [frameWidth, molding, protrusion] as [number, number, number],
          pos: [0, frameHeight / 2 - molding / 2, protrusion / 2] as [
            number,
            number,
            number,
          ],
        },
        {
          args: [frameWidth, molding, protrusion] as [number, number, number],
          pos: [0, -(frameHeight / 2 - molding / 2), protrusion / 2] as [
            number,
            number,
            number,
          ],
        },
        {
          args: [molding, openingHeight, protrusion] as [
            number,
            number,
            number,
          ],
          pos: [-(frameWidth / 2 - molding / 2), 0, protrusion / 2] as [
            number,
            number,
            number,
          ],
        },
        {
          args: [molding, openingHeight, protrusion] as [
            number,
            number,
            number,
          ],
          pos: [frameWidth / 2 - molding / 2, 0, protrusion / 2] as [
            number,
            number,
            number,
          ],
        },
      ].map((bar, i) => (
        <mesh key={i} position={bar.pos} castShadow>
          <boxGeometry args={bar.args} />
          <meshStandardMaterial
            color={frameColor}
            metalness={GALLERY.FRAME.MATERIAL.METALNESS}
            roughness={GALLERY.FRAME.MATERIAL.ROUGHNESS}
          />
        </mesh>
      ))}

      <mesh position={[0, 0, matZ]} receiveShadow>
        <planeGeometry
          args={[openingWidth + overlap, openingHeight + overlap]}
        />
        <meshStandardMaterial
          color={GALLERY.FRAME.MAT_COLOR}
          roughness={0.92}
          metalness={0}
        />
      </mesh>

      {filletBars.map((bar, i) => (
        <mesh key={`fillet-${i}`} position={bar.pos}>
          <boxGeometry args={bar.args} />
          <meshStandardMaterial
            color={GALLERY.FRAME.FILLET_COLOR}
            metalness={GALLERY.FRAME.FILLET_METALNESS}
            roughness={GALLERY.FRAME.FILLET_ROUGHNESS}
          />
        </mesh>
      ))}

      {texture && (
        <mesh position={[0, 0, matZ + 0.002]}>
          <planeGeometry args={[imageWidth, imageHeight]} />
          <meshStandardMaterial map={texture} />
        </mesh>
      )}
    </group>
  );
}
