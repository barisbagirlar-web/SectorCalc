// Auto-generated from prime-rib-calculator-schema.json
import * as z from 'zod';

export interface Prime_rib_calculatorInput {
  weight: number;
  minutesPerPound: number;
  baseTime: number;
  restingTime: number;
  dataConfidence?: number;
}

export const Prime_rib_calculatorInputSchema = z.object({
  weight: z.number().default(10),
  minutesPerPound: z.number().default(5),
  baseTime: z.number().default(0),
  restingTime: z.number().default(15),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Prime_rib_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight * input.minutesPerPound + input.baseTime; results["cookingTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cookingTime"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["cookingTime"])) + input.restingTime; results["totalTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalTime"] = Number.NaN; }
  return results;
}


export function calculatePrime_rib_calculator(input: Prime_rib_calculatorInput): Prime_rib_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalTime"]);
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


export interface Prime_rib_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
