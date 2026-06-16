#!/usr/bin/env npx tsx
/**
 * 10 key × N shard paralel batch başlatıcı (max hız).
 * Keys: .env.batch.keys.local
 */
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildShardRanges, getBatchShardCount, parseFullList } from "./batch-shards";
import { loadBatchKeyPool } from "./deepseek-key-pool";
import { migrateProgressToShards } from "./migrate-batch-progress";
import { PROJECT_ROOT } from "./load-env";

function stopScreens(maxShards: number): void {
  try {
    execSync("pkill -f 'generate-batch-final.ts --start' 2>/dev/null || true", {
      shell: "/bin/bash",
      stdio: "ignore",
    });
  } catch {
    // ignore
  }
  for (const name of ["v4-pro-batch", "master-dash"]) {
    try {
      execSync(`screen -X -S ${name} quit 2>/dev/null || true`, { stdio: "ignore" });
    } catch {
      // ignore
    }
  }
  for (let i = 1; i <= Math.max(maxShards, 10); i += 1) {
    try {
      execSync(`screen -X -S batch-${i} quit 2>/dev/null || true`, { stdio: "ignore" });
    } catch {
      // ignore
    }
  }
}

function startShard(shardId: number, apiKey: string, start: number, end: number): void {
  const log = `/tmp/batch-${shardId}.log`;
  const cmd = [
    `cd ${PROJECT_ROOT}`,
    `export DEEPSEEK_API_KEY='${apiKey}'`,
    `npx tsx scripts/deepseek/generate-batch-final.ts --start=${start} --end=${end} --retry-failed`,
    `2>&1 | tee ${log}`,
  ].join(" && ");
  execSync(`screen -dmS batch-${shardId} bash -c ${JSON.stringify(cmd)}`, {
    stdio: "inherit",
  });
  console.log(`✅ batch-${shardId} → [${start},${end}) log: ${log}`);
}

function main(): void {
  const keys = loadBatchKeyPool();
  const shardCount = getBatchShardCount();
  if (keys.length < shardCount) {
    console.error(`❌ ${keys.length} key var, ${shardCount} shard gerekli (.env.batch.keys.local)`);
    process.exit(1);
  }

  const listFile = path.join(PROJECT_ROOT, "input_calculators.txt");
  const total = parseFullList(listFile).length;
  const ranges = buildShardRanges(total, shardCount);

  console.log(`🚀 ${shardCount} shard × concurrency=3 → max ~${shardCount * 3} eşzamanlı istek`);
  stopScreens(shardCount);
  console.log(`📦 Progress migrate → ${shardCount} shard...`);
  migrateProgressToShards(total, shardCount);

  for (const shard of ranges) {
    const key = keys[shard.id - 1];
    if (!key) {
      console.error(`❌ Key eksik: batch-${shard.id}`);
      process.exit(1);
    }
    startShard(shard.id, key, shard.start, shard.end);
  }

  console.log("\nMaster dashboard: npm run watch:master-batch");
  console.log("Screen listesi:   screen -ls");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
