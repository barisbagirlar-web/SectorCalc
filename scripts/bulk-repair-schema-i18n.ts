#!/usr/bin/env npx tsx
/**
 * Bulk repair: tüm 3272 schema'daki hatalı i18n verisini düzeltir.
 *
 * Sorun: Schema generator `label_i18n.en`'e Türkçe metin yazmış,
 * tüm locale'ler aynı olduğu için audit en-identical raporluyor.
 *
 * Yöntem:
 *   1. label_i18n.en'in gerçekten İngilizce olup olmadığını tespit et
 *      (Türkçe/Almanca/Fransızca/İspanyolca/Arapça karakter içeriyorsa → bozuk)
 *   2. Bozuk English anchor'ları DeepSeek ile düzelt
 *   3. Düzgün English'ten tüm 5 locale'e çevir
 *   4. Schema dosyalarını güncelle
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvLocal, PROJECT_ROOT } from "./deepseek/load-env";

const SCHEMAS_DIR = path.join(PROJECT_ROOT, "generated", "schemas");
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const MODEL = "deepseek-chat";
const TARGET_LOCALES = ["tr", "de", "fr", "es", "ar"] as const;
const BATCH_SIZE = 15;
const RATE_LIMIT_MS = 500;

/** Non-EN character patterns per locale (to detect wrong anchors). */
const FOREIGN_PATTERNS: Record<string, RegExp> = {
  tr: /[çğıöşüÇĞİÖŞÜ]/,
  de: /[äöüßÄÖÜ]/,
  fr: /[àâçéèêëîïôùûüæœ]/i,
  es: /[áéíóúñü¿¡]/i,
  ar: /[\u0600-\u06FF]/,
};

type LocaleMap = Partial<Record<string, string>>;
type SchemaInput = {
  id?: string;
  label?: string;
  label_i18n?: LocaleMap;
  businessContext?: string;
  businessContext_i18n?: LocaleMap;
};
type SchemaFile = {
  toolName?: string;
  inputs?: SchemaInput[];
};

function isEnglish(text: string): boolean {
  return !Object.values(FOREIGN_PATTERNS).some((re) => re.test(text));
}

function looksNonEnglish(text: string): string | null {
  for (const [locale, re] of Object.entries(FOREIGN_PATTERNS)) {
    if (re.test(text)) return locale;
  }
  return null;
}

async function sleep(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

async function translateWithDeepSeek(
  phrases: string[],
  instruction: string,
  retries = 5,
): Promise<Map<string, string>> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY missing");

  const payload: Record<string, string> = {};
  for (let i = 0; i < phrases.length; i++) {
    payload[`k${i}`] = phrases[i];
  }

  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(DEEPSEEK_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          temperature: 0.05,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: instruction },
            { role: "user", content: JSON.stringify(payload) },
          ],
        }),
        signal: AbortSignal.timeout(180_000),
      });

      if (!response.ok) {
        const body = await response.text();
        if (attempt < retries) {
          const delay = Math.min(30_000, 2_000 * 2 ** (attempt - 1));
          console.warn(`  HTTP ${response.status} — retry ${attempt}/${retries - 1} in ${delay}ms`);
          await sleep(delay);
          continue;
        }
        throw new Error(`DeepSeek HTTP ${response.status}: ${body.slice(0, 300)}`);
      }

      const json = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const raw = json.choices?.[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(raw) as Record<string, string>;

      const results = new Map<string, string>();
      for (let i = 0; i < phrases.length; i++) {
        const translated = parsed[`k${i}`]?.trim();
        if (translated) {
          results.set(phrases[i], translated);
        }
      }
      return results;
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        const message = error instanceof Error ? error.message : String(error);
        const delay = Math.min(30_000, 2_000 * 2 ** (attempt - 1));
        console.warn(`  network retry ${attempt}/${retries - 1} in ${delay}ms (${message})`);
        await sleep(delay);
      }
    }
  }
  throw lastError;
}

/** Step 1: Collect all fields that need English anchor fix. */
type AnchorFixJob = {
  fileName: string;
  inputIndex: number;
  field: "label" | "businessContext";
  badText: string;
};

