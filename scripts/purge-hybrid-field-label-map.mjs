#!/usr/bin/env node
/**
 * Removes hybrid field-label map entries that block exact glossary translations.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const TARGET = join(ROOT, "scripts/data/calculator-field-labels-i18n.json");
const LOCALES = ["tr", "de", "fr", "es", "ar"];

const ENGLISH_MARKERS_STRICT = [
  /\bthe\b/i,
  /\bthis\b/i,
  /\bthat\b/i,
  /\bwith\b/i,
  /\bfrom\b/i,
  /\bwhen\b/i,
  /\byour\b/i,
  /\bwill\b/i,
  /\bare\b/i,
  /\bcalculator\b/i,
  /\binput\b/i,
  /\bused to\b/i,
  /\be\.g\./i,
  /\bexpected\b/i,
  /\bavailable\b/i,
];

const LOCALE_MARKERS = {
  tr: [/[çğıöşüÇĞİÖŞÜ]/, /\b(için|veya|başına|olarak|girin|hedef|proses|maliyet|birim|değer|hesaplamada)\b/i],
  de: [/[äöüßÄÖÜ]/, /\b(und|oder|für|pro|eingeben|der|die|das|berechnung)\b/i],
  fr: [/[àâçéèêëîïôùûü]/i, /\b(pour|ou|de|le|la|saisir|calcul|valeur)\b/i],
  es: [/[áéíóúñü¿¡]/i, /\b(para|o|de|el|la|introduzca|cálculo|valor)\b/i],
  ar: [/[\u0600-\u06FF]/],
};

function isHybrid(text, locale) {
  const markers = LOCALE_MARKERS[locale] ?? [];
  if (!markers.some((re) => re.test(text))) {
    return false;
  }
  return ENGLISH_MARKERS_STRICT.some((re) => re.test(text));
}

const fieldMap = JSON.parse(readFileSync(TARGET, "utf8"));
let removed = 0;

for (const locale of LOCALES) {
  const entries = fieldMap[locale] ?? {};
  for (const [phrase, value] of Object.entries(entries)) {
    if (typeof value === "string" && isHybrid(value, locale)) {
      delete entries[phrase];
      removed += 1;
    }
  }
}

writeFileSync(TARGET, `${JSON.stringify(fieldMap, null, 2)}\n`, "utf8");
console.log(`purge-hybrid-field-label-map: removed=${removed}`);
