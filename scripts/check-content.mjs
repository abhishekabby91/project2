#!/usr/bin/env node
/**
 * Pre-launch content check.
 *
 *   npm run check:content
 *
 * Five failure classes, in rough order of how much damage they do:
 *
 *   1. PLACEHOLDERS — the markers this scaffold ships with, reserved example
 *      domains and unset phone numbers, reaching production.
 *   2. LEFTOVERS — vocabulary from the template this was forked from, or a
 *      place the business does not serve, still present because a file was
 *      never opened.
 *   3. DOORWAY PAGES — service x city pages generated from cities that have no
 *      genuinely local content, or whose "local" notes are shared with another
 *      city. Thirty pages that differ only by a place name is the pattern
 *      Google has demoted since 2015, and it is the specific way this vertical
 *      goes wrong.
 *   4. CATALOG INTEGRITY — a package pointing at a service, theme, occasion or
 *      city that does not exist, so a page links somewhere that 404s.
 *   5. UNVERIFIED CLAIMS — prices, service areas, policies and photographs that
 *      no named person has signed off. A fabricated price and a real one are
 *      identical in source, so this is the one thing a script cannot judge;
 *      content/verification.ts records the human attestation instead.
 *
 * Exit code 1 on any error, so it can gate a deploy. Warnings do not fail.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { proseStrings, fingerprint } from "./build-baseline.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(root, "content");
const baselinePath = join(root, "scripts", "template-baseline.json");

const errors = [];
const warnings = [];
const err = (file, msg, detail) => errors.push({ file, msg, detail });
const warn = (file, msg, detail) => warnings.push({ file, msg, detail });

const files = readdirSync(contentDir).filter((f) => f.endsWith(".ts"));
const sources = Object.fromEntries(
  files.map((f) => [f, readFileSync(join(contentDir, f), "utf8")]),
);

/** Line number of a string offset, 1-indexed. */
const lineAt = (source, index) => source.slice(0, index).split("\n").length;

/**
 * Comment lines, so a rule about published copy doesn't fire on the note
 * telling you to fix the copy. Block comments and `//` lines both count.
 */
function commentLines(source) {
  const lines = source.split("\n");
  const isComment = new Set();
  let inBlock = false;
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    if (inBlock) {
      isComment.add(i + 1);
      if (trimmed.includes("*/")) inBlock = false;
      return;
    }
    if (trimmed.startsWith("//")) { isComment.add(i + 1); return; }
    if (trimmed.startsWith("/*")) {
      isComment.add(i + 1);
      if (!trimmed.includes("*/")) inBlock = true;
    }
  });
  return isComment;
}

const comments = Object.fromEntries(
  Object.entries(sources).map(([f, s]) => [f, commentLines(s)]),
);

/** Every match of `pattern` in published copy, skipping comment lines. */
function* inCopy(file, source, pattern) {
  const rx = new RegExp(pattern.source, pattern.flags.includes("g") ? pattern.flags : pattern.flags + "g");
  for (const m of source.matchAll(rx)) {
    const line = lineAt(source, m.index);
    if (comments[file].has(line)) continue;
    yield { text: m[0], line };
  }
}

/* ── 1. Placeholders ─────────────────────────────────────────────────────── */

const placeholders = [
  // Case-sensitive: the marker is shouted, the word "placeholder" in a comment
  // explaining the marker is not a defect.
  { pattern: /PLACEHOLDER/, label: "PLACEHOLDER marker" },
  { pattern: /\bexample\.com\b/i, label: "example.com address" },
  { pattern: /\byourdomain\b/i, label: "yourdomain address" },
  // An Indian mobile is 10 digits starting 6-9. All-zeros is the unset value
  // this scaffold ships; 12345 patterns are the other common fake.
  { pattern: /\+?91[\s-]?0{5}[\s-]?0{5}/, label: "unset +91 phone number" },
  { pattern: /\b910{10}\b/, label: "unset WhatsApp number" },
  { pattern: /\b(?:\+?91[\s-]?)?1234567890\b/, label: "sequential fake phone number" },
];

