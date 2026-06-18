#!/usr/bin/env node
/**
 * Safe schema → bundle sync (add-only field merge, never clobber localized copy).
 * Run in prebuild after generate:all so new schemas get bundle slots without regressions.
 */
import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { createPhraseTranslator } from "./lib/generate-translate-phrase.mjs";
import { mergeToolBundle } from "./lib/merge-field-i18n-bundle.mjs";

const ROOT = join(import.meta.dirname, "..");
const SCHEMAS_DIR = join(ROOT, "generated", "schemas");
const BUNDLE_PATH = join(ROOT, "src/data/free-tool-inputs-i18n.generated.json");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];

const PHRASE_GLOSSARY = JSON.parse(
  readFileSync(join(ROOT, "src/data/calculator-phrase-glossary.json"), "utf8"),
);
const FIELD_LABEL_MAP = JSON.parse(
  readFileSync(join(ROOT, "scripts/data/calculator-field-labels-i18n.json"), "utf8"),
);
const COPY_MAP_PATH = join(ROOT, "scripts/data/generated-schema-copy-i18n.json");
const COPY_MAP = existsSync(COPY_MAP_PATH)
  ? JSON.parse(readFileSync(COPY_MAP_PATH, "utf8"))
  : { labels: {}, helpers: {} };

const { buildFieldCopy } = createPhraseTranslator({
  phraseGlossary: PHRASE_GLOSSARY,
  fieldLabelMap: FIELD_LABEL_MAP,
});

function loadGeneratedSchemaTools() {
  const files = readdirSync(SCHEMAS_DIR).filter((name) => name.endsWith("-schema.json"));
  const tools = [];

  for (const fileName of files) {
    const slug = fileName.replace(/-schema\.json$/, "");
    const raw = JSON.parse(readFileSync(join(SCHEMAS_DIR, fileName), "utf8"));
    const inputs = (raw.inputs ?? []).map((input) => {
      const label =
        input.label_i18n?.en?.trim() || input.label?.trim() || "";
      const helper =
        input.businessContext_i18n?.en?.trim() ||
        input.businessContext?.trim() ||
        "";
      return { key: input.id, label, helper };
    });
    tools.push({ slug, inputs });
  }

  return tools;
}

const tools = loadGeneratedSchemaTools();
const incoming = Object.fromEntries(LOCALES.map((locale) => [locale, {}]));

for (const tool of tools) {
  for (const locale of LOCALES) {
    incoming[locale][tool.slug] = {};
    for (const input of tool.inputs) {
      const fieldKey = input.key.toLowerCase();
      incoming[locale][tool.slug][fieldKey] = buildFieldCopy(
        locale,
        input.label,
        input.helper,
        input.key,
        COPY_MAP,
      );
    }
  }
}

const bundle = JSON.parse(readFileSync(BUNDLE_PATH, "utf8"));
for (const locale of LOCALES) {
  bundle[locale] = mergeToolBundle(bundle[locale] ?? {}, incoming[locale]);
}
writeFileSync(BUNDLE_PATH, `${JSON.stringify(bundle, null, 2)}\n`, "utf8");

console.log(`sync-schema-field-i18n: merged ${tools.length} schema tool(s) into bundle (add-only)`);
