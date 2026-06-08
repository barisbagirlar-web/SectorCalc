#!/usr/bin/env npx tsx
/**
 * Trust trace report audit CLI — Phase 5H-I (read-only).
 */

import { FORMULA_CONTRACTS } from "../src/lib/formula-governance/contracts";
import {
  formatBatchTrustTraceAuditReport,
  runBatchTrustTraceAudit,
} from "../src/lib/formula-governance/trust-trace-report/batch-trust-trace-audit";

const result = runBatchTrustTraceAudit({ contracts: FORMULA_CONTRACTS });
console.log(formatBatchTrustTraceAuditReport(result));
process.exit(0);
