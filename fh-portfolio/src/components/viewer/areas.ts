import { SCENE_CONFIG } from "../../constants/scene";
import type { Area } from "../../types/3d";

const { AREAS } = SCENE_CONFIG;

export const areas: Area[] = [
  {
    name: AREAS.OVERVIEW.name,
    position: AREAS.OVERVIEW.position,
    target: AREAS.OVERVIEW.target,
    component: AREAS.OVERVIEW.name,
    componentPosition: AREAS.OVERVIEW.componentPosition,
    minPolarAngle: AREAS.OVERVIEW.minPolarAngle,
    maxPolarAngle: AREAS.OVERVIEW.maxPolarAngle,
    mobileZoomOut: AREAS.OVERVIEW.mobileZoomOut,
  },
  {
    name: AREAS.GALLERY.name,
    position: AREAS.GALLERY.position,
    target: AREAS.GALLERY.target,
    component: AREAS.GALLERY.name,
    componentPosition: AREAS.GALLERY.componentPosition,
    minPolarAngle: AREAS.GALLERY.minPolarAngle,
    maxPolarAngle: AREAS.GALLERY.maxPolarAngle,
    mobileZoomOut: AREAS.GALLERY.mobileZoomOut,
  },
  {
    name: AREAS.PORTFOLIO.name,
    position: AREAS.PORTFOLIO.position,
    target: AREAS.PORTFOLIO.target,
    component: AREAS.PORTFOLIO.name,
    componentPosition: AREAS.PORTFOLIO.componentPosition,
    minPolarAngle: AREAS.PORTFOLIO.minPolarAngle,
    maxPolarAngle: AREAS.PORTFOLIO.maxPolarAngle,
  },
  {
    name: AREAS.TOPOL.name,
    position: AREAS.TOPOL.position,
    target: AREAS.TOPOL.target,
    component: AREAS.TOPOL.name,
    componentPosition: AREAS.TOPOL.componentPosition,
    minPolarAngle: AREAS.TOPOL.minPolarAngle,
    maxPolarAngle: AREAS.TOPOL.maxPolarAngle,
  },
  {
    name: AREAS.AVATAR.name,
    position: AREAS.AVATAR.position,
    target: AREAS.AVATAR.target,
    component: AREAS.AVATAR.name,
    componentPosition: AREAS.AVATAR.componentPosition,
    minPolarAngle: AREAS.AVATAR.minPolarAngle,
    maxPolarAngle: AREAS.AVATAR.maxPolarAngle,
  },
];

export function nextAreaIndex(
  current: number,
  direction: number,
  total: number,
) {
  return (current + direction + total) % total;
}

export function areaCameraPosition(
  area: Area,
  isMobile: boolean,
): [number, number, number] {
  const zoomOut = isMobile ? (area.mobileZoomOut ?? 0) : 0;
  if (zoomOut === 0) return area.position;

  const scale = 1 + zoomOut;
  return [
    area.target[0] + (area.position[0] - area.target[0]) * scale,
    area.target[1] + (area.position[1] - area.target[1]) * scale,
    area.target[2] + (area.position[2] - area.target[2]) * scale,
  ];
}
