/**
 * Batch alignment audit - read-only drift summary across FormulaContracts (Phase 5H-B-6).
 */

import { buildOntologyDraftFromFormulaContract } from "@/lib/features/formula-governance/calculation-ontology/contract-ontology-bridge";
import { getFixtureOntologyForSlug } from "@/lib/features/formula-governance/calculation-ontology/fixture-ontology-registry";
import type { CalculationOntology } from "@/lib/features/formula-governance/calculation-ontology/ontology-types";
import { compareContractOntologyWithFixture } from "@/lib/features/formula-governance/requirement-engine/contract-fixture-drift";
import {
  buildContractFixtureAlignmentContext,
  resolveContractOntologyForAlignment,
} from "@/lib/features/formula-governance/requirement-engine/contract-fixture-alignment";
import type { OntologyAlignmentPlan } from "@/lib/features/formula-governance/calculation-ontology/ontology-alignment-plan";
import type { OntologyAliasMap } from "@/lib/features/formula-governance/calculation-ontology/ontology-alias-types";
import {
  evaluateDriftScoreGate,
  type DriftScoreGateResult,
} from "@/lib/features/formula-governance/requirement-engine/drift-score-gate";
import type { FormulaContract } from "@/lib/features/formula-governance/types";

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
  readonly skippedReason?: string;
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
          "No professional fixture ontology registered - contract-only metadata analysis only.",
        skippedReason: "No professional fixture ontology registered.",
      });
      if (draft.blockers.length > 0) {
        warnings.push(
          `Contract "${contract.slug}" has ${draft.blockers.length} metadata blocker(s) without fixture comparison.`,
        );
      }
      continue;
    }

    const alignmentContext = buildContractFixtureAlignmentContext({
      slug: contract.slug,
      ontologyDraft: draft,
      compiledOntology: resolveContractOntologyForAlignment(draft),
      fixtureOntology,
    });
    if (!alignmentContext) {
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
        skippedReason: "Ontology draft could not be materialized for alignment audit.",
      });
      continue;
    }

    evaluatedContracts += 1;

    const { aliasMap, alignmentPlan, contractOntology } = alignmentContext;
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
      warnings.push(`Contract "${contract.slug}" missing Production metadata - flagged in alignment plan.`);
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

function formatTopFindingLine(summary: BatchAlignmentSummary): string {
  if (summary.status === "needs_review" || summary.status === "low_risk") {
    return `- ${summary.slug}: ${summary.status}, risk ${summary.migrationRiskScore}, safeForRequirementEngine ${summary.safeToUseContractOntologyForRequirementEngine}`;
  }
  if (summary.status === "blocked") {
    const productionHint = summary.blockerCount > 0 ? "missing Production assumption line" : summary.recommendedAction;
    return `- ${summary.slug}: blocked, ${productionHint}`;
  }
  if (summary.status === "contract_only_analysis") {
    return `- ${summary.slug}: contract_only_analysis, skippedReason ${summary.skippedReason ?? "no fixture"}`;
  }
  return `- ${summary.slug}: ${summary.status}`;
}

export function formatBatchAlignmentAuditReport(result: BatchAlignmentAuditResult): string {
  const lines = [
    "Alignment Audit Summary",
    `Total contracts: ${result.totalContracts}`,
    `Evaluated: ${result.evaluatedContracts}`,
    `Low risk: ${result.lowRisk}`,
    `Needs review: ${result.needsReview}`,
    `Blocked: ${result.blocked}`,
    `Skipped / contract-only: ${result.skipped}`,
    "",
    "Top findings:",
  ];

  const prioritySlugs = ["roofing-contract-margin-guard", "cnc-quote-risk-analyzer"];
  const topSummaries = prioritySlugs
    .map((slug) => result.summaries.find((summary) => summary.slug === slug))
    .filter((summary): summary is BatchAlignmentSummary => summary !== undefined);

  for (const summary of topSummaries) {
    lines.push(formatTopFindingLine(summary));
  }

  const additionalFindings = result.summaries.filter(
    (summary) =>
      !prioritySlugs.includes(summary.slug) &&
      (summary.status === "blocked" || summary.status === "needs_review"),
  );
  for (const summary of additionalFindings.slice(0, 3)) {
    lines.push(formatTopFindingLine(summary));
  }

  return lines.join("\n");
}

export function exportBatchAlignmentAuditResult(
  result: BatchAlignmentAuditResult,
): BatchAlignmentAuditResult {
  return result;
}
