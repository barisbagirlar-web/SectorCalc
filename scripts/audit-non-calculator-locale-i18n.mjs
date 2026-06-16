#!/usr/bin/env node
/**
 * CI gate: non-calculator surfaces must not leak English copy on tr/de/fr/es/ar.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["tr", "de", "fr", "es", "ar"];

const CALC_ROOTS = new Set([
  "freeToolInputs",
  "freeToolUi",
  "smartForm",
  "calculator",
  "premiumSchema",
  "toolDefinitions",
  "reports",
  "seoPages",
  "freeTrafficCatalog",
]);

const COGNATES = new Set([
  "SectorCalc",
  "SECTORCALC",
  "OEE",
  "EOQ",
  "ERP",
  "PDF",
  "CSV",
  "API",
  "PRO",
  "kWh",
  "CBAM",
  "VAT",
  "LLMs",
  "USD",
  "EUR",
  "TRY",
  "IN",
  "Stripe",
  "P90",
  "MarginCore",
  "llms.txt",
  "sectorcalc-index.txt",
  "faq-knowledge.txt",
  "services-products.txt",
  "Premium",
  "Enterprise",
  "Free",
  "Pro",
  "Team",
  "Feature",
  "Español",
  "Deutsch",
  "Français",
  "Türkiye",
  "{region} · {currency}",
  "REG: GLOBAL",
  "© 2026 SECTORCALC",
  "© 2026 SectorCalc",
  "FREE + PREMIUM",
  "27 LIVE",
  "MarginCore · Phase 2",
  "Global · USD",
  "Prof. Dr. Neela Nataraj",
  "ASME BPVC",
  "ASTM / AISI",
  "ASME Y14.5",
]);

const ENGLISH_LEAK = /\b(the|and|with|what is|required|your|for|from|this|that|how|when|where|sign in|go to|return to|loading|calculate|resources|categories|reports|account|archive|pricing|checkout|waitlist|forever|baseline|verdict|deterministic|confidence|complete|updated|construction|logistics|industries|sectors|intelligence|utilities|waitlist)\b/i;

function leaves(obj, path = []) {
  if (typeof obj === "string") return [{ path: path.join("."), v: obj }];
  if (Array.isArray(obj)) return obj.flatMap((x, i) => leaves(x, [...path, String(i)]));
  if (obj && typeof obj === "object") {
    return Object.entries(obj).flatMap(([k, v]) => leaves(v, [...path, k]));
  }
  return [];
}

function getAt(obj, path) {
  let cur = obj;
  for (const p of path.split(".")) {
    cur = cur?.[p];
  }
  return cur;
}

function isAllowedIdentical(enValue, path = "") {
  if (!enValue || enValue.length <= 3) return true;
  if (COGNATES.has(enValue)) return true;
  if (path.endsWith("Tr") || path.includes(".Tr")) return true;
  if (/^[A-Z0-9_./:?=&+\-{}$,%·|]+$/i.test(enValue)) return true;
  if (!/[a-zA-Z]{4,}/.test(enValue)) return true;
  if (/^Phase \{phase\}$/.test(enValue)) return true;
  return false;
}

const en = JSON.parse(readFileSync(join(ROOT, "messages/en.json"), "utf8"));
const enLeaves = leaves(en).filter(({ path }) => !CALC_ROOTS.has(path.split(".")[0]));

const failures = [];
let maxIdenticalPct = 0;

for (const locale of LOCALES) {
  const data = JSON.parse(readFileSync(join(ROOT, "messages", `${locale}.json`), "utf8"));
  let identical = 0;
  let total = 0;
  for (const { path, v: enValue } of enLeaves) {
    const cur = getAt(data, path);
    if (typeof cur !== "string") continue;
    total += 1;
    if (cur === enValue && !isAllowedIdentical(enValue, path)) {
      identical += 1;
      if (failures.length < 40) {
        failures.push(`${locale}: ${path} → "${enValue.slice(0, 70)}"`);
      }
    }
  }
  const pct = total > 0 ? (identical / total) * 100 : 0;
  maxIdenticalPct = Math.max(maxIdenticalPct, pct);
  console.log(`${locale}: ${identical}/${total} EN-identical (${pct.toFixed(1)}%)`);
}

console.log("audit:non-calculator-locale-i18n");
const threshold = 1.5;
if (failures.length === 0 && maxIdenticalPct <= threshold) {
  console.log("PASS — non-calculator locale surfaces OK");
  process.exit(0);
}

console.log(`FAIL — ${failures.length} issue(s), max identical ${maxIdenticalPct.toFixed(1)}% (limit ${threshold}%)`);
for (const line of failures.slice(0, 50)) {
  console.log(`  - ${line}`);
}
process.exit(1);
