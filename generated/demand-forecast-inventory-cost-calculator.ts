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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Demand_forecast_inventory_cost_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.historical_demand_mean * input.unit_cost; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.historical_demand_mean * input.unit_cost * (1 + (input.holding_cost_rate / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.historical_demand_mean * input.unit_cost * (1 + (input.holding_cost_rate / 100)) * (input.demand_std_dev); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.demand_std_dev; results["factor_demand_std_dev"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_demand_std_dev"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDemand_forecast_inventory_cost_calculator(input: Demand_forecast_inventory_cost_calculatorInput): Demand_forecast_inventory_cost_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
