#!/usr/bin/env node
/**
 * Syncs free tool catalog copy into messages + generated runtime bundle.
 * Source: scripts/data/free-tool-catalog-translations.json (100 slugs × 5 locales)
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const TRANSLATIONS_PATH = join(ROOT, "scripts/data/free-tool-catalog-translations.json");
const OUT_JSON = join(ROOT, "src/data/free-tool-catalog-i18n.generated.json");
const LOCALES = ["tr", "de", "fr", "es", "ar"];

const translations = JSON.parse(readFileSync(TRANSLATIONS_PATH, "utf8"));

writeFileSync(OUT_JSON, `${JSON.stringify(translations, null, 2)}\n`, "utf8");
console.log(`Wrote ${OUT_JSON}`);

for (const locale of LOCALES) {
  const messagesPath = join(ROOT, "messages", `${locale}.json`);
  const messages = JSON.parse(readFileSync(messagesPath, "utf8"));
  messages.freeToolContent = translations[locale];
  writeFileSync(messagesPath, `${JSON.stringify(messages, null, 2)}\n`, "utf8");
  console.log(`Merged freeToolContent into messages/${locale}.json (${Object.keys(translations[locale]).length} tools)`);
}
