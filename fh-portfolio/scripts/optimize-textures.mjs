import { statSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

sharp.cache(false);

const TEXTURES_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "textures",
);

const TARGETS = [
  { file: "ground/mdf/black-painted-planks-diff.jpg", maxSize: 1024, quality: 80 },
  { file: "wall-outside/dirt-window-stains-col.jpg", maxSize: 1024, quality: 82 },
  { file: "wall-outside/dirt-window-stains-nrm.jpg", maxSize: 1024, quality: 90 },
  { file: "wall/wall-texture.png", maxSize: null, quality: 85 },
  { file: "wall/wall-normal.png", maxSize: null, quality: 90 },
];

const KB = 1024;
const MB = KB * KB;

let before = 0;
let after = 0;
const originals = [];

for (const { file, maxSize, quality } of TARGETS) {
  const input = join(TEXTURES_DIR, file);
  const output = input.replace(/\.(png|jpe?g)$/i, ".webp");
  const sizeBefore = statSync(input).size;

  const pipeline = sharp(input);
  if (maxSize) {
    pipeline.resize(maxSize, maxSize, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }
  await pipeline.webp({ quality, effort: 6 }).toFile(output);

  const sizeAfter = statSync(output).size;
  if (output !== input) originals.push(input);

  before += sizeBefore;
  after += sizeAfter;
  const pct = Math.round(100 - (100 * sizeAfter) / sizeBefore);
  console.log(
    `${(sizeBefore / KB).toFixed(0).padStart(5)} KB -> ${(sizeAfter / KB).toFixed(0).padStart(4)} KB (${pct}% off)  ${file}`,
  );
}

for (const input of originals) rmSync(input, { force: true });

console.log(
  `\nTOTAL: ${(before / MB).toFixed(2)} MB -> ${(after / MB).toFixed(2)} MB (${Math.round(100 - (100 * after) / before)}% smaller)`,
);
