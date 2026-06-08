#!/usr/bin/env npx tsx
import {
  formatBatchRemediationApplyReport,
  runBatchRemediationApplyAudit,
} from "../src/lib/formula-governance/full-tool-audit/remediation/apply-gate/batch-remediation-apply-audit";

console.log(formatBatchRemediationApplyReport(runBatchRemediationApplyAudit()));
process.exit(0);
