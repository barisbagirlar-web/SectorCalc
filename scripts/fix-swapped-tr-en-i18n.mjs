#!/usr/bin/env node
/**
 * Phase 2 — Smart TR↔EN swap fixer.
 * Detects cases where label_i18n.tr has English AND label_i18n.en has Turkish
 * by using Turkish word heuristics (not just TR-special characters).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMAS_DIR = path.resolve(__dirname, "..", "generated", "schemas");
const LOCALES = ["tr", "de", "fr", "es", "ar"];

// Turkish-specific characters
const TR_CHARS = /[çğıöşüÇĞİÖŞÜ]/;

// Known Turkish words (common in calculator schemas) that don't have TR-special chars
// These are used when the TR field has no special chars but the EN field looks Turkish
const TURKISH_WORDS = new Set([
  "resource", "aktivite", "aktiviteleri", "distance", "kalınlık", "material",
  "yoğunluk", "değer", "unit", "süre", "maruziyet", "zırhlama",
  "katsayı", "gama", "sabit", "hedef", "nokta", "olan",
  "kaynağın", "cinsinden", "useılan", "örneğin", "kurşun",
  "yarı", "değer", "azaltan", "total", "radyoaktif", "curie",
  "parti", "büyüklük", "adedi", "hesaplanacak", "kart",
  "üduction", "firesi", "yüzdesi", "hammadde", "kilogram",
  "priceı", "cost", "bakım", "tire", "rutin",
  "average", "harcama", "onarım", "yakıt", "productivity",
  "galon", "sahip", "olma", "prediction", "etmek", "cari",
  "veya", "için", "ile", "olarak", "amacıyla", "tarafından",
  "birimden", "birime", "dönüştürme", "dönüştürülecek",
  "viskozite", "sıvı", "dinamik", "kinematik", "arasında",
  "dönüşüm", "yaparken", "sadece", "useılır", "akışkan",
  "karakter", "sayısı", "bayt", "kodlanan", "ekler",
  "dahil", "ürün", "quantityı", "total", "istenen",
  "şeker", "yüzdesi", "saflık", "ratioı", "cost",
  "başına", "parti", "sayısı", "üretilecek",
  "açık", "döngü", "sıfır", "kutup", "real", "sanal",
  "kısım", "eksen", "konumu", "birinci", "ikinci", "üçüncü",
  "gerçel", "kök", "yer", "eğrisi",
]);

function isTurkish(text) {
  // Has TR-specific characters → definitely Turkish
  if (TR_CHARS.test(text)) return true;
  // Check for Turkish words
  const words = text.toLowerCase().split(/[\s,;:.!?()]+/).filter(Boolean);
  const turkishWords = words.filter(w => TURKISH_WORDS.has(w));
  return turkishWords.length >= 2;
}

function isEnglish(text) {
  // Has common English function words → likely English
  return /\b(the|this|that|with|from|when|your|enter|number of|used for|input for|is|are|of|to|in|for|and|or|an)\b/i.test(text);
}

const swappedCases = [];
const files = fs.readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith("-schema.json"));

for (const fn of files) {
  const slug = fn.replace(/-schema\.json$/, "");
  const filePath = path.join(SCHEMAS_DIR, fn);
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
  let changed = false;
  const inputs = raw.inputs ?? [];

  for (const input of inputs) {
    const li18n = input.label_i18n ?? {};
    const bi18n = input.businessContext_i18n ?? {};

    // Check label_i18n
    const trLabel = (li18n.tr ?? "").trim();
    const enLabel = (li18n.en ?? "").trim();
    if (trLabel && enLabel && trLabel !== enLabel) {
      const trLooksTurkish = isTurkish(trLabel);
      const enLooksTurkish = isTurkish(enLabel);
      const trLooksEnglish = isEnglish(trLabel);
      const enLooksEnglish = isEnglish(enLabel);

      // SWAPPED: TR field has English, EN field has Turkish
      if (!trLooksTurkish && enLooksTurkish && (trLooksEnglish || !enLooksEnglish)) {
        const detail = `label_i18n: tr="${trLabel.slice(0,60)}" ↔ en="${enLabel.slice(0,60)}"`;
        swappedCases.push({ slug, id: input.id, field: "label_i18n", detail });
        // Fix: swap them
        input.label_i18n.tr = enLabel;
        input.label_i18n.en = trLabel;
        changed = true;
      }
    }

    // Check businessContext_i18n
    const trBc = (bi18n.tr ?? "").trim();
    const enBc = (bi18n.en ?? "").trim();
    if (trBc && enBc && trBc !== enBc) {
      const trBcLooksTurkish = isTurkish(trBc);
      const enBcLooksTurkish = isTurkish(enBc);
      const trBcLooksEnglish = isEnglish(trBc);
      const enBcLooksEnglish = isEnglish(enBc);

      if (!trBcLooksTurkish && enBcLooksTurkish && (trBcLooksEnglish || !enBcLooksEnglish)) {
        const detail = `businessContext_i18n: tr="${trBc.slice(0,60)}" ↔ en="${enBc.slice(0,60)}"`;
        swappedCases.push({ slug, id: input.id, field: "businessContext_i18n", detail });
        input.businessContext_i18n.tr = enBc;
        input.businessContext_i18n.en = trBc;
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(raw, null, 2) + "\n", "utf8");
  }
}

console.log("=== SMART SWAP DETECTION RESULTS ===");
console.log(`Schemas scanned: ${files.length}`);
console.log(`Swapped fixes applied: ${swappedCases.length}`);

// Group by slug
const bySlug = {};
for (const c of swappedCases) {
  bySlug[c.slug] = (bySlug[c.slug] ?? 0) + 1;
}
for (const [slug, count] of Object.entries(bySlug).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${slug}: ${count} fixes`);
}

// Show details
for (const c of swappedCases) {
  console.log(`  ${c.slug}.${c.id}.${c.field}: ${c.detail}`);
}
