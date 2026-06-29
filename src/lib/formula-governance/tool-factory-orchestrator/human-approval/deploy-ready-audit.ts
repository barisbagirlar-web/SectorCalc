/**
 * Deploy ready audit runner — Phase 5I-G batch evaluation.
 */

import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import { runFullExistingToolAudit } from "@/lib/formula-governance/full-tool-audit/full-tool-audit-runner";
import { runBatchReportRendererAudit } from "@/lib/formula-governance/report-renderer-contract/batch-report-renderer-audit";
import { runBatchControlledPatchDraftAudit } from "@/lib/formula-governance/tool-factory-orchestrator/controlled-patch-generator/batch-controlled-patch-audit";
import { evaluateDeployReadyGate } from "@/lib/formula-governance/tool-factory-orchestrator/human-approval/deploy-ready-gate";
import { buildDefaultHumanApprovalRecord } from "@/lib/formula-governance/tool-factory-orchestrator/human-approval/human-approval-record";
import type { BatchDeployReadyAuditResult } from "@/lib/formula-governance/tool-factory-orchestrator/human-approval/human-approval-types";
import { runBatchPatchPlanAudit } from "@/lib/formula-governance/tool-factory-orchestrator/patch-plan/batch-patch-plan-audit";
import { runBatchTrustTraceAudit } from "@/lib/formula-governance/trust-trace-report/batch-trust-trace-audit";
import { runBatchTrustTraceExportAudit } from "@/lib/formula-governance/trust-trace-report/export-contract/batch-trust-trace-export-audit";

export type RunBatchDeployReadyAuditParams = {
  readonly fullToolAudit?: ReturnType<typeof runFullExistingToolAudit>;
  readonly patchPlanAudit?: ReturnType<typeof runBatchPatchPlanAudit>;
  readonly controlledPatchAudit?: ReturnType<typeof runBatchControlledPatchDraftAudit>;
  readonly trustTraceAudit?: ReturnType<typeof runBatchTrustTraceAudit>;
  readonly rendererAudit?: ReturnType<typeof runBatchReportRendererAudit>;
};

function buildTopBlockedReasons(gates: readonly ReturnType<typeof evaluateDeployReadyGate>[]): string[] {
  const counts = new Map<string, number>();

  for (const gate of gates) {
    for (const blocker of gate.blockers) {
      counts.set(blocker, (counts.get(blocker) ?? 0) + 1);
    }
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 10)
    .map(([reason, count]) => `- ${reason} (${count})`);
}

export function runBatchDeployReadyAudit(
  params: RunBatchDeployReadyAuditParams = {},
): BatchDeployReadyAuditResult {
  const fullToolAudit = params.fullToolAudit ?? runFullExistingToolAudit(FORMULA_CONTRACTS);
  const patchPlanAudit = params.patchPlanAudit ?? runBatchPatchPlanAudit(fullToolAudit);
  const controlledPatchAudit =
    params.controlledPatchAudit ?? runBatchControlledPatchDraftAudit(patchPlanAudit);
  const trustTraceAudit =
    params.trustTraceAudit ?? runBatchTrustTraceAudit({ contracts: FORMULA_CONTRACTS });
  const exportAudit = runBatchTrustTraceExportAudit(trustTraceAudit.reports);
  const rendererAudit = params.rendererAudit ?? runBatchReportRendererAudit(exportAudit.contracts);

  const planBySlug = new Map(patchPlanAudit.plans.map((plan) => [plan.slug, plan]));
  const draftBySlug = new Map(controlledPatchAudit.drafts.map((draft) => [draft.slug, draft]));
  const traceBySlug = new Map(trustTraceAudit.reports.map((report) => [report.slug, report]));
  const rendererBySlug = new Map(rendererAudit.contracts.map((contract) => [contract.slug, contract]));

  const candidateSlugs = fullToolAudit.items
    .filter((item) => item.recommendedAction !== "no_action")
    .map((item) => item.slug);

  const gates = candidateSlugs.map((slug) => {
    const patchPlan = planBySlug.get(slug);
    return evaluateDeployReadyGate({
      toolSlug: slug,
      patchPlan,
      controlledPatch: draftBySlug.get(slug),
      trustTrace: traceBySlug.get(slug),
      reportRenderer: rendererBySlug.get(slug),
      fullAuditPassed: true,
      buildGatePassed: true,
      secretGatePassed: true,
      humanApproval: buildDefaultHumanApprovalRecord({
        toolSlug: slug,
        linkedPlanId: patchPlan?.planId ?? `plan-${slug}`,
        linkedPatchId: draftBySlug.get(slug)?.patchId ?? null,
      }),
    });
  });

  const topReadyCandidates = gates
    .filter((gate) => gate.status === "deploy_ready")
    .map((gate) => gate.toolSlug);

  const commandAllowedCount = gates.filter((gate) => gate.deployCommandAllowed).length;

  return {
    totalTools: gates.length,
    deployReady: gates.filter((gate) => gate.deployReady).length,
    waitingHumanApproval: gates.filter((gate) => gate.status === "waiting_human_approval").length,
    blocked: gates.filter((gate) => gate.status === "blocked").length,
    commandAllowedCount,
    topReadyCandidates,
    topBlockedReasons: buildTopBlockedReasons(gates),
    gates,
    warnings: gates.flatMap((gate) => gate.warnings),
    blockers: gates.flatMap((gate) => gate.blockers),
  };
}

export function formatBatchDeployReadyAuditReport(result: BatchDeployReadyAuditResult): string {
  const lines = [
    "Tool Factory Deploy Ready Gate Audit",
    `Total tools: ${result.totalTools}`,
    `Deploy ready: ${result.deployReady}`,
    `Waiting human approval: ${result.waitingHumanApproval}`,
    `Blocked: ${result.blocked}`,
    `Command allowed count: ${result.commandAllowedCount}`,
    "",
    "Top ready candidates:",
    ...(result.topReadyCandidates.length > 0
      ? result.topReadyCandidates.map((slug) => `- ${slug}`)
      : ["- (none)"]),
    "",
    "Top blocked reasons:",
    ...(result.topBlockedReasons.length > 0 ? result.topBlockedReasons : ["- (none)"]),
  ];

  return lines.join("\n");
}
