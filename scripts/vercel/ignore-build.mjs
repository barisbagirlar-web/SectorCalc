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
function finish(code, message) {
  console.log(message);
  process.exit(code);
}

// Production must always build — never skip a prod deploy.
if (process.env.VERCEL_ENV === "production") {
  finish(1, "ignore-build: build required — production deploy");
}

const previousSha = process.env.VERCEL_GIT_PREVIOUS_SHA?.trim();
const currentSha = process.env.VERCEL_GIT_COMMIT_SHA?.trim();

/** @type {string[]} */
let changedFiles = [];

try {
  if (previousSha && currentSha) {
    const output = execSync(`git diff --name-only ${previousSha} ${currentSha}`, {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    changedFiles = output.split("\n").map((line) => line.trim()).filter(Boolean);
  } else {
    finish(1, "ignore-build: build required — missing git SHAs");
  }
} catch {
  finish(1, "ignore-build: build required — git diff failed");
}

if (changedFiles.length === 0) {
  finish(0, "ignore-build: skip — no changed files");
}

/** @param {string} file */
function isDocsOnlyFile(file) {
  return (
    file.startsWith("docs/") ||
    file === "README" ||
    file.startsWith("README.") ||
    file.endsWith(".md")
  );
}

/** @param {string} file */
function requiresBuild(file) {
  return (
    file.startsWith("src/") ||
    file.startsWith("app/") ||
    file === "package.json" ||
    file === "package-lock.json" ||
    file.startsWith("next.config.") ||
    file.startsWith("tsconfig.") ||
    file.startsWith("messages/") ||
    file.startsWith("generated/") ||
    file.startsWith("scripts/") ||
    file.startsWith("public/")
  );
}

const buildRequired = changedFiles.some(requiresBuild);

if (buildRequired) {
  finish(
    1,
    `ignore-build: build required — application/config/public changes (${changedFiles.length} files)`,
  );
}

const allDocsOnly = changedFiles.every(isDocsOnlyFile);

if (allDocsOnly) {
  finish(
    0,
    `ignore-build: skip — docs/README/markdown only (${changedFiles.length} files)`,
  );
}

finish(
  1,
  `ignore-build: build required — unclassified changes (${changedFiles.length} files)`,
);
