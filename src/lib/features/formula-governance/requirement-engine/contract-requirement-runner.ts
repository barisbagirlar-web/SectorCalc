/**
 * Contract requirement runner — contract → draft → compile → solve → audit (Phase 5H-B-3).
 */

import { buildOntologyDraftFromFormulaContract } from "@/lib/features/formula-governance/calculation-ontology/contract-ontology-bridge";
import { compileOntologyDraftToCalculationOntology } from "@/lib/features/formula-governance/calculation-ontology/ontology-compiler";
import {
  attachProductionSourceToOntologyDraft,
  buildProductionSourceReference,
  type ProductionSourceReference,
} from "@/lib/features/formula-governance/calculation-ontology/production-source-reference";
import {
  auditFormulaContractInputReadiness,
  type AuditFormulaContractInputReadinessParams,
} from "@/lib/features/formula-governance/requirement-engine/contract-requirement-bridge";
import { buildContractFixtureAlignmentContext } from "@/lib/features/formula-governance/requirement-engine/contract-fixture-alignment";
import { getFixtureOntologyForSlug } from "@/lib/features/formula-governance/calculation-ontology/fixture-ontology-registry";
import { buildInputDesignFromRequirementResult } from "@/lib/features/formula-governance/requirement-engine/input-design-bridge";
import { solveRequiredInputs } from "@/lib/features/formula-governance/requirement-engine/requirement-engine";
import type {
  DerivedResolutionStep,
  KnownInputs,
  RequirementSolveResult,
  RequirementSolveStatus,
} from "@/lib/features/formula-governance/requirement-engine/requirement-engine-types";
import type { ToolInputDesign } from "@/lib/features/formula-governance/requirement-engine/input-design-bridge";
import type { InputReadinessAudit } from "@/lib/features/formula-governance/requirement-engine/contract-requirement-bridge";
import type { FormulaContract } from "@/lib/features/formula-governance/types";

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

function buildReadinessAuditParams(
  contract: FormulaContract,
  ontologyDraft: ReturnType<typeof buildOntologyDraftFromFormulaContract>,
  requirementResult: RequirementSolveResult,
  compiledOntology: ReturnType<typeof compileOntologyDraftToCalculationOntology>["ontology"],
): Pick<
  AuditFormulaContractInputReadinessParams,
  "aliasMap" | "alignmentPlan" | "contractOnlyAlignment"
> {
  const fixtureOntology = getFixtureOntologyForSlug(contract.slug);
  if (!fixtureOntology) {
    return {
      contractOnlyAlignment: {
        skippedReason: "No professional fixture ontology registered.",
        safeToUseContractOntologyForRequirementEngine: ontologyDraft.blockers.length === 0,
      },
    };
  }

  const alignmentContext = buildContractFixtureAlignmentContext({
    slug: contract.slug,
    ontologyDraft,
    compiledOntology,
    fixtureOntology,
  });
  if (!alignmentContext) {
    return {};
  }

  return {
    aliasMap: alignmentContext.aliasMap,
    alignmentPlan: alignmentContext.alignmentPlan,
  };
}

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
      ...buildReadinessAuditParams(contract, draftWithSource, requirementResult, null),
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
        ...buildReadinessAuditParams(contract, draftWithSource, requirementResult, null),
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
    ...buildReadinessAuditParams(
      contract,
      draftWithSource,
      requirementResult,
      compiled.ontology,
    ),
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
