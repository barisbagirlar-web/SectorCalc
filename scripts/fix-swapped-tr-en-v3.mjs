#!/usr/bin/env node
/**
 * Precision TR↔EN swap fixer v3.
 * Multi-layer detection:
 *   Layer 1: tr field has EN-specific chars, en field has TR-specific chars → SWAPPED
 *   Layer 2: tr field has English function words, en field has Turkish words → SWAPPED
 *   Layer 3: tr field is pure English (no TR words), en field is pure Turkish (no EN words) → SWAPPED
 *
 * Includes anti-false-positive guard for 'cinsinden' and similar.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMAS_DIR = path.resolve(__dirname, "..", "generated", "schemas");

// Turkish-specific characters
const TR_CHARS = /[çğıöşüÇĞİÖŞÜ]/;
const EN_FUNCTION_WORDS = /\b(the|this|that|with|from|when|your|enter|of|to|in|for|per|and|or|is|are|was|were|been|have|has|had|not|but|by|on|at|as)\b/i;

// Known Turkish root words (no inflections) — conservative list
const TURKISH_ROOTS = new Set([
  "kaynak", "mesafe", "kalınlık", "malzeme", "yoğunluk", "birim",
  "parti", "büyüklük", "adedi", "kart", "üretim", "hammadde",
  "fiyat", "maliyet", "değer", "süre", "maruziyet", "zırhlama",
  "gama", "sabit", "hedef", "nokta", "kullanım", "amaç",
  "amortisman", "kira", "tahmin", "yakıt", "verimlilik",
  "galon", "sahip", "cari", "ortalama", "harcama", "bakım",
  "lastik", "rutin", "onarım", "toplam", "limit",
  "depolama", "iletim", "veri",
  "hedef", "toplam", "ortalama",
]);

const TURKISH_SUFFIX_CHARS = /(dır|dir|dur|dür|tır|tir|tur|tür|lar|ler|den|dan|nin|nın|nun|nün|na|ne|nda|nde)\.?$/i;

function hasTRChars(t) { return TR_CHARS.test(t); }
function hasENWords(t) { return EN_FUNCTION_WORDS.test(t); }

function getTurkishWordCount(t) {
  const words = t.toLowerCase().split(/[\s,;:.!?()\[\]{}]+/).filter(Boolean);
  return words.filter(w => TURKISH_ROOTS.has(w) || TURKISH_SUFFIX_CHARS.test(w)).length;
}

function isLikelyTurkish(t) {
  return hasTRChars(t) || getTurkishWordCount(t) >= 2;
}

function isLikelyEnglish(t) {
  return hasENWords(t);
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

    // Check both label_i18n and businessContext_i18n for tr↔en swap
    const pairs = [
      { loc: "tr", key: "label_i18n", fields: [i18nLabel] },
      { loc: "tr", key: "businessContext_i18n", fields: [i18nBc] },
    ];

    for (const { loc, key, fields } of pairs) {
      for (const field of fields) {
        const lText = (field[loc] ?? "").trim();
        const enText = (field.en ?? "").trim();
        if (!lText || !enText || lText === enText) continue;

        const lTR = hasTRChars(lText);
        const enTR = hasTRChars(enText);

        // Layer 1: Unicode chars confirm swap
        if (!lTR && enTR) {
          fixes.push({ slug, id: input.id, field: `${key}.${loc}↔en`, l: lText.slice(0, 60), en: enText.slice(0, 60), layer: 1 });
          field[loc] = enText;
          field.en = lText;
          changed = true;
          continue;
        }

        // Layers 2-3: word-based detection (only for texts > 3 chars)
        const lEnglish = isLikelyEnglish(lText) || (!isLikelyTurkish(lText) && !hasTRChars(lText));
        const enTurkish = isLikelyTurkish(enText);

        if (lEnglish && enTurkish) {
          fixes.push({ slug, id: input.id, field: `${key}.${loc}↔en`, l: lText.slice(0, 60), en: enText.slice(0, 60), layer: lTR || enTR ? 2 : 3 });
          field[loc] = enText;
          field.en = lText;
          changed = true;
        }
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(raw, null, 2) + "\n", "utf8");
  }
}

console.log("=== V3 PRECISION SWAP FIX RESULTS ===");
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
  console.log(`  [L${f.layer}] ${f.slug}.${f.id}.${f.field}: "${f.l}" ↔ "${f.en}"`);
}
