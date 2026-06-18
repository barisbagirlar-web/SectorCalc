#!/usr/bin/env npx tsx
/**
 * Repair premium generated schemas with stub sum formulas via DeepSeek.
 * Preserves inputs/i18n; replaces formulas + outputs only.
 *
 * Usage:
 *   npx tsx scripts/deepseek/repair-stub-premium-formulas.ts --limit=25
 *   npx tsx scripts/deepseek/repair-stub-premium-formulas.ts --limit=25 --offset=25
 */
import fs from "node:fs";
import path from "node:path";
import { compileFormulaExpression } from "@/lib/generated-tools/compile-formula-expression";
import { toSafeVarName } from "@/lib/generated-tools/export-names";
import {
  isStubSumFormula,
  validateIndustrialSchema,
} from "@/lib/generated-tools/validate-industrial-schema";
import { loadEnvLocal, PROJECT_ROOT } from "./load-env";
import { resolveDeepSeekApiKey } from "./deepseek-key-pool";
import { repairJsonText } from "./schema-json-utils";
import { generateFromSchemaFile } from "./generate-from-schema";

loadEnvLocal();

const SCHEMAS_DIR = path.join(PROJECT_ROOT, "generated", "schemas");
const GENERATED_DIR = path.join(PROJECT_ROOT, "generated");
const PROGRESS_PATH = path.join(PROJECT_ROOT, "scripts/.cache/stub-premium-repair-progress.json");
const REPORT_PATH = path.join(PROJECT_ROOT, "scripts/.cache/stub-premium-repair-report.json");
const DEEPSEEK_API_URL = "https://api.deepseek.com/chat/completions";
const MODEL = "deepseek-chat";
const RATE_LIMIT_MS = 600;

type SchemaRecord = Record<string, unknown> & {
  toolName?: string;
  premiumRequired?: boolean;
  title?: string;
  description?: string;
  inputs?: Array<{ id: string; unit?: string; label?: string }>;
  formulas?: Record<string, string>;
  outputs?: Record<string, unknown>;
};

type RepairPatch = {
  formulas: Record<string, string>;
  outputs: Record<string, unknown>;
};

type ProgressState = {
  repaired: string[];
  failed: Array<{ slug: string; reason: string }>;
};

function parseArgs(): { limit: number; offset: number; dryRun: boolean; retryFailed: boolean } {
  let limit = 25;
  let offset = 0;
  let dryRun = false;
  let retryFailed = false;
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith("--limit=")) {
      limit = Number(arg.slice(8)) || 25;
    } else if (arg.startsWith("--offset=")) {
      offset = Number(arg.slice(9)) || 0;
    } else if (arg === "--dry-run") {
      dryRun = true;
    } else if (arg === "--retry-failed") {
      retryFailed = true;
    }
  }
  return { limit: Math.min(Math.max(limit, 1), 50), offset: Math.max(offset, 0), dryRun, retryFailed };
}

function loadProgress(): ProgressState {
  if (!fs.existsSync(PROGRESS_PATH)) {
    return { repaired: [], failed: [] };
  }
  return JSON.parse(fs.readFileSync(PROGRESS_PATH, "utf8")) as ProgressState;
}

function saveProgress(state: ProgressState): void {
  fs.mkdirSync(path.dirname(PROGRESS_PATH), { recursive: true });
  fs.writeFileSync(PROGRESS_PATH, JSON.stringify(state, null, 2));
}

function listStubPremiumSchemas(): string[] {
  const slugs: string[] = [];
  for (const file of fs.readdirSync(SCHEMAS_DIR).filter((f) => f.endsWith("-schema.json"))) {
    const raw = JSON.parse(fs.readFileSync(path.join(SCHEMAS_DIR, file), "utf8")) as SchemaRecord;
    if (!raw.premiumRequired) {
      continue;
    }
    const inputIds = (raw.inputs ?? []).map((input) => input.id);
    const formulas = Object.values(raw.formulas ?? {}).filter((v) => typeof v === "string") as string[];
    if (formulas.length === 0) {
      continue;
    }
    const allStub = formulas.every((expr) => isStubSumFormula(expr, inputIds));
    if (allStub) {
      slugs.push(raw.toolName ?? file.replace("-schema.json", ""));
    }
  }
  return slugs.sort();
}

function buildRepairPrompt(schema: SchemaRecord): string {
  const inputLines = (schema.inputs ?? [])
    .map((input) => `- ${input.id} (${input.unit ?? "unit"}) — ${input.label ?? input.id}`)
    .join("\n");

  return `Repair ONLY formulas and outputs for this premium industrial calculator.

Tool: ${schema.toolName}
Title: ${schema.title ?? schema.toolName}
Description: ${schema.description ?? ""}

Inputs (use ALL numeric input ids across formulas; never add new inputs):
${inputLines}

RULES:
1. formulas must be valid JS expressions using input ids with + - * / ** and Math.* only
2. FORBIDDEN: stub sums like "a + b + c" without domain multiplication/units
3. At least 2 formula keys; primary output must reference real cost/efficiency/risk math
4. outputs.primary must exist in formulas
5. outputs.unit must match result type (cost tools → USD, rates → %, time → hours)
6. outputs.breakdown: array of 2-4 formula keys for sub-metrics
7. Include hiddenLossDrivers (2 strings) and suggestedActions (2 strings) in outputs

Return JSON ONLY:
{
  "formulas": { "result": "...", "annual_lost_hours": "...", ... },
  "outputs": {
    "primary": "result",
    "breakdown": ["annual_lost_hours", "..."],
    "unit": "USD",
    "hiddenLossDrivers": ["...", "..."],
    "suggestedActions": ["...", "..."],
    "dataConfidenceAdjusted": "result"
  }
}`;
}

