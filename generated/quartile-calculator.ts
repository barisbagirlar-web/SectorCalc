// Auto-generated from quartile-calculator-schema.json
import * as z from 'zod';

export interface Quartile_calculatorInput {
  num1: number;
  num2: number;
  num3: number;
  num4: number;
  num5: number;
  num6: number;
  num7: number;
  num8: number;
  dataConfidence?: number;
}

export const Quartile_calculatorInputSchema = z.object({
  num1: z.number().default(12),
  num2: z.number().default(15),
  num3: z.number().default(18),
  num4: z.number().default(20),
  num5: z.number().default(22),
  num6: z.number().default(25),
  num7: z.number().default(30),
  num8: z.number().default(35),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Quartile_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.num1 * input.num2 * input.num3 * input.num4; results["normalized_product"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["normalized_product"] = Number.NaN; }
  try { const v = input.num1 * input.num2 * input.num3 * input.num4 * (input.num5 * input.num6 * input.num7 * input.num8); results["result"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["result"] = Number.NaN; }
  try { const v = input.num5 * input.num6 * input.num7 * input.num8; results["adjustment_factor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustment_factor"] = Number.NaN; }
  return results;
}


export function calculateQuartile_calculator(input: Quartile_calculatorInput): Quartile_calculatorOutput {
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


export interface Quartile_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
