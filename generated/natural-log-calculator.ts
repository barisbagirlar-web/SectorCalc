// Auto-generated from natural-log-calculator-schema.json
import * as z from 'zod';

export interface Natural_log_calculatorInput {
  inputValue: number;
  precision: number;
  scaleFactor: number;
  offset: number;
  expDisplay: number;
}

export const Natural_log_calculatorInputSchema = z.object({
  inputValue: z.number().default(2.71828),
  precision: z.number().default(4),
  scaleFactor: z.number().default(0.434294),
  offset: z.number().default(0),
  expDisplay: z.number().default(0),
});

function evaluateAllFormulas(input: Natural_log_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.log(input.inputValue); results["rawNaturalLog"] = Number.isFinite(v) ? v : 0; } catch { results["rawNaturalLog"] = 0; }
  try { const v = (results["rawNaturalLog"] ?? 0) * input.scaleFactor + input.offset; results["scaledValue"] = Number.isFinite(v) ? v : 0; } catch { results["scaledValue"] = 0; }
  try { const v = Math.exp(input.inputValue); results["exponentialValue"] = Number.isFinite(v) ? v : 0; } catch { results["exponentialValue"] = 0; }
  try { const v = Number((input.expDisplay === 1 ? Math.exp(input.inputValue) : (Math.log(input.inputValue) * input.scaleFactor + input.offset)).toFixed(input.precision)); results["naturalLogValue"] = Number.isFinite(v) ? v : 0; } catch { results["naturalLogValue"] = 0; }
  return results;
}


export function calculateNatural_log_calculator(input: Natural_log_calculatorInput): Natural_log_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["naturalLogValue"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Natural_log_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
