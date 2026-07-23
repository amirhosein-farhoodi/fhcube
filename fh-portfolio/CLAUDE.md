# CLAUDE.md

Guidance for working in this repository.

## Golden rule: no comments

Do not write comments in code. None — no line comments, no block comments, no JSDoc, no TODO comments, no commented-out code. This applies to every language in the repo (`.ts`, `.tsx`, `.js`, `.css`, config files).

Write code that explains itself instead:

- Name things so intent is obvious (`frameProtrusion`, not `p` with a comment).
- Extract a well-named constant or function rather than annotating a magic number — put the value in `SCENE_CONFIG` (see below).
- If a value needs context, encode it in the identifier or in `SCENE_CONFIG`'s key names, not a comment.

When editing existing files, you may leave already-present comments in untouched code, but never add new ones, and prefer removing stale comments in code you are actively rewriting.

## What this project is

A single-page, interactive 3D portfolio. The visitor lands inside a small room rendered in WebGL and moves between fixed viewpoints ("areas") — an overview, a photo gallery wall, a desk/portfolio workspace, an avatar station, and a window — via animated camera moves. The desk holds an interactive laptop whose screen embeds the separate `fh-portfolio-inner` app (a faux laptop OS, including in-browser DOOM) via an iframe — built standalone and stitched into `public/inner/` at build time.

It is a showcase, not a product: there is no backend, no router, and no persistence. Everything renders from static assets in `public/`.

## Tech stack

- **React 19** + **TypeScript**, bundled by **Vite 7**.
- **three.js** via **@react-three/fiber** (React renderer for three) and **@react-three/drei** (helpers: `OrbitControls`, `Html`, `Stars`, `PositionalAudio`, `Text`, `useGLTF`, …).
- **CSS3DRenderer** run alongside the WebGL renderer to place real DOM (the laptop screen) inside the 3D scene.
- **lil-gui** for debug tweaking.
- **Triplex** as a visual scene editor (`.triplex/config.json`) — it introspects `src/components/3d/**` and `src/constants/**`.
- **Avaturn SDK** (`src/lib/avaturnSdk.js`) for avatar generation in the avatar area.

## Commands

```bash
npm run dev      # Vite dev server on port 3000
npm run build    # tsc -b && vite build  (this is the production gate)
npm run lint     # eslint .
npm run preview  # serve the production build
```

`npm run build` must pass before anything is considered done — it runs the full TypeScript project build (`tsc -b`) and then `vite build`. A passing `tsc --noEmit` alone is not sufficient because `tsc -b` compiles files the app does not import.

## Architecture

### Entry path

`src/main.tsx` → `src/App.tsx` → `src/components/ModelViewer.tsx`.

- `main.tsx` mounts React in `StrictMode`.
- `App.tsx` wraps everything in `AudioProvider` (shared audio context) and renders `ModelViewer`.
- `ModelViewer.tsx` is the whole experience: the `<Canvas>`, all lights, the scene graph, the camera-animation orchestration, the area-navigation UI, the intro flythrough, the loading overlay, and free/manual camera modes.

### Single source of truth: `src/constants/scene.ts`

`SCENE_CONFIG` holds every position, rotation, scale, color, light parameter, animation timing, and feature constant in the scene. Geometry is derived from a few room primitives (`ROOM_SIZE`, `ROOM_FLOOR_Y`, …) so nothing is a free-floating magic number.

Rules for this file:

- New tunable values go here, with a descriptive key — not inline in a component.
- Derive related values from existing ones (e.g. the gallery grid pitch is computed from frame size + gap so spacing stays uniform).
- Keep the `as [number, number, number]` tuple casts on vector literals so three.js props stay strongly typed.

### One component per file

Every `.tsx` exports exactly one component. Shared types, data, constants, and hooks live in their own `.ts` files next to the components that use them. Each feature folder has an `index.ts` barrel that re-exports its public surface.

### `src/components/viewer/`

The orchestration layer. `ModelViewer.tsx` is the top-level component (re-exported as the folder default via `index.ts`); it wires refs, the audio context, and the navigation hook into the `<Canvas>` and the UI overlays.

- `ModelViewer.tsx` — composes everything: `<Canvas>`, `RoomLights`, `SceneContents`, `OrbitControls`, and the DOM overlays. Holds the four scene refs (camera, controls, gallery, laptop).
- `useSceneNavigation.ts` — the navigation brain: area state, intro flythrough, camera moves (`useCameraAnimation`), laptop zoom, gallery frame zoom, and the wheel/keyboard handlers. Takes the scene refs, returns state + handlers.
- `RoomLights.tsx` — room-level lights (ceiling lamp, center fill, moonlight, window moonbeam) plus their debug markers.
- `SceneContents.tsx` — the `<Suspense>` scene graph: `Ground`, `Window`, `Gallery`, every `Model`, the portfolio desk group, and the reading-lamp / pet-rim lights.
- `LoadingOverlay.tsx`, `CameraReadout.tsx`, `SceneReadySignal.tsx` — small helpers.
- `TopControls.tsx`, `NavMenu.tsx`, `NavIcon.tsx`, `MobileAreaNav.tsx` — the DOM UI overlays.
- `areas.ts` (the navigable area list + `nextAreaIndex`), `menu.ts` (`MENU_ITEMS`, icon names, nav colors), `constants.ts` (résumé path, intro tuning) — data, no components.

