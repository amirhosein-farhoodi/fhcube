import { SCENE_CONFIG } from "../../constants/scene";

const { AREAS } = SCENE_CONFIG;

export type MenuIconName =
  | "home"
  | "about"
  | "gallery"
  | "projects"
  | "cat"
  | "window";

export const MENU_ITEMS: {
  label: string;
  areaName: string;
  icon: MenuIconName;
}[] = [
  { label: "OVERVIEW", areaName: AREAS.OVERVIEW.name, icon: "home" },
  { label: "ABOUT", areaName: AREAS.AVATAR.name, icon: "about" },
  { label: "GALLERY", areaName: AREAS.GALLERY.name, icon: "gallery" },
  { label: "WORKSPACE", areaName: AREAS.PORTFOLIO.name, icon: "projects" },
  { label: "TOPOL", areaName: AREAS.TOPOL.name, icon: "cat" },
];

export const NAV_GOLD = "#e3a92e";
export const NAV_IDLE = "#eef1f5";
