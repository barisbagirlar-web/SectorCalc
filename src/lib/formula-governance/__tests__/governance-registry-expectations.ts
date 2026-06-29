/**
 * Shared registry-derived expectations for formula-governance test recovery.
 * Avoid hard-coded contract counts that drift when validation modules are added.
 */
import { runGovernanceAudit } from "@/lib/formula-governance/audit-runner";
import { FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts";
import {
  PREMIUM_SCHEMA_CLASSIFICATION,
  summarizePremiumSchemaClassification,
} from "@/lib/formula-governance/premium-schema-governance/premium-schema-classification";
import { buildFormulaInventory, summarizeInventory } from "@/lib/formula-governance/inventory";
import { runAllFinanceOracleComparisonAudits } from "@/lib/formula-governance/oracle/compare-production-oracle";
import {
  ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS,
} from "@/lib/formula-governance/input-design-audit/controlled-input-patch/controlled-input-design-registry";

/** Current FormulaContract registry size (dynamic). */
export const REGISTRY_CONTRACT_COUNT = FORMULA_CONTRACTS.length;

export function inventorySummary() {
  return summarizeInventory(buildFormulaInventory());
}

export function premiumSchemaSummary() {
  return summarizePremiumSchemaClassification();
}

export function premiumSchemaCount() {
  return PREMIUM_SCHEMA_CLASSIFICATION.length;
}

export function wiredOracleComparisonCount() {
  return runAllFinanceOracleComparisonAudits().length;
}

export function controlledPatchReadyCount() {
  return ALL_CONTROLLED_INPUT_DESIGN_PATCH_SLUGS.length;
}

export function expectedNeedsInputDesignPatchCount() {
  return REGISTRY_CONTRACT_COUNT - controlledPatchReadyCount();
}

export function totalContractsLabel() {
  return `Total contracts: ${REGISTRY_CONTRACT_COUNT}`;
}

export function totalToolsLabel() {
  return `Total tools: ${REGISTRY_CONTRACT_COUNT}`;
}

/** Current governance FAIL count for expanded registry (validation batch adds FAIL entries). */
export function governanceFailCount(): number {
  return runGovernanceAudit({ strict: false }).results.filter((entry) => entry.status === "FAIL")
    .length;
}
