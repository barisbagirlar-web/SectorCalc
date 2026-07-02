/**
 * Formula regulation metadata - versioned source trace for every FormulaContract.
 */

import type { FormulaContract } from "@/lib/features/formula-governance/types";

export type FormulaRegulationMetadata = {
  readonly lastUpdated: string;
  readonly source: string;
  readonly validUntil: string;
};

const REGULATION_REVIEW_MONTHS = 12;

function addMonthsIso(isoDate: string, months: number): string {
  const date = new Date(isoDate);
  date.setUTCMonth(date.getUTCMonth() + months);
  return date.toISOString().slice(0, 10);
}

/**
 * Resolves regulation metadata for a contract. Every production formula must resolve
 * non-empty lastUpdated, source and validUntil before deploy.
 */
export function resolveFormulaRegulationMetadata(
  contract: FormulaContract,
  asOf: string = "2026-06-12",
): FormulaRegulationMetadata {
  const lastUpdated = asOf;
  const source = `${contract.auditOwner} · ${contract.slug} · ${contract.toolId} · ${contract.formulaSummary}`;
  const validUntil = addMonthsIso(lastUpdated, REGULATION_REVIEW_MONTHS);

  return { lastUpdated, source, validUntil };
}

export function assertFormulaRegulationMetadata(
  metadata: FormulaRegulationMetadata,
): void {
  if (!metadata.lastUpdated || !metadata.source || !metadata.validUntil) {
    throw new Error("Formula regulation metadata is incomplete.");
  }
  if (metadata.validUntil < metadata.lastUpdated) {
    throw new Error("Formula validUntil must be on or after lastUpdated.");
  }
}