### `src/components/3d/`

Feature folders, each with its own barrel; the top-level `3d/index.ts` re-exports the public components and handle types.

- `gallery/` — `Gallery.tsx` (the wall, exposes `GalleryHandle` for zoom/stepping) composed from `PhotoFrame.tsx`, `GalleryLamp.tsx` (the fixture + linear `RectAreaLight` wash), `GalleryLabel.tsx`, and the `localToWorld.ts` helper.
- `models/` — `Model.tsx` (the loader wrapper — use this for every model) dispatches to `GltfModel.tsx` / `FbxModel.tsx`; shared `ModelProps` in `types.ts`.
- `window/` — `Window.tsx` (the porthole: frame, ring, and glass).
- `environment/` — `Ground.tsx` (room shell: floor, walls, ceiling, trim, porthole cutout; forwards a ref for `Html` occlusion) and `Nebula.tsx` (shader-driven deep-space background).
- `laptop/` — `LaptopScreen.tsx`, the interactive laptop display via drei `Html`; exposes `LaptopScreenHandle`.
- `audio/` — `SpeakerAudio.tsx`, positional audio on the desk speaker, fed by `useAudio`.

### `src/three/`

A `CSS3DRenderer` bridge that runs in lockstep with r3f's `WebGLRenderer` so real DOM can live at a 3D transform inside the scene: `CSS3DBridgeProvider.tsx`, `CSS3DRenderLoop.tsx`, and the shared `css3dContext.ts`. Currently unused by the live tree (the laptop screen uses drei `Html`); kept for the DOM-in-3D path.

### `src/hooks/`

- `useAudio.tsx` — context provider exposing shared audio state to any component (the speaker, mute controls, etc.).
- `useCameraAnimation.ts` — tweens the camera position and `OrbitControls` target over a duration with easing; the core of area-to-area movement.
- `useIsMobile.ts` — tracks a max-width media query for the responsive UI.

### `src/types/3d.ts`

Shared types — notably `Area` (a navigable viewpoint) and `Position3D`.

## Assets (`public/`)

- `models/` — full-quality GLB models for desktop (FH character, desk, chair, laptop, speaker, reading lamp, gallery lamp, carpet, skateboard, flower pot, pet, wall shelf, …). This is the **high** tier and the source the other two tiers are generated from.
- `models-medium/` — **medium** tier: props downsized to 768px textures (geometry untouched), with `fh` and `laptop` copied at full quality. Generated by `npm run optimize-models:medium` from `models/`; do not edit by hand, and re-run it after adding or changing a desktop model.
- `models-mobile/` — **low** tier: 512px textures + simplified geometry, ~⅛ the size, ~38MB VRAM vs ~880MB; `fh` and `laptop` kept near-desktop (1024px). Generated by `npm run optimize-models` from `models/`; do not edit by hand, and re-run it after adding or changing a desktop model.
- Tier selection: `getDeviceTier()` (`src/lib/deviceTier.ts`) returns `"low" | "medium" | "high"` from `navigator.deviceMemory` + `hardwareConcurrency` + pointer/screen heuristics, cached once. `resolveModelUrl` (used by `Model.tsx`) rewrites `/models/` → the tier's folder, and `byTier({ low, medium, high })` drives scene-quality knobs in `SCENE_CONFIG.PERFORMANCE` (dpr, antialias, shadow-map size) plus nebula detail and laptop occlusion.
- `Images/Gallery/` — gallery photos.
- `textures/` — wall/floor textures.
- `musics/` — ambient track played through the speaker.
- `files/` — the résumé PDF.
- `inner/` — the stitched production build of `fh-portfolio-inner` (the laptop OS, carrying its own js-dos + DOOM), copied here by `scripts/stitch-inner.mjs` during `npm run build`. Generated — do not edit by hand.

Reference assets by absolute path from the web root (e.g. `/models/Carpet/Carpet.glb`), matching the existing `SCENE_CONFIG` entries.

## Conventions

- **No comments** (see the golden rule above).
- All scene constants live in `SCENE_CONFIG`; components read from it rather than hardcoding.
- Load every model through `Model.tsx`, not raw `useGLTF`, so shadows/layers/animations stay consistent.
- Type three/fiber event handlers with `ThreeEvent<PointerEvent>` / `ThreeEvent<MouseEvent>` — never `any`.
- Keep `RectAreaLightUniformsLib.init()` called once before any `RectAreaLight` renders.
- `RectAreaLight` cannot cast shadows and only lights `MeshStandard`/`MeshPhysical` materials — keep shadow-casting on spot/directional lights.
- Watch the per-frame cost: the render loop runs on demand during camera moves, so extra shadow-casting meshes or large shadow maps show up as stutter while navigating.
- Do not leave orphaned components in `src/` — if a file is not imported or exported anywhere, it still gets type-checked by `tsc -b` and can break the build.
