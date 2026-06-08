/**
 * Existing tool migration planner — Phase 5H-E read-only Dual-Core migration plan.
 */

import { hasFixtureOntologyForSlug } from "@/lib/formula-governance/calculation-ontology/fixture-ontology-registry";
import type { BatchInputDesignAuditResult } from "@/lib/formula-governance/input-design-audit/input-design-audit-types";
import { isPremiumContract } from "@/lib/formula-governance/input-design-audit/input-design-helpers";
import {
  hasFullGovernanceCoverage,
  isMetadataBlocker,
} from "@/lib/formula-governance/input-design-audit/migration-plan/governance-coverage";
import { selectFirstControlledPatchBatch } from "@/lib/formula-governance/input-design-audit/migration-plan/first-patch-batch-selector";
import {
  resolveCanPatchWithoutUIBreak,
  resolveMigrationPriority,
  resolveMigrationRiskLevel,
} from "@/lib/formula-governance/input-design-audit/migration-plan/migration-risk";
import type {
  BatchMigrationPlan,
  MigrationPatchLevel,
  ToolMigrationPlanItem,
} from "@/lib/formula-governance/input-design-audit/migration-plan/migration-plan-types";
import { classifyPatchLevel } from "@/lib/formula-governance/input-design-audit/migration-plan/patch-level-classifier";
import {
  getControlledInputDesignPatch,
} from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";
import {
  isControlledInputDesignPatchCompleted,
  listCompletedControlledInputDesignPatchSlugs,
} from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-status";
import { getFormulaContractBySlug } from "@/lib/formula-governance/contracts";
import type { BatchAlignmentAuditResult } from "@/lib/formula-governance/requirement-engine/batch-alignment-audit";
import type { FormulaContract } from "@/lib/formula-governance/types";

export type BuildExistingToolMigrationPlanParams = {
  readonly inputDesignAudit: BatchInputDesignAuditResult;
  readonly alignmentAudit?: BatchAlignmentAuditResult;
  readonly contracts?: readonly FormulaContract[];
};

function buildRequiredActions(
  patchLevel: MigrationPatchLevel,
  auditSlug: string,
  hasFixtureOntology: boolean,
): string[] {
  const actions: string[] = [];

  switch (patchLevel) {
    case "blocked":
      actions.push(`Resolve blockers for "${auditSlug}" before any migration patch.`);
      break;
    case "metadata_only":
      actions.push(`Complete FormulaContract metadata hygiene for "${auditSlug}".`);
      break;
    case "fixture_ontology":
      actions.push(`Register professional fixture ontology for "${auditSlug}".`);
      break;
    case "input_design_only":
      actions.push(`Map requirement-engine input design to existing form without production changes.`);
      break;
    case "controlled_input_patch":
      actions.push(`Add missing required or risk-driver inputs for "${auditSlug}" with controlled UI patch.`);
      break;
    case "smart_form_patch":
      actions.push(`Introduce smart-form grouping/advanced fields for "${auditSlug}" after alignment review.`);
      break;
    case "report_trace_patch":
      actions.push(`Strengthen validation, dimension and trust-trace reporting for "${auditSlug}".`);
      break;
    case "none":
      actions.push(`Monitor alignment drift only for "${auditSlug}".`);
      break;
    default:
      break;
  }

  if (!hasFixtureOntology) {
    actions.push(`Add fixture ontology before full Dual-Core runtime validation for "${auditSlug}".`);
  }

  return actions;
}

function buildAffectedAreas(patchLevel: MigrationPatchLevel): string[] {
  switch (patchLevel) {
    case "metadata_only":
      return ["formula-governance/contracts"];
    case "fixture_ontology":
      return ["calculation-ontology/fixtures", "requirement-engine"];
    case "input_design_only":
      return ["requirement-engine", "input-design-audit"];
    case "controlled_input_patch":
      return ["requirement-engine", "production-form", "input-schema"];
    case "smart_form_patch":
      return ["requirement-engine", "production-form", "smart-form"];
    case "report_trace_patch":
      return ["validation-rules", "alignment-audit", "report-trace"];
    case "blocked":
      return ["formula-governance/blockers"];
    default:
      return ["monitoring-only"];
  }
}

function buildTestRequirements(
  patchLevel: MigrationPatchLevel,
  hasFullCoverage: boolean,
): string[] {
  const requirements = [
    "npm run test:formulas",
    "npm run audit:input-design",
    "npm run audit:alignment",
  ];

  if (patchLevel !== "metadata_only" && patchLevel !== "none") {
    requirements.push("npm run audit:migration-plan");
  }

  if (!hasFullCoverage) {
    requirements.push("oracle/scenario/property coverage gate before production patch");
  }

  return requirements;
}

