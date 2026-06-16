#!/usr/bin/env node
/** Resilient loop: batch → until stubs=0 or max rounds. Then post-pipeline. */
import { spawnSync } from "node:child_process";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "../..");
const MAX_ROUNDS = Number(process.env.OMNI_BATCH_MAX_ROUNDS ?? 50);

function run(cmd, env = {}) {
  console.log(`\n▶ ${cmd}`);
  const r = spawnSync(cmd, { shell: true, cwd: ROOT, stdio: "inherit", env: { ...process.env, ...env } });
  return r.status ?? 1;
}

function stubCount() {
  const r = spawnSync(
    "npx",
    ["tsx", "-e", `
import fs from 'node:fs'; import path from 'node:path';
import { isStubSchemaFile } from './scripts/deepseek/is-stub-schema.ts';
const dir=path.join(process.cwd(),'generated/schemas');
let s=0,t=0;
for(const f of fs.readdirSync(dir)){if(!f.endsWith('-schema.json'))continue;t++;if(isStubSchemaFile(path.join(dir,f)))s++;}
console.log(s);
`],
    { cwd: ROOT, encoding: "utf8" },
  );
  return Number(r.stdout.trim() || "99999");
}

let stubs = stubCount();
console.log(`Starting resilient batch. stubs=${stubs}`);

for (let round = 1; round <= MAX_ROUNDS && stubs > 0; round += 1) {
  console.log(`\n=== BATCH ROUND ${round}/${MAX_ROUNDS} (stubs=${stubs}) ===`);
  const code = run("npm run generate:batch-resumable", {
    BATCH_CONCURRENCY: process.env.BATCH_CONCURRENCY ?? "2",
    BATCH_DELAY_MS: process.env.BATCH_DELAY_MS ?? "1000",
  });
  stubs = stubCount();
  console.log(`Round ${round} exit=${code} stubs=${stubs}`);
  if (stubs === 0) break;
}

if (stubs > 0) {
  console.error(`STOP: ${stubs} stub schemas remain after ${MAX_ROUNDS} rounds`);
  process.exit(1);
}

console.log("\n=== POST PIPELINE ===");
const post = run("npm run complete:omni-free-tools -- --skip-batch", {
  SECTORCALC_FORCE_FULL_STATIC: "1",
  NODE_OPTIONS: "--max-old-space-size=12288",
});
if (post !== 0) process.exit(post);

const gate = run("node scripts/deepseek/verify-omni-completion.mjs");
process.exit(gate);
