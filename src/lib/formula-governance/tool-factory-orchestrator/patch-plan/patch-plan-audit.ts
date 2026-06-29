/**
 * Single patch plan audit — Phase 5I-B read-only validation.
 */

import { GLOBAL_FORBIDDEN_FILES } from "@/lib/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-diff-contract";
import { buildHumanApprovalBlockers } from "@/lib/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-human-approval";
import type { PatchPlan } from "@/lib/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-types";

export type PatchPlanAuditResult = {
  readonly plan: PatchPlan;
  readonly forbiddenFileViolations: readonly string[];
  readonly blockers: readonly string[];
  readonly warnings: readonly string[];
};

export function auditPatchPlan(plan: PatchPlan): PatchPlanAuditResult {
  const forbiddenFileViolations: string[] = [];
  const blockers = [...plan.blockers];
  const warnings = [...plan.warnings];

  blockers.push(...buildHumanApprovalBlockers(plan));

  if (!plan.forbiddenFiles.includes("src/lib/calculators/**")) {
    forbiddenFileViolations.push(`${plan.slug}: calculators/** missing from forbiddenFiles`);
    blockers.push(`${plan.slug}: forbiddenFiles must include src/lib/calculators/**`);
  }

  for (const required of GLOBAL_FORBIDDEN_FILES) {
    if (!plan.forbiddenFiles.includes(required)) {
      forbiddenFileViolations.push(`${plan.slug}: missing forbidden path ${required}`);
    }
  }

  if (plan.canApplyWithoutHumanApproval) {
    blockers.push(`${plan.slug}: canApplyWithoutHumanApproval must remain false.`);
  }

  if (!plan.requiresHumanApproval) {
    blockers.push(`${plan.slug}: requiresHumanApproval must remain true.`);
  }

  if (!plan.expectedDiffContract.noProductionCalculatorChange) {
    blockers.push(`${plan.slug}: diff contract must forbid production calculator changes.`);
  }

  return {
    plan,
    forbiddenFileViolations,
    blockers: [...new Set(blockers)],
    warnings,
  };
}
