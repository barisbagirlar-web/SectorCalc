#!/usr/bin/env node
/**
 * DeepSeek industrial tool scan — discover tools and emit JSON schemas.
 *
 * Usage:
 *   npm run scan:tools
 *   npm run scan:all
 *   npm run scan:tools -- --limit 5
 *   npm run scan:tools -- --slug machine-time-calculator
 *   npm run scan:tools -- --dry-run
 *   npm run scan:tools -- --skip-existing
 *   npm run scan:all -- --deep-research --skip-existing
 *   npm run scan:all -- --parallel=1 --retry=3 --output=generated/schemas
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { discoverTools } from "./discover-tools";
import { fetchIndustrialToolSchema, getDeepSeekModelName } from "./deepseek-client";
import { loadEnvLocal, PROJECT_ROOT } from "./load-env";
import { INDUSTRIAL_DEEP_RESEARCH_PROMPT, INDUSTRIAL_ENGINEERING_PROMPT } from "./prompts";
import type { DiscoveredTool, ScanProgressDocument, ToolScanRecord } from "./types";

const DEFAULT_SCHEMAS_DIR = path.join(PROJECT_ROOT, "generated", "schemas");
const PROGRESS_PATH = path.join(PROJECT_ROOT, "generated", "scan-progress.json");
const REQUESTS_PER_SECOND = 5;
const MIN_INTERVAL_MS = Math.ceil(1000 / REQUESTS_PER_SECOND);

export type ScanToolsOptions = {
  readonly scanAll: boolean;
  readonly limit: number | null;
  readonly slug: string | null;
  readonly dryRun: boolean;
  readonly skipExisting: boolean;
  readonly deepResearch: boolean;
  readonly parallel: number;
  readonly retry: number;
  readonly outputDir: string;
};

let schemasDir = DEFAULT_SCHEMAS_DIR;
let lastRequestAt = 0;

function parseKeyValueArg(arg: string, key: string): string | null {
  if (!arg.startsWith(`${key}=`)) {
    return null;
  }
  return arg.slice(key.length + 1).trim() || null;
}

export function parseCliOptions(argv: readonly string[]): ScanToolsOptions {
  let scanAll = false;
  let limit: number | null = null;
  let slug: string | null = null;
  let dryRun = false;
  let skipExisting = false;
  let deepResearch = false;
  let parallel = 1;
  let retry = 3;
  let outputDir = "generated/schemas";

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--all") {
      scanAll = true;
      continue;
    }
    if (arg === "--dry-run") {
      dryRun = true;
      continue;
    }
    if (arg === "--skip-existing") {
      skipExisting = true;
      continue;
    }
    if (arg === "--deep-research") {
      deepResearch = true;
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

  const envLimit = Number(process.env.SCAN_TOOLS_LIMIT || "");
  if (!scanAll && limit === null && Number.isFinite(envLimit) && envLimit > 0) {
    limit = envLimit;
  }

  return { scanAll, limit, slug, dryRun, skipExisting, deepResearch, parallel, retry, outputDir };
}

function resolveOutputDir(outputDir: string): string {
  return path.isAbsolute(outputDir) ? outputDir : path.join(PROJECT_ROOT, outputDir);
}

function schemaPathForSlug(slug: string): string {
  return path.join(schemasDir, `${slug}-schema.json`);
}

async function waitForRateLimit(): Promise<void> {
  const elapsed = Date.now() - lastRequestAt;
  if (elapsed < MIN_INTERVAL_MS) {
    await new Promise((resolve) => setTimeout(resolve, MIN_INTERVAL_MS - elapsed));
  }
  lastRequestAt = Date.now();
}

function buildToolDescription(tool: DiscoveredTool): string {
  const role =
    tool.revenueRole === "paid"
      ? "Premium paid analyzer"
      : tool.revenueRole === "free"
        ? "Free quick-check calculator"
        : "SectorCalc calculation tool";
  return `${role} for ${tool.slug.replace(/-/g, " ")}. Sources: ${tool.sources.join(", ")}.`;
}

function writeProgress(records: readonly ToolScanRecord[]): void {
  fs.mkdirSync(path.dirname(PROGRESS_PATH), { recursive: true });
  const succeeded = records.filter((record) => record.ok);
  const failed = records.filter((record) => !record.ok);
  const document: ScanProgressDocument = {
    generatedAt: new Date().toISOString(),
    generator: "scripts/deepseek/scan-tools.ts",
    summary: {
      discovered: records.length,
      scanned: records.length,
      succeeded: succeeded.length,
      failed: failed.length,
    },
    tools: records,
  };
  fs.writeFileSync(PROGRESS_PATH, `${JSON.stringify(document, null, 2)}\n`, "utf8");
}

function saveIndustrialSchema(slug: string, schema: ToolScanRecord["industrialSchema"]): string {
  fs.mkdirSync(schemasDir, { recursive: true });
  const schemaPath = schemaPathForSlug(slug);
  fs.writeFileSync(schemaPath, `${JSON.stringify(schema, null, 2)}\n`, "utf8");
  return schemaPath;
}

export async function scanSingleTool(
  tool: DiscoveredTool,
  options: Pick<ScanToolsOptions, "skipExisting" | "deepResearch"> = {
    skipExisting: false,
    deepResearch: false,
  },
): Promise<ToolScanRecord> {
  loadEnvLocal();
  const scannedAt = new Date().toISOString();
  const model = getDeepSeekModelName();
  const existingSchemaPath = schemaPathForSlug(tool.slug);

  if (options.skipExisting && fs.existsSync(existingSchemaPath)) {
    return {
      slug: tool.slug,
      sources: tool.sources,
      scannedAt,
      model,
      ok: true,
      schemaPath: existingSchemaPath,
    };
  }

  try {
    await waitForRateLimit();
    const description = buildToolDescription(tool);
    const prompt = options.deepResearch
      ? INDUSTRIAL_DEEP_RESEARCH_PROMPT(tool.slug, description)
      : INDUSTRIAL_ENGINEERING_PROMPT(tool.slug, description);
    const industrialSchema = await fetchIndustrialToolSchema({
      slug: tool.slug,
      prompt,
    });
    const schemaPath = saveIndustrialSchema(tool.slug, industrialSchema);

    return {
      slug: tool.slug,
      sources: tool.sources,
      scannedAt,
      model,
      ok: true,
      schemaPath,
      industrialSchema,
    };
  } catch (error) {
    return {
      slug: tool.slug,
      sources: tool.sources,
      scannedAt,
      model,
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

async function scanBatch(
  tools: readonly DiscoveredTool[],
  options: Pick<ScanToolsOptions, "skipExisting" | "deepResearch">,
  onComplete: (record: ToolScanRecord, index: number) => void,
  startIndex: number,
): Promise<ToolScanRecord[]> {
  const records = await Promise.all(
    tools.map(async (tool, batchIndex) => {
      const record = await scanSingleTool(tool, options);
      onComplete(record, startIndex + batchIndex);
      return record;
    }),
  );
  return records;
}

export async function scanTools(options: ScanToolsOptions): Promise<ToolScanRecord[]> {
  loadEnvLocal();
  schemasDir = resolveOutputDir(options.outputDir);
  process.env.DEEPSEEK_MAX_RETRIES = String(options.retry);

  const discovered = discoverTools();

  let selected = discovered;
  if (options.slug) {
    selected = discovered.filter((tool) => tool.slug === options.slug);
    if (selected.length === 0) {
      throw new Error(`Tool slug not discovered in DNA sources: ${options.slug}`);
    }
  } else if (!options.scanAll && options.limit !== null) {
    selected = discovered.slice(0, options.limit);
  }

  console.log(`Discovered ${discovered.length} tool slug(s) from DNA sources.`);
  console.log(`Selected ${selected.length} tool slug(s) for scan.`);
  console.log(
    `Config: parallel=${options.parallel}, retry=${options.retry}, deepResearch=${options.deepResearch}, output=${schemasDir}`,
  );

  if (options.dryRun) {
    for (const tool of selected) {
      console.log(`- ${tool.slug} [${tool.sources.join(", ")}]`);
    }
    return [];
  }

  const records: ToolScanRecord[] = [];
  const parallel = Math.max(1, options.parallel);

  for (let start = 0; start < selected.length; start += parallel) {
    const batch = selected.slice(start, start + parallel);
    const batchRecords = await scanBatch(
      batch,
      { skipExisting: options.skipExisting, deepResearch: options.deepResearch },
      (record, index) => {
        console.log(`[${index + 1}/${selected.length}] Scanning ${record.slug}...`);
        if (!record.ok) {
          console.warn(`  FAIL: ${record.error}`);
        } else if (record.industrialSchema) {
          console.log(
            `  OK: inputs=${record.industrialSchema.inputs.length}, formulas=${Object.keys(record.industrialSchema.formulas).length}, premium=${record.industrialSchema.premiumRequired}`,
          );
          console.log(`  Saved: ${record.schemaPath}`);
        } else {
          console.log(`  SKIP (existing): ${record.schemaPath}`);
        }
      },
      start,
    );
    records.push(...batchRecords);
    writeProgress(records);
  }

  const failed = records.filter((record) => !record.ok).length;
  console.log("");
  console.log(`Progress: ${PROGRESS_PATH}`);
  console.log(`Output:   ${schemasDir}`);
  console.log(`Succeeded: ${records.length - failed}/${records.length}`);

  return records;
}

async function main(): Promise<void> {
  const options = parseCliOptions(process.argv.slice(2));
  const records = await scanTools(options);
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
