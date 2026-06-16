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
import { resolveShardCount } from "./deepseek-key-pool";
import { PROJECT_ROOT } from "./load-env";
import { collectPendingTools } from "./resume-failed-batch";

const PROGRESS_FILE = path.join(PROJECT_ROOT, ".batch-progress.json");
const RESUME_PROGRESS_FILE = path.join(PROJECT_ROOT, ".batch-progress-failed-retry.json");
const OUTPUT_DIR = path.join(PROJECT_ROOT, "generated", "schemas");
const BATCH_LOG = "/tmp/v4-pro-batch.log";
const SCREEN_NAME = "v4-pro-batch";

type BatchMode = "full" | "resume" | "resume-parallel";

type ProgressState = {
  completed: string[];
  failed: string[];
};

type Snapshot = {
  mode: BatchMode;
  completed: number;
  failed: number;
  schemas: number;
  listSize: number;
  batchAlive: boolean;
  screenAlive: boolean;
  activeShards: number;
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

function isResumeParallelRunning(): boolean {
  try {
    const out = execSync("ps aux", { encoding: "utf-8" });
    return out.includes("resume-failed-batch.ts --shard-id");
  } catch {
    return false;
  }
}

function isResumeBatchRunning(): boolean {
  try {
    const out = execSync("ps aux", { encoding: "utf-8" });
    return out.includes("resume-failed-batch.ts");
  } catch {
    return false;
  }
}

function detectMode(): BatchMode {
  if (isResumeParallelRunning()) return "resume-parallel";
  if (isResumeBatchRunning()) return "resume";
  if (fs.existsSync(RESUME_PROGRESS_FILE) && isScreenRunning()) return "resume";
  return "full";
}

function loadResumeShardProgress(): ProgressState {
  const merged: ProgressState = { completed: [], failed: [] };
  const files = fs
    .readdirSync(PROJECT_ROOT)
    .filter((f) => f.startsWith(".batch-progress-failed-retry") && f.endsWith(".json"));

  for (const file of files) {
    try {
      const raw = JSON.parse(
        fs.readFileSync(path.join(PROJECT_ROOT, file), "utf-8"),
      ) as ProgressState;
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

function resolveProgressFile(mode: BatchMode): string {
  return mode === "resume" ? RESUME_PROGRESS_FILE : PROGRESS_FILE;
}

function loadProgress(mode: BatchMode): ProgressState {
  if (mode === "resume" || mode === "resume-parallel") {
    return loadResumeShardProgress();
  }
  const file = resolveProgressFile(mode);
  if (!fs.existsSync(file)) {
    return { completed: [], failed: [] };
  }
  return JSON.parse(fs.readFileSync(file, "utf-8")) as ProgressState;
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
    return out.includes("generate-batch-final.ts") || out.includes("resume-failed-batch.ts");
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

function isScreenRunning(): boolean {
  if (countResumeScreens() > 0) return true;
  try {
    const out = execSync("screen -ls", {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "pipe"],
    });
    return out.includes(SCREEN_NAME);
  } catch (error) {
    if (error && typeof error === "object" && "stdout" in error) {
      const stdout = String((error as { stdout?: string }).stdout ?? "");
      return stdout.includes(SCREEN_NAME);
    }
    return false;
  }
}

function parseLogTail(mode: BatchMode): {
  currentTool: string | null;
  progressLine: string | null;
  queueTotal: number | null;
  recent: string[];
} {
  const logPaths =
    mode === "resume-parallel"
      ? Array.from({ length: resolveShardCount() }, (_, i) => `/tmp/resume-shard-${i + 1}.log`)
      : [BATCH_LOG];

  let currentTool: string | null = null;
  let progressLine: string | null = null;
  let queueTotal: number | null = null;
  const recent: string[] = [];

  for (const logPath of logPaths) {
    if (!fs.existsSync(logPath)) continue;
    const lines = fs.readFileSync(logPath, "utf-8").trim().split("\n").filter(Boolean);
    recent.push(...lines.slice(-2));

    for (let i = lines.length - 1; i >= 0; i -= 1) {
      const line = lines[i];
      const toolMatch = line.match(/^\s*🔧\s+(.+)\.\.\.$/);
      if (toolMatch && !currentTool) currentTool = toolMatch[1];
      const progressMatch = line.match(/^📡\s+([\d\-]+)\/(\d+)/);
      if (progressMatch && !progressLine) {
        progressLine = `${progressMatch[1]}/${progressMatch[2]}`;
      }
      const queueMatch = line.match(/Global schema eksik:\s*(\d+)/);
      if (queueMatch && queueTotal === null) {
        queueTotal = Number(queueMatch[1]) || null;
      }
      const legacyQueue = line.match(/Schema eksik \(kuyruk\):\s*(\d+)/);
      if (legacyQueue && queueTotal === null) {
        queueTotal = Number(legacyQueue[1]) || null;
      }
    }
  }

  return {
    currentTool,
    progressLine,
    queueTotal,
    recent: recent.slice(-10),
  };
}

function takeSnapshot(): Snapshot {
  const mode = detectMode();
  const progress = loadProgress(mode);
  const log = parseLogTail(mode);
  const resumeTotal = collectPendingTools().length + progress.completed.length + progress.failed.length;
  const listSize =
    mode === "resume" || mode === "resume-parallel"
      ? log.queueTotal ?? resumeTotal
      : estimateListSize();
  return {
    mode,
    completed: progress.completed.length,
    failed: progress.failed.length,
    schemas: countSchemas(),
    listSize,
    batchAlive: isBatchRunning(),
    screenAlive: isScreenRunning(),
    activeShards: mode === "resume-parallel" ? countResumeScreens() : mode === "resume" ? 1 : 0,
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
  const progress = loadProgress(snap.mode);
  const log = parseLogTail(snap.mode);
  const done = snap.completed + snap.failed;
  const total = snap.listSize || done;
  const pct = total > 0 ? (done / total) * 100 : 0;
  const modeLabel =
    snap.mode === "resume-parallel"
      ? `failed-retry ×${snap.activeShards} key (${total.toLocaleString("tr-TR")} araç)`
      : snap.mode === "resume"
        ? `failed-retry (${total.toLocaleString("tr-TR")} araç)`
        : `full batch (${total.toLocaleString("tr-TR")} araç)`;

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
  console.log(`  Mod           : ${modeLabel}`);
  console.log(`  Model         : deepseek-v4-pro`);
  console.log(
    `  Screen        : ${snap.activeShards > 0 ? `${snap.activeShards} resume-shard 🟢` : `${SCREEN_NAME} ${snap.screenAlive ? "🟢 aktif" : "⚪ yok"}`}`,
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
  console.log("  ── Son log satırları (resume-shard / v4-pro-batch) ──");
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
