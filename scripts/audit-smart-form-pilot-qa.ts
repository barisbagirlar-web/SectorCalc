#!/usr/bin/env npx tsx
/**
 * SectorCalc — smart form pilot batch QA audit CLI (Phase 5H-G-I).
 * Read-only report; exit code 0; no file writes; no production calculator execution.
 */

import {
  formatSmartFormPilotBatchQaAuditReport,
  runSmartFormPilotBatchQaAudit,
} from "../src/components/tools/smart-form/pilot-batch-qa-audit";

const jsonExport = process.argv.includes("--json");
const result = runSmartFormPilotBatchQaAudit();

console.log(formatSmartFormPilotBatchQaAuditReport(result));

if (jsonExport) {
  console.log("");
  console.log(JSON.stringify(result, null, 2));
}

process.exit(0);