function collectAnchorFixes(schemas: Map<string, SchemaFile>): AnchorFixJob[] {
  const jobs: AnchorFixJob[] = [];
  for (const [fileName, schema] of schemas) {
    for (let i = 0; i < (schema.inputs ?? []).length; i++) {
      const input = schema.inputs![i];
      for (const field of ["label", "businessContext"] as const) {
        const i18nKey = field === "label" ? "label_i18n" : "businessContext_i18n";
        const i18n = input[i18nKey] as LocaleMap | undefined;
        const en = i18n?.en?.trim() || input[field]?.trim() || "";
        if (en && !isEnglish(en)) {
          jobs.push({ fileName, inputIndex: i, field, badText: en });
        }
      }
    }
  }
  return jobs;
}

/** Step 2: Fix English anchors via DeepSeek. */
async function fixEnglishAnchors(
  jobs: AnchorFixJob[],
  schemas: Map<string, SchemaFile>,
): Promise<number> {
  const unique = [...new Set(jobs.map((j) => j.badText))];
  console.log(`\nFixing ${unique.length} unique broken English anchor(s)...`);

  const translations = new Map<string, string>();
  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const batch = unique.slice(i, i + BATCH_SIZE);
    const instruction =
      "Translate each calculator field label to natural English. " +
      "Return JSON with same keys. Preserve units in parentheses (mmHg, kW, %, USD). " +
      "Input is NOT English — translate it properly.";
    const result = await translateWithDeepSeek(batch, instruction);
    for (const [src, en] of result) {
      translations.set(src, en);
    }
    console.log(`  anchor batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(unique.length / BATCH_SIZE)}`);
    await sleep(RATE_LIMIT_MS);
  }

  let applied = 0;
  for (const job of jobs) {
    const corrected = translations.get(job.badText);
    if (!corrected) continue;
    const schema = schemas.get(job.fileName);
    if (!schema) continue;
    const input = schema.inputs?.[job.inputIndex];
    if (!input) continue;
    const i18nKey = job.field === "label" ? "label_i18n" : "businessContext_i18n";
    input[i18nKey] = { ...(input[i18nKey] as LocaleMap), en: corrected };
    applied += 1;
  }

  console.log(`  fixed ${applied} anchor(s)`);
  return applied;
}

/** Step 3: Collect all locale slots needing translation. */
function collectTranslationJobs(schemas: Map<string, SchemaFile>): Map<string, string[]> {
  const jobs = new Map<string, Set<string>>();
  for (const locale of TARGET_LOCALES) {
    jobs.set(locale, new Set());
  }

  for (const [, schema] of schemas) {
    for (const input of schema.inputs ?? []) {
      for (const [i18nKey, fieldKey] of [["label_i18n", "label"] as const, ["businessContext_i18n", "businessContext"] as const]) {
        const i18n = input[i18nKey] as LocaleMap | undefined;
        const en = i18n?.en?.trim() || input[fieldKey]?.trim() || "";
        if (!en || !isEnglish(en)) continue;

        for (const locale of TARGET_LOCALES) {
          const localeVal = i18n?.[locale]?.trim();
          const isMissing = !localeVal;
          const isIdentical = localeVal === en;
          const isNonEnglish = localeVal ? looksNonEnglish(localeVal) !== null : false;
          if (isMissing || isIdentical || isNonEnglish) {
            jobs.get(locale)!.add(en);
          }
        }
      }
    }
  }

  const result = new Map<string, string[]>();
  for (const [locale, phrases] of jobs) {
    result.set(locale, [...phrases]);
  }
  return result;
}

