#!/usr/bin/env node
/**
 * P4 — Deploy guard audit (GO / NO_GO).
 * Does not deploy. Aggregates gate reports before production release.
 */
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { loadEnvLocal } from "../ai/load-env-local.mjs";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..");
const REPORT_PATH = path.join(ROOT, "scripts/.cache/p4-deploy-guard-report.json");

const PROBLEM_SLUG = "abonelik-yazilim-cloud-yillik-maliyet-hesabi";
const EXPECTED_PAYMENT_ELIGIBLE = 20;
const EXPECTED_FORMULA_GATE_ELIGIBLE = 20;

const FORBIDDEN_STAGED_RE =
  /(^\.env|^scripts\/\.cache\/|^public\/ai-|^next-env\.d\.ts$|^functions\/|^apps\/|^src\/lib\/billing\/)/;

const CACHE_REPORTS = {
  p24: "scripts/.cache/p24-tool-quality-report.json",
  runtimeTrust: "scripts/.cache/runtime-trust-engine-report.json",
  p25: "scripts/.cache/tool-quality-control-plane.json",
  inputGuides: "scripts/.cache/input-guide-audit-report.json",
  quarantine: "scripts/.cache/quarantine-recovery-report.json",
  goldenOracle: "scripts/.cache/p4-golden-oracle-report.json",
  runtimeSmoke: "scripts/.cache/p4-runtime-smoke-report.json",
  brevoDryRun: "scripts/.cache/p4-brevo-health-dry-run.json",
};

const blockers = [];
const warnings = [];
const gates = [];

function addGate(name, status, detail = "") {
  gates.push({ name, status, detail });
  if (status === "FAIL") {
    blockers.push(`${name}:${detail || "fail"}`);
  } else if (status === "WARN") {
    warnings.push(`${name}:${detail || "warn"}`);
  }
}

function readJson(relativePath) {
  const absolute = path.join(ROOT, relativePath);
  if (!fs.existsSync(absolute)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(absolute, "utf8"));
}

