#!/usr/bin/env node
/**
 * Autonomous Release Gate orchestrator (P11).
 *
 * Runs the deterministic gate command list, manages a local server for the
 * smoke suite, and emits a PASS/FAIL report. This is NOT uncontrolled
 * auto-deploy: it only runs checks and blocks unsafe releases (exit 1).
 *
 * It complements (does not replace) scripts/release-gate-check.ts, the CI
 * proof-scoring layer. When run with --proof, it feeds its own gate results to
 * that scorer via RELEASE_GATE_FROM_ENV so the proof is not double-computed.
 *
 * Usage:
 *   node scripts/release-gate.mjs            # full run, starts local server
 *   node scripts/release-gate.mjs --dry-run  # validate plan only, no execution
 *   RELEASE_GATE_BASE_URL=https://host node scripts/release-gate.mjs  # external target
 */

import { spawn, spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const args = process.argv.slice(2);
const DRY_RUN = args.includes("--dry-run");
const WRITE_REPORT = !args.includes("--no-report");

const PORT = process.env.RELEASE_GATE_PORT ?? "3320";
const EXTERNAL_BASE = process.env.RELEASE_GATE_BASE_URL?.replace(/\/$/, "");
const BASE_URL = EXTERNAL_BASE ?? `http://localhost:${PORT}`;
const REPORT_PATH = "docs/release-gate-report.md";

// --- Step plan -------------------------------------------------------------

/** Build/lint/type gates that run without a server. */
const PRE_SERVER_STEPS = [
  { name: "lint", cmd: "npm run lint", critical: true },
  { name: "typescript", cmd: "npx tsc --noEmit", critical: true },
  { name: "check:secrets", cmd: "npm run check:secrets", critical: true },
  { name: "assert:route-cache-policy", cmd: "npm run assert:route-cache-policy", critical: true },
  { name: "build", cmd: "npm run build", critical: true },
  { name: "test:formulas", cmd: "npm run test:formulas", critical: true },
  { name: "audit:dual-intelligence-runtime-coverage", cmd: "npm run audit:dual-intelligence-runtime-coverage", critical: true },
];

/**
 * Smoke suite (needs a running server). Environment-sensitive smokes that rely
 * on live Firestore data are warning-level locally and enforced by the
 * post-deploy production smoke.
 */
const SERVER_STEPS = [
  { name: "smoke:premium-routes", cmd: "npm run smoke:premium-routes", critical: true },
  { name: "smoke:premium-smart-forms", cmd: "npm run smoke:premium-smart-forms", critical: true },
  { name: "smoke:locale-routes", cmd: "npm run smoke:locale-routes", critical: true },
  { name: "smoke:browser-routes-probe", cmd: "npm run smoke:browser-routes -- --probe", critical: true },
  { name: "smoke:browser-routes", cmd: "npm run smoke:browser-routes", critical: true },
  { name: "smoke:all-calculation-forms", cmd: "npm run smoke:all-calculation-forms", critical: true },
  { name: "smoke:browser-calculation-forms", cmd: "npm run smoke:browser-calculation-forms", critical: false },
  { name: "smoke:feedback-ui", cmd: "npm run smoke:feedback-ui", critical: true },
  { name: "smoke:approved-reports", cmd: "npm run smoke:approved-reports", critical: false },
  { name: "smoke:verify-report", cmd: "npm run smoke:verify-report", critical: false },
  { name: "smoke:regional-units", cmd: "npm run smoke:regional-units", critical: true },
  { name: "smoke:regional-benchmarks", cmd: "npm run smoke:regional-benchmarks", critical: true },
  { name: "smoke:case-study-proof", cmd: "npm run smoke:case-study-proof", critical: true },
  { name: "smoke:pwa-field-mode", cmd: "npm run smoke:pwa-field-mode", critical: true },
  { name: "smoke:business-packaging", cmd: "npm run smoke:business-packaging", critical: true },
  { name: "smoke:premium-seo-landings", cmd: "npm run smoke:premium-seo-landings", critical: true },
  { name: "smoke:ai-assistant", cmd: "npm run smoke:ai-assistant", critical: true },
];

// --- Helpers ---------------------------------------------------------------

function git(command) {
  const res = spawnSync(command, { shell: true, encoding: "utf8" });
  return (res.stdout ?? "").trim();
}

function listNpmScripts() {
  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  return new Set(Object.keys(pkg.scripts ?? {}));
}

/** Validate that every `npm run X` referenced step maps to a real script. */
function validatePlan() {
  const scripts = listNpmScripts();
  const missing = [];
  for (const step of [...PRE_SERVER_STEPS, ...SERVER_STEPS]) {
    const match = step.cmd.match(/^npm run ([\w:-]+)/);
    if (match && !scripts.has(match[1])) {
      missing.push(match[1]);
    }
  }
  return missing;
}

/** Anti-regression: PWA manifest must not contain an /en start_url or scope. */
function checkManifestNoEn() {
  const candidates = ["public/manifest.webmanifest", "public/manifest.json"];
  for (const path of candidates) {
    if (!existsSync(path)) continue;
    const manifest = JSON.parse(readFileSync(path, "utf8"));
    const startUrl = String(manifest.start_url ?? "");
    const scope = String(manifest.scope ?? "");
    if (startUrl.includes("/en") || scope.includes("/en")) {
      return { ok: false, detail: `${path}: start_url="${startUrl}" scope="${scope}"` };
    }
  }
  return { ok: true, detail: "manifest start_url/scope clean" };
}

function runStep(step, env) {
  const started = Date.now();
  const res = spawnSync(step.cmd, { shell: true, stdio: "inherit", env });
  const durationMs = Date.now() - started;
  return { ...step, ok: res.status === 0, durationMs };
}

async function waitForServer(url, timeoutMs = 60000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url, { method: "GET" });
      if (res.status > 0) return true;
    } catch {
      // not ready yet
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return false;
}

