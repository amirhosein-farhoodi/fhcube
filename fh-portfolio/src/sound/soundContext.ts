import { createContext } from "react";
import type { SfxName } from "./sfx";

export interface SoundContextValue {
  play: (name: SfxName) => void;
  muted: boolean;
  toggleMute: () => void;
  ready: boolean;
  unlock: () => void;
}

export const SoundContext = createContext<SoundContextValue | null>(null);
