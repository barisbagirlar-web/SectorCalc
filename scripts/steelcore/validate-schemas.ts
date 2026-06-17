#!/usr/bin/env npx tsx
import path from "node:path";
import { validateAllSchemas, writeValidationReport, STEELCORE_VALIDATION_REPORT } from "@/lib/steelcore";

function main(): void {
  const strict = process.argv.includes("--strict");
  const report = validateAllSchemas();
  writeValidationReport(report);
  console.log(`SteelCore validation: ${report.valid}/${report.total} valid`);
  if (report.invalid > 0) {
    console.error(`Invalid schemas (${report.invalid}). Report: ${path.relative(process.cwd(), STEELCORE_VALIDATION_REPORT)}`);
    if (strict) process.exit(1);
    return;
  }
  console.log("All schemas passed SteelCore validation.");
}

main();