for (const [file, source] of Object.entries(sources)) {
  for (const { pattern, label } of placeholders) {
    for (const hit of inCopy(file, source, pattern)) {
      err(file, `${label} still present`, `line ${hit.line}: "${hit.text}"`);
    }
  }
}

/* ── 2. Leftovers from the template this was forked from ─────────────────── */

/**
 * This scaffold was forked from a US CPA template. Its vocabulary is the most
 * likely thing to survive into a decoration site unnoticed, and it reads as
 * obviously wrong to a visitor in Noida.
 */
const FOREIGN_VOCABULARY = [
  "CPA", "IRS", "tax planning", "bookkeeping", "payroll", "audit engagement",
  "Central Texas", "Austin", "Round Rock", "Williamson County", "Sacramento",
  "AICPA", "Enrolled Agent", "1099", "W-2", "fiscal year",
];

for (const [file, source] of Object.entries(sources)) {
  for (const term of FOREIGN_VOCABULARY) {
    const rx = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    for (const hit of inCopy(file, source, rx)) {
      err(file, `references "${hit.text}", which is left over from the CPA template`,
        `line ${hit.line} — this is a decoration business in Delhi NCR`);
    }
  }
}

/* ── 3. Doorway pages ────────────────────────────────────────────────────── */

/**
 * The service x city matrix is where this vertical produces thin pages. The
 * route and the sitemap both require a city to carry real local content before
 * a pairing generates; this asserts the same rule at content level, and adds
 * the one a route cannot check — that two cities are not sharing their notes.
 *
 * Thresholds must stay in step with `pairIsSubstantive` in
 * src/app/[service]/[city]/page.tsx and src/app/sitemap.ts.
 */
const MIN_LOCALITIES = 3;
const MIN_LOCAL_NOTES = 2;

