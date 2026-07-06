#!/usr/bin/env node
import fs from "node:fs";
import crypto from "node:crypto";

const manifestPath = "tests/golden/free-v531-package.manifest.json";

const allowedPrefixes = [
  "package.json",
  "package-lock.json",
  "scripts/run-golden-tests.ts",
  "scripts/guard-free-v531-formula-line-count.mjs",
  "scripts/guard-free-v531-formula-safety.mjs",
  "src/sectorcalc/formulas/free-v531/",
  "tests/golden/free-v531/",
  "tests/golden/hashes/free-v531/"
];

function sha256(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function allowedPath(filePath) {
  return allowedPrefixes.some((prefix) => filePath === prefix || filePath.startsWith(prefix));
}

function fail(report) {
  console.log("FREE_V531_PACKAGE_MANIFEST_GUARD=FAIL");
  console.log(`FILES_CHECKED=${report.filesChecked}`);
  console.log(`MISSING=${report.missing.length}`);
  console.log(`SHA_MISMATCH=${report.shaMismatch.length}`);
  console.log(`DISALLOWED=${report.disallowed.length}`);
  console.log(`DUPLICATE=${report.duplicate.length}`);
  console.log("BLOCKERS:");
  for (const item of [...report.missing, ...report.shaMismatch, ...report.disallowed, ...report.duplicate]) {
    console.log(`- ${item}`);
  }
  process.exit(1);
}

const report = {
  filesChecked: 0,
  missing: [],
  shaMismatch: [],
  disallowed: [],
  duplicate: []
};

if (!fs.existsSync(manifestPath)) {
  report.missing.push(manifestPath);
  fail(report);
}

const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

if (!manifest || !Array.isArray(manifest.files)) {
  report.missing.push(`${manifestPath}: invalid manifest.files`);
  fail(report);
}

const seen = new Set();

for (const entry of manifest.files) {
  if (!entry || typeof entry.path !== "string" || typeof entry.sha256 !== "string") {
    report.missing.push(`${manifestPath}: invalid manifest entry`);
    continue;
  }

  if (seen.has(entry.path)) {
    report.duplicate.push(entry.path);
    continue;
  }

  seen.add(entry.path);

  if (!allowedPath(entry.path)) {
    report.disallowed.push(entry.path);
    continue;
  }

  if (!fs.existsSync(entry.path)) {
    report.missing.push(entry.path);
    continue;
  }

  const actual = sha256(entry.path);
  report.filesChecked += 1;

  if (actual !== entry.sha256) {
    report.shaMismatch.push(`${entry.path}: expected ${entry.sha256}, actual ${actual}`);
  }
}

const formulaCount = manifest.files.filter((entry) => /^src\/sectorcalc\/formulas\/free-v531\/.*\.formula\.ts$/.test(entry.path)).length;
const goldenCount = manifest.files.filter((entry) => /^tests\/golden\/free-v531\/.*\.golden\.json$/.test(entry.path)).length;
const hashCount = manifest.files.filter((entry) => /^tests\/golden\/hashes\/free-v531\/.*\.hashes\.json$/.test(entry.path)).length;

if (formulaCount !== 50) report.missing.push(`formula file count expected 50, actual ${formulaCount}`);
if (goldenCount !== 50) report.missing.push(`golden fixture count expected 50, actual ${goldenCount}`);
if (hashCount !== 50) report.missing.push(`golden hash count expected 50, actual ${hashCount}`);

if (report.missing.length || report.shaMismatch.length || report.disallowed.length || report.duplicate.length) {
  fail(report);
}

console.log("FREE_V531_PACKAGE_MANIFEST_GUARD=PASS");
console.log(`FILES_CHECKED=${report.filesChecked}`);
console.log("MISSING=0");
console.log("SHA_MISMATCH=0");
console.log("DISALLOWED=0");
console.log("DUPLICATE=0");
console.log(`FORMULA_COUNT=${formulaCount}`);
console.log(`GOLDEN_COUNT=${goldenCount}`);
console.log(`HASH_COUNT=${hashCount}`);
console.log("BLOCKERS=NONE");
