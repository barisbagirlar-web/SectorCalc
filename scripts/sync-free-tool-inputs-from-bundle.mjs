#!/usr/bin/env node
/**
 * Canonical sync — overwrites messages.*.freeToolInputs from
 * src/data/free-tool-inputs-i18n.generated.json (single source of truth).
 * Run after generate:calculator-i18n or when legacy message overrides drift.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const LOCALES = ["en", "tr", "de", "fr", "es", "ar"];
const BUNDLE_PATH = join(ROOT, "src/data/free-tool-inputs-i18n.generated.json");

const bundle = JSON.parse(readFileSync(BUNDLE_PATH, "utf8"));

for (const locale of LOCALES) {
  const localeBundle = bundle[locale];
  if (!localeBundle || typeof localeBundle !== "object") {
    console.error(`Missing bundle locale: ${locale}`);
    process.exit(1);
  }

  const messagesPath = join(ROOT, "messages", `${locale}.json`);
  const messages = JSON.parse(readFileSync(messagesPath, "utf8"));
  messages.freeToolInputs = localeBundle;
  writeFileSync(messagesPath, `${JSON.stringify(messages, null, 2)}\n`, "utf8");

  const slugCount = Object.keys(localeBundle).length;
  console.log(`sync-free-tool-inputs: messages/${locale}.json ← bundle (${slugCount} tools)`);
}

console.log("sync-free-tool-inputs-from-bundle: complete");
