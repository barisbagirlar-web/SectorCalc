#!/usr/bin/env npx tsx
/**
 * Report renderer contract audit CLI — Phase 5I-F (no file output).
 */

import { FORMULA_CONTRACTS } from "../src/lib/formula-governance/contracts";
import {
  formatBatchReportRendererAuditReport,
  runBatchReportRendererAudit,
} from "../src/lib/formula-governance/report-renderer-contract/batch-report-renderer-audit";
import { runBatchTrustTraceAudit } from "../src/lib/formula-governance/trust-trace-report/batch-trust-trace-audit";
import { runBatchTrustTraceExportAudit } from "../src/lib/formula-governance/trust-trace-report/export-contract/batch-trust-trace-export-audit";

const trustAudit = runBatchTrustTraceAudit({ contracts: FORMULA_CONTRACTS });
const exportAudit = runBatchTrustTraceExportAudit(trustAudit.reports);
const result = runBatchReportRendererAudit(exportAudit.contracts);
console.log(formatBatchReportRendererAuditReport(result));
process.exit(0);
