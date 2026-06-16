#!/usr/bin/env node
/**
 * Zero-debt Omni free-tools completion pipeline.
 * Phase 1: DeepSeek domain schemas (stubs only)
 * Phase 2: compile + registry + catalog sync
 * Phase 3: DeepSeek i18n copy map + apply to schemas + input bundles
 * Phase 4: full static SSG build
 */
import { spawnSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "../..");
const args = process.argv.slice(2);
const skipBatch = args.includes("--skip-batch");
const skipTranslate = args.includes("--skip-translate");
const skipBuild = args.includes("--skip-build");
const limitArg = args.find((a) => a.startsWith("--limit="));
const limit = limitArg ? limitArg.slice("--limit=".length) : null;

function run(cmd, env = {}) {
  console.log(`\n▶ ${cmd}`);
  const result = spawnSync(cmd, {
    shell: true,
    cwd: ROOT,
    stdio: "inherit",
    env: { ...process.env, ...env },
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function countStubs() {
  const out = spawnSync(
    "npx",
    ["tsx", "-e", `
import fs from 'node:fs';
import path from 'node:path';
import { isStubSchemaFile } from './scripts/deepseek/is-stub-schema.ts';
const dir = path.join(process.cwd(), 'generated/schemas');
let stubs = 0, total = 0;
for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith('-schema.json')) continue;
  total++;
  if (isStubSchemaFile(path.join(dir, f))) stubs++;
}
console.log(JSON.stringify({ stubs, total }));
`],
    { cwd: ROOT, encoding: "utf8" },
  );
  return JSON.parse(out.stdout.trim() || '{"stubs":0,"total":0}');
}

if (!existsSync(join(ROOT, ".env.local")) || !readFileSync(join(ROOT, ".env.local"), "utf8").includes("DEEPSEEK_API_KEY=")) {
  console.error("DEEPSEEK_API_KEY missing in .env.local");
  process.exit(1);
}

const before = countStubs();
console.log(`stub schemas before: ${before.stubs}/${before.total}`);

if (!skipBatch) {
  const batchCmd = limit
    ? `npm run generate:batch-list -- --limit=${limit}`
    : "npm run generate:batch-list";
  run(batchCmd);
}

run("npm run generate:all");
run("npm run generate:registry");
run("npm run sync:free-catalog");

if (!skipTranslate) {
  run("npm run translate:generated-schema-copy");
  run("npx tsx scripts/deepseek/apply-copy-map-to-schemas.ts");
  run("node scripts/generate-generated-schema-inputs-i18n.mjs");
}

run("npm run export:ai-tool-index");

const after = countStubs();
console.log(`stub schemas after: ${after.stubs}/${after.total}`);

if (!skipBuild) {
  run("npm run build", {
    SECTORCALC_FORCE_FULL_STATIC: "1",
    NODE_OPTIONS: "--max-old-space-size=12288",
  });
}

console.log("\n✅ complete:omni-free-tools pipeline finished");
