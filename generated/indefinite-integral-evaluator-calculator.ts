// Auto-generated from indefinite-integral-evaluator-calculator-schema.json
import * as z from 'zod';

export interface Indefinite_integral_evaluator_calculatorInput {
  a5: number;
  a4: number;
  a3: number;
  a2: number;
  a1: number;
  a0: number;
  x: number;
  C: number;
  dataConfidence?: number;
}

export const Indefinite_integral_evaluator_calculatorInputSchema = z.object({
  a5: z.number().default(0),
  a4: z.number().default(0),
  a3: z.number().default(0),
  a2: z.number().default(0),
  a1: z.number().default(0),
  a0: z.number().default(0),
  x: z.number().default(0),
  C: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Indefinite_integral_evaluator_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.a5 * input.a4 * input.a3 * input.a2; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.a5 * input.a4 * input.a3 * input.a2 * (input.a1 * input.a0 * input.x * input.C); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.a1 * input.a0 * input.x * input.C; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateIndefinite_integral_evaluator_calculator(input: Indefinite_integral_evaluator_calculatorInput): Indefinite_integral_evaluator_calculatorOutput {
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


export interface Indefinite_integral_evaluator_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
