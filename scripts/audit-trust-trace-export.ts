#!/usr/bin/env npx tsx
/**
 * Trust trace export contract audit CLI — Phase 5I-C (read-only).
 */

import { FORMULA_CONTRACTS } from "../src/lib/formula-governance/contracts";
import { runBatchTrustTraceAudit } from "../src/lib/formula-governance/trust-trace-report/batch-trust-trace-audit";
import {
  formatBatchTrustTraceExportAuditReport,
  runBatchTrustTraceExportAudit,
} from "../src/lib/formula-governance/trust-trace-report/export-contract/batch-trust-trace-export-audit";

const trustAudit = runBatchTrustTraceAudit({ contracts: FORMULA_CONTRACTS });
const result = runBatchTrustTraceExportAudit(trustAudit.reports);
console.log(formatBatchTrustTraceExportAuditReport(result));
process.exit(0);
