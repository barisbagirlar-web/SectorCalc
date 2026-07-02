/**
 * Controlled patch risk gate - Phase 5I-E impact classification.
 */

import type { PatchPlan } from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-types";
import type {
  ControlledPatchDraftStatus,
  ControlledPatchImpact,
  ControlledPatchOperation,
} from "@/lib/features/formula-governance/tool-factory-orchestrator/controlled-patch-generator/controlled-patch-types";
import { validateProposedOperations } from "@/lib/features/formula-governance/tool-factory-orchestrator/controlled-patch-generator/controlled-patch-file-policy";

export function classifyImpacts(
  operations: readonly ControlledPatchOperation[],
  planBlockers: readonly string[],
): {
  readonly productionImpact: ControlledPatchImpact;
  readonly calculatorImpact: ControlledPatchImpact;
  readonly routeImpact: ControlledPatchImpact;
  readonly deployImpact: ControlledPatchImpact;
} {
  const violations = validateProposedOperations(operations);
  const blocked = violations.length > 0 || planBlockers.length > 0;

  const impact: ControlledPatchImpact = blocked ? "blocked" : "none";

  const calculatorBlocked = operations.some((op) =>
    op.targetPath.includes("src/lib/calculators/"),
  );
  const routeBlocked = operations.some((op) => op.targetPath.includes("src/app/"));
  const deployBlocked = operations.some(
    (op) => op.targetPath.includes("firebase.json") || op.targetPath.includes("firestore.rules"),
  );

  return {
    productionImpact: blocked ? "blocked" : "none",
    calculatorImpact: calculatorBlocked ? "blocked" : "none",
    routeImpact: routeBlocked ? "blocked" : "none",
    deployImpact: deployBlocked ? "blocked" : "none",
  };
}

export function resolveControlledPatchStatus(
  plan: PatchPlan,
  operationViolations: readonly string[],
): ControlledPatchDraftStatus {
  if (plan.patchType === "blocked_manual_review" || plan.blockers.length > 0) {
    return "blocked";
  }
  if (operationViolations.length > 0) {
    return "blocked";
  }
  if (plan.riskLevel === "high" || plan.riskLevel === "critical") {
    return "needs_manual_approval";
  }
  if (plan.status === "needs_manual_review") {
    return "needs_manual_approval";
  }
  if (plan.status === "needs_metadata" || plan.status === "needs_fixture") {
    return operationViolations.length === 0 ? "dry_run_ready" : "blocked";
  }
  return "dry_run_ready";
}
