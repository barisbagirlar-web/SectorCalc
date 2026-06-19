#!/usr/bin/env npx tsx
/**
 * CI Gate — Pre-deployment quality check (industrial-grade)
 *
 * Runs:
 *   1. SteelCore schema validation (strict mode)
 *   2. Semantic formula verification (industrial-grade: detects cross-domain contamination)
 *   3. Golden test suite (all schemas)
 *   4. Enforces thresholds:
 *      - SteelCore PASS rate >= 90%
 *      - Golden test error count == 0
 *      - Semantic warning count tracked (non-blocking, for trend)
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
import { verifySchemaSemantics } from "@/lib/generated-tools/semantic-formula-verifier";

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
  readonly semantic: {
    readonly schemasScanned: number;
    readonly schemasWithIssues: number;
    readonly totalIssues: number;
    readonly crossDomainContaminations: number;
    readonly starOneIssues: number;
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
  console.log("=".repeat(60));
  console.log("CI GATE — Phase 1: SteelCore schema validation");
  console.log("=".repeat(60));
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
      semantic: null,
      golden: null,
      message: `CI GATE FAILED: SteelCore pass rate ${(passRate * 100).toFixed(1)}% < ${(STEELCORE_PASS_THRESHOLD * 100).toFixed(0)}%`,
    };
  }

  // 2. Semantic formula verification
  console.log("\n" + "=".repeat(60));
  console.log("CI GATE — Phase 2: Semantic formula verification");
  console.log("=".repeat(60));

  const schemaFiles = fs
    .readdirSync(SCHEMAS_DIR)
    .filter((f) => f.endsWith("-schema.json"))
    .sort();

  let schemasWithIssues = 0;
  let totalSemanticIssues = 0;
  let crossDomainCount = 0;
  let starOneCount = 0;

  for (const file of schemaFiles) {
    try {
      const raw = JSON.parse(
        fs.readFileSync(path.join(SCHEMAS_DIR, file), "utf-8"),
      ) as Record<string, unknown>;
      const formulas = (raw.formulas ?? {}) as Record<string, string>;
      const inputs = ((raw.inputs ?? []) as Array<Record<string, unknown>>).map((i) => String(i.id));
      const issues = verifySchemaSemantics(formulas, inputs);
      if (issues.length > 0) {
        schemasWithIssues++;
        totalSemanticIssues += issues.length;
        for (const iss of issues) {
          if (iss.message.includes("Cross-domain")) crossDomainCount++;
          if (iss.message.includes("* 1")) starOneCount++;
        }
      }
    } catch {
      // Skip unparseable schemas
    }
  }

  const semanticOk = true; // Non-blocking for now — tracks trend
  console.log(
    `Semantic: ${schemasWithIssues}/${schemaFiles.length} schemas with issues, ${totalSemanticIssues} total issues`,
  );
  console.log(
    `  Cross-domain contaminations: ${crossDomainCount}, * 1 issues: ${starOneCount}`,
  );
  if (crossDomainCount > 0) {
    console.log(
      `  ⚠️  ${crossDomainCount} formulas have cross-domain contamination — these produce numerically valid but semantically WRONG results.`,
    );
  }

  // 3. Golden test suite
  console.log("\n" + "=".repeat(60));
  console.log("CI GATE — Phase 3: Golden Test Suite");
  console.log("=".repeat(60));

  if (!fs.existsSync(SCHEMAS_DIR)) {
    return {
      passed: false,
      steelcore: null,
      semantic: null,
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
      semantic: {
        schemasScanned: schemaFiles.length,
        schemasWithIssues,
        totalIssues: totalSemanticIssues,
        crossDomainContaminations: crossDomainCount,
        starOneIssues: starOneCount,
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
    semantic: {
      schemasScanned: schemaFiles.length,
      schemasWithIssues,
      totalIssues: totalSemanticIssues,
      crossDomainContaminations: crossDomainCount,
      starOneIssues: starOneCount,
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
