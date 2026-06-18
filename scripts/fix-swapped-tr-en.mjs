#!/usr/bin/env node
/**
 * Precision TR↔EN swap fixer v5.
 *
 * Logic:
 *   If tr field has NO Turkish root words AND en field has ≥1 Turkish root word
 *   AND tr field is differently-worded from en field → SWAPPED.
 *   Also: if en has TR-specific chars and tr doesn't → SWAPPED.
 *
 * Conservative: only fixes when en field has unmistakable Turkish content.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMAS_DIR = path.resolve(__dirname, "..", "generated", "schemas");

const TR_CHARS = /[çğıöşüÇĞİÖŞÜ]/;

// Turkish root words — expanded from manual analysis of all swapped fields
const TURKISH_ROOTS = new Set([
  "kaynak", "mesafe", "kalınlık", "malzeme", "yoğunluk", "birim",
  "parti", "büyüklük", "adedi", "kart", "üretim", "hammadde",
  "fiyat", "maliyet", "değer", "süre", "maruziyet", "zırhlama",
  "gama", "sabit", "hedef", "nokta", "kullanım", "amaç",
  "amortisman", "kira", "tahmin", "yakıt", "verimlilik",
  "galon", "sahip", "cari", "ortalama", "harcama", "bakım",
  "lastik", "rutin", "onarım", "toplam", "limit",
  "depolama", "iletim", "veri", "aktivite", "aktivit",
  "kreatin", "maliyeti", "maliyetleri", "maliyet",
  "kaplanacak", "cinsinden", "paket", "kahve",
  "harcama",
]);

function getTurkishWordCount(t) {
  const words = t.toLowerCase().split(/[\s,;:.!?()\[\]{}]+/).filter(Boolean);
  return words.filter(w => TURKISH_ROOTS.has(w)).length;
}

const fixes = [];
const files = fs.readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith("-schema.json"));

for (const fn of files) {
  const slug = fn.replace(/-schema\.json$/, "");
  const filePath = path.join(SCHEMAS_DIR, fn);
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  let changed = false;

  for (const input of raw.inputs ?? []) {
    const i18nLabel = input.label_i18n ?? {};
    const i18nBc = input.businessContext_i18n ?? {};

    for (const field of [i18nLabel, i18nBc]) {
      const lText = (field.tr ?? "").trim();
      const enText = (field.en ?? "").trim();
      if (!lText || !enText || lText === enText) continue;
      if (lText.toLowerCase() === enText.toLowerCase()) continue; // same text, different case

      // Pre-check: if tr has TR chars → already in Turkish, not swapped
      if (TR_CHARS.test(lText)) continue;

      const lTRCount = getTurkishWordCount(lText);
      const enTRCount = getTurkishWordCount(enText);

      // Case A: en has TR chars AND tr doesn't → definitely swapped
      if (!TR_CHARS.test(lText) && TR_CHARS.test(enText)) {
        fixes.push({ slug, id: input.id, l: lText.slice(0, 60), en: enText.slice(0, 60), reason: "chars" });
        field.tr = enText;
        field.en = lText;
        changed = true;
        continue;
      }

      // Case B: en has Turkish words AND tr has none → likely swapped
      if (lTRCount === 0 && enTRCount >= 1) {
        fixes.push({ slug, id: input.id, l: lText.slice(0, 60), en: enText.slice(0, 60), reason: `words(en=${enTRCount})` });
        field.tr = enText;
        field.en = lText;
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(raw, null, 2) + "\n", "utf8");
  }
}

console.log("=== V5 SWAP FIX RESULTS ===");
console.log(`Schemas scanned: ${files.length}`);
console.log(`Fixes applied: ${fixes.length}`);

const bySlug = {};
for (const f of fixes) {
  bySlug[f.slug] = (bySlug[f.slug] ?? 0) + 1;
}
for (const [slug, count] of Object.entries(bySlug).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${slug}: ${count}`);
}
for (const f of fixes) {
  console.log(`  [${f.reason}] ${f.slug}.${f.id}: "${f.l}" ↔ "${f.en}"`);
}
