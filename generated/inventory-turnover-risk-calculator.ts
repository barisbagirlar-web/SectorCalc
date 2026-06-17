// @ts-nocheck
// Auto-generated from inventory-turnover-risk-calculator-schema.json
import * as z from 'zod';

export interface Inventory_turnover_risk_calculatorInput {
  avg_inventory_value: number;
  cogs_annual: number;
  demand_variability_coefficient: number;
  obsolescence_rate: number;
  carrying_cost_rate: number;
  lead_time_days: number;
  service_level_target: number;
  inventory_accuracy_pct: number;
}

export const Inventory_turnover_risk_calculatorInputSchema = z.object({
  avg_inventory_value: z.number().min(0).max(1000000000).default(1000000),
  cogs_annual: z.number().min(0).max(10000000000).default(5000000),
  demand_variability_coefficient: z.number().min(0).max(2).default(0.3),
  obsolescence_rate: z.number().min(0).max(100).default(5),
  carrying_cost_rate: z.number().min(0).max(100).default(25),
  lead_time_days: z.number().min(1).max(365).default(30),
  service_level_target: z.number().min(50).max(99.99).default(95),
  inventory_accuracy_pct: z.number().min(0).max(100).default(98),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Inventory_turnover_risk_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.avg_inventory_value + input.cogs_annual + input.demand_variability_coefficient; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.avg_inventory_value + input.cogs_annual + input.demand_variability_coefficient; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateInventory_turnover_risk_calculator(input: Inventory_turnover_risk_calculatorInput): Inventory_turnover_risk_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Benchmarking against industry standards","Automated alerting via email"],
  };
}


export interface Inventory_turnover_risk_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
