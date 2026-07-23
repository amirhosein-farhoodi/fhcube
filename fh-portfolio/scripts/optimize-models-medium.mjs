import { execFileSync } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  readdirSync,
  rmSync,
  statSync,
} from "node:fs";
import { basename, dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const PUBLIC_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
);
const SOURCE_DIR = join(PUBLIC_DIR, "models");
const MEDIUM_DIR = join(PUBLIC_DIR, "models-medium");

const KEEP_FULL_QUALITY = new Set(["fh", "laptop"]);

const PROP_TEXTURE_SIZE = "768";

function optionsForProps() {
  return [
    "--compress",
    "meshopt",
    "--texture-compress",
    "webp",
    "--texture-size",
    PROP_TEXTURE_SIZE,
    "--simplify",
    "false",
    "--flatten",
    "false",
    "--join",
    "false",
    "--instance",
    "false",
    "--palette",
    "false",
  ];
}

const MIN_VALID_BYTES = 10240;
const MB = 1024 * 1024;

function findGlbs(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...findGlbs(full));
    else if (entry.name.toLowerCase().endsWith(".glb")) out.push(full);
  }
  return out;
}

function gltfTransform(args) {
  execFileSync("gltf-transform", args, { stdio: "ignore", shell: true });
}

rmSync(MEDIUM_DIR, { recursive: true, force: true });

const glbs = findGlbs(SOURCE_DIR);
let before = 0;
let after = 0;

for (const input of glbs) {
  const rel = relative(SOURCE_DIR, input);
  const modelName = rel.split(sep)[0];
  const output = join(MEDIUM_DIR, rel);
  mkdirSync(dirname(output), { recursive: true });

  const sizeBefore = statSync(input).size;
  before += sizeBefore;

  if (KEEP_FULL_QUALITY.has(modelName)) {
    copyFileSync(input, output);
    after += sizeBefore;
    console.log(
      `${(sizeBefore / MB).toFixed(2)} MB  (kept full quality)        ${rel}`,
    );
    continue;
  }

  try {
    gltfTransform(["optimize", input, output, ...optionsForProps()]);
  } catch {
    copyFileSync(input, output);
    after += sizeBefore;
    console.log(`FAILED (copied original): ${rel}`);
    continue;
  }

  const sizeAfter = statSync(output).size;
  if (sizeAfter < MIN_VALID_BYTES) {
    copyFileSync(input, output);
    after += sizeBefore;
    console.log(`SKIPPED suspicious output (copied original): ${basename(input)}`);
    continue;
  }

  after += sizeAfter;
  const pct = Math.round(100 - (100 * sizeAfter) / sizeBefore);
  console.log(
    `${(sizeBefore / MB).toFixed(2)} MB -> ${(sizeAfter / MB).toFixed(2)} MB (${pct}% off)  ${rel}`,
  );
}

console.log(
  `\nMEDIUM SET -> models-medium/: ${(before / MB).toFixed(1)} MB -> ${(after / MB).toFixed(1)} MB (${Math.round(100 - (100 * after) / before)}% smaller)`,
);
