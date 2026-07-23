# fh-portfolio (monorepo)

Two apps run together from this root:

| Package                | Path                  | Role                                              | Dev port |
| ---------------------- | --------------------- | ------------------------------------------------- | -------- |
| `fh-port`              | `fh-portfolio/`       | The 3D portfolio shell (the room, camera, laptop) | 3000     |
| `fh-portfolio-inner`   | `fh-portfolio-inner/` | The laptop-OS app, embedded by the shell          | 5174     |

The shell embeds the inner app in the on-screen laptop via an `<iframe>`:

- **Dev** — the shell loads the inner from `http://localhost:5174`.
- **Production** — the inner is built into `fh-portfolio/public/inner/` and served at `/inner/` on the same origin as the shell.

## Commands

Run all of these from this directory.

```bash
npm install        # install root tooling (concurrently)
npm run install:all  # install root + both apps (use after a fresh clone)

npm run dev        # start BOTH dev servers (shell :3000 + inner :5174)
npm run build      # build inner → stitch into shell/public/inner → build shell
npm start          # serve the production build (shell + /inner/ on one origin)
npm run lint       # lint both apps
```

`npm run dev` is the everyday command: the shell on http://localhost:3000 loads
the inner from :5174 with hot-reload on both.

### How `npm run build` works

1. `build:inner` — builds `fh-portfolio-inner` with `--base=/inner/` so its
   assets resolve under `/inner/`.
2. `build:stitch` — copies the inner build into `fh-portfolio/public/inner/`
   (see [scripts/stitch-inner.mjs](scripts/stitch-inner.mjs)).
3. `build:shell` — builds `fh-portfolio`, which copies `public/inner/` into its
   own `dist/`. The result, `fh-portfolio/dist/`, is the single deployable
   folder: the shell at `/` and the inner at `/inner/`.

`npm start` previews that `fh-portfolio/dist/`.

## Known limitation

The inner app references a few assets by root-absolute path that live only in
its own `public/` (`/chrome.png` and `/Images/Expirences/*`, used by the laptop
"Experiences" app). In the integrated production build those resolve against the
shell's root, where they are not present, so those icons fall back to the SPA
index and render broken. This only affects `npm start` / production — `npm run
dev` is unaffected. To fix, either add those files to `fh-portfolio/public/` or
make the inner reference them via `import.meta.env.BASE_URL`.
