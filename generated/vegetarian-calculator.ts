// Auto-generated from vegetarian-calculator-schema.json
import * as z from 'zod';

export interface Vegetarian_calculatorInput {
  dailyMeatConsumption: number;
  vegetarianDaysPerWeek: number;
  beefRatio: number;
  porkRatio: number;
  poultryRatio: number;
  dataConfidence?: number;
}

export const Vegetarian_calculatorInputSchema = z.object({
  dailyMeatConsumption: z.number().default(200),
  vegetarianDaysPerWeek: z.number().default(3),
  beefRatio: z.number().default(0.3),
  porkRatio: z.number().default(0.3),
  poultryRatio: z.number().default(0.4),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vegetarian_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyMeatConsumption * (input.vegetarianDaysPerWeek / 7) * 365; results["meat_reduction"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["meat_reduction"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["meat_reduction"])) * input.beefRatio; results["beef_reduction"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["beef_reduction"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["meat_reduction"])) * input.porkRatio; results["pork_reduction"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["pork_reduction"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["meat_reduction"])) * input.poultryRatio; results["poultry_reduction"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["poultry_reduction"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["beef_reduction"])) * 27 + (toNumericFormulaValue(results["pork_reduction"])) * 12 + (toNumericFormulaValue(results["poultry_reduction"])) * 7; results["co2_saved"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["co2_saved"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["beef_reduction"])) * 15415 + (toNumericFormulaValue(results["pork_reduction"])) * 6000 + (toNumericFormulaValue(results["poultry_reduction"])) * 4300; results["water_saved"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["water_saved"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["beef_reduction"])) * 27 + (toNumericFormulaValue(results["pork_reduction"])) * 9 + (toNumericFormulaValue(results["poultry_reduction"])) * 5; results["land_saved"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["land_saved"] = Number.NaN; }
  return results;
}


export function calculateVegetarian_calculator(input: Vegetarian_calculatorInput): Vegetarian_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["co2_saved"]);
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


export interface Vegetarian_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
