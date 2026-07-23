import { useSfx } from "../../sound";
import { RESUME_PDF } from "./constants";

function speakerIcon(isMuted: boolean) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="4 9 8 9 13 5 13 19 8 15 4 15" />
      {isMuted ? (
        <>
          <line x1="16" y1="9" x2="21" y2="14" />
          <line x1="21" y1="9" x2="16" y2="14" />
        </>
      ) : (
        <>
          <path d="M16 8.5a4 4 0 0 1 0 7" />
          <path d="M18.7 6a7 7 0 0 1 0 12" />
        </>
      )}
    </svg>
  );
}

export function TopControls({
  visible,
  isTransitioning,
  freeMode,
  onToggleMode,
}: {
  visible: boolean;
  isTransitioning: boolean;
  freeMode: boolean;
  onToggleMode: () => void;
}) {
  const { play, muted, toggleMute } = useSfx();
  return (
    <>
      <img
        src="/images/icon.png"
        alt="Amirhosein Farhoodi"
        draggable={false}
        style={{
          position: "absolute",
          top: "16px",
          right: "16px",
          height: "40px",
          width: "auto",
          zIndex: 1000,
          opacity: visible ? 1 : 0,
          pointerEvents: "none",
          userSelect: "none",
          transition: "opacity 500ms ease-in",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          zIndex: 1000,
          display: "flex",
          gap: "10px",
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
          transition: "opacity 500ms ease-in",
        }}
      >
        <a
          href={RESUME_PDF}
          download
          onMouseEnter={() => play("hover")}
          onClick={() => play("select")}
          style={{
            color: "white",
            fontSize: "12px",
            letterSpacing: "0.15em",
            fontWeight: 500,
            background: "rgba(0, 0, 0, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            padding: "8px 14px",
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
            cursor: "pointer",
            textDecoration: "none",
            transition: "background 200ms, border 200ms",
          }}
        >
          RESUME
        </a>

        <button
          type="button"
          disabled={isTransitioning}
          onClick={onToggleMode}
          onMouseEnter={() => play("hover")}
          style={{
            all: "unset",
            color: "white",
            fontSize: "12px",
            letterSpacing: "0.15em",
            fontWeight: 500,
            background: freeMode
              ? "rgba(184, 200, 224, 0.18)"
              : "rgba(0, 0, 0, 0.5)",
            border: freeMode
              ? "1px solid rgba(184, 200, 224, 0.6)"
              : "1px solid rgba(255, 255, 255, 0.15)",
            padding: "8px 14px",
            borderRadius: "16px",
            backdropFilter: "blur(10px)",
            cursor: isTransitioning ? "default" : "pointer",
            opacity: isTransitioning ? 0.7 : 1,
            transition: "background 200ms, border 200ms, opacity 200ms",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {isTransitioning && <span className="fh-mode-spinner" />}
          {freeMode ? "AUTO VIEW" : "MANUAL"}
        </button>

        <button
          type="button"
          aria-label={muted ? "Unmute sound effects" : "Mute sound effects"}
          aria-pressed={muted}
          onClick={toggleMute}
          onMouseEnter={() => play("hover")}
          style={{
            all: "unset",
            boxSizing: "border-box",
            width: 36,
            height: 36,
            borderRadius: "50%",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            background: "rgba(0, 0, 0, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.15)",
            backdropFilter: "blur(10px)",
            cursor: "pointer",
            opacity: muted ? 0.55 : 1,
            transition: "opacity 200ms, border 200ms",
          }}
        >
          {speakerIcon(muted)}
        </button>
      </div>
    </>
  );
}
