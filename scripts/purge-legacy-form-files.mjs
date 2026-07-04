#!/usr/bin/env node

import { existsSync, readFileSync } from "node:fs";
import { join, extname, basename } from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const APPLY = process.argv.includes("--apply");

const LEGACY_FILES = [
  "src/components/tools/FreeToolPage.tsx",
  "src/components/tools/FreeToolPremiumCalculator.tsx",
  "src/styles/free-tool-form.css",
  "src/styles/free-tool-premium.css",
  "src/components/tools/PremiumSchemaToolForm.tsx",
  "src/components/tools/FreeToolForm.tsx",
  "src/components/tools/ProToolForm.tsx",
  "src/components/tools/LegacyCalculatorForm.tsx",
];

function run(command, args) {
  return execFileSync(command, args, {
    cwd: ROOT,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  }).trim();
}

function exists(file) {
  return existsSync(join(ROOT, file));
}

function isCssFile(file) {
  return extname(file) === ".css";
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function grepRefs(file) {
  const base = basename(file).replace(/\.[^.]+$/, "");
  const tokens = [file];

  // For non-CSS files, also check component/identifier name
  // (basename may match false positives like "free-tool-form" in "free-tool-form-i18n")
  if (!isCssFile(file)) {
    tokens.push(base);
  }

  const refs = [];

  const files = run("git", ["ls-files"])
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((tracked) => {
      if (tracked === file) return false;
      return [".ts", ".tsx", ".js", ".jsx", ".css", ".json"].includes(extname(tracked));
    });

  for (const tracked of files) {
    const text = readFileSync(join(ROOT, tracked), "utf8");
    for (const token of tokens) {
      // Use boundary-aware matching to avoid false positives:
      // For file paths, do exact substring match (import paths contain the full path)
      if (text.includes(token)) {
        refs.push(`${tracked}: references ${token}`);
      }
    }
    // For CSS files, check for concrete CSS import patterns (full path with .css extension)
    if (isCssFile(file)) {
      const cssExtPattern = new RegExp(
        `["'\`][^"'\`]*${escapeRegExp(file)}["'\`]`,
      );
      if (cssExtPattern.test(text)) {
        const alreadyReported = refs.some((r) => r.startsWith(tracked));
        if (!alreadyReported) {
          refs.push(`${tracked}: references ${file} (CSS import)`);
        }
      }
    }
  }

  return refs;
}

const existing = LEGACY_FILES.filter(exists);
const blockers = [];

for (const file of existing) {
  const refs = grepRefs(file);
  if (refs.length > 0) {
    blockers.push(`${file} is still referenced:`);
    blockers.push(...refs.map((ref) => `  - ${ref}`));
  }
}

if (blockers.length > 0) {
  console.error("LEGACY_FORM_PURGE=BLOCKED");
  for (const blocker of blockers) console.error(blocker);
  process.exit(1);
}

if (!APPLY) {
  console.log("LEGACY_FORM_PURGE=DRY_RUN");
  console.log(`existing_legacy_files=${existing.length}`);
  for (const file of existing) console.log(`- ${file}`);
  console.log("");
  console.log("Run with --apply to delete these files.");
  process.exit(0);
}

for (const file of existing) {
  run("git", ["rm", "-f", file]);
}

console.log("LEGACY_FORM_PURGE=PASS");
console.log(`deleted_files=${existing.length}`);
for (const file of existing) console.log(`- ${file}`);
