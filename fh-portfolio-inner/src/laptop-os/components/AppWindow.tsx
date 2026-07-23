import type { ReactNode } from "react";
import { FONT, TASKBAR_HEIGHT, TITLE_BAR_HEIGHT } from "../constants";

interface AppWindowProps {
  icon: string;
  title: string;
  onClose: () => void;
  children: ReactNode;
  fullscreen?: boolean;
}

export function AppWindow({
  icon,
  title,
  onClose,
  children,
  fullscreen = false,
}: AppWindowProps) {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          ...(fullscreen
            ? {
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: TASKBAR_HEIGHT,
                borderRadius: 0,
              }
            : {
                width: 960,
                height: 620,
                maxWidth: "92%",
                maxHeight: "82%",
                borderRadius: 4,
              }),
          background: "#1e1e1e",
          border: "1px solid rgba(0,0,0,0.6)",
          boxShadow: "0 18px 40px rgba(0,0,0,0.55)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          pointerEvents: "auto",
        }}
      >
        <div
          style={{
            height: TITLE_BAR_HEIGHT,
            background: "#2d2d2d",
            color: "#e6e6e6",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 0 0 10px",
            fontFamily: FONT,
            fontSize: 12,
            userSelect: "none",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <img src={icon} alt="" style={{ width: 16, height: 16 }} />
            <span>{title}</span>
          </div>

          <button
            type="button"
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            style={{
              all: "unset",
              width: 46,
              height: TITLE_BAR_HEIGHT,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 80ms ease",
              color: "#e6e6e6",
              fontSize: 14,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#e81123";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#e6e6e6";
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ flex: 1, minHeight: 0, background: "white" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
