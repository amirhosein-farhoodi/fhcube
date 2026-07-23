import { OrbitControls, Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { SCENE_CONFIG } from "../../constants/scene";
import { useEvenPixelHeight } from "../../hooks/useEvenPixelHeight";
import { useIsMobile } from "../../hooks/useIsMobile";
import { byTier, getDeviceTier } from "../../lib/deviceTier";
import { useSfx } from "../../sound";
import { Nebula } from "../3d";
import type { GalleryHandle, LaptopScreenHandle } from "../3d";
import { AboutPanel } from "./AboutPanel";
import { areas, nextAreaIndex } from "./areas";
import { CameraReadout } from "./CameraReadout";
import { INTRO_START_POSITION } from "./constants";
import { GalleryControls } from "./GalleryControls";
import { LoadingOverlay } from "./LoadingOverlay";
import { MobileAreaNav } from "./MobileAreaNav";
import { NavMenu } from "./NavMenu";
import { RoomLights } from "./RoomLights";
import { SceneContents } from "./SceneContents";
import { TopControls } from "./TopControls";
import { useSceneNavigation } from "./useSceneNavigation";

const { DEBUG, AREAS, CAMERA, PERFORMANCE } = SCENE_CONFIG;

export default function ModelViewer() {
  const cameraRef = useRef<THREE.Camera>(null);
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const galleryRef = useRef<GalleryHandle>(null);
  const laptopScreenRef = useRef<LaptopScreenHandle>(null);

  const isMobile = useIsMobile();
  const { ready: audioReady, unlock } = useSfx();
  const { containerRef, evenHeight } = useEvenPixelHeight<HTMLDivElement>();

  const nav = useSceneNavigation({
    cameraRef,
    controlsRef,
    galleryRef,
    laptopScreenRef,
    isMobile,
  });

  const navVisible = nav.introPhase === "ready" && !nav.freeMode;

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%" }}>
      <LoadingOverlay
        visible={nav.introPhase === "loading"}
        tier={getDeviceTier()}
        modelsReady={nav.sceneReady}
        audioReady={audioReady}
        onEnter={() => {
          unlock();
          nav.startExperience();
        }}
      />
      {DEBUG.ENABLED && (
        <CameraReadout cameraRef={cameraRef} controlsRef={controlsRef} />
      )}
      <div
        style={{
          width: "100%",
          height: evenHeight !== null ? `${evenHeight}px` : "100%",
        }}
      >
        <Canvas
          shadows={byTier(PERFORMANCE.SHADOWS)}
          dpr={[1, byTier(PERFORMANCE.MAX_DPR)]}
          gl={{
            antialias: byTier(PERFORMANCE.ANTIALIAS),
            powerPreference: "high-performance",
          }}
          camera={{ position: INTRO_START_POSITION, fov: CAMERA.FOV }}
          style={{ background: CAMERA.BACKGROUND_COLOR }}
          onCreated={({ camera, raycaster }) => {
            cameraRef.current = camera;
            camera.layers.enableAll();
            raycaster.layers.enableAll();
          }}
        >
          <Nebula />
          <Stars
            radius={50}
            depth={40}
            count={1500}
            factor={3}
            saturation={0.2}
            fade
            speed={0.5}
          />

          <RoomLights />

          <SceneContents
            onSceneReady={() => nav.setSceneReady(true)}
            currentAreaName={areas[nav.currentArea]?.name}
            galleryRef={galleryRef}
            onFrameActivate={nav.handleFrameActivate}
            onWallClick={() =>
              nav.moveToArea(
                areas.findIndex((a) => a.name === AREAS.GALLERY.name),
              )
            }
            laptopScreenRef={laptopScreenRef}
            laptopActive={nav.laptopActive}
            onLaptopHover={nav.handleLaptopHover}
            onLaptopActivate={nav.handleLaptopActivate}
          />

          <OrbitControls
            ref={controlsRef}
            enablePan={DEBUG.ENABLED || nav.freeMode}
            enableRotate={DEBUG.ENABLED || nav.freeMode}
            autoRotate={false}
            enableZoom={DEBUG.ENABLED || nav.freeMode}
            minDistance={DEBUG.ENABLED || nav.freeMode ? 0.4 : undefined}
            maxDistance={DEBUG.ENABLED || nav.freeMode ? 35 : undefined}
            minPolarAngle={
              DEBUG.ENABLED || nav.freeMode
                ? 0
                : (areas[nav.currentArea]?.minPolarAngle ?? 1.3)
            }
            maxPolarAngle={
              DEBUG.ENABLED || nav.freeMode
                ? Math.PI
                : (areas[nav.currentArea]?.maxPolarAngle ?? 1.3)
            }
            target={areas[0].target}
          />
        </Canvas>
      </div>

      <TopControls
        visible={nav.introPhase === "ready"}
        isTransitioning={nav.isTransitioning}
        freeMode={nav.freeMode}
        onToggleMode={nav.toggleFreeMode}
      />

      <AboutPanel
        visible={navVisible && areas[nav.currentArea]?.name === AREAS.AVATAR.name}
        isMobile={isMobile}
      />

      {!isMobile && (
        <NavMenu
          visible={navVisible}
          currentArea={nav.currentArea}
          isTransitioning={nav.isTransitioning}
          onSelect={nav.moveToArea}
        />
      )}

      {isMobile && (
        <MobileAreaNav
          visible={navVisible && !nav.galleryZoomed}
          currentArea={nav.currentArea}
          total={areas.length}
          currentAreaName={areas[nav.currentArea].name}
          isTransitioning={nav.isTransitioning}
          onStep={(direction) =>
            nav.moveToArea(
              nextAreaIndex(nav.currentArea, direction, areas.length),
            )
          }
        />
      )}

      {isMobile && (
        <GalleryControls
          visible={nav.galleryZoomed}
          isTransitioning={nav.isTransitioning}
          onStep={nav.stepGalleryFrame}
          onClose={nav.exitGalleryZoom}
        />
      )}
    </div>
  );
}
