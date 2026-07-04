#!/usr/bin/env node
/**
 * One-shot builder for marketing-surface-translations.json
 * Run: node scripts/build-marketing-surface-translations.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";

const ROOT = join(dirname(import.meta.filename), "..");
const QUEUE = JSON.parse(
  readFileSync(join(ROOT, "archive/migration-only/scripts/data/marketing-translation-queue.json"), "utf8"),
);

/** @type {Record<string, [string, string, string, string]>} en -> [ar, de, fr, es] */
const ROWS = JSON.parse(
  readFileSync(join(dirname(import.meta.filename), "../archive/migration-only/scripts/data/marketing-surface-rows.json"), "utf8"),
);

/** @type {Record<string, string>} en -> tr (only where queue lacks tr) */
const TR_ONLY = {
  Premium: "Premium",
  "Parasal kayıp": "Parasal kayıp",
  "Material kaybı": "Material kaybı",
  "Zaman kaybı": "Zaman kaybı",
  "Energy kaybı": "Energy kaybı",
  Enterprise: "Kurumsal",
  Baseline: "Temel değer",
  SectorCalc: "SectorCalc",
  "Global · USD": "Küresel · USD",
  "{region} · {currency}": "{region} · {currency}",
  English: "İngilizce",
  Español: "İspanyolca",
  Deutsch: "Almanca",
  Français: "Fransızca",
  "Audit archive": "Audit arşivi",
  "for your sector.": "sektörünüz için.",
  Global: "Küresel",
  Türkiye: "Türkiye",
  MENA: "MENA",
  Imperial: "Emperyal",
  Risk: "Risk",
  Problem: "Sorun",
  SECTORCALC: "SECTORCALC",
  "FREE + PREMIUM": "ÜCRETSİZ + PREMIUM",
  LLMS: "LLMS",
  "REG: GLOBAL": "RECORD: KÜRESEL",
  "© 2026 SECTORCALC": "© 2026 SECTORCALC",
  "llms.txt": "llms.txt",
  "sectorcalc-index.txt": "sectorcalc-index.txt",
  "faq-knowledge.txt": "faq-knowledge.txt",
  "services-products.txt": "services-products.txt",
};

const unique = new Map();
for (const item of QUEUE) {
  if (!unique.has(item.en)) unique.set(item.en, item.tr);
}

const out = { ar: {}, de: {}, fr: {}, es: {}, tr: {} };
const missing = [];

for (const [en] of unique) {
  const row = ROWS[en];
  if (!row) {
    missing.push(en);
    continue;
  }
  const [ar, de, fr, es] = row;
  out.ar[en] = ar;
  out.de[en] = de;
  out.fr[en] = fr;
  out.es[en] = es;
  if (!unique.get(en) && TR_ONLY[en]) {
    out.tr[en] = TR_ONLY[en];
  }
}

if (missing.length) {
  console.error("Missing translations for", missing.length, "strings:");
  missing.forEach((s) => console.error(" -", s));
  process.exit(1);
}

const outPath = join(ROOT, "archive/migration-only/scripts/data/marketing-surface-translations.json");
writeFileSync(outPath, JSON.stringify(out, null, 2) + "\n");

console.log("Written:", outPath);
for (const loc of ["ar", "de", "fr", "es", "tr"]) {
  console.log(`  ${loc}: ${Object.keys(out[loc]).length} entries`);
}
