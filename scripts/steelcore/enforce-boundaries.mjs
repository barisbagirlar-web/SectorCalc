#!/usr/bin/env node
/**
 * SteelCore Boundary Enforcement — known-answer vector validation.
 *
 * Verifies mathematical correctness of core financial/engineering functions
 * against pre-computed reference values. Every violation is FAIL.
 *
 * Current boundary tests (from src/utils/math/__tests__/irr.test.ts):
 *   1. IRR: [-1000, 300, 400, 500, 500, 400] → 0.29 ± 0.001
 *   2. IRR: [-100, 120] → 0.20 ± 0.001
 *   3. NPV at IRR ≈ 0 (self-consistency)
 *   4. NPV: [-1000, 300, 400, 500, 500, 400] @ 10% → 568.84 ± 0.5
 *   5. Edge cases: null/NaN/Infinity/no-sign-change → null
 *
 * Exit: 0 = ALL PASS, 1 = any failure
 */

import { execSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const REPORT_PATH = join(ROOT, "generated", "boundary-enforcement-report.json");

function main() {
  console.log("=".repeat(60));
  console.log("BOUNDARY ENFORCEMENT — known-answer vector validation");
  console.log("=".repeat(60));

  let passed = 0;
  let failed = 0;
  const results = [];

  function check(name, condition, expected, actual) {
    if (condition) {
      passed++;
      console.log(`  \u2713 ${name}: PASS (expect=${expected}, actual=${actual})`);
    } else {
      failed++;
      console.log(`  \u2717 ${name}: FAIL (expect=${expected}, actual=${actual})`);
    }
    results.push({ name, pass: condition, expected: String(expected), actual: String(actual) });
  }

  // ── Run vitest for IRR test suite ──
  console.log("\n  Running vitest IRR test suite...");
  try {
    const output = execSync(
      `npx vitest run src/utils/math/__tests__/irr.test.ts --reporter=verbose 2>&1`,
      { cwd: ROOT, encoding: "utf-8", timeout: 30_000, stdio: "pipe" },
    );
    const passMatch = output.match(/Tests\s+(\d+)\s+passed/);
    const failMatch = output.match(/Tests\s+(\d+)\s+failed/);
    const totalPass = passMatch ? parseInt(passMatch[1], 10) : 0;
    const totalFail = failMatch ? parseInt(failMatch[1], 10) : 0;

    console.log(`  vitest: ${totalPass} passed, ${totalFail} failed`);

    check("IRR test suite (13 known-answer tests)",
      totalFail === 0 && totalPass > 0,
      "0 failed",
      `${totalFail} failed`,
    );
  } catch (err) {
    const stderr = err.stderr || err.message || "";
    check("IRR test suite (13 known-answer tests)",
      false,
      "0 failed",
      `error: ${stderr.slice(0, 200)}`,
    );
  }

  // ── Summary ──
  console.log("-".repeat(60));
  const allPass = failed === 0;
  console.log(
    `BOUNDARY ENFORCEMENT: ${passed}/${passed + failed} PASS — ${allPass ? "ALL BOUNDARIES HOLD" : "FAILURES DETECTED"}`,
  );

  const report = {
    version: "1.0",
    timestamp: new Date().toISOString(),
    passed: allPass,
    totalTests: passed + failed,
    passedTests: passed,
    failedTests: failed,
    results,
  };

  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2), "utf-8");
  console.log(`Report: ${REPORT_PATH}`);

  if (!allPass) process.exit(1);
}

main();
