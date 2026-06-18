#!/usr/bin/env node
/**
 * One-time fix: update EN entries in free-tool-inputs-i18n.generated.json
 * to use `label_i18n.en` / `businessContext_i18n.en` from schemas.
 *
 * Non-EN locales are NOT touched (preserve existing translations).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { readdirSync } from "node:fs";

const ROOT = join(import.meta.dirname, "..");
const SCHEMAS_DIR = join(ROOT, "generated", "schemas");
const BUNDLE_PATH = join(ROOT, "src/data/free-tool-inputs-i18n.generated.json");
const LOCALE_KEY = "en";
const FIELDS = ["label", "placeholder", "helper"];

const bundle = JSON.parse(readFileSync(BUNDLE_PATH, "utf8"));
const files = readdirSync(SCHEMAS_DIR).filter((name) => name.endsWith("-schema.json"));

let enPatched = 0;
let missingLabel = 0;

for (const fileName of files) {
  const slug = fileName.replace(/-schema\.json$/, "");
  const raw = JSON.parse(readFileSync(join(SCHEMAS_DIR, fileName), "utf8"));

  for (const input of raw.inputs ?? []) {
    const key = (input.id ?? "").toLowerCase();
    if (!key) continue;

    const enLabel = input.label_i18n?.en?.trim() || input.label?.trim() || "";
    const enHelper = input.businessContext_i18n?.en?.trim() || input.businessContext?.trim() || "";

    if (!enLabel) {
      missingLabel += 1;
      continue;
    }

    // Check if bundle EN entry exists and differs
    const existing = bundle[LOCALE_KEY]?.[slug]?.[key];
    if (existing?.label === enLabel && existing?.helper === enHelper) {
      continue; // already correct
    }

    // Create or update bundle EN entry
    if (!bundle[LOCALE_KEY]) bundle[LOCALE_KEY] = {};
    if (!bundle[LOCALE_KEY][slug]) bundle[LOCALE_KEY][slug] = {};
    if (!bundle[LOCALE_KEY][slug][key]) bundle[LOCALE_KEY][slug][key] = {};

    // Only overwrite label/helper if we have better data
    const entry = bundle[LOCALE_KEY][slug][key];
    if (enLabel && entry.label !== enLabel) {
      entry.label = enLabel;
    }
    if (enHelper && entry.helper !== enHelper) {
      entry.helper = enHelper;
    }

    // Re-derive placeholder from label
    entry.placeholder = entry.label
      ? `Enter ${entry.label.toLowerCase()}`
      : entry.placeholder;

    enPatched += 1;
  }
}

writeFileSync(BUNDLE_PATH, JSON.stringify(bundle, null, 2) + "\n", "utf8");

console.log(`Bundle EN fix complete.`);
console.log(`  Schema files scanned: ${files.length}`);
console.log(`  EN entries patched: ${enPatched}`);
console.log(`  Missing labels skipped: ${missingLabel}`);
console.log(`\nNext: re-run audit to verify.`);
