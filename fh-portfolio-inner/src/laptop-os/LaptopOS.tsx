import { lazy, Suspense, useEffect, useState } from "react";
import { AppWindow } from "./components/AppWindow";
import { DesktopIcon } from "./components/DesktopIcon";
import { Taskbar } from "./components/Taskbar";
import { APPS, DESKTOP_APPS } from "./apps";
import { FONT, WALLPAPER } from "./constants";
import type { AppId } from "./types";

const VSCodeApp = lazy(() =>
  import("./apps/VSCodeApp").then((m) => ({ default: m.VSCodeApp })),
);
const PdfViewerApp = lazy(() =>
  import("./apps/PdfViewerApp").then((m) => ({ default: m.PdfViewerApp })),
);
const DoomApp = lazy(() =>
  import("./apps/DoomApp").then((m) => ({ default: m.DoomApp })),
);
const ExperiencesApp = lazy(() =>
  import("./apps/ExperiencesApp").then((m) => ({ default: m.ExperiencesApp })),
);
const DirectContactApp = lazy(() =>
  import("./apps/DirectContactApp").then((m) => ({
    default: m.DirectContactApp,
  })),
);
const LinksApp = lazy(() =>
  import("./apps/LinksApp").then((m) => ({ default: m.LinksApp })),
);
const AboutApp = lazy(() =>
  import("./apps/AboutApp").then((m) => ({ default: m.AboutApp })),
);

interface LaptopOSProps {
  isActive: boolean;
}

export function LaptopOS({ isActive }: LaptopOSProps) {
  const [openApp, setOpenApp] = useState<AppId | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<AppId | null>(null);
  const [experienceBrowsing, setExperienceBrowsing] = useState(false);

  const closeApp = () => {
    setOpenApp(null);
    setExperienceBrowsing(false);
  };

  useEffect(() => {
    if (!isActive || !openApp) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        e.preventDefault();
        closeApp();
      }
    };
    window.addEventListener("keydown", onKey, { capture: true });
    return () =>
      window.removeEventListener("keydown", onKey, { capture: true });
  }, [isActive, openApp]);

  useEffect(() => {
    if (!isActive) {
      setOpenApp(null);
      setSelectedIcon(null);
      setExperienceBrowsing(false);
    }
  }, [isActive]);

  const activeAppMeta = openApp ? APPS[openApp] : null;

  return (
    <div
      onClick={() => setSelectedIcon(null)}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        fontFamily: FONT,
        userSelect: "none",
      }}
    >
      <img
        src={WALLPAPER}
        alt=""
        draggable={false}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 16,
          left: 16,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          zIndex: 5,
        }}
      >
        {DESKTOP_APPS.map(({ id, label, icon }) => (
          <DesktopIcon
            key={id}
            icon={icon}
            label={label}
            selected={selectedIcon === id}
            onClick={() => setSelectedIcon(id)}
            onOpen={() => {
              setSelectedIcon(id);
              setOpenApp(id);
            }}
          />
        ))}
      </div>

      {activeAppMeta && openApp && (
        <AppWindow
          icon={activeAppMeta.icon}
          title={activeAppMeta.title}
          onClose={closeApp}
          fullscreen={openApp === "experiences" && experienceBrowsing}
        >
          <Suspense
            fallback={
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#000",
                  color: "#fff",
                  fontFamily: FONT,
                }}
              >
                Loading…
              </div>
            }
          >
            {openApp === "vscode" && <VSCodeApp />}
            {openApp === "pdf" && <PdfViewerApp />}
            {openApp === "doom" && <DoomApp />}
            {openApp === "experiences" && (
              <ExperiencesApp onBrowsingChange={setExperienceBrowsing} />
            )}
            {openApp === "directcontact" && <DirectContactApp />}
            {openApp === "links" && <LinksApp />}
            {openApp === "about" && <AboutApp />}
          </Suspense>
        </AppWindow>
      )}

      <Taskbar
        activeApp={activeAppMeta}
        onStartClick={() => {}}
        onActiveAppClick={() => {}}
      />
    </div>
  );
}
