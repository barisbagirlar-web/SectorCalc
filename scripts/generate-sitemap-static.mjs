#!/usr/bin/env node
/**
 * Build-time locale sitemap shards — public/sitemap/{locale}.xml
 */
import { spawnSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const result = spawnSync("npx", ["tsx", "scripts/generate-sitemap-static.ts"], {
  cwd: root,
  stdio: "inherit",
  env: {
    ...process.env,
    NEXT_PUBLIC_SITE_URL:
      process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://sectorcalc.com",
  },
});

process.exit(result.status ?? 1);
