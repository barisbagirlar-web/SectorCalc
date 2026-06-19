// Auto-generated from baby-height-percentile-calculator-schema.json
import * as z from 'zod';

export interface Baby_height_percentile_calculatorInput {
  sex: number;
  ageMonths: number;
  heightCm: number;
  L: number;
  M: number;
  S: number;
  dataConfidence?: number;
}

export const Baby_height_percentile_calculatorInputSchema = z.object({
  sex: z.number().default(0),
  ageMonths: z.number().default(12),
  heightCm: z.number().default(76),
  L: z.number().default(1),
  M: z.number().default(76),
  S: z.number().default(0.04),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Baby_height_percentile_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sex * input.ageMonths * input.heightCm * input.L; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.sex * input.ageMonths * input.heightCm * input.L * (input.M * input.S); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.M * input.S; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBaby_height_percentile_calculator(input: Baby_height_percentile_calculatorInput): Baby_height_percentile_calculatorOutput {
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


export interface Baby_height_percentile_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
