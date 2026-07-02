/**
 * Remediation apply gate tests - Phase 5I-J.
 */

import { describe, expect, test } from "vitest";
import { buildRemediationApplyGate } from "@/lib/features/formula-governance/full-tool-audit/remediation/apply-gate/remediation-apply-gate";
import { buildControlledPatchDraft } from "@/lib/features/formula-governance/tool-factory-orchestrator/controlled-patch-generator/controlled-patch-generator";
import { buildPatchPlanFromFullToolAudit } from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-generator";
import {
  buildApprovedHumanApprovalRecord,
  buildDefaultHumanApprovalRecord,
} from "@/lib/features/formula-governance/tool-factory-orchestrator/human-approval/human-approval-record";
import type { FullToolAuditItem } from "@/lib/features/formula-governance/full-tool-audit/full-tool-audit-types";

function buildItem(slug: string): FullToolAuditItem {
  return {
    slug,
    title: slug,
    tier: "free",
    category: "test",
    hasFormulaContract: true,
    hasProductionLocator: true,
    oracleStatus: "PASS",
    scenarioStatus: "pass",
    propertyStatus: "pass",
    inputDesignStatus: "usable",
    smartFormStatus: "not_eligible",
    trustTraceStatus: "trust_trace_ready",
    migrationStatus: "none",
    routeStatus: "production_locator_registered",
    reportStatus: "export_ready",
    blockers: [],
    warnings: [],
    score: 90,
    recommendedAction: "metadata_patch",
    readiness: { productionSafe: true, smartFormReady: false, reportReady: true, factoryReady: true },
  };
}

describe("remediation apply gate - Phase 5I-J", () => {
  test("dry-run ready + pending approval → waiting_human_approval", () => {
    const plan = buildPatchPlanFromFullToolAudit(buildItem("meta-tool"));
    const draft = buildControlledPatchDraft(plan);
    const gate = buildRemediationApplyGate({
      batchId: "remediation-batch-1",
      patchDrafts: [draft],
      humanApproval: buildDefaultHumanApprovalRecord({
        toolSlug: "meta-tool",
        linkedPlanId: plan.planId,
        approvalScope: "controlled_patch",
      }),
    });
    expect(gate.status).toBe("waiting_human_approval");
    expect(gate.allDryRunReady).toBe(true);
  });

  test("approved + safe → apply_ready_but_not_executed", () => {
    const plan = buildPatchPlanFromFullToolAudit(buildItem("safe-tool"));
    const draft = buildControlledPatchDraft(plan);
    const gate = buildRemediationApplyGate({
      batchId: "remediation-batch-1",
      patchDrafts: [draft],
      humanApproval: buildApprovedHumanApprovalRecord(
        buildDefaultHumanApprovalRecord({
          toolSlug: "safe-tool",
          linkedPlanId: plan.planId,
          approvalScope: "controlled_patch",
        }),
        {
          approvedBy: "qa-lead",
          approvedAt: "2026-06-08T00:00:00.000Z",
          expiresAt: "2027-06-08T00:00:00.000Z",
        },
      ),
    });
    expect(gate.status).toBe("apply_ready_but_not_executed");
  });

  test("canApply stays false", () => {
    const plan = buildPatchPlanFromFullToolAudit(buildItem("apply-tool"));
    const gate = buildRemediationApplyGate({
      batchId: "remediation-batch-1",
      patchDrafts: [buildControlledPatchDraft(plan)],
      humanApproval: buildApprovedHumanApprovalRecord(
        buildDefaultHumanApprovalRecord({
          toolSlug: "apply-tool",
          linkedPlanId: plan.planId,
          approvalScope: "controlled_patch",
        }),
        {
          approvedBy: "qa-lead",
          approvedAt: "2026-06-08T00:00:00.000Z",
          expiresAt: "2027-06-08T00:00:00.000Z",
        },
      ),
    });
    expect(gate.canApply).toBe(false);
  });

  test("applyCommandGenerated stays false", () => {
    const plan = buildPatchPlanFromFullToolAudit(buildItem("cmd-tool"));
    const gate = buildRemediationApplyGate({
      batchId: "remediation-batch-1",
      patchDrafts: [buildControlledPatchDraft(plan)],
      humanApproval: buildApprovedHumanApprovalRecord(
        buildDefaultHumanApprovalRecord({
          toolSlug: "cmd-tool",
          linkedPlanId: plan.planId,
          approvalScope: "controlled_patch",
        }),
        {
          approvedBy: "qa-lead",
          approvedAt: "2026-06-08T00:00:00.000Z",
          expiresAt: "2027-06-08T00:00:00.000Z",
        },
      ),
    });
    expect(gate.applyCommandGenerated).toBe(false);
  });

  test("calculator path draft is blocked from batch", () => {
    const plan = buildPatchPlanFromFullToolAudit(buildItem("calc-tool"));
    const draft = {
      ...buildControlledPatchDraft(plan),
      proposedOperations: [
        { kind: "update_file" as const, targetPath: "src/lib/calculators/calc-tool.ts", summary: "bad" },
      ],
      calculatorImpact: "blocked" as const,
      status: "blocked" as const,
    };
    const gate = buildRemediationApplyGate({
      batchId: "remediation-batch-1",
      patchDrafts: [draft],
      humanApproval: buildDefaultHumanApprovalRecord({ toolSlug: "calc-tool", linkedPlanId: plan.planId }),
    });
    expect(gate.selectedPatchDrafts).toHaveLength(0);
    expect(gate.status).toBe("blocked");
  });
});
