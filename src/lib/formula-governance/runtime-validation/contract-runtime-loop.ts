/**
 * Contract-mode calculation intelligence loop (Phase 5H-B-4).
 * Orchestrates contract → ontology → requirement → validation without production execution.
 */

import { buildOntologyDraftFromFormulaContract } from "@/lib/formula-governance/calculation-ontology/contract-ontology-bridge";
import { compileOntologyDraftToCalculationOntology } from "@/lib/formula-governance/calculation-ontology/ontology-compiler";
import {
  attachProductionSourceToOntologyDraft,
  buildProductionSourceReference,
  type ProductionSourceReference,
} from "@/lib/formula-governance/calculation-ontology/production-source-reference";
import { getFormulaById } from "@/lib/formula-governance/calculation-ontology/formula-graph";
import { auditFormulaContractInputReadiness } from "@/lib/formula-governance/requirement-engine/contract-requirement-bridge";
import { solveRequiredInputs } from "@/lib/formula-governance/requirement-engine/requirement-engine";
import type {
  DerivedResolutionStep,
  KnownInputs,
  RequirementSolveStatus,
} from "@/lib/formula-governance/requirement-engine/requirement-engine-types";
import type { InputReadinessAudit } from "@/lib/formula-governance/requirement-engine/contract-requirement-bridge";
import type { OntologyPipelineStatus } from "@/lib/formula-governance/requirement-engine/contract-requirement-runner";
import { mapContractLoopStatus } from "@/lib/formula-governance/runtime-validation/contract-loop-status";
import type {
  CalculationValues,
  ValidationResult,
} from "@/lib/formula-governance/runtime-validation/invariant-types";
import { validateCalculationInputsAndResult } from "@/lib/formula-governance/runtime-validation/validation-loop";
import type { FormulaContract } from "@/lib/formula-governance/types";

export type ContractLoopStatus =
  | "NEED_DATA"
  | "READY_TO_CALCULATE"
  | "SUCCESS"
  | "PHYSICS_OR_LOGIC_ERROR"
  | "BLOCKED";

export type ContractCalculationIntelligenceLoopResult = {
  readonly slug: string;
  readonly status: ContractLoopStatus;
  readonly ontologyStatus: OntologyPipelineStatus;
  readonly requirementStatus: RequirementSolveStatus | "skipped";
  readonly requiredMissingInputs: readonly string[];
  readonly defaultedInputs: readonly string[];
  readonly acceptedAssumptions: readonly string[];
  readonly derivedResolutionPlan: readonly DerivedResolutionStep[];
  readonly readinessAudit: InputReadinessAudit;
  readonly validationResult?: ValidationResult;
  readonly productionSource?: ProductionSourceReference;
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};

export type RunContractCalculationIntelligenceLoopParams = {
  readonly contract: FormulaContract;
  readonly knownInputs: KnownInputs;
  readonly calculatedResult?: CalculationValues;
  readonly productionSource?: ProductionSourceReference;
};

function blockedReadinessAudit(
  contract: FormulaContract,
  draftWithSource: ReturnType<typeof attachProductionSourceToOntologyDraft>,
  blockers: readonly string[],
): InputReadinessAudit {
  return auditFormulaContractInputReadiness({
    contract,
    ontologyDraft: draftWithSource,
    requirementResult: {
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
    },
  });
}

export function runContractCalculationIntelligenceLoop(
  params: RunContractCalculationIntelligenceLoopParams,
): ContractCalculationIntelligenceLoopResult {
  const { contract, knownInputs, calculatedResult, productionSource } = params;
  const warnings: string[] = [];
  const blockers: string[] = [];

  const draft = buildOntologyDraftFromFormulaContract(contract);
  warnings.push(...draft.warnings);
  blockers.push(...draft.blockers);

  const source = productionSource ?? buildProductionSourceReference(contract.slug);
  const draftWithSource = attachProductionSourceToOntologyDraft(draft, source);
  warnings.push(...draftWithSource.warnings);
  blockers.push(...draftWithSource.blockers);

  const compiled = compileOntologyDraftToCalculationOntology(draftWithSource);
  warnings.push(...compiled.warnings);
  blockers.push(...compiled.blockers);

  if (!compiled.ontology || compiled.blockers.length > 0) {
    const readinessAudit = blockedReadinessAudit(contract, draftWithSource, blockers);
    return {
      slug: contract.slug,
      status: "BLOCKED",
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
    const readinessAudit = blockedReadinessAudit(contract, draftWithSource, blockers);
    return {
      slug: contract.slug,
      status: "BLOCKED",
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

  const requirementResult = solveRequiredInputs({
    ontology: compiled.ontology,
    goalId,
    knownInputs,
  });

  warnings.push(...requirementResult.warnings);
  blockers.push(...requirementResult.blockers);

  const readinessAudit = auditFormulaContractInputReadiness({
    contract,
    ontologyDraft: draftWithSource,
    requirementResult,
  });

  let validationResult: ValidationResult | undefined;
  const hasCalculatedResult = calculatedResult !== undefined;
  const pipelineBlockers = [...blockers];

  if (
    hasCalculatedResult &&
    requirementResult.status === "ready_to_calculate" &&
    pipelineBlockers.length === 0
  ) {
    const formulaNodeId =
      requirementResult.selectedFormulaPath[requirementResult.selectedFormulaPath.length - 1];
    const formulaNode = formulaNodeId
      ? getFormulaById(compiled.ontology, formulaNodeId)
      : undefined;

    if (!formulaNode) {
      pipelineBlockers.push(`Formula node "${formulaNodeId ?? "unknown"}" not found for validation.`);
    } else {
      validationResult = validateCalculationInputsAndResult({
        ontology: compiled.ontology,
        formulaNode,
        inputs: knownInputs,
        result: calculatedResult,
      });
      warnings.push(...validationResult.warnings);
    }
  }

  const status = mapContractLoopStatus({
    requirementResult,
    validationResult,
    blockers: pipelineBlockers,
    hasCalculatedResult,
  });

  const resultBlockers = [
    ...pipelineBlockers,
    ...(validationResult && !validationResult.isValid ? validationResult.errors : []),
  ];

  return {
    slug: contract.slug,
    status,
    ontologyStatus: "compiled",
    requirementStatus: requirementResult.status,
    requiredMissingInputs: requirementResult.requiredMissingInputs,
    defaultedInputs: requirementResult.defaultedInputs,
    acceptedAssumptions: requirementResult.acceptedAssumptions,
    derivedResolutionPlan: requirementResult.derivedResolutionPlan,
    readinessAudit,
    validationResult,
    productionSource: source,
    warnings,
    blockers: resultBlockers,
  };
}
