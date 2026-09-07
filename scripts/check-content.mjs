#!/usr/bin/env node
/**
 * Pre-launch content check for a client fork.
 *
 *   npm run check:content
 *
 * Catches the three ways a template-built site embarrasses you:
 *
 *   1. LEFTOVERS — content from another region or firm still present, because
 *      a file was never opened. This is how a Sacramento firm ships a
 *      "Serving Central Texas" stat and an Austin office page.
 *   2. PLACEHOLDERS — the markers this template ships with, plus reserved
 *      example domains and 555 phone numbers, reaching production.
 *   3. DUPLICATE COPY — default prose still byte-identical to the template,
 *      which makes every site you sell a near-duplicate of every other one.
 *   4. UNVERIFIED CLAIMS — statistics, credentials and testimonials that no
 *      named person has signed off. A fabricated figure and a real one look
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

/** Line number of the first occurrence of `needle`, 1-indexed. */
const lineOf = (source, needle) => {
  const idx = source.indexOf(needle);
  return idx === -1 ? null : source.slice(0, idx).split("\n").length;
};

/* ── 1. Placeholders ─────────────────────────────────────────────────────── */

const placeholders = [
  { pattern: /PLACEHOLDER/i, label: "PLACEHOLDER marker" },
  { pattern: /\bexample\.com\b/i, label: "example.com address" },
  { pattern: /linkedin\.com\/in\/example/i, label: "example LinkedIn URL" },
  { pattern: /linkedin\.com\/company\/example/i, label: "example LinkedIn URL" },
  { pattern: /facebook\.com\/example/i, label: "example Facebook URL" },
  { pattern: /\bExample (State )?University\b/, label: "Example University" },
  { pattern: /\bExample [A-Z][a-z]+ (Group|Partners|Construction)\b/, label: "Example company name" },
  // NANP reserved range: 555-0100 through 555-0199 are fictional by convention.
  { pattern: /555-01\d\d/, label: "reserved 555-01xx phone number" },
];

for (const [file, source] of Object.entries(sources)) {
  for (const { pattern, label } of placeholders) {
    const m = source.match(pattern);
    if (m) err(file, `${label} still present`, `line ${lineOf(source, m[0])}: "${m[0]}"`);
  }
}

/* ── 2. Geographic and temporal leftovers ────────────────────────────────── */

const siteSrc = sources["site.ts"] ?? "";
const locationsSrc = sources["locations.ts"] ?? "";

const firmState = siteSrc.match(/state:\s*"([A-Z]{2})"/)?.[1];
const firmCity = siteSrc.match(/city:\s*"([^"]+)"/)?.[1];
const foundedYear = Number(siteSrc.match(/foundedYear:\s*(\d{4})/)?.[1]);

/** Every state code and city the firm actually claims, from site + locations. */
const claimedStates = new Set(
  [...siteSrc.matchAll(/state:\s*"([A-Z]{2})"/g), ...locationsSrc.matchAll(/state:\s*"([A-Z]{2})"/g)]
    .map((m) => m[1]),
);
const claimedCities = new Set(
  [...siteSrc.matchAll(/city:\s*"([^"]+)"/g), ...locationsSrc.matchAll(/city:\s*"([^"]+)"/g)]
    .map((m) => m[1]),
);

// Places the firm actually claims: office cities and states, plus every entry
// in an `areasServed` list. A region mentioned in prose is a leftover only if
// it has no relationship to any of them.
const claimedPlaces = new Set([
  ...claimedCities,
  ...[...claimedStates].map(stateName),
  ...[...claimedStates],
]);
for (const m of locationsSrc.matchAll(/areasServed:\s*\[([\s\S]*?)\]/g)) {
  for (const a of m[1].matchAll(/"([^"]+)"/g)) claimedPlaces.add(a[1]);
}

/**
 * Regions that commonly survive a rebrand. A hit is only an error when the
 * region neither contains nor is contained by something the firm claims —
 * so "Central Texas" passes for an Austin, TX firm (it contains "Texas"), and
 * "Williamson County" passes when it's in areasServed.
 */
const REGIONS = [
  "Central Texas", "Texas", "Austin", "Round Rock", "Georgetown", "Cedar Park",
  "Pflugerville", "Hutto", "Leander", "Williamson County", "Travis County",
  "California", "Sacramento", "Central Valley", "New York", "Florida", "Illinois",
];

const relatedToClaim = (region) =>
  [...claimedPlaces].some(
    (place) =>
      place.length > 2 &&
      (region.includes(place) || place.includes(region)),
  );

for (const [file, source] of Object.entries(sources)) {
  for (const region of REGIONS) {
    if (!new RegExp(`\\b${region}\\b`).test(source)) continue;
    if (relatedToClaim(region)) continue;
    err(
      file,
      `references "${region}", which is nowhere this firm operates`,
      `line ${lineOf(source, region)} — left over from the template, or add it to a location's areasServed`,
    );
  }

  // "since YYYY" in prose must agree with foundedYear.
  for (const m of source.matchAll(/since (\d{4})/g)) {
    if (foundedYear && Number(m[1]) !== foundedYear) {
      err(
        file,
        `says "since ${m[1]}" but site.foundedYear is ${foundedYear}`,
        `line ${lineOf(source, m[0])}`,
      );
    }
  }
}