{
  const src = sources["cities.ts"] ?? "";
  // Each city block runs from one `slug:` to the next.
  const blocks = [...src.matchAll(/slug:\s*"([a-z0-9-]+)",\s*\n\s*name:\s*"([^"]+)"/g)];

  const noteFingerprints = new Map(); // fingerprint -> first city that used it

  for (let i = 0; i < blocks.length; i++) {
    const [slug, name] = [blocks[i][1], blocks[i][2]];
    const start = blocks[i].index;
    const end = i + 1 < blocks.length ? blocks[i + 1].index : src.length;
    const block = src.slice(start, end);

    const localities = (block.match(/\{\s*slug:\s*"[a-z0-9-]+",\s*name:/g) ?? []).length;
    const notesBlock = block.match(/localNotes:\s*\[([\s\S]*?)\n\s{4}\]/)?.[1] ?? "";
    const notes = [...notesBlock.matchAll(/"((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]);

    if (localities < MIN_LOCALITIES) {
      err("cities.ts",
        `"${name}" has ${localities} localit${localities === 1 ? "y" : "ies"} (needs ${MIN_LOCALITIES})`,
        `line ${lineAt(src, start)} — every ${slug} service page is suppressed until it has real coverage`);
    }
    if (notes.length < MIN_LOCAL_NOTES) {
      err("cities.ts",
        `"${name}" has ${notes.length} local note(s) (needs ${MIN_LOCAL_NOTES})`,
        `line ${lineAt(src, start)} — without these, its service pages are another city's with the name swapped`);
    }

    for (const note of notes) {
      // Compare the note with every place name stripped out. Two cities whose
      // notes differ only by "Noida" vs "Gurugram" are the same page twice.
      const generic = note
        .replace(new RegExp(blocks.map((b) => b[2]).join("|"), "gi"), "«city»")
        .replace(/\s+/g, " ")
        .toLowerCase()
        .trim();
      const hash = fingerprint(generic);
      const seen = noteFingerprints.get(hash);
      if (seen && seen !== name) {
        err("cities.ts",
          `"${name}" and "${seen}" share a local note with only the place name changed`,
          `"${note.slice(0, 70)}…" — this is what makes a doorway page; write what is actually different`);
      } else if (!seen) {
        noteFingerprints.set(hash, name);
      }
    }
  }
}

/* ── 4. Catalog integrity ────────────────────────────────────────────────── */

/**
 * A package that lists a service, theme, occasion or city that does not exist
 * renders a link to a page that 404s. Cheap to check, invisible until a
 * customer hits it.
 */
{
  const slugsIn = (file, exportName) => {
    const src = sources[file] ?? "";
    const body = src.slice(src.indexOf(`export const ${exportName}`));
    return new Set([...body.matchAll(/^\s{4}slug:\s*"([a-z0-9-]+)"/gm)].map((m) => m[1]));
  };

  const known = {
    services: slugsIn("services.ts", "services"),
    occasions: slugsIn("occasions.ts", "occasions"),
    themes: slugsIn("themes.ts", "themes"),
    cities: slugsIn("cities.ts", "cities"),
  };

  const pkgSrc = sources["packages.ts"] ?? "";
  const pkgBlocks = [...pkgSrc.matchAll(/^\s{4}slug:\s*"([a-z0-9-]+)"/gm)];

  for (let i = 0; i < pkgBlocks.length; i++) {
    const pkg = pkgBlocks[i][1];
    const start = pkgBlocks[i].index;
    const end = i + 1 < pkgBlocks.length ? pkgBlocks[i + 1].index : pkgSrc.length;
    const block = pkgSrc.slice(start, end);

    /* "cities" -> "city", not "citie". The message is the whole value of this
       check — someone reading it is mid-way through pasting a catalog in. */
    const singular = (field) => (field.endsWith("ies") ? `${field.slice(0, -3)}y` : field.slice(0, -1));

    for (const [field, valid] of Object.entries(known)) {
      const list = block.match(new RegExp(`${field}:\\s*\\[([^\\]]*)\\]`))?.[1];
      if (list == null) continue;
      for (const m of list.matchAll(/"([a-z0-9-]+)"/g)) {
        if (!valid.has(m[1])) {
          err("packages.ts", `package "${pkg}" lists ${singular(field)} "${m[1]}", which does not exist`,
            `line ${lineAt(pkgSrc, start)} — the page will link to a 404`);
        }
      }
    }
  }

  // And the reverse: a service pointing at a package that was deleted.
  const pkgSlugs = new Set(pkgBlocks.map((b) => b[1]));
  for (const file of ["services.ts", "occasions.ts", "themes.ts"]) {
    const src = sources[file] ?? "";
    for (const m of src.matchAll(/packages:\s*\[([^\]]*)\]/g)) {
      for (const p of m[1].matchAll(/"([a-z0-9-]+)"/g)) {
        if (!pkgSlugs.has(p[1])) {
          err(file, `references package "${p[1]}", which does not exist`,
            `line ${lineAt(src, m.index)} — delete the reference or restore the package`);
        }
      }
    }
  }
}

/* ── 5. Duplicate copy ───────────────────────────────────────────────────── */

if (!existsSync(baselinePath)) {
  warn("scripts", "template-baseline.json missing — duplicate-copy check skipped",
    "run `node scripts/build-baseline.mjs` in the template repo, not in a client fork");
} else {
  const baseline = JSON.parse(readFileSync(baselinePath, "utf8"));
  const budgets = {
    "services.ts": 0.15, "occasions.ts": 0.15, "themes.ts": 0.15,
    "packages.ts": 0.1, "copy.ts": 0.5, "faqs.ts": 0.4, "cities.ts": 0.05,
  };

  for (const [file, limit] of Object.entries(budgets)) {
    const known = new Set(baseline.files?.[file] ?? []);
    if (known.size === 0) continue;
    const current = [...new Set(proseStrings(sources[file] ?? "").map(fingerprint))];
    if (current.length === 0) continue;
    const unchanged = current.filter((h) => known.has(h));
    const ratio = unchanged.length / current.length;
    if (ratio > limit) {
      const pct = Math.round(ratio * 100);
      const report = limit === 0 ? err : ratio > limit + 0.25 ? err : warn;
      report(file,
        `${pct}% of prose is still the template default (limit ${Math.round(limit * 100)}%)`,
        `${unchanged.length} of ${current.length} strings unchanged — every site shipped with these is a near-duplicate`);
    }
  }
}

/* ── 6. Sign-off on public claims ────────────────────────────────────────── */

/**
 * The checks above compare text. They cannot tell an invented price from a real
 * one, or a service area the team covers from one it does not. So require a
 * named human attestation per claim before the site can ship.
 *
 * The key list is read from verification.ts rather than hardcoded, so adding a
 * new class of claim there automatically starts gating on it.
 */
{
  const src = sources["verification.ts"];
  if (!src) {
    warn("verification.ts", "missing — public claims are unverified",
      "restore it; the site should not ship without sign-off");
  } else {
    const body = src.slice(src.indexOf("export const verification"));
    const attestations = [...body.matchAll(/^\s{2}(\w+):\s*\{([^}]*)\}/gm)];

    // Descriptions live in the doc comment above each key.
    const describe = (key) => {
      const at = body.indexOf(`\n  ${key}:`);
      const before = body.slice(0, at);
      return before.match(/\/\*\*\s*([^*]+?)\s*\*\/\s*$/)?.[1]?.replace(/\s+/g, " ") ?? key;
    };

    // Reviews need no sign-off when there are none to publish.
    const noReviews = /export const reviews[^=]*=\s*\[\s*\]/.test(sources["reviews.ts"] ?? "");

    if (attestations.length === 0) {
      err("verification.ts", "no attestations found", "the sign-off gate is not running — check the file's shape");
    }

    for (const [, key, fields] of attestations) {
      if (key === "reviews" && noReviews) continue;

      const verified = /verified:\s*true/.test(fields);
      const by = fields.match(/by:\s*"([^"]*)"/)?.[1]?.trim() ?? "";
      const date = fields.match(/date:\s*"([^"]*)"/)?.[1]?.trim() ?? "";

      if (!verified) {
        err("verification.ts", `"${key}" is not signed off`, describe(key));
      } else if (!by || !date) {
        err("verification.ts", `"${key}" is marked verified but has no name or date`,
          "record who confirmed it and when — an unattributed sign-off is not one");
      } else if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        err("verification.ts", `"${key}" has an unparseable date "${date}"`, "use YYYY-MM-DD");
      } else if (new Date(date) > new Date()) {
        err("verification.ts", `"${key}" is signed off with a future date "${date}"`, describe(key));
      }
    }
  }
}

