#!/usr/bin/env node
/**
 * Builds scripts/data/marketing-surface-rows.json — 647 en -> [ar, de, fr, es]
 * Run: node scripts/build-marketing-surface-rows.mjs
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";

const ROOT = join(dirname(import.meta.filename), "..");
const need = JSON.parse(
  readFileSync(join(ROOT, "scripts/data/_need-rows.json"), "utf8"),
);
const q = JSON.parse(
  readFileSync(join(ROOT, "scripts/data/marketing-translation-queue.json"), "utf8"),
);
const deMsg = JSON.parse(readFileSync(join(ROOT, "messages/de.json"), "utf8"));
const frMsg = JSON.parse(readFileSync(join(ROOT, "messages/fr.json"), "utf8"));
const esMsg = JSON.parse(readFileSync(join(ROOT, "messages/es.json"), "utf8"));

const handPath = join(dirname(import.meta.filename), "data/marketing-surface-hand-rows.json");
/** @type {Record<string, [string, string, string, string]>} */
const HAND = existsSync(handPath)
  ? JSON.parse(readFileSync(handPath, "utf8"))
  : {};

const BRANDS = [
  "SectorCalc", "OEE", "EOQ", "ERP", "PDF", "CSV", "API", "PRO", "kWh", "CBAM", "VAT", "LLMs",
  "MarginCore", "Stripe", "Firebase", "Firestore", "Google", "Industrial OS", "P90", "CNC",
  "USD", "EUR", "TRY", "SECTORCALC", "U-Engine", "llms.txt", "sectorcalc-index.txt",
  "faq-knowledge.txt", "services-products.txt", "MENA", "Türkiye", "LLMS", "SMEs", "SME",
];

const KEEP = new Set([
  ...BRANDS,
  "Premium", "Enterprise", "Baseline", "English", "Español", "Deutsch", "Français",
  "FREE + PREMIUM", "Parasal kayıp", "Malzeme kaybı", "Zaman kaybı", "Enerji kaybı",
  "Global", "Global · USD", "{region} · {currency}", "Imperial", "Risk", "Problem",
  "REG: GLOBAL", "© 2026 SECTORCALC", "Audit archive", "for your sector.", "Auto (by language)",
  "Deterministic", "Verdict", "Checkout", "Business", "Feature", "Confidence", "Construction",
  "Industry", "Logistics", "Engine", "Monitor", "Complete", "Comment", "Country", "Dismiss",
  "Loading...", "Locale", "Metric", "Mixed", "Message", "Medium", "Kind", "Value", "Volume",
  "Warning", "Usefulness", "Utilities", "Free + Pro", "Free vs Pro", "DO NOT ACCEPT UNDER $1,840",
  "Germany · EUR", "27 LIVE", "CNC Audit Engine", "Master Audit Engine",
  "MarginCore · Phase 2", "MarginCore Pilot · CNC Manufacturing",
  "MarginCore — Professional Risk Analytics for SMEs",
  "MarginCore: Professional Risk Analytics for SMEs.",
]);

function getAt(obj, path) {
  let cur = obj;
  for (const p of path.split(".")) cur = cur?.[p];
  return typeof cur === "string" ? cur : null;
}

const pathsByEn = new Map();
for (const item of q) {
  if (!pathsByEn.has(item.en)) pathsByEn.set(item.en, []);
  pathsByEn.get(item.en).push(item.path);
}

function bestMsg(en, msg) {
  const cands = (pathsByEn.get(en) ?? [])
    .map((p) => getAt(msg, p))
    .filter((v) => v && v !== en);
  return cands.sort((a, b) => b.length - a.length)[0] ?? "";
}

const BAD_FR =
  /\b(der|die|das|und|für|mit|Rechner|Bericht|Gratis|Tägliche|Mehrplatz|Unbegrenzter|Beliebteste|Formelübersicht|Autoritätsleitfaden|Ist dieser|So funktioniert dieser|Branchenrechner durchsuchen|Paramètres)\b/i;
const BAD_DE = /\b(le |la |les |des |une |pour |avec |Calculateur)\b/i;
const BAD_ES = /\b(der |die |Rechner|Bericht|Gratis|Tägliche|Naive machine|Stochastic|Job inputs)\b/i;

function bad(v, en, loc) {
  if (!v || v === en) return true;
  if (["Naive machine cost", "Stochastic P90 verdict", "Job inputs"].includes(v)) return true;
  if (loc === "fr" && BAD_FR.test(v)) return true;
  if (loc === "de" && BAD_DE.test(v) && !/\b(CNC|PDF|CSV|ERP|Pro|SectorCalc)\b/.test(v)) return true;
  if (loc === "es" && BAD_ES.test(v)) return true;
  return false;
}

function pick(en, loc, itemVal, msg) {
  if (itemVal && !bad(itemVal, en, loc)) return itemVal;
  const msgVal = bestMsg(en, msg);
  if (msgVal && !bad(msgVal, en, loc)) return msgVal;
  return "";
}

const ROWS = {};
const missingHand = [];

for (const item of need) {
  const en = item.en;
  if (HAND[en]) {
    ROWS[en] = HAND[en];
    continue;
  }
  missingHand.push(en);
}

if (missingHand.length) {
  console.error("Missing HAND rows:", missingHand.length);
  missingHand.slice(0, 20).forEach((s) => console.error(" -", s));
  process.exit(1);
}

const outPath = join(ROOT, "scripts/data/marketing-surface-rows.json");
writeFileSync(outPath, `${JSON.stringify(ROWS, null, 2)}\n`);
console.log("Written:", outPath);
console.log("Keys:", Object.keys(ROWS).length);
