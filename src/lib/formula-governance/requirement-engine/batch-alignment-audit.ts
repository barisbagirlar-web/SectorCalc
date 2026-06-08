/**
 * Batch alignment audit — read-only drift summary across FormulaContracts (Phase 5H-B-6).
 */

import type { OntologyDraft } from "@/lib/formula-governance/calculation-ontology/contract-ontology-bridge";
import { buildOntologyDraftFromFormulaContract } from "@/lib/formula-governance/calculation-ontology/contract-ontology-bridge";
import { buildOntologyAliasMap } from "@/lib/formula-governance/calculation-ontology/ontology-alias-map";
import { buildOntologyAlignmentPlan } from "@/lib/formula-governance/calculation-ontology/ontology-alignment-plan";
import { createOntology } from "@/lib/formula-governance/calculation-ontology/ontology-builder";
import { compileOntologyDraftToCalculationOntology } from "@/lib/formula-governance/calculation-ontology/ontology-compiler";
import { getFixtureOntologyForSlug } from "@/lib/formula-governance/calculation-ontology/fixture-ontology-registry";
import type { CalculationOntology } from "@/lib/formula-governance/calculation-ontology/ontology-types";
import { compareContractOntologyWithFixture } from "@/lib/formula-governance/requirement-engine/contract-fixture-drift";
import type { OntologyAlignmentPlan } from "@/lib/formula-governance/calculation-ontology/ontology-alignment-plan";
import type { OntologyAliasMap } from "@/lib/formula-governance/calculation-ontology/ontology-alias-types";
import {
  evaluateDriftScoreGate,
  type DriftScoreGateResult,
} from "@/lib/formula-governance/requirement-engine/drift-score-gate";
import type { FormulaContract } from "@/lib/formula-governance/types";

export type BatchAlignmentStatus =
  | "low_risk"
  | "needs_review"
  | "blocked"
  | "skipped"
  | "contract_only_analysis";

export type BatchAlignmentSummary = {
  readonly slug: string;
  readonly status: BatchAlignmentStatus;
  readonly migrationRiskScore: number;
  readonly aliasCount: number;
  readonly manualReviewCount: number;
  readonly blockerCount: number;
  readonly warningCount: number;
  readonly safeToUseContractOntologyForRequirementEngine: boolean;
  readonly recommendedAction: string;
};

export type BatchAlignmentAuditResult = {
  readonly totalContracts: number;
  readonly evaluatedContracts: number;
  readonly lowRisk: number;
  readonly needsReview: number;
  readonly blocked: number;
  readonly skipped: number;
  readonly summaries: readonly BatchAlignmentSummary[];
  readonly warnings: readonly string[];
  readonly blockers: readonly string[];
};

export type RunBatchAlignmentAuditParams = {
  readonly contracts: readonly FormulaContract[];
  readonly fixtureOntologies?: Readonly<Record<string, CalculationOntology>>;
};

function buildContractOntologyFromDraft(draft: OntologyDraft): CalculationOntology {
  return createOntology({
    slug: draft.slug,
    sector: draft.sector,
    defaultAssumptions: draft.assumptions,
    variables: draft.variables.map((variable) => ({
      id: variable.id,
      label: variable.label,
      role: variable.role,
      dimension: variable.dimension,
      unit: variable.unit,
      knowledgeLevel: variable.knowledgeLevel,
      requiredForOutputs: variable.requiredForOutputs,
      constraints: variable.constraints,
      description: variable.description,
      missingRisk: variable.missingRisk,
    })),
    formulas: [],
    goals: draft.goals.map((goal) => ({
      id: goal.id,
      slug: goal.slug,
      targetVariable: goal.targetVariable,
      acceptedFormulaNodes: [],
      decisionGoal: goal.decisionGoal,
      primaryOutput: goal.primaryOutput,
      secondaryOutputs: goal.secondaryOutputs,
    })),
  });
}

function resolveContractOntology(draft: OntologyDraft): CalculationOntology | null {
  const compiled = compileOntologyDraftToCalculationOntology(draft);
  if (compiled.ontology) {
    return compiled.ontology;
  }
  if (draft.variables.length === 0) {
    return null;
  }
  return buildContractOntologyFromDraft(draft);
}

function countManualReviewAliases(aliasMap: OntologyAliasMap): number {
  return aliasMap.aliases.filter((alias) => alias.confidence === "manual_review").length;
}

