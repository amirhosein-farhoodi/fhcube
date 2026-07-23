export type SfxName =
  | "hover"
  | "select"
  | "transition"
  | "back"
  | "step"
  | "zoom"
  | "toggle";

interface ToneSpec {
  kind: "tone";
  type: OscillatorType;
  freq: number;
  freqEnd?: number;
  attack: number;
  decay: number;
  gain: number;
  pitchVariation?: number;
  harmonic?: { ratio: number; gain: number };
  throttleMs?: number;
}

interface NoiseSpec {
  kind: "noise";
  filter: BiquadFilterType;
  freqStart: number;
  freqEnd: number;
  q: number;
  duration: number;
  attack: number;
  gain: number;
  pitchVariation?: number;
  throttleMs?: number;
}

export type SfxSpec = ToneSpec | NoiseSpec;

export const SFX_CONFIG = {
  MASTER_GAIN: 1.425,
  STORAGE_KEY: "fh-sfx-muted",
} as const;

export const SFX: Record<SfxName, SfxSpec> = {
  hover: {
    kind: "tone",
    type: "sine",
    freq: 1620,
    attack: 0.004,
    decay: 0.05,
    gain: 0.035,
    pitchVariation: 0.06,
    throttleMs: 70,
  },
  select: {
    kind: "tone",
    type: "triangle",
    freq: 760,
    freqEnd: 920,
    attack: 0.003,
    decay: 0.09,
    gain: 0.09,
    pitchVariation: 0.03,
    harmonic: { ratio: 2, gain: 0.04 },
  },
  transition: {
    kind: "noise",
    filter: "bandpass",
    freqStart: 420,
    freqEnd: 1900,
    q: 0.9,
    duration: 0.32,
    attack: 0.09,
    gain: 0.05,
  },
  back: {
    kind: "tone",
    type: "sine",
    freq: 620,
    freqEnd: 360,
    attack: 0.005,
    decay: 0.13,
    gain: 0.07,
    harmonic: { ratio: 1.5, gain: 0.025 },
  },
  step: {
    kind: "noise",
    filter: "lowpass",
    freqStart: 2600,
    freqEnd: 1400,
    q: 0.7,
    duration: 0.045,
    attack: 0.002,
    gain: 0.05,
    throttleMs: 40,
  },
  zoom: {
    kind: "tone",
    type: "sine",
    freq: 520,
    freqEnd: 1040,
    attack: 0.01,
    decay: 0.2,
    gain: 0.07,
    harmonic: { ratio: 2, gain: 0.03 },
  },
  toggle: {
    kind: "tone",
    type: "triangle",
    freq: 660,
    freqEnd: 990,
    attack: 0.004,
    decay: 0.11,
    gain: 0.06,
  },
};
