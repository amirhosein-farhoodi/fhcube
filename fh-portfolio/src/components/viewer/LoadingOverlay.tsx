import { useProgress } from "@react-three/drei";
import { SCENE_CONFIG } from "../../constants/scene";
import type { DeviceTier } from "../../lib/deviceTier";

const { CAMERA } = SCENE_CONFIG;

const TIER_LABEL: Record<DeviceTier, string> = {
  low: "lite quality",
  medium: "balanced quality",
  high: "high quality",
};

type StepStatus = "pending" | "active" | "done";

const STATUS_MARK: Record<StepStatus, string> = {
  pending: "·",
  active: "›",
  done: "✓",
};

const STATUS_OPACITY: Record<StepStatus, number> = {
  pending: 0.25,
  active: 0.9,
  done: 0.55,
};

function Step({
  label,
  detail,
  status,
}: {
  label: string;
  detail?: string;
  status: StepStatus;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "10px",
        color: "white",
        fontSize: "11px",
        letterSpacing: "0.18em",
        opacity: STATUS_OPACITY[status],
        transition: "opacity 300ms ease-out",
      }}
    >
      <span style={{ width: "12px", textAlign: "center" }}>
        {STATUS_MARK[status]}
      </span>
      <span style={{ flex: 1 }}>{label}</span>
      {detail && (
        <span style={{ opacity: 0.5, letterSpacing: "0.1em" }}>{detail}</span>
      )}
    </div>
  );
}

export function LoadingOverlay({
  visible,
  tier,
  modelsReady,
  audioReady,
  onEnter,
}: {
  visible: boolean;
  tier: DeviceTier;
  modelsReady: boolean;
  audioReady: boolean;
  onEnter: () => void;
}) {
  const { progress } = useProgress();

  const canEnter = modelsReady && audioReady;

  const modelsStatus: StepStatus = modelsReady ? "done" : "active";
  const audioStatus: StepStatus = !modelsReady
    ? "pending"
    : audioReady
      ? "done"
      : "active";

  return (
    <div
      onClick={() => {
        if (canEnter) onEnter();
      }}
      style={{
        position: "fixed",
        inset: 0,
        background: CAMERA.BACKGROUND_COLOR,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        cursor: canEnter ? "pointer" : "default",
        transition: "opacity 600ms ease-out",
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: "12px",
          letterSpacing: "0.4em",
          marginBottom: "28px",
          opacity: 0.85,
        }}
      >
        LOADING
      </div>

      <div
        style={{
          width: "260px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        <Step label="determining your device" detail={TIER_LABEL[tier]} status="done" />
        <Step
          label="loading models"
          detail={modelsReady ? undefined : `${Math.round(progress)}%`}
          status={modelsStatus}
        />
        <Step label="preparing audio" status={audioStatus} />
      </div>

      <div
        style={{
          width: "260px",
          height: "2px",
          background: "rgba(255,255,255,0.08)",
          overflow: "hidden",
          borderRadius: "1px",
          marginTop: "24px",
        }}
      >
        <div
          style={{
            height: "100%",
            width: canEnter ? "100%" : `${progress}%`,
            background: "white",
            transition: "width 200ms ease-out",
          }}
        />
      </div>

      <div
        style={{
          color: "white",
          fontSize: "11px",
          letterSpacing: "0.2em",
          marginTop: "24px",
          height: "14px",
          opacity: canEnter ? 0.9 : 0,
          transition: "opacity 400ms ease-out",
          animation: canEnter ? "fh-pulse 1.6s ease-in-out infinite" : "none",
        }}
      >
        click anywhere to enter
      </div>

      <style>{"@keyframes fh-pulse{0%,100%{opacity:0.4}50%{opacity:0.95}}"}</style>
    </div>
  );
}
