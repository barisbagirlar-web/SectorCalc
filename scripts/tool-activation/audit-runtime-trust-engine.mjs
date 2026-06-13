#!/usr/bin/env node
/**
 * ERT-0 — Runtime Trust Engine audit wrapper.
 * Phase 1: regenerate P2.4 snapshot (fresh write, no stale imports).
 * Phase 2: evaluate trust in a new process (fresh module cache).
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(dir, "../..");
const regenerate = path.join(dir, "audit-runtime-trust-engine-regenerate-p24.ts");
const runner = path.join(dir, "audit-runtime-trust-engine-runner.ts");

function runPhase(label, scriptPath) {
  const result = spawnSync("npx", ["tsx", scriptPath], {
    cwd: root,
    stdio: "inherit",
    shell: false,
  });
  if (result.status !== 0) {
    console.error(`audit:runtime-trust-engine ${label} FAIL`);
    process.exit(result.status ?? 1);
  }
}

runPhase("phase 1", regenerate);
runPhase("phase 2", runner);

console.log("audit:runtime-trust-engine PASS");
process.exit(0);
