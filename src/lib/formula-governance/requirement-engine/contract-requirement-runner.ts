/**
 * Contract requirement runner — contract → draft → compile → solve → audit (Phase 5H-B-3).
 */

import { buildOntologyDraftFromFormulaContract } from "@/lib/formula-governance/calculation-ontology/contract-ontology-bridge";
import { compileOntologyDraftToCalculationOntology } from "@/lib/formula-governance/calculation-ontology/ontology-compiler";
import {
  attachProductionSourceToOntologyDraft,
  buildProductionSourceReference,
  type ProductionSourceReference,
} from "@/lib/formula-governance/calculation-ontology/production-source-reference";
import { auditFormulaContractInputReadiness } from "@/lib/formula-governance/requirement-engine/contract-requirement-bridge";
import { buildInputDesignFromRequirementResult } from "@/lib/formula-governance/requirement-engine/input-design-bridge";
import { solveRequiredInputs } from "@/lib/formula-governance/requirement-engine/requirement-engine";
import type {
  DerivedResolutionStep,
  KnownInputs,
  RequirementSolveResult,
  RequirementSolveStatus,
} from "@/lib/formula-governance/requirement-engine/requirement-engine-types";
import type { ToolInputDesign } from "@/lib/formula-governance/requirement-engine/input-design-bridge";
import type { InputReadinessAudit } from "@/lib/formula-governance/requirement-engine/contract-requirement-bridge";
import type { FormulaContract } from "@/lib/formula-governance/types";

export type OntologyPipelineStatus = "compiled" | "blocked";

export type ContractRequirementRunResult = {
  readonly slug: string;
  readonly ontologyStatus: OntologyPipelineStatus;
  readonly requirementStatus: RequirementSolveStatus | "skipped";
  readonly requiredMissingInputs: readonly string[];
  readonly defaultedInputs: readonly string[];
  readonly acceptedAssumptions: readonly string[];
  readonly derivedResolutionPlan: readonly DerivedResolutionStep[];
  readonly readinessAudit: InputReadinessAudit;
  readonly inputDesign?: ToolInputDesign;
  readonly productionSource?: ProductionSourceReference;
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};

export type RunRequirementEngineForContractParams = {
  readonly contract: FormulaContract;
  readonly knownInputs: KnownInputs;
  readonly productionSource?: ProductionSourceReference;
};

function blockedRequirementResult(blockers: readonly string[]): RequirementSolveResult {
  return {
    status: "blocked",
    requiredMissingInputs: [],
    optionalRecommendedInputs: [],
    advancedRecommendedInputs: [],
    defaultedInputs: [],
    acceptedAssumptions: [],
    derivedResolutionPlan: [],
    selectedFormulaPath: [],
    blockers: [...blockers],
    warnings: [],
  };
}

export function runRequirementEngineForContract(
  params: RunRequirementEngineForContractParams,
): ContractRequirementRunResult {
  const { contract, knownInputs, productionSource } = params;
  const warnings: string[] = [];
  const blockers: string[] = [];

  const draft = buildOntologyDraftFromFormulaContract(contract);
  warnings.push(...draft.warnings);
  blockers.push(...draft.blockers);

  const source =
    productionSource ?? buildProductionSourceReference(contract.slug);
  const draftWithSource = attachProductionSourceToOntologyDraft(draft, source);
  warnings.push(...draftWithSource.warnings);
  blockers.push(...draftWithSource.blockers);

  const compiled = compileOntologyDraftToCalculationOntology(draftWithSource);
  warnings.push(...compiled.warnings);
  blockers.push(...compiled.blockers);

  if (!compiled.ontology || compiled.blockers.length > 0) {
    const requirementResult = blockedRequirementResult(compiled.blockers);
    const readinessAudit = auditFormulaContractInputReadiness({
      contract,
      ontologyDraft: draftWithSource,
      requirementResult,
    });

    return {
      slug: contract.slug,
      ontologyStatus: "blocked",
      requirementStatus: "skipped",
      requiredMissingInputs: [],
      defaultedInputs: [],
      acceptedAssumptions: [],
      derivedResolutionPlan: [],
      readinessAudit,
      productionSource: source,
      warnings,
      blockers,
    };
  }

  const goalId = draft.goals[0]?.id;
  if (!goalId) {
    blockers.push(`Contract "${contract.slug}" has no ontology goal.`);
    const requirementResult = blockedRequirementResult(blockers);
    return {
      slug: contract.slug,
      ontologyStatus: "blocked",
      requirementStatus: "skipped",
      requiredMissingInputs: [],
      defaultedInputs: [],
      acceptedAssumptions: [],
      derivedResolutionPlan: [],
      readinessAudit: auditFormulaContractInputReadiness({
        contract,
        ontologyDraft: draftWithSource,
        requirementResult,
      }),
      productionSource: source,
      warnings,
      blockers,
    };
  }

  const requirementResult = solveRequiredInputs({
    ontology: compiled.ontology,
    goalId,
    knownInputs,
  });

  const readinessAudit = auditFormulaContractInputReadiness({
    contract,
    ontologyDraft: draftWithSource,
    requirementResult,
  });

  const inputDesign = buildInputDesignFromRequirementResult(requirementResult, compiled.ontology, {
    contract,
  });

  return {
    slug: contract.slug,
    ontologyStatus: "compiled",
    requirementStatus: requirementResult.status,
    requiredMissingInputs: requirementResult.requiredMissingInputs,
    defaultedInputs: requirementResult.defaultedInputs,
    acceptedAssumptions: requirementResult.acceptedAssumptions,
    derivedResolutionPlan: requirementResult.derivedResolutionPlan,
    readinessAudit,
    inputDesign,
    productionSource: source,
    warnings: [...warnings, ...requirementResult.warnings],
    blockers: [...blockers, ...requirementResult.blockers],
  };
}
