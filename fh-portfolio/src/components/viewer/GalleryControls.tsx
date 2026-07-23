import type { CSSProperties } from "react";

function icon(children: React.ReactNode) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function GalleryControls({
  visible,
  isTransitioning,
  onStep,
  onClose,
}: {
  visible: boolean;
  isTransitioning: boolean;
  onStep: (direction: number) => void;
  onClose: () => void;
}) {
  const layerStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    zIndex: 1000,
    pointerEvents: "none",
    opacity: visible ? 1 : 0,
    transition: "opacity 350ms ease-in",
  };

  const roundButton: CSSProperties = {
    all: "unset",
    boxSizing: "border-box",
    width: 48,
    height: 48,
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    background: "rgba(0, 0, 0, 0.5)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    pointerEvents: visible ? "auto" : "none",
    cursor: "pointer",
  };

  const sideArrow = (extra: CSSProperties): CSSProperties => ({
    ...roundButton,
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    ...extra,
  });

  return (
    <div style={layerStyle}>
      <button
        type="button"
        aria-label="Previous image"
        onClick={() => onStep(-1)}
        style={sideArrow({ left: "14px" })}
      >
        {icon(<polyline points="15 18 9 12 15 6" />)}
      </button>

      <button
        type="button"
        aria-label="Next image"
        onClick={() => onStep(1)}
        style={sideArrow({ right: "14px" })}
      >
        {icon(<polyline points="9 18 15 12 9 6" />)}
      </button>

      <button
        type="button"
        aria-label="Close image"
        onClick={onClose}
        disabled={isTransitioning}
        style={{
          ...roundButton,
          position: "absolute",
          bottom: "calc(20px + env(safe-area-inset-bottom, 0px))",
          left: "50%",
          transform: "translateX(-50%)",
          width: "auto",
          height: 40,
          borderRadius: "20px",
          padding: "0 16px",
          gap: "8px",
          fontSize: "13px",
          fontWeight: 500,
          letterSpacing: "0.08em",
          opacity: isTransitioning ? 0.5 : 1,
        }}
      >
        {icon(
          <>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </>,
        )}
        CLOSE
      </button>
    </div>
  );
}
