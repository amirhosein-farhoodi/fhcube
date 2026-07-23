import { useSfx } from "../../sound";
import { areas } from "./areas";
import { MENU_ITEMS, NAV_GOLD, NAV_IDLE } from "./menu";
import { NavIcon } from "./NavIcon";

export function NavMenu({
  visible,
  currentArea,
  isTransitioning,
  onSelect,
}: {
  visible: boolean;
  currentArea: number;
  isTransitioning: boolean;
  onSelect: (index: number) => void;
}) {
  const { play } = useSfx();
  return (
    <nav
      style={{
        position: "absolute",
        left: "34px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 500ms ease-in",
      }}
    >
      {MENU_ITEMS.map((item) => {
        const index = areas.findIndex((a) => a.name === item.areaName);
        const isActive = currentArea === index;
        return (
          <button
            key={item.label}
            type="button"
            onClick={() => onSelect(index)}
            disabled={isTransitioning}
            style={{
              all: "unset",
              display: "flex",
              alignItems: "center",
              gap: "16px",
              padding: "9px 2px",
              width: "fit-content",
              cursor: isTransitioning ? "default" : "pointer",
              color: isActive ? NAV_GOLD : NAV_IDLE,
              borderBottom: isActive
                ? `1.5px solid ${NAV_GOLD}`
                : "1.5px solid transparent",
              transition: "color 200ms",
            }}
            onMouseEnter={(e) => {
              if (isTransitioning) return;
              if (!isActive) e.currentTarget.style.color = "#ffffff";
              play("hover");
            }}
            onMouseLeave={(e) => {
              if (!isActive) e.currentTarget.style.color = NAV_IDLE;
            }}
          >
            <NavIcon name={item.icon} />
            <span
              style={{
                fontSize: "15px",
                letterSpacing: "0.22em",
                fontWeight: 600,
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
