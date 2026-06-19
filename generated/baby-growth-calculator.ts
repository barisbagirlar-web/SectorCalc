// Auto-generated from baby-growth-calculator-schema.json
import * as z from 'zod';

export interface Baby_growth_calculatorInput {
  birthWeight: number;
  currentWeight: number;
  ageMonths: number;
  length: number;
  headCircumference: number;
  gender: number;
  dataConfidence?: number;
}

export const Baby_growth_calculatorInputSchema = z.object({
  birthWeight: z.number().default(3.5),
  currentWeight: z.number().default(5),
  ageMonths: z.number().default(2),
  length: z.number().default(50),
  headCircumference: z.number().default(35),
  gender: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Baby_growth_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.birthWeight * input.currentWeight * input.ageMonths * input.length; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.birthWeight * input.currentWeight * input.ageMonths * input.length * (input.headCircumference * input.gender); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.headCircumference * input.gender; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBaby_growth_calculator(input: Baby_growth_calculatorInput): Baby_growth_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Baby_growth_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
