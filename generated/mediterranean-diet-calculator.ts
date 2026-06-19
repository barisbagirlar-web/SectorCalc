// Auto-generated from mediterranean-diet-calculator-schema.json
import * as z from 'zod';

export interface Mediterranean_diet_calculatorInput {
  oliveOil: number;
  vegetables: number;
  fruit: number;
  fish: number;
  legumes: number;
  wholeGrains: number;
  dataConfidence?: number;
}

export const Mediterranean_diet_calculatorInputSchema = z.object({
  oliveOil: z.number().default(30),
  vegetables: z.number().default(3),
  fruit: z.number().default(2),
  fish: z.number().default(2),
  legumes: z.number().default(3),
  wholeGrains: z.number().default(3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Mediterranean_diet_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.oliveOil >= 30 ? 1 : 0; results["oliveOilScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["oliveOilScore"] = 0; }
  try { const v = input.vegetables >= 3 ? 1 : 0; results["vegetablesScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["vegetablesScore"] = 0; }
  try { const v = input.fruit >= 2 ? 1 : 0; results["fruitScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fruitScore"] = 0; }
  try { const v = input.fish >= 2 ? 1 : 0; results["fishScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["fishScore"] = 0; }
  try { const v = input.legumes >= 3 ? 1 : 0; results["legumesScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["legumesScore"] = 0; }
  try { const v = input.wholeGrains >= 3 ? 1 : 0; results["wholeGrainScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["wholeGrainScore"] = 0; }
  try { const v = (input.oliveOil >= 30 ? 1 : 0) + (input.vegetables >= 3 ? 1 : 0) + (input.fruit >= 2 ? 1 : 0) + (input.fish >= 2 ? 1 : 0) + (input.legumes >= 3 ? 1 : 0) + (input.wholeGrains >= 3 ? 1 : 0); results["dietScore"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dietScore"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMediterranean_diet_calculator(input: Mediterranean_diet_calculatorInput): Mediterranean_diet_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["dietScore"]);
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


export interface Mediterranean_diet_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
