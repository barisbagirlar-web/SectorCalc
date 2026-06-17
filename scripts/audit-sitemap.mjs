#!/usr/bin/env node
/**
 * Enterprise sitemap audit — index + locale shards, hreflang, limits, exclusions.
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const result = spawnSync("npx", ["tsx", "scripts/audit-sitemap.ts"], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});

process.exit(result.status ?? 1);
