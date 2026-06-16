// Auto-generated from dice-probability-calculator-schema.json
import * as z from 'zod';

export interface Dice_probability_calculatorInput {
  numDice: number;
  numSides: number;
  modifier: number;
  rangeMultiplier: number;
}

export const Dice_probability_calculatorInputSchema = z.object({
  numDice: z.number().default(2),
  numSides: z.number().default(6),
  modifier: z.number().default(0),
  rangeMultiplier: z.number().default(2),
});

function evaluateAllFormulas(input: Dice_probability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numDice * (input.numSides + 1) / 2 + input.modifier; results["expectedSum"] = Number.isFinite(v) ? v : 0; } catch { results["expectedSum"] = 0; }
  try { const v = input.numDice * (input.numSides ** 2 - 1) / 12; results["variance"] = Number.isFinite(v) ? v : 0; } catch { results["variance"] = 0; }
  try { const v = Math.sqrt((results["variance"] ?? 0)); results["stdDev"] = Number.isFinite(v) ? v : 0; } catch { results["stdDev"] = 0; }
  try { const v = (results["expectedSum"] ?? 0) - input.rangeMultiplier * (results["stdDev"] ?? 0); results["lowerRange"] = Number.isFinite(v) ? v : 0; } catch { results["lowerRange"] = 0; }
  try { const v = (results["expectedSum"] ?? 0) + input.rangeMultiplier * (results["stdDev"] ?? 0); results["upperRange"] = Number.isFinite(v) ? v : 0; } catch { results["upperRange"] = 0; }
  return results;
}


export function calculateDice_probability_calculator(input: Dice_probability_calculatorInput): Dice_probability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["expectedSum"] ?? 0;
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


export interface Dice_probability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
