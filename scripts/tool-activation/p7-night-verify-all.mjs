#!/usr/bin/env node
/**
 * P7 — Verify patched tools, revert failures, assert revenue boundary.
 */
import fs from "node:fs";
import path from "node:path";
import { loadEnvLocal } from "../ai/load-env-local.mjs";
import { ROOT } from "./lib/activation-paths.mjs";
import {
  buildP6bAuditReport,
  loadP7AuditOrThrow,
  verifyP7Batch,
  writeP7Outputs,
  P7_APPLY_REPORT_PATH,
  P7_VERIFY_REPORT_PATH,
} from "./lib/p7-night-factory-lib.mjs";

function main() {
  loadEnvLocal();
  console.log("=== verify:p7-night ===\n");

  const audit = loadP7AuditOrThrow();

  if (!fs.existsSync(P7_APPLY_REPORT_PATH)) {
    console.error("verify:p7-night FAIL — missing apply report (run apply:p7-night first)");
    process.exit(1);
  }

  const applyReport = JSON.parse(fs.readFileSync(P7_APPLY_REPORT_PATH, "utf8"));
  const slugs = applyReport.generated ?? [];

  if (slugs.length === 0) {
    const verifyReport = {
      generatedAt: new Date().toISOString(),
      results: [],
      revenueBoundary: audit.revenueBoundary,
      boundaryOk: true,
      allPass: true,
      failedAndReverted: [],
      revertReport: { reverted: [], errors: [] },
      note: "No generated tools to verify",
    };
    const afterAudit = buildP6bAuditReport();
    audit.summary.fullyWorkingAfter = afterAudit.summary.fullyWorking;
    writeP7Outputs(audit, applyReport, verifyReport);
    console.log("patched slugs verified: 0");
    console.log("allPass: true");
    console.log("\nverify:p7-night PASS (nothing generated)");
    return;
  }

  const verifyReport = verifyP7Batch(slugs);
  const afterAudit = buildP6bAuditReport();
  audit.summary.fullyWorkingAfter = afterAudit.summary.fullyWorking;
  writeP7Outputs(audit, applyReport, verifyReport);

  console.log(`patched slugs verified: ${verifyReport.results.length}`);
  console.log(`allPass: ${verifyReport.allPass}`);
  console.log(`failedAndReverted: ${verifyReport.failedAndReverted.length}`);
  console.log(
    `revenue boundary: payment=${verifyReport.revenueBoundary.paymentEligible} formulaGate=${verifyReport.revenueBoundary.formulaGateEligible} freePayment=${verifyReport.revenueBoundary.freePaymentEligible}`,
  );
  console.log(`problem slug locked: ${verifyReport.revenueBoundary.problemSlugLocked}`);
  console.log(`feed-efficiency blocked: ${verifyReport.revenueBoundary.feedEfficiencyBlocked}`);
  console.log(`output: ${path.relative(ROOT, P7_VERIFY_REPORT_PATH)}`);

  for (const row of verifyReport.results) {
    if (row.result !== "PASS") {
      console.error(`  FAIL ${row.slug}`);
    }
  }

  if (verifyReport.failedAndReverted.length > 0) {
    console.log("\nReverted files:");
    for (const filePath of verifyReport.revertReport.reverted.slice(0, 30)) {
      console.log(`  - ${filePath}`);
    }
  }

  if (!verifyReport.allPass) {
    console.error("\nverify:p7-night FAIL");
    process.exit(1);
  }

  console.log("\nverify:p7-night PASS");
}

try {
  main();
} catch (error) {
  console.error("verify:p7-night FAIL");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
