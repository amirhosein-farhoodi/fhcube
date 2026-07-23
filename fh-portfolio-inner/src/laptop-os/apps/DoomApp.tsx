import { useEffect, useRef, useState } from "react";

interface DosInstance {
  run: (bundleUrl: string) => void;
  stop: () => void;
}
declare const Dos: (root: HTMLDivElement) => DosInstance;
declare const emulators: { pathPrefix: string } | undefined;

const JS_DOS_DIR = `${import.meta.env.BASE_URL}js-dos/`;
const JS_DOS_SCRIPT = `${JS_DOS_DIR}js-dos.js`;
const JS_DOS_CSS = `${JS_DOS_DIR}js-dos.css`;
const BUNDLE_URL = `${import.meta.env.BASE_URL}doom.jsdos`;

function loadJsDos(): Promise<void> {
  if (typeof Dos === "function") return Promise.resolve();

  if (!document.querySelector(`link[href="${JS_DOS_CSS}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = JS_DOS_CSS;
    document.head.appendChild(link);
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${JS_DOS_SCRIPT}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("js-dos failed to load")),
      );
      return;
    }
    const script = document.createElement("script");
    script.src = JS_DOS_SCRIPT;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("js-dos failed to load"));
    document.head.appendChild(script);
  });
}

export function DoomApp() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let dos: DosInstance | null = null;

    loadJsDos()
      .then(() => {
        if (cancelled || !rootRef.current) return;
        if (typeof Dos !== "function") {
          setError("js-dos failed to load.");
          return;
        }
        if (typeof emulators !== "undefined") {
          emulators.pathPrefix = JS_DOS_DIR;
        }
        dos = Dos(rootRef.current);
        dos.run(BUNDLE_URL);

        const stripChrome =
          rootRef.current.getElementsByClassName("flex-grow-0");
        while (stripChrome.length > 0) stripChrome[0].remove();
      })
      .catch(() => {
        if (!cancelled) setError("js-dos failed to load.");
      });

    return () => {
      cancelled = true;
      dos?.stop();
    };
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        background: "#000",
      }}
    >
      {error && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontFamily: "monospace",
            padding: 16,
            textAlign: "center",
          }}
        >
          {error}
        </div>
      )}
      <div
        ref={rootRef}
        style={{
          width: "100%",
          height: "100%",
          position: "absolute",
          inset: 0,
        }}
      />
    </div>
  );
}
