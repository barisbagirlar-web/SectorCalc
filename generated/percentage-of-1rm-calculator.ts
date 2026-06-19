// Auto-generated from percentage-of-1rm-calculator-schema.json
import * as z from 'zod';

export interface Percentage_of_1rm_calculatorInput {
  oneRepMax: number;
  targetPercentage: number;
  roundingIncrement: number;
  bodyWeight: number;
  dataConfidence?: number;
}

export const Percentage_of_1rm_calculatorInputSchema = z.object({
  oneRepMax: z.number().default(100),
  targetPercentage: z.number().default(90),
  roundingIncrement: z.number().default(2.5),
  bodyWeight: z.number().default(80),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Percentage_of_1rm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.oneRepMax * (input.targetPercentage / 100) * input.roundingIncrement * input.bodyWeight; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.oneRepMax * (input.targetPercentage / 100) * input.roundingIncrement * input.bodyWeight; results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePercentage_of_1rm_calculator(input: Percentage_of_1rm_calculatorInput): Percentage_of_1rm_calculatorOutput {
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


export interface Percentage_of_1rm_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
