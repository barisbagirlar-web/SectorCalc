// Auto-generated from trimmed-mean-calculator-schema.json
import * as z from 'zod';

export interface Trimmed_mean_calculatorInput {
  value1: number;
  value2: number;
  value3: number;
  value4: number;
  value5: number;
  trimPercent: number;
  dataConfidence?: number;
}

export const Trimmed_mean_calculatorInputSchema = z.object({
  value1: z.number().default(10),
  value2: z.number().default(20),
  value3: z.number().default(30),
  value4: z.number().default(40),
  value5: z.number().default(50),
  trimPercent: z.number().default(20),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Trimmed_mean_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.value1 * input.value2 * input.value3 * input.value4; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.value1 * input.value2 * input.value3 * input.value4 * (input.value5 * (input.trimPercent / 100)); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.value5 * (input.trimPercent / 100); results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTrimmed_mean_calculator(input: Trimmed_mean_calculatorInput): Trimmed_mean_calculatorOutput {
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


export interface Trimmed_mean_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
