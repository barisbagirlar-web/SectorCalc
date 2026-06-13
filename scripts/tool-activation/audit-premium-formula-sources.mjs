#!/usr/bin/env node
import {
  buildFormulaSourceAuditReport,
  formatFormulaSourceAuditStdout,
  writeFormulaSourceAuditReport,
} from "./lib/formula-source-audit-lib.mjs";

function main() {
  let report;

  try {
    report = buildFormulaSourceAuditReport();
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exit(1);
  }

  writeFormulaSourceAuditReport(report);
  console.log(formatFormulaSourceAuditStdout(report));
}

main();
