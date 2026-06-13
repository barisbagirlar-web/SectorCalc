#!/usr/bin/env node
/**
 * ASR-0 — DeepSeek bulk tool repair factory.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(dir, "../..");
const runner = path.join(root, "src/lib/ai/deepseek/run-bulk-tool-repair.ts");

const result = spawnSync("npx", ["tsx", runner], {
  cwd: root,
  stdio: "inherit",
  shell: false,
  env: process.env,
});

process.exit(result.status ?? 1);
