#!/usr/bin/env npx tsx
/**
 * Ensure every schema input has label_i18n / businessContext_i18n with English anchors.
 * Copies label → label_i18n.en and businessContext → businessContext_i18n.en when missing.
 */
import fs from "node:fs";
import path from "node:path";
import { PROJECT_ROOT } from "./deepseek/load-env";

const SCHEMAS_DIR = path.join(PROJECT_ROOT, "generated", "schemas");

type SchemaInput = {
  label?: string;
  label_i18n?: Record<string, string>;
  businessContext?: string;
  businessContext_i18n?: Record<string, string>;
};

type SchemaFile = {
  inputs?: SchemaInput[];
};

function ensureEnglishAnchors(input: SchemaInput): boolean {
  let changed = false;

  const labelEn = input.label?.trim() ?? input.label_i18n?.en?.trim() ?? "";
  if (labelEn) {
    const next = { ...(input.label_i18n ?? {}), en: labelEn };
    if (JSON.stringify(input.label_i18n) !== JSON.stringify(next)) {
      input.label_i18n = next;
      changed = true;
    }
  }

  const helperEn = input.businessContext?.trim() ?? input.businessContext_i18n?.en?.trim() ?? "";
  if (helperEn) {
    const next = { ...(input.businessContext_i18n ?? {}), en: helperEn };
    if (JSON.stringify(input.businessContext_i18n) !== JSON.stringify(next)) {
      input.businessContext_i18n = next;
      changed = true;
    }
  }

  return changed;
}

let schemasPatched = 0;
let inputsPatched = 0;

for (const fileName of fs.readdirSync(SCHEMAS_DIR).filter((name) => name.endsWith("-schema.json"))) {
  const filePath = path.join(SCHEMAS_DIR, fileName);
  const schema = JSON.parse(fs.readFileSync(filePath, "utf8")) as SchemaFile;
  if (!Array.isArray(schema.inputs)) {
    continue;
  }

  let fileChanged = false;
  for (const input of schema.inputs) {
    if (ensureEnglishAnchors(input)) {
      inputsPatched += 1;
      fileChanged = true;
    }
  }

  if (fileChanged) {
    fs.writeFileSync(filePath, `${JSON.stringify(schema, null, 2)}\n`);
    schemasPatched += 1;
  }
}

console.log(`add-i18n-to-schemas: ${schemasPatched} schema file(s), ${inputsPatched} input slot(s) patched`);
