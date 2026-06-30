/**
 * FormulaContract coverage gap analysis (Phase 2).
 */

import type { FormulaInventoryEntry, RiskLevel } from "@/lib/features/formula-governance/types";

export type ContractGapEntry = {
  readonly toolId: string;
  readonly slug: string;
  readonly name: string;
  readonly tier: FormulaInventoryEntry["tier"];
  readonly suggestedRiskLevel: RiskLevel;
  readonly riskFlags: readonly string[];
  readonly missingCriticalContractReason?: string;
};

export type FormulaContractGapReport = {
  readonly generatedAt: string;
  readonly criticalWithoutContract: readonly ContractGapEntry[];
  readonly highWithoutContract: readonly ContractGapEntry[];
  readonly purposeFormulaMismatchRisk: readonly ContractGapEntry[];
  readonly missingParameterRisk: readonly ContractGapEntry[];
  readonly timePeriodAmbiguityRisk: readonly ContractGapEntry[];
  readonly percentUnitAmbiguityRisk: readonly ContractGapEntry[];
  readonly decisionLanguageRisk: readonly ContractGapEntry[];
  readonly premiumWithoutGovernance: readonly ContractGapEntry[];
  readonly launchBlockers: readonly string[];
};

function toGapEntry(entry: FormulaInventoryEntry): ContractGapEntry {
  return {
    toolId: entry.toolId,
    slug: entry.slug,
    name: entry.name,
    tier: entry.tier,
    suggestedRiskLevel: entry.suggestedRiskLevel,
    riskFlags: entry.riskFlags,
    missingCriticalContractReason: entry.missingCriticalContractReason,
  };
}

function filterByFlag(
  entries: readonly FormulaInventoryEntry[],
  flag: string,
): ContractGapEntry[] {
  return entries.filter((entry) => entry.riskFlags.includes(flag)).map(toGapEntry);
}

function uniqueBySlug(entries: readonly ContractGapEntry[]): ContractGapEntry[] {
  const seen = new Set<string>();
  const result: ContractGapEntry[] = [];
  for (const entry of entries) {
    if (seen.has(entry.slug)) {
      continue;
    }
    seen.add(entry.slug);
    result.push(entry);
  }
  return result;
}

export function buildContractGapReport(
  entries: readonly FormulaInventoryEntry[],
): FormulaContractGapReport {
  const criticalWithoutContract = entries
    .filter((e) => !e.hasContract && e.suggestedRiskLevel === "critical")
    .map(toGapEntry);

  const highWithoutContract = entries
    .filter((e) => !e.hasContract && e.suggestedRiskLevel === "high")
    .map(toGapEntry);

  const premiumWithoutGovernance = entries
    .filter(
      (e) =>
        !e.hasContract &&
        (e.tier === "premium" || e.tier === "premium-schema") &&
        e.isPaidFlowLinked,
    )
    .map(toGapEntry);

  const launchBlockers = uniqueBySlug(criticalWithoutContract).map((e) => e.slug);

  return {
    generatedAt: new Date().toISOString(),
    criticalWithoutContract: uniqueBySlug(criticalWithoutContract),
    highWithoutContract: uniqueBySlug(highWithoutContract),
    purposeFormulaMismatchRisk: uniqueBySlug(filterByFlag(entries, "purpose_formula_mismatch_risk")),
    missingParameterRisk: uniqueBySlug(filterByFlag(entries, "missing_parameter_risk")),
    timePeriodAmbiguityRisk: uniqueBySlug(filterByFlag(entries, "time_period_ambiguity")),
    percentUnitAmbiguityRisk: uniqueBySlug(filterByFlag(entries, "percent_unit_ambiguity")),
    decisionLanguageRisk: uniqueBySlug(filterByFlag(entries, "decision_language_risk")),
    premiumWithoutGovernance: uniqueBySlug(premiumWithoutGovernance),
    launchBlockers,
  };
}

export function buildAuditPriorities(
  entries: readonly FormulaInventoryEntry[],
  limit = 20,
): FormulaInventoryEntry[] {
  const order: Record<RiskLevel, number> = { critical: 0, high: 1, medium: 2, low: 3 };

  return [...entries]
    .filter((entry) => !entry.hasContract)
    .sort((a, b) => {
      const riskDiff = order[a.suggestedRiskLevel] - order[b.suggestedRiskLevel];
      if (riskDiff !== 0) {
        return riskDiff;
      }
      if (a.isPaidFlowLinked !== b.isPaidFlowLinked) {
        return a.isPaidFlowLinked ? -1 : 1;
      }
      return a.slug.localeCompare(b.slug);
    })
    .slice(0, limit);
}
