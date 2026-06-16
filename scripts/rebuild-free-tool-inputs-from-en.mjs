#!/usr/bin/env node
/**
 * Rebuilds all non-EN locale field copy from bundle.en using the canonical translator.
 * Fixes stale hybrid strings left by incremental merges.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createPhraseTranslator } from "./lib/generate-translate-phrase.mjs";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];
const BUNDLE_PATH = join(ROOT, "src/data/free-tool-inputs-i18n.generated.json");
const COPY_MAP_PATH = join(ROOT, "scripts/data/generated-schema-copy-i18n.json");

const PHRASE_GLOSSARY = JSON.parse(
  readFileSync(join(ROOT, "src/data/calculator-phrase-glossary.json"), "utf8"),
);
const FIELD_LABEL_MAP = JSON.parse(
  readFileSync(join(ROOT, "scripts/data/calculator-field-labels-i18n.json"), "utf8"),
);
const COPY_MAP = existsSync(COPY_MAP_PATH)
  ? JSON.parse(readFileSync(COPY_MAP_PATH, "utf8"))
  : { labels: {}, helpers: {} };

const { buildFieldCopy } = createPhraseTranslator({
  phraseGlossary: PHRASE_GLOSSARY,
  fieldLabelMap: FIELD_LABEL_MAP,
});

const bundle = JSON.parse(readFileSync(BUNDLE_PATH, "utf8"));
const enBundle = bundle.en ?? {};
let fieldCount = 0;

for (const locale of LOCALES) {
  if (locale === "en") {
    continue;
  }
  bundle[locale] = bundle[locale] ?? {};
}

for (const [slug, enFields] of Object.entries(enBundle)) {
  if (!enFields || typeof enFields !== "object") {
    continue;
  }

  for (const [fieldKey, enCopy] of Object.entries(enFields)) {
    if (!enCopy || typeof enCopy !== "object") {
      continue;
    }

    fieldCount += 1;
    const label = typeof enCopy.label === "string" ? enCopy.label : "";
    const helper = typeof enCopy.helper === "string" ? enCopy.helper : label;

    for (const locale of LOCALES) {
      if (locale === "en") {
        continue;
      }
      if (!bundle[locale][slug]) {
        bundle[locale][slug] = {};
      }
      bundle[locale][slug][fieldKey] = buildFieldCopy(
        locale,
        label,
        helper,
        fieldKey,
        COPY_MAP,
      );
    }
  }
}

writeFileSync(BUNDLE_PATH, `${JSON.stringify(bundle, null, 2)}\n`, "utf8");
console.log(
  `rebuild-free-tool-inputs-from-en: tools=${Object.keys(enBundle).length} fields=${fieldCount} locales=${LOCALES.length}`,
);
