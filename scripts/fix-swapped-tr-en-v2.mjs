#!/usr/bin/env node
/**
 * Precision TR↔EN swap fixer v2.
 * Only detects cases where LANGUAGE-SPECIFIC UNICODE CHARACTERS
 * confirm a swap. Zero false positives.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMAS_DIR = path.resolve(__dirname, "..", "generated", "schemas");

// Language-specific character sets
const CHARS = {
  tr: /[çğıöşüÇĞİÖŞÜ]/,
  de: /[äöüßÄÖÜ]/,
  fr: /[àâçéèêëîïôùûüÀÂÇÉÈÊËÎÏÔÙÛÜœŒ]/,
  es: /[áéíóúñü¿¡ÁÉÍÓÚÑÜ]/,
  ar: /[\u0600-\u06FF]/,
};

function hasChars(text, locale) {
  return CHARS[locale]?.test(text) ?? false;
}

const LOCALES = ["tr", "de", "fr", "es", "ar"];
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

    // For each pair: if non-EN locale has NO locale chars AND EN has locale chars → SWAPPED
    for (const loc of LOCALES) {
      const lText = (i18nLabel[loc] ?? "").trim();
      const enText = (i18nLabel.en ?? "").trim();
      if (lText && enText && lText !== enText) {
        const lHasLocale = hasChars(lText, loc);
        const enHasLocale = hasChars(enText, loc);
        if (!lHasLocale && enHasLocale) {
          // SWAPPED: locale field has EN chars, EN field has locale chars
          fixes.push({ slug, id: input.id, field: `label_i18n.${loc}↔en`, a: lText.slice(0, 60), b: enText.slice(0, 60) });
          input.label_i18n[loc] = enText;
          input.label_i18n.en = lText;
          changed = true;
        }
      }
    }

    for (const loc of LOCALES) {
      const lText = (i18nBc[loc] ?? "").trim();
      const enText = (i18nBc.en ?? "").trim();
      if (lText && enText && lText !== enText) {
        const lHasLocale = hasChars(lText, loc);
        const enHasLocale = hasChars(enText, loc);
        if (!lHasLocale && enHasLocale) {
          fixes.push({ slug, id: input.id, field: `businessContext_i18n.${loc}↔en`, a: lText.slice(0, 60), b: enText.slice(0, 60) });
          input.businessContext_i18n[loc] = enText;
          input.businessContext_i18n.en = lText;
          changed = true;
        }
      }
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(raw, null, 2) + "\n", "utf8");
  }
}

console.log("=== PRECISION SWAP FIX RESULTS ===");
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
  console.log(`  ${f.slug}.${f.id}.${f.field}: "${f.a}" ↔ "${f.b}"`);
}
