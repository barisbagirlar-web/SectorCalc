// Auto-generated from linear-progression-calculator-schema.json
import * as z from 'zod';

export interface Linear_progression_calculatorInput {
  firstTerm: number;
  commonDifference: number;
  numberOfTerms: number;
  termPosition: number;
  decimals: number;
  dataConfidence?: number;
}

export const Linear_progression_calculatorInputSchema = z.object({
  firstTerm: z.number().default(0),
  commonDifference: z.number().default(0),
  numberOfTerms: z.number().default(1),
  termPosition: z.number().default(1),
  decimals: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Linear_progression_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.firstTerm * input.commonDifference * input.numberOfTerms * input.termPosition; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.firstTerm * input.commonDifference * input.numberOfTerms * input.termPosition * (input.decimals); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.decimals; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateLinear_progression_calculator(input: Linear_progression_calculatorInput): Linear_progression_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["result"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = ["Model uses normalized input chain — validate units","Assumption-heavy without site benchmark"];
  const suggestedActions: string[] = ["Cross-check with historical actuals","Run sensitivity on top 2 inputs"];
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


export interface Linear_progression_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
