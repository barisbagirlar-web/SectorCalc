#!/usr/bin/env node
/**
 * Fail-closed release guard for certification-derived public execution lists.
 * Literal runtime allowlists are forbidden: certification catalogs are the
 * only source of truth for both Free and Pro execution eligibility.
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const files = {
  allowlist: "src/sectorcalc/runtime/active-tool-allowlist.ts",
  free: "src/sectorcalc/formulas/free-v531/free-formula-verification-manifest.ts",
  pro: "src/sectorcalc/formulas/pro-v531/pro-certified-tool-keys.ts",
};
let exitCode = 0;

function fail(message) {
  console.error("  FAIL " + message);
  exitCode = 1;
}

function pass(message) {
  console.log("  PASS " + message);
}

function read(relativePath) {
  const absolutePath = path.join(ROOT, relativePath);
  if (!fs.existsSync(absolutePath)) {
    fail("Required certification file not found: " + relativePath);
    return "";
  }
  return fs.readFileSync(absolutePath, "utf8");
}

function duplicates(values) {
  const seen = new Set();
  const repeated = new Set();
  for (const value of values) {
    if (seen.has(value)) repeated.add(value);
    seen.add(value);
  }
  return [...repeated];
}

console.log("\nV5.4 Core - Certification-derived active tool guard\n");
const allowlist = read(files.allowlist);
const freeManifest = read(files.free);
const proCatalog = read(files.pro);

const freeBinding = /ACTIVE_FREE_TOOL_SLUGS:\s*readonly\s*string\[\]\s*=\s*CERTIFIED_FREE_TOOL_SLUGS\s*;/.test(allowlist);
const proBinding = /ACTIVE_PRO_TOOL_SLUGS:\s*readonly\s*string\[\]\s*=\s*CERTIFIED_PRO_TOOL_SLUGS\s*;/.test(allowlist);
if (!freeBinding) fail("ACTIVE_FREE_TOOL_SLUGS must be assigned directly from CERTIFIED_FREE_TOOL_SLUGS.");
else pass("Free execution allowlist is certification-derived.");
if (!proBinding) fail("ACTIVE_PRO_TOOL_SLUGS must be assigned directly from CERTIFIED_PRO_TOOL_SLUGS.");
else pass("Pro execution allowlist is certification-derived.");

const freeRecordsBlock = freeManifest.match(/const records:[\s\S]*?=\s*\[([\s\S]*?)\n\];/);
const freeSlugs = freeRecordsBlock
  ? [...freeRecordsBlock[1].matchAll(/^\s*\[\s*"([^"]+)"/gm)].map((match) => match[1])
  : [];
const proArrayBlock = proCatalog.match(/CERTIFIED_PRO_TOOL_SLUGS:[\s\S]*?Object\.freeze\(\[([\s\S]*?)\]\);/);
const proSlugs = proArrayBlock
  ? [...proArrayBlock[1].matchAll(/^\s*"([^"]+)"/gm)].map((match) => match[1])
  : [];

if (freeSlugs.length !== 50) fail("Expected 50 certified Free tools, found " + freeSlugs.length + ".");
else pass("Certified Free inventory is complete (50/50).");
if (proSlugs.length !== 20) fail("Expected 20 certified instant Pro tools, found " + proSlugs.length + ".");
else pass("Certified Pro inventory is complete (20/20).");

const invalid = [...freeSlugs, ...proSlugs].filter(
  (slug) => slug.length === 0 || slug.trim() !== slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug),
);
if (invalid.length > 0) fail("Invalid canonical slug(s): " + invalid.join(", "));
else pass("Every certified slug is non-empty and canonical.");

const withinTierDuplicates = [...duplicates(freeSlugs), ...duplicates(proSlugs)];
if (withinTierDuplicates.length > 0) fail("Duplicate certified slug(s): " + withinTierDuplicates.join(", "));
else pass("No duplicate slugs within certification catalogs.");

const freeSet = new Set(freeSlugs);
const crossTierDuplicates = proSlugs.filter((slug) => freeSet.has(slug));
if (crossTierDuplicates.length > 0) fail("Cross-tier slug collision(s): " + crossTierDuplicates.join(", "));
else pass("No cross-tier execution slug collisions.");

console.log("\n" + (exitCode === 0 ? "PASS" : "FAIL") + " - Active tool certification guard\n");
process.exit(exitCode);
