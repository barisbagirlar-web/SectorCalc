#!/usr/bin/env npx tsx
import path from "node:path";
import { validateAllSchemas, writeValidationReport, STEELCORE_VALIDATION_REPORT } from "@/lib/steelcore";

function main(): void {
  const strict = process.argv.includes("--strict");
  const report = validateAllSchemas();
  writeValidationReport(report);
  console.log(`SteelCore validation: ${report.valid}/${report.total} valid`);
  console.log(`  PASS=${report.byStatus.PASS} WARN=${report.byStatus.WARN} FAIL=${report.byStatus.FAIL} RUNTIME_FAIL=${report.byStatus.RUNTIME_FAIL} QUARANTINE=${report.byStatus.QUARANTINE}`);

  // Strict mode: block only FAIL/RUNTIME_FAIL (hard blockers)
  // QUARANTINE is a known debt requiring human authoring — does not block build
  const hardBlockers = (report.byStatus.FAIL ?? 0) + (report.byStatus.RUNTIME_FAIL ?? 0);
  if (hardBlockers > 0 && strict) {
    console.error(`BLOCKER: ${hardBlockers} schema(s) with FAIL/RUNTIME_FAIL status.`);
    process.exit(1);
  }

  if (report.invalid > 0) {
    console.error(`Invalid schemas (${report.invalid}). Report: ${path.relative(process.cwd(), STEELCORE_VALIDATION_REPORT)}`);
    if (strict) return; // Allow QUARANTINE through
    return;
  }
  console.log("All schemas passed SteelCore validation.");
}

main();
