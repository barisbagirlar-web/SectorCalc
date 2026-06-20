#!/usr/bin/env node
/**
 * Stub formula audit — detect tools with product-chain placeholders.
 *
 * Usage:
 *   node scripts/audit/audit-stub-formulas.mjs
 *   node scripts/audit/audit-stub-formulas.mjs --premium-only
 *   node scripts/audit/audit-stub-formulas.mjs --json
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..", "..");
const SCHEMAS_DIR = join(ROOT, "generated", "schemas");

function isProductChainStub(formulas) {
  const expressions = Object.values(formulas).filter((v) => typeof v === "string");
  if (expressions.length === 0) return true;
  return expressions.every((expr) => {
    const hasStubMarker = expr.includes("normalized_product") || expr.includes("adjustment_factor");
    const isBareMult =
      /^[\w\s*()]+$/.test(expr) &&
      !expr.includes("+") &&
      !expr.includes("/") &&
      !expr.includes("Math.") &&
      !expr.includes("**") &&
      expr.split("*").length >= 2;
    return hasStubMarker || isBareMult;
  });
}

const premiumOnly = process.argv.includes("--premium-only");
const outputJson = process.argv.includes("--json");

const files = readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith("-schema.json"));
const stubs = [];
let totalPremium = 0;
let totalFree = 0;
let stubPremium = 0;
let stubFree = 0;

for (const f of files) {
  const raw = JSON.parse(readFileSync(join(SCHEMAS_DIR, f), "utf8"));
  const isPremium = raw.premiumRequired === true;
  if (isPremium) totalPremium++;
  else totalFree++;

  if (premiumOnly && !isPremium) continue;

  const formulas = raw.formulas ?? {};
  if (Object.keys(formulas).length === 0 || isProductChainStub(formulas)) {
    const slug = f.replace("-schema.json", "");
    stubs.push({ slug, premium: isPremium, formulas: Object.keys(formulas) });
    if (isPremium) stubPremium++;
    else stubFree++;
  }
}

if (outputJson) {
  console.log(JSON.stringify({ total: stubs.length, stubs, premium: stubPremium, free: stubFree }, null, 2));
  process.exit(stubPremium > 0 ? 1 : 0);
}

console.log("=== STUB FORMULA AUDIT ===");
console.log(`Premium: ${stubPremium}/${totalPremium} stub`);
console.log(`Free:    ${stubFree}/${totalFree} stub`);
console.log(`Total:   ${stubs.length}/${files.length} stub\n`);

if (stubs.length > 0) {
  console.log("Stub list:");
  for (const s of stubs.slice(0, 30)) {
    console.log(`  ${s.premium ? "★" : " "} ${s.slug} (${s.formulas.length} formulas)`);
  }
  if (stubs.length > 30) console.log(`  ... and ${stubs.length - 30} more`);
  console.log("");
}

const exitCode = premiumOnly ? (stubPremium > 0 ? 1 : 0) : (stubs.length > 0 ? 0 : 0);
// Report is informational — only fail on premium stubs
process.exit(exitCode);
