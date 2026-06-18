#!/usr/bin/env npx tsx
/**
 * Industrial stub-formula factory — deterministic archetype repair at scale.
 *
 * Tier 1: reverse-engineered archetype engine (no API, ~700 schemas/sec)
 * Tier 2: optional DeepSeek fallback for validation failures (--deepseek-fallback)
 *
 * Usage:
 *   npx tsx scripts/deepseek/stub-formula-industrial-factory.ts --tier=premium --dry-run
 *   npx tsx scripts/deepseek/stub-formula-industrial-factory.ts --tier=all --apply
 *   npx tsx scripts/deepseek/stub-formula-industrial-factory.ts --tier=free --apply --deepseek-fallback
 *   npx tsx scripts/deepseek/stub-formula-industrial-factory.ts --shard-id=1 --shard-count=10 --apply
 */
import fs from "node:fs";
import path from "node:path";
import { buildShardRanges } from "./batch-shards";
import { generateFromSchemaFile } from "./generate-from-schema";
import { inferArchetypePatch } from "./lib/formula-archetype-engine";
import { callDeepSeekStubRepair } from "./lib/stub-formula-deepseek";
import {
  listStubSchemaSlugs,
  loadSchemaRecord,
} from "./lib/stub-schema-scan";
import { validateRepairPatch } from "./lib/stub-formula-validate";
import { mergeRepairPatch } from "./lib/stub-formula-repair-file";
import type { RepairPatch, RepairResult, SchemaRecord } from "./lib/stub-formula-types";
import { loadEnvLocal, PROJECT_ROOT } from "./load-env";
import { resolveDeepSeekApiKey } from "./deepseek-key-pool";

loadEnvLocal();

const SCHEMAS_DIR = path.join(PROJECT_ROOT, "generated", "schemas");
const GENERATED_DIR = path.join(PROJECT_ROOT, "generated");
const PROGRESS_PATH = path.join(PROJECT_ROOT, "scripts/.cache/stub-factory-progress.json");
const REPORT_PATH = path.join(PROJECT_ROOT, "scripts/.cache/stub-factory-report.json");
const DEEPSEEK_RATE_MS = 500;

type Tier = "all" | "premium" | "free";

type ProgressState = {
  repaired: string[];
  failed: Array<{ slug: string; reason: string; method?: string }>;
};

type CliArgs = {
  tier: Tier;
  apply: boolean;
  dryRun: boolean;
  deepseekFallback: boolean;
  force: boolean;
  shardId: number | null;
  shardCount: number | null;
  slugs: string[];
};

function parseArgs(): CliArgs {
  let tier: Tier = "all";
  let apply = false;
  let dryRun = false;
  let deepseekFallback = false;
  let force = false;
  let shardId: number | null = null;
  let shardCount: number | null = null;
  const slugs: string[] = [];

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith("--tier=")) {
      const value = arg.slice(7) as Tier;
      if (value === "premium" || value === "free" || value === "all") {
        tier = value;
      }
    } else if (arg === "--apply") {
      apply = true;
    } else if (arg === "--dry-run") {
      dryRun = true;
    } else if (arg === "--deepseek-fallback") {
      deepseekFallback = true;
    } else if (arg === "--force") {
      force = true;
    } else if (arg.startsWith("--shard-id=")) {
      shardId = Number(arg.slice(11)) || null;
    } else if (arg.startsWith("--shard-count=")) {
      shardCount = Number(arg.slice(14)) || null;
    } else if (arg.startsWith("--slug=")) {
      slugs.push(arg.slice(7));
    }
  }

  if ((shardId === null) !== (shardCount === null)) {
    console.error("BLOKER: --shard-id ve --shard-count birlikte verilmeli");
    process.exit(1);
  }

  return { tier, apply, dryRun, deepseekFallback, force, shardId, shardCount, slugs };
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

async function resolvePatch(
  schema: SchemaRecord,
  deepseekFallback: boolean,
  apiKey: string | undefined,
): Promise<{ patch: RepairPatch; method: RepairResult["method"] }> {
  const archetype = inferArchetypePatch(schema);
  const archetypeError = validateRepairPatch(schema, archetype);
  if (!archetypeError) {
    return { patch: archetype, method: "archetype" };
  }

  if (!deepseekFallback) {
    throw new Error(`archetype: ${archetypeError}`);
  }
  if (!apiKey) {
    throw new Error(`archetype failed (${archetypeError}); DEEPSEEK_API_KEY missing for fallback`);
  }

  const deepseek = await callDeepSeekStubRepair(schema, apiKey);
  const deepseekError = validateRepairPatch(schema, deepseek);
  if (deepseekError) {
    throw new Error(`deepseek: ${deepseekError}`);
  }
  return { patch: deepseek, method: "deepseek" };
}

