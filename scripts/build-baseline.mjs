#!/usr/bin/env node
/**
 * Regenerates `scripts/template-baseline.json` — a fingerprint of the prose
 * this template ships with.
 *
 * Run this in the TEMPLATE repo only, whenever you change the default content,
 * then commit the result. Client forks consume the baseline; they never
 * regenerate it (doing so would fingerprint their own copy and make the
 * leftover check pass vacuously).
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "content");

/** Prose worth fingerprinting: string literals of more than a few words. */
export function proseStrings(source) {
  const out = [];
  // Double-quoted TS string literals, honoring escapes.
  const re = /"((?:[^"\\]|\\.)*)"/g;
  let m;
  while ((m = re.exec(source))) {
    const value = m[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\").trim();
    if (value.split(/\s+/).length >= 5 && /[a-z]/.test(value)) out.push(value);
  }
  return out;
}

export const fingerprint = (s) =>
  createHash("sha256").update(s.replace(/\s+/g, " ").trim().toLowerCase()).digest("hex").slice(0, 16);

/**
 * Only writes when run directly. check-content.mjs imports the two helpers
 * above, and must NOT trigger a regenerate — a fork that rewrote its baseline
 * from its own content would pass the duplicate check vacuously.
 */
function writeBaseline() {
  const baseline = {};
  let total = 0;
  for (const file of readdirSync(contentDir).filter((f) => f.endsWith(".ts"))) {
    const strings = proseStrings(readFileSync(join(contentDir, file), "utf8"));
    baseline[file] = [...new Set(strings.map(fingerprint))];
    total += baseline[file].length;
  }

  writeFileSync(
    join(root, "scripts", "template-baseline.json"),
    JSON.stringify({ generated: new Date().toISOString().slice(0, 10), files: baseline }, null, 2) + "\n",
  );
  console.log(`Baseline written: ${total} prose strings across ${Object.keys(baseline).length} files.`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  writeBaseline();
}
