// Auto-generated from catan-probability-calculator-schema.json
import * as z from 'zod';

export interface Catan_probability_calculatorInput {
  diceCount: number;
  diceSides: number;
  targetSum: number;
  settlementCount: number;
  rolls: number;
  dataConfidence?: number;
}

export const Catan_probability_calculatorInputSchema = z.object({
  diceCount: z.number().default(2),
  diceSides: z.number().default(6),
  targetSum: z.number().default(7),
  settlementCount: z.number().default(1),
  rolls: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Catan_probability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.diceCount * input.diceSides * input.targetSum * input.settlementCount; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.diceCount * input.diceSides * input.targetSum * input.settlementCount * (input.rolls); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.rolls; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateCatan_probability_calculator(input: Catan_probability_calculatorInput): Catan_probability_calculatorOutput {
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


export interface Catan_probability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
