import { Text } from "@react-three/drei";
import { SCENE_CONFIG } from "../../../constants/scene";

const { GALLERY } = SCENE_CONFIG;

export function GalleryLabel() {
  const { LABEL } = GALLERY;
  const frontZ = LABEL.DEPTH / 2;
  const borderW = LABEL.WIDTH - LABEL.BORDER_INSET * 2;
  const borderH = LABEL.HEIGHT - LABEL.BORDER_INSET * 2;
  const borderZ = frontZ + 0.001;

  const borderBars: {
    args: [number, number, number];
    pos: [number, number, number];
  }[] = [
    {
      args: [borderW, LABEL.BORDER_WIDTH, LABEL.BORDER_WIDTH],
      pos: [0, borderH / 2 - LABEL.BORDER_WIDTH / 2, borderZ],
    },
    {
      args: [borderW, LABEL.BORDER_WIDTH, LABEL.BORDER_WIDTH],
      pos: [0, -(borderH / 2 - LABEL.BORDER_WIDTH / 2), borderZ],
    },
    {
      args: [LABEL.BORDER_WIDTH, borderH - LABEL.BORDER_WIDTH * 2, LABEL.BORDER_WIDTH],
      pos: [-(borderW / 2 - LABEL.BORDER_WIDTH / 2), 0, borderZ],
    },
    {
      args: [LABEL.BORDER_WIDTH, borderH - LABEL.BORDER_WIDTH * 2, LABEL.BORDER_WIDTH],
      pos: [borderW / 2 - LABEL.BORDER_WIDTH / 2, 0, borderZ],
    },
  ];

  const screwX = LABEL.WIDTH / 2 - LABEL.SCREW_INSET;

  return (
    <group position={[0, LABEL.Y, LABEL.Z]}>
      <mesh castShadow>
        <boxGeometry args={[LABEL.WIDTH, LABEL.HEIGHT, LABEL.DEPTH]} />
        <meshStandardMaterial
          color={LABEL.PLATE_COLOR}
          roughness={LABEL.PLATE_ROUGHNESS}
          metalness={LABEL.PLATE_METALNESS}
        />
      </mesh>

      {borderBars.map((bar, i) => (
        <mesh key={`border-${i}`} position={bar.pos}>
          <boxGeometry args={bar.args} />
          <meshStandardMaterial
            color={LABEL.BORDER_COLOR}
            metalness={LABEL.BORDER_METALNESS}
            roughness={LABEL.BORDER_ROUGHNESS}
          />
        </mesh>
      ))}

      {[screwX, -screwX].map((x, i) => (
        <mesh
          key={`screw-${i}`}
          position={[x, 0, frontZ + LABEL.SCREW_DEPTH / 2]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry
            args={[LABEL.SCREW_RADIUS, LABEL.SCREW_RADIUS, LABEL.SCREW_DEPTH, 16]}
          />
          <meshStandardMaterial
            color={LABEL.SCREW_COLOR}
            metalness={0.95}
            roughness={0.3}
          />
        </mesh>
      ))}

      <Text
        position={[0, 0, frontZ + 0.004]}
        fontSize={LABEL.FONT_SIZE}
        color={LABEL.TEXT_COLOR}
        anchorX="center"
        anchorY="middle"
        letterSpacing={LABEL.LETTER_SPACING}
        maxWidth={LABEL.WIDTH * LABEL.TEXT_MAX_WIDTH_FRACTION}
      >
        {LABEL.TEXT}
      </Text>
    </group>
  );
}
