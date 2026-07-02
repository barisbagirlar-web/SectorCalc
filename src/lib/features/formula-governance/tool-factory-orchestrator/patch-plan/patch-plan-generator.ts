/**
 * Patch plan generator - Phase 5I-B deterministic plan from full tool audit.
 */

import type { FullToolAuditItem } from "@/lib/features/formula-governance/full-tool-audit/full-tool-audit-types";
import {
  buildPatchPlanDiffContract,
  GLOBAL_FORBIDDEN_FILES,
} from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-diff-contract";
import {
  canApplyWithoutHumanApproval,
  requiresHumanApproval,
} from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-human-approval";
import {
  canAutoGeneratePatch,
  classifyPatchPlanRisk,
  mapRecommendedActionToPatchType,
} from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-risk-classifier";
import type {
  PatchPlan,
  PatchPlanStatus,
  PatchPlanType,
} from "@/lib/features/formula-governance/tool-factory-orchestrator/patch-plan/patch-plan-types";

const ALLOWED_FILES_BY_PATCH_TYPE: Readonly<Record<PatchPlanType, readonly string[]>> = {
  metadata_only: ["src/lib/formula-governance/contracts/**", "src/lib/formula-governance/types.ts"],
  fixture_ontology: ["src/lib/formula-governance/calculation-ontology/**"],
  input_design_patch: [
    "src/lib/formula-governance/input-design-audit/**",
    "src/lib/formula-governance/requirement-engine/**",
  ],
  smart_form_patch: [
    "src/components/tools/smart-form/**",
    "src/lib/formula-governance/smart-form-architecture/**",
    "src/lib/formula-governance/smart-form-rendering/**",
    "src/lib/formula-governance/smart-form-ui-bridge/**",
    "src/lib/feature-flags/**",
  ],
  trust_trace_patch: ["src/lib/formula-governance/trust-trace-report/**"],
  report_export_contract: ["src/lib/formula-governance/trust-trace-report/export-contract/**"],
  test_only_patch: ["src/lib/formula-governance/**/__tests__/**"],
  blocked_manual_review: [],
};

function resolvePatchPlanStatus(
  patchType: PatchPlanType,
  riskLevel: PatchPlan["riskLevel"],
  blockers: readonly string[],
): PatchPlanStatus {
  if (blockers.length > 0 || patchType === "blocked_manual_review") {
    return patchType === "blocked_manual_review" ? "needs_manual_review" : "blocked";
  }
  if (patchType === "metadata_only") {
    return "needs_metadata";
  }
  if (patchType === "fixture_ontology") {
    return "needs_fixture";
  }
  if (riskLevel === "critical" || riskLevel === "high") {
    return "needs_manual_review";
  }
  return "patch_plan_ready";
}

function buildTargetPhase(patchType: PatchPlanType): string {
  switch (patchType) {
    case "metadata_only":
      return "FormulaContract metadata hygiene";
    case "fixture_ontology":
      return "Fixture ontology registration";
    case "input_design_patch":
      return "Input design controlled patch";
    case "smart_form_patch":
      return "Smart form rollout patch";
    case "trust_trace_patch":
      return "Trust trace report layer";
    case "report_export_contract":
      return "Trust trace export contract";
    case "test_only_patch":
      return "Governance test coverage only";
    case "blocked_manual_review":
      return "Manual review required";
    default:
      return "Unknown";
  }
}

function buildRollbackPlan(patchType: PatchPlanType, slug: string): string[] {
  return [
    `Revert governance-only changes for "${slug}" (${patchType}).`,
    "Run npm run test:formulas && npm run audit:formulas.",
    "Do not revert production calculator or route files.",
  ];
}

export function buildPatchPlanFromFullToolAudit(item: FullToolAuditItem): PatchPlan {
  const patchType = mapRecommendedActionToPatchType(item.recommendedAction);
  const riskLevel = classifyPatchPlanRisk(item, patchType);
  const blockers = [...item.blockers];
  const warnings = [...item.warnings];

  if (item.recommendedAction === "no_action") {
    warnings.push(`${item.slug}: no_action mapped to test_only_patch for audit completeness.`);
  }

  const expectedDiffContract = buildPatchPlanDiffContract(patchType);
  const status = resolvePatchPlanStatus(patchType, riskLevel, blockers);

  return {
    planId: `patch-plan-${item.slug}`,
    slug: item.slug,
    sourceAudit: "full_tool_audit",
    targetPhase: buildTargetPhase(patchType),
    patchType,
    allowedFiles: [...ALLOWED_FILES_BY_PATCH_TYPE[patchType]],
    forbiddenFiles: [...GLOBAL_FORBIDDEN_FILES],
    expectedDiffContract,
    requiredTests: [...expectedDiffContract.testsRequired],
    rollbackPlan: buildRollbackPlan(patchType, item.slug),
    riskLevel,
    canAutoGeneratePatch: canAutoGeneratePatch(patchType, riskLevel),
    requiresHumanApproval: requiresHumanApproval({ patchType, riskLevel }),
    canApplyWithoutHumanApproval: canApplyWithoutHumanApproval({ patchType }),
    blockers,
    warnings,
    status,
    sourceRecommendedAction: item.recommendedAction,
  };
}
