// Auto-generated from wind-turbine-roi-calculator-schema.json
import * as z from 'zod';

export interface Wind_turbine_roi_calculatorInput {
  turbine_capacity: number;
  capacity_factor: number;
  capital_cost_per_mw: number;
  opex_per_mwh: number;
  electricity_price: number;
  discount_rate: number;
  project_lifetime: number;
  degradation_rate: number;
  dataConfidence?: number;
}

export const Wind_turbine_roi_calculatorInputSchema = z.object({
  turbine_capacity: z.number().min(0.5).max(15).default(2),
  capacity_factor: z.number().min(10).max(60).default(35),
  capital_cost_per_mw: z.number().min(800000).max(2500000).default(1300000),
  opex_per_mwh: z.number().min(5).max(30).default(12),
  electricity_price: z.number().min(20).max(150).default(50),
  discount_rate: z.number().min(3).max(20).default(8),
  project_lifetime: z.number().min(10).max(30).default(20),
  degradation_rate: z.number().min(0).max(2).default(0.5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Wind_turbine_roi_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.project_lifetime * input.capital_cost_per_mw; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.project_lifetime * input.capital_cost_per_mw * (1 + (input.capacity_factor / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.project_lifetime * input.capital_cost_per_mw * (1 + (input.capacity_factor / 100)) * (input.turbine_capacity); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.turbine_capacity; results["factor_turbine_capacity"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_turbine_capacity"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateWind_turbine_roi_calculator(input: Wind_turbine_roi_calculatorInput): Wind_turbine_roi_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Scrap and rework not in unit price","Volume discount not applied"];
  const suggestedActions: string[] = ["Reconcile unit cost with last PO","Stress-test with +10% waste"];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? totalWasteCost * (input.dataConfidence / 100)
      : totalWasteCost;
  return {
    totalWasteCost,
    breakdown,
    hiddenLossDrivers,
    suggestedActions,
    dataConfidenceAdjusted,
    premiumRequired: true,
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Scenario comparison","Sensitivity analysis"],
  };
}


export interface Wind_turbine_roi_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