function validatePatch(schema: SchemaRecord, patch: RepairPatch): string | null {
  const merged: SchemaRecord = {
    ...schema,
    formulas: patch.formulas,
    outputs: { ...(schema.outputs as object), ...patch.outputs },
  };
  const inputIds = (schema.inputs ?? []).map((input) => input.id);
  const formulaKeys = Object.keys(patch.formulas);

  if (formulaKeys.length < 2) {
    return "fewer than 2 formulas";
  }

  const primary = patch.outputs.primary;
  if (typeof primary !== "string" || !patch.formulas[primary]) {
    return "outputs.primary missing in formulas";
  }

  if (isStubSumFormula(patch.formulas[primary], inputIds)) {
    return "primary formula still stub sum";
  }

  const usedInputs = inputIds.filter((id) =>
    Object.values(patch.formulas).some((expression) => expression.includes(id)),
  ).length;
  if (inputIds.length >= 4 && usedInputs < Math.ceil(inputIds.length / 2)) {
    return `formulas use only ${usedInputs}/${inputIds.length} inputs`;
  }

  for (const [key, expression] of Object.entries(patch.formulas)) {
    const compiled = compileFormulaExpression(expression, {
      inputIds,
      inputToAccess: (inputId) => `input.${toSafeVarName(inputId)}`,
      formulaKeys,
      selfKey: key,
    });
    if (!compiled) {
      return `formula ${key} does not compile`;
    }
    if (isStubSumFormula(expression, inputIds)) {
      return `formula ${key} is stub sum`;
    }
  }

  const industrial = validateIndustrialSchema(merged);
  const critical = industrial.errors.filter(
    (error) =>
      error.includes("stub sum placeholder") ||
      error.includes("incomplete domain model") ||
      error.includes("output unit mismatch"),
  );
  if (critical.length > 0) {
    return critical.join("; ");
  }

  return null;
}

async function callDeepSeek(prompt: string, apiKey: string): Promise<RepairPatch> {
  const response = await fetch(DEEPSEEK_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an ISO 9001 industrial engineer. Output ONLY valid JSON for formulas and outputs.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.1,
      max_tokens: 2500,
      response_format: { type: "json_object" },
    }),
  });

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
    error?: { message?: string };
  };

  if (!response.ok) {
    throw new Error(payload.error?.message ?? `HTTP ${response.status}`);
  }

  const content = payload.choices?.[0]?.message?.content ?? "";
  const parsed = JSON.parse(repairJsonText(content)) as RepairPatch;
  if (!parsed.formulas || !parsed.outputs) {
    throw new Error("model response missing formulas/outputs");
  }
  return parsed;
}

async function repairSlug(slug: string, apiKey: string, dryRun: boolean): Promise<void> {
  const schemaPath = path.join(SCHEMAS_DIR, `${slug}-schema.json`);
  const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8")) as SchemaRecord;
  const patch = await callDeepSeek(buildRepairPrompt(schema), apiKey);
  const error = validatePatch(schema, patch);
  if (error) {
    throw new Error(error);
  }

  if (dryRun) {
    console.log(`DRY OK ${slug}`);
    return;
  }

  const nextSchema: SchemaRecord = {
    ...schema,
    formulas: patch.formulas,
    outputs: { ...(schema.outputs as object), ...patch.outputs },
  };
  fs.writeFileSync(schemaPath, `${JSON.stringify(nextSchema, null, 2)}\n`);

  const outPath = path.join(GENERATED_DIR, `${slug}.ts`);
  const compileFailures = generateFromSchemaFile(schemaPath, outPath);
  if (compileFailures > 0) {
    throw new Error(`${compileFailures} formula compile fallback(s)`);
  }
  console.log(`OK ${slug}`);
}

async function main(): Promise<void> {
  const { limit, offset, dryRun, retryFailed } = parseArgs();
  const apiKey = resolveDeepSeekApiKey();
  if (!apiKey) {
    console.error("BLOKER: DEEPSEEK_API_KEY missing");
    process.exit(1);
  }

  const all = listStubPremiumSchemas();
  const progress = loadProgress();
  const failedSlugs = new Set(progress.failed.map((row) => row.slug));
  const source = retryFailed ? [...failedSlugs] : all;
  const batch = source.slice(offset, offset + limit);
  const report: ProgressState = { repaired: [], failed: [] };

  console.log(`stub premium total=${all.length} batch=${batch.length} offset=${offset}`);

  for (const slug of batch) {
    if (progress.repaired.includes(slug)) {
      console.log(`SKIP ${slug} (already repaired)`);
      continue;
    }
    try {
      await repairSlug(slug, apiKey, dryRun);
      progress.repaired.push(slug);
      progress.failed = progress.failed.filter((row) => row.slug !== slug);
      report.repaired.push(slug);
      saveProgress(progress);
      await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_MS));
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      console.error(`FAIL ${slug}: ${reason}`);
      progress.failed = progress.failed.filter((row) => row.slug !== slug);
      progress.failed.push({ slug, reason });
      report.failed.push({ slug, reason });
      saveProgress(progress);
    }
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(
    REPORT_PATH,
    JSON.stringify({ generatedAt: new Date().toISOString(), offset, limit, ...report }, null, 2),
  );

  console.log(`repaired=${report.repaired.length} failed=${report.failed.length}`);
  process.exit(report.failed.length > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
