// Auto-generated from baby-growth-percentile-calculator-schema.json
import * as z from 'zod';

export interface Baby_growth_percentile_calculatorInput {
  measurement: number;
  L: number;
  M: number;
  S: number;
  measurementType: number;
  dataConfidence?: number;
}

export const Baby_growth_percentile_calculatorInputSchema = z.object({
  measurement: z.number().default(5),
  L: z.number().default(1),
  M: z.number().default(7),
  S: z.number().default(0.1),
  measurementType: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Baby_growth_percentile_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.measurement * input.L * input.M * input.S; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.measurement * input.L * input.M * input.S * (input.measurementType); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.measurementType; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateBaby_growth_percentile_calculator(input: Baby_growth_percentile_calculatorInput): Baby_growth_percentile_calculatorOutput {
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


export interface Baby_growth_percentile_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
