#!/usr/bin/env npx tsx
import {
  formatTrustTraceOutputDryRunReport,
  runTrustTraceOutputDryRunAudit,
} from "../src/lib/formula-governance/trust-trace-report/output-dry-run/trust-trace-output-audit";

console.log(formatTrustTraceOutputDryRunReport(runTrustTraceOutputDryRunAudit()));
process.exit(0);
