#!/usr/bin/env node
/**
 * IndexNow submit entry — delegates to TypeScript implementation (batching + locale modes).
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const result = spawnSync("npx", ["tsx", "scripts/submit-indexnow.ts"], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);
