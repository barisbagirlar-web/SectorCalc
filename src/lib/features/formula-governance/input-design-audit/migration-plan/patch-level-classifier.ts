/**
 * Migration patch level classifier — Phase 5H-E read-only planning.
 */

import type { ToolInputDesignAuditResult } from "@/lib/features/formula-governance/input-design-audit/input-design-audit-types";
import type { BatchAlignmentSummary } from "@/lib/features/formula-governance/requirement-engine/batch-alignment-audit";
import { isMetadataBlocker } from "@/lib/features/formula-governance/input-design-audit/migration-plan/governance-coverage";
import type { MigrationPatchLevel } from "@/lib/features/formula-governance/input-design-audit/migration-plan/migration-plan-types";

export type ClassifyPatchLevelParams = {
  readonly auditResult: ToolInputDesignAuditResult;
  readonly hasFixtureOntology: boolean;
  readonly hasFullGovernanceCoverage: boolean;
  readonly alignmentSummary?: BatchAlignmentSummary;
};

function hasMetadataBlockers(auditResult: ToolInputDesignAuditResult): boolean {
  return auditResult.blockers.some(isMetadataBlocker);
}

function hasReportTrustTraceGaps(
  auditResult: ToolInputDesignAuditResult,
  alignmentSummary?: BatchAlignmentSummary,
): boolean {
  return (
    auditResult.validationGaps.length > 0 ||
    auditResult.dimensionGaps.length > 0 ||
    auditResult.defaultAssumptionGaps.length > 0 ||
    (alignmentSummary?.manualReviewCount ?? 0) > 0 ||
    alignmentSummary?.status === "needs_review"
  );
}

function needsSmartFormPatch(auditResult: ToolInputDesignAuditResult): boolean {
  return (
    auditResult.status === "professional_ready" &&
    !auditResult.canPatchWithoutUIBreak &&
    auditResult.missingAdvancedInputs.length > 0
  );
}

export function classifyPatchLevel(params: ClassifyPatchLevelParams): MigrationPatchLevel {
  const { auditResult, hasFixtureOntology, hasFullGovernanceCoverage, alignmentSummary } = params;

  if (auditResult.status === "blocked" || auditResult.blockers.length > 0) {
    if (hasMetadataBlockers(auditResult)) {
      return "metadata_only";
    }
    return "blocked";
  }

  if (!hasFixtureOntology && auditResult.alignmentStatus === "contract_only_analysis") {
    const readyForInputDesign =
      auditResult.status === "professional_ready" &&
      hasFullGovernanceCoverage &&
      auditResult.blockers.length === 0;
    if (!readyForInputDesign) {
      return "fixture_ontology";
    }
  }

  if (hasMetadataBlockers(auditResult)) {
    return "metadata_only";
  }

  if (
    auditResult.missingRequiredInputs.length > 0 ||
    auditResult.missingRiskDrivers.length > 0 ||
    auditResult.derivedInputMisuse.length > 0
  ) {
    return "controlled_input_patch";
  }

  if (hasReportTrustTraceGaps(auditResult, alignmentSummary)) {
    return "report_trace_patch";
  }

  if (needsSmartFormPatch(auditResult)) {
    return "smart_form_patch";
  }

  if (
    auditResult.status === "professional_ready" &&
    auditResult.inputSufficiencyScore >= 85 &&
    hasFullGovernanceCoverage
  ) {
    return "input_design_only";
  }

  if (auditResult.status === "usable" && auditResult.inputSufficiencyScore >= 70) {
    return auditResult.canPatchWithoutUIBreak ? "input_design_only" : "controlled_input_patch";
  }

  if (auditResult.status === "shallow" || auditResult.status === "unsafe") {
    return "controlled_input_patch";
  }

  return "none";
}
