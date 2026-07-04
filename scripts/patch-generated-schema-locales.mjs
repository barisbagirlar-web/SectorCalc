#!/usr/bin/env node
/**
 * Patches generated schema label_i18n / businessContext_i18n with cached translations.
 * Uses phrase/fuzzy matching: strips parenthetical units, matches base text, preserves en/tr.
 * Run: node scripts/patch-generated-schema-locales.mjs
 */
import { existsSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const SCHEMAS_DIR = join(ROOT, "generated", "schemas");
const CACHE_PATH = join(ROOT, "archive/migration-only/scripts/data/generated-schema-copy-i18n.json");

if (!existsSync(CACHE_PATH)) {
  console.error("Translation cache not found:", CACHE_PATH);
  process.exit(1);
}

const cache = JSON.parse(readFileSync(CACHE_PATH, "utf8"));

const TARGET_LOCALES = ["de", "fr", "es", "ar"];

function stripParen(str) {
  return str.replace(/\s*\(.*?\)\s*/g, "").trim().toLowerCase();
}

function hasLocaleTranslations(entry) {
  if (!entry || typeof entry !== "object") return false;
  return TARGET_LOCALES.some((locale) => Boolean(entry[locale]));
}

function findCacheEntry(enText, map) {
  if (!enText || !map) return null;
  // Exact match — only use if it has real translations
  const exact = map[enText];
  if (exact && hasLocaleTranslations(exact)) return exact;
  // Fuzzy match: strip parenthetical content
  const stripped = stripParen(enText);
  for (const [key, value] of Object.entries(map)) {
    if (stripParen(key) === stripped && hasLocaleTranslations(value)) {
      return value;
    }
    // Broader: key contains stripped text
    if (key.toLowerCase().includes(stripped) && hasLocaleTranslations(value)) {
      return value;
    }
  }
  return null;
}

function mergeLocaleMap(existing, enText, cacheMap) {
  if (!enText || !cacheMap) return existing;
  const sourceEntry = findCacheEntry(enText, cacheMap);
  if (!sourceEntry) return existing;
  const result = { ...(existing || {}) };
  for (const locale of TARGET_LOCALES) {
    const current = result[locale];
    const cached = sourceEntry[locale];
    if (!current && cached) {
      result[locale] = cached;
    } else if (current && cached && stripParen(current) === stripParen(enText)) {
      result[locale] = cached;
    }
  }
  return result;
}

function patchSchema(slug, raw) {
  let changed = false;

  // Tool title
  const titleEn = raw.title?.trim() || raw.toolName?.trim();
  const titleMap = cache.toolTitles?.[slug];
  if (titleEn && titleMap) {
    for (const locale of TARGET_LOCALES) {
      if (titleMap[locale] && raw.title_i18n?.[locale] !== titleMap[locale]) {
        if (!raw.title_i18n) raw.title_i18n = { en: titleEn };
        raw.title_i18n[locale] = titleMap[locale];
        changed = true;
      }
    }
  }

  // Description
  const descEn = raw.description?.trim();
  const descMap = cache.descriptions?.[slug];
  if (descEn && descMap) {
    for (const locale of TARGET_LOCALES) {
      if (descMap[locale] && raw.description_i18n?.[locale] !== descMap[locale]) {
        if (!raw.description_i18n) raw.description_i18n = { en: descEn };
        raw.description_i18n[locale] = descMap[locale];
        changed = true;
      }
    }
  }

  // Input labels & helpers
  for (const input of raw.inputs ?? []) {
    const enLabel = input.label_i18n?.en?.trim() || input.label?.trim();
    if (enLabel) {
      const patched = mergeLocaleMap(input.label_i18n, enLabel, cache.labels);
      if (JSON.stringify(input.label_i18n) !== JSON.stringify(patched)) {
        input.label_i18n = patched;
        changed = true;
      }
    }

    const enHelper = input.businessContext_i18n?.en?.trim() || input.businessContext?.trim();
    if (enHelper) {
      const patched = mergeLocaleMap(input.businessContext_i18n, enHelper, cache.helpers);
      if (JSON.stringify(input.businessContext_i18n) !== JSON.stringify(patched)) {
        input.businessContext_i18n = patched;
        changed = true;
      }
    }
  }

  return changed;
}

// Process all schemas
const files = readdirSync(SCHEMAS_DIR).filter((name) => name.endsWith("-schema.json"));
let patched = 0;
let skipped = 0;

for (const fileName of files) {
  const slug = fileName.replace(/-schema\.json$/, "");
  const filePath = join(SCHEMAS_DIR, fileName);
  const raw = JSON.parse(readFileSync(filePath, "utf8"));

  if (patchSchema(slug, raw)) {
    writeFileSync(filePath, JSON.stringify(raw, null, 2) + "\n", "utf8");
    patched++;
  } else {
    skipped++;
  }
}

console.log(`Patched: ${patched} schemas, Skipped (already up-to-date): ${skipped}`);
