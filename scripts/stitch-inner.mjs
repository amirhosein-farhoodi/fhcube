import { cpSync, existsSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const innerBuild = join(repoRoot, "fh-portfolio-inner", "dist");
const target = join(repoRoot, "fh-portfolio", "public", "inner");

if (!existsSync(innerBuild)) {
  console.error(
    `Inner build not found at ${innerBuild}. Run "npm run build:inner" first.`
  );
  process.exit(1);
}

rmSync(target, { recursive: true, force: true });
cpSync(innerBuild, target, { recursive: true });

console.log(`Stitched inner build into ${target}`);
