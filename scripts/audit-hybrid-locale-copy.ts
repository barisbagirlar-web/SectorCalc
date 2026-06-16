#!/usr/bin/env node
/**
 * Hybrid-language detector — uses the same runtime resolver as calculator forms.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { resolveFreeToolFieldDisplay } from "../src/lib/i18n/free-tool-form-i18n.ts";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["tr", "de", "fr", "es", "ar"] as const;
const BUNDLE_PATH = join(ROOT, "src/data/free-tool-inputs-i18n.generated.json");

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
  /\bif true\b/i,
  /\binclude\b/i,
  /\bexpected\b/i,
  /\bavailable\b/i,
];

const ENGLISH_MARKERS_LOOSE = [
  /\bfor\b/i,
  /\bper\b/i,
  /\bmeasure\b/i,
  /\bengineering\b/i,
  /\bcustomer\b/i,
  /\bspecification\b/i,
  /\bideal\b/i,
  /\bcharacteristic\b/i,
  /\btypical\b/i,
  /\bprimary\b/i,
  /\bsecondary\b/i,
];

const LOCALE_MARKERS: Record<string, RegExp[]> = {
  tr: [/[çğıöşüÇĞİÖŞÜ]/, /\b(için|veya|başına|olarak|girin|hedef|proses|maliyet|birim|değer|hesaplamada)\b/i],
  de: [/[äöüßÄÖÜ]/, /\b(und|oder|für|pro|eingeben|der|die|das|berechnung)\b/i],
  fr: [/[àâçéèêëîïôùûü]/i, /\b(pour|ou|de|le|la|saisir|calcul|valeur)\b/i],
  es: [/[áéíóúñü¿¡]/i, /\b(para|o|de|el|la|introduzca|cálculo|valor)\b/i],
  ar: [/[\u0600-\u06FF]/],
};

function looksEnglish(text: string): boolean {
  if (ENGLISH_MARKERS_STRICT.some((re) => re.test(text))) {
    return true;
  }
  return ENGLISH_MARKERS_LOOSE.filter((re) => re.test(text)).length >= 2;
}

function isHybrid(text: string, locale: string): boolean {
  if (!text || locale === "en") {
    return false;
  }
  const markers = LOCALE_MARKERS[locale] ?? [];
  const hasLocale = markers.some((re) => re.test(text));
  if (!hasLocale) {
    return false;
  }

  const strictHits = ENGLISH_MARKERS_STRICT.filter((re) => re.test(text)).length;
  if (strictHits > 0) {
    return true;
  }

  const looseHits = ENGLISH_MARKERS_LOOSE.filter((re) => re.test(text)).length;
  return looseHits >= 2;
}

type Leak = {
  slug: string;
  fieldKey: string;
  part: string;
  kind: string;
  sample: string;
};

function auditBundle(locale: string, enBundle: Record<string, Record<string, unknown>>) {
  const leaks: Leak[] = [];

  for (const [slug, enFields] of Object.entries(enBundle)) {
    if (!enFields || typeof enFields !== "object") {
      continue;
    }

    for (const [fieldKey, enCopy] of Object.entries(enFields)) {
      if (!enCopy || typeof enCopy !== "object") {
        continue;
      }

      const enRecord = enCopy as Record<string, unknown>;
      const fallback = {
        label: typeof enRecord.label === "string" ? enRecord.label : "",
        placeholder:
          typeof enRecord.placeholder === "string"
            ? enRecord.placeholder
            : typeof enRecord.label === "string"
              ? enRecord.label
              : "",
        helper:
          typeof enRecord.helper === "string"
            ? enRecord.helper
            : typeof enRecord.label === "string"
              ? enRecord.label
              : undefined,
      };

      const display = resolveFreeToolFieldDisplay(slug, fieldKey, locale, fallback);
      const enDisplay = resolveFreeToolFieldDisplay(slug, fieldKey, "en", fallback);

      for (const part of ["label", "helper", "placeholder"] as const) {
        const value = display[part];
        const enValue = enDisplay[part];
        if (typeof value !== "string" || !value.trim()) {
          continue;
        }

        if (value === enValue && typeof enValue === "string" && enValue.length > 4 && looksEnglish(enValue)) {
          leaks.push({
            slug,
            fieldKey,
            part,
            kind: "en-identical",
            sample: value.slice(0, 80),
          });
        } else if (isHybrid(value, locale)) {
          leaks.push({
            slug,
            fieldKey,
            part,
            kind: "hybrid",
            sample: value.slice(0, 120),
          });
        }
      }
    }
  }

  return leaks;
}

const bundle = JSON.parse(readFileSync(BUNDLE_PATH, "utf8")) as Record<
  string,
  Record<string, Record<string, unknown>>
>;
const enBundle = bundle.en ?? {};
let total = 0;

for (const locale of LOCALES) {
  const leaks = auditBundle(locale, enBundle);
  const hybrid = leaks.filter((item) => item.kind === "hybrid");
  const identical = leaks.filter((item) => item.kind === "en-identical");
  console.log(`${locale}: hybrid=${hybrid.length} en-identical=${identical.length}`);
  for (const item of hybrid.slice(0, 5)) {
    console.log(`  HYBRID ${item.slug}.${item.fieldKey}.${item.part}: ${item.sample}`);
  }
  for (const item of identical.slice(0, 2)) {
    console.log(`  EN-ID ${item.slug}.${item.fieldKey}.${item.part}: ${item.sample}`);
  }
  total += leaks.length;
}

if (total > 0) {
  console.error(`audit-hybrid-locale-copy: FAIL (${total} issue(s))`);
  process.exit(1);
}

console.log("audit-hybrid-locale-copy: PASS");
