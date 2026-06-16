#!/usr/bin/env npx tsx
/**
 * 6 shard master dashboard — 3 saniyede bir yenilenir.
 *
 * Usage:
 *   npm run watch:master-batch
 *   npx tsx scripts/deepseek/watch-master-batch.ts --interval=10
 *   npx tsx scripts/deepseek/watch-master-batch.ts --once
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import {
  buildShardRanges,
  getBatchShardCount,
  parseFullList,
  shardProgressPath,
  type ShardRange,
} from "./batch-shards";
import { PROJECT_ROOT } from "./load-env";

const LIST_FILE = `${PROJECT_ROOT}/input_calculators.txt`;

type ProgressState = { completed: string[]; failed: string[] };

type Snapshot = {
  totalOk: number;
  totalFail: number;
  ts: number;
};

const SHARDS: ShardRange[] = buildShardRanges(
  parseFullList(LIST_FILE).length,
  getBatchShardCount(),
);

function parseArgv(): { intervalMs: number; once: boolean } {
  const argv = process.argv.slice(2);
  let intervalMs = 10_000;
  let once = false;
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--once") once = true;
    if (arg.startsWith("--interval=")) intervalMs = Number(arg.slice(11)) * 1000;
    if (arg === "--interval" && argv[i + 1]) intervalMs = Number(argv[i + 1]) * 1000;
  }
  return {
    intervalMs: Number.isFinite(intervalMs) && intervalMs >= 1000 ? intervalMs : 10_000,
    once,
  };
}

function isBatchRunning(): boolean {
  try {
    return execSync("ps aux", { encoding: "utf-8" }).includes("generate-batch-final.ts --start");
  } catch {
    return false;
  }
}

function loadShardProgress(shard: ShardRange): ProgressState | null {
  const file = shardProgressPath(shard.start, shard.end);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf-8")) as ProgressState;
}

function parseLogMeta(logPath: string): { currentTool: string | null; progressLine: string | null } {
  if (!fs.existsSync(logPath)) return { currentTool: null, progressLine: null };
  const lines = fs.readFileSync(logPath, "utf-8").trim().split("\n").filter(Boolean);
  let currentTool: string | null = null;
  let progressLine: string | null = null;
  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const line = lines[i];
    const tool = line.match(/^\s*🔧\s+(.+)\.\.\.$/);
    if (tool && !currentTool) currentTool = tool[1];
    const prog = line.match(/^📡\s+(\d+-\d+)\/(\d+)/);
    if (prog && !progressLine) progressLine = `${prog[1]}/${prog[2]}`;
    if (currentTool && progressLine) break;
  }
  return { currentTool, progressLine };
}

function tailLog(logPath: string, lines = 1): string[] {
  if (!fs.existsSync(logPath)) return [];
  return fs
    .readFileSync(logPath, "utf-8")
    .trim()
    .split("\n")
    .filter((l) => /✅|❌|📡/.test(l))
    .slice(-lines);
}

function bar(ratio: number, width = 20): string {
  const clamped = Math.max(0, Math.min(1, ratio));
  const filled = Math.round(clamped * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
}

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h > 0) return `${h}sa ${m}dk`;
  return `${m}dk`;
}

function render(prev: Snapshot | null, startedAt: number, intervalSec: number): Snapshot {
  console.clear();
  const now = new Date().toLocaleString("tr-TR");
  const listTotal = parseFullList(LIST_FILE).length;
  let totalOk = 0;
  let totalFail = 0;

  console.log("═══════════════════════════════════════════════════════════════");
  console.log(`        SectorCalc · ${getBatchShardCount()}x deepseek-v4-pro Master Dashboard`);
  console.log(`  ${now}`);
  console.log("═══════════════════════════════════════════════════════════════");
  console.log(
    `  Batch süreci: ${isBatchRunning() ? "🟢 çalışıyor" : "🔴 durdu"}  │  Yenileme: ${intervalSec} sn`,
  );
  console.log("");

  for (const shard of SHARDS) {
    const progress = loadShardProgress(shard);
    const ok = progress?.completed.length ?? 0;
    const fail = progress?.failed.length ?? 0;
    const total = shard.end - shard.start;
    const pct = total > 0 ? (ok / total) * 100 : 0;
    const meta = parseLogMeta(shard.log);
    totalOk += ok;
    totalFail += fail;

    console.log(
      `  BATCH-${shard.id} [${shard.start}-${shard.end}]  ✅${ok} ❌${fail}  ${pct.toFixed(1)}%  [${bar(pct / 100)}]`,
    );
    console.log(
      `           ${meta.progressLine ?? "—"}  │  ${meta.currentTool ?? "—"}`,
    );
  }

  const done = totalOk + totalFail;
  const overallPct = listTotal > 0 ? (totalOk / listTotal) * 100 : 0;
  let eta = "hesaplanıyor…";
  const ts = Date.now();
  if (prev && ts > prev.ts && totalOk > prev.totalOk) {
    const rate = (totalOk - prev.totalOk) / ((ts - prev.ts) / 1000);
    const remaining = listTotal - totalOk;
    if (rate > 0 && remaining > 0) eta = formatDuration(remaining / rate);
  }

  console.log("");
  console.log(
    `  TOPLAM  ✅ ${totalOk}  ❌ ${totalFail}  │  ${overallPct.toFixed(1)}%  │  ETA: ${eta}  (hedef: ${listTotal})`,
  );
  console.log("");
  console.log("  ── Son log ──");
  for (const shard of SHARDS) {
    const line = tailLog(shard.log, 1)[0]?.trim() ?? "(log yok)";
    console.log(`  [${shard.id}] ${line}`);
  }
  console.log("");
  console.log("═══════════════════════════════════════════════════════════════");
  console.log("  Çıkış: Ctrl+C  │  Tek ölçüm: npm run watch:master-batch -- --once");

  return { totalOk, totalFail, ts };
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
    console.log("\nMaster dashboard durduruldu.");
    process.exit(0);
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
