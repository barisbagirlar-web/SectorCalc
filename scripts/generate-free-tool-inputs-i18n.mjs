#!/usr/bin/env node
/**
 * Generates locale-specific calculator field copy (label, placeholder, helper)
 * for every free-traffic + roadmap catalog input. Merges into messages/*.json
 * and writes src/data/free-tool-inputs-i18n.generated.json
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];
const PHRASE_GLOSSARY = JSON.parse(
  readFileSync(join(ROOT, "src/data/calculator-phrase-glossary.json"), "utf8"),
);
const FIELD_LABEL_MAP = JSON.parse(
  readFileSync(join(ROOT, "scripts/data/calculator-field-labels-i18n.json"), "utf8"),
);

const CATALOG_PATHS = [
  "src/lib/tools/free-traffic-catalog.generated.json",
  "src/lib/tools/roadmap-free-batch1-catalog.generated.json",
  "src/lib/tools/roadmap-free-batch2-catalog.generated.json",
];

const PLACEHOLDER_TEMPLATES = {
  en: (label) => `Enter ${label.toLowerCase()}`,
  tr: (label) => `${label} girin`,
  de: (label) => `${label} eingeben`,
  fr: (label) => `Saisir ${label.toLowerCase()}`,
  es: (label) => `Introduzca ${label.toLowerCase()}`,
  ar: (label) => `أدخل ${label}`,
};

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

function sortedGlossaryEntries(locale) {
  const glossary = PHRASE_GLOSSARY[locale] ?? {};
  return Object.entries(glossary).sort((a, b) => b[0].length - a[0].length);
}

function translatePhrase(text, locale) {
  if (!text || locale === "en") {
    return text;
  }
  const fieldLabel = FIELD_LABEL_MAP[locale]?.[text];
  if (fieldLabel) {
    return fieldLabel;
  }
  if (PHRASE_GLOSSARY[locale]?.[text]) {
    return PHRASE_GLOSSARY[locale][text];
  }
  let result = text;
  for (const [en, localized] of sortedGlossaryEntries(locale)) {
    const re = new RegExp(en.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    result = result.replace(re, localized);
  }
  return result;
}

function humanizeKey(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .trim();
}

function buildFieldCopy(locale, enLabel, enHelper, key) {
  const labelSource = enLabel?.trim() || humanizeKey(key);
  const helperSource = enHelper?.trim() || labelSource;
  const label = locale === "en" ? labelSource : translatePhrase(labelSource, locale);
  const helper = locale === "en" ? helperSource : translatePhrase(helperSource, locale);
  const placeholder = PLACEHOLDER_TEMPLATES[locale](label);
  return { label, placeholder, helper };
}

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
        );
      }
    }
  }

  return bundle;
}

const bundle = buildBundle();
const outPath = join(ROOT, "src/data/free-tool-inputs-i18n.generated.json");
writeFileSync(outPath, `${JSON.stringify(bundle, null, 2)}\n`, "utf8");
console.log(`Wrote ${outPath}`);

let fieldCount = 0;
for (const tool of loadCatalogTools()) {
  fieldCount += (tool.inputs ?? []).length;
}
console.log(`tools=${loadCatalogTools().length} fields=${fieldCount} locales=${LOCALES.length}`);

for (const locale of LOCALES) {
  const messagesPath = join(ROOT, "messages", `${locale}.json`);
  const messages = JSON.parse(readFileSync(messagesPath, "utf8"));
  messages.freeToolInputs = bundle[locale];
  writeFileSync(messagesPath, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
  console.log(`Merged freeToolInputs into messages/${locale}.json`);
}