function applyPatch(slug: string, schema: SchemaRecord, patch: RepairPatch): number {
  const schemaPath = path.join(SCHEMAS_DIR, `${slug}-schema.json`);
  const nextSchema: SchemaRecord = {
    ...schema,
    formulas: patch.formulas,
    outputs: { ...(schema.outputs as object), ...patch.outputs },
  };
  fs.writeFileSync(schemaPath, `${JSON.stringify(nextSchema, null, 2)}\n`);

  const outPath = path.join(GENERATED_DIR, `${slug}.ts`);
  return generateFromSchemaFile(schemaPath, outPath);
}

async function processSlug(
  slug: string,
  args: CliArgs,
  apiKey: string | undefined,
): Promise<RepairResult> {
  const schema = loadSchemaRecord(SCHEMAS_DIR, slug);
  const { patch, method } = await resolvePatch(schema, args.deepseekFallback, apiKey);

  if (args.dryRun) {
    return { slug, method, ok: true };
  }

  if (!args.apply) {
    return { slug, method, ok: true, reason: "preview only (--apply missing)" };
  }

  const compileFailures = applyPatch(slug, schema, patch);
  if (compileFailures > 0) {
    throw new Error(`${compileFailures} formula compile fallback(s)`);
  }

  return { slug, method, ok: true };
}

async function main(): Promise<void> {
  const args = parseArgs();
  const apiKey = args.deepseekFallback ? resolveDeepSeekApiKey(args.shardId ?? undefined) : undefined;
  const progress = loadProgress();
  const repairedSet = args.force ? new Set<string>() : new Set(progress.repaired);

  if (args.force && args.apply && !args.dryRun) {
    progress.repaired = [];
    progress.failed = [];
    saveProgress(progress);
  }

  let queue =
    args.slugs.length > 0
      ? args.slugs
      : listStubSchemaSlugs(SCHEMAS_DIR, args.tier).filter((slug) => !repairedSet.has(slug));

  if (args.shardId !== null && args.shardCount !== null) {
    const ranges = buildShardRanges(queue.length, args.shardCount);
    const range = ranges[args.shardId - 1];
    if (!range) {
      console.error(`BLOKER: geçersiz shard ${args.shardId}/${args.shardCount}`);
      process.exit(1);
    }
    queue = queue.slice(range.start, range.end);
  }

  const report: RepairResult[] = [];
  const counts = { archetype: 0, deepseek: 0, skipped: 0, fail: 0 };

  console.log(
    `FACTORY tier=${args.tier} queue=${queue.length} apply=${args.apply} dryRun=${args.dryRun} deepseek=${args.deepseekFallback}`,
  );

  for (const slug of queue) {
    try {
      const result = await processSlug(slug, args, apiKey);
      report.push(result);
      if (result.method === "archetype") {
        counts.archetype += 1;
      } else if (result.method === "deepseek") {
        counts.deepseek += 1;
        await new Promise((resolve) => setTimeout(resolve, DEEPSEEK_RATE_MS));
      } else {
        counts.skipped += 1;
      }

      if (args.apply && !args.dryRun) {
        progress.repaired.push(slug);
        progress.failed = progress.failed.filter((row) => row.slug !== slug);
        saveProgress(progress);
      }

      console.log(`OK ${slug} [${result.method}]`);
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      counts.fail += 1;
      report.push({ slug, method: "skipped", ok: false, reason });
      if (args.apply && !args.dryRun) {
        progress.failed = progress.failed.filter((row) => row.slug !== slug);
        progress.failed.push({ slug, reason });
        saveProgress(progress);
      }
      console.error(`FAIL ${slug}: ${reason}`);
    }
  }

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(
    REPORT_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        tier: args.tier,
        shardId: args.shardId,
        counts,
        results: report,
      },
      null,
      2,
    ),
  );

  console.log(
    `DONE archetype=${counts.archetype} deepseek=${counts.deepseek} fail=${counts.fail} total=${queue.length}`,
  );
  process.exit(counts.fail > 0 ? 1 : 0);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
