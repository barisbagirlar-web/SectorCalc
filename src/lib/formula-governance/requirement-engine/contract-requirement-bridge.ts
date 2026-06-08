/**
 * Contract ↔ requirement readiness bridge (Phase 5H-B-2).
 */

import type { OntologyDraft } from "@/lib/formula-governance/calculation-ontology/contract-ontology-bridge";
import type { FormulaContract } from "@/lib/formula-governance/types";
import type { RequirementSolveResult } from "@/lib/formula-governance/requirement-engine/requirement-engine-types";

export type InputReadinessStatus = "input_ready" | "needs_input_design" | "blocked";

export type InputReadinessAudit = {
  readonly slug: string;
  readonly status: InputReadinessStatus;
  readonly missingInputMetadata: readonly string[];
  readonly missingDimensionRules: readonly string[];
  readonly defaultAssumptionGaps: readonly string[];
  readonly derivedInputRisks: readonly string[];
  readonly professionalUpgradeGaps: readonly string[];
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};

export type AuditFormulaContractInputReadinessParams = {
  readonly contract: FormulaContract;
  readonly ontologyDraft: OntologyDraft;
  readonly requirementResult: RequirementSolveResult;
};

function collectDimensionalRuleGaps(contract: FormulaContract, draft: OntologyDraft): string[] {
  const gaps: string[] = [];
  const dimensionalRules = contract.validationRules.filter((rule) => rule.kind === "dimensional");

  for (const rule of dimensionalRules) {
    const matchedVariable = draft.variables.find((variable) =>
      rule.description.toLowerCase().includes(variable.id.toLowerCase()),
    );
    if (!matchedVariable) {
      gaps.push(`Dimensional rule "${rule.id}" has no mapped ontology variable.`);
    } else if (matchedVariable.dimensionInferred && matchedVariable.dimension === "dimensionless") {
      gaps.push(`Dimensional rule "${rule.id}" maps to variable "${matchedVariable.id}" without declared dimension.`);
    }
  }

  return gaps;
}

function collectDefaultAssumptionGaps(
  contract: FormulaContract,
  requirementResult: RequirementSolveResult,
): string[] {
  const gaps: string[] = [];
  const contractAssumptions = new Set([
    ...contract.assumptions,
    ...(contract.warningPolicy?.acceptedAssumptions ?? []),
  ]);

  for (const defaultedInput of requirementResult.defaultedInputs) {
    const hasCoverage = [...contractAssumptions].some((line) =>
      line.toLowerCase().includes(defaultedInput.toLowerCase()),
    );
    if (!hasCoverage) {
      gaps.push(`Defaulted input "${defaultedInput}" has no accepted assumption in contract metadata.`);
    }
  }

  for (const assumption of requirementResult.acceptedAssumptions) {
    const mirrored = [...contractAssumptions].some((line) => line.includes(assumption.slice(0, 20)));
    if (!mirrored && requirementResult.defaultedInputs.length > 0) {
      gaps.push(`Requirement assumption not mirrored in contract: "${assumption}".`);
    }
  }

  return gaps;
}

function collectDerivedInputRisks(
  ontologyDraft: OntologyDraft,
  requirementResult: RequirementSolveResult,
): string[] {
  const derivedIds = new Set(
    ontologyDraft.variables.filter((variable) => variable.role === "derived").map((variable) => variable.id),
  );

  const risks: string[] = [];
  for (const missing of requirementResult.requiredMissingInputs) {
    if (derivedIds.has(missing)) {
      risks.push(`Derived variable "${missing}" incorrectly requested from user.`);
    }
  }

  for (const missing of requirementResult.requiredMissingInputs) {
    const draftVar = ontologyDraft.variables.find((variable) => variable.id === missing);
    if (draftVar?.knowledgeLevel === "system_derived") {
      risks.push(`System-derived variable "${missing}" surfaced as user-required input.`);
    }
  }

  return risks;
}

function collectMissingInputMetadata(
  contract: FormulaContract,
  ontologyDraft: OntologyDraft,
  requirementResult: RequirementSolveResult,
): string[] {
  const metadataGaps: string[] = [];

  for (const missing of requirementResult.requiredMissingInputs) {
    const inContract =
      contract.criticalInputs.includes(missing) || contract.requiredInputs.includes(missing);
    const inDraft = ontologyDraft.variables.some((variable) => variable.id === missing);

    if (!inContract && !inDraft) {
      metadataGaps.push(`Requirement missing input "${missing}" is absent from contract and ontology draft.`);
    } else if (!inContract) {
      metadataGaps.push(`Requirement missing input "${missing}" is not declared in FormulaContract inputs.`);
    } else if (inDraft) {
      const draftVar = ontologyDraft.variables.find((variable) => variable.id === missing);
      if (draftVar?.dimensionInferred && draftVar.dimension === "dimensionless") {
        metadataGaps.push(`Missing input "${missing}" lacks dimension metadata in ontology draft.`);
      }
    }
  }

  return metadataGaps;
}

function collectProfessionalUpgradeGaps(
  contract: FormulaContract,
  requirementResult: RequirementSolveResult,
): string[] {
  const contractInputs = new Set([...contract.requiredInputs, ...contract.criticalInputs]);
  return requirementResult.advancedRecommendedInputs
    .filter((variableId) => !contractInputs.has(variableId))
    .map((variableId) => `Professional upgrade input "${variableId}" is not in contract input list.`);
}

export function auditFormulaContractInputReadiness(
  params: AuditFormulaContractInputReadinessParams,
): InputReadinessAudit {
  const { contract, ontologyDraft, requirementResult } = params;
  const warnings: string[] = [...ontologyDraft.warnings, ...requirementResult.warnings];
  const blockers: string[] = [
    ...ontologyDraft.blockers,
    ...requirementResult.blockers,
  ];

  const missingInputMetadata = collectMissingInputMetadata(
    contract,
    ontologyDraft,
    requirementResult,
  );
  const missingDimensionRules = collectDimensionalRuleGaps(contract, ontologyDraft);
  const defaultAssumptionGaps = collectDefaultAssumptionGaps(contract, requirementResult);
  const derivedInputRisks = collectDerivedInputRisks(ontologyDraft, requirementResult);
  const professionalUpgradeGaps = collectProfessionalUpgradeGaps(contract, requirementResult);

  if (derivedInputRisks.length > 0) {
    warnings.push(...derivedInputRisks);
  }

  let status: InputReadinessStatus = "input_ready";

  if (blockers.length > 0 || requirementResult.status === "blocked") {
    status = "blocked";
  } else if (
    requirementResult.status === "need_more_data" ||
    missingInputMetadata.length > 0 ||
    missingDimensionRules.length > 0 ||
    defaultAssumptionGaps.length > 0 ||
    professionalUpgradeGaps.length > 0
  ) {
    status = "needs_input_design";
  }

  if (requirementResult.status === "ready_to_calculate" && missingInputMetadata.length === 0 && blockers.length === 0) {
    status = "input_ready";
  }

  return {
    slug: contract.slug,
    status,
    missingInputMetadata,
    missingDimensionRules,
    defaultAssumptionGaps,
    derivedInputRisks,
    professionalUpgradeGaps,
    warnings,
    blockers,
  };
}
