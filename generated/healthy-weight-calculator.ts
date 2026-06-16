// Auto-generated from healthy-weight-calculator-schema.json
import * as z from 'zod';

export interface Healthy_weight_calculatorInput {
  height: number;
  weight: number;
  age: number;
  waist: number;
  hip: number;
}

export const Healthy_weight_calculatorInputSchema = z.object({
  height: z.number().default(170),
  weight: z.number().default(70),
  age: z.number().default(30),
  waist: z.number().default(80),
  hip: z.number().default(100),
});

function evaluateAllFormulas(input: Healthy_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight / ((input.height / 100) ** 2); results["bmi"] = Number.isFinite(v) ? v : 0; } catch { results["bmi"] = 0; }
  try { const v = input.waist / input.height; results["whtr"] = Number.isFinite(v) ? v : 0; } catch { results["whtr"] = 0; }
  try { const v = input.waist / input.hip; results["whr"] = Number.isFinite(v) ? v : 0; } catch { results["whr"] = 0; }
  try { const v = 18.5 * ((input.height / 100) ** 2); results["ideal_min"] = Number.isFinite(v) ? v : 0; } catch { results["ideal_min"] = 0; }
  try { const v = 24.9 * ((input.height / 100) ** 2); results["ideal_max"] = Number.isFinite(v) ? v : 0; } catch { results["ideal_max"] = 0; }
  return results;
}


export function calculateHealthy_weight_calculator(input: Healthy_weight_calculatorInput): Healthy_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["bmi"] ?? 0;
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


export interface Healthy_weight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
