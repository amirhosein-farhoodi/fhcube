import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { basename, dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const PUBLIC_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
);
const SOURCE_DIR = join(PUBLIC_DIR, "models");
const MOBILE_DIR = join(PUBLIC_DIR, "models-mobile");

const LOW_QUALITY = {
  textureSize: "512",
  simplifyRatio: null,
  simplifyError: "0.001",
};

const NEAR_DESKTOP_QUALITY = {
  textureSize: "1024",
  simplifyRatio: "0.5",
  simplifyError: "0.001",
};

const QUALITY_BY_MODEL = {
  fh: NEAR_DESKTOP_QUALITY,
  laptop: NEAR_DESKTOP_QUALITY,
};

function optionsFor(quality) {
  const opts = [
    "--compress",
    "meshopt",
    "--texture-compress",
    "webp",
    "--texture-size",
    quality.textureSize,
    "--simplify",
    "true",
  ];
  if (quality.simplifyRatio) {
    opts.push("--simplify-ratio", quality.simplifyRatio);
  }
  opts.push(
    "--simplify-error",
    quality.simplifyError,
    "--simplify-lock-border",
    "true",
    "--flatten",
    "false",
    "--join",
    "false",
    "--instance",
    "false",
    "--palette",
    "false",
  );
  return opts;
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

rmSync(MOBILE_DIR, { recursive: true, force: true });

const glbs = findGlbs(SOURCE_DIR);
let before = 0;
let after = 0;

for (const input of glbs) {
  const rel = relative(SOURCE_DIR, input);
  const modelName = rel.split(sep)[0];
  const quality = QUALITY_BY_MODEL[modelName] ?? LOW_QUALITY;
  const output = join(MOBILE_DIR, rel);
  mkdirSync(dirname(output), { recursive: true });

  const sizeBefore = statSync(input).size;
  try {
    gltfTransform(["optimize", input, output, ...optionsFor(quality)]);
  } catch {
    console.log(`FAILED (skipped): ${rel}`);
    continue;
  }

  const sizeAfter = statSync(output).size;
  if (sizeAfter < MIN_VALID_BYTES) {
    rmSync(output, { force: true });
    console.log(`SKIPPED suspicious output: ${basename(input)}`);
    continue;
  }

  before += sizeBefore;
  after += sizeAfter;
  const pct = Math.round(100 - (100 * sizeAfter) / sizeBefore);
  const tag = quality === NEAR_DESKTOP_QUALITY ? "  [higher quality]" : "";
  console.log(
    `${(sizeBefore / MB).toFixed(2)} MB -> ${(sizeAfter / MB).toFixed(2)} MB (${pct}% off)  ${rel}${tag}`,
  );
}

console.log(
  `\nMOBILE SET -> models-mobile/: ${(before / MB).toFixed(1)} MB -> ${(after / MB).toFixed(1)} MB (${Math.round(100 - (100 * after) / before)}% smaller)`,
);
