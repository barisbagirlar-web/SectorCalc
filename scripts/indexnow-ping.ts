#!/usr/bin/env npx tsx
/**
 * IndexNow ping — runs scripts/submit-indexnow.mjs with current env.
 * Requires INDEXNOW_KEY. See docs/indexnow-setup.md
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const result = spawnSync("node", [join(scriptDir, "submit-indexnow.mjs")], {
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);
