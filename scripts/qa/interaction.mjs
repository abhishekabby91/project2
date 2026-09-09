import { chromium } from "playwright";
import { browserLaunchOptions } from "./browser.mjs";

/**
 * Interaction, forms and SEO.
 *
 * `run.mjs` has always called this file. It has never existed, which is why
 * `npm run qa` could not pass however good the site was.
 *
 * What it checks is the set of things Google documents as requirements for
 * being crawled and indexed correctly, plus the two interactions that carry
 * every booking on this site — the navigation and the enquiry form. It reads
 * routes from the live sitemap, so it keeps working after the catalog, the
 * cities or the services are renamed.
 *
 * The bias throughout is towards checks that fail only on real defects. A
 * suite that cries wolf gets muted, and a muted suite is worse than none.
 */

const BASE = (process.env.QA_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const launchOptions = browserLaunchOptions();

const results = [];
const skipped = [];
const pass = (name, detail = "") => results.push({ ok: true, name, detail });
const fail = (name, detail = "") => results.push({ ok: false, name, detail });
const check = (cond, name, detail = "") => (cond ? pass(name, detail) : fail(name, detail));

/* -------------------------------------------------------------------------- */
/*  Crawl surface                                                             */
/* -------------------------------------------------------------------------- */

const sitemapXml = await fetch(`${BASE}/sitemap.xml`).then((r) => (r.ok ? r.text() : null));
if (!sitemapXml) {
  console.error(`Could not read ${BASE}/sitemap.xml — is the server running?`);
  process.exit(1);
}

const sitemapUrls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
const paths = sitemapUrls.map((u) => new URL(u).pathname);
const uniquePaths = [...new Set(paths)];

check(uniquePaths.length === paths.length, "sitemap lists each URL once",
  `${paths.length} entries, ${uniquePaths.length} unique`);

/**
 * One page per template rather than all of them. The templates are what can be
 * structurally wrong; the eighty-fifth city page cannot be wrong in a way the
 * first is not, and a suite nobody waits for is a suite nobody runs.
 */
function samplePerTemplate(all) {
  const seen = new Map();
  for (const p of all) {
    const segments = p.split("/").filter(Boolean);
    // "/balloon-decoration/noida" and "/anniversary-decoration/delhi" share a
    // shape; "/packages" and "/packages/x" do not.
    const key = segments.length === 0 ? "/" : `${segments[0]}|${segments.length}`;
    if (!seen.has(key)) seen.set(key, p);
  }
  return [...seen.values()];
}

const sample = samplePerTemplate(uniquePaths);

/* -------------------------------------------------------------------------- */
/*  Crawlability: what Googlebot gets before it runs a line of JavaScript      */
/* -------------------------------------------------------------------------- */

const robotsTxt = await fetch(`${BASE}/robots.txt`).then((r) => (r.ok ? r.text() : ""));
check(robotsTxt.length > 0, "robots.txt is served");

/**
 * Indexable means *the wildcard group* allows crawling — not that the file
 * contains no "Disallow: /" anywhere. Once content/crawlers.ts started
 * refusing the bulk AI harvesters, a naive search found their blocks and
 * concluded the site was closed to everyone, which silently skipped the
 * noindex contradiction check on exactly the deployments that need it.
 *
 * So: read the `User-Agent: *` group only, ending at the next group.
 */
function wildcardGroupBlocksEverything(txt) {
  const lines = txt.split(/\r?\n/);
  let inWildcard = false;
  for (const line of lines) {
    const ua = line.match(/^\s*User-agent:\s*(.+?)\s*$/i);
    if (ua) {
      inWildcard = ua[1] === "*";
      continue;
    }
    if (!inWildcard) continue;
    if (/^\s*Disallow:\s*\/\s*$/i.test(line)) return true;
  }
  return false;
}

const siteIsIndexable = !wildcardGroupBlocksEverything(robotsTxt);

if (siteIsIndexable) {
  check(/Sitemap:\s*https?:\/\//i.test(robotsTxt), "robots.txt declares the sitemap");
} else {
  // A deployment that has not been signed off refuses crawlers on purpose.
  // See src/lib/indexing.ts — that is a feature, not a finding.
  pass("robots.txt blocks crawlers", "deployment is not signed off; intentional");
}

/** Raw HTML, exactly as the crawler's first pass sees it. */
const raw = new Map();
for (const p of sample) {
  const res = await fetch(`${BASE}${p}`, { redirect: "manual" });
  raw.set(p, { status: res.status, html: res.ok ? await res.text() : "" });
}

const bad = sample.filter((p) => raw.get(p).status !== 200);
check(bad.length === 0, "every sampled sitemap URL returns 200",
  bad.length ? bad.map((p) => `${p} → ${raw.get(p).status}`).join(", ") : `${sample.length} sampled`);

/* A missing page must return 404, not 200 with an apology on it. Google calls
   the latter a soft 404 and it wastes crawl budget on pages that do not exist. */
const missing = await fetch(`${BASE}/this-page-does-not-exist-404-check`, { redirect: "manual" });
check(missing.status === 404, "a missing page returns HTTP 404, not a soft 404",
  `got ${missing.status}`);

/* -------------------------------------------------------------------------- */
/*  Indexing signals                                                          */
/* -------------------------------------------------------------------------- */

const attr = (html, re) => (html.match(re) || [])[1] || null;
const titleOf = (html) => attr(html, /<title>([^<]*)<\/title>/i);
const canonicalOf = (html) => attr(html, /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i);
const descOf = (html) => attr(html, /<meta[^>]+name="description"[^>]+content="([^"]*)"/i);
const robotsMetaOf = (html) => attr(html, /<meta[^>]+name="robots"[^>]+content="([^"]*)"/i);
const h1sOf = (html) => [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)]
  .map((m) => m[1].replace(/<[^>]+>/g, "").trim());

