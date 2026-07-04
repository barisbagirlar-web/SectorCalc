#!/usr/bin/env node
/**
 * Merges residual-field-label-locale.json into calculator-field-labels-i18n.json.
 */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const SOURCE = join(ROOT, "archive/migration-only/scripts/data/residual-field-label-locale.json");
const TARGET = join(ROOT, "archive/migration-only/scripts/data/calculator-field-labels-i18n.json");

if (!existsSync(SOURCE)) {
  console.log("patch-residual-field-label-locale: skip (no source file)");
  process.exit(0);
}

const residual = JSON.parse(readFileSync(SOURCE, "utf8"));
const fieldMap = JSON.parse(readFileSync(TARGET, "utf8"));
let changed = 0;

for (const [locale, entries] of Object.entries(residual)) {
  fieldMap[locale] ??= {};
  for (const [phrase, value] of Object.entries(entries ?? {})) {
    if (typeof value !== "string" || !value.trim()) {
      continue;
    }
    if (fieldMap[locale][phrase] !== value) {
      fieldMap[locale][phrase] = value;
      changed += 1;
    }
  }
}

writeFileSync(TARGET, `${JSON.stringify(fieldMap, null, 2)}\n`, "utf8");
console.log(`patch-residual-field-label-locale: changed=${changed}`);
