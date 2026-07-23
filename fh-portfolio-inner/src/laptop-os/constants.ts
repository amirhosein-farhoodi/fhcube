export const FONT = "'Segoe UI', system-ui, sans-serif";

export const TASKBAR_HEIGHT = 40;
export const TITLE_BAR_HEIGHT = 32;

export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;

export const ICONS = {
  start: asset("Images/LaptopFrame/windows_start_icon.png"),
  speaker: asset("Images/LaptopFrame/windows_speaker_icon.png"),
  battery: asset("Images/LaptopFrame/windows_laptop_battery_icon.png"),
  lan: asset("Images/LaptopFrame/windows_lan_icon.png"),
  vscode: asset("Images/LaptopFrame/windows_vscode_icon.png"),
  pdf: asset("Images/LaptopFrame/windows_pdf_icon.png"),
  doom: asset("Images/LaptopFrame/doom_game_icon.png"),
  experiences: asset("chrome.png"),
  links: asset("Images/LaptopFrame/link_icon.png"),
  about: asset("Images/LaptopFrame/about.png"),
  directContact:
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 48 48'%3E%3Crect x='4' y='9' width='40' height='30' rx='4' fill='%232b88d8'/%3E%3Cpath d='M6 13l18 14 18-14' fill='none' stroke='white' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E",
} as const;

export const WALLPAPER = asset("Images/LaptopFrame/windows_background.webp");
export const RESUME_PDF = asset("files/amirhosein-farhoodi.pdf");
