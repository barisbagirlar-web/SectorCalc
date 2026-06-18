#!/usr/bin/env npx tsx
/**
 * Phase 1 only: Fix broken English anchors in all 3272 schemas.
 * Detects non-English text in `label_i18n.en` / `businessContext_i18n.en`
 * and translates to proper English via DeepSeek.
 *
 * Run this FIRST, then run translate-schema-fields-with-deepseek.ts --force
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvLocal, PROJECT_ROOT } from "./deepseek/load-env";

const SCHEMAS_DIR = path.join(PROJECT_ROOT, "generated", "schemas");
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const MODEL = "deepseek-chat";
const BATCH_SIZE = 15;
const RATE_LIMIT_MS = 500;

const FOREIGN_PATTERNS: Record<string, RegExp> = {
  tr: /[çğıöşüÇĞİÖŞÜ]/,
  de: /[äöüßÄÖÜ]/,
  fr: /[àâçéèêëîïôùûüæœÀÂÇÉÈÊËÎÏÔÙÛÜÆŒ]/,
  es: /[áéíóúñü¿¡ÁÉÍÓÚÑÜ]/,
  ar: /[\u0600-\u06FF]/,
};

type LocaleMap = Partial<Record<string, string>>;
type SchemaInput = Record<string, unknown>;
type SchemaFile = Record<string, unknown>;
type AnchorFixJob = { fileName: string; inputIndex: number; field: "label" | "businessContext"; badEn: string };

function isEnglish(text: string): boolean {
  return !Object.values(FOREIGN_PATTERNS).some((re) => re.test(text));
}

async function sleep(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

async function translateBatch(
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
          await sleep(Math.min(30_000, 2_000 * 2 ** (attempt - 1)));
          continue;
        }
        throw new Error(`DeepSeek HTTP ${response.status}: ${body.slice(0, 300)}`);
      }
      const json = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
      const raw = json.choices?.[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(raw) as Record<string, string>;
      const map = new Map<string, string>();
      for (let i = 0; i < phrases.length; i++) {
        const t = parsed[`k${i}`]?.trim();
        if (t) map.set(phrases[i], t);
      }
      return map;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        const msg = err instanceof Error ? err.message : String(err);
        console.warn(`  retry ${attempt}/${retries - 1} (${msg})`);
        await sleep(Math.min(30_000, 2_000 * 2 ** (attempt - 1)));
      }
    }
  }
  throw lastError;
}

function collectAnchorJobs(schemas: Map<string, SchemaFile>): AnchorFixJob[] {
  const jobs: AnchorFixJob[] = [];
  for (const [fileName, schema] of schemas) {
    const inputs = (schema.inputs ?? []) as SchemaInput[];
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      for (const field of ["label", "businessContext"] as const) {
        const i18nKey = field === "label" ? "label_i18n" : "businessContext_i18n";
        const i18n = input[i18nKey] as LocaleMap | undefined;
        const en = i18n?.en?.trim() || (input[field] as string ?? "").trim();
        if (en && !isEnglish(en)) {
          jobs.push({ fileName, inputIndex: i, field, badEn: en });
        }
      }
    }
  }
  return jobs;
}

async function fixAnchors(
  jobs: AnchorFixJob[],
  schemas: Map<string, SchemaFile>,
): Promise<number> {
  const unique = [...new Set(jobs.map((j) => j.badEn))];
  console.log(`Fixing ${unique.length} unique broken English phrase(s)...`);

  const translations = new Map<string, string>();
  const total = unique.length;
  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = unique.slice(i, i + BATCH_SIZE);
    const result = await translateBatch(batch,
      "Translate each calculator field label to natural English. " +
      "Return JSON with same keys. Preserve units in parentheses (mmHg, kW, %, USD). " +
      "Input is NOT English — translate it properly."
    );
    for (const [src, en] of result) translations.set(src, en);
    console.log(`  batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(total / BATCH_SIZE)}`);
    await sleep(RATE_LIMIT_MS);
  }

  let applied = 0;
  for (const job of jobs) {
    const corrected = translations.get(job.badEn);
    if (!corrected) continue;
    const schema = schemas.get(job.fileName);
    if (!schema) continue;
    const inputs = schema.inputs as SchemaInput[] | undefined;
    if (!inputs || !inputs[job.inputIndex]) continue;
    const i18nKey = job.field === "label" ? "label_i18n" : "businessContext_i18n";
    const existing = inputs[job.inputIndex][i18nKey] as LocaleMap | undefined;
    // Fix the en anchor (spread existing FIRST so en override works)
    inputs[job.inputIndex][i18nKey] = { ...(existing ?? {}), en: corrected };
    applied += 1;
  }

  console.log(`  fixed ${applied} anchor(s)`);
  return applied;
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

function checkRemaining(schemas: Map<string, SchemaFile>): number {
  let count = 0;
  for (const [, schema] of schemas) {
    const inputs = (schema.inputs ?? []) as SchemaInput[];
    for (const input of inputs) {
      for (const field of ["label", "businessContext"] as const) {
        const i18nKey = field === "label" ? "label_i18n" : "businessContext_i18n";
        const i18n = input[i18nKey] as LocaleMap | undefined;
        const en = i18n?.en?.trim() || (input[field] as string ?? "").trim();
        if (en && !isEnglish(en)) count += 1;
      }
    }
  }
  return count;
}

async function main() {
  loadEnvLocal();
  const dryRun = process.argv.includes("--dry-run");
  if (!process.env.DEEPSEEK_API_KEY?.trim() && !dryRun) {
    console.error("DEEPSEEK_API_KEY required");
    process.exit(1);
  }

  console.log("=== Phase 1: Fix English Anchors ===");
  const files = fs.readdirSync(SCHEMAS_DIR).filter((n) => n.endsWith("-schema.json"));
  console.log(`Loading ${files.length} schema(s)...`);
  const schemas = new Map<string, SchemaFile>();
  for (const f of files) {
    schemas.set(f, JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, f), "utf8")));
  }

  const jobs = collectAnchorJobs(schemas);
  console.log(`Broken anchors found: ${jobs.length}`);
  if (jobs.length === 0) {
    console.log("Nothing to fix.");
    return;
  }

  if (dryRun) {
    console.log("Dry run — skipping API calls & writes.");
    return;
  }

  const fixed = await fixAnchors(jobs, schemas);
  const written = writeSchemas(schemas);
  const remaining = checkRemaining(schemas);

  console.log(`\n=== Phase 1 Complete ===`);
  console.log(`Fixed: ${fixed} anchors`);
  console.log(`Written: ${written} schema file(s)`);
  console.log(`Remaining broken anchors: ${remaining}`);

  if (remaining === 0) {
    console.log(`\n✅ All English anchors fixed.`);
    console.log(`\nNext step: npm run translate:schema-deepseek -- --force`);
  } else {
    console.log(`\n⚠ ${remaining} anchor(s) still broken — need another pass.`);
  }
}

main().catch((err) => { console.error(err); process.exit(1); });
