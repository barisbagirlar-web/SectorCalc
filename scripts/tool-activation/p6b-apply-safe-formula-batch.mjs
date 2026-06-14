#!/usr/bin/env node
/**
 * P6B — Apply safe formula batch (first 25 AUTO_PATCH_READY tools).
 * Adds calculator backing, validation, oracle tests, guide specs.
 * No payment / formula gate unlock.
 */
import fs from "node:fs";
import {
  buildP6bAuditReport,
  selectAutoPatchBatch,
  applyFormulaBatch,
  writeP6bOutputs,
  P6B_AUDIT_PATH,
} from "./lib/p6b-formula-factory-lib.mjs";

const BATCH_LIMIT = 25;

function main() {
  console.log("=== apply:p6b-safe-formula-batch ===\n");

  let audit;
  if (fs.existsSync(P6B_AUDIT_PATH)) {
    audit = JSON.parse(fs.readFileSync(P6B_AUDIT_PATH, "utf8"));
  } else {
    audit = buildP6bAuditReport();
  }

  const batch = selectAutoPatchBatch(audit, BATCH_LIMIT);
  if (batch.length === 0) {
    console.error("apply:p6b-safe-formula-batch FAIL — no AUTO_PATCH_READY tools");
    process.exit(1);
  }

  console.log(`Selected ${batch.length} tool(s):`);
  for (const tool of batch) {
    console.log(`  - ${tool.slug}`);
  }

  const applyReport = applyFormulaBatch(batch.map((tool) => tool.slug));
  writeP6bOutputs(audit, applyReport, null);

  console.log(`\ngenerated: ${applyReport.generated.length}`);
  console.log(`passed vitest: ${applyReport.passed.length}`);
  console.log(`failed: ${applyReport.failed.length}`);
  console.log(`skipped: ${applyReport.skipped.length}`);

  if (applyReport.failed.length > 0) {
    console.error("\napply:p6b-safe-formula-batch FAIL");
    for (const row of applyReport.failed) {
      console.error(`  - ${row.slug}: ${row.reason}`);
    }
    process.exit(1);
  }

  console.log("\napply:p6b-safe-formula-batch PASS");
}

try {
  main();
} catch (error) {
  console.error("apply:p6b-safe-formula-batch FAIL");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
