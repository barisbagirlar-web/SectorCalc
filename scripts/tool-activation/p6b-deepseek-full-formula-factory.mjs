#!/usr/bin/env node
/**
 * P6B — DeepSeek Full Formula Factory audit
 * Scans full tool universe; no payment/formula gate changes.
 */
import {
  buildP6bAuditReport,
  writeP6bOutputs,
  P6B_AUDIT_PATH,
} from "./lib/p6b-formula-factory-lib.mjs";

function main() {
  console.log("=== audit:p6b-formula-factory ===\n");
  const audit = buildP6bAuditReport();
  writeP6bOutputs(audit, null, null);

  console.log(`totalTools: ${audit.summary.totalTools}`);
  console.log(`fullyWorking: ${audit.summary.fullyWorking}`);
  console.log(`autoPatchReady: ${audit.summary.autoPatchReady}`);
  console.log(`manualExpertRequired: ${audit.summary.manualExpertRequired}`);
  console.log(`blockedSafety: ${audit.summary.blockedSafety}`);
  console.log(`output: ${P6B_AUDIT_PATH}`);
  console.log("\naudit:p6b-formula-factory PASS");
}

try {
  main();
} catch (error) {
  console.error("audit:p6b-formula-factory FAIL");
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
