#!/usr/bin/env node
/**
 * Fix ALL bundle locale entries from schema `_i18n` data.
 *
 * The bundle (free-tool-inputs-i18n.generated.json) was built from raw
 * `label`/`businessContext` fields (Turkish text). This script overwrites
 * ALL locale entries with the correct `_i18n` locale data from schemas.
 *
 * Non-EN entries preserve existing bundle values as fallback when
 * schema `_i18n` data is not available or is not a valid translation
 * (i.e., matches English).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { readdirSync } from "node:fs";

const ROOT = join(import.meta.dirname, "..");
const SCHEMAS_DIR = join(ROOT, "generated", "schemas");
const BUNDLE_PATH = join(ROOT, "src/data/free-tool-inputs-i18n.generated.json");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];
const FOREIGN_PATTERNS = {
  tr: /[çğıöşüÇĞİÖŞÜ]/,
  de: /[äöüßÄÖÜ]/,
  fr: /[àâçéèêëîïôùûüæœÀÂÇÉÈÊËÎÏÔÙÛÜÆŒ]/,
  es: /[áéíóúñü¿¡ÁÉÍÓÚÑÜ]/,
  ar: /[\u0600-\u06FF]/,
};

function localeHasMarkers(text, locale) {
  const pattern = FOREIGN_PATTERNS[locale];
  return pattern ? pattern.test(text) : false;
}

const bundle = JSON.parse(readFileSync(BUNDLE_PATH, "utf8"));
const files = readdirSync(SCHEMAS_DIR).filter((name) => name.endsWith("-schema.json"));

let totalPatched = 0;
let enPatched = 0;

for (const fileName of files) {
  const slug = fileName.replace(/-schema\.json$/, "");
  const raw = JSON.parse(readFileSync(join(SCHEMAS_DIR, fileName), "utf8"));

  for (const input of raw.inputs ?? []) {
    const key = (input.id ?? "").toLowerCase();
    if (!key) continue;

    // EN label/helper from schema _i18n
    const enLabel = input.label_i18n?.en?.trim() || input.label?.trim() || "";
    const enHelper = input.businessContext_i18n?.en?.trim() || input.businessContext?.trim() || "";
    if (!enLabel) continue;
    const useEnLabel = enLabel;
    const useEnHelper = enHelper;

    if (!useEnLabel) continue;

    for (const locale of LOCALES) {
      let label, helper;

      if (locale === "en") {
        // For EN, use _i18n.en if it was fixed, else keep existing bundle
        label = useEnLabel;
        helper = useEnHelper;
      } else {
        // For non-EN: prefer schema _i18n[locale] if it's different from the SOURCE English
        // The source English is `useEnLabel` (what we display for EN locale)
        const schemaLabel = input.label_i18n?.[locale]?.trim();
        const schemaHelper = input.businessContext_i18n?.[locale]?.trim();

        label = (schemaLabel && schemaLabel !== useEnLabel)
          ? schemaLabel
          : (bundle[locale]?.[slug]?.[key]?.label || useEnLabel);
        helper = (schemaHelper && schemaHelper !== useEnHelper)
          ? schemaHelper
          : (bundle[locale]?.[slug]?.[key]?.helper || useEnHelper);
      }

      if (!label) continue;

      // Update bundle
      if (!bundle[locale]) bundle[locale] = {};
      if (!bundle[locale][slug]) bundle[locale][slug] = {};
      if (!bundle[locale][slug][key]) bundle[locale][slug][key] = {};

      const entry = bundle[locale][slug][key];
      if (entry.label !== label) {
        entry.label = label;
        totalPatched += 1;
        if (locale === "en") enPatched += 1;
      }
      if (helper && entry.helper !== helper) {
        entry.helper = helper;
        totalPatched += 1;
      }

      // Re-derive EN placeholder
      if (locale === "en") {
        entry.placeholder = `Enter ${label.toLowerCase()}`;
      }
    }
  }
}

writeFileSync(BUNDLE_PATH, JSON.stringify(bundle, null, 2) + "\n", "utf8");

console.log(`Bundle locale fix complete.`);
console.log(`  Schema files scanned: ${files.length}`);
console.log(`  Total locale entries patched: ${totalPatched}`);
console.log(`  EN entries patched: ${enPatched}`);
console.log(`  Locales: ${LOCALES.join(", ")}`);
