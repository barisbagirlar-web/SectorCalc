// Auto-generated from hangover-calculator-schema.json
import * as z from 'zod';

export interface Hangover_calculatorInput {
  alcohol_grams: number;
  body_weight: number;
  hours: number;
  gender: number;
  food_intake: number;
  hydration: number;
}

export const Hangover_calculatorInputSchema = z.object({
  alcohol_grams: z.number().default(100),
  body_weight: z.number().default(70),
  hours: z.number().default(4),
  gender: z.number().default(1),
  food_intake: z.number().default(0.5),
  hydration: z.number().default(0.5),
});

function evaluateAllFormulas(input: Hangover_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(0, input.alcohol_grams / (input.body_weight * (0.55 + 0.15 * input.gender)) - 0.015 * input.hours); results["bac"] = Number.isFinite(v) ? v : 0; } catch { results["bac"] = 0; }
  try { const v = 1 - input.hydration; results["dehydration_factor"] = Number.isFinite(v) ? v : 0; } catch { results["dehydration_factor"] = 0; }
  try { const v = 1 - input.food_intake; results["food_impact"] = Number.isFinite(v) ? v : 0; } catch { results["food_impact"] = 0; }
  try { const v = (results["bac"] ?? 0) * 20 + (results["dehydration_factor"] ?? 0) * 10 + (results["food_impact"] ?? 0) * 10; results["hangover_score"] = Number.isFinite(v) ? v : 0; } catch { results["hangover_score"] = 0; }
  return results;
}


export function calculateHangover_calculator(input: Hangover_calculatorInput): Hangover_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["hangover_score"] ?? 0;
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


export interface Hangover_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
