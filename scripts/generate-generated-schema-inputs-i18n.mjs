#!/usr/bin/env node
/**
 * Generated schema field copy — reads generated/schemas/*-schema.json,
 * produces 6-locale label/placeholder/helper bundles without mutating schema JSON.
 * Merges into messages.freeToolInputs and free-tool-inputs-i18n.generated.json.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const SCHEMAS_DIR = join(ROOT, "generated", "schemas");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];

const PHRASE_GLOSSARY = JSON.parse(
  readFileSync(join(ROOT, "src/data/calculator-phrase-glossary.json"), "utf8"),
);
const FIELD_LABEL_MAP = JSON.parse(
  readFileSync(join(ROOT, "scripts/data/calculator-field-labels-i18n.json"), "utf8"),
);

const PLACEHOLDER_TEMPLATES = {
  en: (label) => `Enter ${label.toLowerCase()}`,
  tr: (label) => `${label} girin`,
  de: (label) => `${label} eingeben`,
  fr: (label) => `Saisir ${label.toLowerCase()}`,
  es: (label) => `Introduzca ${label.toLowerCase()}`,
  ar: (label) => `أدخل ${label}`,
};

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

function loadGeneratedSchemaTools() {
  if (!readdirSync(ROOT).includes("generated")) {
    return [];
  }
  const files = readdirSync(SCHEMAS_DIR).filter((name) => name.endsWith("-schema.json"));
  const tools = [];

  for (const fileName of files) {
    const slug = fileName.replace(/-schema\.json$/, "");
    const raw = JSON.parse(readFileSync(join(SCHEMAS_DIR, fileName), "utf8"));
    const inputs = (raw.inputs ?? []).map((input) => ({
      key: input.id,
      label: input.label ?? "",
      helper: input.businessContext ?? "",
    }));
    tools.push({ slug, inputs });
  }

  return tools.sort((left, right) => left.slug.localeCompare(right.slug));
}

function mergeToolBundle(existing, incoming) {
  const merged = { ...existing };
  for (const [slug, fields] of Object.entries(incoming)) {
    merged[slug] = { ...(merged[slug] ?? {}), ...fields };
  }
  return merged;
}

const tools = loadGeneratedSchemaTools();
const bundle = Object.fromEntries(LOCALES.map((locale) => [locale, {}]));

for (const tool of tools) {
  for (const locale of LOCALES) {
    bundle[locale][tool.slug] = {};
    for (const input of tool.inputs) {
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

let fieldCount = 0;
for (const tool of tools) {
  fieldCount += tool.inputs.length;
}
console.log(`generated schemas=${tools.length} fields=${fieldCount} locales=${LOCALES.length}`);

const freeBundlePath = join(ROOT, "src/data/free-tool-inputs-i18n.generated.json");
const freeBundle = JSON.parse(readFileSync(freeBundlePath, "utf8"));

for (const locale of LOCALES) {
  freeBundle[locale] = mergeToolBundle(freeBundle[locale] ?? {}, bundle[locale]);
}
writeFileSync(freeBundlePath, `${JSON.stringify(freeBundle, null, 2)}\n`, "utf8");
console.log(`Merged generated schema inputs → ${freeBundlePath}`);

for (const locale of LOCALES) {
  const messagesPath = join(ROOT, "messages", `${locale}.json`);
  const messages = JSON.parse(readFileSync(messagesPath, "utf8"));
  messages.freeToolInputs = mergeToolBundle(messages.freeToolInputs ?? {}, bundle[locale]);
  writeFileSync(messagesPath, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
  console.log(`Merged generated schema inputs → messages/${locale}.json`);
}
