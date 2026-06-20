// Auto-generated from ham-calculator-schema.json
import * as z from 'zod';

export interface Ham_calculatorInput {
  raw_material_cost: number;
  processing_time: number;
  labor_cost_per_hour: number;
  energy_cost_per_kwh: number;
  energy_consumption_per_kg: number;
  yield_percentage: number;
  packaging_cost_per_kg: number;
  overhead_percentage: number;
  dataConfidence?: number;
}

export const Ham_calculatorInputSchema = z.object({
  raw_material_cost: z.number().default(5),
  processing_time: z.number().default(0.5),
  labor_cost_per_hour: z.number().default(20),
  energy_cost_per_kwh: z.number().default(0.15),
  energy_consumption_per_kg: z.number().default(2),
  yield_percentage: z.number().default(85),
  packaging_cost_per_kg: z.number().default(0.5),
  overhead_percentage: z.number().default(10),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ham_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.raw_material_cost + (input.processing_time * input.labor_cost_per_hour) + (input.energy_consumption_per_kg * input.energy_cost_per_kwh) + input.packaging_cost_per_kg; results["total_direct_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_direct_cost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["total_direct_cost"])) / (input.yield_percentage / 100); results["adjusted_cost_for_yield"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjusted_cost_for_yield"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["adjusted_cost_for_yield"])) * (input.overhead_percentage / 100); results["overhead_cost"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["overhead_cost"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["adjusted_cost_for_yield"])) + (toNumericFormulaValue(results["overhead_cost"])); results["total_cost_per_kg"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["total_cost_per_kg"] = Number.NaN; }
  return results;
}


export function calculateHam_calculator(input: Ham_calculatorInput): Ham_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["total_direct_cost"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
    premiumRequired: false,
    premiumFeatures: [],
  };
}


export interface Ham_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