const titles = new Map();
const descriptions = new Map();
const canonicalProblems = [];
const h1Problems = [];
const titleProblems = [];
const descProblems = [];
const sitemapNoindex = [];

for (const p of sample) {
  const { html } = raw.get(p);
  if (!html) continue;

  const canonical = canonicalOf(html);
  const expected = `${p === "/" ? "" : p}`;
  if (!canonical) canonicalProblems.push(`${p}: none`);
  else if (!/^https?:\/\//.test(canonical)) canonicalProblems.push(`${p}: relative (${canonical})`);
  else if (new URL(canonical).pathname.replace(/\/$/, "") !== expected)
    canonicalProblems.push(`${p}: points at ${new URL(canonical).pathname}`);

  const title = titleOf(html);
  if (!title) titleProblems.push(`${p}: none`);
  else {
    if (titles.has(title)) titleProblems.push(`${p}: duplicate of ${titles.get(title)}`);
    else titles.set(title, p);
    // Not a hard rule of Google's, but a title this long is always truncated.
    if (title.length > 70) titleProblems.push(`${p}: ${title.length} chars`);
  }

  const desc = descOf(html);
  if (!desc) descProblems.push(`${p}: none`);
  else if (descriptions.has(desc)) descProblems.push(`${p}: duplicate of ${descriptions.get(desc)}`);
  else descriptions.set(desc, p);

  const h1s = h1sOf(html);
  if (h1s.length !== 1) h1Problems.push(`${p}: ${h1s.length} h1`);

  // A URL cannot be both submitted for indexing and told not to be indexed.
  // While the whole site is noindex by design that is coherent, so only flag
  // the contradiction on a deployment that is actually open to crawlers.
  const robotsMeta = robotsMetaOf(html) || "";
  if (siteIsIndexable && /noindex/i.test(robotsMeta)) sitemapNoindex.push(p);
}

check(canonicalProblems.length === 0, "every page self-references a canonical URL",
  canonicalProblems.join("; "));
check(titleProblems.length === 0, "titles are present, unique and not over-long",
  titleProblems.join("; "));
check(descProblems.length === 0, "meta descriptions are present and unique",
  descProblems.join("; "));
check(h1Problems.length === 0, "every page has exactly one h1", h1Problems.join("; "));
if (siteIsIndexable) {
  check(sitemapNoindex.length === 0, "no sitemap URL is marked noindex",
    sitemapNoindex.join(", "));
} else {
  // Every page is noindex by design here, so the contradiction cannot exist
  // yet. Saying "passed" would imply this was tested. It was not.
  skipped.push("no sitemap URL is marked noindex — whole site is noindex until sign-off");
}

/* Open Graph, so a link shared into WhatsApp — where this market shares
   everything — unfurls with a title and an image rather than a bare URL. */
const ogProblems = [];
for (const p of sample) {
  const { html } = raw.get(p);
  if (!html) continue;
  for (const prop of ["og:title", "og:description", "og:image", "og:url"]) {
    const re = new RegExp(`<meta[^>]+property="${prop}"[^>]+content="([^"]*)"`, "i");
    if (!re.test(html)) ogProblems.push(`${p}: ${prop}`);
  }
}
check(ogProblems.length === 0, "Open Graph tags are complete", ogProblems.slice(0, 6).join("; "));

/* -------------------------------------------------------------------------- */
/*  Structured data                                                           */
/* -------------------------------------------------------------------------- */

const ldProblems = [];
let breadcrumbsSeen = 0;
for (const p of sample) {
  const { html } = raw.get(p);
  if (!html) continue;
  const blocks = [...html.matchAll(
    /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  )].map((m) => m[1]);

  for (const block of blocks) {
    let parsed;
    try {
      parsed = JSON.parse(block);
    } catch {
      ldProblems.push(`${p}: JSON-LD does not parse`);
      continue;
    }
    for (const node of Array.isArray(parsed) ? parsed : [parsed]) {
      if (!node || typeof node !== "object") continue;
      if (!node["@type"]) ldProblems.push(`${p}: a node has no @type`);
      if (node["@type"] === "BreadcrumbList") {
        breadcrumbsSeen += 1;
        const positions = (node.itemListElement || []).map((i) => i.position);
        const sequential = positions.every((n, i) => n === i + 1);
        if (!sequential) ldProblems.push(`${p}: breadcrumb positions are not sequential`);
      }
      // An empty string is worse than an absent property: it asserts nothing
      // exists under a name Google expects to mean something.
      for (const [k, v] of Object.entries(node)) {
        if (v === "" || v === null) ldProblems.push(`${p}: ${node["@type"]}.${k} is empty`);
      }
    }
  }
}
check(ldProblems.length === 0, "structured data parses and has no empty properties",
  ldProblems.slice(0, 6).join("; "));
check(breadcrumbsSeen > 0, "breadcrumb structured data is emitted", `${breadcrumbsSeen} pages sampled`);

/* -------------------------------------------------------------------------- */
/*  Internal linking                                                          */
/* -------------------------------------------------------------------------- */

/* Googlebot finds pages by following links. A URL reachable only from the
   sitemap is a URL with no internal weight, and a link that 404s spends crawl
   budget on nothing. Both are checked against the raw HTML, because a link
   that only exists after hydration is a link the first pass never sees. */
const linked = new Set();
for (const p of sample) {
  const { html } = raw.get(p);
  if (!html) continue;
  for (const m of html.matchAll(/<a[^>]+href="(\/[^"#?]*)"/g)) {
    linked.add(m[1].replace(/\/$/, "") || "/");
  }
}

const internalTargets = [...linked].filter((href) => !href.startsWith("/api"));
const broken = [];
for (const href of internalTargets) {
  const res = await fetch(`${BASE}${href}`, { method: "HEAD", redirect: "manual" });
  if (res.status >= 400) broken.push(`${href} → ${res.status}`);
  else if (res.status >= 300) broken.push(`${href} → redirect ${res.status}`);
}
check(broken.length === 0, "internal links resolve without 404s or redirects",
  broken.slice(0, 8).join("; "));

const orphans = uniquePaths
  .map((p) => p.replace(/\/$/, "") || "/")
  .filter((p) => p !== "/" && !linked.has(p));
check(orphans.length === 0, "no sitemap URL is reachable only from the sitemap",
  orphans.length ? `${orphans.length}: ${orphans.slice(0, 8).join(", ")}` : "");

/* -------------------------------------------------------------------------- */
/*  Rendering without JavaScript                                              */
/* -------------------------------------------------------------------------- */

/* Google renders JavaScript, but the first pass is the raw HTML and rendering
   is queued and never guaranteed. Anything that matters commercially has to be
   in the HTML — for this site that is the catalog and its prices. */
const catalogHtml = raw.get("/packages")?.html || "";
if (catalogHtml) {
  const productLinks = new Set(
    [...catalogHtml.matchAll(/href="(\/packages\/[a-z0-9-]+)"/g)].map((m) => m[1]),
  );
  check(productLinks.size >= 3, "the catalog is in the HTML before hydration",
    `${productLinks.size} package links`);
  check(/₹|&#8377;|Rs\.?/.test(catalogHtml), "prices are in the HTML before hydration");
}

/* -------------------------------------------------------------------------- */
/*  Near-duplicate pages                                                      */
/* -------------------------------------------------------------------------- */

/**
 * The doorway-page test, run on what is actually rendered.
 *
 * `check-content.mjs` catches the crude version — two cities sharing a
 * localNote that differs only by the place name. This catches the version that
 * survives that: thirty service × city pages that read the same because the
 * local content is a thin garnish on an identical body.
 *
 * Jaccard similarity over five-word shingles of <main>, which ignores the
 * header and footer both pages share by definition.
 *
 * The threshold is set from measurement, not taste. At the time of writing the
 * worst same-service pair (Delhi vs Noida) sits at 73.8%, so roughly a quarter
 * of each page is genuinely its own. 85% leaves real headroom for the content
 * to grow while still catching a city added by find-and-replace.
 */
const DUPLICATE_THRESHOLD = 0.85;

const mainText = (html) => {
  const m = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  const body = (m ? m[1] : html).replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, "");
  return body
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
};

const shingles = (text, n = 5) => {
  const words = text.split(" ");
  const set = new Set();
  for (let i = 0; i + n <= words.length; i += 1) set.add(words.slice(i, i + n).join(" "));
  return set;
};

const jaccard = (a, b) => {
  let intersection = 0;
  for (const x of a) if (b.has(x)) intersection += 1;
  return intersection / (a.size + b.size - intersection);
};

/* Only two-segment paths — the service × city pages, which are the ones
   generated from a template and therefore the ones that can be doorways. */
const pairPaths = uniquePaths.filter((p) => p.split("/").filter(Boolean).length === 2);
const fingerprints = new Map();
for (const p of pairPaths) {
  const html = await fetch(`${BASE}${p}`).then((r) => (r.ok ? r.text() : ""));
  if (html) fingerprints.set(p, shingles(mainText(html)));
}

let worst = { value: 0, pair: "" };
const tooSimilar = [];
const fps = [...fingerprints.entries()];
for (let i = 0; i < fps.length; i += 1) {
  for (let j = i + 1; j < fps.length; j += 1) {
    const value = jaccard(fps[i][1], fps[j][1]);
    if (value > worst.value) worst = { value, pair: `${fps[i][0]} vs ${fps[j][0]}` };
    if (value >= DUPLICATE_THRESHOLD) {
      tooSimilar.push(`${fps[i][0]} vs ${fps[j][0]} (${(value * 100).toFixed(0)}%)`);
    }
  }
}

if (fps.length > 1) {
  check(tooSimilar.length === 0, "generated pages are not near-duplicates of each other",
    tooSimilar.length
      ? tooSimilar.slice(0, 5).join("; ")
      : `worst pair ${(worst.value * 100).toFixed(1)}% — ${worst.pair}`);
}

/* -------------------------------------------------------------------------- */
/*  Interaction and forms                                                     */
/* -------------------------------------------------------------------------- */

const browser = await chromium.launch(launchOptions);
const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await ctx.newPage();

await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
await page.getByRole("button", { name: /reject/i }).click({ timeout: 2000 }).catch(() => {});

// The skip link is the first thing a keyboard user meets.
await page.keyboard.press("Tab");
const firstFocus = await page.evaluate(() => {
  const el = document.activeElement;
  return { text: el?.textContent?.trim() || "", href: el?.getAttribute("href") || "" };
});
check(/skip/i.test(firstFocus.text), "the first tab stop is a skip link", firstFocus.text);
check(firstFocus.href.startsWith("#"), "the skip link targets an in-page anchor", firstFocus.href);

// The nav flyout has to open from the keyboard, not hover alone.
const navButton = page.locator('nav[aria-label="Main"] button[aria-expanded]').first();
if (await navButton.count()) {
  await navButton.focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(200);
  check((await navButton.getAttribute("aria-expanded")) === "true",
    "the nav flyout opens from the keyboard");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(200);
  check((await navButton.getAttribute("aria-expanded")) === "false",
    "Escape closes the nav flyout");
}

// The enquiry form: labelled, validated, and honest about failure.
await page.goto(`${BASE}/contact`, { waitUntil: "networkidle" });
const form = page.locator("form").first();
check(await form.count() > 0, "the contact page has an enquiry form");

if (await form.count()) {
  const unlabelled = await page.evaluate(() => {
    const fields = [...document.querySelectorAll("form input, form textarea, form select")];
    return fields
      .filter((f) => f.type !== "hidden")
      .filter((f) => {
        if (f.getAttribute("aria-label") || f.getAttribute("aria-labelledby")) return false;
        return !(f.id && document.querySelector(`label[for="${CSS.escape(f.id)}"]`));
      })
      .map((f) => f.name || f.type);
  });
  check(unlabelled.length === 0, "every form field has a label", unlabelled.join(", "));

  // Submitting empty must be refused, and say why in text — not colour alone.
  await form.locator('button[type="submit"], button:not([type])').first().click();
  await page.waitForTimeout(600);
  const invalid = await page.locator("form :invalid, form [aria-invalid='true']").count();
  const errorText = await page.locator("form [role='alert'], form .text-accent").count();
  check(invalid > 0 || errorText > 0, "an empty submission is refused with a visible reason");

  const stillOnPage = page.url().includes("/contact");
  check(stillOnPage, "a refused submission does not navigate away");
}

/* The conversion path this market actually uses. A wa.me link with no
   pre-filled text loses the context the visitor was looking at. */
await page.goto(`${BASE}/packages/${
  [...(catalogHtml.matchAll(/href="\/packages\/([a-z0-9-]+)"/g))][0]?.[1] || ""
}`, { waitUntil: "networkidle" });
const waHref = await page.locator('a[href*="wa.me"]').first().getAttribute("href");
check(Boolean(waHref), "a package page offers WhatsApp");
if (waHref) {
  check(/[?&]text=[^&]+/.test(waHref), "the WhatsApp link is pre-filled with context",
    decodeURIComponent(waHref.split("text=")[1] || "").slice(0, 60));
}

/* -------------------------------------------------------------------------- */
/*  Layout stability                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Cumulative Layout Shift, which Google counts as "good" at 0.1 or below.
 *
 * The catalog is the page that can regress here: its filter rail is a client
 * component reading the query string, so the server sends a fallback and the
 * real thing replaces it after hydration. That swap is invisible only because
 * the fallback reserves the rail's column and the results row. Take that shell
 * away and the whole grid jumps sideways on every load.
 *
 * Measured on mobile, where a shift costs the most and the viewport is
 * narrowest. LCP is deliberately not asserted: it is dominated by network and
 * CPU conditions that mean nothing on a local server.
 */
const clsPage = await ctx.newPage();
await clsPage.setViewportSize({ width: 390, height: 844 });
await clsPage.addInitScript(() => {
  window.__cls = 0;
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!entry.hadRecentInput) window.__cls += entry.value;
    }
  }).observe({ type: "layout-shift", buffered: true });
});

for (const p of ["/", "/packages"]) {
  await clsPage.goto(`${BASE}${p}`, { waitUntil: "networkidle" });
  await clsPage.waitForTimeout(1200);
  const cls = await clsPage.evaluate(() => window.__cls);
  check(cls <= 0.1, `layout is stable on ${p}`, `CLS ${cls.toFixed(4)}`);
  await clsPage.evaluate(() => { window.__cls = 0; });
}
await clsPage.close();

await browser.close();

/* -------------------------------------------------------------------------- */

console.log("\n" + "=".repeat(60));
for (const r of results) {
  console.log(`  ${r.ok ? "✓" : "✗"} ${r.name}${r.detail ? ` — ${r.detail}` : ""}`);
}
for (const s of skipped) console.log(`  · ${s}`);
const failed = results.filter((r) => !r.ok);
console.log("=".repeat(60));
console.log(
  `${results.length - failed.length} passed, ${failed.length} failed` +
    (skipped.length ? `, ${skipped.length} skipped` : "") + "\n",
);
process.exit(failed.length ? 1 : 0);
