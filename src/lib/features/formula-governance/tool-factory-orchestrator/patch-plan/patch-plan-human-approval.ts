/**
 * Patch plan human approval gate - Phase 5I-B (always required).
 */

import type { PatchPlan } from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-types";

export function requiresHumanApproval(_plan: Pick<PatchPlan, "patchType" | "riskLevel">): true {
  return true;
}

export function canApplyWithoutHumanApproval(_plan: Pick<PatchPlan, "patchType">): false {
  return false;
}

export function buildHumanApprovalBlockers(plan: PatchPlan): string[] {
  const blockers: string[] = [];

  if (!plan.requiresHumanApproval) {
    blockers.push(`${plan.slug}: human approval flag must remain true.`);
  }

  if (plan.canApplyWithoutHumanApproval) {
    blockers.push(`${plan.slug}: patch cannot be applied without human approval.`);
  }

  return blockers;
}
