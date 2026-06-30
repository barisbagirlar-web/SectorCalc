/**
 * Batch input design audit — read-only summary across FormulaContracts (Phase 5H-C).
 */

import type { CalculationOntology } from "@/lib/formula-governance/calculation-ontology/ontology-types";
import { getFixtureOntologyForSlug } from "@/lib/formula-governance/calculation-ontology/fixture-ontology-registry";
import type {
  BatchInputDesignAuditResult,
  ToolInputDesignAuditResult,
  ToolInputDesignAuditStatus,
} from "@/lib/formula-governance/input-design-audit/input-design-audit-types";
import { auditExistingToolInputDesign } from "@/lib/formula-governance/input-design-audit/existing-tool-input-audit-runner";
import type { FormulaContract } from "@/lib/formula-governance/types";

export type RunBatchInputDesignAuditParams = {
  readonly contracts: readonly FormulaContract[];
  readonly fixtureRegistry?: Readonly<Record<string, CalculationOntology>>;
};

function incrementStatusCount(
  counts: Record<ToolInputDesignAuditStatus, number>,
  status: ToolInputDesignAuditStatus,
): void {
  counts[status] += 1;
}

function formatTopRiskLine(summary: ToolInputDesignAuditResult): string {
  if (summary.alignmentStatus === "contract_only_analysis") {
    return `- ${summary.slug}: contract_only_analysis, metadata blockers ${summary.blockers.length}`;
  }
  if (summary.status === "blocked") {
    const productionHint = summary.blockers.some((blocker) => blocker.includes("Production:"))
      ? "missing Production assumption line"
      : summary.blockers[0] ?? "blocked";
    return `- ${summary.slug}: blocked, ${productionHint}`;
  }
  if (summary.alignmentStatus === "needs_review") {
    return `- ${summary.slug}: usable/needs_review, migration risk ${summary.migrationRiskScore}`;
  }
  return `- ${summary.slug}: ${summary.status}, sufficiency ${summary.inputSufficiencyScore}, depth ${summary.professionalDepthScore}`;
}

function buildRecommendedNextBatch(summaries: readonly ToolInputDesignAuditResult[]): string[] {
  const priorityOrder: Record<ToolInputDesignAuditStatus, number> = {
    blocked: 0,
    unsafe: 1,
    shallow: 2,
    usable: 3,
    professional_ready: 4,
  };

  return [...summaries]
    .sort((left, right) => {
      const statusDiff = priorityOrder[left.status] - priorityOrder[right.status];
      if (statusDiff !== 0) {
        return statusDiff;
      }
      return right.migrationRiskScore - left.migrationRiskScore;
    })
    .slice(0, 8)
    .map((summary) => summary.slug);
}

function buildTopRisks(summaries: readonly ToolInputDesignAuditResult[]): string[] {
  const prioritySlugs = ["cnc-quote-risk-analyzer", "roofing-contract-margin-guard", "rent-vs-buy-calculator"];
  const lines: string[] = [];

  for (const slug of prioritySlugs) {
    const summary = summaries.find((entry) => entry.slug === slug);
    if (summary) {
      lines.push(formatTopRiskLine(summary));
    }
  }

  const additional = summaries
    .filter(
      (summary) =>
        !prioritySlugs.includes(summary.slug) &&
        (summary.status === "blocked" || summary.status === "unsafe" || summary.status === "shallow"),
    )
    .slice(0, 3);

  for (const summary of additional) {
    lines.push(formatTopRiskLine(summary));
  }

  return lines;
}

export function runBatchInputDesignAudit(
  params: RunBatchInputDesignAuditParams,
): BatchInputDesignAuditResult {
  const { contracts, fixtureRegistry } = params;
  const summaries: ToolInputDesignAuditResult[] = [];
  const warnings: string[] = [];
  const blockers: string[] = [];

  const statusCounts: Record<ToolInputDesignAuditStatus, number> = {
    professional_ready: 0,
    usable: 0,
    shallow: 0,
    unsafe: 0,
    blocked: 0,
  };

  let evaluatedContracts = 0;
  let contractOnlyAnalysis = 0;

  for (const contract of contracts) {
    const fixtureOntology =
      fixtureRegistry?.[contract.slug] ?? getFixtureOntologyForSlug(contract.slug);
    const hasFixture = fixtureOntology !== undefined;

    if (hasFixture) {
      evaluatedContracts += 1;
    } else {
      contractOnlyAnalysis += 1;
    }

    const result = auditExistingToolInputDesign({
      contract,
      fixtureOntology,
    });

    summaries.push(result);
    incrementStatusCount(statusCounts, result.status);

    if (result.blockers.length > 0) {
      blockers.push(`Input design audit blocked for "${result.slug}": ${result.blockers[0]}`);
    }
    if (result.warnings.length > 0 && result.status !== "professional_ready") {
      warnings.push(`Input design warning for "${result.slug}": ${result.warnings[0]}`);
    }
  }

  return {
    totalContracts: contracts.length,
    evaluatedContracts,
    professionalReady: statusCounts.professional_ready,
    usable: statusCounts.usable,
    shallow: statusCounts.shallow,
    unsafe: statusCounts.unsafe,
    blocked: statusCounts.blocked,
    contractOnlyAnalysis,
    summaries,
    topRisks: buildTopRisks(summaries),
    recommendedNextBatch: buildRecommendedNextBatch(summaries),
    warnings,
    blockers,
  };
}

export function formatBatchInputDesignAuditReport(result: BatchInputDesignAuditResult): string {
  const lines = [
    "Input Design Audit Summary",
    `Total contracts: ${result.totalContracts}`,
    `Professional ready: ${result.professionalReady}`,
    `Usable: ${result.usable}`,
    `Shallow: ${result.shallow}`,
    `Unsafe: ${result.unsafe}`,
    `Blocked: ${result.blocked}`,
    `Contract-only analysis: ${result.contractOnlyAnalysis}`,
    "",
    "Top risks:",
    ...result.topRisks,
  ];

  return lines.join("\n");
}

export function exportBatchInputDesignAuditResult(
  result: BatchInputDesignAuditResult,
): BatchInputDesignAuditResult {
  return result;
}
