import * as THREE from "three";
import { SCENE_CONFIG } from "../../constants/scene";
import { byTier } from "../../lib/deviceTier";

const { LIGHTING, DEBUG, PERFORMANCE } = SCENE_CONFIG;

function shadowMapSize(desktopSize: number): number {
  return Math.min(desktopSize, byTier(PERFORMANCE.SHADOW_MAP_MAX));
}

export function RoomLights() {
  return (
    <>
      <group position={LIGHTING.CEILING_LAMP.POSITION}>
        <group position={[0, 0.1, 0]}>
          <mesh>
            <cylinderGeometry args={[0.34, 0.34, 0.1, 64]} />
            <meshStandardMaterial
              color="#1c1c20"
              roughness={0.5}
              metalness={0.4}
              opacity={100}
            />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.051, 0]}>
            <circleGeometry args={[0.31, 64]} />
            <meshBasicMaterial
              color="#ffe9cc"
              toneMapped={false}
              side={THREE.FrontSide}
            />
          </mesh>
          <pointLight
            intensity={LIGHTING.CEILING_LAMP.INTENSITY}
            color={LIGHTING.CEILING_LAMP.COLOR}
            decay={LIGHTING.CEILING_LAMP.DECAY}
            distance={LIGHTING.CEILING_LAMP.DISTANCE}
            castShadow
            shadow-mapSize-width={shadowMapSize(LIGHTING.CEILING_LAMP.SHADOW_MAP_SIZE)}
            shadow-mapSize-height={shadowMapSize(LIGHTING.CEILING_LAMP.SHADOW_MAP_SIZE)}
            shadow-camera-near={0.5}
            shadow-camera-far={6}
            shadow-bias={-0.0005}
            shadow-normalBias={0.03}
            shadow-radius={6}
          />
        </group>

        {DEBUG.ENABLED && (
          <mesh>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshBasicMaterial color={LIGHTING.CEILING_LAMP.COLOR} />
          </mesh>
        )}
      </group>

      <directionalLight
        position={LIGHTING.MOONLIGHT.POSITION}
        intensity={LIGHTING.MOONLIGHT.INTENSITY}
        color={LIGHTING.MOONLIGHT.COLOR}
        castShadow
        shadow-mapSize-width={shadowMapSize(LIGHTING.MOONLIGHT.SHADOW_MAP_SIZE)}
        shadow-mapSize-height={shadowMapSize(LIGHTING.MOONLIGHT.SHADOW_MAP_SIZE)}
        shadow-camera-near={LIGHTING.MOONLIGHT.SHADOW_NEAR}
        shadow-camera-far={LIGHTING.MOONLIGHT.SHADOW_FAR}
        shadow-camera-left={-LIGHTING.MOONLIGHT.SHADOW_BOUNDS}
        shadow-camera-right={LIGHTING.MOONLIGHT.SHADOW_BOUNDS}
        shadow-camera-top={LIGHTING.MOONLIGHT.SHADOW_BOUNDS}
        shadow-camera-bottom={-LIGHTING.MOONLIGHT.SHADOW_BOUNDS}
        shadow-normalBias={0.03}
      >
        <object3D attach="target" position={LIGHTING.MOONLIGHT.TARGET} />
      </directionalLight>

      <spotLight
        position={[2.5, 0.9, 0]}
        intensity={0.35}
        color={LIGHTING.MOONLIGHT.COLOR}
        angle={Math.PI / 10}
        penumbra={0.85}
        decay={2}
        distance={3.5}
      >
        <object3D attach="target" position={[0.3, -0.2, 0]} />
      </spotLight>

      {DEBUG.ENABLED && (
        <>
          <mesh position={LIGHTING.MOONLIGHT.POSITION}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshBasicMaterial color={LIGHTING.MOONLIGHT.COLOR} />
          </mesh>
          <mesh position={LIGHTING.MOONLIGHT.TARGET}>
            <boxGeometry args={[0.12, 0.12, 0.12]} />
            <meshBasicMaterial color="cyan" wireframe />
          </mesh>
        </>
      )}
    </>
  );
}
