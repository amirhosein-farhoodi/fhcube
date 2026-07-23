import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { SCENE_CONFIG } from "../../../constants/scene";

const { LAPTOP_SCREEN } = SCENE_CONFIG;

export function LaptopScreenImage() {
  const texture = useLoader(THREE.TextureLoader, LAPTOP_SCREEN.STATIC_IMAGE_URL);
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh position={[0, 0, LAPTOP_SCREEN.STATIC_IMAGE_Z_OFFSET]}>
      <planeGeometry args={[LAPTOP_SCREEN.WIDTH, LAPTOP_SCREEN.HEIGHT]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}
