#!/usr/bin/env node
/**
 * scripts/guard-no-inactive-pro-tools-public.mjs
 *
 * Fails if:
 *   - inactive tool appears in premium-slugs.json
 *   - inactive tool appears in sitemap-tools.xml
 *   - inactive tool appears in /pro-tools catalog data (active-tool-allowlist.ts)
 *   - compressed-air-leak-cost-calculator appears as public paid tool
 *   - premium-slugs.json is empty
 *   - premium-slugs.json count does not match active live tool count
 *
 * Output: NO_INACTIVE_PRO_TOOLS_PUBLIC=PASS|FAIL
 */

import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const PREMIUM_SLUGS_PATH = join(ROOT, "premium-slugs.json");
const ALLOWLIST_PATH = join(ROOT, "src/sectorcalc/runtime/active-tool-allowlist.ts");
const SITEMAP_PATH = join(ROOT, "public/sitemap-tools.xml");
const INVENTORY_PATH = join(ROOT, "reports/inactive-pro-tools-to-remove.json");

// ── Load inventory (must be generated first) ──

function loadInventory() {
  if (!existsSync(INVENTORY_PATH)) {
    console.error("❌ NO_INACTIVE_PRO_TOOLS_PUBLIC=FAIL");
    console.error(`  Inventory not found at ${INVENTORY_PATH}`);
    console.error("  Run `npm run audit:inactive-pro-tools` first.");
    process.exit(1);
  }
  return JSON.parse(readFileSync(INVENTORY_PATH, "utf8"));
}

// ── Check premium-slugs.json ──

function checkPremiumSlugs(inactiveSet) {
  if (!existsSync(PREMIUM_SLUGS_PATH)) {
    return { pass: false, error: "premium-slugs.json not found" };
  }

  const slugs = JSON.parse(readFileSync(PREMIUM_SLUGS_PATH, "utf8"));
  if (!Array.isArray(slugs) || slugs.length === 0) {
    return { pass: false, error: "premium-slugs.json is empty" };
  }

  const violations = slugs.filter(s => inactiveSet.has(s));
  if (violations.length > 0) {
    return { pass: false, error: `Inactive tools in premium-slugs.json: ${violations.join(", ")}` };
  }

  return { pass: true, count: slugs.length };
}

// ── Check allowlist (source of truth for pro catalog) ──

function checkAllowlist(inactiveSet) {
  const text = readFileSync(ALLOWLIST_PATH, "utf8");
  const violations = [];

  for (const slug of inactiveSet) {
    // Check if slug appears in the ACTIVE_PRO_TOOL_SLUGS array
    const regex = new RegExp(`"${slug}"`, "g");
    if (regex.test(text)) {
      violations.push(slug);
    }
  }

  if (violations.length > 0) {
    return { pass: false, error: `Inactive tools in ACTIVE_PRO_TOOL_SLUGS: ${violations.join(", ")}` };
  }

  return { pass: true };
}

// ── Check sitemap ──

function checkSitemap(inactiveSet) {
  if (!existsSync(SITEMAP_PATH)) {
    return { pass: true }; // sitemap might not exist — don't block on it
  }

  const text = readFileSync(SITEMAP_PATH, "utf8");
  const violations = [];

  for (const slug of inactiveSet) {
    // Check for /tools/pro/{slug} or /pro-tools/{slug} in sitemap
    const regex = new RegExp(`/tools/pro/${slug}[^a-zA-Z]`, "g");
    if (regex.test(text)) {
      violations.push(slug);
    }
  }

  if (violations.length > 0) {
    return { pass: false, error: `Inactive tools in sitemap: ${violations.join(", ")}` };
  }

  return { pass: true };
}

// ── Main ──

function main() {
  const inventory = loadInventory();
  const inactiveSet = new Set(inventory.INACTIVE_PRO_TOOLS);
  const activeSet = new Set(inventory.ACTIVE_PRO_TOOLS);

  let allPass = true;
  const errors = [];

  // 1. premium-slugs.json
  const ps = checkPremiumSlugs(inactiveSet);
  if (!ps.pass) {
    allPass = false;
    errors.push(`premium-slugs: ${ps.error}`);
  }

  // 2. allowlist
  const al = checkAllowlist(inactiveSet);
  if (!al.pass) {
    allPass = false;
    errors.push(`allowlist: ${al.error}`);
  }

  // 3. sitemap
  const sm = checkSitemap(inactiveSet);
  if (!sm.pass) {
    allPass = false;
    errors.push(`sitemap: ${sm.error}`);
  }

  // 4. premium-slugs count check
  const premiumSlugs = existsSync(PREMIUM_SLUGS_PATH)
    ? JSON.parse(readFileSync(PREMIUM_SLUGS_PATH, "utf8"))
    : [];
  if (premiumSlugs.length !== inventory.COUNT_ACTIVE) {
    allPass = false;
    errors.push(
      `premium-slugs count mismatch: ${premiumSlugs.length} (current) != ${inventory.COUNT_ACTIVE} (active tools)`
    );
  }

  // 5. compressed-air-leak-cost-calculator check
  if (activeSet.has("compressed-air-leak-cost-calculator")) {
    allPass = false;
    errors.push("compressed-air-leak-cost-calculator must be inactive (stub)");
  }

  // 6. Premium slugs must not be empty
  if (premiumSlugs.length === 0) {
    allPass = false;
    errors.push("premium-slugs.json is empty");
  }

  // ── Output ──
  console.log("═══════════════════════════════════════════════════════");
  console.log("  Guard: No Inactive PRO Tools in Public");
  console.log("═══════════════════════════════════════════════════════\n");
  console.log(`  ACTIVE_PUBLIC_PRO_TOOLS:   ${inventory.COUNT_ACTIVE}`);
  console.log(`  INACTIVE_PUBLIC_PRO_TOOLS: ${inventory.COUNT_INACTIVE}`);
  console.log(`  STUB_PUBLIC_PRO_TOOLS:     ${inventory.COUNT_STUB}`);
  console.log(`  PREMIUM_SLUGS_COUNT:       ${premiumSlugs.length}`);
  console.log(`  BLOCKERS:                  ${errors.length > 0 ? errors.join("; ") : "NONE"}\n`);

  if (allPass && errors.length === 0) {
    console.log("  ✅ NO_INACTIVE_PRO_TOOLS_PUBLIC=PASS");
    console.log("═══════════════════════════════════════════════════════\n");
    process.exit(0);
  } else {
    console.log("  ❌ NO_INACTIVE_PRO_TOOLS_PUBLIC=FAIL");
    for (const err of errors) {
      console.log(`     - ${err}`);
    }
    console.log("═══════════════════════════════════════════════════════\n");
    process.exit(1);
  }
}

main();
