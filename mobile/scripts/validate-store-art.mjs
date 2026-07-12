import { existsSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const mobileRoot = resolve(here, "..");
const storesSource = readFileSync(resolve(mobileRoot, "../packages/core/src/data/stores.ts"), "utf8");
const ids = [...storesSource.matchAll(/^\s+id:\s+"([^"]+)",/gm)].map((match) => match[1]);
const uniqueIds = [...new Set(ids)];
const variants = ["dense", "sparse", "glow"];
const assetRoot = join(mobileRoot, "assets", "store-art");

const missing = uniqueIds.flatMap((id) =>
  variants
    .map((variant) => join(assetRoot, `${id}-${variant}.webp`))
    .filter((path) => !existsSync(path))
);

if (ids.length !== uniqueIds.length) {
  console.error(`Duplicate store ids found: ${ids.length - uniqueIds.length}`);
  process.exitCode = 1;
}

if (missing.length > 0) {
  console.error(`Missing ${missing.length} store-art layers for ${uniqueIds.length} stores:`);
  for (const path of missing) console.error(`- ${path}`);
  process.exitCode = 1;
} else {
  console.log(`Store art complete: ${uniqueIds.length} stores, ${uniqueIds.length * variants.length} layers.`);
}
