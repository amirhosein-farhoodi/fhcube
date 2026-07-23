# fh-portfolio-inner

A faux Windows desktop ("Laptop OS") rendered with React + Vite. It is the
**inner app**: it is designed to be embedded in an iframe by a parent 3D shell
(the laptop on screen runs at port 3000), but it also runs standalone in a
browser tab.

## Commands

```bash
npm run dev       # Vite dev server on http://localhost:5174
npm run build     # tsc -b && vite build  → dist/
npm run preview   # serve the production build on :5174
npm run lint      # eslint
```

## Tech stack

- React 19 + TypeScript (strict), Vite 7
- `@monaco-editor/react` for the in-window code editor
- js-dos for the DOOM app, loaded lazily by `DoomApp` (injected on demand) so the engine is never fetched until DOOM is opened
- No CSS files — every component styles itself with inline `style` objects

## Architecture

The whole UI is the `LaptopOS` desktop. The desktop shows icons; opening one
mounts a single `AppWindow` containing that app. Only one window is open at a
time.

```
src/
  main.tsx                  React root
  App.tsx                   iframe<->parent bridge; renders <LaptopOS isActive>
  laptop-os/
    LaptopOS.tsx            desktop shell: icons, open-window state, taskbar
    apps.ts                 APPS registry (id, title, label, icon) + DESKTOP_APPS
    types.ts                AppId union + AppMeta
    constants.ts            ICONS, WALLPAPER, RESUME_PDF, FONT, layout dimensions
    components/             reusable desktop chrome
      AppWindow.tsx         titled, closable window frame (floating or fullscreen)
      DesktopIcon.tsx       selectable / double-click-to-open icon
      Taskbar.tsx           start button, active-app pill, tray, live clock
    apps/                   one file per launchable app
      VSCodeApp.tsx         Monaco editor with starter code
      PdfViewerApp.tsx      resume PDF in an iframe
      DoomApp.tsx           js-dos DOOM bundle (/doom.jsdos)
      ExperiencesApp.tsx    Chrome-like browser over portfolio project sites
      DirectContactApp.tsx  contact form (Web3Forms or mailto fallback)
```

### Adding a new app

1. Add its id to the `AppId` union in `types.ts`.
2. Add an entry to `APPS` in `apps.ts` (id, window `title`, desktop `label`, `icon`).
3. Create the component in `apps/`.
4. Wire it into the render switch inside `LaptopOS.tsx`.

### Key conventions

- **Single source for shared values** live in `constants.ts`: the `FONT` stack,
  `TASKBAR_HEIGHT` / `TITLE_BAR_HEIGHT` (shared by `AppWindow` and `Taskbar`),
  and all asset paths (`ICONS`, `WALLPAPER`, `RESUME_PDF`).
- **Static assets** are served from `public/` (e.g. `/Images/...`, `/chrome.png`,
  `/doom.jsdos`, `/js-dos/`). Reference them by absolute path.
- **Active / idle**: the parent shell posts `{ type: "fh:setActive", value }`
  via `postMessage`; `App.tsx` tracks it as `isActive`. When inactive the OS
  closes any open app and clears selection. Standalone (not iframed) defaults to
  active.

## Configuration

`DirectContactApp` reads `VITE_WEB3FORMS_KEY` from `.env`. With a key, form
submissions POST to Web3Forms and are emailed to the address in `TO_EMAIL`.
Without a key, the form falls back to opening the visitor's mail client
(`mailto:`).
