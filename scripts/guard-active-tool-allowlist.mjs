#!/usr/bin/env node
/**
 * scripts/guard-active-tool-allowlist.mjs
 *
 * V5.4 Core guard: validate active tool allowlist.
 *
 * Required behavior:
 *   - ACTIVE_FREE_TOOL_SLUGS must have at least 1 entry
 *   - ACTIVE_PRO_TOOL_SLUGS must have at most 1 entry
 *   - All slugs must be non-empty strings
 *   - No duplicate slugs across free and pro lists
 *
 * Exit: 0 = PASS, 1 = FAIL
 */

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
let exitCode = 0;

function fail(msg) {
  console.error(`  ❌ ${msg}`);
  exitCode = 1;
}

function pass(msg) {
  console.log(`  ✅ ${msg}`);
}

console.log("\n🔍 V5.4 Core — Active Tool Allowlist Guard\n");

// ── Parse the allowlist file ──────────────────────────────────────────────
const ALLOWLIST_PATH = path.join(ROOT, "src/sectorcalc/runtime/active-tool-allowlist.ts");

if (!fs.existsSync(ALLOWLIST_PATH)) {
  fail(`Allowlist file not found: ${ALLOWLIST_PATH}`);
  process.exit(1);
}

const content = fs.readFileSync(ALLOWLIST_PATH, "utf-8");

// Extract ACTIVE_FREE_TOOL_SLUGS array
const freeMatch = content.match(/ACTIVE_FREE_TOOL_SLUGS:\s*readonly\s*string\[\]\s*=\s*\[([\s\S]*?)\];/);
const proMatch = content.match(/ACTIVE_PRO_TOOL_SLUGS:\s*readonly\s*string\[\]\s*=\s*\[([\s\S]*?)\];/);

if (!freeMatch) {
  fail("ACTIVE_FREE_TOOL_SLUGS declaration not found in allowlist");
} else {
  const freeSlugs = freeMatch[1]
    .split(",")
    .map((s) => s.trim().replace(/^"|"$/g, "").replace(/^'|'$/g, ""))
    .filter(Boolean);

  pass(`Free tool allowlist parsed (${freeSlugs.length} entries)`);

  if (freeSlugs.length < 1) {
    fail(`Expected at least 1 active Free tool, found ${freeSlugs.length}`);
  } else {
    pass(`Active Free tools (${freeSlugs.length}): "${freeSlugs[0]}" …`);
  }

  for (const slug of freeSlugs) {
    if (!slug) {
      fail("Empty slug found in ACTIVE_FREE_TOOL_SLUGS");
    }
  }
}

if (!proMatch) {
  fail("ACTIVE_PRO_TOOL_SLUGS declaration not found in allowlist");
} else {
  const proSlugs = proMatch[1]
    .split(",")
    .map((s) => s.trim().replace(/^"|"$/g, "").replace(/^'|'$/g, ""))
    .filter(Boolean);

  pass(`Pro tool allowlist parsed (${proSlugs.length} entries)`);

  if (proSlugs.length === 0) {
    pass(`No active Pro tools — all 135 Pro formula modules are generic templates`);
  } else if (proSlugs.length === 1) {
    pass(`Active Pro tool: "${proSlugs[0]}"`);
  } else {
    fail(`Expected 0 or 1 active Pro tool, found ${proSlugs.length}`);
  }

  for (const slug of proSlugs) {
    if (!slug) {
      fail("Empty slug found in ACTIVE_PRO_TOOL_SLUGS");
    }
  }
}

// ── Check for duplicates ──────────────────────────────────────────────────
if (freeMatch && proMatch) {
  const freeSlugs = freeMatch[1]
    .split(",").map((s) => s.trim().replace(/^"|"$/g, "").replace(/^'|'$/g, "")).filter(Boolean);
  const proSlugs = proMatch[1]
    .split(",").map((s) => s.trim().replace(/^"|"$/g, "").replace(/^'|'$/g, "")).filter(Boolean);
  const allSlugs = [...freeSlugs, ...proSlugs];
  const uniqueSlugs = new Set(allSlugs);
  if (uniqueSlugs.size !== allSlugs.length) {
    fail("Duplicate slug detected across Free and Pro allowlists");
  } else {
    pass("No duplicate slugs across allowlists");
  }
}

console.log(`\n${exitCode === 0 ? "✅ PASS" : "❌ FAIL"} — Active tool allowlist guard\n`);
process.exit(exitCode);
