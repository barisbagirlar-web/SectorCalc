#!/usr/bin/env npx tsx
/**
 * Live Omni batch dashboard — stub/real counts, ETA, PID, failed slugs.
 *
 * Usage:
 *   npm run watch:omni-batch
 *   npm run watch:omni-batch -- --interval=3
 *   npm run watch:omni-batch -- --once
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { OUTPUT_DIR, PID_PATH, PROGRESS_PATH, type ProgressState } from "./batch-engine";
import { isStubSchemaFile } from "./is-stub-schema";
import { parseCalculatorListEntries, defaultListFilePath } from "./parse-calculator-list";
import { PROJECT_ROOT } from "./load-env";

const WATCHER_LOG = "/tmp/omni-watcher.log";
const RESILIENT_LOG = "/tmp/omni-resilient.log";

type Snapshot = {
  readonly real: number;
  readonly stubs: number;
  readonly total: number;
  readonly listSize: number;
  readonly completed: number;
  readonly failed: number;
  readonly lastUpdated: string | null;
  readonly ts: number;
};

function parseArgv(): { intervalMs: number; once: boolean } {
  const argv = process.argv.slice(2);
  let intervalMs = 5000;
  let once = false;
  for (const arg of argv) {
    if (arg === "--once") once = true;
    if (arg.startsWith("--interval=")) intervalMs = Number(arg.slice(11)) * 1000;
    if (arg === "--interval" && argv[argv.indexOf(arg) + 1]) {
      intervalMs = Number(argv[argv.indexOf(arg) + 1]) * 1000;
    }
  }
  return { intervalMs: Number.isFinite(intervalMs) && intervalMs >= 1000 ? intervalMs : 5000, once };
}

function isProcessAlive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function readPid(): number | null {
  if (!fs.existsSync(PID_PATH)) return null;
  const n = Number(fs.readFileSync(PID_PATH, "utf-8").trim());
  return Number.isFinite(n) && n > 0 ? n : null;
}

function loadProgress(): ProgressState {
  if (!fs.existsSync(PROGRESS_PATH)) {
    return { completed: [], failed: [] };
  }
  return JSON.parse(fs.readFileSync(PROGRESS_PATH, "utf-8")) as ProgressState;
}

function countSchemas(): Pick<Snapshot, "real" | "stubs" | "total"> {
  let real = 0;
  let stubs = 0;
  if (!fs.existsSync(OUTPUT_DIR)) {
    return { real: 0, stubs: 0, total: 0 };
  }
  for (const file of fs.readdirSync(OUTPUT_DIR)) {
    if (!file.endsWith("-schema.json")) continue;
    const full = path.join(OUTPUT_DIR, file);
    if (isStubSchemaFile(full)) stubs += 1;
    else real += 1;
  }
  return { real, stubs, total: real + stubs };
}

function takeSnapshot(): Snapshot {
  const counts = countSchemas();
  const progress = loadProgress();
  let listSize = 0;
  try {
    listSize = parseCalculatorListEntries(defaultListFilePath()).length;
  } catch {
    listSize = 0;
  }
  return {
    ...counts,
    listSize,
    completed: progress.completed?.length ?? 0,
    failed: progress.failed?.length ?? 0,
    lastUpdated: progress.lastUpdated ?? null,
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

function tailLog(filePath: string, lines = 2): string[] {
  if (!fs.existsSync(filePath)) return [];
  const content = fs.readFileSync(filePath, "utf-8").trim();
  if (!content) return [];
  return content.split("\n").slice(-lines);
}

function bar(ratio: number, width = 30): string {
  const clamped = Math.max(0, Math.min(1, ratio));
  const filled = Math.round(clamped * width);
  return "█".repeat(filled) + "░".repeat(width - filled);
}

function render(
  snap: Snapshot,
  prev: Snapshot | null,
  startedAt: number,
): void {
  const pid = readPid();
  const batchAlive = pid !== null && isProcessAlive(pid);
  const progress = loadProgress();
  const pct = snap.total > 0 ? (snap.real / snap.total) * 100 : 0;

  let eta = "hesaplanıyor…";
  if (prev && snap.ts > prev.ts) {
    const realDelta = snap.real - prev.real;
    const elapsed = (snap.ts - prev.ts) / 1000;
    if (realDelta > 0 && snap.stubs > 0) {
      const rate = realDelta / elapsed;
      eta = formatDuration(snap.stubs / rate);
    } else if (snap.stubs === 0) {
      eta = "tamamlandı";
    }
  }

  const elapsedTotal = formatDuration((Date.now() - startedAt) / 1000);
  const ratePerMin =
    prev && snap.ts > prev.ts && snap.real > prev.real
      ? (((snap.real - prev.real) / (snap.ts - prev.ts)) * 60).toFixed(1)
      : "—";

  console.clear();
  const now = new Date().toLocaleString("tr-TR");
  console.log("╔══════════════════════════════════════════════════════════════╗");
  console.log("║           SectorCalc · Omni Batch Live Dashboard             ║");
  console.log(`║  ${now.padEnd(58)}║`);
  console.log("╚══════════════════════════════════════════════════════════════╝");
  console.log();
  console.log(`  Batch PID     : ${pid ?? "—"} ${batchAlive ? "🟢 çalışıyor" : "⚪ durdu"}`);
  console.log(`  İzleme süresi : ${elapsedTotal}   │   Hız: ~${ratePerMin} şema/dk   │   ETA: ${eta}`);
  console.log();
  console.log(`  Gerçek şema   : ${snap.real.toLocaleString("tr-TR")}`);
  console.log(`  Stub kalan    : ${snap.stubs.toLocaleString("tr-TR")}`);
  console.log(`  Toplam dosya  : ${snap.total.toLocaleString("tr-TR")}  (liste: ${snap.listSize})`);
  console.log(`  İlerleme      : ${pct.toFixed(1)}%  [${bar(pct / 100)}]`);
  console.log();
  console.log(`  Bu oturum OK  : ${snap.completed}   │   Başarısız: ${snap.failed}`);
  if (progress.failed && progress.failed.length > 0) {
    const shown = progress.failed.slice(0, 6).join(", ");
    const more = progress.failed.length > 6 ? ` +${progress.failed.length - 6}` : "";
    console.log(`  Failed slugs  : ${shown}${more}`);
  }
  if (progress.completed && progress.completed.length > 0) {
    const recent = progress.completed.slice(-4).join(", ");
    console.log(`  Son üretilen  : ${recent}`);
  }
  console.log(`  Son checkpoint: ${snap.lastUpdated ?? "—"}`);
  console.log();
  console.log("  ── Watcher / pipeline log ──");
  for (const line of tailLog(WATCHER_LOG, 2)) console.log(`  ${line}`);
  for (const line of tailLog(RESILIENT_LOG, 2)) console.log(`  ${line}`);
  console.log();
  console.log("  Çıkış: Ctrl+C  │  Tek ölçüm: npm run watch:omni-batch -- --once");
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