function buildExpectedBenefit(
  patchLevel: MigrationPatchLevel,
  auditStatus: ToolMigrationPlanItem["currentStatus"],
): string {
  if (patchLevel === "fixture_ontology") {
    return "Enable fixture-backed requirement engine and alignment drift detection.";
  }
  if (patchLevel === "input_design_only" && auditStatus === "professional_ready") {
    return "Migrate professional-ready contract to Dual-Core input design without breaking production math.";
  }
  if (patchLevel === "smart_form_patch") {
    return "Expose advanced decision inputs with controlled smart-form UX while preserving oracle safety.";
  }
  if (patchLevel === "report_trace_patch") {
    return "Improve trust trace, validation transparency and alignment review readiness.";
  }
  if (patchLevel === "controlled_input_patch") {
    return "Close missing required/risk inputs for safer requirement-engine resolution.";
  }
  if (patchLevel === "metadata_only") {
    return "Clear ontology blockers so requirement engine can resolve target outputs.";
  }
  return "Maintain stable governance posture with drift monitoring only.";
}

function buildNextGate(item: ToolMigrationPlanItem): string {
  if (item.recommendedPatchLevel === "blocked" || item.blockedBy.length > 0) {
    return "blocker_resolution";
  }
  if (item.recommendedPatchLevel === "fixture_ontology") {
    return "fixture_ontology_registered";
  }
  if (!item.hasFullGovernanceCoverage) {
    return "governance_coverage_complete";
  }
  if (item.migrationRiskLevel === "medium" || item.alignmentStatus === "needs_review") {
    return "alignment_review_pass";
  }
  if (item.canPatchWithoutUIBreak) {
    return "controlled_patch_ready";
  }
  return "smart_form_design_review";
}

function buildNotes(
  auditResult: BatchInputDesignAuditResult["summaries"][number],
  patchLevel: MigrationPatchLevel,
  contract?: FormulaContract,
): string[] {
  const notes: string[] = [...auditResult.warnings.slice(0, 2)];

  if (auditResult.alignmentStatus === "needs_review") {
    notes.push("Alignment needs_review — prioritize fixture/alias review before UI migration.");
  }
  if (auditResult.alignmentStatus === "contract_only_analysis") {
    notes.push("Contract-only analysis — fixture ontology not registered.");
  }
  if (contract && isPremiumContract(contract)) {
    notes.push("Premium/revenue tool — elevated migration priority.");
  }
  if (patchLevel === "none" && auditResult.status === "professional_ready") {
    notes.push("Professional-ready — form/report readiness analysis recommended over input patch.");
  }

  return notes;
}

function countByPriority(items: readonly ToolMigrationPlanItem[]): Pick<
  BatchMigrationPlan,
  "immediate" | "high" | "medium" | "low" | "defer"
> {
  const counts = { immediate: 0, high: 0, medium: 0, low: 0, defer: 0 };
  for (const item of items) {
    counts[item.migrationPriority] += 1;
  }
  return counts;
}

function applyCompletedInputDesignPatchOverlay(
  item: ToolMigrationPlanItem,
): ToolMigrationPlanItem {
  if (!isControlledInputDesignPatchCompleted(item.slug)) {
    return { ...item, inputDesignPatchCompleted: false };
  }

  const patch = getControlledInputDesignPatch(item.slug);
  if (!patch) {
    return { ...item, inputDesignPatchCompleted: false };
  }

  return {
    ...item,
    inputDesignPatchCompleted: true,
    recommendedPatchLevel: "none",
    completedInputDesignPatchGate: patch.nextGate,
    nextGate: patch.nextGate,
    requiredActions: [
      "Controlled input design patch completed — ready for smart form architecture gate.",
      ...item.requiredActions.filter(
        (action) => !action.includes("Map requirement-engine input design"),
      ),
    ],
    expectedBenefit:
      "Dual-Core input design mapping registered in governance registry; production math and UI unchanged.",
    affectedAreas: ["requirement-engine", "input-design-audit", "controlled-input-patch"],
    notes: [
      ...item.notes,
      `Phase 5H-F controlled input design patch applied (${patch.patchType}).`,
    ],
  };
}

