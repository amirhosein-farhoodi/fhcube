import { Box } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";
import { SCENE_CONFIG } from "../../constants/scene";
import type { GalleryHandle, LaptopScreenHandle } from "../3d";
import { Gallery, Ground, LaptopScreen, Model, Window } from "../3d";
import { areas } from "./areas";
import { SceneReadySignal } from "./SceneReadySignal";

const { AREAS, GALLERY, MODELS, MONITOR, LIGHTING, DEBUG } = SCENE_CONFIG;

export function SceneContents({
  onSceneReady,
  currentAreaName,
  galleryRef,
  onFrameActivate,
  onWallClick,
  laptopScreenRef,
  laptopActive,
  onLaptopHover,
  onLaptopActivate,
}: {
  onSceneReady: () => void;
  currentAreaName: string | undefined;
  galleryRef: React.RefObject<GalleryHandle | null>;
  onFrameActivate: (
    worldPos: [number, number, number] | null,
    zoomPos: [number, number, number] | null,
  ) => void;
  onWallClick: () => void;
  laptopScreenRef: React.RefObject<LaptopScreenHandle | null>;
  laptopActive: boolean;
  onLaptopHover: (hovered: boolean) => void;
  onLaptopActivate: () => void;
}) {
  return (
    <Suspense fallback={null}>
      <SceneReadySignal onReady={onSceneReady} />
      <Ground />
      <Window />
      <Gallery
        ref={galleryRef}
        isActive={currentAreaName === AREAS.GALLERY.name}
        onFrameActivate={onFrameActivate}
        onWallClick={onWallClick}
        wallPosition={GALLERY.WALL_POSITION}
        wallRotation={GALLERY.WALL_ROTATION}
      />

      {DEBUG.ENABLED && (
        <>
          {areas.map((area, index) => (
            <Box
              key={`camera-${index}`}
              args={[DEBUG.BOX_SIZE, DEBUG.BOX_SIZE, DEBUG.BOX_SIZE]}
              position={area.position}
            >
              <meshBasicMaterial color="red" />
            </Box>
          ))}
          <Box
            args={[DEBUG.BOX_SIZE, DEBUG.BOX_SIZE, DEBUG.BOX_SIZE]}
            position={MONITOR.POSITION}
          >
            <meshBasicMaterial color="orange" />
          </Box>
          {areas.map((area, index) => (
            <Box
              key={`target-${index}`}
              args={[
                DEBUG.TARGET_BOX_SIZE,
                DEBUG.TARGET_BOX_SIZE,
                DEBUG.TARGET_BOX_SIZE,
              ]}
              position={area.target}
            >
              <meshBasicMaterial color="blue" />
            </Box>
          ))}
          <primitive
            object={
              new THREE.Line(
                new THREE.BufferGeometry().setFromPoints([
                  new THREE.Vector3(...areas[0].componentPosition),
                  new THREE.Vector3(...areas[1].componentPosition),
                ]),
                new THREE.LineBasicMaterial({ color: "yellow" }),
              )
            }
          />
          <primitive
            object={
              new THREE.Line(
                new THREE.BufferGeometry().setFromPoints([
                  new THREE.Vector3(...areas[0].position),
                  new THREE.Vector3(...areas[1].position),
                ]),
                new THREE.LineBasicMaterial({ color: "orange" }),
              )
            }
          />
        </>
      )}

      <Model
        url={MODELS.FH.URL}
        position={MODELS.FH.POSITION}
        rotation={MODELS.FH.ROTATION}
        scale={MODELS.FH.SCALE}
      />

      <Model
        url={MODELS.SKATEBOARD.URL}
        position={MODELS.SKATEBOARD.POSITION}
        rotation={MODELS.SKATEBOARD.ROTATION}
        scale={MODELS.SKATEBOARD.SCALE}
      />

      <Model
        url={MODELS.FLOWERS.URL}
        position={MODELS.FLOWERS.POSITION}
        rotation={MODELS.FLOWERS.ROTATION}
        scale={MODELS.FLOWERS.SCALE}
      />

      <Model
        url={MODELS.PET.URL}
        position={MODELS.PET.POSITION}
        rotation={MODELS.PET.ROTATION}
        scale={MODELS.PET.SCALE}
      />
      <spotLight
        position={LIGHTING.PET_RIM.POSITION}
        intensity={LIGHTING.PET_RIM.INTENSITY}
        color={LIGHTING.PET_RIM.COLOR}
        angle={LIGHTING.PET_RIM.ANGLE}
        penumbra={LIGHTING.PET_RIM.PENUMBRA}
        decay={LIGHTING.PET_RIM.DECAY}
        distance={LIGHTING.PET_RIM.DISTANCE}
      >
        <object3D attach="target" position={LIGHTING.PET_RIM.TARGET} />
      </spotLight>

      {DEBUG.ENABLED && (
        <>
          <mesh position={LIGHTING.PET_RIM.POSITION}>
            <boxGeometry args={[0.12, 0.12, 0.12]} />
            <meshBasicMaterial color="lime" />
          </mesh>
          <mesh position={LIGHTING.PET_RIM.TARGET}>
            <boxGeometry args={[0.08, 0.08, 0.08]} />
            <meshBasicMaterial color="magenta" wireframe />
          </mesh>
        </>
      )}

      <group
        position={AREAS.PORTFOLIO.componentPosition}
        rotation={[0, Math.PI, 0]}
      >
        <group
          position={MONITOR.POSITION}
          scale={MONITOR.SCALE}
          rotation={MONITOR.ROTATION}
        >
          <Model
            url={MODELS.COMPUTER.URL}
            position={MODELS.COMPUTER.POSITION}
            rotation={MODELS.COMPUTER.ROTATION}
            scale={MODELS.COMPUTER.SCALE}
          />

          <LaptopScreen
            ref={laptopScreenRef}
            isActive={laptopActive}
            onHoverChange={onLaptopHover}
            onActivate={onLaptopActivate}
          />
        </group>

        <Model
          scale={MODELS.DESK.SCALE}
          position={MODELS.DESK.POSITION}
          url={MODELS.DESK.URL}
        />

        <Model
          url={MODELS.CARPET.URL}
          position={MODELS.CARPET.POSITION}
          rotation={MODELS.CARPET.ROTATION}
          scale={MODELS.CARPET.SCALE}
        />

        <Model
          url={MODELS.CHAIR.URL}
          position={MODELS.CHAIR.POSITION}
          rotation={MODELS.CHAIR.ROTATION}
          scale={MODELS.CHAIR.SCALE}
        />

        {/* <group
          position={MODELS.SPEAKER.POSITION}
          rotation={MODELS.SPEAKER.ROTATION}
        >
          <Model url={MODELS.SPEAKER.URL} scale={MODELS.SPEAKER.SCALE} />
        </group> */}

        <Model
          url={MODELS.WALL_SHELF.URL}
          position={MODELS.WALL_SHELF.POSITION}
          rotation={MODELS.WALL_SHELF.ROTATION}
          scale={MODELS.WALL_SHELF.SCALE}
        />

        <Model
          url={MODELS.READING_LAMP.URL}
          position={MODELS.READING_LAMP.POSITION}
          rotation={MODELS.READING_LAMP.ROTATION}
          scale={MODELS.READING_LAMP.SCALE}
        />

        <spotLight
          position={LIGHTING.READING_LAMP.POSITION}
          intensity={LIGHTING.READING_LAMP.INTENSITY}
          color={LIGHTING.READING_LAMP.COLOR}
          angle={LIGHTING.READING_LAMP.ANGLE}
          penumbra={LIGHTING.READING_LAMP.PENUMBRA}
          decay={LIGHTING.READING_LAMP.DECAY}
          distance={LIGHTING.READING_LAMP.DISTANCE}
          castShadow
          shadow-mapSize-width={LIGHTING.READING_LAMP.SHADOW_MAP_SIZE}
          shadow-mapSize-height={LIGHTING.READING_LAMP.SHADOW_MAP_SIZE}
        >
          <object3D attach="target" position={LIGHTING.READING_LAMP.TARGET} />
        </spotLight>

        <pointLight
          position={LIGHTING.READING_LAMP.POSITION}
          color={LIGHTING.READING_LAMP.COLOR}
          intensity={1}
          decay={2}
          distance={0.1}
        />

        {DEBUG.ENABLED && (
          <>
            <mesh position={LIGHTING.READING_LAMP.POSITION}>
              <boxGeometry args={[0.06, 0.06, 0.06]} />
              <meshBasicMaterial color="orange" />
            </mesh>
            <mesh position={LIGHTING.READING_LAMP.TARGET}>
              <boxGeometry args={[0.05, 0.05, 0.05]} />
              <meshBasicMaterial color="yellow" wireframe />
            </mesh>
          </>
        )}
      </group>
    </Suspense>
  );
}
