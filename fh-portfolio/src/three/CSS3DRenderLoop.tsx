import { useFrame, useThree } from "@react-three/fiber";
import { useCSS3D } from "./css3dContext";

export function CSS3DRenderLoop() {
  const { cssScene, cssRenderer } = useCSS3D();
  const { camera } = useThree();

  useFrame(() => {
    cssRenderer.render(cssScene, camera);
  });

  return null;
}
