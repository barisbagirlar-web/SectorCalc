/**
 * Governance coverage helpers for migration planning (Phase 5H-E).
 */

import type { FormulaContract } from "@/lib/features/formula-governance/types";

export function hasFullGovernanceCoverage(contract: FormulaContract): boolean {
  return (
    contract.oracleRequired &&
    contract.propertyTestsRegistered &&
    contract.scenarioTests.some((test) => test.present)
  );
}

export function isMetadataBlocker(blocker: string): boolean {
  const normalized = blocker.toLowerCase();
  return (
    normalized.includes("production:") ||
    normalized.includes("target output") ||
    normalized.includes("metadata") ||
    normalized.includes("missing production")
  );
}