/** Step 3b: Translate and apply to schemas. */
async function translateAndApply(
  translationJobs: Map<string, string[]>,
  schemas: Map<string, SchemaFile>,
): Promise<number> {
  let totalPatched = 0;
  const allTranslations = new Map<string, Map<string, string>>();

  for (const locale of TARGET_LOCALES) {
    const phrases = translationJobs.get(locale) ?? [];
    if (phrases.length === 0) {
      console.log(`  ${locale}: 0 phrase(s) — nothing to do`);
      continue;
    }

    console.log(`\n${locale}: ${phrases.length} unique phrase(s)`);
    const localeMap = new Map<string, string>();

    for (let i = 0; i < phrases.length; i += BATCH_SIZE) {
      const batch = phrases.slice(i, i + BATCH_SIZE);
      const instruction =
        `Translate each industrial calculator field label to ${locale}. ` +
        "Return JSON with same keys. Preserve units in parentheses (mmHg, kW, %). " +
        "Output natural UI copy, not word-by-word English.";
      const result = await translateWithDeepSeek(batch, instruction);
      for (const [en, translated] of result) {
        localeMap.set(en, translated);
      }
      console.log(
        `  batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(phrases.length / BATCH_SIZE)}`,
      );
      await sleep(RATE_LIMIT_MS);
    }

    allTranslations.set(locale, localeMap);
  }

  // Apply
  for (const [, schema] of schemas) {
    for (const input of schema.inputs ?? []) {
      for (const [i18nKey, fieldKey] of [["label_i18n", "label"] as const, ["businessContext_i18n", "businessContext"] as const]) {
        const i18n = input[i18nKey] as LocaleMap | undefined;
        const en = i18n?.en?.trim() || input[fieldKey]?.trim() || "";
        if (!en || !isEnglish(en)) continue;

        for (const locale of TARGET_LOCALES) {
          const localeMap = allTranslations.get(locale);
          if (!localeMap) continue;
          const translated = localeMap.get(en);
          if (!translated) continue;
          const current = i18n?.[locale]?.trim();
          // Skip if already has a valid non-identical, English translation
          if (current && current !== en && isEnglish(current)) continue;
          if (!input[i18nKey]) {
            (input as Record<string, unknown>)[i18nKey] = { en };
          }
          (input[i18nKey] as LocaleMap)[locale] = translated;
          totalPatched += 1;
        }
      }
    }
  }

  return totalPatched;
}

function writeSchemas(schemas: Map<string, SchemaFile>): number {
  let written = 0;
  for (const [fileName, schema] of schemas) {
    const filePath = path.join(SCHEMAS_DIR, fileName);
    const before = fs.readFileSync(filePath, "utf8");
    const after = JSON.stringify(schema, null, 2) + "\n";
    if (before !== after) {
      fs.writeFileSync(filePath, after);
      written += 1;
    }
  }
  return written;
}

async function main(): Promise<void> {
  loadEnvLocal();

  const dryRun = process.argv.includes("--dry-run");
  if (!process.env.DEEPSEEK_API_KEY?.trim() && !dryRun) {
    console.error("DEEPSEEK_API_KEY required in .env.local");
    process.exit(1);
  }

  console.log("=== Bulk Schema i18n Repair ===");

  // Load all schemas
  const files = fs.readdirSync(SCHEMAS_DIR).filter((name) => name.endsWith("-schema.json"));
  console.log(`Loading ${files.length} schema file(s)...`);
  const schemas = new Map<string, SchemaFile>();
  for (const fileName of files) {
    schemas.set(fileName, JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, fileName), "utf8")) as SchemaFile);
  }

  // Phase 1: Fix broken English anchors
  const anchorJobs = collectAnchorFixes(schemas);
  console.log(`\nPhase 1: ${anchorJobs.length} broken English anchor(s) found`);
  if (!dryRun && anchorJobs.length > 0) {
    const fixed = await fixEnglishAnchors(anchorJobs, schemas);
    console.log(`Phase 1 done: ${fixed} anchor(s) corrected`);
  }

  // Phase 2: Translate missing/identical/non-English locale slots
  const translationJobs = collectTranslationJobs(schemas);
  let totalLocaleCount = 0;
  for (const [, phrases] of translationJobs) {
    totalLocaleCount += phrases.length;
  }
  console.log(`\nPhase 2: ${totalLocaleCount} locale phrase(s) need translation`);

  let patched = 0;
  if (!dryRun && totalLocaleCount > 0) {
    patched = await translateAndApply(translationJobs, schemas);
    console.log(`\nPhase 2 done: ${patched} locale slot(s) patched`);
  }

  // Write schemas
  if (!dryRun) {
    const written = writeSchemas(schemas);
    console.log(`\nWritten: ${written} schema file(s) updated`);

    // Final check
    const remainingAnchors = collectAnchorFixes(schemas);
    const remainingTranslations = collectTranslationJobs(schemas);
    let remainingCount = 0;
    for (const [, phrases] of remainingTranslations) remainingCount += phrases.length;

    console.log(`\n=== Summary ===`);
    console.log(`Remaining broken anchors: ${remainingAnchors.length}`);
    console.log(`Remaining untranslated locales: ${remainingCount}`);
    console.log(`\nNext steps:`);
    console.log(`  npm run generate:all && npm run sync:schema-field-i18n`);
    console.log(`  npm run audit:schema-field-i18n`);
  } else {
    console.log(`\nDry run — no files written.`);
    console.log(`Would fix ${anchorJobs.length} anchors, ${totalLocaleCount} locale slots.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
