// Auto-generated from bearing-life-calculator-schema.json
import * as z from 'zod';

export interface Bearing_life_calculatorInput {
  C: number;
  P: number;
  n: number;
  p: number;
  a1: number;
}

export const Bearing_life_calculatorInputSchema = z.object({
  C: z.number().default(10),
  P: z.number().default(2),
  n: z.number().default(1500),
  p: z.number().default(3),
  a1: z.number().default(1),
});

function evaluateAllFormulas(input: Bearing_life_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.C / input.P; results["cToPRatio"] = Number.isFinite(v) ? v : 0; } catch { results["cToPRatio"] = 0; }
  try { const v = (input.C / input.P) ** input.p; results["basicL10RevMillions"] = Number.isFinite(v) ? v : 0; } catch { results["basicL10RevMillions"] = 0; }
  try { const v = ((input.C / input.P) ** input.p * 1e6) / (60 * input.n); results["basicL10h"] = Number.isFinite(v) ? v : 0; } catch { results["basicL10h"] = 0; }
  try { const v = input.a1 * ((input.C / input.P) ** input.p * 1e6) / (60 * input.n); results["adjustedL10h"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedL10h"] = 0; }
  return results;
}


export function calculateBearing_life_calculator(input: Bearing_life_calculatorInput): Bearing_life_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["adjustedL10h"] ?? 0;
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


export interface Bearing_life_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
