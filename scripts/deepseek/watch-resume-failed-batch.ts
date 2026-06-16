#!/usr/bin/env npx tsx
/**
 * 10-key resume failed batch — 3 saniyede bir yenilenen canlı dashboard.
 *
 * Usage:
 *   npm run watch:resume-failed-batch
 *   npm run watch:resume-failed-batch -- --interval=3
 *   npm run watch:resume-failed-batch -- --once
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { buildShardRanges } from "./batch-shards";
import { resolveShardCount } from "./deepseek-key-pool";
import { PROJECT_ROOT } from "./load-env";
import { collectPendingTools, loadResumeQueueTools } from "./resume-failed-batch";

const OUTPUT_DIR = path.join(PROJECT_ROOT, "generated", "schemas");

type ProgressState = { completed: string[]; failed: string[] };

type ShardView = {
  id: number;
  start: number;
  end: number;
  ok: number;
  fail: number;
  total: number;
  currentTool: string | null;
  progressLine: string | null;
  alive: boolean;
  logTail: string;
};

type Snapshot = {
  totalOk: number;
  totalFail: number;
  queueTotal: number;
  schemas: number;
  activeShards: number;
  ts: number;
};

function parseArgv(): { intervalMs: number; once: boolean } {
  const argv = process.argv.slice(2);
  let intervalMs = 3000;
  let once = false;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--once") once = true;
    if (arg.startsWith("--interval=")) intervalMs = Number(arg.slice(11)) * 1000;
    if (arg === "--interval" && argv[i + 1]) intervalMs = Number(argv[i + 1]) * 1000;
  }
  return {
    intervalMs: Number.isFinite(intervalMs) && intervalMs >= 1000 ? intervalMs : 3000,
    once,
  };
}

function shardProgressPath(shardId: number): string {
  return path.join(PROJECT_ROOT, `.batch-progress-failed-retry-shard-${shardId}.json`);
}

function loadShardProgress(shardId: number): ProgressState {
  const file = shardProgressPath(shardId);
  if (!fs.existsSync(file)) return { completed: [], failed: [] };
  return JSON.parse(fs.readFileSync(file, "utf-8")) as ProgressState;
}

function mergeAllProgress(): ProgressState {
  const merged: ProgressState = { completed: [], failed: [] };
  for (const file of fs.readdirSync(PROJECT_ROOT)) {
    if (!file.startsWith(".batch-progress-failed-retry") || !file.endsWith(".json")) continue;
    try {
      const raw = JSON.parse(fs.readFileSync(path.join(PROJECT_ROOT, file), "utf-8")) as ProgressState;
      for (const name of raw.completed ?? []) {
        if (!merged.completed.includes(name)) merged.completed.push(name);
      }
      for (const name of raw.failed ?? []) {
        if (!merged.failed.includes(name) && !merged.completed.includes(name)) {
          merged.failed.push(name);
        }
      }
    } catch {
      // skip
    }
  }
  return merged;
}

function isBatchRunning(): boolean {
  try {
    const out = execSync("ps aux", { encoding: "utf-8" });
    return out.includes("resume-failed-batch.ts --shard-id");
  } catch {
    return false;
  }
}

function countResumeScreens(): number {
  try {
    const out = execSync("screen -ls", {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return (out.match(/resume-shard-\d+/g) ?? []).length;
  } catch (error) {
    if (error && typeof error === "object" && "stdout" in error) {
      const stdout = String((error as { stdout?: string }).stdout ?? "");
      return (stdout.match(/resume-shard-\d+/g) ?? []).length;
    }
    return 0;
  }
}

function isShardAlive(shardId: number): boolean {
  try {
    const out = execSync("screen -ls", {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return out.includes(`resume-shard-${shardId}`);
  } catch (error) {
    if (error && typeof error === "object" && "stdout" in error) {
      const stdout = String((error as { stdout?: string }).stdout ?? "");
      return stdout.includes(`resume-shard-${shardId}`);
    }
    return false;
  }
}

function parseLogMeta(logPath: string): {
  currentTool: string | null;
  progressLine: string | null;
  tail: string;
} {
  if (!fs.existsSync(logPath)) {
    return { currentTool: null, progressLine: null, tail: "(log yok)" };
  }
  const lines = fs.readFileSync(logPath, "utf-8").trim().split("\n").filter(Boolean);
  let currentTool: string | null = null;
  let progressLine: string | null = null;
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const line = lines[i];
    const tool = line.match(/^\s*🔧\s+(.+)\.\.\.$/);
    if (tool && !currentTool) currentTool = tool[1];
    const prog = line.match(/^📡\s+([\d\-]+)\/(\d+)/);
    if (prog && !progressLine) progressLine = `${prog[1]}/${prog[2]}`;
    if (currentTool && progressLine) break;
  }
  const tail =
    lines
      .filter((l) => /✅|❌|📡|🔧/.test(l))
      .slice(-1)[0]
      ?.trim() ?? "(bekliyor)";
  return { currentTool, progressLine, tail };
}

function countSchemas(): number {
  if (!fs.existsSync(OUTPUT_DIR)) return 0;
  return fs.readdirSync(OUTPUT_DIR).filter((f) => f.endsWith("-schema.json")).length;
}

function buildShardViews(shardCount: number): ShardView[] {
  const merged = mergeAllProgress();
  const queueTools = loadResumeQueueTools();
  const queueTotal = queueTools.length;
  const ranges = buildShardRanges(queueTotal, shardCount);

  return ranges.map((range) => {
    const progress = loadShardProgress(range.id);
    const logPath = `/tmp/resume-shard-${range.id}.log`;
    const meta = parseLogMeta(logPath);
    return {
      id: range.id,
      start: range.start,
      end: range.end,
      ok: progress.completed.length,
      fail: progress.failed.length,
      total: range.end - range.start,
      currentTool: meta.currentTool,
      progressLine: meta.progressLine,
      alive: isShardAlive(range.id),
      logTail: meta.tail,
    };
  });
}

function bar(ratio: number, width = 18): string {
  const clamped = Math.max(0, Math.min(1, ratio));
  const filled = Math.round(clamped * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
}

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "—";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  if (m > 0) return `${m}dk ${s}sn`;
  return `${s}sn`;
}

function render(prev: Snapshot | null, startedAt: number, intervalSec: number): Snapshot {
  const pendingRemaining = collectPendingTools().length;
  const batchRunning = isBatchRunning();
  const batchDone = !batchRunning && pendingRemaining === 0;
  const shardCount = resolveShardCount();
  const shards = buildShardViews(shardCount);
  let totalOk = 0;
  let totalFail = 0;
  let queueTotal = 0;

  console.clear();
  const now = new Date().toLocaleString("tr-TR");
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║     SectorCalc · Resume Failed Batch · 10 Key Dashboard        ║");
  console.log(`║  ${now.padEnd(58)}║`);
  console.log("╚══════════════════════════════════════════════════════════════╝");
  console.log();
  console.log(
    `  Model      : deepseek-v4-pro  │  Key: ${shardCount}  │  Concurrency: 1/key (~${shardCount} req)`,
  );
  console.log(
    `  Süreç      : ${batchDone ? "✅ tamamlandı" : batchRunning ? "🟢 çalışıyor" : "🔴 durdu"}  │  Screen: ${countResumeScreens()}/${shardCount}  │  Yenileme: ${intervalSec} sn`,
  );
  console.log("");

  for (const shard of shards) {
    totalOk += shard.ok;
    totalFail += shard.fail;
    queueTotal += shard.total;
    const done = shard.ok + shard.fail;
    const pct = shard.total > 0 ? (done / shard.total) * 100 : 0;
    const status = shard.alive ? "🟢" : done >= shard.total ? "✅" : "⚪";
    console.log(
      `  ${status} SHARD-${shard.id}  ✅${shard.ok} ❌${shard.fail}/${shard.total}  ${pct.toFixed(0)}%  [${bar(done / Math.max(shard.total, 1))}]`,
    );
    console.log(
      `       ${shard.progressLine ?? "—"}  │  ${shard.currentTool ?? "—"}`,
    );
  }

  const doneAll = totalOk + totalFail;
  const overallPct = queueTotal > 0 ? (doneAll / queueTotal) * 100 : 0;
  const ts = Date.now();
  let eta = "hesaplanıyor…";
  let ratePerMin = "—";
  if (prev && ts > prev.ts && totalOk > prev.totalOk) {
    const rate = (totalOk - prev.totalOk) / ((ts - prev.ts) / 1000);
    const remaining = queueTotal - doneAll;
    ratePerMin = (rate * 60).toFixed(1);
    if (rate > 0 && remaining > 0) eta = formatDuration(remaining / rate);
    else if (remaining <= 0 || batchDone) eta = "tamamlandı";
  } else if (batchDone) {
    eta = "tamamlandı";
  }

  console.log("");
  console.log(
    `  TOPLAM     : ✅ ${totalOk}  ❌ ${totalFail}  │  ${overallPct.toFixed(1)}%  │  Hız: ~${ratePerMin} araç/dk  │  ETA: ${eta}`,
  );
  console.log(
    `  Kuyruk     : ${queueTotal} araç  │  Schema eksik: ${pendingRemaining}  │  Şema: ${countSchemas().toLocaleString("tr-TR")}  │  İzleme: ${formatDuration((Date.now() - startedAt) / 1000)}`,
  );
  console.log("");
  console.log("  ── Son log satırı (shard başına) ──");
  for (const shard of shards) {
    console.log(`  [${shard.id}] ${shard.logTail}`);
  }
  console.log("");
  console.log("  Çıkış: Ctrl+C  │  Tek ölçüm: npm run watch:resume-failed-batch -- --once");
  console.log("  Başlat   : npm run start:resume-failed-batch");

  return {
    totalOk,
    totalFail,
    queueTotal,
    schemas: countSchemas(),
    activeShards: countResumeScreens(),
    ts,
  };
}

function main(): void {
  const { intervalMs, once } = parseArgv();
  const startedAt = Date.now();
  let prev: Snapshot | null = null;

  const tick = (): void => {
    prev = render(prev, startedAt, intervalMs / 1000);
  };

  tick();
  if (once) return;

  const timer = setInterval(tick, intervalMs);
  process.on("SIGINT", () => {
    clearInterval(timer);
    console.log("\nResume dashboard durduruldu.");
    process.exit(0);
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
