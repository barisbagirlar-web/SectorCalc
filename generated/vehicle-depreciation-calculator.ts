// Auto-generated from vehicle-depreciation-calculator-schema.json
import * as z from 'zod';

export interface Vehicle_depreciation_calculatorInput {
  purchase_price: number;
  residual_value: number;
  holding_period_years: number;
  annual_mileage: number;
  depreciation_method: string;
  maintenance_cost_per_year: number;
  fuel_efficiency_mpg: number;
  fuel_price_per_gallon: number;
  dataConfidence?: number;
}

export const Vehicle_depreciation_calculatorInputSchema = z.object({
  purchase_price: z.number().min(1000).max(500000).default(30000),
  residual_value: z.number().min(0).max(500000).default(12000),
  holding_period_years: z.number().min(1).max(20).default(5),
  annual_mileage: z.number().min(0).max(100000).default(12000),
  depreciation_method: z.enum(['straight_line', 'declining_balance', 'sum_of_years_digits']).default('straight_line'),
  maintenance_cost_per_year: z.number().min(0).max(50000).default(800),
  fuel_efficiency_mpg: z.number().min(5).max(100).default(25),
  fuel_price_per_gallon: z.number().min(0.5).max(10).default(3.5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Vehicle_depreciation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.holding_period_years * input.purchase_price; results["base_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["base_cost"] = 0; }
  try { const v = input.holding_period_years * input.purchase_price * (1 + (input.fuel_efficiency_mpg / 100)); results["adjusted_cost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjusted_cost"] = 0; }
  try { const v = input.holding_period_years * input.purchase_price * (1 + (input.fuel_efficiency_mpg / 100)) * (input.residual_value); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.residual_value; results["factor_residual_value"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["factor_residual_value"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateVehicle_depreciation_calculator(input: Vehicle_depreciation_calculatorInput): Vehicle_depreciation_calculatorOutput {
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
    premiumFeatures: ["PDF export","CSV export","Trend analysis","Multi-scenario comparison","API integration"],
  };
}


export interface Vehicle_depreciation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
