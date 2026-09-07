#!/usr/bin/env node
/**
 * Reports how far a client fork has drifted from the template.
 *
 *   npm run check:upstream
 *
 * Fork-per-client is simple to start and expensive to maintain: a Next.js
 * security patch or a component fix lands in the template and reaches nobody.
 * This tells you, per fork, what it is missing and what will fight you when you
 * pull it in.
 *
 * One-time setup in each client fork:
 *
 *   git remote add template https://github.com/YOUR-ORG/YOUR-TEMPLATE.git
 *
 * Then to actually take the updates:
 *
 *   git fetch template
 *   git merge template/main            # conflicts should be content/ only
 *
 * Exit code is 0 unless --strict is passed, so this is safe in CI as a report.
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const strict = process.argv.includes("--strict");

/** Paths that must stay identical to the template across every fork. */
const SHARED = ["src", "scripts", "package.json", "next.config.ts", "tsconfig.json", "postcss.config.mjs", "vercel.json"];
/** Paths every fork is expected to rewrite. Drift here is the point. */
const DIVERGENT = ["content", "public", "README.md", "docs"];

const git = (...args) => {
  try {
    return execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
  } catch (error) {
    return { error: (error.stderr || error.message || "").trim() };
  }
};

const fail = (msg, hint) => {
  console.error(`\n✗ ${msg}\n  ${hint}\n`);
  process.exit(strict ? 1 : 0);
};

if (!existsSync(join(root, ".git"))) {
  fail("Not a git repository.", "Run this inside a client fork.");
}

const remotes = git("remote");
if (typeof remotes === "object" || !remotes.split("\n").includes("template")) {
  fail(
    "No `template` remote configured.",
    "git remote add template https://github.com/YOUR-ORG/YOUR-TEMPLATE.git",
  );
}

process.stdout.write("Fetching template… ");
const fetched = git("fetch", "template", "--quiet");
if (typeof fetched === "object") {
  console.log("failed.");
  fail("Could not fetch the template remote.", fetched.error.split("\n")[0]);
}
console.log("done.");

/** The template's default branch, as the remote reports it. */
let templateRef = "template/main";
const head = git("symbolic-ref", "--quiet", "refs/remotes/template/HEAD");
if (typeof head === "string" && head) {
  templateRef = head.replace("refs/remotes/", "");
} else {
  const branches = git("branch", "-r", "--list", "template/*");
  if (typeof branches === "string" && branches && !branches.includes("template/main")) {
    templateRef = branches.split("\n")[0].trim();
  }
}

const base = git("merge-base", "HEAD", templateRef);
if (typeof base === "object") {
  fail(`No shared history with ${templateRef}.`, "This fork was not created from the template.");
}

/* ── What the template has that this fork doesn't ────────────────────────── */

const behind = git("log", "--oneline", `HEAD..${templateRef}`, "--", ...SHARED);
const behindLines = typeof behind === "string" && behind ? behind.split("\n") : [];

/* ── Where this fork has edited shared files ─────────────────────────────── */

const changed = git("diff", "--name-only", `${base}..HEAD`, "--", ...SHARED);
const changedFiles = typeof changed === "string" && changed ? changed.split("\n") : [];

/* ── Content drift, for context only ─────────────────────────────────────── */

const contentChanged = git("diff", "--name-only", `${base}..HEAD`, "--", ...DIVERGENT);
const contentFiles = typeof contentChanged === "string" && contentChanged ? contentChanged.split("\n") : [];

/* ── Report ──────────────────────────────────────────────────────────────── */

console.log(`\nComparing against ${templateRef}\n`);

if (behindLines.length === 0) {
  console.log("✓ Up to date — no template commits touch shared code.");
} else {
  console.log(`! ${behindLines.length} template commit(s) this fork is missing:\n`);
  for (const line of behindLines.slice(0, 15)) console.log(`    ${line}`);
  if (behindLines.length > 15) console.log(`    …and ${behindLines.length - 15} more`);
  console.log("\n  Take them with:  git fetch template && git merge " + templateRef);
}

if (changedFiles.length > 0) {
  console.log(`\n! This fork has edited ${changedFiles.length} shared file(s):\n`);
  for (const f of changedFiles.slice(0, 20)) console.log(`    ${f}`);
  if (changedFiles.length > 20) console.log(`    …and ${changedFiles.length - 20} more`);
  console.log(
    "\n  These will conflict on merge. Shared code is meant to stay identical —" +
      "\n  if a change here is genuinely per-client, it probably belongs in content/;" +
      "\n  if it's an improvement, port it back to the template instead.",
  );
}

if (contentFiles.length > 0) {
  console.log(`\n  (${contentFiles.length} content/docs file(s) diverged — expected, not a problem.)`);
}

const problems = behindLines.length + changedFiles.length;
console.log(
  problems === 0
    ? "\n✓ Fork is clean and current.\n"
    : `\n${problems} item(s) need attention.\n`,
);

if (strict && problems > 0) process.exit(1);
