import * as THREE from "three";
import { SCENE_CONFIG } from "../../../constants/scene";

const { ROOM, WINDOW } = SCENE_CONFIG;

export function Window() {
  const r = WINDOW.RADIUS;
  const cy = WINDOW.CENTER_Y;
  const tube = WINDOW.FRAME_TUBE;
  const seg = WINDOW.SEGMENTS;
  const wallX = ROOM.HALF - ROOM.WALL_INSET;

  return (
    <group>
      <mesh
        position={[wallX - 0.002, cy, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        castShadow
      >
        <ringGeometry args={[r, r + tube * 1.6, seg]} />
        <meshStandardMaterial
          color={WINDOW.FRAME_COLOR}
          metalness={WINDOW.FRAME_METALNESS}
          roughness={WINDOW.FRAME_ROUGHNESS}
        />
      </mesh>

      <mesh
        position={[wallX - tube * 0.5, cy, 0]}
        rotation={[0, Math.PI / 2, 0]}
        castShadow
      >
        <torusGeometry args={[r, tube, 20, seg]} />
        <meshStandardMaterial
          color={WINDOW.FRAME_COLOR}
          metalness={WINDOW.FRAME_METALNESS}
          roughness={WINDOW.FRAME_ROUGHNESS}
        />
      </mesh>

      <mesh position={[wallX, cy, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <circleGeometry args={[r * 0.99, seg]} />
        <meshStandardMaterial
          color="#cfd9e8"
          transparent
          opacity={0.18}
          roughness={0.08}
          metalness={0.25}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
