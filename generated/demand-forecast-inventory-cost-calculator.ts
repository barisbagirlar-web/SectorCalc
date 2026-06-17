// @ts-nocheck
// Auto-generated from demand-forecast-inventory-cost-calculator-schema.json
import * as z from 'zod';

export interface Demand_forecast_inventory_cost_calculatorInput {
  historical_demand_mean: number;
  demand_std_dev: number;
  lead_time_days: number;
  service_level: string;
  unit_cost: number;
  holding_cost_rate: number;
  ordering_cost: number;
  stockout_cost_per_unit: number;
}

export const Demand_forecast_inventory_cost_calculatorInputSchema = z.object({
  historical_demand_mean: z.number().min(0).max(1000000).default(1000),
  demand_std_dev: z.number().min(0).max(500000).default(200),
  lead_time_days: z.number().min(1).max(365).default(14),
  service_level: z.enum(['0.9', '0.95', '0.975', '0.99']).default('0.95'),
  unit_cost: z.number().min(0.01).max(100000).default(50),
  holding_cost_rate: z.number().min(0).max(100).default(25),
  ordering_cost: z.number().min(0).max(10000).default(150),
  stockout_cost_per_unit: z.number().min(0).max(100000).default(200),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Demand_forecast_inventory_cost_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.historical_demand_mean + input.demand_std_dev + input.lead_time_days; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.historical_demand_mean + input.demand_std_dev + input.lead_time_days; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDemand_forecast_inventory_cost_calculator(input: Demand_forecast_inventory_cost_calculatorInput): Demand_forecast_inventory_cost_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","Automated replenishment triggers"],
  };
}


export interface Demand_forecast_inventory_cost_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
