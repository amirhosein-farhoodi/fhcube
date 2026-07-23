import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { SCENE_CONFIG } from "../../constants/scene";
import { useCameraAnimation } from "../../hooks/useCameraAnimation";
import { useSfx } from "../../sound";
import type { GalleryHandle, LaptopScreenHandle } from "../3d";
import { areaCameraPosition, areas, nextAreaIndex } from "./areas";
import {
  INTRO_DURATION,
  INTRO_EASING_POWER,
  INTRO_START_POSITION,
  INTRO_START_TARGET,
} from "./constants";

const { DEBUG, AREAS, ANIMATION, LAPTOP_SCREEN, GESTURES, GALLERY } =
  SCENE_CONFIG;

interface SceneRefs {
  cameraRef: React.RefObject<THREE.Camera | null>;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  galleryRef: React.RefObject<GalleryHandle | null>;
  laptopScreenRef: React.RefObject<LaptopScreenHandle | null>;
  isMobile: boolean;
}

export function useSceneNavigation({
  cameraRef,
  controlsRef,
  galleryRef,
  laptopScreenRef,
  isMobile,
}: SceneRefs) {
  const [currentArea, setCurrentArea] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [introPhase, setIntroPhase] = useState<"loading" | "intro" | "ready">(
    "loading",
  );
  const [freeMode, setFreeMode] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);
  const [galleryZoomed, setGalleryZoomed] = useState(false);

  const { animate: animateCamera, cancel: cancelAnimation } =
    useCameraAnimation();
  const { play } = useSfx();

  const galleryBaseRef = useRef<{
    position: THREE.Vector3;
    target: THREE.Vector3;
  } | null>(null);

  const [laptopActive, setLaptopActive] = useState(false);
  const laptopHoveredRef = useRef(false);

  const laptopBaseRef = useRef<{
    position: THREE.Vector3;
    target: THREE.Vector3;
  } | null>(null);

  const computeLaptopPose = (fraction: number) => {
    if (!laptopScreenRef.current || !cameraRef.current || !controlsRef.current) {
      return null;
    }
    const screenPos = laptopScreenRef.current.getWorldPosition();
    const screenNormal = laptopScreenRef.current.getWorldNormal();
    if (!screenPos || !screenNormal) return null;

    const zoomDistance = isMobile
      ? LAPTOP_SCREEN.ZOOM_DISTANCE_MOBILE
      : LAPTOP_SCREEN.ZOOM_DISTANCE;
    const fullZoomPos = screenPos
      .clone()
      .add(screenNormal.clone().multiplyScalar(zoomDistance));

    const basePos =
      laptopBaseRef.current?.position ?? cameraRef.current.position;
    const baseTarget =
      laptopBaseRef.current?.target ?? controlsRef.current.target;

    const lerpedPos = basePos.clone().lerp(fullZoomPos, fraction);
    const lerpedTarget = baseTarget.clone().lerp(screenPos, fraction);

    return { position: lerpedPos, target: lerpedTarget };
  };

  const captureLaptopBase = () => {
    if (laptopBaseRef.current) return;
    if (!cameraRef.current || !controlsRef.current) return;
    laptopBaseRef.current = {
      position: cameraRef.current.position.clone(),
      target: controlsRef.current.target.clone(),
    };
  };

  const handleLaptopHover = (hovered: boolean) => {
    if (laptopActive) return;
    if (areas[currentArea]?.name !== AREAS.PORTFOLIO.name) return;
    if (isTransitioning) return;

    laptopHoveredRef.current = hovered;
    if (!cameraRef.current || !controlsRef.current) return;

    captureLaptopBase();
    const pose = computeLaptopPose(hovered ? LAPTOP_SCREEN.HOVER_FRACTION : 0);
    if (!pose) return;

    cancelAnimation();
    animateCamera(
      { camera: cameraRef.current, controls: controlsRef.current },
      pose.position.toArray() as [number, number, number],
      pose.target.toArray() as [number, number, number],
      {
        duration: LAPTOP_SCREEN.HOVER_DURATION,
        easingPower: ANIMATION.EASING_POWER,
      },
    );
  };

  const zoomIntoLaptop = () => {
    if (laptopActive) return;
    if (!cameraRef.current || !controlsRef.current) return;

    play("zoom");
    captureLaptopBase();
    const pose = computeLaptopPose(1);
    if (!pose) return;

    setLaptopActive(true);
    setIsTransitioning(true);
    cancelAnimation();
    animateCamera(
      { camera: cameraRef.current, controls: controlsRef.current },
      pose.position.toArray() as [number, number, number],
      pose.target.toArray() as [number, number, number],
      {
        duration: LAPTOP_SCREEN.ZOOM_DURATION,
        easingPower: ANIMATION.EASING_POWER,
        onComplete: () => setIsTransitioning(false),
      },
    );
  };

  const handleLaptopActivate = () => {
    if (areas[currentArea]?.name !== AREAS.PORTFOLIO.name) return;
    zoomIntoLaptop();
  };

  const handleLaptopExit = () => {
    if (!laptopActive && !laptopBaseRef.current) return;
    if (!cameraRef.current || !controlsRef.current) return;

    const base = laptopBaseRef.current;
    laptopBaseRef.current = null;
    laptopHoveredRef.current = false;
    document.body.style.cursor = "";

    play("back");

    if (!base) {
      setLaptopActive(false);
      return;
    }

    setIsTransitioning(true);
    cancelAnimation();
    animateCamera(
      { camera: cameraRef.current, controls: controlsRef.current },
      base.position.toArray() as [number, number, number],
      base.target.toArray() as [number, number, number],
      {
        duration: LAPTOP_SCREEN.ZOOM_DURATION,
        easingPower: ANIMATION.EASING_POWER,
        onComplete: () => {
          setIsTransitioning(false);
          setLaptopActive(false);
        },
      },
    );
  };

  const handleFrameActivate = (
    worldPos: [number, number, number] | null,
    zoomPos: [number, number, number] | null,
  ) => {
    if (!cameraRef.current || !controlsRef.current) return;

    cancelAnimation();

    if (worldPos && zoomPos) {
      play("zoom");
      if (!galleryBaseRef.current) {
        const galleryArea = areas.find((a) => a.name === AREAS.GALLERY.name);
        galleryBaseRef.current = {
          position: new THREE.Vector3(
            ...(galleryArea
              ? areaCameraPosition(galleryArea, isMobile)
              : AREAS.GALLERY.position),
          ),
          target: new THREE.Vector3(...AREAS.GALLERY.target),
        };
      }
      setGalleryZoomed(true);
      setIsTransitioning(true);

      let cameraX = zoomPos[0];
      let cameraZ = zoomPos[2];
      if (isMobile) {
        const offsetX = zoomPos[0] - worldPos[0];
        const offsetZ = zoomPos[2] - worldPos[2];
        const offsetMagnitude = Math.hypot(offsetX, offsetZ) || 1;
        const scale = GALLERY.CAMERA_OFFSET_MOBILE / offsetMagnitude;
        cameraX = worldPos[0] + offsetX * scale;
        cameraZ = worldPos[2] + offsetZ * scale;
      }

      animateCamera(
        { camera: cameraRef.current, controls: controlsRef.current },
        [cameraX, worldPos[1], cameraZ],
        worldPos,
        {
          duration: ANIMATION.GALLERY_ZOOM_DURATION,
          easingPower: ANIMATION.EASING_POWER,
          onComplete: () => setIsTransitioning(false),
        },
      );
    } else if (galleryBaseRef.current) {
      play("back");
      const base = galleryBaseRef.current;
      galleryBaseRef.current = null;
      setGalleryZoomed(false);
      setIsTransitioning(true);
      animateCamera(
        { camera: cameraRef.current, controls: controlsRef.current },
        base.position.toArray() as [number, number, number],
        base.target.toArray() as [number, number, number],
        {
          duration: ANIMATION.GALLERY_ZOOM_DURATION,
          easingPower: ANIMATION.EASING_POWER,
          onComplete: () => setIsTransitioning(false),
        },
      );
    }
  };

  const stepGalleryFrame = (direction: number) => {
    play("step");
    galleryRef.current?.step(direction);
  };

  const exitGalleryZoom = () => {
    galleryRef.current?.deactivate();
    handleFrameActivate(null, null);
  };

  const moveToArea = (areaIndex: number) => {
    if (isTransitioning || areaIndex === currentArea) return;

    play("transition");

    if (laptopActive || laptopBaseRef.current) {
      laptopBaseRef.current = null;
      laptopHoveredRef.current = false;
      document.body.style.cursor = "";
      setLaptopActive(false);
    }

    if (galleryBaseRef.current) {
      galleryBaseRef.current = null;
      galleryRef.current?.deactivate();
      setGalleryZoomed(false);
    }

    setCurrentArea(areaIndex);
    setIsTransitioning(true);

    if (cameraRef.current && controlsRef.current) {
      const targetArea = areas[areaIndex];

      animateCamera(
        { camera: cameraRef.current, controls: controlsRef.current },
        areaCameraPosition(targetArea, isMobile),
        targetArea.target,
        {
          duration: ANIMATION.AREA_TRANSITION_DURATION,
          easingPower: ANIMATION.EASING_POWER,
          onComplete: () => {
            setIsTransitioning(false);

            const ctr = controlsRef.current;
            if (!ctr) return;
            if (targetArea.minPolarAngle !== undefined) {
              ctr.minPolarAngle = targetArea.minPolarAngle;
            }
            if (targetArea.maxPolarAngle !== undefined) {
              ctr.maxPolarAngle = targetArea.maxPolarAngle;
            }
            ctr.update();
          },
        },
      );

      if (targetArea.minPolarAngle !== undefined) {
        controlsRef.current.minPolarAngle = targetArea.minPolarAngle;
      }
      if (targetArea.maxPolarAngle !== undefined) {
        controlsRef.current.maxPolarAngle = targetArea.maxPolarAngle;
      }
    } else {
      setIsTransitioning(false);
    }
  };

  const toggleFreeMode = () => {
    if (isTransitioning) return;

    play("toggle");

    if (freeMode) {
      setFreeMode(false);
      return;
    }

    if (DEBUG.ENABLED || !cameraRef.current || !controlsRef.current) {
      setFreeMode(true);
      return;
    }
    cancelAnimation();
    setIsTransitioning(true);
    setCurrentArea(0);
    animateCamera(
      { camera: cameraRef.current, controls: controlsRef.current },
      areaCameraPosition(areas[0], isMobile),
      areas[0].target,
      {
        duration: ANIMATION.AREA_TRANSITION_DURATION,
        easingPower: ANIMATION.EASING_POWER,
        onComplete: () => {
          setIsTransitioning(false);
          setFreeMode(true);
        },
      },
    );
  };

  useEffect(() => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(...INTRO_START_POSITION);
      controlsRef.current.target.set(...INTRO_START_TARGET);
      controlsRef.current.update();
    }
  }, [cameraRef, controlsRef]);

  const startExperience = useCallback(() => {
    if (introPhase !== "loading") return;
    if (!sceneReady) return;
    if (!cameraRef.current || !controlsRef.current) return;

    setIntroPhase("intro");
    setIsTransitioning(true);
    play("transition");

    animateCamera(
      { camera: cameraRef.current, controls: controlsRef.current },
      areaCameraPosition(areas[0], isMobile),
      areas[0].target,
      {
        duration: INTRO_DURATION,
        easingPower: INTRO_EASING_POWER,
        onComplete: () => {
          const initialArea = areas[0];
          if (controlsRef.current) {
            if (initialArea.minPolarAngle !== undefined) {
              controlsRef.current.minPolarAngle = initialArea.minPolarAngle;
            }
            if (initialArea.maxPolarAngle !== undefined) {
              controlsRef.current.maxPolarAngle = initialArea.maxPolarAngle;
            }
            controlsRef.current.update();
          }
          setIsTransitioning(false);
          setIntroPhase("ready");
        },
      },
    );
  }, [
    introPhase,
    sceneReady,
    animateCamera,
    cameraRef,
    controlsRef,
    isMobile,
    play,
  ]);

  useEffect(() => {
    if (DEBUG.ENABLED) return;

    const handleWheel = (event: WheelEvent) => {
      if (freeMode) return;
      event.preventDefault();
      event.stopPropagation();

      if (isTransitioning || introPhase !== "ready") return;

      if (laptopActive || laptopBaseRef.current) {
        handleLaptopExit();
        return;
      }

      if (galleryBaseRef.current) {
        galleryRef.current?.deactivate();
        handleFrameActivate(null, null);
        return;
      }

      const direction = event.deltaY > 0 ? 1 : -1;
      moveToArea(nextAreaIndex(currentArea, direction, areas.length));
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && (laptopActive || laptopBaseRef.current)) {
        event.preventDefault();
        handleLaptopExit();
        return;
      }

      if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
        if (introPhase !== "ready" || freeMode || laptopActive) return;
        const galleryIndex = areas.findIndex(
          (a) => a.name === AREAS.GALLERY.name,
        );
        if (currentArea !== galleryIndex) return;
        event.preventDefault();
        play("step");
        galleryRef.current?.step(event.key === "ArrowRight" ? 1 : -1);
        return;
      }

      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();

        if (introPhase !== "ready" || freeMode) return;

        if (laptopActive || laptopBaseRef.current) {
          handleLaptopExit();
          return;
        }

        if (galleryBaseRef.current) {
          galleryRef.current?.deactivate();
          handleFrameActivate(null, null);
          return;
        }

        const direction = event.key === "ArrowDown" ? 1 : -1;
        moveToArea(nextAreaIndex(currentArea, direction, areas.length));
      }
    };

    let swipeStartX = 0;
    let swipeStartY = 0;
    let swipeTracking = false;

    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) {
        swipeTracking = false;
        return;
      }
      swipeStartX = event.touches[0].clientX;
      swipeStartY = event.touches[0].clientY;
      swipeTracking = true;
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (!swipeTracking) return;
      swipeTracking = false;

      const touch = event.changedTouches[0];
      if (!touch) return;

      const dx = touch.clientX - swipeStartX;
      const dy = touch.clientY - swipeStartY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);

      if (freeMode || introPhase !== "ready" || isTransitioning) return;

      if (laptopActive || laptopBaseRef.current) {
        if (Math.max(absX, absY) < GESTURES.SWIPE_MIN_DISTANCE) return;
        handleLaptopExit();
        return;
      }

      if (absX < GESTURES.SWIPE_MIN_DISTANCE) return;
      if (absX < absY * GESTURES.SWIPE_HORIZONTAL_RATIO) return;

      const direction = dx < 0 ? 1 : -1;

      if (galleryBaseRef.current) {
        galleryRef.current?.step(direction);
        return;
      }

      moveToArea(nextAreaIndex(currentArea, direction, areas.length));
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentArea, isTransitioning, introPhase, freeMode, laptopActive, isMobile]);

  return {
    currentArea,
    isTransitioning,
    introPhase,
    freeMode,
    laptopActive,
    galleryZoomed,
    sceneReady,
    setSceneReady,
    startExperience,
    moveToArea,
    handleFrameActivate,
    handleLaptopHover,
    handleLaptopActivate,
    stepGalleryFrame,
    exitGalleryZoom,
    toggleFreeMode,
  };
}
