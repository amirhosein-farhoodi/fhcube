export type DeviceTier = "low" | "medium" | "high";

const LOW_POWER_SCREEN_MAX_DIMENSION = 820;
const MEDIUM_MEMORY_GB = 4;
const LOW_MEMORY_GB = 2;
const MEDIUM_CORE_COUNT = 4;

let cached: DeviceTier | undefined;

export function getDeviceTier(): DeviceTier {
  if (cached !== undefined) return cached;
  if (typeof window === "undefined") {
    cached = "high";
    return cached;
  }

  const coarsePointer =
    window.matchMedia?.("(pointer: coarse)").matches ?? false;
  const smallestScreenDimension = Math.min(
    window.screen?.width ?? Number.POSITIVE_INFINITY,
    window.screen?.height ?? Number.POSITIVE_INFINITY,
  );
  const smallScreen = smallestScreenDimension <= LOW_POWER_SCREEN_MAX_DIMENSION;

  const deviceMemory = (navigator as Navigator & { deviceMemory?: number })
    .deviceMemory;
  const cores = navigator.hardwareConcurrency ?? 0;

  const veryLowMemory = deviceMemory !== undefined && deviceMemory <= LOW_MEMORY_GB;
  const lowMemory = deviceMemory !== undefined && deviceMemory <= MEDIUM_MEMORY_GB;
  const fewCores = cores > 0 && cores <= MEDIUM_CORE_COUNT;

  if (coarsePointer || smallScreen || veryLowMemory) {
    cached = "low";
  } else if (lowMemory || fewCores) {
    cached = "medium";
  } else {
    cached = "high";
  }
  return cached;
}

export function byTier<T>(values: Record<DeviceTier, T>): T {
  return values[getDeviceTier()];
}
