#!/usr/bin/env node
/**
 * ERT-0 — Runtime Trust Engine audit wrapper.
 * Phase 1: regenerate P2.4 snapshot (fresh write, no stale imports).
 * Phase 2: evaluate trust in a new process (fresh module cache).
 * Phase 3: revenue allowlist kill-switch on audit output only.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { isRevenueEligibleAllowed } from "./revenue-eligible-allowlist.mjs";

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(dir, "../..");
const regenerate = path.join(dir, "audit-runtime-trust-engine-regenerate-p24.ts");
const runner = path.join(dir, "audit-runtime-trust-engine-runner.ts");
const REPORT_PATH = path.join(root, "scripts/.cache/runtime-trust-engine-report.json");

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

function applyRevenueAllowlistKillSwitch() {
  if (!fs.existsSync(REPORT_PATH)) {
    console.error("audit:runtime-trust-engine phase 3 FAIL — missing report");
    process.exit(1);
  }

  const report = JSON.parse(fs.readFileSync(REPORT_PATH, "utf8"));
  const items = report.items ?? [];
  let stripped = 0;

  for (const item of items) {
    if (isRevenueEligibleAllowed(item.slug)) {
      continue;
    }

    const wasEligible = item.paymentEligible || item.formulaGateEligible;
    item.paymentEligible = false;
    item.formulaGateEligible = false;

    if (!item.findings.includes("revenue_allowlist_not_approved")) {
      item.findings.push("revenue_allowlist_not_approved");
    }
    if (!item.findings.includes("formula_gate_not_safe")) {
      item.findings.push("formula_gate_not_safe");
    }
    if (!item.findings.includes("payment_not_safe")) {
      item.findings.push("payment_not_safe");
    }

    if (item.status === "ready") {
      item.status = "review";
    }

    if (wasEligible) {
      stripped += 1;
    }
  }

  report.ready = items.filter((item) => item.status === "ready").length;
  report.review = items.filter((item) => item.status === "review").length;
  report.blocked = items.filter((item) => item.status === "blocked").length;
  report.formulaGateEligible = items.filter((item) => item.formulaGateEligible).length;
  report.paymentEligible = items.filter((item) => item.paymentEligible).length;

  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log("audit:runtime-trust-engine phase 3 PASS");
  console.log(`revenue allowlist kill-switch: stripped ${stripped} slug(s)`);
  console.log(`paymentEligible: ${report.paymentEligible}`);
  console.log(`formulaGateEligible: ${report.formulaGateEligible}`);
}

runPhase("phase 1", regenerate);
runPhase("phase 2", runner);
applyRevenueAllowlistKillSwitch();

console.log("audit:runtime-trust-engine PASS");
process.exit(0);
