import { chromium } from "playwright";
import { browserLaunchOptions } from "./browser.mjs";

/**
 * Responsive layout, on the devices this market actually books from.
 *
 * Two failures, both of which look like nothing in a desktop browser and like a
 * broken site in someone's hand:
 *
 *  1. Horizontal overflow. A page wider than its viewport scrolls sideways,
 *     which no visitor is trying to do and Google counts against mobile
 *     usability. The offender is usually one row that fits at the breakpoint it
 *     was designed at and not at the one below it.
 *
 *  2. Targets under 24x24 CSS px — WCAG 2.2 AA 2.5.8. A twenty-pixel link is
 *     comfortable with a mouse and a coin-toss with a thumb.
 *
 * iPad Pro 12.9 in portrait is 1024px, which is exactly Tailwind's `lg`. Every
 * "desktop from lg" decision lands on that device first, so it earns its place
 * in the list even though it reads as a tablet.
 */

const BASE = (process.env.QA_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const launchOptions = browserLaunchOptions();

const DEVICES = [
  { name: "iPhone SE", width: 375, height: 667 },
  { name: "iPhone 15 Pro", width: 393, height: 852 },
  { name: "iPad mini portrait", width: 744, height: 1133 },
  { name: "iPad Pro 11 portrait", width: 834, height: 1194 },
  // Exactly Tailwind's lg breakpoint. The first device to see a desktop layout.
  { name: "iPad Pro 12.9 portrait", width: 1024, height: 1366 },
  { name: "iPad Pro 11 landscape", width: 1194, height: 834 },
];

const MIN_TARGET = 24;

/** One page per template, from the sitemap, so this survives a rename. */
async function samplePaths() {
  const xml = await fetch(`${BASE}/sitemap.xml`).then((r) => (r.ok ? r.text() : null));
  if (!xml) {
    console.error(`Could not read ${BASE}/sitemap.xml — is the server running?`);
    process.exit(1);
  }
  const all = [...new Set(
    [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname),
  )];
  const seen = new Map();
  for (const p of all) {
    const segments = p.split("/").filter(Boolean);
    const key = segments.length === 0 ? "/" : `${segments[0]}|${segments.length}`;
    if (!seen.has(key)) seen.set(key, p);
  }
  // The templates that carry the layout risk: the long one, the catalog, a
  // product, a generated pair page, and the form.
  const wanted = ["/", "/packages", "/contact"];
  const rest = [...seen.values()].filter((p) => !wanted.includes(p));
  return [...wanted, ...rest].slice(0, 8);
}

const audit = `(() => {
  const vw = document.documentElement.clientWidth;
  const out = { overflow: 0, offenders: [], targets: [] };

  out.overflow = Math.max(0, document.documentElement.scrollWidth - vw);
  if (out.overflow > 0) {
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0) continue;
      // A fixed bar sits outside the flow and never causes document overflow.
      if (getComputedStyle(el).position === "fixed") continue;
      // So does an off-screen honeypot, which is deliberately at -9999px.
      if (r.right < 0) continue;
      if (r.right > vw + 1) {
        const cls = (el.className || "").toString().split(" ").slice(0, 3).join(".");
        out.offenders.push(el.tagName.toLowerCase() + (cls ? "." + cls : "") + " right=" + Math.round(r.right));
        if (out.offenders.length >= 3) break;
      }
    }
  }

  const seen = new Set();
  for (const el of document.querySelectorAll("a[href], button, input, select, textarea, summary")) {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    if (cs.visibility === "hidden" || cs.display === "none") continue;
    if (r.width === 0 || r.height === 0) continue;

    // A visually hidden control whose visible label is the real target: the
    // sr-only radio inside a filter chip, the skip link before it is focused.
    // Measuring the input rather than what a thumb lands on is a false alarm.
    if (r.width <= 2 && r.height <= 2) continue;
    const label = el.closest("label");
    if (label) {
      const lr = label.getBoundingClientRect();
      if (lr.width >= ${MIN_TARGET} && lr.height >= ${MIN_TARGET}) continue;
    }

    if (r.width < ${MIN_TARGET} || r.height < ${MIN_TARGET}) {
      const text = (el.textContent || el.getAttribute("aria-label") || el.tagName).trim().slice(0, 24);
      const key = el.tagName + ":" + text;
      if (seen.has(key)) continue;
      seen.add(key);
      out.targets.push(text + " " + Math.round(r.width) + "x" + Math.round(r.height));
    }
  }
  return out;
})()`;

const paths = await samplePaths();
const browser = await chromium.launch(launchOptions);
const findings = [];

for (const device of DEVICES) {
  const ctx = await browser.newContext({
    viewport: { width: device.width, height: device.height },
    hasTouch: true,
    isMobile: device.width < 900,
  });
  const page = await ctx.newPage();
  // The consent choice persists per context, so the banner is only present on
  // the first load. Without a short timeout every later page waits out the
  // default 30 seconds looking for a button that is correctly no longer there.
  page.setDefaultTimeout(2000);
  for (const path of paths) {
    await page.goto(`${BASE}${path}`, { waitUntil: "load" });
    // The consent banner overlays the corner and is measured elsewhere.
    await page.getByRole("button", { name: /reject/i }).click().catch(() => {});
    await page.waitForTimeout(250);
    const r = await page.evaluate(audit);
    if (r.overflow > 0 || r.targets.length) {
      findings.push({ device: device.name, path, ...r });
    }
  }
  await ctx.close();
}
await browser.close();

console.log("\n" + "=".repeat(60));
console.log(`${DEVICES.length} viewports x ${paths.length} templates`);
if (!findings.length) {
  console.log("  ✓ no horizontal overflow");
  console.log(`  ✓ every target is at least ${MIN_TARGET}x${MIN_TARGET} CSS px`);
} else {
  for (const f of findings) {
    console.log(`  ✗ ${f.device}  ${f.path}`);
    if (f.overflow) console.log(`      overflows by ${f.overflow}px — ${f.offenders.join(" | ")}`);
    if (f.targets.length) console.log(`      targets under ${MIN_TARGET}px: ${f.targets.slice(0, 5).join(" | ")}`);
  }
}
console.log("=".repeat(60));
console.log(`${findings.length ? findings.length + " failing combinations" : "responsive checks passed"}\n`);
process.exit(findings.length ? 1 : 0);
