import { getDeviceTier } from "./deviceTier";

const FOLDER_BY_TIER = {
  low: "/models-mobile/",
  medium: "/models-medium/",
  high: "/models/",
} as const;

export function resolveModelUrl(url: string): string {
  return url.replace("/models/", FOLDER_BY_TIER[getDeviceTier()]);
}
