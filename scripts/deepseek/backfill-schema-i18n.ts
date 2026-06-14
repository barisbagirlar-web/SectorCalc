#!/usr/bin/env node
/**
 * Backfill label_i18n + businessContext_i18n on existing generated tool schemas.
 *
 * Usage:
 *   npm run backfill:schema-i18n
 *   npm run backfill:schema-i18n -- --slug cnc-cycle-time-calculator
 *   npm run backfill:schema-i18n -- --limit 10
 *   npm run backfill:schema-i18n -- --dry-run
 *   npm run backfill:schema-i18n -- --force
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fetchSchemaI18nBackfill, getDeepSeekModelName } from "./deepseek-client";
import { loadEnvLocal, PROJECT_ROOT } from "./load-env";
import { SCHEMA_I18N_BACKFILL_PROMPT } from "./prompts";
import {
  buildSchemaI18nBackfillPayload,
  countInputsNeedingI18nBackfill,
  mergeSchemaI18nBackfill,
  schemaNeedsI18nBackfill,
} from "@/lib/generated-tools/schema-i18n-status";
import { listGeneratedToolSchemaSlugs } from "@/lib/generated-tools/schema-loader";
import type { GeneratedToolSchema } from "@/lib/generated-tools/types";

const DEFAULT_SCHEMAS_DIR = path.join(PROJECT_ROOT, "generated", "schemas");
const PROGRESS_PATH = path.join(PROJECT_ROOT, "generated", "schema-i18n-backfill-progress.json");
const REQUESTS_PER_SECOND = 5;
const MIN_INTERVAL_MS = Math.ceil(1000 / REQUESTS_PER_SECOND);

export type BackfillSchemaI18nOptions = {
  readonly limit: number | null;
  readonly slug: string | null;
  readonly dryRun: boolean;
  readonly skipComplete: boolean;
  readonly force: boolean;
  readonly parallel: number;
  readonly retry: number;
  readonly outputDir: string;
};

export type SchemaI18nBackfillRecord = {
  readonly slug: string;
  readonly processedAt: string;
  readonly model: string;
  readonly ok: boolean;
  readonly skipped?: boolean;
  readonly error?: string;
  readonly schemaPath?: string;
  readonly inputsPatched?: number;
};

type BackfillProgressDocument = {
  readonly generatedAt: string;
  readonly generator: "scripts/deepseek/backfill-schema-i18n.ts";
  readonly summary: {
    readonly discovered: number;
    readonly selected: number;
    readonly succeeded: number;
    readonly failed: number;
    readonly skipped: number;
  };
  readonly tools: readonly SchemaI18nBackfillRecord[];
};

let schemasDir = DEFAULT_SCHEMAS_DIR;
let lastRequestAt = 0;

function parseKeyValueArg(arg: string, key: string): string | null {
  if (!arg.startsWith(`${key}=`)) {
    return null;
  }
  return arg.slice(key.length + 1).trim() || null;
}

export function parseCliOptions(argv: readonly string[]): BackfillSchemaI18nOptions {
  let limit: number | null = null;
  let slug: string | null = null;
  let dryRun = false;
  let skipComplete = true;
  let force = false;
  let parallel = 1;
  let retry = 3;
  let outputDir = "generated/schemas";

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (arg === "--skip-complete") {
      skipComplete = true;
      continue;
    }
    if (arg === "--no-skip-complete") {
      skipComplete = false;
      continue;
    }
    if (arg === "--force") {
      force = true;
      continue;
    }
    if (arg === "--limit") {
      const value = Number(argv[index + 1]);
      if (!Number.isFinite(value) || value <= 0) {
        throw new Error("--limit requires a positive number.");
      }
      limit = value;
      index += 1;
      continue;
    }
    if (arg === "--slug") {
      const value = argv[index + 1]?.trim();
      if (!value) {
        throw new Error("--slug requires a tool slug.");
      }
      slug = value;
      index += 1;
      continue;
    }

    const parallelValue = parseKeyValueArg(arg, "--parallel");
    if (parallelValue !== null) {
      const value = Number(parallelValue);
      if (!Number.isFinite(value) || value <= 0) {
        throw new Error("--parallel must be a positive number.");
      }
      parallel = value;
      continue;
    }

    const retryValue = parseKeyValueArg(arg, "--retry");
    if (retryValue !== null) {
      const value = Number(retryValue);
      if (!Number.isFinite(value) || value < 0) {
        throw new Error("--retry must be a non-negative number.");
      }
      retry = value;
      continue;
    }

    const outputValue = parseKeyValueArg(arg, "--output");
    if (outputValue !== null) {
      outputDir = outputValue;
    }
  }

  return { limit, slug, dryRun, skipComplete, force, parallel, retry, outputDir };
}

function resolveOutputDir(outputDir: string): string {
  return path.isAbsolute(outputDir) ? outputDir : path.join(PROJECT_ROOT, outputDir);
}

function schemaPathForSlug(slug: string): string {
  return path.join(schemasDir, `${slug}-schema.json`);
}

function readSchema(slug: string): GeneratedToolSchema | null {
  const schemaPath = schemaPathForSlug(slug);
  if (!fs.existsSync(schemaPath)) {
    return null;
  }
  const raw = fs.readFileSync(schemaPath, "utf8");
  return JSON.parse(raw) as GeneratedToolSchema;
}

function writeSchema(slug: string, schema: GeneratedToolSchema): string {
  const schemaPath = schemaPathForSlug(slug);
  fs.mkdirSync(path.dirname(schemaPath), { recursive: true });
  fs.writeFileSync(schemaPath, `${JSON.stringify(schema, null, 2)}\n`, "utf8");
  return schemaPath;
}

async function waitForRateLimit(): Promise<void> {
  const elapsed = Date.now() - lastRequestAt;
  if (elapsed < MIN_INTERVAL_MS) {
    await new Promise((resolve) => setTimeout(resolve, MIN_INTERVAL_MS - elapsed));
  }
  lastRequestAt = Date.now();
}

function writeProgress(records: readonly SchemaI18nBackfillRecord[]): void {
  fs.mkdirSync(path.dirname(PROGRESS_PATH), { recursive: true });
  const succeeded = records.filter((record) => record.ok && !record.skipped);
  const failed = records.filter((record) => !record.ok);
  const skipped = records.filter((record) => record.skipped);
  const document: BackfillProgressDocument = {
    generatedAt: new Date().toISOString(),
    generator: "scripts/deepseek/backfill-schema-i18n.ts",
    summary: {
      discovered: records.length,
      selected: records.length,
      succeeded: succeeded.length,
      failed: failed.length,
      skipped: skipped.length,
    },
    tools: records,
  };
  fs.writeFileSync(PROGRESS_PATH, `${JSON.stringify(document, null, 2)}\n`, "utf8");
}

export async function backfillSchemaI18nForSlug(
  slug: string,
  options: Pick<BackfillSchemaI18nOptions, "skipComplete" | "force">,
): Promise<SchemaI18nBackfillRecord> {
  const processedAt = new Date().toISOString();
  const model = getDeepSeekModelName();
  const schema = readSchema(slug);

  if (!schema) {
    return {
      slug,
      processedAt,
      model,
      ok: false,
      error: `Schema not found: ${schemaPathForSlug(slug)}`,
    };
  }

  const needsBackfill = schemaNeedsI18nBackfill(schema);
  if (!needsBackfill && options.skipComplete && !options.force) {
    return {
      slug,
      processedAt,
      model,
      ok: true,
      skipped: true,
      schemaPath: schemaPathForSlug(slug),
      inputsPatched: 0,
    };
  }

  const payload = buildSchemaI18nBackfillPayload(schema, { force: options.force });
  if (payload.inputs.length === 0) {
    return {
      slug,
      processedAt,
      model,
      ok: true,
      skipped: true,
      schemaPath: schemaPathForSlug(slug),
      inputsPatched: 0,
    };
  }

  try {
    await waitForRateLimit();
    const prompt = SCHEMA_I18N_BACKFILL_PROMPT(
      schema.toolName,
      JSON.stringify(payload, null, 2),
    );
    const patches = await fetchSchemaI18nBackfill({
      prompt,
      expectedInputIds: payload.inputs.map((input) => input.id),
    });
    const merged = mergeSchemaI18nBackfill(schema, patches);
    const schemaPath = writeSchema(slug, merged);

    return {
      slug,
      processedAt,
      model,
      ok: true,
      schemaPath,
      inputsPatched: countInputsNeedingI18nBackfill(schema),
    };
  } catch (error) {
    return {
      slug,
      processedAt,
      model,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function backfillBatch(
  slugs: readonly string[],
  options: Pick<BackfillSchemaI18nOptions, "skipComplete" | "force">,
  onComplete: (record: SchemaI18nBackfillRecord, index: number) => void,
  startIndex: number,
): Promise<SchemaI18nBackfillRecord[]> {
  const records = await Promise.all(
    slugs.map(async (slug, batchIndex) => {
      const record = await backfillSchemaI18nForSlug(slug, options);
      onComplete(record, startIndex + batchIndex);
      return record;
    }),
  );
  return records;
}

export async function backfillSchemaI18n(
  options: BackfillSchemaI18nOptions,
): Promise<SchemaI18nBackfillRecord[]> {
  loadEnvLocal();
  schemasDir = resolveOutputDir(options.outputDir);
  process.env.DEEPSEEK_MAX_RETRIES = String(options.retry);

  const discovered = listGeneratedToolSchemaSlugs();
  let selected = discovered;

  if (options.slug) {
    selected = discovered.filter((slug) => slug === options.slug);
    if (selected.length === 0) {
      throw new Error(`Schema slug not found: ${options.slug}`);
    }
  } else if (options.limit !== null) {
    selected = discovered.slice(0, options.limit);
  }

  console.log(`Discovered ${discovered.length} schema file(s).`);
  console.log(`Selected ${selected.length} schema file(s) for i18n backfill.`);
  console.log(
    `Config: parallel=${options.parallel}, retry=${options.retry}, skipComplete=${options.skipComplete}, force=${options.force}, output=${schemasDir}`,
  );

  if (options.dryRun) {
    for (const slug of selected) {
      const schema = readSchema(slug);
      if (!schema) {
        console.log(`- ${slug} [missing schema]`);
        continue;
      }
      const pending = countInputsNeedingI18nBackfill(schema);
      const status = pending === 0 ? "complete" : `${pending} input(s) pending`;
      console.log(`- ${slug} [${status}]`);
    }
    return [];
  }

  const records: SchemaI18nBackfillRecord[] = [];
  const parallel = Math.max(1, options.parallel);

  for (let start = 0; start < selected.length; start += parallel) {
    const batch = selected.slice(start, start + parallel);
    const batchRecords = await backfillBatch(
      batch,
      { skipComplete: options.skipComplete, force: options.force },
      (record, index) => {
        console.log(`[${index + 1}/${selected.length}] Backfilling ${record.slug}...`);
        if (!record.ok) {
          console.warn(`  FAIL: ${record.error}`);
        } else if (record.skipped) {
          console.log(`  SKIP (already complete): ${record.schemaPath}`);
        } else {
          console.log(`  OK: inputsPatched=${record.inputsPatched ?? 0}`);
          console.log(`  Saved: ${record.schemaPath}`);
        }
      },
      start,
    );
    records.push(...batchRecords);
    writeProgress(records);
  }

  const failed = records.filter((record) => !record.ok).length;
  const skipped = records.filter((record) => record.skipped).length;
  console.log("");
  console.log(`Progress: ${PROGRESS_PATH}`);
  console.log(`Output:   ${schemasDir}`);
  console.log(`Succeeded: ${records.length - failed - skipped}/${records.length}`);
  console.log(`Skipped:   ${skipped}/${records.length}`);
  console.log(`Failed:    ${failed}/${records.length}`);

  return records;
}

async function main(): Promise<void> {
  const options = parseCliOptions(process.argv.slice(2));
  const records = await backfillSchemaI18n(options);
  const failed = records.filter((record) => !record.ok).length;
  if (failed > 0) {
    process.exitCode = 1;
  }
}

const isDirectRun =
  Boolean(process.argv[1]) &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  });
}
