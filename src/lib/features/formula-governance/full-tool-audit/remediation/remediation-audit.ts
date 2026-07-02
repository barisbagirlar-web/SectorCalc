/**
 * Remediation batch audit - Phase 5I-D read-only validation and runner.
 */

import { FORMULA_CONTRACTS } from "@/lib/features/formula-governance/contracts";
import { runFullExistingToolAudit } from "@/lib/features/formula-governance/full-tool-audit/full-tool-audit-runner";
import { buildRemediationBatch1 } from "@/lib/features/formula-governance/full-tool-audit/remediation/remediation-batch-builder";
import type { RemediationBatch } from "@/lib/features/formula-governance/full-tool-audit/remediation/remediation-types";
import { runBatchPatchPlanAudit } from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/batch-patch-plan-audit";
import { runBatchTrustTraceAudit } from "@/lib/features/formula-governance/trust-trace-report/batch-trust-trace-audit";
import { runBatchTrustTraceExportAudit } from "@/lib/features/formula-governance/trust-trace-report/export-contract/batch-trust-trace-export-audit";

export function auditRemediationBatch(batch: RemediationBatch): RemediationBatch {
  const blockers = [...batch.blockers];

  if (batch.selectedTools.length > 8) {
    blockers.push(`Remediation batch exceeds max 8 tools (${batch.selectedTools.length}).`);
  }

  if (!batch.requiresHumanApproval) {
    blockers.push("Remediation batch must require human approval.");
  }

  if (!batch.canRunWithoutCalculatorChange) {
    blockers.push("Remediation batch must not require calculator changes.");
  }

  for (const action of batch.actions) {
    if (!action.forbiddenFiles.includes("src/lib/calculators/**")) {
      blockers.push(`${action.slug}: forbiddenFiles must include src/lib/calculators/**`);
    }
  }

  return {
    ...batch,
    blockers: [...new Set(blockers)],
  };
}

export function runRemediationBatch1Audit(rootDir: string = process.cwd()): RemediationBatch {
  const fullToolAudit = runFullExistingToolAudit(FORMULA_CONTRACTS, rootDir);
  const patchPlanAudit = runBatchPatchPlanAudit(fullToolAudit);
  const trustTraceAudit = runBatchTrustTraceAudit({ contracts: FORMULA_CONTRACTS });
  const exportAudit = runBatchTrustTraceExportAudit(trustTraceAudit.reports);

  const batch = buildRemediationBatch1({
    fullToolAudit,
    patchPlanAudit,
    trustTraceAudit,
    exportAudit,
  });

  return auditRemediationBatch(batch);
}

export function formatRemediationBatch1Report(batch: RemediationBatch): string {
  const lines = [
    "Full Audit Remediation Batch 1",
    `Batch ID: ${batch.batchId}`,
    `Status: ${batch.status}`,
    `Selected tools: ${batch.selectedTools.length}`,
    `Excluded tools: ${batch.excludedTools.length}`,
    `Risk level: ${batch.riskLevel}`,
    `Human approval required: true`,
    `Can run without calculator change: true`,
    `Expected impact: ${batch.expectedImpact}`,
    "",
    "Selected tools:",
  ];

  if (batch.selectedTools.length === 0) {
    lines.push("- (none)");
  } else {
    for (const slug of batch.selectedTools) {
      lines.push(`- ${slug}`);
    }
  }

  lines.push("", "Next batch candidates:");
  if (batch.nextBatchCandidates.length === 0) {
    lines.push("- (none)");
  } else {
    for (const slug of batch.nextBatchCandidates) {
      lines.push(`- ${slug}`);
    }
  }

  return lines.join("\n");
}
