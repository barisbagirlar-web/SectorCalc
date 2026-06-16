#!/usr/bin/env npx tsx
/** Thin wrapper — delegates to resumable batch engine (backward compatible). */
import { fileURLToPath } from "node:url";
import { runBatchEngine } from "./batch-engine";

const CONCURRENCY = Number(process.env.BATCH_SIZE ?? process.env.BATCH_CONCURRENCY ?? 3);
const DELAY_MS = Number(process.env.BATCH_DELAY_MS ?? 1000);
const MAX_RETRIES = Number(process.env.BATCH_MAX_RETRIES ?? 4);
const FETCH_TIMEOUT_MS = Number(process.env.BATCH_FETCH_TIMEOUT_MS ?? 90_000);

async function main(): Promise<void> {
  const result = await runBatchEngine({
    argv: process.argv.slice(2),
    concurrency: CONCURRENCY,
    delayMs: DELAY_MS,
    maxRetries: MAX_RETRIES,
    fetchTimeoutMs: FETCH_TIMEOUT_MS,
  });
  if (result.fail > 0) {
    process.exit(1);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
