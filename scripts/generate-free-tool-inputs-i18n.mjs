#!/usr/bin/env node
/**
 * Generates locale-specific calculator field copy (label, placeholder, helper)
 * for every free-traffic + roadmap catalog input. Merges into bundle only;
 * messages sync runs at pipeline end.
 */
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createPhraseTranslator } from "./lib/generate-translate-phrase.mjs";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];
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

const CATALOG_PATHS = [
  "src/lib/tools/free-traffic-catalog.generated.json",
  "src/lib/tools/roadmap-free-batch1-catalog.generated.json",
  "src/lib/tools/roadmap-free-batch2-catalog.generated.json",
];

function loadCatalogTools() {
  const bySlug = new Map();
  for (const rel of CATALOG_PATHS) {
    const tools = JSON.parse(readFileSync(join(ROOT, rel), "utf8"));
    for (const tool of tools) {
      bySlug.set(tool.slug, tool);
    }
  }
  return [...bySlug.values()];
}

const { buildFieldCopy } = createPhraseTranslator({
  phraseGlossary: PHRASE_GLOSSARY,
  fieldLabelMap: FIELD_LABEL_MAP,
});

function buildBundle() {
  const tools = loadCatalogTools();
  const bundle = Object.fromEntries(LOCALES.map((l) => [l, {}]));

  for (const tool of tools) {
    for (const locale of LOCALES) {
      bundle[locale][tool.slug] = {};
      for (const input of tool.inputs ?? []) {
        const fieldKey = input.key.toLowerCase();
        bundle[locale][tool.slug][fieldKey] = buildFieldCopy(
          locale,
          input.label,
          input.helper,
          input.key,
          COPY_MAP,
        );
      }
    }
  }

  return bundle;
}

const bundle = buildBundle();
const outPath = join(ROOT, "src/data/free-tool-inputs-i18n.generated.json");
const existingBundle = existsSync(outPath)
  ? JSON.parse(readFileSync(outPath, "utf8"))
  : Object.fromEntries(LOCALES.map((locale) => [locale, {}]));

for (const locale of LOCALES) {
  existingBundle[locale] = { ...(existingBundle[locale] ?? {}), ...bundle[locale] };
}
writeFileSync(outPath, `${JSON.stringify(existingBundle, null, 2)}\n`, "utf8");
console.log(`Merged catalog inputs → ${outPath}`);

let fieldCount = 0;
for (const tool of loadCatalogTools()) {
  fieldCount += (tool.inputs ?? []).length;
}
console.log(`tools=${loadCatalogTools().length} fields=${fieldCount} locales=${LOCALES.length}`);
