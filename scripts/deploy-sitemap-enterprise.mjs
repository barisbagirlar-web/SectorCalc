#!/usr/bin/env node
/**
 * Enterprise sitemap + hosting deploy — single lock, canonical domain, audit gate.
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const BUILD_ID = join(ROOT, ".next/BUILD_ID");

function run(label, command, args, extraEnv = {}) {
  console.log(`\n▶ ${label}`);
  const result = spawnSync(command, args, {
    cwd: ROOT,
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_PUBLIC_SITE_URL: "https://www.sectorcalc.com",
      NODE_OPTIONS: process.env.NODE_OPTIONS ?? "--max-old-space-size=12288",
      ...extraEnv,
    },
  });
  const code = result.status ?? 1;
  if (code !== 0) {
    console.error(`✗ ${label} failed (exit ${code})`);
    process.exit(code);
  }
}

run("stop:builds", "npm", ["run", "stop:builds"]);
run("export:ai-index", "npm", ["run", "export:ai-index"]);
run("generate:sitemap-static", "npm", ["run", "generate:sitemap-static"]);
run("audit:sitemap", "npm", ["run", "audit:sitemap"]);

if (!process.env.SKIP_BUILD) {
  run("next-build-with-500-fallback", "node", ["scripts/next-build-with-500-fallback.mjs"]);
  run("validate-next-build", "node", ["scripts/validate-next-build.mjs"]);
}

if (!existsSync(BUILD_ID)) {
  console.error("✗ missing .next/BUILD_ID after build");
  process.exit(1);
}

console.log(`✓ build id: ${readFileSync(BUILD_ID, "utf8").trim()}`);

run("deploy:hosting", "npm", ["run", "deploy:hosting"], {
  SECTORCALC_FIREBASE_REUSE_BUILD: "1",
});

console.log("\n✓ enterprise sitemap deploy complete");
