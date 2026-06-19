// Auto-generated from reaction-quotient-calculator-schema.json
import * as z from 'zod';

export interface Reaction_quotient_calculatorInput {
  concA: number;
  coeffA: number;
  concB: number;
  coeffB: number;
  concC: number;
  coeffC: number;
  concD: number;
  coeffD: number;
  dataConfidence?: number;
}

export const Reaction_quotient_calculatorInputSchema = z.object({
  concA: z.number().default(1),
  coeffA: z.number().default(1),
  concB: z.number().default(1),
  coeffB: z.number().default(1),
  concC: z.number().default(1),
  coeffC: z.number().default(1),
  concD: z.number().default(1),
  coeffD: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Reaction_quotient_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.concA * input.coeffA * input.concB * input.coeffB; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["normalized_product"] = 0; }
  try { const v = input.concA * input.coeffA * input.concB * input.coeffB * (input.concC * input.coeffC * input.concD * input.coeffD); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.concC * input.coeffC * input.concD * input.coeffD; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustment_factor"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateReaction_quotient_calculator(input: Reaction_quotient_calculatorInput): Reaction_quotient_calculatorOutput {
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


export interface Reaction_quotient_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
