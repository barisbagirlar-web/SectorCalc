// Auto-generated from exponential-calculator-schema.json
import * as z from 'zod';

export interface Exponential_calculatorInput {
  initialValue: number;
  rateConstant: number;
  time: number;
  decimalPlaces: number;
}

export const Exponential_calculatorInputSchema = z.object({
  initialValue: z.number().default(1),
  rateConstant: z.number().default(0.1),
  time: z.number().default(1),
  decimalPlaces: z.number().default(4),
});

function evaluateAllFormulas(input: Exponential_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.rateConstant * input.time; results["exponent"] = Number.isFinite(v) ? v : 0; } catch { results["exponent"] = 0; }
  try { const v = Math.exp(input.rateConstant * input.time); results["expFactor"] = Number.isFinite(v) ? v : 0; } catch { results["expFactor"] = 0; }
  try { const v = Math.round(input.initialValue * Math.exp(input.rateConstant * input.time) * Math.pow(10, input.decimalPlaces)) / Math.pow(10, input.decimalPlaces); results["finalValue"] = Number.isFinite(v) ? v : 0; } catch { results["finalValue"] = 0; }
  return results;
}


export function calculateExponential_calculator(input: Exponential_calculatorInput): Exponential_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["finalValue"] ?? 0;
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


export interface Exponential_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
