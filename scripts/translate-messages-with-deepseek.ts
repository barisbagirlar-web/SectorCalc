#!/usr/bin/env npx tsx
/**
 * Fill missing message keys in de/fr/es/ar using DeepSeek.
 * Only translates keys absent from target locale files — existing copy is preserved.
 */

import fs from "node:fs";
import path from "node:path";
import { loadEnvLocal, PROJECT_ROOT } from "./deepseek/load-env";
import {
  collectMissingTranslationKeys,
  type MissingTranslationKey,
} from "../src/lib/i18n/merge-locale-messages";
import { ROOT_LOCALE, SUPPORTED_LOCALES, type SupportedLocale } from "../src/lib/i18n/locale-config";
import { buildGlossaryPromptForLocale } from "../src/lib/i18n/locale-glossary";

const MESSAGES_DIR = path.join(PROJECT_ROOT, "messages");
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const MODEL = "deepseek-chat";
const TARGET_LOCALES = SUPPORTED_LOCALES.filter((locale) => locale !== ROOT_LOCALE && locale !== "tr");
const RATE_LIMIT_MS = 500;

const LOCALE_NAMES: Record<string, string> = {
  de: "German",
  fr: "French",
  es: "Spanish",
  ar: "Arabic",
};

const GLOSSARY_HINT =
  "SectorCalc is an industrial calculation platform — keep professional tone.";

type JsonObject = Record<string, unknown>;

function loadMessages(locale: string): JsonObject {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as JsonObject;
}

function saveMessages(locale: string, content: JsonObject): void {
  const filePath = path.join(MESSAGES_DIR, `${locale}.json`);
  fs.writeFileSync(filePath, `${JSON.stringify(content, null, 2)}\n`, "utf8");
}

function getValue(obj: JsonObject, keyPath: string): unknown {
  const parts = keyPath.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (!current || typeof current !== "object" || Array.isArray(current)) {
      return undefined;
    }
    current = (current as JsonObject)[part];
  }
  return current;
}

function setValue(obj: JsonObject, keyPath: string, value: string): void {
  const parts = keyPath.split(".");
  const last = parts.pop();
  if (!last) {
    return;
  }

  let current: JsonObject = obj;
  for (const part of parts) {
    const next = current[part];
    if (!next || typeof next !== "object" || Array.isArray(next)) {
      current[part] = {};
    }
    current = current[part] as JsonObject;
  }
  current[last] = value;
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function translateText(text: string, targetLocale: SupportedLocale): Promise<string> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY missing — set in .env.local");
  }

  const localeName = LOCALE_NAMES[targetLocale] ?? targetLocale;
  const glossaryPrompt = buildGlossaryPromptForLocale(targetLocale);

  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.1,
      max_tokens: 500,
      messages: [
        {
          role: "system",
          content:
            `You are a professional translator for industrial engineering and SaaS UI copy. ` +
            `Translate the English text to ${localeName} (${targetLocale}).\n\n` +
            `${glossaryPrompt}\n\n` +
            `${GLOSSARY_HINT} ` +
            "Preserve placeholders like {count}, {min}, {max}, {title}, {name}. " +
            "Output only the translated text, no explanations.",
        },
        { role: "user", content: text },
      ],
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`DeepSeek HTTP ${response.status}: ${body.slice(0, 400)}`);
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const translated = json.choices?.[0]?.message?.content?.trim();
  if (!translated) {
    throw new Error("DeepSeek returned empty translation");
  }
  return translated;
}

function groupMissingByLocale(
  enMessages: JsonObject,
  locales: readonly SupportedLocale[],
): Map<SupportedLocale, MissingTranslationKey[]> {
  const grouped = new Map<SupportedLocale, MissingTranslationKey[]>();

  for (const locale of locales) {
    const localeMessages = loadMessages(locale);
    const missing = collectMissingTranslationKeys(enMessages, localeMessages, locale);
    grouped.set(locale, missing);
  }

  return grouped;
}

async function main(): Promise<void> {
  loadEnvLocal();

  if (!process.env.DEEPSEEK_API_KEY?.trim()) {
    console.error("DEEPSEEK_API_KEY environment variable is required (.env.local)");
    process.exit(1);
  }

  const dryRun = process.argv.includes("--dry-run");
  const enMessages = loadMessages(ROOT_LOCALE);
  const grouped = groupMissingByLocale(enMessages, TARGET_LOCALES);

  let totalMissing = 0;
  for (const [locale, missing] of grouped) {
    totalMissing += missing.length;
    console.log(`${locale}: ${missing.length} missing key(s)`);
  }

  if (totalMissing === 0) {
    console.log("No missing keys — nothing to translate.");
    return;
  }

  console.log(`\nStarting DeepSeek translation for ${totalMissing} key(s)...`);
  if (dryRun) {
    console.log("Dry run — no files will be written.");
    return;
  }

  let translatedTotal = 0;
  let failedTotal = 0;

  for (const locale of TARGET_LOCALES) {
    const missing = grouped.get(locale) ?? [];
    if (missing.length === 0) {
      continue;
    }

    console.log(`\nProcessing ${locale} (${missing.length} keys)...`);
    const targetContent = loadMessages(locale);
    let translatedCount = 0;

    for (const { path: keyPath } of missing) {
      const sourceValue = getValue(enMessages, keyPath);
      if (typeof sourceValue !== "string") {
        continue;
      }

      console.log(`  Translating: ${keyPath}`);
      try {
        const translated = await translateText(sourceValue, locale);
        setValue(targetContent, keyPath, translated);
        translatedCount += 1;
        translatedTotal += 1;
        await sleep(RATE_LIMIT_MS);
      } catch (error) {
        failedTotal += 1;
        console.error(`  Failed: ${keyPath}`, error instanceof Error ? error.message : error);
      }
    }

    saveMessages(locale, targetContent);
    console.log(`  Saved ${locale}.json (${translatedCount} translated)`);
  }

  console.log(`\nDone — ${translatedTotal} translated, ${failedTotal} failed.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});