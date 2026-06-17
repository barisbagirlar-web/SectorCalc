/**
 * Formula contract registry — no contract, no launch.
 */

import type { FormulaContract } from "@/lib/formula-governance/types";
import { SEVEN_MUDA_WASTE_COST_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/seven-muda-waste-cost-critical";
import { PREMIUM_152_BATCH1_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/premium-152-batch1-critical";
import { CNC_QUOTE_RISK_ANALYZER_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/cnc-quote-risk-analyzer-critical";
import { THREE_D_PRINT_JOB_MARGIN_TOOL_CRITICAL_FORMULA_CONTRACTS } from "@/lib/formula-governance/contracts/3d-print-job-margin-tool-critical";

export const FORMULA_CONTRACTS: readonly FormulaContract[] = [
  ...SEVEN_MUDA_WASTE_COST_CRITICAL_FORMULA_CONTRACTS,
  ...PREMIUM_152_BATCH1_CRITICAL_FORMULA_CONTRACTS,
  ...CNC_QUOTE_RISK_ANALYZER_CRITICAL_FORMULA_CONTRACTS,
  ...THREE_D_PRINT_JOB_MARGIN_TOOL_CRITICAL_FORMULA_CONTRACTS,
];

export function getFormulaContractBySlug(slug: string): FormulaContract | undefined {
  const normalized = slug.trim();
  return FORMULA_CONTRACTS.find((contract) => contract.slug === normalized);
}
