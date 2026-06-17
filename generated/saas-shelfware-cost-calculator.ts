// @ts-nocheck
// Auto-generated from saas-shelfware-cost-calculator-schema.json
import * as z from 'zod';

export interface Saas_shelfware_cost_calculatorInput {
  total_licenses: number;
  active_users: number;
  license_cost_per_month: number;
  implementation_cost: number;
  monthly_support_cost: number;
  contract_months_remaining: number;
  utilization_threshold: number;
}

export const Saas_shelfware_cost_calculatorInputSchema = z.object({
  total_licenses: z.number().min(1).max(100000).default(100),
  active_users: z.number().min(0).max(100000).default(60),
  license_cost_per_month: z.number().min(0).max(10000).default(50),
  implementation_cost: z.number().min(0).max(500000).default(5000),
  monthly_support_cost: z.number().min(0).max(50000).default(2000),
  contract_months_remaining: z.number().min(1).max(60).default(12),
  utilization_threshold: z.number().min(0).max(100).default(80),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Saas_shelfware_cost_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.total_licenses + input.active_users + input.license_cost_per_month; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.total_licenses + input.active_users + input.license_cost_per_month; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateSaas_shelfware_cost_calculator(input: Saas_shelfware_cost_calculatorInput): Saas_shelfware_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-department roll-up","Automated alerting via email"],
  };
}


export interface Saas_shelfware_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