function runCommandGate(name, command) {
  const result = spawnSync(command, {
    cwd: ROOT,
    shell: true,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const ok = result.status === 0;
  addGate(name, ok ? "PASS" : "FAIL", ok ? "exit 0" : (result.stderr || result.stdout || "exit non-zero").trim().slice(0, 200));
  return ok;
}

function checkGitWorkingTree() {
  const status = spawnSync("git status --porcelain", {
    cwd: ROOT,
    shell: true,
    encoding: "utf8",
  });
  const dirty = (status.stdout ?? "").trim();
  if (dirty) {
    const lines = dirty.split("\n").filter(Boolean);
    addGate("git_working_tree_clean", "FAIL", `${lines.length} dirty entries`);
    return;
  }
  addGate("git_working_tree_clean", "PASS", "clean");
}

function checkForbiddenStaged() {
  const staged = spawnSync("git diff --cached --name-only", {
    cwd: ROOT,
    shell: true,
    encoding: "utf8",
  });
  const files = (staged.stdout ?? "").split("\n").map((line) => line.trim()).filter(Boolean);
  const forbidden = files.filter((file) => FORBIDDEN_STAGED_RE.test(file));
  if (forbidden.length > 0) {
    addGate("forbidden_staged_files", "FAIL", forbidden.join(", "));
    return;
  }
  addGate("forbidden_staged_files", "PASS", files.length === 0 ? "none staged" : `${files.length} safe staged`);
}

function checkCacheNotCommitted() {
  const tracked = spawnSync("git ls-files scripts/.cache", {
    cwd: ROOT,
    shell: true,
    encoding: "utf8",
  });
  const files = (tracked.stdout ?? "").trim();
  if (files) {
    addGate("no_cache_committed", "FAIL", files.split("\n").slice(0, 5).join(", "));
    return;
  }
  addGate("no_cache_committed", "PASS", "gitignored");
}

function checkTrustReport() {
  const report = readJson(CACHE_REPORTS.runtimeTrust);
  if (!report) {
    addGate("runtime_trust", "FAIL", "missing report");
    return;
  }

  const freePayment = (report.items ?? []).filter((item) => item.paymentEligible && item.tier === "free");
  const problem = (report.items ?? []).find((item) => item.slug === PROBLEM_SLUG);

  const trustOk =
    report.paymentEligible === EXPECTED_PAYMENT_ELIGIBLE &&
    report.formulaGateEligible === EXPECTED_FORMULA_GATE_ELIGIBLE &&
    freePayment.length === 0 &&
    problem &&
    !problem.paymentEligible &&
    !problem.formulaGateEligible;

  addGate(
    "runtime_trust",
    trustOk ? "PASS" : "FAIL",
    `payment=${report.paymentEligible} formulaGate=${report.formulaGateEligible} freePayment=${freePayment.length}`,
  );
  addGate(
    "problem_slug_safe",
    problem && !problem.paymentEligible && !problem.formulaGateEligible ? "PASS" : "FAIL",
  );
  addGate("free_payment_eligible_zero", freePayment.length === 0 ? "PASS" : "FAIL", String(freePayment.length));
  addGate(
    "payment_eligible_boundary",
    report.paymentEligible === EXPECTED_PAYMENT_ELIGIBLE ? "PASS" : "FAIL",
    String(report.paymentEligible),
  );
  addGate(
    "formula_gate_eligible_boundary",
    report.formulaGateEligible === EXPECTED_FORMULA_GATE_ELIGIBLE ? "PASS" : "FAIL",
    String(report.formulaGateEligible),
  );
}

function checkP24Report() {
  const report = readJson(CACHE_REPORTS.p24);
  if (!report?.summary) {
    addGate("p24_tool_quality", "FAIL", "missing report");
    return;
  }
  addGate(
    "p24_tool_quality",
    "PASS",
    `PASS/WARN/FAIL/QUARANTINE=${report.summary.byVerdict.PASS}/${report.summary.byVerdict.WARN}/${report.summary.byVerdict.FAIL}/${report.summary.byVerdict.QUARANTINE}`,
  );
}

function checkP25Report() {
  const report = readJson(CACHE_REPORTS.p25);
  if (!report?.summary) {
    addGate("p25_control_plane", "FAIL", "missing report");
    return;
  }
  addGate("p25_control_plane", "PASS", `tools=${report.summary.totalTools}`);
}

function checkInputGuidesReport() {
  const report = readJson(CACHE_REPORTS.inputGuides);
  if (!report) {
    addGate("input_guides", "FAIL", "missing report");
    return;
  }
  addGate("input_guides", "PASS", `checked=${report.totalChecked ?? "n/a"}`);
}

function checkQuarantineReport() {
  const report = readJson(CACHE_REPORTS.quarantine);
  if (!report) {
    addGate("quarantine_recovery", "FAIL", "missing report");
    return;
  }
  addGate("quarantine_recovery", "PASS", `quarantine=${report.summary?.totalQuarantine ?? "n/a"}`);
}

function checkGoldenOracleReport() {
  const report = readJson(CACHE_REPORTS.goldenOracle);
  if (!report) {
    addGate("golden_oracle", "FAIL", "missing report — run npm run test:p4-golden-oracle");
    return;
  }
  addGate("golden_oracle", report.verdict === "PASS" ? "PASS" : "FAIL", report.verdict);
}

function checkRuntimeSmokeReport() {
  const report = readJson(CACHE_REPORTS.runtimeSmoke);
  if (!report) {
    addGate("runtime_smoke", "FAIL", "missing report — run npm run test:p4-runtime-smoke");
    return;
  }
  addGate("runtime_smoke", report.verdict === "PASS" ? "PASS" : "FAIL", report.verdict);
}

function checkDeepSeekHealth() {
  loadEnvLocal();
  const apiKey = process.env.DEEPSEEK_API_KEY?.trim();
  if (!apiKey) {
    addGate("deepseek_health", "WARN", "DEEPSEEK_API_KEY missing — unavailable, not blocking");
    return;
  }

  const result = spawnSync("npm run ai:deepseek:health", {
    cwd: ROOT,
    shell: true,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  if (result.status === 0) {
    addGate("deepseek_health", "PASS", "ok");
  } else {
    const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
    if (/STATUS:\s*unavailable/i.test(output)) {
      addGate("deepseek_health", "WARN", "unavailable");
    } else {
      addGate("deepseek_health", "WARN", "error — not blocking for P4");
    }
  }
}

function checkBrevoDryRun() {
  const report = readJson(CACHE_REPORTS.brevoDryRun);
  if (!report) {
    addGate("brevo_dry_run", "WARN", "missing report — run npm run notify:p4-brevo-dry-run");
    return;
  }
  if (report.status === "unavailable") {
    addGate("brevo_dry_run", "PASS", "unavailable — no blocker");
    return;
  }
  addGate("brevo_dry_run", report.mustNotSend ? "PASS" : "WARN", report.status);
}

function main() {
  console.log("=== audit:p4-deploy-guard ===\n");

  checkGitWorkingTree();
  checkForbiddenStaged();
  checkCacheNotCommitted();
  runCommandGate("assert_revenue_gate", "npm run assert:revenue-gate");
  checkP24Report();
  checkTrustReport();
  checkP25Report();
  checkInputGuidesReport();
  checkQuarantineReport();
  checkGoldenOracleReport();
  checkRuntimeSmokeReport();
  checkDeepSeekHealth();
  checkBrevoDryRun();

  const verdict = blockers.length === 0 ? "GO" : "NO_GO";
  const nextAction =
    verdict === "GO"
      ? "All P4 gates passed. Manual UI checklist still required before deploy. No auto-deploy in P4."
      : "Fix blockers, re-run P4 scripts, then audit:p4-deploy-guard again.";

  const report = {
    generatedAt: new Date().toISOString(),
    verdict,
    gates,
    blockers: [...new Set(blockers)],
    warnings,
    nextAction,
  };

  fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });
  fs.writeFileSync(REPORT_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");

  console.log(`verdict: ${verdict}`);
  console.log(`gates: ${gates.length}`);
  console.log(`blockers: ${report.blockers.length}`);
  console.log(`warnings: ${warnings.length}`);
  console.log(`nextAction: ${nextAction}`);
  console.log(`output: ${path.relative(ROOT, REPORT_PATH)}`);

  console.log("\nGate summary:");
  for (const gate of gates) {
    console.log(` ${gate.status === "PASS" ? "✓" : gate.status === "WARN" ? "!" : "✗"} ${gate.name}: ${gate.status}${gate.detail ? ` (${gate.detail})` : ""}`);
  }

  if (report.blockers.length > 0) {
    console.error("\nBlockers:");
    for (const blocker of report.blockers) {
      console.error(` - ${blocker}`);
    }
    process.exit(1);
  }

  console.log("\naudit:p4-deploy-guard GO");
}

main();
