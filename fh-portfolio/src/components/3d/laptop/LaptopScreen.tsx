import { Html } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { SCENE_CONFIG } from "../../../constants/scene";
import { getDeviceTier } from "../../../lib/deviceTier";
import { LaptopScreenImage } from "./LaptopScreenImage";

const { LAPTOP_SCREEN } = SCENE_CONFIG;

const INNER_URL =
  (import.meta.env.VITE_INNER_URL as string | undefined) ??
  (import.meta.env.DEV ? "http://localhost:5174" : "/inner/");

export interface LaptopScreenHandle {
  getWorldPosition: () => THREE.Vector3 | null;

  getWorldNormal: () => THREE.Vector3 | null;
}

interface LaptopScreenProps {
  isActive: boolean;
  onHoverChange: (hovered: boolean) => void;
  onActivate: () => void;
}

const DREI_HTML_PIXEL_FACTOR = 40;
const HTML_SCALE: [number, number, number] = [
  (LAPTOP_SCREEN.WIDTH * DREI_HTML_PIXEL_FACTOR) / LAPTOP_SCREEN.PIXEL_WIDTH,
  (LAPTOP_SCREEN.HEIGHT * DREI_HTML_PIXEL_FACTOR) / LAPTOP_SCREEN.PIXEL_HEIGHT,
  1,
];

const LOW_POWER = getDeviceTier() === "low";
const SCREEN_OCCLUDE: "blending" | false = LOW_POWER ? false : "blending";

export const LaptopScreen = forwardRef<LaptopScreenHandle, LaptopScreenProps>(
  function LaptopScreen({ isActive, onHoverChange, onActivate }, ref) {
    const groupRef = useRef<THREE.Group>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const iframeShown = !LOW_POWER || isActive;
    const [iframePainted, setIframePainted] = useState(iframeShown);

    useEffect(() => {
      if (iframeShown) {
        setIframePainted(true);
        return;
      }
      const timer = window.setTimeout(
        () => setIframePainted(false),
        LAPTOP_SCREEN.IFRAME_FADE_MS,
      );
      return () => window.clearTimeout(timer);
    }, [iframeShown]);

    useImperativeHandle(ref, () => ({
      getWorldPosition: () => {
        if (!groupRef.current) return null;
        return groupRef.current.getWorldPosition(new THREE.Vector3());
      },
      getWorldNormal: () => {
        if (!groupRef.current) return null;
        const n = new THREE.Vector3(0, 0, 1);
        n.applyQuaternion(groupRef.current.getWorldQuaternion(new THREE.Quaternion()));
        return n.normalize();
      },
    }));

    useEffect(() => {
      const send = () => {
        iframeRef.current?.contentWindow?.postMessage(
          { type: "fh:setActive", value: isActive },
          "*",
        );
      };

      send();
      const iframe = iframeRef.current;
      if (!iframe) return;
      iframe.addEventListener("load", send);
      return () => iframe.removeEventListener("load", send);
    }, [isActive]);

    const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (isActive) return;
      onHoverChange(true);
      document.body.style.cursor = "pointer";
    };

    const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
      e.stopPropagation();
      if (isActive) return;
      onHoverChange(false);
      document.body.style.cursor = "";
    };

    const handleClick = (e: ThreeEvent<MouseEvent>) => {
      e.stopPropagation();
      if (isActive) return;
      onActivate();
    };

    return (
      <group
        ref={groupRef}
        position={LAPTOP_SCREEN.POSITION}
        rotation={LAPTOP_SCREEN.ROTATION}
      >
        {LOW_POWER && <LaptopScreenImage />}

        {!isActive && (
          <mesh
            onPointerOver={handlePointerOver}
            onPointerOut={handlePointerOut}
            onClick={handleClick}
          >
            <planeGeometry args={[LAPTOP_SCREEN.WIDTH, LAPTOP_SCREEN.HEIGHT]} />
            <meshBasicMaterial
              color={
                LAPTOP_SCREEN.DEBUG_VISIBLE_BACKPLATE
                  ? LAPTOP_SCREEN.DEBUG_BACKPLATE_COLOR
                  : "#000000"
              }
              transparent
              opacity={LAPTOP_SCREEN.DEBUG_VISIBLE_BACKPLATE ? 0.5 : 0}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        )}

        <Html
          transform
          occlude={SCREEN_OCCLUDE}
          position={[0, 0, 0.005]}
          scale={HTML_SCALE}
          pointerEvents={isActive ? "auto" : "none"}
          zIndexRange={[100, 0]}
          style={{
            width: `${LAPTOP_SCREEN.PIXEL_WIDTH}px`,
            height: `${LAPTOP_SCREEN.PIXEL_HEIGHT}px`,
            opacity: iframeShown ? 1 : 0,
            transition: `opacity ${LAPTOP_SCREEN.IFRAME_FADE_MS}ms ease`,
            visibility: iframeShown || iframePainted ? "visible" : "hidden",
          }}
        >
          <iframe
            ref={iframeRef}
            src={INNER_URL}
            title="LaptopOS"
            style={{
              width: "100%",
              height: "100%",
              border: 0,
              display: "block",
              background: "#000",
            }}
          />
        </Html>
      </group>
    );
  },
);