/* ── 7. The enquiry form needs somewhere to deliver to ───────────────────── */

/**
 * A warning rather than an error, because this script cannot see the truth: the
 * variable lives in the hosting platform, not in the shell someone runs
 * `npm run check:content` in, so failing on it would cry wolf at every
 * developer on a correctly configured site — and a check people learn to ignore
 * is worse than no check.
 *
 * The endpoint itself refuses an enquiry it cannot deliver, so an unset webhook
 * costs a visitor a form submission and not a booking. This line exists so the
 * conversation happens before that, not after.
 */
if (!process.env.CONTACT_FORM_WEBHOOK_URL) {
  warn("src/app/api/contact", "no CONTACT_FORM_WEBHOOK_URL in this environment",
    "set it on the host (and CONTACT_FORM_ACCESS_KEY for a form service) — until then " +
      "the form tells visitors to WhatsApp or call instead, which is honest but is not a form");
}

/* ── 7. Agency documents must not ship to a client ───────────────────────── */

if (existsSync(join(root, "docs", "agency"))) {
  warn("docs/agency", "agency-internal documents are still present",
    "delete docs/agency/ before handing this repository over — it holds your pricing");
}

/* ── Report ──────────────────────────────────────────────────────────────── */

const fmt = (list, mark) =>
  list.map((e) => `  ${mark} ${e.file}: ${e.msg}\n      ${e.detail}`).join("\n");

if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):\n${fmt(warnings, "!")}`);
}
if (errors.length) {
  console.error(`\n${errors.length} error(s):\n${fmt(errors, "✗")}`);
  console.error("\nContent check failed. Fix the above before deploying this site.\n");
  process.exit(1);
}
console.log(`\n✓ Content check passed${warnings.length ? ` (${warnings.length} warning(s))` : ""}.\n`);
