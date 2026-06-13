#!/usr/bin/env node
/**
 * Vercel "Ignored Build Step" gate.
 *
 * Vercel semantics:
 *   exit 0 → skip the build
 *   exit 1 → run the build
 *
 * Configure in Vercel Project Settings → Git → Ignored Build Step:
 *   node scripts/vercel/ignore-build.mjs
 */
import { execSync } from "node:child_process";

/** @param {number} code */
function finish(code) {
  process.exit(code);
}

// Production must always build — never skip a prod deploy.
if (process.env.VERCEL_ENV === "production") {
  finish(1);
}

const previousSha = process.env.VERCEL_GIT_PREVIOUS_SHA?.trim();
const currentSha = process.env.VERCEL_GIT_COMMIT_SHA?.trim();

let changedFiles = [];

try {
  if (previousSha && currentSha) {
    const output = execSync(`git diff --name-only ${previousSha} ${currentSha}`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    changedFiles = output.split("\n").map((line) => line.trim()).filter(Boolean);
  } else {
    // First deploy or missing SHAs — always build.
    finish(1);
  }
} catch {
  // Diff failed — fail open to a full build.
  finish(1);
}

if (changedFiles.length === 0) {
  finish(0);
}

const FORCE_BUILD =
  /^(src\/|messages\/|package\.json$|package-lock\.json$|next\.config\.|tsconfig\.|public\/(?!ai-)|scripts\/(?!\.cache\/))/;

const SKIP_ONLY =
  /^(docs\/|README|scripts\/\.cache\/)/;

const allSkipEligible = changedFiles.every(
  (file) => SKIP_ONLY.test(file) || file.startsWith("README"),
);

const anyForceBuild = changedFiles.some((file) => FORCE_BUILD.test(file));

if (anyForceBuild) {
  finish(1);
}

if (allSkipEligible) {
  console.log(
    `ignore-build: skip — changed files are docs/README/cache only (${changedFiles.length} files)`,
  );
  finish(0);
}

// Unknown paths — default to building.
console.log(`ignore-build: build — unclassified changes (${changedFiles.length} files)`);
finish(1);
