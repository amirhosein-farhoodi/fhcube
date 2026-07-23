import { useContext } from "react";
import { SoundContext } from "./soundContext";
import type { SoundContextValue } from "./soundContext";

const SILENT: SoundContextValue = {
  play: () => undefined,
  muted: false,
  toggleMute: () => undefined,
  ready: false,
  unlock: () => undefined,
};

export function useSfx(): SoundContextValue {
  return useContext(SoundContext) ?? SILENT;
}
