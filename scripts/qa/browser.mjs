import { existsSync, readdirSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright";

/**
 * Find a Chromium this machine can actually launch.
 *
 * Playwright resolves its browser by an exact build number — 1.62 wants
 * chromium-1234 and will not settle for chromium-1194 sitting beside it. CI
 * images, dev containers and sandboxes pin their own Chromium and set
 * PLAYWRIGHT_BROWSERS_PATH at it, usually with the download disabled, so the
 * version almost never lines up. The failure is a wall of "run npx playwright
 * install" that cannot be followed, and the whole suite exits before its first
 * check — which is worse than a QA failure, because it looks like one.
 *
 * So: use the version Playwright wants when it is really there, otherwise use
 * whatever Chromium is installed. These checks read the DOM of a rendered page;
 * they do not depend on the patch version of the renderer.
 */
export function browserLaunchOptions() {
  // An explicit path wins. Someone who set it knows something we don't.
  if (process.env.QA_BROWSER_PATH) {
    return { executablePath: process.env.QA_BROWSER_PATH };
  }

  try {
    const own = chromium.executablePath();
    if (own && existsSync(own)) return {};
  } catch {
    // Throws when no browser is registered at all — fall through and look.
  }

  const installed = findInstalledChromium();
  if (installed) {
    console.log(`  (using installed Chromium at ${installed})`);
    return { executablePath: installed };
  }

  // Nothing found. Return empty and let Playwright print its own install
  // instructions, which are the right ones when the download is available.
  return {};
}

/** Where Playwright keeps browsers, per its own resolution order. */
function browserRoots() {
  const roots = [];
  if (process.env.PLAYWRIGHT_BROWSERS_PATH) roots.push(process.env.PLAYWRIGHT_BROWSERS_PATH);
  roots.push(join(homedir(), ".cache", "ms-playwright"));
  roots.push(join(homedir(), "Library", "Caches", "ms-playwright"));
  return roots.filter((dir) => existsSync(dir));
}

/** The binary's path inside a browser directory differs by build and platform. */
const BINARIES = [
  "chrome-linux64/chrome",
  "chrome-linux/chrome",
  "chrome-headless-shell-linux64/chrome-headless-shell",
  "chrome-mac/Chromium.app/Contents/MacOS/Chromium",
  "chrome-win/chrome.exe",
];

function findInstalledChromium() {
  for (const root of browserRoots()) {
    // Some images leave a convenience symlink at the root. Believe it.
    const link = join(root, "chromium");
    if (existsSync(link) && statSync(link).isFile()) return link;

    const dirs = readdirSync(root)
      .filter((name) => name.startsWith("chromium"))
      // A full Chromium before a headless shell, then the newest build, so a
      // stale copy left behind by an earlier install is not the one we pick.
      .sort((a, b) => {
        const shell = Number(a.includes("headless_shell")) - Number(b.includes("headless_shell"));
        if (shell !== 0) return shell;
        return buildNumber(b) - buildNumber(a);
      });

    for (const dir of dirs) {
      for (const binary of BINARIES) {
        const candidate = join(root, dir, binary);
        if (existsSync(candidate)) return candidate;
      }
    }
  }
  return null;
}

function buildNumber(dir) {
  const match = dir.match(/(\d+)$/);
  return match ? Number(match[1]) : 0;
}
