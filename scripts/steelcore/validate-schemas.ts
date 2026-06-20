#!/usr/bin/env npx tsx
import path from "node:path";
import { validateAllSchemas, writeValidationReport, STEELCORE_VALIDATION_REPORT } from "@/lib/steelcore";

function parseLevel(): "strict" | "industrial" | null {
  const levelArg = process.argv.find((a) => a.startsWith("--level="));
  if (levelArg) {
    const level = levelArg.split("=")[1];
    if (level === "industrial" || level === "strict") return level;
  }
  if (process.argv.includes("--strict")) return "strict";
  if (process.argv.includes("--industrial")) return "industrial";
  return null;
}

function main(): void {
  const level = parseLevel();
  const report = validateAllSchemas();
  writeValidationReport(report);
  console.log(`SteelCore validation: ${report.valid}/${report.total} valid`);
  console.log(`  PASS=${report.byStatus.PASS} WARN=${report.byStatus.WARN} FAIL=${report.byStatus.FAIL} RUNTIME_FAIL=${report.byStatus.RUNTIME_FAIL} QUARANTINE=${report.byStatus.QUARANTINE}`);

  const failCount = report.byStatus.FAIL ?? 0;
  const runtimeFailCount = report.byStatus.RUNTIME_FAIL ?? 0;
  const quarantineCount = report.byStatus.QUARANTINE ?? 0;
  const warnCount = report.byStatus.WARN ?? 0;

  if (level === "industrial") {
    // Industrial mode: ZERO tolerance — ANY non-PASS status blocks the pipeline
    const blockers = failCount + runtimeFailCount + quarantineCount + warnCount;
    if (blockers > 0) {
      console.error(
        `BLOCKER: ${blockers} schema(s) with non-PASS status ` +
        `(FAIL=${failCount}, RUNTIME_FAIL=${runtimeFailCount}, ` +
        `QUARANTINE=${quarantineCount}, WARN=${warnCount}). ` +
        `Industrial mode requires 0 ERRORS. Pipeline HALTED.`,
      );
      process.exit(1);
    }
  } else if (level === "strict") {
    // Strict mode: block only FAIL/RUNTIME_FAIL (hard blockers)
    const hardBlockers = failCount + runtimeFailCount;
    if (hardBlockers > 0) {
      console.error(`BLOCKER: ${hardBlockers} schema(s) with FAIL/RUNTIME_FAIL status.`);
      process.exit(1);
    }
  }

  if (report.invalid > 0) {
    console.error(`Invalid schemas (${report.invalid}). Report: ${path.relative(process.cwd(), STEELCORE_VALIDATION_REPORT)}`);
    if (level) process.exit(1);
    return;
  }
  console.log("All schemas passed SteelCore validation.");
}

main();
