#!/usr/bin/env npx tsx
/**
 * Parallel launcher for stub-formula industrial factory.
 * Archetype-only shards need no API keys — max throughput for ~700 stubs.
 *
 * Usage:
 *   npx tsx scripts/deepseek/launch-stub-formula-factory.ts --tier=all --apply
 *   npx tsx scripts/deepseek/launch-stub-formula-factory.ts --tier=premium --apply --deepseek-fallback
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { buildShardRanges } from "./batch-shards";
import { loadBatchKeyPool, resolveShardCount } from "./deepseek-key-pool";
import { listStubSchemaSlugs } from "./lib/stub-schema-scan";
import { loadEnvLocal, PROJECT_ROOT } from "./load-env";

loadEnvLocal();

const SCHEMAS_DIR = path.join(PROJECT_ROOT, "generated", "schemas");

function parseFlags(): {
  tier: string;
  apply: boolean;
  deepseekFallback: boolean;
  shardCount: number;
} {
  let tier = "all";
  let apply = false;
  let deepseekFallback = false;
  let shardCount = resolveShardCount();

  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith("--tier=")) {
      tier = arg.slice(7);
    } else if (arg === "--apply") {
      apply = true;
    } else if (arg === "--deepseek-fallback") {
      deepseekFallback = true;
    } else if (arg.startsWith("--shards=")) {
      shardCount = Number(arg.slice(9)) || shardCount;
    }
  }

  return { tier, apply, deepseekFallback, shardCount };
}

function stopScreens(shardCount: number): void {
  for (let i = 1; i <= shardCount; i += 1) {
    try {
      execSync(`screen -X -S stub-factory-${i} quit 2>/dev/null || true`, { stdio: "ignore" });
      execSync(`rm -f /tmp/stub-factory-${i}.lock 2>/dev/null || true`, { stdio: "ignore" });
    } catch {
      // ignore
    }
  }
}

function startShard(
  shardId: number,
  shardCount: number,
  tier: string,
  apply: boolean,
  deepseekFallback: boolean,
  apiKey?: string,
): void {
  const log = `/tmp/stub-factory-${shardId}.log`;
  const applyFlag = apply ? "--apply" : "--dry-run";
  const deepseekFlag = deepseekFallback ? "--deepseek-fallback" : "";
  const keyExport = apiKey ? `export DEEPSEEK_API_KEY='${apiKey}' && ` : "";
  const cmd =
    `cd ${PROJECT_ROOT} && ${keyExport}` +
    `npx tsx scripts/deepseek/stub-formula-industrial-factory.ts ` +
    `--tier=${tier} ${applyFlag} ${deepseekFlag} ` +
    `--shard-id=${shardId} --shard-count=${shardCount} 2>&1 | tee ${log}`;

  execSync(`screen -dmS stub-factory-${shardId} bash -c ${JSON.stringify(cmd)}`, {
    stdio: "inherit",
  });
  console.log(`✅ stub-factory-${shardId} log: ${log}`);
}

function main(): void {
  const { tier, apply, deepseekFallback, shardCount } = parseFlags();
  const keys = loadBatchKeyPool();
  const queue = listStubSchemaSlugs(SCHEMAS_DIR, tier as "all" | "premium" | "free");
  const ranges = buildShardRanges(queue.length, shardCount);

  if (deepseekFallback && keys.length < shardCount) {
    console.error(`❌ DeepSeek fallback: ${keys.length} key, ${shardCount} shard gerekli`);
    process.exit(1);
  }

  console.log(`🚀 Stub factory: ${queue.length} araç → ${shardCount} shard`);
  console.log(`   tier=${tier} apply=${apply} deepseek=${deepseekFallback}`);

  stopScreens(shardCount);

  for (const range of ranges) {
    const key = deepseekFallback ? keys[range.id - 1] : undefined;
    if (deepseekFallback && !key) {
      console.error(`❌ Key eksik: stub-factory-${range.id}`);
      process.exit(1);
    }
    const slice = queue.slice(range.start, range.end);
    console.log(`   shard-${range.id}: ${slice.length} araç [${range.start},${range.end})`);
    startShard(range.id, shardCount, tier, apply, deepseekFallback, key);
  }

  console.log("\nİzleme: tail -f /tmp/stub-factory-*.log");
}

main();
