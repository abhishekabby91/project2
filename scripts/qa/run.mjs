#!/usr/bin/env node
/**
 * Automated QA for a client site.
 *
 *   npm run build && npm start &
 *   npm run qa
 *
 * Or against a deployed URL:
 *
 *   QA_BASE_URL=https://client-site.vercel.app npm run qa
 *
 * QA_BROWSER_PATH points at an already-installed Chromium, for CI images that
 * ship one.
 *
 * Covers accessibility (WCAG 2.2 AA contrast, heading order, labels, landmarks),
 * mobile layout, keyboard and interaction behaviour, form validation end to end,
 * the SEO artifacts — sitemap, robots, canonical, JSON-LD validity — and cookie
 * consent, including that nothing is measured before the visitor agrees.
 *
 * Routes come from the live sitemap, so this keeps working after a client
 * renames every service and office.
 */
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const base = process.env.QA_BASE_URL || "http://localhost:3000";

try {
  await import("playwright");
} catch {
  console.error(
    "\nQA needs Playwright, which is not installed.\n\n" +
      "  npm install --save-dev playwright && npx playwright install chromium\n\n" +
      "It is an optional dev dependency so the base template stays light.\n",
  );
  process.exit(1);
}

const reachable = await fetch(base).then((r) => r.ok).catch(() => false);
if (!reachable) {
  console.error(
    `\nNothing responding at ${base}.\n\n` +
      "  npm run build && npm start      # then re-run in another shell\n" +
      "  QA_BASE_URL=https://…  npm run qa   # or point it at a deployment\n",
  );
  process.exit(1);
}

const run = (script) =>
  new Promise((resolve) => {
    const child = spawn(process.execPath, [join(here, script)], {
      stdio: "inherit",
      env: { ...process.env, QA_BASE_URL: base },
    });
    child.on("close", resolve);
  });

console.log(`\nRunning QA against ${base}\n${"=".repeat(60)}`);
console.log("\n## Accessibility and contrast\n");
const a11y = await run("accessibility.mjs");
console.log("\n## Interaction, forms and SEO\n");
const interaction = await run("interaction.mjs");
console.log("\n## Cookie consent\n");
const consent = await run("consent.mjs");

const failed = a11y !== 0 || interaction !== 0 || consent !== 0;
console.log(`\n${"=".repeat(60)}\n${failed ? "QA FAILED" : "QA passed"}\n`);
process.exit(failed ? 1 : 0);
