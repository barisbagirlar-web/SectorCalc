#!/usr/bin/env npx tsx
/**
 * DeepSeek batch translation for schema label_i18n / businessContext_i18n gaps.
 * Deduplicates English phrases — only fills missing or EN-identical locale slots.
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvLocal, PROJECT_ROOT } from "./deepseek/load-env";
import { loadBatchKeyPool, resolveDeepSeekApiKey } from "./deepseek/deepseek-key-pool";
import { buildGlossaryPromptForLocale } from "../src/lib/i18n/locale-glossary";
import { SUPPORTED_LOCALES, type SupportedLocale } from "../src/lib/i18n/locale-config";

const SCHEMAS_DIR = path.join(PROJECT_ROOT, "generated", "schemas");
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const MODEL = "deepseek-chat";
const TARGET_LOCALES = SUPPORTED_LOCALES.filter((locale) => locale !== "en");
const BATCH_SIZE = 25;
const RATE_LIMIT_MS = 400;

type LocaleMap = Partial<Record<SupportedLocale, string>>;
type SchemaInput = {
  id?: string;
  label?: string;
  label_i18n?: LocaleMap;
  businessContext?: string;
  businessContext_i18n?: LocaleMap;
};

type SchemaFile = {
  inputs?: SchemaInput[];
};

type TranslationJob = {
  english: string;
  locale: SupportedLocale;
  field: "label" | "businessContext";
};

let forceRetranslate = false;
let batchCounter = 0;

function resolveApiKeyForBatch(): string {
  batchCounter += 1;
  const pool = loadBatchKeyPool();
  if (pool.length > 0) {
    const shardId = ((batchCounter - 1) % pool.length) + 1;
    const key = resolveDeepSeekApiKey(shardId);
    if (key) {
      return key;
    }
  }
  const direct = process.env.DEEPSEEK_API_KEY?.trim();
  if (direct) {
    return direct;
  }
  throw new Error("DEEPSEEK_API_KEY missing — set in .env.local or .env.batch.keys.local");
}

function needsTranslation(map: LocaleMap | undefined, english: string, locale: SupportedLocale): boolean {
  if (forceRetranslate) {
    return true;
  }
  const en = map?.en?.trim() || english.trim();
  const value = map?.[locale]?.trim();
  if (!value) {
    return true;
  }
  return value === en || value === english.trim();
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function translateBatch(
  phrases: readonly string[],
  locale: SupportedLocale,
): Promise<Map<string, string>> {
  const apiKey = resolveApiKeyForBatch();

  const payload = Object.fromEntries(phrases.map((phrase, index) => [`k${index}`, phrase]));
  const reverse = Object.fromEntries(phrases.map((phrase, index) => [`k${index}`, phrase]));
  const glossaryPrompt = buildGlossaryPromptForLocale(locale);

  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            `Translate industrial calculator field labels and helper text to ${locale}.\n` +
            `${glossaryPrompt}\n` +
            "Return JSON only: each key maps to translated string. Preserve units in parentheses (mmHg, kW, %). " +
            "Output natural UI copy, not word-by-word English.",
        },
        { role: "user", content: JSON.stringify(payload) },
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
  const raw = json.choices?.[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(raw) as Record<string, string>;

  const results = new Map<string, string>();
  for (const [key, translated] of Object.entries(parsed)) {
    const source = reverse[key];
    if (source && typeof translated === "string" && translated.trim()) {
      results.set(source, translated.trim());
    }
  }
  return results;
}

function collectJobs(schemas: Map<string, SchemaFile>, activeLocales: readonly SupportedLocale[]): TranslationJob[] {
  const jobs: TranslationJob[] = [];
  const seen = new Set<string>();

  for (const schema of schemas.values()) {
    for (const input of schema.inputs ?? []) {
      const labelEn = input.label?.trim() ?? input.label_i18n?.en?.trim() ?? "";
      const helperEn = input.businessContext?.trim() ?? input.businessContext_i18n?.en?.trim() ?? "";

      for (const locale of activeLocales) {
        if (labelEn && needsTranslation(input.label_i18n, labelEn, locale)) {
          const key = `label::${locale}::${labelEn}`;
          if (!seen.has(key)) {
            seen.add(key);
            jobs.push({ english: labelEn, locale, field: "label" });
          }
        }
        if (helperEn && needsTranslation(input.businessContext_i18n, helperEn, locale)) {
          const key = `helper::${locale}::${helperEn}`;
          if (!seen.has(key)) {
            seen.add(key);
            jobs.push({ english: helperEn, locale, field: "businessContext" });
          }
        }
      }
    }
  }

  return jobs;
}

function applyTranslations(
  schemas: Map<string, SchemaFile>,
  translations: Map<string, string>,
  activeLocales: readonly SupportedLocale[],
): number {
  let patched = 0;

  for (const schema of schemas.values()) {
    for (const input of schema.inputs ?? []) {
      const labelEn = input.label?.trim() ?? input.label_i18n?.en?.trim() ?? "";
      const helperEn = input.businessContext?.trim() ?? input.businessContext_i18n?.en?.trim() ?? "";

      if (labelEn) {
        input.label_i18n = { en: labelEn, ...(input.label_i18n ?? {}) };
        for (const locale of activeLocales) {
          const translated = translations.get(`label::${locale}::${labelEn}`);
          if (translated && needsTranslation(input.label_i18n, labelEn, locale)) {
            input.label_i18n[locale] = translated;
            patched += 1;
          }
        }
      }

      if (helperEn) {
        input.businessContext_i18n = { en: helperEn, ...(input.businessContext_i18n ?? {}) };
        for (const locale of activeLocales) {
          const translated = translations.get(`businessContext::${locale}::${helperEn}`);
          if (translated && needsTranslation(input.businessContext_i18n, helperEn, locale)) {
            input.businessContext_i18n[locale] = translated;
            patched += 1;
          }
        }
      }
    }
  }

  return patched;
}

function writeSchemaFiles(schemas: Map<string, SchemaFile>): number {
  let filesWritten = 0;
  for (const [fileName, schema] of schemas) {
    const filePath = path.join(SCHEMAS_DIR, fileName);
    const before = fs.readFileSync(filePath, "utf8");
    const after = `${JSON.stringify(schema, null, 2)}\n`;
    if (before !== after) {
      fs.writeFileSync(filePath, after);
      filesWritten += 1;
    }
  }
  return filesWritten;
}

async function main(): Promise<void> {
  loadEnvLocal();

  const dryRun = process.argv.includes("--dry-run");
  forceRetranslate = process.argv.includes("--force");
  const limitArg = process.argv.find((arg) => arg.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.split("=")[1]) : undefined;
  const localesArg = process.argv.find((arg) => arg.startsWith("--locales="));
  const activeLocales = localesArg
    ? localesArg
        .split("=")[1]
        .split(",")
        .filter((locale): locale is SupportedLocale =>
          (TARGET_LOCALES as readonly string[]).includes(locale),
        )
    : TARGET_LOCALES;

  const schemaFiles = fs.readdirSync(SCHEMAS_DIR).filter((name) => name.endsWith("-schema.json"));
  const schemas = new Map<string, SchemaFile>();

  for (const fileName of schemaFiles) {
    const filePath = path.join(SCHEMAS_DIR, fileName);
    schemas.set(fileName, JSON.parse(fs.readFileSync(filePath, "utf8")) as SchemaFile);
  }

  let jobs = collectJobs(schemas, activeLocales);
  if (limit !== undefined && Number.isFinite(limit)) {
    jobs = jobs.slice(0, limit);
  }

  console.log(
    `translate-schema-fields-with-deepseek: ${jobs.length} unique phrase job(s)${forceRetranslate ? " (force)" : ""}`,
  );
  console.log(`locales: ${activeLocales.join(", ")} (en = source anchor, not translated)`);
  const poolSize = loadBatchKeyPool().length;
  if (poolSize > 0) {
    console.log(`key pool: ${poolSize} key(s) — rotating per batch`);
  }
  const skipLocalesArg = process.argv.find((arg) => arg.startsWith("--skip-locales="));
  const skipLocales = new Set(
    (skipLocalesArg?.split("=")[1] ?? "")
      .split(",")
      .map((locale) => locale.trim())
      .filter(Boolean),
  );
  const localesToRun = activeLocales.filter((locale) => !skipLocales.has(locale));
  if (skipLocales.size > 0) {
    console.log(`skipping completed locale(s): ${[...skipLocales].join(", ")}`);
  }
  if (jobs.length === 0) {
    console.log("Nothing to translate.");
    return;
  }

  if (dryRun) {
    console.log("Dry run — no schema files will be written.");
    return;
  }

  if (!process.env.DEEPSEEK_API_KEY?.trim()) {
    console.error("DEEPSEEK_API_KEY required");
    process.exit(1);
  }

  const byLocale = new Map<SupportedLocale, TranslationJob[]>();
  for (const job of jobs) {
    const bucket = byLocale.get(job.locale) ?? [];
    bucket.push(job);
    byLocale.set(job.locale, bucket);
  }

  let totalPatched = 0;
  let totalFilesWritten = 0;

  for (const locale of localesToRun) {
    const localeJobs = byLocale.get(locale) ?? [];
    const uniquePhrases = [...new Set(localeJobs.map((job) => job.english))];
    console.log(`\n${locale}: ${uniquePhrases.length} unique phrase(s)`);

    const localeTranslations = new Map<string, string>();

    for (let i = 0; i < uniquePhrases.length; i += BATCH_SIZE) {
      const batch = uniquePhrases.slice(i, i + BATCH_SIZE);
      const batchResults = await translateBatch(batch, locale);
      for (const [english, translated] of batchResults) {
        for (const field of ["label", "businessContext"] as const) {
          localeTranslations.set(`${field}::${locale}::${english}`, translated);
        }
      }
      console.log(`  batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(uniquePhrases.length / BATCH_SIZE)}`);
      await sleep(RATE_LIMIT_MS);
    }

    const patched = applyTranslations(schemas, localeTranslations, [locale]);
    const filesWritten = writeSchemaFiles(schemas);
    totalPatched += patched;
    totalFilesWritten += filesWritten;
    console.log(`  saved ${locale}: ${patched} slot(s), ${filesWritten} schema file(s) updated`);
  }

  console.log(`\nDone — ${totalPatched} field locale slot(s), ${totalFilesWritten} total schema writes.`);
  console.log("Next: npm run generate:all && npm run sync:schema-field-i18n");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
