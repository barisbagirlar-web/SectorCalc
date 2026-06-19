// Auto-generated from margin-of-error-calculator-schema.json
import * as z from 'zod';

export interface Margin_of_error_calculatorInput {
  sample_size: number;
  confidence_level: number;
  z_score: number;
  sample_proportion: number;
  dataConfidence?: number;
}

export const Margin_of_error_calculatorInputSchema = z.object({
  sample_size: z.number().default(100),
  confidence_level: z.number().default(95),
  z_score: z.number().default(1.96),
  sample_proportion: z.number().default(0.5),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Margin_of_error_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.sample_size * (input.confidence_level / 100) * input.z_score * input.sample_proportion; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.sample_size * (input.confidence_level / 100) * input.z_score * input.sample_proportion; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateMargin_of_error_calculator(input: Margin_of_error_calculatorInput): Margin_of_error_calculatorOutput {
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


export interface Margin_of_error_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
