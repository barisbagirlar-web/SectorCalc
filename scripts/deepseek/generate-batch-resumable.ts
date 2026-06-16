#!/usr/bin/env npx tsx
/**
 * Resumable, parallel, fault-tolerant DeepSeek batch (ISO 9001 traceability).
 * Checkpoint: scripts/data/omni-batch-progress.json (slug-based, atomic writes).
 *
 * Usage:
 *   npx tsx scripts/deepseek/generate-batch-resumable.ts
 *   npx tsx scripts/deepseek/generate-batch-resumable.ts --retry-failed
 *   BATCH_CONCURRENCY=2 npm run generate:batch-resumable
 */
import { fileURLToPath } from "node:url";
import {
  PID_PATH,
  PROGRESS_PATH,
  removePidFile,
  runBatchEngine,
  writePidFile,
} from "./batch-engine";

const CONCURRENCY = Number(process.env.BATCH_CONCURRENCY ?? 2);
const DELAY_MS = Number(process.env.BATCH_DELAY_MS ?? 1000);
const MAX_RETRIES = Number(process.env.BATCH_MAX_RETRIES ?? 4);
const FETCH_TIMEOUT_MS = Number(process.env.BATCH_FETCH_TIMEOUT_MS ?? 90_000);

let stopRequested = false;

function handleShutdown(signal: string): void {
  if (stopRequested) return;
  stopRequested = true;
  console.warn(`\n⚠️  ${signal} — finishing in-flight requests, progress saved. Re-run to resume.`);
}

process.on("SIGINT", () => handleShutdown("SIGINT"));
process.on("SIGTERM", () => handleShutdown("SIGTERM"));

async function main(): Promise<void> {
  writePidFile();
  console.log(`PID ${process.pid} → ${PID_PATH}`);
  console.log(`Progress file → ${PROGRESS_PATH}`);

  const result = await runBatchEngine({
    argv: process.argv.slice(2),
    concurrency: CONCURRENCY,
    delayMs: DELAY_MS,
    maxRetries: MAX_RETRIES,
    fetchTimeoutMs: FETCH_TIMEOUT_MS,
    shouldStop: () => stopRequested,
  });

  removePidFile();

  if (result.fail > 0 && !result.stopped) {
    console.error("Re-run with --retry-failed to retry failed slugs.");
    process.exit(1);
  }
  if (result.stopped) {
    process.exit(130);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    removePidFile();
    console.error(error);
    process.exit(1);
  });
}
