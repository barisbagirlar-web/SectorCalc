#!/usr/bin/env node
/**
 * DSK-0A — DeepSeek healthcheck entry (server/script only).
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(dir, "../..");
const runner = path.join(root, "src/lib/ai/deepseek/run-healthcheck.ts");

const result = spawnSync("npx", ["tsx", runner], {
  cwd: root,
  stdio: "inherit",
  shell: false,
});

process.exit(result.status ?? 1);
