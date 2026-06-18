#!/usr/bin/env node
/**
 * Fix confirmed TR↔EN swaps in generated/schemas/*.json.
 * Only fixes cases manually verified from audit output.
 */
import fs from "node:fs";
import path from "node:path";

const SCHEMAS_DIR = path.resolve(process.cwd(), "generated/schemas");

// Each entry: [slug, fieldId, i18nKey] — businessContext_i18n for helpers, label_i18n for labels
const SWAPS = [
  ["magic-card-calculator", "batchSize", "businessContext_i18n"],
  ["radiation-calculator", "sourceActivity", "label_i18n"],
  ["radiation-calculator", "distance", "label_i18n"],
  ["radiation-calculator", "distance", "businessContext_i18n"],
  ["radiation-calculator", "gammaConstant", "label_i18n"],
  ["sugar-calculator", "batch_size", "label_i18n"],
  ["utf-8-bayt-hesaplayici-calculator", "asciiChars", "businessContext_i18n"],
  ["utf-8-bayt-hesaplayici-calculator", "twoByteChars", "businessContext_i18n"],
  ["utf-8-bayt-hesaplayici-calculator", "threeByteChars", "businessContext_i18n"],
  ["utf-8-bayt-hesaplayici-calculator", "fourByteChars", "businessContext_i18n"],
  ["utf-8-bayt-hesaplayici-calculator", "bomIncluded", "businessContext_i18n"],
  ["viscosity-converter-calculator", "fromUnit", "label_i18n"],
  ["viscosity-converter-calculator", "fromUnit", "businessContext_i18n"],
  ["viscosity-converter-calculator", "toUnit", "label_i18n"],
  ["viscosity-converter-calculator", "toUnit", "businessContext_i18n"],
  ["beer-pairing-calculator", "foodSpiciness", "label_i18n"],
];

let fixed = 0;
for (const [slug, id, i18nKey] of SWAPS) {
  const fp = path.join(SCHEMAS_DIR, `${slug}-schema.json`);
  if (!fs.existsSync(fp)) {
    console.error(`MISSING: ${slug}-schema.json`);
    continue;
  }
  const raw = JSON.parse(fs.readFileSync(fp, "utf8"));
  let found = false;
  for (const input of raw.inputs ?? []) {
    if (input.id === id && input[i18nKey]) {
      const i18n = input[i18nKey];
      const tr = (i18n.tr ?? "").trim();
      const en = (i18n.en ?? "").trim();
      if (tr && en && tr !== en) {
        console.log(`  ${slug}.${id}.${i18nKey}: tr="${tr.slice(0, 60)}" → en, en="${en.slice(0, 60)}" → tr`);
        i18n.tr = en;
        i18n.en = tr;
        fixed++;
        found = true;
      }
    }
  }
  if (!found) {
    console.error(`  NOT FOUND: ${slug}.${id}.${i18nKey}`);
  }
  fs.writeFileSync(fp, JSON.stringify(raw, null, 2) + "\n", "utf8");
}

console.log(`\nFixed ${fixed} swapped fields.`);
