// Auto-generated from kilocalories-to-joules-calculator-schema.json
import * as z from 'zod';

export interface Kilocalories_to_joules_calculatorInput {
  kcal: number;
  precision: number;
  joulePerKcal: number;
  scale: number;
}

export const Kilocalories_to_joules_calculatorInputSchema = z.object({
  kcal: z.number().default(100),
  precision: z.number().default(2),
  joulePerKcal: z.number().default(4184),
  scale: z.number().default(1),
});

function evaluateAllFormulas(input: Kilocalories_to_joules_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.round(input.kcal * input.joulePerKcal * input.scale * 10**input.precision) / 10**input.precision; results["joules"] = Number.isFinite(v) ? v : 0; } catch { results["joules"] = 0; }
  try { const v = input.kcal * input.joulePerKcal * input.scale; results["rawJoules"] = Number.isFinite(v) ? v : 0; } catch { results["rawJoules"] = 0; }
  try { const v = input.joulePerKcal; results["conversionFactorUsed"] = Number.isFinite(v) ? v : 0; } catch { results["conversionFactorUsed"] = 0; }
  return results;
}


export function calculateKilocalories_to_joules_calculator(input: Kilocalories_to_joules_calculatorInput): Kilocalories_to_joules_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["joules"] ?? 0;
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


export interface Kilocalories_to_joules_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
