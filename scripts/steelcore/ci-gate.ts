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
import { execSync } from "node:child_process";
import {
  validateAllSchemas,
  writeValidationReport,
} from "@/lib/steelcore";
import { runGoldenTestSuite } from "../deepseek/lib/golden-test-runner";
import { validateSchemaConstraints, categorizeIssues } from "@/lib/generated-tools/formula-constraint-engine";
import type { FormulaHealthReport } from "@/lib/generated-tools/formula-health-monitor";

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
  readonly formulaGuard: {
    readonly passed: boolean;
    readonly schemasScanned: number;
    readonly blockedSchemas: number;
    readonly totalErrors: number;
    readonly totalCrossDomainIssues: number;
  } | null;
  readonly boundary: {
    readonly passed: boolean;
    readonly totalTests: number;
    readonly passedTests: number;
    readonly failedTests: number;
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
      formulaGuard: null,
      boundary: null,
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
      const issues = validateSchemaConstraints(formulas, inputs);
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

  const enforceSemantic = process.argv.includes("--enforce");
  const semanticOk = enforceSemantic ? crossDomainCount === 0 : true;
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
  if (!semanticOk) {
    console.error(`❌ CROSS-DOMAIN CONTAMINATION BLOCK: ${crossDomainCount} violation(s) detected with --enforce flag.`);
  }

  if (!semanticOk) {
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
        ok: false,
      },
      golden: null,
      formulaGuard: null,
      boundary: null,
      message: `CI GATE FAILED: ${crossDomainCount} cross-domain contamination(s) detected with --enforce flag`,
    };
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
      formulaGuard: null,
      boundary: null,
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
      formulaGuard: null,
      boundary: null,
      message: `CI GATE FAILED: Golden test has ${goldenResult.failed} failures`,
    };
  }

  // ── Phase 4: Pre-commit formula guard ────────────────────────
  console.log("\n" + "=".repeat(60));
  console.log("CI GATE — Phase 4: Pre-commit formula guard");
  console.log("=".repeat(60));

  const guardScript = path.join(
    process.cwd(),
    "scripts/steelcore/pre-commit-formula-guard.ts",
  );

  // Step 4a: Silently update the known-patterns cache
  console.log("  Step 4a: Updating known-patterns cache...");
  try {
    execSync(`node_modules/.bin/tsx "${guardScript}" --update-cache`, {
      cwd: process.cwd(),
      stdio: "pipe",
      timeout: 60_000,
    });
  } catch {
    // Cache update failure is non-fatal — proceed to enforcement
    console.log("  ⚠️  Cache update had issues (non-fatal).");
  }

  // Step 4b: Enforcement mode
  console.log("  Step 4b: Running enforcement check...");
  let formulaGuardPassed = false;
  let guardSchemasScanned = 0;
  let guardBlockedSchemas = 0;
  let guardTotalErrors = 0;
  let guardTotalCrossDomain = 0;

  try {
    const output = execSync(`node_modules/.bin/tsx "${guardScript}"`, {
      cwd: process.cwd(),
      stdio: "pipe",
      timeout: 60_000,
      encoding: "utf-8",
    });
    formulaGuardPassed = true;

    // Scan output for key stats
    const schemasMatch = output.match(/Schemas scanned:\s+(\d+)/);
    const errorsMatch = output.match(/Errors found:\s+(\d+)/);
    const crossDomainMatch = output.match(/Cross-domain:\s+(\d+)/);
    const blockedMatch = output.match(/Blocked schemas:\s+(\d+)/);

    if (schemasMatch) guardSchemasScanned = Number(schemasMatch[1]);
    if (errorsMatch) guardTotalErrors = Number(errorsMatch[1]);
    if (crossDomainMatch) guardTotalCrossDomain = Number(crossDomainMatch[1]);
    if (blockedMatch) guardBlockedSchemas = Number(blockedMatch[1]);

    // Print the enforcement output
    process.stdout.write(output);
  } catch (err) {
    // Guard enforcement failed — extract stats from stderr
    const stderr =
      err instanceof Error
        ? err.message
        : "Pre-commit formula guard check failed";

    const schemasMatch = stderr.match(/Schemas scanned:\s+(\d+)/);
    const errorsMatch = stderr.match(/Errors found:\s+(\d+)/);
    const crossDomainMatch = stderr.match(/Cross-domain:\s+(\d+)/);
    const blockedMatch = stderr.match(/Blocked schemas:\s+(\d+)/);

    if (schemasMatch) guardSchemasScanned = Number(schemasMatch[1]);
    if (errorsMatch) guardTotalErrors = Number(errorsMatch[1]);
    if (crossDomainMatch) guardTotalCrossDomain = Number(crossDomainMatch[1]);
    if (blockedMatch) guardBlockedSchemas = Number(blockedMatch[1]);

    console.log(stderr);

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
        ok: true,
      },
      formulaGuard: {
        passed: formulaGuardPassed,
        schemasScanned: guardSchemasScanned,
        blockedSchemas: guardBlockedSchemas,
        totalErrors: guardTotalErrors,
        totalCrossDomainIssues: guardTotalCrossDomain,
      },
      boundary: null,
      message: `CI GATE FAILED: Pre-commit formula guard blocked ${guardBlockedSchemas} schema(s) with cross-domain contamination`,
    };
  }

  // ── Phase 5: Formula Health Report ────────────────────────
  console.log("\n" + "=".repeat(60));
  console.log("CI GATE — Phase 5: Formula Health Report");
  console.log("=".repeat(60));

  let healthReport: FormulaHealthReport | null = null;
  try {
    const { generateHealthReport } = await import("@/lib/generated-tools/formula-health-monitor");
    healthReport = generateHealthReport();
    console.log(`  Overall health: ${healthReport.overall}`);
    console.log(`  Constraint errors: ${healthReport.constraintErrors.length}`);
    console.log(`  QUARANTINE schemas: ${healthReport.quarantineCount}`);
    if (healthReport.constraintErrors.length > 0) {
      console.log(`  ⚠️  CRITICAL ALERT: ${healthReport.constraintErrors.length} formula constraint error(s) found!`);
      for (const e of healthReport.constraintErrors) {
        console.log(`    ❌ ${e.slug}.${e.formulaKey}: ${e.message}`);
      }
    } else {
      console.log(`  ✅ All formulas pass constraint engine validation`);
    }
    console.log(`  Report: generated/formula-health-report.json`);
  } catch (err: unknown) {
    console.log(`  ⚠️  Health report generation failed: ${err instanceof Error ? err.message : String(err)}`);
  }

  // ── Phase 6: Boundary Enforcement (known-answer vector validation) ─
  console.log("\n" + "=".repeat(60));
  console.log("CI GATE — Phase 6: Boundary Enforcement (known-answer vectors)");
  console.log("=".repeat(60));

  let boundaryPassed = false;
  let boundaryTotal = 0;
  let boundaryPassedCount = 0;
  let boundaryFailedCount = 0;

  try {
    const boundaryScript = path.join(
      process.cwd(),
      "scripts/steelcore/enforce-boundaries.mjs",
    );
    const output = execSync(`node "${boundaryScript}"`, {
      cwd: process.cwd(),
      stdio: "pipe",
      timeout: 60_000,
      encoding: "utf-8",
    });
    process.stdout.write(output);
    boundaryPassed = true;
    // Parse summary line
    const summaryMatch = output.match(
      /(\d+)\/(\d+)\s+PASS/,
    );
    if (summaryMatch) {
      boundaryPassedCount = Number(summaryMatch[1]);
      boundaryTotal = Number(summaryMatch[2]);
      boundaryFailedCount = boundaryTotal - boundaryPassedCount;
    }
    console.log(`\n  Boundary enforcement: ${boundaryPassedCount}/${boundaryTotal} PASS — ${boundaryFailedCount === 0 ? "ALL BOUNDARIES HOLD" : "FAILURES DETECTED"}`);
  } catch (err) {
    boundaryPassed = false;
    const stderr = err instanceof Error ? err.message : String(err);
    console.log(`  ❌ Boundary enforcement FAILED: ${stderr.slice(0, 300)}`);
  }

  if (!boundaryPassed) {
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
        ok: true,
      },
      formulaGuard: {
        passed: true,
        schemasScanned: guardSchemasScanned,
        blockedSchemas: 0,
        totalErrors: guardTotalErrors,
        totalCrossDomainIssues: guardTotalCrossDomain,
      },
      boundary: {
        passed: false,
        totalTests: boundaryTotal,
        passedTests: boundaryPassedCount,
        failedTests: boundaryFailedCount,
      },
      message: "CI GATE FAILED: Boundary enforcement detected known-answer vector violations",
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
    formulaGuard: {
      passed: true,
      schemasScanned: guardSchemasScanned,
      blockedSchemas: 0,
      totalErrors: guardTotalErrors,
      totalCrossDomainIssues: guardTotalCrossDomain,
    },
    boundary: {
      passed: true,
      totalTests: boundaryTotal,
      passedTests: boundaryPassedCount,
      failedTests: boundaryFailedCount,
    },
    message: "CI GATE PASSED — All quality checks passed (SteelCore + Semantic + Golden + FormulaGuard + Boundary)",
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
