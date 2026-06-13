#!/usr/bin/env node
/**
 * DSK-1 — DeepSeek Formula Auditor entry (no auto patch / commit).
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(dir, "../..");
const runner = path.join(root, "src/lib/ai/deepseek/run-formula-audit.ts");

const result = spawnSync("npx", ["tsx", runner], {
  cwd: root,
  stdio: "inherit",
  shell: false,
});

process.exit(result.status ?? 1);
