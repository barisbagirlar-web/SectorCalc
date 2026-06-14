#!/usr/bin/env node
/**
 * P6B — Verify formula factory batch + revenue boundary.
 */
import fs from "node:fs";
import {
  buildP6bAuditReport,
  verifyPatchedTools,
  writeP6bOutputs,
  P6B_AUDIT_PATH,
  P6B_APPLY_REPORT_PATH,
} from "./lib/p6b-formula-factory-lib.mjs";

function main() {
  console.log("=== verify:p6b-formula-factory ===\n");

  let audit;
  if (fs.existsSync(P6B_AUDIT_PATH)) {
    audit = JSON.parse(fs.readFileSync(P6B_AUDIT_PATH, "utf8"));
  } else {
    audit = buildP6bAuditReport();
  }

  let applyReport = null;
  if (fs.existsSync(P6B_APPLY_REPORT_PATH)) {
    applyReport = JSON.parse(fs.readFileSync(P6B_APPLY_REPORT_PATH, "utf8"));
  }

  const slugs = applyReport?.generated ?? [];
  if (slugs.length === 0) {
    console.error("verify:p6b-formula-factory FAIL — no patched slugs in apply report");
    process.exit(1);
  }

  const verifyReport = verifyPatchedTools(slugs);
  writeP6bOutputs(audit, applyReport, verifyReport);

  console.log(`patched slugs verified: ${verifyReport.results.length}`);
  console.log(`allPass: ${verifyReport.allPass}`);
  console.log(
    `revenue boundary: payment=${verifyReport.revenueBoundary.paymentEligible} formulaGate=${verifyReport.revenueBoundary.formulaGateEligible} freePayment=${verifyReport.revenueBoundary.freePaymentEligible}`,
  );
  console.log(`problem slug locked: ${verifyReport.revenueBoundary.problemSlugLocked}`);
  console.log(`feed-efficiency blocked: ${verifyReport.revenueBoundary.feedEfficiencyBlocked}`);

  for (const row of verifyReport.results) {
    if (row.result !== "PASS") {
      console.error(`  FAIL ${row.slug}`);
    }
  }

  if (!verifyReport.allPass) {
    console.error("\nverify:p6b-formula-factory FAIL");
    process.exit(1);
  }

  console.log("\nverify:p6b-formula-factory PASS");
}

try {
  main();
} catch (error) {
  console.error("verify:p6b-formula-factory FAIL");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
