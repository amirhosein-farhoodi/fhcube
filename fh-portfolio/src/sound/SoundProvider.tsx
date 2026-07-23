import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  createAudioContext,
  createNoiseBuffer,
  playSpec,
} from "./audioEngine";
import { SFX, SFX_CONFIG } from "./sfx";
import type { SfxName } from "./sfx";
import { SoundContext } from "./soundContext";

function readMuted(): boolean {
  try {
    return window.localStorage.getItem(SFX_CONFIG.STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

function persistMuted(value: boolean): void {
  try {
    window.localStorage.setItem(SFX_CONFIG.STORAGE_KEY, String(value));
  } catch {
    return;
  }
}

export function SoundProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(readMuted);
  const [ready, setReady] = useState(false);

  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const noiseRef = useRef<AudioBuffer | null>(null);
  const lastPlayedRef = useRef<Record<string, number>>({});
  const mutedRef = useRef(muted);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  const ensureContext = useCallback(() => {
    if (!ctxRef.current) {
      const ctx = createAudioContext();
      if (!ctx) return null;
      const master = ctx.createGain();
      master.gain.value = SFX_CONFIG.MASTER_GAIN;
      master.connect(ctx.destination);
      ctxRef.current = ctx;
      masterRef.current = master;
      noiseRef.current = createNoiseBuffer(ctx);
    }
    if (ctxRef.current.state === "suspended") {
      void ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const unlock = useCallback(() => {
    ensureContext();
  }, [ensureContext]);

  useEffect(() => {
    ensureContext();
    setReady(true);
  }, [ensureContext]);

  useEffect(() => {
    const unlock = () => {
      ensureContext();
    };
    const resumeOnVisible = () => {
      if (document.visibilityState !== "visible") return;
      const ctx = ctxRef.current;
      if (ctx && ctx.state === "suspended") void ctx.resume().catch(() => {});
    };
    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("keydown", unlock, { passive: true });
    window.addEventListener("touchstart", unlock, { passive: true });
    document.addEventListener("visibilitychange", resumeOnVisible);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
      document.removeEventListener("visibilitychange", resumeOnVisible);
    };
  }, [ensureContext]);

  const play = useCallback(
    (name: SfxName) => {
      if (mutedRef.current) return;

      const spec = SFX[name];
      if (spec.throttleMs) {
        const now = performance.now();
        const last = lastPlayedRef.current[name] ?? 0;
        if (now - last < spec.throttleMs) return;
        lastPlayedRef.current[name] = now;
      }

      const ctx = ensureContext();
      if (!ctx || !masterRef.current || !noiseRef.current) return;

      if (ctx.state === "running") {
        playSpec(ctx, masterRef.current, noiseRef.current, spec);
        return;
      }

      void ctx
        .resume()
        .then(() => {
          if (
            ctx.state === "running" &&
            !mutedRef.current &&
            masterRef.current &&
            noiseRef.current
          ) {
            playSpec(ctx, masterRef.current, noiseRef.current, spec);
          }
        })
        .catch(() => {});
    },
    [ensureContext],
  );

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      persistMuted(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ play, muted, toggleMute, ready, unlock }),
    [play, muted, toggleMute, ready, unlock],
  );

  return (
    <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
  );
}
