#!/usr/bin/env npx tsx
/**
 * Fix raw `label` and `businessContext` fields in all schemas.
 * The bundle (free-tool-inputs-i18n.generated.json) is built from RAW fields,
 * NOT from `_i18n` properties. So Phase 1's `_i18n.en` fixes had no effect on the bundle.
 *
 * Strategy: For each schema input, check if `label` or `businessContext` contain
 * non-English text (using same heuristic as Phase 1 + DeepSeek verification).
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

type SchemaInput = Record<string, unknown>;
type SchemaFile = Record<string, unknown>;

function hasNonEnglishChars(text: string): boolean {
  return Object.values(FOREIGN_PATTERNS).some((re) => re.test(text));
}

async function sleep(ms: number): Promise<void> {
  await new Promise((r) => setTimeout(r, ms));
}

async function checkAndFixBatch(
  texts: string[],
  retries = 5,
): Promise<Map<string, string | null>> {
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY missing");

  const payload: Record<string, string> = {};
  for (let i = 0; i < texts.length; i++) payload[`k${i}`] = texts[i];

  const instruction =
    "You are a multilingual translator. For each calculator field label/helper, " +
    "determine if it is natural English. Return JSON with same keys. If the text IS English, " +
    "set value to the string 'OK'. If NOT English, provide the correct English translation. " +
    "Preserve units in parentheses (mmHg, kW, %, USD, km, ha). " +
    "Examples: 'Uzunluk' → 'Length', 'Minimum' → 'OK', 'Tarla 1 (ha)' → 'Field 1 (ha)', " +
    "'Mevcut Saat (0-23)' → 'Current Hour (0-23)', 'Şu anki saat dilimi.' → 'Current time zone.', " +
    "'Protein' → 'OK', 'a₀' → 'OK'.";

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
          temperature: 0.02,
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
        if (attempt < retries) { await sleep(Math.min(30_000, 2_000 * 2 ** (attempt - 1))); continue; }
        throw new Error(`HTTP ${response.status}: ${body.slice(0, 300)}`);
      }
      const json = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
      const raw = json.choices?.[0]?.message?.content ?? "{}";
      const parsed = JSON.parse(raw) as Record<string, string>;
      const results = new Map<string, string | null>();
      for (let i = 0; i < texts.length; i++) {
        const val = parsed[`k${i}`]?.trim();
        if (!val) continue;
        results.set(texts[i], val === "OK" || val === `"OK"` ? null : val);
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

  // Load schemas
  const files = fs.readdirSync(SCHEMAS_DIR).filter((n) => n.endsWith("-schema.json"));
  console.log(`Loading ${files.length} schema(s)...`);
  const schemas = new Map<string, SchemaFile>();
  for (const f of files) {
    schemas.set(f, JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, f), "utf8")));
  }

  // Collect raw field texts that might be non-English
  type RawField = { file: string; idx: number; field: "label" | "businessContext"; text: string };
  const candidates: RawField[] = [];
  const uniqueTexts = new Set<string>();

  for (const [fname, schema] of schemas) {
    const inputs = schema.inputs as SchemaInput[] | undefined;
    if (!inputs) continue;
    for (let i = 0; i < inputs.length; i++) {
      for (const field of ["label", "businessContext"] as const) {
        const text = (inputs[i][field] as string ?? "").trim();
        if (!text) continue;
        // Include if: has detectable non-EN chars, OR matches known Turkish patterns
        if (hasNonEnglishChars(text)) {
          uniqueTexts.add(text);
          candidates.push({ file: fname, idx: i, field, text });
        }
      }
    }
  }

  const unique = [...uniqueTexts];
  console.log(`Raw field text(s) with foreign chars: ${candidates.length}`);
  console.log(`Unique texts to check: ${unique.length}`);

  if (unique.length === 0) {
    console.log("Nothing to fix.");
    return;
  }

  if (dryRun) {
    console.log("Dry run — would check & fix these.");
    return;
  }

  // Step 1: Check with DeepSeek
  console.log("\nStep 1: Checking which texts are non-English...");
  const fixes = new Map<string, string>(); // original → corrected English

  for (let i = 0; i < unique.length; i += BATCH_SIZE) {
    const batch = unique.slice(i, i + BATCH_SIZE);
    const result = await checkAndFixBatch(batch);
    for (const [text, correction] of result) {
      if (correction !== null) {
        fixes.set(text, correction);
      }
    }
    console.log(`  batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(unique.length / BATCH_SIZE)}`);
    await sleep(RATE_LIMIT_MS);
  }

  console.log(`Found ${fixes.size} non-English text(s) to fix.`);
  if (fixes.size === 0) {
    console.log("All texts are already English.");
    return;
  }

  // Step 2: Apply fixes to raw fields
  let applied = 0;
  for (const candidate of candidates) {
    const correction = fixes.get(candidate.text);
    if (!correction) continue;
    const schema = schemas.get(candidate.file);
    if (!schema) continue;
    const inputs = schema.inputs as SchemaInput[] | undefined;
    if (!inputs || !inputs[candidate.idx]) continue;
    inputs[candidate.idx][candidate.field] = correction;
    applied += 1;
  }

  const written = writeSchemas(schemas);
  console.log(`Applied: ${applied} raw field fix(es)`);
  console.log(`Written: ${written} schema file(s)`);

  // Count remaining
  let remaining = 0;
  for (const [, schema] of schemas) {
    const inputs = schema.inputs as SchemaInput[] | undefined;
    if (!inputs) continue;
    for (const input of inputs) {
      for (const field of ["label", "businessContext"] as const) {
        const text = (input[field] as string ?? "").trim();
        if (text && hasNonEnglishChars(text)) remaining += 1;
      }
    }
  }
  console.log(`\nRemaining raw fields with foreign chars: ${remaining}`);
  console.log(remaining === 0 ? "✅ All raw fields fixed." : `⚠ ${remaining} still need attention.`);
  console.log("\nNext: npm run sync:schema-field-i18n && npm run audit:schema-field-i18n");
}

main().catch((err) => { console.error(err); process.exit(1); });
