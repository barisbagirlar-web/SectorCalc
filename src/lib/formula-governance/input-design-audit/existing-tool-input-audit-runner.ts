/**
 * Existing tool input design audit runner — read-only contract audit (Phase 5H-C).
 */

import type { CalculationOntology } from "@/lib/formula-governance/calculation-ontology/ontology-types";
import { getFixtureOntologyForSlug } from "@/lib/formula-governance/calculation-ontology/fixture-ontology-registry";
import type {
  RecommendedPatchLevel,
  ToolInputDesignAuditResult,
  ToolInputDesignAuditStatus,
} from "@/lib/formula-governance/input-design-audit/input-design-audit-types";
import { scoreInputSufficiency } from "@/lib/formula-governance/input-design-audit/input-sufficiency-scorer";
import { scoreProfessionalDepth } from "@/lib/formula-governance/input-design-audit/professional-depth-scorer";
import { runRequirementEngineForContract } from "@/lib/formula-governance/requirement-engine/contract-requirement-runner";
import type { FormulaContract } from "@/lib/formula-governance/types";

export type AuditExistingToolInputDesignParams = {
  readonly contract: FormulaContract;
  readonly fixtureOntology?: CalculationOntology;
};

function resolveRecommendedPatchLevel(
  status: ToolInputDesignAuditStatus,
  sufficiencyScore: number,
  blockers: readonly string[],
  alignmentBlocked: boolean,
): RecommendedPatchLevel {
  if (status === "blocked" || blockers.length > 0) {
    return "blocked";
  }
  if (sufficiencyScore >= 85 && !alignmentBlocked) {
    return "none";
  }
  if (sufficiencyScore >= 70) {
    return "metadata_only";
  }
  if (sufficiencyScore >= 50) {
    return "minor_input_patch";
  }
  return "major_input_redesign";
}

function resolveAuditStatus(
  blockers: readonly string[],
  inputSufficiencyScore: number,
  professionalDepthScore: number,
  alignmentBlocked: boolean,
): ToolInputDesignAuditStatus {
  if (blockers.length > 0 || alignmentBlocked) {
    return "blocked";
  }
  if (inputSufficiencyScore < 50) {
    return "unsafe";
  }
  if (inputSufficiencyScore < 70) {
    return "shallow";
  }
  if (inputSufficiencyScore < 85) {
    return "usable";
  }
  if (professionalDepthScore >= 80) {
    return "professional_ready";
  }
  return "usable";
}

function buildNextAction(
  status: ToolInputDesignAuditStatus,
  patchLevel: RecommendedPatchLevel,
  slug: string,
  alignmentStatus?: string,
): string {
  if (status === "blocked") {
    return `Resolve blockers for "${slug}" before input design migration${alignmentStatus ? ` (alignment: ${alignmentStatus})` : ""}.`;
  }
  if (status === "professional_ready") {
    return `Input design for "${slug}" is professional-ready — monitor alignment drift only.`;
  }
  if (patchLevel === "metadata_only") {
    return `Patch contract metadata for "${slug}" — no UI break expected.`;
  }
  if (patchLevel === "minor_input_patch") {
    return `Add missing risk/cost drivers or advanced inputs for "${slug}".`;
  }
  return `Major input redesign review required for "${slug}".`;
}

export function auditExistingToolInputDesign(
  params: AuditExistingToolInputDesignParams,
): ToolInputDesignAuditResult {
  const { contract } = params;
  const fixtureOntology = params.fixtureOntology ?? getFixtureOntologyForSlug(contract.slug);

  const requirementRun = runRequirementEngineForContract({
    contract,
    knownInputs: {},
  });

  const { readinessAudit, inputDesign } = requirementRun;
  const alignmentSummary = readinessAudit.alignmentSummary;

  const sufficiency = scoreInputSufficiency({
    requirementResult: {
      status: requirementRun.requirementStatus === "skipped" ? "blocked" : requirementRun.requirementStatus,
      requiredMissingInputs: requirementRun.requiredMissingInputs,
      optionalRecommendedInputs: inputDesign?.optionalFields.map((field) => field.variableId) ?? [],
      advancedRecommendedInputs: inputDesign?.advancedFields.map((field) => field.variableId) ?? [],
      defaultedInputs: requirementRun.defaultedInputs,
      acceptedAssumptions: requirementRun.acceptedAssumptions,
      derivedResolutionPlan: requirementRun.derivedResolutionPlan,
      selectedFormulaPath: [],
      blockers: requirementRun.blockers,
      warnings: requirementRun.warnings,
    },
    readinessAudit,
    alignmentSummary,
    contract,
  });

  const depth = scoreProfessionalDepth({
    contract,
    inputDesign,
    alignmentSummary,
  });

  const blockers = [...new Set([...sufficiency.blockers, ...requirementRun.blockers])];
  const warnings = [
    ...new Set([...sufficiency.warnings, ...depth.warnings, ...requirementRun.warnings]),
  ];

  if (!fixtureOntology) {
    warnings.push(
      `Contract "${contract.slug}" audited without professional fixture — contract-only analysis.`,
    );
  }

  const status = resolveAuditStatus(
    blockers,
    sufficiency.score,
    depth.score,
    sufficiency.alignmentBlocked,
  );

  const recommendedPatchLevel = resolveRecommendedPatchLevel(
    status,
    sufficiency.score,
    blockers,
    sufficiency.alignmentBlocked,
  );

  const canPatchWithoutUIBreak =
    recommendedPatchLevel === "none" || recommendedPatchLevel === "metadata_only";

  return {
    slug: contract.slug,
    status,
    inputSufficiencyScore: sufficiency.score,
    professionalDepthScore: depth.score,
    missingRequiredInputs: sufficiency.missingRequiredInputs,
    missingRiskDrivers: sufficiency.missingRiskDrivers,
    missingAdvancedInputs: sufficiency.missingAdvancedInputs,
    derivedInputMisuse: sufficiency.derivedInputMisuse,
    defaultAssumptionGaps: sufficiency.defaultAssumptionGaps,
    validationGaps: sufficiency.validationGaps,
    dimensionGaps: sufficiency.dimensionGaps,
    alignmentStatus: alignmentSummary?.alignmentStatus,
    migrationRiskScore: alignmentSummary?.migrationRisk ?? 0,
    recommendedPatchLevel,
    canPatchWithoutUIBreak,
    nextAction: buildNextAction(
      status,
      recommendedPatchLevel,
      contract.slug,
      alignmentSummary?.alignmentStatus,
    ),
    warnings,
    blockers,
  };
}
