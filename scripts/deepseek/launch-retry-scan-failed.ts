#!/usr/bin/env npx tsx
/**
 * Katalogda schema eksik tüm araçları 10 key ile yeniden dener.
 * (failed listesi + hiç işlenmeyen + yanlış completed kayıtları)
 */
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { buildShardRanges } from "./batch-shards";
import { loadBatchKeyPool, resolveShardCount } from "./deepseek-key-pool";
import { PROJECT_ROOT } from "./load-env";
import {
  collectMissingCatalogTools,
  collectScanFailedTools,
  writeResumeQueueManifest,
} from "./resume-failed-batch";

function stopScreens(shardCount: number): void {
  const patterns = [
    "pkill -f 'resume-failed-batch.ts' 2>/dev/null || true",
    "pkill -f 'npm exec tsx scripts/deepseek/resume-failed-batch' 2>/dev/null || true",
  ];
  for (const pattern of patterns) {
    try {
      execSync(pattern, { shell: "/bin/bash", stdio: "ignore" });
    } catch {
      // ignore
    }
  }
  for (let i = 1; i <= shardCount; i += 1) {
    try {
      execSync(`screen -X -S resume-shard-${i} quit 2>/dev/null || true`, { stdio: "ignore" });
      execSync(`rm -f /tmp/resume-shard-${i}.lock 2>/dev/null || true`, { stdio: "ignore" });
    } catch {
      // ignore
    }
  }
  try {
    execSync("sleep 1", { stdio: "ignore" });
  } catch {
    // ignore
  }
}

function startShard(shardId: number, apiKey: string, shardCount: number): void {
  const log = `/tmp/resume-shard-${shardId}.log`;
  const cmd = `cd ${PROJECT_ROOT} && export DEEPSEEK_API_KEY='${apiKey}' && npx tsx scripts/deepseek/resume-failed-batch.ts --shard-id=${shardId} --shard-count=${shardCount} 2>&1 | tee ${log}`;
  execSync(`screen -dmS resume-shard-${shardId} bash -c ${JSON.stringify(cmd)}`, {
    stdio: "inherit",
  });
  console.log(`✅ resume-shard-${shardId} log: ${log}`);
}

function main(): void {
  const keys = loadBatchKeyPool();
  const shardCount = resolveShardCount();
  if (keys.length < shardCount) {
    console.error(`❌ ${keys.length} key var, ${shardCount} shard gerekli`);
    process.exit(1);
  }

  const retryTools = collectMissingCatalogTools();
  const scanFailedOnly = collectScanFailedTools();
  if (retryTools.length === 0) {
    console.log("✅ Katalogda schema eksik araç yok.");
    return;
  }

  console.log(`🔁 Schema eksik retry: ${retryTools.length} araç`);
  console.log(`   (yalnızca failed listesinde: ${scanFailedOnly.length})`);
  const preview = retryTools.slice(0, 12);
  for (const [i, name] of preview.entries()) {
    console.log(`   ${i + 1}. ${name}`);
  }
  if (retryTools.length > preview.length) {
    console.log(`   … ve ${retryTools.length - preview.length} araç daha`);
  }

  writeResumeQueueManifest(retryTools);
  const ranges = buildShardRanges(retryTools.length, shardCount);
  stopScreens(shardCount);

  for (const range of ranges) {
    const key = keys[range.id - 1];
    if (!key) {
      console.error(`❌ Key eksik: resume-shard-${range.id}`);
      process.exit(1);
    }
    const slice = retryTools.slice(range.start, range.end);
    if (slice.length === 0) continue;
    console.log(`   shard-${range.id}: ${slice.length} araç → ${slice.join(", ")}`);
    startShard(range.id, key, shardCount);
  }

  console.log("\nİzleme: npm run watch:resume-failed-batch");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
