#!/usr/bin/env node
/**
 * P7 — Apply all DeepSeek gate-verified tools with schema-backed factory generation.
 */
import { loadEnvLocal } from "../ai/load-env-local.mjs";
import {
  applyP7VerifiedBatch,
  loadP7AuditOrThrow,
  selectP7ApplyBatch,
  writeP7Outputs,
  P7_APPLY_REPORT_PATH,
} from "./lib/p7-night-factory-lib.mjs";

function main() {
  loadEnvLocal();
  console.log("=== apply:p7-night ===\n");

  const audit = loadP7AuditOrThrow();
  const { eligible, skipped } = selectP7ApplyBatch(audit);

  if (skipped.length > 0) {
    console.log(`Skipped ${skipped.length} patch-eligible tool(s) without schema pipeline:`);
    for (const row of skipped.slice(0, 20)) {
      console.log(`  - ${row.slug}: ${row.reason}`);
    }
    if (skipped.length > 20) {
      console.log(`  ... and ${skipped.length - 20} more`);
    }
  }

  if (eligible.length === 0) {
    const applyReport = {
      generatedAt: new Date().toISOString(),
      requested: [],
      generated: [],
      passed: [],
      failed: [],
      skipped,
      testFiles: [],
      guideSpecsCount: 0,
      filesTouched: [],
      note: "No schema-backed patch-eligible tools to apply",
    };
    writeP7Outputs(audit, applyReport, null);
    console.log("\napply:p7-night PASS (nothing to apply)");
    return;
  }

  console.log(`Applying ${eligible.length} verified tool(s):`);
  for (const slug of eligible) {
    console.log(`  - ${slug}`);
  }

  const applyReport = applyP7VerifiedBatch(eligible);
  applyReport.skipped = [...(applyReport.skipped ?? []), ...skipped];
  writeP7Outputs(audit, applyReport, null);

  console.log(`\ngenerated: ${applyReport.generated.length}`);
  console.log(`passed vitest: ${applyReport.passed.length}`);
  console.log(`failed: ${applyReport.failed.length}`);
  console.log(`skipped: ${applyReport.skipped.length}`);
  console.log(`output: ${P7_APPLY_REPORT_PATH}`);

  if (applyReport.failed.length > 0) {
    console.error("\napply:p7-night FAIL");
    for (const row of applyReport.failed) {
      console.error(`  - ${row.slug}: ${row.reason}`);
    }
    process.exit(1);
  }

  console.log("\napply:p7-night PASS");
}

try {
  main();
} catch (error) {
  console.error("apply:p7-night FAIL");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
