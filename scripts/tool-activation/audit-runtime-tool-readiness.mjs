#!/usr/bin/env node
/**
 * Runtime tool readiness audit — wrapper for TS runner.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const runner = path.join(dir, "audit-runtime-tool-readiness-runner.ts");
const result = spawnSync("npx", ["tsx", runner], {
  cwd: path.join(dir, "../.."),
  stdio: "inherit",
  shell: false,
});

process.exit(result.status ?? 1);
