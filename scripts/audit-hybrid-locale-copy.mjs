#!/usr/bin/env node
/**
 * Hybrid-language detector for localized calculator copy.
 * Flags strings that mix English function words with target-locale text.
 *
 * Run: node scripts/audit-hybrid-locale-copy.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const SCHEMAS_DIR = join(ROOT, "generated", "schemas");
const LOCALES = ["tr", "de", "fr", "es", "ar"];

/** Unambiguous English leakage — avoid cognates (ideal, minimum, process, acceptable in FR/ES). */
const ENGLISH_FUNCTION_WORDS = [
  /\bthe\b/i,
  /\bthis\b/i,
  /\bthat\b/i,
  /\bwith\b/i,
  /\bfrom\b/i,
  /\bwhen\b/i,
  /\byour\b/i,
  /\bwill\b/i,
  /\bused to\b/i,
  /\benter your\b/i,
  /\bif true\b/i,
  /\be\.g\.\b/i,
];

const TURKISH_MARKERS = [/[çğıöşüÇĞİÖŞÜ]/, /\b(için|veya|başına|olarak|girin|hedef|proses|maliyet|birim)\b/i];
const GERMAN_MARKERS = [/[äöüßÄÖÜ]/, /\b(und|oder|für|pro|eingeben|der|die|das)\b/i];
const FRENCH_MARKERS = [/[àâçéèêëîïôùûü]/i, /\b(pour|ou|de|le|la|saisir)\b/i];
const SPANISH_MARKERS = [/[áéíóúñü¿¡]/i, /\b(para|o|de|el|la|introduzca)\b/i];
const ARABIC_MARKERS = [/[\u0600-\u06FF]/];

const LOCALE_MARKERS = {
  tr: TURKISH_MARKERS,
  de: GERMAN_MARKERS,
  fr: FRENCH_MARKERS,
  es: SPANISH_MARKERS,
  ar: ARABIC_MARKERS,
};

const HYBRID_GARBAGE_PATTERNS = [
  /\bPrimary input for\b/i,
  /\bSecondary input for\b/i,
  /\bOptional modifier for\b/i,
  /\bNumber of\b/i,
  /\bfor .+ Calculator\b/i,
  /\bFixed Minimum Amount\b/i,
  /\bFixed Minimum\b/i,
];

function isHybrid(text, locale) {
  if (!text || locale === "en") {
    return false;
  }
  const markers = LOCALE_MARKERS[locale] ?? [];
  if (!markers.some((re) => re.test(text))) {
    return false;
  }
  if (HYBRID_GARBAGE_PATTERNS.some((re) => re.test(text))) {
    return true;
  }
  return ENGLISH_FUNCTION_WORDS.some((re) => re.test(text));
}

function loadGeneratedSlugs() {
  return readdirSync(SCHEMAS_DIR)
    .filter((name) => name.endsWith("-schema.json"))
    .map((name) => name.replace(/-schema\.json$/, ""));
}

const EN_IDENTICAL_COGNATES = new Set([
  "AQL (%)",
  "Region",
  "Distance (km)",
  "Altitude (m)",
]);

function auditMessages(locale, generatedSlugs) {
  const messages = JSON.parse(readFileSync(join(ROOT, "messages", `${locale}.json`), "utf8"));
  const enMessages = JSON.parse(readFileSync(join(ROOT, "messages/en.json"), "utf8"));
  const leaks = [];

  for (const slug of generatedSlugs) {
    const fields = messages.freeToolInputs?.[slug] ?? {};
    const enFields = enMessages.freeToolInputs?.[slug] ?? {};
    for (const [fieldKey, copy] of Object.entries(fields)) {
      for (const part of ["label", "helper", "placeholder"]) {
        const value = copy?.[part];
        if (typeof value !== "string" || !value.trim()) {
          continue;
        }
        const enValue = enFields[fieldKey]?.[part] ?? "";
        if (value === enValue && enValue.length > 4 && !EN_IDENTICAL_COGNATES.has(enValue)) {
          leaks.push({ slug, fieldKey, part, kind: "en-identical", sample: value.slice(0, 80) });
        } else if (isHybrid(value, locale)) {
          leaks.push({ slug, fieldKey, part, kind: "hybrid", sample: value.slice(0, 120) });
        }
      }
    }
  }
  return leaks;
}

const generatedSlugs = loadGeneratedSlugs();
let total = 0;

for (const locale of LOCALES) {
  const leaks = auditMessages(locale, generatedSlugs);
  const hybrid = leaks.filter((item) => item.kind === "hybrid");
  const identical = leaks.filter((item) => item.kind === "en-identical");
  console.log(`${locale}: hybrid=${hybrid.length} en-identical=${identical.length}`);
  for (const item of hybrid.slice(0, 5)) {
    console.log(`  HYBRID ${item.slug}.${item.fieldKey}.${item.part}: ${item.sample}`);
  }
  total += leaks.length;
}

if (total > 0) {
  console.error(`audit-hybrid-locale-copy: FAIL (${total} issue(s))`);
  process.exit(1);
}

console.log("audit-hybrid-locale-copy: PASS");
