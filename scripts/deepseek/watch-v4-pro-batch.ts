#!/usr/bin/env npx tsx
/**
 * Live dashboard for deepseek-v4-pro batch (generate-batch-final.ts).
 *
 * Usage:
 *   npm run watch:v4-pro-batch
 *   npm run watch:v4-pro-batch -- --interval=3
 *   npm run watch:v4-pro-batch -- --once
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PROJECT_ROOT } from "./load-env";

const PROGRESS_FILE = path.join(PROJECT_ROOT, ".batch-progress.json");
const OUTPUT_DIR = path.join(PROJECT_ROOT, "generated", "schemas");
const BATCH_LOG = "/tmp/v4-pro-batch.log";
const SCREEN_NAME = "v4-pro-batch";

type ProgressState = {
  completed: string[];
  failed: string[];
};

type Snapshot = {
  completed: number;
  failed: number;
  schemas: number;
  listSize: number;
  batchAlive: boolean;
  screenAlive: boolean;
  currentTool: string | null;
  progressLine: string | null;
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

function loadProgress(): ProgressState {
  if (!fs.existsSync(PROGRESS_FILE)) {
    return { completed: [], failed: [] };
  }
  return JSON.parse(fs.readFileSync(PROGRESS_FILE, "utf-8")) as ProgressState;
}

function countSchemas(): number {
  if (!fs.existsSync(OUTPUT_DIR)) return 0;
  return fs.readdirSync(OUTPUT_DIR).filter((f) => f.endsWith("-schema.json")).length;
}

function estimateListSize(): number {
  const listFile = path.join(PROJECT_ROOT, "input_calculators.txt");
  if (!fs.existsSync(listFile)) return 0;
  const lines = fs.readFileSync(listFile, "utf-8").split("\n");
  let count = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && /^[•\-*0-9]/.test(trimmed) && !trimmed.includes("(") && !trimmed.includes(")")) {
      const clean = trimmed.replace(/\([^)]*\)/g, "").replace(/^[•\-*\d.]+/, "").trim();
      if (clean && clean.length > 3) count += 1;
    }
  }
  return count;
}

function isBatchRunning(): boolean {
  try {
    const out = execSync("ps aux", { encoding: "utf-8" });
    return out.includes("generate-batch-final.ts");
  } catch {
    return false;
  }
}

function isScreenRunning(): boolean {
  try {
    const out = execSync("screen -ls", { encoding: "utf-8", stdio: ["pipe", "pipe", "pipe"] });
    return out.includes(SCREEN_NAME);
  } catch {
    return false;
  }
}

function parseLogTail(): { currentTool: string | null; progressLine: string | null; recent: string[] } {
  if (!fs.existsSync(BATCH_LOG)) {
    return { currentTool: null, progressLine: null, recent: [] };
  }
  const lines = fs.readFileSync(BATCH_LOG, "utf-8").trim().split("\n").filter(Boolean);
  const recent = lines.slice(-8);

  let currentTool: string | null = null;
  let progressLine: string | null = null;

  for (let i = lines.length - 1; i >= 0; i -= 1) {
    const line = lines[i];
    const toolMatch = line.match(/^\s*🔧\s+(.+)\.\.\.$/);
    if (toolMatch && !currentTool) {
      currentTool = toolMatch[1];
    }
    const progressMatch = line.match(/^📡\s+(\d+)\/(\d+)/);
    if (progressMatch && !progressLine) {
      progressLine = `${progressMatch[1]}/${progressMatch[2]}`;
    }
    if (currentTool && progressLine) break;
  }

  return { currentTool, progressLine, recent };
}

function takeSnapshot(): Snapshot {
  const progress = loadProgress();
  const log = parseLogTail();
  return {
    completed: progress.completed.length,
    failed: progress.failed.length,
    schemas: countSchemas(),
    listSize: estimateListSize(),
    batchAlive: isBatchRunning(),
    screenAlive: isScreenRunning(),
    currentTool: log.currentTool,
    progressLine: log.progressLine,
    ts: Date.now(),
  };
}

function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "—";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}sa ${m}dk`;
  if (m > 0) return `${m}dk ${s}sn`;
  return `${s}sn`;
}

function bar(ratio: number, width = 32): string {
  const clamped = Math.max(0, Math.min(1, ratio));
  const filled = Math.round(clamped * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
}

function render(snap: Snapshot, prev: Snapshot | null, startedAt: number): void {
  const progress = loadProgress();
  const log = parseLogTail();
  const done = snap.completed + snap.failed;
  const total = snap.listSize || done;
  const pct = total > 0 ? (done / total) * 100 : 0;

  let eta = "hesaplanıyor…";
  if (prev && snap.ts > prev.ts) {
    const delta = snap.completed - prev.completed;
    const elapsed = (snap.ts - prev.ts) / 1000;
    const remaining = total - done;
    if (delta > 0 && remaining > 0) {
      eta = formatDuration((remaining / delta) * elapsed);
    } else if (remaining <= 0) {
      eta = "tamamlandı";
    }
  }

  const ratePerMin =
    prev && snap.ts > prev.ts && snap.completed > prev.completed
      ? (((snap.completed - prev.completed) / (snap.ts - prev.ts)) * 60).toFixed(1)
      : "—";

  console.clear();
  const now = new Date().toLocaleString("tr-TR");
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║        SectorCalc · deepseek-v4-pro Batch Live Dashboard       ║");
  console.log(`║  ${now.padEnd(58)}║`);
  console.log("╚══════════════════════════════════════════════════════════════╝");
  console.log();
  console.log(`  Model         : deepseek-v4-pro`);
  console.log(
    `  Screen        : ${SCREEN_NAME} ${snap.screenAlive ? "🟢 aktif" : "⚪ yok"}`,
  );
  console.log(
    `  Batch süreci  : ${snap.batchAlive ? "🟢 çalışıyor" : "🔴 durdu"}`,
  );
  console.log(
    `  İzleme süresi : ${formatDuration((Date.now() - startedAt) / 1000)}   │   Hız: ~${ratePerMin} araç/dk   │   ETA: ${eta}`,
  );
  console.log();
  console.log(
    `  Sıra          : ${snap.progressLine ?? "—"}   │   Şu an: ${snap.currentTool ?? "—"}`,
  );
  console.log(`  Tamamlanan    : ${snap.completed.toLocaleString("tr-TR")}`);
  console.log(`  Başarısız     : ${snap.failed.toLocaleString("tr-TR")}`);
  console.log(`  Şema dosyası  : ${snap.schemas.toLocaleString("tr-TR")}`);
  console.log(`  Liste toplam  : ${snap.listSize.toLocaleString("tr-TR")}`);
  console.log(`  İlerleme      : ${pct.toFixed(1)}%  [${bar(pct / 100)}]`);
  console.log();

  if (progress.failed.length > 0) {
    const shown = progress.failed.slice(-5).join(", ");
    const more = progress.failed.length > 5 ? ` (+${progress.failed.length - 5} daha)` : "";
    console.log(`  Son hatalar   : ${shown}${more}`);
  }
  if (progress.completed.length > 0) {
    const recent = progress.completed.slice(-4).join(", ");
    console.log(`  Son başarılı  : ${recent}`);
  }

  console.log();
  console.log("  ── Son log satırları (/tmp/v4-pro-batch.log) ──");
  for (const line of log.recent) {
    console.log(`  ${line}`);
  }
  console.log();
  console.log("  Çıkış: Ctrl+C  │  Tek ölçüm: npm run watch:v4-pro-batch -- --once");
}

async function main(): Promise<void> {
  const { intervalMs, once } = parseArgv();
  const startedAt = Date.now();
  let prev: Snapshot | null = null;

  const tick = (): void => {
    const snap = takeSnapshot();
    render(snap, prev, startedAt);
    prev = snap;
  };

  tick();
  if (once) return;

  const timer = setInterval(tick, intervalMs);
  process.on("SIGINT", () => {
    clearInterval(timer);
    console.log("\nİzleme durduruldu.");
    process.exit(0);
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