function formatDuration(ms) {
  return `${(ms / 1000).toFixed(1)}s`;
}

function buildReport(meta, results, manifestCheck) {
  const lines = [];
  lines.push("# Release Gate Report");
  lines.push("");
  lines.push(`- Result: **${meta.result}**`);
  lines.push(`- Start: ${meta.startTime}`);
  lines.push(`- End: ${meta.endTime}`);
  lines.push(`- Duration: ${formatDuration(meta.totalMs)}`);
  lines.push(`- Commit: ${meta.commit}`);
  lines.push(`- Branch: ${meta.branch}`);
  lines.push(`- Node: ${meta.node}`);
  lines.push(`- Base URL: ${meta.baseUrl}`);
  lines.push("");
  lines.push("## Steps");
  lines.push("");
  lines.push("| Step | Critical | Status | Duration |");
  lines.push("| --- | --- | --- | --- |");
  for (const r of results) {
    const status = r.skipped ? "SKIP" : r.ok ? "PASS" : "FAIL";
    lines.push(`| ${r.name} | ${r.critical ? "yes" : "no"} | ${status} | ${r.skipped ? "-" : formatDuration(r.durationMs)} |`);
  }
  lines.push(`| anti-regression: manifest /en | yes | ${manifestCheck.ok ? "PASS" : "FAIL"} | - |`);
  lines.push("");
  if (meta.criticalFailures.length > 0) {
    lines.push("## Critical failures");
    lines.push("");
    for (const f of meta.criticalFailures) lines.push(`- ${f}`);
    lines.push("");
  }
  if (meta.warnings.length > 0) {
    lines.push("## Warnings (non-critical)");
    lines.push("");
    for (const w of meta.warnings) lines.push(`- ${w}`);
    lines.push("");
  }
  lines.push("## Next action");
  lines.push("");
  lines.push(meta.result === "PASS"
    ? "- Gate PASS. Deploy is permitted. After hosting deploy, apply Cloud Run minInstances and run production smoke."
    : "- Gate FAIL. Do not deploy. Fix critical failures and re-run `npm run release:gate`.");
  lines.push("");
  return lines.join("\n");
}

// --- Main ------------------------------------------------------------------

