#!/usr/bin/env npx tsx
/**
 * CI Gate — Pre-deployment quality check
 *
 * Runs:
 *   1. SteelCore schema validation (strict mode)
 *   2. Golden test suite (all schemas)
 *   3. Enforces thresholds:
 *      - SteelCore PASS rate >= 90%
 *      - Golden test error count == 0
 *
 * Exit code 0 = pass, 1 = fail
 */

import path from "node:path";
import fs from "node:fs";
import {
  validateAllSchemas,
  writeValidationReport,
} from "@/lib/steelcore";
import { runGoldenTestSuite } from "../deepseek/lib/golden-test-runner";

const STEELCORE_PASS_THRESHOLD = 0.9; // >= 90%
const SCHEMAS_DIR = path.join(process.cwd(), "generated/schemas");
const GENERATED_DIR = path.join(process.cwd(), "generated");

interface CiGateResult {
  readonly passed: boolean;
  readonly steelcore: {
    readonly valid: number;
    readonly total: number;
    readonly passRate: number;
    readonly threshold: number;
    readonly ok: boolean;
  } | null;
  readonly golden: {
    readonly passed: number;
    readonly total: number;
    readonly failed: number;
    readonly totalIssues: number;
    readonly errorSlugs: readonly string[];
    readonly ok: boolean;
  } | null;
  readonly message: string;
}

async function main(): Promise<CiGateResult> {
  // 1. SteelCore validation
  console.log("=".repeat(50));
  console.log("CI GATE — SteelCore schema validation");
  console.log("=".repeat(50));
  const steelcoreReport = validateAllSchemas();
  writeValidationReport(steelcoreReport);

  const passRate =
    steelcoreReport.total > 0
      ? steelcoreReport.valid / steelcoreReport.total
      : 0;
  const steelcoreOk = passRate >= STEELCORE_PASS_THRESHOLD;

  console.log(
    `SteelCore: ${steelcoreReport.valid}/${steelcoreReport.total} PASS (${(passRate * 100).toFixed(1)}%) — threshold ${(STEELCORE_PASS_THRESHOLD * 100).toFixed(0)}% — ${steelcoreOk ? "OK" : "FAIL"}`,
  );
  console.log(
    `  By status: PASS=${steelcoreReport.byStatus.PASS} WARN=${steelcoreReport.byStatus.WARN} FAIL=${steelcoreReport.byStatus.FAIL} RUNTIME_FAIL=${steelcoreReport.byStatus.RUNTIME_FAIL} QUARANTINE=${steelcoreReport.byStatus.QUARANTINE}`,
  );

  if (!steelcoreOk) {
    return {
      passed: false,
      steelcore: {
        valid: steelcoreReport.valid,
        total: steelcoreReport.total,
        passRate,
        threshold: STEELCORE_PASS_THRESHOLD,
        ok: false,
      },
      golden: null,
      message: `CI GATE FAILED: SteelCore pass rate ${(passRate * 100).toFixed(1)}% < ${(STEELCORE_PASS_THRESHOLD * 100).toFixed(0)}%`,
    };
  }

  // 2. Golden test suite
  console.log("\n" + "=".repeat(50));
  console.log("CI GATE — Golden Test Suite");
  console.log("=".repeat(50));

  if (!fs.existsSync(SCHEMAS_DIR)) {
    return {
      passed: false,
      steelcore: null,
      golden: null,
      message: `CI GATE FAILED: schemas dir not found: ${SCHEMAS_DIR}`,
    };
  }

  const goldenResult = await runGoldenTestSuite(SCHEMAS_DIR, GENERATED_DIR);
  const goldenOk = goldenResult.failed === 0;

  console.log(
    `Golden: ${goldenResult.passed}/${goldenResult.total} PASS, ${goldenResult.failed} FAIL, ${goldenResult.totalIssues} total issues — ${goldenOk ? "OK" : "FAIL"}`,
  );

  if (!goldenOk) {
    const topErrors = goldenResult.errorSlugs.slice(0, 20).join(", ");
    console.log(`  Error slugs (first 20): ${topErrors}`);
  }

  if (!goldenOk) {
    return {
      passed: false,
      steelcore: {
        valid: steelcoreReport.valid,
        total: steelcoreReport.total,
        passRate,
        threshold: STEELCORE_PASS_THRESHOLD,
        ok: true,
      },
      golden: {
        passed: goldenResult.passed,
        total: goldenResult.total,
        failed: goldenResult.failed,
        totalIssues: goldenResult.totalIssues,
        errorSlugs: goldenResult.errorSlugs,
        ok: false,
      },
      message: `CI GATE FAILED: Golden test has ${goldenResult.failed} failures`,
    };
  }

  return {
    passed: true,
    steelcore: {
      valid: steelcoreReport.valid,
      total: steelcoreReport.total,
      passRate,
      threshold: STEELCORE_PASS_THRESHOLD,
      ok: true,
    },
    golden: {
      passed: goldenResult.passed,
      total: goldenResult.total,
      failed: goldenResult.failed,
      totalIssues: goldenResult.totalIssues,
      errorSlugs: goldenResult.errorSlugs,
      ok: true,
    },
    message: "CI GATE PASSED — All quality checks passed",
  };
}

main()
  .then((result) => {
    const reportPath = path.join(process.cwd(), "generated", "ci-gate-report.json");
    fs.writeFileSync(reportPath, JSON.stringify(result, null, 2), "utf-8");
    console.log(`\nCI Gate report: ${reportPath}`);
    console.log(`\n${result.message}`);
    process.exit(result.passed ? 0 : 1);
  })
  .catch((err: unknown) => {
    console.error("CI GATE FATAL:", err instanceof Error ? err.message : String(err));
    process.exit(1);
  });
