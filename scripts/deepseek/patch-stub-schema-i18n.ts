#!/usr/bin/env npx tsx
/** Strip stub (TR)/(DE) suffixes — keep en only so phrase translator fills 6 locales. */
import fs from "node:fs";
import path from "node:path";
import { PROJECT_ROOT } from "./load-env";

const SCHEMAS_DIR = path.join(PROJECT_ROOT, "generated", "schemas");

function patchI18nField(raw: unknown, fallback: string): Record<string, string> {
  const en =
    raw && typeof raw === "object" && typeof (raw as Record<string, string>).en === "string"
      ? (raw as Record<string, string>).en.replace(/\s*\([A-Z]{2}\)\s*$/i, "").trim()
      : fallback;
  return { en };
}

let patched = 0;
for (const file of fs.readdirSync(SCHEMAS_DIR)) {
  if (!file.endsWith("-schema.json")) continue;
  const filePath = path.join(SCHEMAS_DIR, file);
  const raw = JSON.parse(fs.readFileSync(filePath, "utf-8")) as {
    inputs?: { label?: string; label_i18n?: unknown; businessContext?: string; businessContext_i18n?: unknown }[];
    meta?: { name?: string };
  };
  if (!Array.isArray(raw.inputs)) continue;
  let changed = false;
  for (const input of raw.inputs) {
    const nextLabel = patchI18nField(input.label_i18n, input.label ?? "");
    const nextCtx = patchI18nField(input.businessContext_i18n, input.businessContext ?? "");
    if (JSON.stringify(input.label_i18n) !== JSON.stringify(nextLabel)) {
      input.label_i18n = nextLabel;
      changed = true;
    }
    if (JSON.stringify(input.businessContext_i18n) !== JSON.stringify(nextCtx)) {
      input.businessContext_i18n = nextCtx;
      changed = true;
    }
  }
  if (changed) {
    fs.writeFileSync(filePath, `${JSON.stringify(raw, null, 2)}\n`);
    patched += 1;
  }
}
console.log(`patched i18n on ${patched} schemas`);
