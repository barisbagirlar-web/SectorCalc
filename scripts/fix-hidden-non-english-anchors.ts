#!/usr/bin/env npx tsx
/**
 * Detect and fix `en` anchors that contain non-English text WITHOUT special characters.
 * Phase 1 missed these because words like "Uzunluk", "Tarla", "Saat" use only Latin chars.
 *
 * Strategy: For fields where en === tr (suggesting non-English anchor), ask DeepSeek
 * to determine if the text IS English. If not, provide the correct English version.
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvLocal, PROJECT_ROOT } from "./deepseek/load-env";

const SCHEMAS_DIR = path.join(PROJECT_ROOT, "generated", "schemas");
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const MODEL = "deepseek-chat";
const BATCH_SIZE = 20;
const RATE_LIMIT_MS = 500;

const FOREIGN_PATTERNS: Record<string, RegExp> = {
  tr: /[çğıöşüÇĞİÖŞÜ]/,
  de: /[äöüßÄÖÜ]/,
  fr: /[àâçéèêëîïôùûüæœÀÂÇÉÈÊËÎÏÔÙÛÜÆŒ]/,
  es: /[áéíóúñü¿¡ÁÉÍÓÚÑÜ]/,
  ar: /[\u0600-\u06FF]/,
};

function hasNonEnglishChars(text: string): boolean {
  return Object.values(FOREIGN_PATTERNS).some((re) => re.test(text));
}

type LocaleMap = Record<string, string>;
type SchemaInput = Record<string, unknown>;
type SchemaFile = Record<string, unknown>;

async function sleep(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

async function checkEnglishBatch(
  texts: string[],
  retries = 5,
): Promise<Map<string, string | null>> {
  // Returns Map<original_text, corrected_english_or_null>  (null = already English)
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY missing");

  const payload: Record<string, string> = {};
  for (let i = 0; i < texts.length; i++) payload[`k${i}`] = texts[i];

  let lastError: unknown;
  const instruction =
    "You are a multilingual translator. For each calculator field label, determine if it is natural English. " +
    "Return JSON with same keys. If the text IS English, set value to the string 'OK'. " +
    "If the text is NOT English (e.g., Turkish, German, French), provide the correct English translation. " +
    "Preserve units in parentheses (mmHg, kW, %, USD, km, ha). " +
    "Examples: 'Uzunluk' → 'Length', 'Minimum' → 'OK', 'Tarla 1 (ha)' → 'Field 1 (ha)', 'Protein' → 'OK', 'a₀' → 'OK'.";

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
          temperature: 0.02,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: instruction },
            { role: "user", content: JSON.stringify(payload) },
          ],
        }),
        signal: AbortSignal.timeout(120_000),
      });
      if (!response.ok) {
        const body = await response.text();
        if (attempt < retries) {
          await sleep(Math.min(30_000, 2_000 * 2 ** (attempt - 1)));
          continue;
        }
        throw new Error(`HTTP ${response.status}: ${body.slice(0, 300)}`);
      }
      const json = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
      const raw = json.choices?.[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(raw) as Record<string, string>;

      const results = new Map<string, string | null>();
      for (let i = 0; i < texts.length; i++) {
        const val = parsed[`k${i}`]?.trim();
        if (!val) continue;
        if (val === "OK" || val === `"OK"`) {
          results.set(texts[i], null);
        } else {
          results.set(texts[i], val);
        }
      }
      return results;
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

async function translateToTurkishBatch(
  texts: string[],
  retries = 5,
): Promise<Map<string, string>> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY missing");

  const payload: Record<string, string> = {};
  for (let i = 0; i < texts.length; i++) payload[`k${i}`] = texts[i];

  const instruction =
    "Translate each industrial calculator field label to Turkish. " +
    "Return JSON with same keys. Preserve units in parentheses (mmHg, kW, %, USD, km). " +
    "Output natural Turkish UI copy, not word-by-word English.";

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
        signal: AbortSignal.timeout(120_000),
      });
      if (!response.ok) {
        const body = await response.text();
        if (attempt < retries) { await sleep(Math.min(30_000, 2_000 * 2 ** (attempt - 1))); continue; }
        throw new Error(`HTTP ${response.status}: ${body.slice(0, 300)}`);
      }
      const json = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
      const raw = json.choices?.[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(raw) as Record<string, string>;
      const map = new Map<string, string>();
      for (let i = 0; i < texts.length; i++) {
        const t = parsed[`k${i}`]?.trim();
        if (t) map.set(texts[i], t);
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

function writeSchemas(schemas: Map<string, SchemaFile>): number {
  let written = 0;
  for (const [fname, schema] of schemas) {
    const fp = path.join(SCHEMAS_DIR, fname);
    const before = fs.readFileSync(fp, "utf8");
    const after = JSON.stringify(schema, null, 2) + "\n";
    if (before !== after) {
      fs.writeFileSync(fp, after);
      written += 1;
    }
  }
  return written;
}

async function main() {
  loadEnvLocal();
  const dryRun = process.argv.includes("--dry-run");
  if (!process.env.DEEPSEEK_API_KEY?.trim() && !dryRun) {
    console.error("DEEPSEEK_API_KEY required");
    process.exit(1);
  }

  // Collect suspicious fields (en == tr identical)
  const files = fs.readdirSync(SCHEMAS_DIR).filter((n) => n.endsWith("-schema.json"));
  const schemas = new Map<string, SchemaFile>();
  for (const f of files) {
    schemas.set(f, JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, f), "utf8")));
  }

  // Fields where en === tr (suggests non-English anchor)
  const suspectTexts = new Set<string>();
  const suspectJobs: Array<{ file: string; idx: number; field: "label" | "businessContext"; text: string }> = [];

  for (const [fname, schema] of schemas) {
    const inputs = schema.inputs as SchemaInput[] | undefined;
    if (!inputs) continue;
    for (let i = 0; i < inputs.length; i++) {
      for (const f of ["label", "businessContext"] as const) {
        const i18nKey = f === "label" ? "label_i18n" : "businessContext_i18n";
        const i18n = inputs[i][i18nKey] as LocaleMap | undefined;
        if (!i18n) continue;
        const en = (i18n.en ?? "").trim();
        const raw = (inputs[i][f] as string ?? "").trim();
        if (!raw || !en) continue;
        // Only flag if raw === en AND raw has NO foreign characters.
        // Cases with foreign chars were already fixed by fix-raw-schema-fields.ts
        const hasForeign = hasNonEnglishChars(raw);
        if (!hasForeign && raw === en && raw.length > 3) {
          suspectTexts.add(raw);
          suspectJobs.push({ file: fname, idx: i, field: f, text: raw });
        }
      }
    }
  }

  const uniqueTexts = [...suspectTexts];
  console.log(`Suspicious fields (en === tr): ${suspectJobs.length}`);
  console.log(`Unique texts: ${uniqueTexts.length}`);

  if (uniqueTexts.length === 0) {
    console.log("Nothing to fix.");
    return;
  }

  if (dryRun) {
    console.log("Dry run — would check & fix these.");
    return;
  }

  // Step 1: Check which are non-English
  console.log("\nStep 1: Verifying English status...");
  type EnFix = { original: string; correction: string };
  const fixes: EnFix[] = [];

  for (let i = 0; i < uniqueTexts.length; i += BATCH_SIZE) {
    const batch = uniqueTexts.slice(i, i + BATCH_SIZE);
    const result = await checkEnglishBatch(batch);
    for (const [text, correction] of result) {
      if (correction !== null) {
        fixes.push({ original: text, correction });
      }
    }
    console.log(`  batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(uniqueTexts.length / BATCH_SIZE)}`);
    await sleep(RATE_LIMIT_MS);
  }

  console.log(`Found ${fixes.length} non-English text(s) to fix.`);

  if (fixes.length === 0) {
    console.log("All suspicious texts are already English. Nothing to fix.");
    return;
  }

  // Step 2: Apply English fixes to schemas
  let enFixed = 0;
  const fixedEnglishTexts = new Set(fixes.map((f) => f.original));
  for (const job of suspectJobs) {
    if (!fixedEnglishTexts.has(job.text)) continue;
    const fix = fixes.find((f) => f.original === job.text);
    if (!fix) continue;
    const schema = schemas.get(job.file);
    if (!schema) continue;
    const inputs = schema.inputs as SchemaInput[] | undefined;
    if (!inputs || !inputs[job.idx]) continue;
    const i18nKey = job.field === "label" ? "label_i18n" : "businessContext_i18n";
    const existing = inputs[job.idx][i18nKey] as LocaleMap | undefined;
    inputs[job.idx][i18nKey] = { ...(existing ?? {}), en: fix.correction };
    // Also fix the raw label/businessContext field (used by bundle builder)
    const rawKey = job.field;
    inputs[job.idx][rawKey] = fix.correction;
    enFixed += 1;
  }
  console.log(`Fixed ${enFixed} English anchor(s).`);

  // Step 3: After fixing en, translate tr from proper English
  // (because tr currently has the old non-English text which no longer matches new en)
  const trPhrases = new Set<string>();
  for (const job of suspectJobs) {
    if (!fixedEnglishTexts.has(job.text)) continue;
    const schema = schemas.get(job.file);
    if (!schema) continue;
    const inputs = schema.inputs as SchemaInput[] | undefined;
    if (!inputs || !inputs[job.idx]) continue;
    const i18nKey = job.field === "label" ? "label_i18n" : "businessContext_i18n";
    const i18n = inputs[job.idx][i18nKey] as LocaleMap | undefined;
    const newEn = i18n?.en?.trim();
    if (newEn) trPhrases.add(newEn);
  }

  if (trPhrases.size > 0) {
    const trList = [...trPhrases];
    console.log(`\nStep 3: Translating ${trList.length} phrase(s) to Turkish...`);
    const trMap = new Map<string, string>();

    for (let i = 0; i < trList.length; i += BATCH_SIZE) {
      const batch = trList.slice(i, i + BATCH_SIZE);
      const result = await translateToTurkishBatch(batch);
      for (const [en, tr] of result) trMap.set(en, tr);
      console.log(`  batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(trList.length / BATCH_SIZE)}`);
      await sleep(RATE_LIMIT_MS);
    }

    let trFixed = 0;
    for (const job of suspectJobs) {
      if (!fixedEnglishTexts.has(job.text)) continue;
      const schema = schemas.get(job.file);
      if (!schema) continue;
      const inputs = schema.inputs as SchemaInput[] | undefined;
      if (!inputs || !inputs[job.idx]) continue;
      const i18nKey = job.field === "label" ? "label_i18n" : "businessContext_i18n";
      const i18n = inputs[job.idx][i18nKey] as LocaleMap | undefined;
      const newEn = i18n?.en?.trim();
      if (!newEn) continue;
      const newTr = trMap.get(newEn);
      if (!newTr) continue;
      inputs[job.idx][i18nKey] = { ...(i18n ?? {}), tr: newTr };
      trFixed += 1;
    }
    console.log(`Fixed ${trFixed} Turkish locale slot(s).`);
  }

  // Write all
  const written = writeSchemas(schemas);
  console.log(`\nWritten: ${written} schema file(s).`);

  // Count remaining
  let remaining = 0;
  for (const [, schema] of schemas) {
    const inputs = schema.inputs as SchemaInput[] | undefined;
    if (!inputs) continue;
    for (const input of inputs) {
      for (const f of ["label", "businessContext"] as const) {
        const i18nKey = f === "label" ? "label_i18n" : "businessContext_i18n";
        const i18n = input[i18nKey] as LocaleMap | undefined;
        if (!i18n) continue;
        if ((i18n.en ?? "").trim() === (i18n.tr ?? "").trim() && i18n.en?.trim()) {
          remaining += 1;
        }
      }
    }
  }
  console.log(`\nRemaining en===tr fields: ${remaining}`);
  console.log(remaining === 0 ? "✅ All fixed." : `⚠ ${remaining} still need attention.`);
}

main().catch((err) => { console.error(err); process.exit(1); });
