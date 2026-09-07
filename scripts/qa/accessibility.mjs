import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';

const BASE = process.env.QA_BASE_URL || 'http://localhost:3000';

/**
 * Honor a pre-installed browser. CI images and sandboxes often ship one that
 * doesn't match the version Playwright expects, and re-downloading it on every
 * run is slow. Set QA_BROWSER_PATH to point at an existing binary.
 */
const launchOptions = process.env.QA_BROWSER_PATH
  ? { executablePath: process.env.QA_BROWSER_PATH }
  : {};


/**
 * Routes are derived from the live sitemap, not hardcoded, so this suite keeps
 * working after a client renames every service and office.
 */
async function sitemapPaths() {
  const res = await fetch(`${BASE}/sitemap.xml`);
  if (!res.ok) throw new Error(`Could not read ${BASE}/sitemap.xml — is the server running?`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((m) => new URL(m[1]).pathname)
    .filter((p, i, a) => a.indexOf(p) === i);
}

/** One representative page per template, so the suite stays fast as content grows. */
function sampleRoutes(all) {
  const first = (prefix, depth) =>
    all.filter((p) => p.startsWith(prefix) && p.split('/').filter(Boolean).length === depth)[0];
  return [...new Set([
    '/',
    '/services', first('/services/', 2),
    '/industries', first('/industries/', 2),
    '/about', '/team', first('/team/', 2),
    '/locations', first('/locations/', 2),
    '/resources', '/resources/blog', first('/resources/blog/', 3),
    '/resources/guides', '/faqs', '/contact', '/schedule',
    '/privacy', '/terms', '/accessibility',
    '/this-page-does-not-exist-404-check',
  ].filter(Boolean))];
}

const paths = sampleRoutes(await sitemapPaths());

const b = await chromium.launch(launchOptions);
const ctx = await b.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await ctx.newPage();

const audit = `
(() => {
  // Resolve ANY CSS color string (oklab, color-mix, rgb, hex) to concrete RGBA
  // by letting the canvas do the conversion.
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const c2 = cv.getContext('2d', { willReadFrequently: true });
  const cache = new Map();
  function rgba(str) {
    if (cache.has(str)) return cache.get(str);
    c2.clearRect(0,0,1,1);
    c2.fillStyle = '#000';           // reset to detect invalid values
    c2.fillStyle = str;
    c2.clearRect(0,0,1,1);
    c2.fillRect(0,0,1,1);
    const d = c2.getImageData(0,0,1,1).data;
    const out = [d[0], d[1], d[2], d[3]/255];
    cache.set(str, out);
    return out;
  }
  const srgb = c => { c /= 255; return c <= 0.04045 ? c/12.92 : Math.pow((c+0.055)/1.055, 2.4); };
  const lum = ([r,g,b]) => 0.2126*srgb(r) + 0.7152*srgb(g) + 0.0722*srgb(b);
  const ratio = (a,b) => { const [l1,l2] = [lum(a), lum(b)].sort((x,y)=>y-x); return (l1+0.05)/(l2+0.05); };
  const blend = (fg, a, bg) => [0,1,2].map(i => fg[i]*a + bg[i]*(1-a));

  function effectiveBg(el) {
    let node = el;
    const stack = [];
    while (node && node !== document.documentElement) {
      const cs = getComputedStyle(node);
      const [r,g,bl,a] = rgba(cs.backgroundColor);
      if (a > 0) stack.push([[r,g,bl], a]);
      if (a >= 0.999) break;
      node = node.parentElement;
    }
    let base = [255,255,255];
    for (let i = stack.length - 1; i >= 0; i--) base = blend(stack[i][0], stack[i][1], base);
    return base;
  }

  const results = { contrast: [], headings: [], images: [], labels: [], links: [], landmarks: {} };

  const els = [...document.querySelectorAll('body *')].filter(el => {
    const hasText = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!hasText) return false;
    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) return false;
    const cs = getComputedStyle(el);
    if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) < 0.1) return false;
    if (el.closest('[aria-hidden="true"]')) return false;
    return true;
  });

  for (const el of els) {
    const cs = getComputedStyle(el);
    const [fr,fg_,fb,fa] = rgba(cs.color);
    if (fa === 0) continue;
    const bg = effectiveBg(el);
    const fg = fa < 1 ? blend([fr,fg_,fb], fa, bg) : [fr,fg_,fb];
    const size = parseFloat(cs.fontSize);
    const weight = Number(cs.fontWeight) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    const need = large ? 3 : 4.5;
    const r = ratio(fg, bg);
    if (r < need) {
      results.contrast.push({
        text: el.textContent.trim().slice(0, 42),
        ratio: Math.round(r*100)/100, need,
        fg: 'rgb(' + fg.map(Math.round).join(',') + ')',
        bg: 'rgb(' + bg.map(Math.round).join(',') + ')',
        px: size, weight, cls: (el.className || '').toString().slice(0, 70),
      });
    }
  }

  let prev = 0;
  for (const h of document.querySelectorAll('h1,h2,h3,h4,h5,h6')) {
    const lvl = Number(h.tagName[1]);
    if (prev && lvl > prev + 1) results.headings.push({ skip: prev + '->' + lvl, text: h.textContent.trim().slice(0,40) });
    prev = lvl;
  }
  results.h1Count = document.querySelectorAll('h1').length;

  for (const img of document.querySelectorAll('img'))
    if (img.getAttribute('alt') === null) results.images.push(img.getAttribute('src'));

  for (const c of document.querySelectorAll('input,select,textarea')) {
    if (c.type === 'hidden') continue;
    const hasLabel = (c.id && document.querySelector('label[for="' + CSS.escape(c.id) + '"]')) ||
      c.closest('label') || c.getAttribute('aria-label') || c.getAttribute('aria-labelledby');
    if (!hasLabel) results.labels.push(c.name || c.id || c.tagName);
  }

  for (const a of document.querySelectorAll('a[href]')) {
    const name = (a.textContent || '').trim() || a.getAttribute('aria-label') ||
      a.querySelector('img')?.getAttribute('alt') || a.querySelector('.sr-only')?.textContent || '';
    if (!name) results.links.push(a.getAttribute('href'));
  }

  results.landmarks = {
    main: document.querySelectorAll('main').length,
    lang: document.documentElement.lang || null,
  };
  return results;
})()
`;

const allContrast = new Map();
let groups = 0;
for (const path of paths) {
  await page.goto(BASE + path, { waitUntil: 'networkidle' });
  const r = await page.evaluate(audit);
  const issues = [];
  if (r.h1Count !== 1) issues.push(`h1 count = ${r.h1Count}`);
  if (r.headings.length) issues.push(`heading skips: ${JSON.stringify(r.headings)}`);
  if (r.images.length) issues.push(`img missing alt: ${JSON.stringify(r.images)}`);
  if (r.labels.length) issues.push(`unlabeled controls: ${JSON.stringify(r.labels)}`);
  if (r.links.length) issues.push(`links w/o name: ${JSON.stringify(r.links)}`);
  if (!r.landmarks.lang) issues.push('missing html lang');
  if (r.landmarks.main !== 1) issues.push(`main count = ${r.landmarks.main}`);
  for (const c of r.contrast) {
    const key = `${c.ratio}|${c.fg}|${c.bg}|${c.px}|${c.weight}`;
    if (!allContrast.has(key)) allContrast.set(key, { ...c, pages: [] });
    allContrast.get(key).pages.push(path);
  }
  groups += issues.length;
  console.log(`${issues.length || r.contrast.length ? '✗' : '✓'} ${path}${r.contrast.length ? '  (contrast: ' + r.contrast.length + ')' : ''}`);
  issues.forEach(i => console.log('   ' + i));
}

console.log('\n=== UNIQUE CONTRAST FAILURES ===');
const sorted = [...allContrast.values()].sort((a,b) => a.ratio - b.ratio);
for (const c of sorted) {
  console.log(`${String(c.ratio).padStart(5)} (need ${c.need})  ${c.px}px/${c.weight}  ${c.fg} on ${c.bg}  "${c.text}"`);
  console.log(`        cls: ${c.cls}`);
  console.log(`        on ${c.pages.length} page(s)`);
}
console.log(`\n${sorted.length} unique contrast failures, ${groups} other issue groups.`);
await b.close();