function resolveBatchStatus(
  driftGate: DriftScoreGateResult,
  alignmentPlan: OntologyAlignmentPlan,
): BatchAlignmentStatus {
  if (driftGate.status === "blocked" || alignmentPlan.alignmentStatus === "blocked") {
    return "blocked";
  }
  if (
    driftGate.status === "needs_review" ||
    alignmentPlan.alignmentStatus === "partially_aligned"
  ) {
    return "needs_review";
  }
  return "low_risk";
}

export function runBatchAlignmentAudit(
  params: RunBatchAlignmentAuditParams,
): BatchAlignmentAuditResult {
  const { contracts, fixtureOntologies } = params;
  const warnings: string[] = [];
  const blockers: string[] = [];
  const summaries: BatchAlignmentSummary[] = [];

  let evaluatedContracts = 0;
  let lowRisk = 0;
  let needsReview = 0;
  let blocked = 0;
  let skipped = 0;

  for (const contract of contracts) {
    const draft = buildOntologyDraftFromFormulaContract(contract);
    const fixtureOntology =
      fixtureOntologies?.[contract.slug] ?? getFixtureOntologyForSlug(contract.slug);

    if (!fixtureOntology) {
      skipped += 1;
      summaries.push({
        slug: contract.slug,
        status: "contract_only_analysis",
        migrationRiskScore: 0,
        aliasCount: 0,
        manualReviewCount: 0,
        blockerCount: draft.blockers.length,
        warningCount: draft.warnings.length,
        safeToUseContractOntologyForRequirementEngine: draft.blockers.length === 0,
        recommendedAction:
          "No professional fixture ontology registered — contract-only metadata analysis only.",
      });
      if (draft.blockers.length > 0) {
        warnings.push(
          `Contract "${contract.slug}" has ${draft.blockers.length} metadata blocker(s) without fixture comparison.`,
        );
      }
      continue;
    }

    const contractOntology = resolveContractOntology(draft);
    if (!contractOntology) {
      skipped += 1;
      summaries.push({
        slug: contract.slug,
        status: "skipped",
        migrationRiskScore: 0,
        aliasCount: 0,
        manualReviewCount: 0,
        blockerCount: draft.blockers.length,
        warningCount: draft.warnings.length,
        safeToUseContractOntologyForRequirementEngine: false,
        recommendedAction: "Ontology draft could not be materialized for alignment audit.",
      });
      continue;
    }

    evaluatedContracts += 1;

    const aliasMap = buildOntologyAliasMap({
      contractOntology,
      fixtureOntology,
      slug: contract.slug,
    });
    const alignmentPlan = buildOntologyAlignmentPlan({
      contractOntology,
      fixtureOntology,
      aliasMap,
    });
    const driftReport = compareContractOntologyWithFixture({
      contractOntology,
      fixtureOntology,
    });
    const driftGate = evaluateDriftScoreGate({
      migrationRiskScore: driftReport.migrationRiskScore,
      blockers: aliasMap.blockers,
      warnings: aliasMap.warnings,
      aliasMap,
    });

    const manualReviewCount = countManualReviewAliases(aliasMap);
    const status = resolveBatchStatus(driftGate, alignmentPlan);

    if (alignmentPlan.blockers.some((blocker) => blocker.includes("Production:"))) {
      warnings.push(`Contract "${contract.slug}" missing Production metadata — flagged in alignment plan.`);
    }

    summaries.push({
      slug: contract.slug,
      status,
      migrationRiskScore: driftReport.migrationRiskScore,
      aliasCount: aliasMap.aliases.length,
      manualReviewCount,
      blockerCount: alignmentPlan.blockers.length,
      warningCount: alignmentPlan.warnings.length + aliasMap.warnings.length,
      safeToUseContractOntologyForRequirementEngine:
        alignmentPlan.safeToUseContractOntologyForRequirementEngine,
      recommendedAction: driftGate.recommendedAction,
    });

    switch (status) {
      case "low_risk":
        lowRisk += 1;
        break;
      case "needs_review":
        needsReview += 1;
        break;
      case "blocked":
        blocked += 1;
        blockers.push(`Batch alignment blocked for "${contract.slug}": ${driftGate.reasons.join(" ")}`);
        break;
      default:
        break;
    }
  }

  return {
    totalContracts: contracts.length,
    evaluatedContracts,
    lowRisk,
    needsReview,
    blocked,
    skipped,
    summaries,
    warnings,
    blockers,
  };
}
