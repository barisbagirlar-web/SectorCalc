#!/usr/bin/env node
/**
 * ASR-0 — DeepSeek bulk tool repair factory entry.
 *
 * Env:
 *   DEEPSEEK_BULK_LIMIT=100
 *   DEEPSEEK_REPAIR_MODE=plan|apply
 *   DEEPSEEK_REPAIR_RISK=low,medium
 *   DEEPSEEK_REPAIR_CHUNK_SIZE=10
 *   DEEPSEEK_REPAIR_ALLOW_DETERMINISTIC_FALLBACK=true
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvLocal } from "./load-env-local.mjs";

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(dir, "../..");
const runner = path.join(root, "src/lib/ai/deepseek/run-bulk-tool-repair.ts");

loadEnvLocal();

const result = spawnSync("npx", ["tsx", runner], {
  cwd: root,
  stdio: "inherit",
  shell: false,
  env: process.env,
});

process.exit(result.status ?? 1);
