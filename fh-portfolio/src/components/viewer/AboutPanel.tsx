import type { CSSProperties } from "react";

const SUMMARY =
  "Frontend Engineer with 7+ years shipping high-traffic web apps (1M+ MAU) with React, Next.js, and TypeScript — and integrating LLMs like Claude into products and daily workflow. Off the keyboard, my daily routine is skateboarding, exercise, and gaming.";

export function AboutPanel({
  visible,
  isMobile,
}: {
  visible: boolean;
  isMobile: boolean;
}) {
  const placement: CSSProperties = isMobile
    ? { left: "16px", right: "16px", bottom: "80px" }
    : { left: "18%", top: "15%", maxWidth: "340px" };

  return (
    <aside
      style={{
        position: "absolute",
        zIndex: 1000,
        ...placement,
        background: "rgba(0, 0, 0, 0.42)",
        border: "1px solid rgba(255, 255, 255, 0.14)",
        borderRadius: "18px",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        padding: "20px 22px",
        boxShadow: "0 12px 40px rgba(0, 0, 0, 0.38)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 500ms ease, transform 500ms ease",
      }}
    >
      <p
        style={{
          margin: 0,
          fontSize: "16px",
          lineHeight: 1.7,
          color: "rgba(255, 255, 255, 0.88)",
        }}
      >
        {SUMMARY}
      </p>
    </aside>
  );
}