export function buildExistingToolMigrationPlan(
  params: BuildExistingToolMigrationPlanParams,
): BatchMigrationPlan {
  const { inputDesignAudit, alignmentAudit } = params;
  const warnings: string[] = [...inputDesignAudit.warnings];
  const blockers: string[] = [...inputDesignAudit.blockers];
  const items: ToolMigrationPlanItem[] = [];

  for (const auditResult of inputDesignAudit.summaries) {
    const contract =
      params.contracts?.find((entry) => entry.slug === auditResult.slug) ??
      getFormulaContractBySlug(auditResult.slug);
    const alignmentSummary = alignmentAudit?.summaries.find(
      (entry) => entry.slug === auditResult.slug,
    );
    const hasFixtureOntology = hasFixtureOntologyForSlug(auditResult.slug);
    const fullCoverage = contract ? hasFullGovernanceCoverage(contract) : false;

    const recommendedPatchLevel = classifyPatchLevel({
      auditResult,
      hasFixtureOntology,
      hasFullGovernanceCoverage: fullCoverage,
      alignmentSummary,
    });

    const migrationRiskLevel = resolveMigrationRiskLevel(auditResult, alignmentSummary);
    const migrationPriority = resolveMigrationPriority({
      auditResult,
      patchLevel: recommendedPatchLevel,
      migrationRiskLevel,
      contract,
      hasFixtureOntology,
    });
    const canPatchWithoutUIBreak = resolveCanPatchWithoutUIBreak(
      recommendedPatchLevel,
      auditResult,
    );

    const item: ToolMigrationPlanItem = {
      slug: auditResult.slug,
      currentStatus: auditResult.status,
      inputSufficiencyScore: auditResult.inputSufficiencyScore,
      professionalDepthScore: auditResult.professionalDepthScore,
      alignmentStatus: auditResult.alignmentStatus ?? alignmentSummary?.status,
      migrationRiskScore: Math.max(
        auditResult.migrationRiskScore,
        alignmentSummary?.migrationRiskScore ?? 0,
      ),
      recommendedPatchLevel,
      migrationPriority,
      migrationRiskLevel,
      canPatchWithoutUIBreak,
      hasFullGovernanceCoverage: fullCoverage,
      requiredActions: buildRequiredActions(
        recommendedPatchLevel,
        auditResult.slug,
        hasFixtureOntology,
      ),
      blockedBy: auditResult.blockers.filter((blocker) => !isMetadataBlocker(blocker)),
      expectedBenefit: buildExpectedBenefit(recommendedPatchLevel, auditResult.status),
      affectedAreas: buildAffectedAreas(recommendedPatchLevel),
      testRequirements: buildTestRequirements(recommendedPatchLevel, fullCoverage),
      nextGate: "",
      notes: buildNotes(auditResult, recommendedPatchLevel, contract),
      inputDesignPatchCompleted: false,
    };

    const withGate = {
      ...item,
      nextGate: buildNextGate(item),
    };

    items.push(applyCompletedInputDesignPatchOverlay(withGate));
  }

  const priorityCounts = countByPriority(items);
  const completedInputDesignPatches = listCompletedControlledInputDesignPatchSlugs();
  const planWithoutBatch: BatchMigrationPlan = {
    totalTools: items.length,
    ...priorityCounts,
    items,
    recommendedFirstPatchBatch: [],
    completedInputDesignPatches,
    warnings,
    blockers,
  };

  return {
    ...planWithoutBatch,
    recommendedFirstPatchBatch: selectFirstControlledPatchBatch(planWithoutBatch),
  };
}

export function formatMigrationPlanReport(plan: BatchMigrationPlan): string {
  const lines = [
    "Migration Plan Summary",
    `Total tools: ${plan.totalTools}`,
    `Immediate: ${plan.immediate}`,
    `High: ${plan.high}`,
    `Medium: ${plan.medium}`,
    `Low: ${plan.low}`,
    `Defer: ${plan.defer}`,
    "",
    "Recommended first controlled patch batch:",
  ];

  if (plan.recommendedFirstPatchBatch.length === 0) {
    lines.push("- (none — resolve blockers or defer high-risk tools first)");
  } else {
    plan.recommendedFirstPatchBatch.forEach((item, index) => {
      lines.push(
        `${index + 1}. ${item.slug} — ${item.recommendedPatchLevel} / ${item.migrationRiskLevel} risk`,
      );
    });
  }

  if (plan.completedInputDesignPatches.length > 0) {
    lines.push("", "Completed input design patches:");
    for (const slug of plan.completedInputDesignPatches) {
      const item = plan.items.find((entry) => entry.slug === slug);
      lines.push(
        `- ${slug} — nextGate ${item?.nextGate ?? "smart_form_architecture"}`,
      );
    }
  }

  if (plan.warnings.length > 0) {
    lines.push("", "Warnings:");
    for (const warning of plan.warnings.slice(0, 5)) {
      lines.push(`- ${warning}`);
    }
  }

  if (plan.blockers.length > 0) {
    lines.push("", "Blockers:");
    for (const blocker of plan.blockers.slice(0, 5)) {
      lines.push(`- ${blocker}`);
    }
  }

  return lines.join("\n");
}

export function exportBatchMigrationPlan(plan: BatchMigrationPlan): BatchMigrationPlan {
  return plan;
}
