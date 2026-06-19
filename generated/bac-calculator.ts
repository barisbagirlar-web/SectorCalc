// Auto-generated from bac-calculator-schema.json
import * as z from 'zod';

export interface Bac_calculatorInput {
  gender: number;
  weight: number;
  drinks: number;
  hours: number;
  alcoholPercentage: number;
  volumePerDrink: number;
  dataConfidence?: number;
}

export const Bac_calculatorInputSchema = z.object({
  gender: z.number().default(0),
  weight: z.number().default(70),
  drinks: z.number().default(2),
  hours: z.number().default(1),
  alcoholPercentage: z.number().default(5),
  volumePerDrink: z.number().default(355),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Bac_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.drinks * input.volumePerDrink * (input.alcoholPercentage / 100) * 0.789; results["totalAlcoholGrams"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalAlcoholGrams"] = 0; }
  try { const v = input.gender === 0 ? 0.68 : 0.55; results["bodyWaterConstant"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bodyWaterConstant"] = 0; }
  try { const v = (asFormulaNumber(results["totalAlcoholGrams"])) / (input.weight * (asFormulaNumber(results["bodyWaterConstant"])) * 10); results["bacRaw"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bacRaw"] = 0; }
  try { const v = input.hours * 0.015; results["bacMetabolized"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bacMetabolized"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBac_calculator(input: Bac_calculatorInput): Bac_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["bacMetabolized"]);
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


export interface Bac_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
