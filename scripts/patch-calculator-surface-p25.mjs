#!/usr/bin/env node
/**
 * DEPRECATED — word-by-word TR glossary pass on messages.freeToolInputs corrupts field copy.
 * Field copy SSOT: src/data/free-tool-inputs-i18n.generated.json
 * Use: npm run sync:free-tool-inputs
 */
console.error(
  "patch-calculator-surface-p25: DEPRECATED — skipped (use sync:free-tool-inputs + generate:calculator-i18n)",
);
process.exit(0);

/**
 * P25 — patch TR calculator surface glossary + revenue free-tool input labels.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const glossaryPath = join(ROOT, "src/data/calculator-phrase-glossary.json");
const messagesPath = (locale) => join(ROOT, "messages", `${locale}.json`);

// TR_GLOSSARY_PATCH removed — Turkish content has been cleaned

// REVENUE_TR_INPUTS removed — Turkish content has been cleaned

console.log("patch-calculator-surface-p25: TR content removed — script preserves other locales");
