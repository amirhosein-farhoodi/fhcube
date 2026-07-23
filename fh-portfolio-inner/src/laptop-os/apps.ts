import { ICONS } from "./constants";
import type { AppId, AppMeta } from "./types";

export const APPS: Record<AppId, AppMeta> = {
  vscode: {
    id: "vscode",
    title: "vscode.ts — Visual Studio Code",
    label: "VS Code",
    icon: ICONS.vscode,
  },
  pdf: {
    id: "pdf",
    title: "amirhosein-farhoodi.pdf",
    label: "Resume.pdf",
    icon: ICONS.pdf,
  },
  doom: {
    id: "doom",
    title: "DOOM",
    label: "DOOM",
    icon: ICONS.doom,
  },
  experiences: {
    id: "experiences",
    title: "Experiences — Chrome",
    label: "Experiences",
    icon: ICONS.experiences,
  },
  directcontact: {
    id: "directcontact",
    title: "Direct Contact",
    label: "Direct Contact",
    icon: ICONS.directContact,
  },
  links: {
    id: "links",
    title: "Links",
    label: "Links",
    icon: ICONS.links,
  },
  about: {
    id: "about",
    title: "About This Room",
    label: "About This",
    icon: ICONS.about,
  },
};

export const DESKTOP_APPS: AppMeta[] = Object.values(APPS);
