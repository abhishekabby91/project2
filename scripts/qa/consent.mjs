import { chromium } from 'playwright';

/**
 * Consent QA.
 *
 * The claim being tested is narrow and important: with a measurement ID
 * configured, no analytics cookie may be set and no measurement request may
 * leave the browser until the visitor opts in. Everything else here is
 * secondary to that.
 */
const BASE = process.env.QA_BASE_URL || 'http://localhost:3000';
const launchOptions = process.env.QA_BROWSER_PATH
  ? { executablePath: process.env.QA_BROWSER_PATH }
  : {};

const pass = [], fail = [];
const check = (name, ok, detail = '') => (ok ? pass : fail).push(`${name}${detail ? ' — ' + detail : ''}`);

const b = await chromium.launch(launchOptions);

/** Records every request that reaches an analytics or ads endpoint. */
function watchTrackers(page) {
  const hits = [];
  page.on('request', (r) => {
    const u = r.url();
    if (/google-analytics\.com|analytics\.google\.com|googletagmanager\.com\/g\/collect|doubleclick\.net/.test(u)) {
      hits.push(u);
    }
  });
  return hits;
}

const analyticsCookies = (cookies) =>
  cookies.filter((c) => /^_ga|^_gid|^_gcl|^_fb/.test(c.name));

// ── 1. Fresh visitor, no choice made ──────────────────────────────────────
{
  const ctx = await b.newContext();
  const p = await ctx.newPage();
  const hits = watchTrackers(p);
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1200);

  const banner = await p.locator('[role="region"][aria-label]').filter({ hasText: /cookie/i }).count();
  check('banner is shown to a visitor who has not chosen', banner > 0);

  const cookies = analyticsCookies(await ctx.cookies());
  check('NO analytics cookie before consent', cookies.length === 0,
    cookies.map((c) => c.name).join(', ') || 'none set');
  check('NO measurement request before consent', hits.length === 0,
    hits.length ? hits[0].slice(0, 80) : 'none sent');

  // Refusal must be reachable without opening a second screen.
  const reject = await p.getByRole('button', { name: /reject/i }).count();
  const accept = await p.getByRole('button', { name: /accept/i }).count();
  check('reject is offered alongside accept, not buried', reject > 0 && accept > 0,
    `reject:${reject} accept:${accept}`);
  await ctx.close();
}

// ── 2. Visitor rejects ────────────────────────────────────────────────────
{
  const ctx = await b.newContext();
  const p = await ctx.newPage();
  const hits = watchTrackers(p);
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  await p.getByRole('button', { name: /reject/i }).first().click();
  await p.waitForTimeout(1000);

  const cookies = analyticsCookies(await ctx.cookies());
  check('no analytics cookie after rejecting', cookies.length === 0,
    cookies.map((c) => c.name).join(', ') || 'none set');
  check('no measurement request after rejecting', hits.length === 0);

  const consentMode = await p.evaluate(() =>
    (window.dataLayer || []).some((e) => e && e[0] === 'consent' && e[1] === 'update'));
  check('a Consent Mode update was pushed', consentMode);

  await p.reload({ waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  const bannerAgain = await p.locator('[role="region"][aria-label]').filter({ hasText: /cookie/i }).count();
  check('choice persists across a reload', bannerAgain === 0);
  await ctx.close();
}

// ── 3. Visitor accepts ────────────────────────────────────────────────────
{
  const ctx = await b.newContext();
  const p = await ctx.newPage();
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  await p.getByRole('button', { name: /accept/i }).first().click();
  await p.waitForTimeout(600);

  const granted = await p.evaluate(() => {
    const dl = window.dataLayer || [];
    const update = [...dl].reverse().find((e) => e && e[0] === 'consent' && e[1] === 'update');
    return update ? update[2].analytics_storage : null;
  });
  check('accepting grants analytics_storage', granted === 'granted', String(granted));

  const bannerGone = await p.locator('[role="region"][aria-label]').filter({ hasText: /cookie/i }).count();
  check('banner dismisses after choosing', bannerGone === 0);
  await ctx.close();
}

// ── 4. Global Privacy Control is honoured without asking ──────────────────
{
  const ctx = await b.newContext();
  await ctx.addInitScript(() => {
    Object.defineProperty(navigator, 'globalPrivacyControl', { value: true, configurable: true });
  });
  const p = await ctx.newPage();
  const hits = watchTrackers(p);
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(1000);

  const banner = await p.locator('[role="region"][aria-label]').filter({ hasText: /cookie/i }).count();
  check('GPC is treated as an answer — no banner', banner === 0);
  check('GPC suppresses measurement requests', hits.length === 0);
  const denied = await p.evaluate(() => {
    const dl = window.dataLayer || [];
    const def = dl.find((e) => e && e[0] === 'consent' && e[1] === 'default');
    return def ? def[2].analytics_storage : null;
  });
  check('GPC sets analytics_storage denied by default', denied === 'denied', String(denied));
  await ctx.close();
}

// ── 5. Preference centre ──────────────────────────────────────────────────
{
  const ctx = await b.newContext();
  const p = await ctx.newPage();
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  await p.getByRole('button', { name: /manage preferences/i }).first().click();
  await p.waitForTimeout(400);

  const dialog = p.locator('[role="dialog"]');
  check('preference dialog opens', await dialog.count() > 0);
  check('necessary category cannot be switched off',
    await p.locator('#consent-necessary').isDisabled());

  await p.locator('#consent-analytics').check();
  await p.getByRole('button', { name: /save preferences/i }).click();
  await p.waitForTimeout(600);

  const state = await p.evaluate(() => {
    const dl = window.dataLayer || [];
    const u = [...dl].reverse().find((e) => e && e[0] === 'consent' && e[1] === 'update');
    return u ? { analytics: u[2].analytics_storage, ads: u[2].ad_storage } : null;
  });
  check('granular choice applied: analytics on, ads off',
    state?.analytics === 'granted' && state?.ads === 'denied', JSON.stringify(state));

  await p.keyboard.press('Escape');
  await ctx.close();
}

// ── 6. Withdrawal is as easy as consent ───────────────────────────────────
{
  const ctx = await b.newContext();
  const p = await ctx.newPage();
  await p.goto(BASE + '/', { waitUntil: 'networkidle' });
  await p.getByRole('button', { name: /accept/i }).first().click();
  await p.waitForTimeout(400);

  const link = p.getByRole('button', { name: /cookie preferences/i });
  check('a way back exists in the footer', await link.count() > 0);
  await link.first().click();
  await p.waitForTimeout(400);
  check('footer link reopens the dialog', await p.locator('[role="dialog"]').count() > 0);
  await ctx.close();
}

console.log(`\n${'='.repeat(60)}`);
pass.forEach((t) => console.log('  ✓ ' + t));
if (fail.length) { console.log(''); fail.forEach((t) => console.log('  ✗ ' + t)); }
console.log(`${'='.repeat(60)}\n${pass.length} passed, ${fail.length} failed\n`);
await b.close();
process.exit(fail.length ? 1 : 0);
