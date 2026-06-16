// Auto-generated from rockwood-frailty-scale-calculator-schema.json
import * as z from 'zod';

export interface Rockwood_frailty_scale_calculatorInput {
  age: number;
  walking_speed: number;
  grip_strength: number;
  comorbidities: number;
  exhaustion: number;
  weight_loss: number;
}

export const Rockwood_frailty_scale_calculatorInputSchema = z.object({
  age: z.number().default(70),
  walking_speed: z.number().default(1),
  grip_strength: z.number().default(25),
  comorbidities: z.number().default(2),
  exhaustion: z.number().default(0),
  weight_loss: z.number().default(2),
});

function evaluateAllFormulas(input: Rockwood_frailty_scale_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.min(9, 1 + (input.age > 75 ? 1 : 0) + (input.walking_speed < 0.8 ? 1 : 0) + (input.grip_strength < 20 ? 1 : 0) + (input.comorbidities >= 3 ? 1 : 0) + input.exhaustion + (input.weight_loss > 5 ? 1 : 0)); results["score"] = Number.isFinite(v) ? v : 0; } catch { results["score"] = 0; }
  try { const v = (results["score"] ?? 0) === 9 ? 'Terminally Ill' : (results["score"] ?? 0) >= 8 ? 'Very Severely Frail' : (results["score"] ?? 0) >= 7 ? 'Severely Frail' : (results["score"] ?? 0) >= 6 ? 'Moderately Frail' : (results["score"] ?? 0) >= 5 ? 'Mildly Frail' : (results["score"] ?? 0) >= 4 ? 'Vulnerable' : 'Well or Managing Well'; results["classification"] = Number.isFinite(v) ? v : 0; } catch { results["classification"] = 0; }
  return results;
}


export function calculateRockwood_frailty_scale_calculator(input: Rockwood_frailty_scale_calculatorInput): Rockwood_frailty_scale_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Rockwood"] ?? 0;
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


export interface Rockwood_frailty_scale_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
