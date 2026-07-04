#!/usr/bin/env node
/**
 * Adds field-label map entries for EN phrases that still resolve identically
 * after copy map + glossary passes (short labels/helpers only).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createPhraseTranslator, isSentenceLike } from "./lib/generate-translate-phrase.mjs";

const ROOT = join(import.meta.dirname, "..");
const TARGET = join(ROOT, "archive/migration-only/scripts/data/calculator-field-labels-i18n.json");
const BUNDLE_PATH = join(ROOT, "src/data/free-tool-inputs-i18n.generated.json");
const LOCALES = ["tr", "de", "fr", "es", "ar"];

const PHRASE_GLOSSARY = JSON.parse(
  readFileSync(join(ROOT, "src/data/calculator-phrase-glossary.json"), "utf8"),
);
const COPY_MAP = JSON.parse(
  readFileSync(join(ROOT, "archive/migration-only/scripts/data/generated-schema-copy-i18n.json"), "utf8"),
);

const { translatePhrase } = createPhraseTranslator({
  phraseGlossary: PHRASE_GLOSSARY,
  fieldLabelMap: {},
});

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
  tr: [/[çğıöşüÇĞİÖŞÜ]/, /\b(için|veya|başına|olarak|girin|hedef|process|cost|unit|değer|hesaplamada)\b/i],
  de: [/[äöüßÄÖÜ]/, /\b(und|oder|für|pro|eingeben|der|die|das|berechnung)\b/i],
  fr: [/[àâçéèêëîïôùûü]/i, /\b(pour|ou|de|le|la|saisir|calcul|valeur)\b/i],
  es: [/[áéíóúñü¿¡]/i, /\b(para|o|de|el|la|introduzca|cálculo|valor)\b/i],
  ar: [/[\u0600-\u06FF]/],
};

function isLikelyHybridLocal(text, locale) {
  const markers = LOCALE_MARKERS[locale] ?? [];
  if (!markers.some((re) => re.test(text))) {
    return false;
  }
  return ENGLISH_MARKERS_STRICT.some((re) => re.test(text));
}

const fieldMap = JSON.parse(readFileSync(TARGET, "utf8"));
const bundle = JSON.parse(readFileSync(BUNDLE_PATH, "utf8"));
const enBundle = bundle.en ?? {};

const phrases = new Set();
for (const fields of Object.values(enBundle)) {
  for (const copy of Object.values(fields ?? {})) {
    for (const part of ["label", "helper"]) {
      const value = copy?.[part];
      if (typeof value === "string" && value.trim() && value.length <= 80 && !isSentenceLike(value)) {
        phrases.add(value.trim());
      }
    }
  }
}

let changed = 0;

for (const phrase of phrases) {
  for (const locale of LOCALES) {
    fieldMap[locale] ??= {};
    if (fieldMap[locale][phrase]) {
      continue;
    }

    const fromCopy =
      COPY_MAP.labels?.[phrase]?.[locale] ?? COPY_MAP.helpers?.[phrase]?.[locale];
    if (typeof fromCopy === "string" && fromCopy.trim() && fromCopy.trim() !== phrase) {
      fieldMap[locale][phrase] = fromCopy.trim();
      changed += 1;
      continue;
    }

    const glossed = translatePhrase(phrase, locale, null, { mode: "label" });
    if (
      glossed &&
      glossed.trim() &&
      glossed.trim().toLowerCase() !== phrase.toLowerCase() &&
      !isLikelyHybridLocal(glossed, locale)
    ) {
      fieldMap[locale][phrase] = glossed.trim();
      changed += 1;
    }
  }
}

writeFileSync(TARGET, `${JSON.stringify(fieldMap, null, 2)}\n`, "utf8");
console.log(`autofill-en-identical-field-labels: phrases=${phrases.size} changed=${changed}`);
