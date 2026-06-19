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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Vegetarian_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyMeatConsumption * (input.vegetarianDaysPerWeek / 7) * 365; results["meat_reduction"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["meat_reduction"] = 0; }
  try { const v = (asFormulaNumber(results["meat_reduction"])) * input.beefRatio; results["beef_reduction"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["beef_reduction"] = 0; }
  try { const v = (asFormulaNumber(results["meat_reduction"])) * input.porkRatio; results["pork_reduction"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pork_reduction"] = 0; }
  try { const v = (asFormulaNumber(results["meat_reduction"])) * input.poultryRatio; results["poultry_reduction"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["poultry_reduction"] = 0; }
  try { const v = (asFormulaNumber(results["beef_reduction"])) * 27 + (asFormulaNumber(results["pork_reduction"])) * 12 + (asFormulaNumber(results["poultry_reduction"])) * 7; results["co2_saved"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["co2_saved"] = 0; }
  try { const v = (asFormulaNumber(results["beef_reduction"])) * 15415 + (asFormulaNumber(results["pork_reduction"])) * 6000 + (asFormulaNumber(results["poultry_reduction"])) * 4300; results["water_saved"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["water_saved"] = 0; }
  try { const v = (asFormulaNumber(results["beef_reduction"])) * 27 + (asFormulaNumber(results["pork_reduction"])) * 9 + (asFormulaNumber(results["poultry_reduction"])) * 5; results["land_saved"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["land_saved"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateVegetarian_calculator(input: Vegetarian_calculatorInput): Vegetarian_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["co2_saved"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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
