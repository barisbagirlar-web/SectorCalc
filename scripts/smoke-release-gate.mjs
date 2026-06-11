#!/usr/bin/env node
/**
 * Smoke: P11 autonomous release gate.
 * Verifies the release gate script exists, runs in dry mode, and emits a report.
 * Usage: node scripts/smoke-release-gate.mjs
 */

import { spawnSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";

const REPORT_PATH = "docs/release-gate-report.md";

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

function main() {
  console.log("=== Release Gate Smoke ===\n");
  const failures = [];

  const pkg = JSON.parse(readFileSync("package.json", "utf8"));
  const scripts = pkg.scripts ?? {};

  const hasGate = typeof scripts["release:gate"] === "string";
  console.log(`${hasGate ? "✓" : "✗"} release:gate script exists`);
  if (!hasGate) failures.push("release:gate script missing");

  const hasSmoke = typeof scripts["smoke:release-gate"] === "string";
  console.log(`${hasSmoke ? "✓" : "✗"} smoke:release-gate script exists`);
  if (!hasSmoke) failures.push("smoke:release-gate script missing");

  if (!existsSync("scripts/release-gate.mjs")) {
    fail("scripts/release-gate.mjs is missing");
  }

  console.log("\nRunning dry-run...");
  const dry = spawnSync("node", ["scripts/release-gate.mjs", "--dry-run"], {
    encoding: "utf8",
  });
  const out = `${dry.stdout ?? ""}${dry.stderr ?? ""}`;

  const dryExitOk = dry.status === 0;
  console.log(`${dryExitOk ? "✓" : "✗"} dry-run exit code 0 (got ${dry.status})`);
  if (!dryExitOk) failures.push("dry-run non-zero exit");

  const planOk = out.includes("Plan valid");
  console.log(`${planOk ? "✓" : "✗"} dry-run validates plan (npm scripts resolve)`);
  if (!planOk) failures.push("plan not validated");

  const summaryOk = out.includes("Release gate (dry-run) PASS");
  console.log(`${summaryOk ? "✓" : "✗"} dry-run reports PASS summary`);
  if (!summaryOk) failures.push("no PASS summary");

  const reportOk = existsSync(REPORT_PATH) && readFileSync(REPORT_PATH, "utf8").includes("Release Gate Report");
  console.log(`${reportOk ? "✓" : "✗"} report generated at ${REPORT_PATH}`);
  if (!reportOk) failures.push("report not generated");

  if (failures.length > 0) {
    console.error(`\nRelease gate smoke FAILED (${failures.length} checks): ${failures.join(", ")}`);
    process.exit(1);
  }
  console.log("\nRelease gate smoke PASSED");
}

main();
