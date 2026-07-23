import { execFileSync } from "node:child_process";
import { readdirSync, renameSync, rmSync, statSync } from "node:fs";
import { basename, dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const MODELS_DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "models",
);

const KEEP_FULL_QUALITY = new Set(["fh", "laptop"]);
const TEXTURE_ONLY = new Set(["carpet", "pet"]);

const SIMPLIFY_QUALITY = {
  textureSize: "1024",
  simplify: true,
  simplifyRatio: "0.55",
  simplifyError: "0.001",
};

const TEXTURE_ONLY_QUALITY = {
  textureSize: "1024",
  simplify: false,
};

function optionsFor(quality) {
  const opts = [
    "--compress",
    "meshopt",
    "--texture-compress",
    "webp",
    "--texture-size",
    quality.textureSize,
  ];
  if (quality.simplify) {
    opts.push(
      "--simplify",
      "true",
      "--simplify-ratio",
      quality.simplifyRatio,
      "--simplify-error",
      quality.simplifyError,
      "--simplify-lock-border",
      "true",
    );
  } else {
    opts.push("--simplify", "false");
  }
  opts.push(
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

console.log(
  "Optimizing public/models/ IN PLACE (originals are assumed backed up).\n",
);

const glbs = findGlbs(MODELS_DIR);
let before = 0;
let after = 0;

for (const input of glbs) {
  const rel = relative(MODELS_DIR, input);
  const modelName = rel.split(sep)[0];
  const sizeBefore = statSync(input).size;
  before += sizeBefore;

  if (KEEP_FULL_QUALITY.has(modelName)) {
    after += sizeBefore;
    console.log(
      `${(sizeBefore / MB).toFixed(2)} MB  (kept full quality)        ${rel}`,
    );
    continue;
  }

  const quality = TEXTURE_ONLY.has(modelName)
    ? TEXTURE_ONLY_QUALITY
    : SIMPLIFY_QUALITY;
  const tmp = input.replace(/\.glb$/i, ".opt.glb");

  try {
    gltfTransform(["optimize", input, tmp, ...optionsFor(quality)]);
  } catch {
    rmSync(tmp, { force: true });
    after += sizeBefore;
    console.log(`FAILED (kept original): ${rel}`);
    continue;
  }

  const sizeAfter = statSync(tmp).size;
  if (sizeAfter < MIN_VALID_BYTES || sizeAfter >= sizeBefore) {
    rmSync(tmp, { force: true });
    after += sizeBefore;
    console.log(
      `${(sizeBefore / MB).toFixed(2)} MB  (no gain, kept original)   ${rel}`,
    );
    continue;
  }

  rmSync(input, { force: true });
  renameSync(tmp, input);
  after += sizeAfter;

  const pct = Math.round(100 - (100 * sizeAfter) / sizeBefore);
  const tier = TEXTURE_ONLY.has(modelName) ? "[texture]" : "[simplify]";
  console.log(
    `${(sizeBefore / MB).toFixed(2)} MB -> ${(sizeAfter / MB).toFixed(2)} MB (${pct}% off) ${tier}  ${rel}`,
  );
}

console.log(
  `\nDESKTOP SET -> models/: ${(before / MB).toFixed(1)} MB -> ${(after / MB).toFixed(1)} MB (${Math.round(100 - (100 * after) / before)}% smaller)`,
);
