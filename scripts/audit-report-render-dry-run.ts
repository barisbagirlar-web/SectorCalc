#!/usr/bin/env npx tsx
import {
  formatBatchReportRenderDryRunReport,
  runBatchReportRenderDryRunAudit,
} from "../src/lib/formula-governance/report-renderer-contract/dry-run/batch-report-render-dry-run-audit";

console.log(formatBatchReportRenderDryRunReport(runBatchReportRenderDryRunAudit()));
process.exit(0);