function stateName(code) {
  const map = {
    TX: "Texas", CA: "California", NY: "New York", FL: "Florida", IL: "Illinois",
    WA: "Washington", OR: "Oregon", CO: "Colorado", AZ: "Arizona", GA: "Georgia",
    NC: "North Carolina", PA: "Pennsylvania", OH: "Ohio", MI: "Michigan", MA: "Massachusetts",
  };
  return map[code] ?? code;
}

// Location slugs should match their own city/state.
for (const m of locationsSrc.matchAll(/slug:\s*"([a-z-]+)"/g)) {
  const slug = m[1];
  const after = locationsSrc.slice(locationsSrc.indexOf(m[0]));
  const city = after.match(/city:\s*"([^"]+)"/)?.[1] ?? "";
  const state = after.match(/state:\s*"([A-Z]{2})"/)?.[1] ?? "";
  const expected = `${city.toLowerCase().replace(/[^a-z]+/g, "-")}-${state.toLowerCase()}`;
  if (slug !== expected) {
    err("locations.ts", `slug "${slug}" doesn't match its city/state (expected "${expected}")`,
      `line ${lineOf(locationsSrc, m[0])} — the URL will read wrong`);
  }
}

/* ── 3. Duplicate copy ───────────────────────────────────────────────────── */

if (!existsSync(baselinePath)) {
  warn("scripts", "template-baseline.json missing — duplicate-copy check skipped",
    "run `node scripts/build-baseline.mjs` in the template repo");
} else {
  const baseline = JSON.parse(readFileSync(baselinePath, "utf8"));
  // Files where shipping the default is a real SEO problem, and how strict to be.
  const budgets = {
    "services.ts": 0.15, "industries.ts": 0.15, "posts.ts": 0.0,
    "copy.ts": 0.5, "firm.ts": 0.3, "faqs.ts": 0.4,
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
        `${unchanged.length} of ${current.length} strings unchanged — every site you ship with these is a near-duplicate`);
    }
  }
}

/* ── 4. Sign-off on public claims ────────────────────────────────────────── */

/**
 * The checks above compare text. They cannot tell an invented statistic from a
 * true one, which is exactly what a rewrite produces when nobody asked the firm.
 * So require a named human attestation per claim before the site can ship.
 */
{
  const src = sources["verification.ts"];
  if (!src) {
    warn("verification.ts", "missing — public claims are unverified",
      "restore it from the template; the site should not ship without sign-off");
  } else {
    const attestations = [
      ...src.matchAll(/(\w+):\s*\{([^}]*)\}/g),
    ].filter(([, key]) => key !== "unverified");

    const descriptions = Object.fromEntries(
      [...src.matchAll(/^\s{2}(\w+):\s*"([^"]*)"/gm)].map((m) => [m[1], m[2]]),
    );

    // Testimonials need no sign-off when there are none to publish.
    const noTestimonials = /export const testimonials[^=]*=\s*\[\s*\]/.test(
      sources["testimonials.ts"] ?? "",
    );

    for (const [, key, body] of attestations) {
      if (!(key in { statistics: 1, credentials: 1, testimonials: 1, locations: 1,
                     services: 1, teamBios: 1, legalPages: 1, articles: 1,
                     cookieDisclosure: 1 })) continue;
      if (key === "testimonials" && noTestimonials) continue;

      const verified = /verified:\s*true/.test(body) || body.includes("...unverified") === false && /verified:\s*true/.test(body);
      const by = body.match(/by:\s*"([^"]*)"/)?.[1]?.trim() ?? "";
      const date = body.match(/date:\s*"([^"]*)"/)?.[1]?.trim() ?? "";
      const label = descriptions[key] ?? key;

      if (!verified) {
        err("verification.ts", `"${key}" is not signed off`, label);
      } else if (!by || !date) {
        err("verification.ts", `"${key}" is marked verified but has no name or date`,
          "record who confirmed it and when — an unattributed sign-off is not one");
      } else if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        err("verification.ts", `"${key}" has an unparseable date "${date}"`, "use YYYY-MM-DD");
      } else if (new Date(date) > new Date()) {
        err("verification.ts", `"${key}" is signed off with a future date "${date}"`, label);
      }
    }
  }
}

/* ── 5. Agency documents must not ship to a client ───────────────────────── */

if (existsSync(join(root, "docs", "agency"))) {
  warn("docs/agency", "agency-internal documents are still present",
    "delete docs/agency/ before handing this repository to a client — it holds your pricing");
}

/* ── Report ──────────────────────────────────────────────────────────────── */

const fmt = (list, mark) =>
  list.map((e) => `  ${mark} ${e.file}: ${e.msg}\n      ${e.detail}`).join("\n");

if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):\n${fmt(warnings, "!")}`);
}
if (errors.length) {
  console.error(`\n${errors.length} error(s):\n${fmt(errors, "✗")}`);
  console.error("\nContent check failed. Fix the above before deploying this client site.\n");
  process.exit(1);
}
console.log(`\n✓ Content check passed${warnings.length ? ` (${warnings.length} warning(s))` : ""}.\n`);