async function main() {
  const startTime = new Date().toISOString();
  const startMs = Date.now();
  const commit = git("git rev-parse --short HEAD") || "unknown";
  const branch = git("git rev-parse --abbrev-ref HEAD") || "unknown";
  const node = process.version;

  console.log("=== SectorCalc Release Gate ===");
  console.log(`commit=${commit} branch=${branch} node=${node} baseUrl=${BASE_URL}`);
  console.log(DRY_RUN ? "mode=dry-run\n" : "mode=full\n");

  const missing = validatePlan();
  if (missing.length > 0) {
    console.error(`Plan invalid — missing npm scripts: ${missing.join(", ")}`);
    process.exit(1);
  }
  console.log(`Plan valid: ${PRE_SERVER_STEPS.length + SERVER_STEPS.length} steps + manifest anti-regression check.`);

  const manifestCheck = checkManifestNoEn();

  if (DRY_RUN) {
    console.log("\nDry-run plan:");
    for (const step of [...PRE_SERVER_STEPS, ...SERVER_STEPS]) {
      console.log(`  - ${step.name}${step.critical ? "" : " (warning)"}: ${step.cmd}`);
    }
    console.log(`  - anti-regression: manifest /en → ${manifestCheck.ok ? "PASS" : "FAIL"}`);
    const meta = {
      result: manifestCheck.ok ? "PASS" : "FAIL",
      startTime,
      endTime: new Date().toISOString(),
      totalMs: Date.now() - startMs,
      commit,
      branch,
      node,
      baseUrl: BASE_URL,
      criticalFailures: manifestCheck.ok ? [] : [`manifest /en: ${manifestCheck.detail}`],
      warnings: [],
    };
    if (WRITE_REPORT) {
      writeFileSync(REPORT_PATH, buildReport(meta, [], manifestCheck), "utf8");
      console.log(`\nReport written to ${REPORT_PATH}`);
    }
    console.log(`\nRelease gate (dry-run) ${meta.result}`);
    process.exit(meta.result === "PASS" ? 0 : 1);
  }

  const env = { ...process.env };
  const results = [];

  // Pre-server steps
  let buildOk = true;
  for (const step of PRE_SERVER_STEPS) {
    console.log(`\n--- ${step.name} ---`);
    const r = runStep(step, env);
    results.push(r);
    console.log(`${r.ok ? "PASS" : "FAIL"} ${step.name} (${formatDuration(r.durationMs)})`);
    if (step.name === "build" && !r.ok) buildOk = false;
  }

  // Server lifecycle (only for local base URL)
  let server = null;
  const needServer = SERVER_STEPS.length > 0;
  if (needServer && buildOk) {
    if (EXTERNAL_BASE) {
      console.log(`\nUsing external base URL: ${EXTERNAL_BASE}`);
    } else {
      console.log(`\nStarting local server on port ${PORT}...`);
      server = spawn("npm", ["run", "start"], {
        env: { ...env, PORT },
        stdio: "ignore",
      });
    }
    const ready = await waitForServer(BASE_URL, 90000);
    if (!ready) {
      console.error("Server did not become ready in time.");
      if (server) server.kill();
      buildOk = false;
    }
  }

  if (buildOk) {
    for (const step of SERVER_STEPS) {
      console.log(`\n--- ${step.name} ---`);
      const r = runStep(step, { ...env, SMOKE_BASE_URL: BASE_URL });
      results.push(r);
      console.log(`${r.ok ? "PASS" : r.critical ? "FAIL" : "WARN"} ${step.name} (${formatDuration(r.durationMs)})`);
    }
  } else {
    for (const step of SERVER_STEPS) {
      results.push({ ...step, ok: false, skipped: true, durationMs: 0 });
    }
  }

  if (server) {
    server.kill();
  }

  const criticalFailures = results
    .filter((r) => r.critical && !r.ok)
    .map((r) => (r.skipped ? `${r.name} (skipped — build failed)` : r.name));
  if (!manifestCheck.ok) {
    criticalFailures.push(`manifest /en: ${manifestCheck.detail}`);
  }
  const warnings = results.filter((r) => !r.critical && !r.ok).map((r) => r.name);

  const result = criticalFailures.length === 0 ? "PASS" : "FAIL";
  const meta = {
    result,
    startTime,
    endTime: new Date().toISOString(),
    totalMs: Date.now() - startMs,
    commit,
    branch,
    node,
    baseUrl: BASE_URL,
    criticalFailures,
    warnings,
  };

  if (WRITE_REPORT) {
    writeFileSync(REPORT_PATH, buildReport(meta, results, manifestCheck), "utf8");
  }

  console.log("\n=== Release Gate Summary ===");
  console.log(`Result: ${result}`);
  console.log(`Duration: ${formatDuration(meta.totalMs)}`);
  if (criticalFailures.length > 0) console.log(`Critical failures: ${criticalFailures.join(", ")}`);
  if (warnings.length > 0) console.log(`Warnings: ${warnings.join(", ")}`);
  if (WRITE_REPORT) console.log(`Report: ${REPORT_PATH}`);
  console.log(result === "PASS" ? "Next: deploy permitted." : "Next: fix critical failures, do not deploy.");

  process.exit(result === "PASS" ? 0 : 1);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
