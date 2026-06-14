#!/usr/bin/env node
/**
 * P7 — Full nightrun orchestrator: audit → apply → verify.
 */
import { execFileSync } from "node:child_process";
import { ROOT } from "./lib/activation-paths.mjs";

const steps = [
  { name: "audit:p7-night", cmd: "npm", args: ["run", "audit:p7-night"] },
  { name: "apply:p7-night-schema", cmd: "npm", args: ["run", "apply:p7-night-schema"] },
  { name: "apply:p7-night", cmd: "npm", args: ["run", "apply:p7-night"] },
  { name: "verify:p7-night", cmd: "npm", args: ["run", "verify:p7-night"] },
];

function runStep(step) {
  console.log(`\n=== ${step.name} START ===`);
  execFileSync(step.cmd, step.args, {
    cwd: ROOT,
    stdio: "inherit",
    env: {
      ...process.env,
      P7_NIGHT_RESET_CHECKPOINT: process.env.P7_NIGHT_RESET_CHECKPOINT ?? "0",
    },
  });
  console.log(`=== ${step.name} PASS ===`);
}

try {
  for (const step of steps) {
    runStep(step);
  }
  console.log("\n=== p7-night-run-all PASS ===");
} catch (error) {
  console.error("\n=== p7-night-run-all FAIL ===");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
