#!/usr/bin/env npx tsx
/** Alias entrypoint — forwards to translate-schema-fields-with-deepseek.ts */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "translate-schema-fields-with-deepseek.ts");
const result = spawnSync("npx", ["tsx", scriptPath, ...process.argv.slice(2)], {
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);
