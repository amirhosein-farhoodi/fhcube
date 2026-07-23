import type { CSSProperties } from "react";

function chevron(points: string) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points={points} />
    </svg>
  );
}

export function MobileAreaNav({
  visible,
  currentArea,
  total,
  currentAreaName,
  isTransitioning,
  onStep,
}: {
  visible: boolean;
  currentArea: number;
  total: number;
  currentAreaName: string;
  isTransitioning: boolean;
  onStep: (direction: number) => void;
}) {
  const containerStyle: CSSProperties = {
    position: "absolute",
    bottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
    left: "50%",
    transform: "translateX(-50%)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    maxWidth: "100vw",
    opacity: visible ? 1 : 0,
    transition: "opacity 500ms ease-in",
    pointerEvents: visible ? "auto" : "none",
  };

  const arrowStyle: CSSProperties = {
    all: "unset",
    width: 36,
    height: 36,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    cursor: isTransitioning ? "default" : "pointer",
    opacity: isTransitioning ? 0.4 : 1,
  };

  return (
    <div style={containerStyle}>
      <div
        style={{
          color: "white",
          fontSize: "16px",
          fontWeight: 500,
          background: "rgba(0, 0, 0, 0.5)",
          padding: "6px 8px",
          borderRadius: "20px",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          gap: "2px",
        }}
      >
        <button
          type="button"
          aria-label="Previous area"
          onClick={() => onStep(-1)}
          disabled={isTransitioning}
          style={arrowStyle}
        >
          {chevron("15 18 9 12 15 6")}
        </button>
        <span style={{ padding: "0 6px", whiteSpace: "nowrap" }}>
          {currentAreaName} ({currentArea + 1}/{total})
        </span>
        <button
          type="button"
          aria-label="Next area"
          onClick={() => onStep(1)}
          disabled={isTransitioning}
          style={arrowStyle}
        >
          {chevron("9 18 15 12 9 6")}
        </button>
      </div>
    </div>
  );
}
