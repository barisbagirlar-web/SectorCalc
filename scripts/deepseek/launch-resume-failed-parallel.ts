#!/usr/bin/env npx tsx
/**
 * 10 API key × failed-retry shard — kalan başarısız araçları paralel tamamlar.
 */
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { buildShardRanges } from "./batch-shards";
import { loadBatchKeyPool, resolveShardCount } from "./deepseek-key-pool";
import { PROJECT_ROOT } from "./load-env";
import { collectPendingTools, writeResumeQueueManifest } from "./resume-failed-batch";

function stopResumeScreens(shardCount: number): void {
  const patterns = [
    "pkill -f 'resume-failed-batch.ts' 2>/dev/null || true",
    "pkill -f 'npm exec tsx scripts/deepseek/resume-failed-batch' 2>/dev/null || true",
    "pkill -f 'scripts/deepseek/resume-failed-batch.ts --shard-id' 2>/dev/null || true",
  ];
  for (const pattern of patterns) {
    try {
      execSync(pattern, { shell: "/bin/bash", stdio: "ignore" });
    } catch {
      // ignore
    }
  }
  try {
    execSync("screen -X -S v4-pro-batch quit 2>/dev/null || true", { stdio: "ignore" });
  } catch {
    // ignore
  }
  for (let i = 1; i <= shardCount; i += 1) {
    try {
      execSync(`screen -X -S resume-shard-${i} quit 2>/dev/null || true`, { stdio: "ignore" });
    } catch {
      // ignore
    }
    try {
      execSync(`rm -f /tmp/resume-shard-${i}.lock 2>/dev/null || true`, { stdio: "ignore" });
    } catch {
      // ignore
    }
  }
  try {
    execSync("sleep 2", { stdio: "ignore" });
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
    console.error(`❌ ${keys.length} key var, ${shardCount} shard gerekli (.env.batch.keys.local)`);
    process.exit(1);
  }

  const pending = collectPendingTools();
  if (pending.length === 0) {
    console.log("✅ Schema eksik failed araç yok.");
    return;
  }

  writeResumeQueueManifest(pending);
  const ranges = buildShardRanges(pending.length, shardCount);
  console.log(`🚀 ${shardCount} key × concurrency=1 → max ~${shardCount} eşzamanlı istek`);
  console.log(`📦 Kalan failed araç: ${pending.length}`);
  stopResumeScreens(shardCount);

  for (const range of ranges) {
    const key = keys[range.id - 1];
    if (!key) {
      console.error(`❌ Key eksik: resume-shard-${range.id}`);
      process.exit(1);
    }
    const slice = pending.slice(range.start, range.end);
    console.log(`   shard-${range.id}: ${slice.length} araç [${range.start},${range.end})`);
    startShard(range.id, key, shardCount);
  }

  console.log("\nİzleme: npm run watch:v4-pro-batch");
  console.log("Screen:  screen -ls");
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
