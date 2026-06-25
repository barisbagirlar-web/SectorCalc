#!/usr/bin/env node
/**
 * Generates scripts/data/marketing-surface-overrides.json — complete [ar,de,fr,es] per en key.
 * Run: node scripts/generate-overrides.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";

const ROOT = join(dirname(import.meta.filename), "..");
const need = JSON.parse(readFileSync(join(ROOT, "scripts/data/_need-rows.json"), "utf8"));
const q = JSON.parse(readFileSync(join(ROOT, "scripts/data/marketing-translation-queue.json"), "utf8"));
const deMsg = JSON.parse(readFileSync(join(ROOT, "messages/de.json"), "utf8"));
const frMsg = JSON.parse(readFileSync(join(ROOT, "messages/fr.json"), "utf8"));
const esMsg = JSON.parse(readFileSync(join(ROOT, "messages/es.json"), "utf8"));
const cur = JSON.parse(readFileSync(join(ROOT, "scripts/data/marketing-surface-rows.json"), "utf8"));

const BRANDS = [
  "SectorCalc", "OEE", "EOQ", "ERP", "PDF", "CSV", "API", "PRO", "kWh", "CBAM", "VAT", "LLMs",
  "MarginCore", "Stripe", "Firebase", "Firestore", "Google", "Industrial OS", "P90", "CNC",
  "USD", "EUR", "TRY", "SECTORCALC", "U-Engine", "llms.txt", "sectorcalc-index.txt",
  "faq-knowledge.txt", "services-products.txt", "MENA", "Türkiye", "LLMS", "SMEs", "SME",
];
const KEEP = new Set([
  ...BRANDS,
  "Premium", "Enterprise", "Baseline", "English", "Español", "Deutsch", "Français",
  "FREE + PREMIUM",
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

/** Full-sentence overrides — populated from external chunk files + inline essentials */
const SENTENCE = JSON.parse(
  readFileSync(join(dirname(import.meta.filename), "data/marketing-surface-sentences.json"), "utf8"),
);

// TR_AR removed — Turkish-to-Arabic mapping cleaned

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
  const cands = (pathsByEn.get(en) ?? []).map((p) => getAt(msg, p)).filter((v) => v && v !== en);
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

function protect(text) {
  const map = new Map();
  let i = 0;
  let out = text;
  for (const b of BRANDS) {
    const re = new RegExp(b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
    out = out.replace(re, () => {
      const k = `__B${i++}__`;
      map.set(k, b);
      return k;
    });
  }
  out = out.replace(/\{[^}]+\}/g, (m) => {
    const k = `__P${i++}__`;
    map.set(k, m);
    return k;
  });
  return { out, map };
}
function restore(text, map) {
  let r = text;
  for (const [k, v] of map) r = r.replaceAll(k, v);
  return r;
}

function pickDe(en, itemVal) {
  if (itemVal && !bad(itemVal, en, "de")) return itemVal;
  const msgVal = bestMsg(en, deMsg);
  if (msgVal && !bad(msgVal, en, "de")) return msgVal;
  const c = cur[en]?.[1];
  if (c && !bad(c, en, "de")) return c;
  return "";
}
function pickFr(en, itemVal) {
  if (itemVal && !bad(itemVal, en, "fr")) return itemVal;
  const msgVal = bestMsg(en, frMsg);
  if (msgVal && !bad(msgVal, en, "fr")) return msgVal;
  const c = cur[en]?.[2];
  if (c && !bad(c, en, "fr")) return c;
  return "";
}
function pickEs(en, itemVal) {
  if (itemVal && !bad(itemVal, en, "es")) return itemVal;
  const msgVal = bestMsg(en, esMsg);
  if (msgVal && !bad(msgVal, en, "es")) return msgVal;
  const c = cur[en]?.[3];
  if (c && !bad(c, en, "es")) return c;
  return "";
}
function pickAr(en) {
  if (SENTENCE[en]?.[0]) return SENTENCE[en][0];
  const c = cur[en]?.[0];
  if (c && c !== en) return c;
  return "";
}

const O = {};
const gaps = { ar: [], de: [], fr: [], es: [] };
for (const item of need) {
  const en = item.en;
  if (SENTENCE[en]) {
    O[en] = SENTENCE[en];
    continue;
  }
  const row = [
    pickAr(en) || (KEEP.has(en) ? en : ""),
    pickDe(en, item.de) || (KEEP.has(en) ? en : ""),
    pickFr(en, item.fr) || (KEEP.has(en) ? en : ""),
    pickEs(en, item.es) || (KEEP.has(en) ? en : ""),
  ];
  O[en] = row;
  row.forEach((v, i) => {
    const loc = ["ar", "de", "fr", "es"][i];
    if (!v || (v === en && !KEEP.has(en))) gaps[loc].push(en);
  });
}

writeFileSync(join(ROOT, "scripts/data/marketing-surface-overrides.json"), `${JSON.stringify(O, null, 2)}\n`);
console.log("O keys:", Object.keys(O).length);
console.log("gaps:", Object.fromEntries(Object.entries(gaps).map(([k, v]) => [k, v.length])));
writeFileSync("/tmp/override-gaps.json", JSON.stringify(gaps, null, 2));
