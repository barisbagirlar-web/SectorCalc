// Auto-generated from catan-probability-calculator-schema.json
import * as z from 'zod';

export interface Catan_probability_calculatorInput {
  diceCount: number;
  diceSides: number;
  targetSum: number;
  settlementCount: number;
  rolls: number;
}

export const Catan_probability_calculatorInputSchema = z.object({
  diceCount: z.number().default(2),
  diceSides: z.number().default(6),
  targetSum: z.number().default(7),
  settlementCount: z.number().default(1),
  rolls: z.number().default(1),
});

function evaluateAllFormulas(input: Catan_probability_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.pow(input.diceSides, input.diceCount); results["totalOutcomes"] = Number.isFinite(v) ? v : 0; } catch { results["totalOutcomes"] = 0; }
  try { const v = Math.max(0, input.diceSides - Math.abs(input.targetSum - (input.diceSides + 1))); results["favorableOutcomes"] = Number.isFinite(v) ? v : 0; } catch { results["favorableOutcomes"] = 0; }
  try { const v = (results["favorableOutcomes"] ?? 0) / (results["totalOutcomes"] ?? 0); results["probabilityPerRoll"] = Number.isFinite(v) ? v : 0; } catch { results["probabilityPerRoll"] = 0; }
  try { const v = (results["probabilityPerRoll"] ?? 0) * input.settlementCount; results["expectedPerRoll"] = Number.isFinite(v) ? v : 0; } catch { results["expectedPerRoll"] = 0; }
  try { const v = 1 - Math.pow(1 - (results["probabilityPerRoll"] ?? 0), input.rolls); results["probabilityAtLeastOne"] = Number.isFinite(v) ? v : 0; } catch { results["probabilityAtLeastOne"] = 0; }
  try { const v = (results["expectedPerRoll"] ?? 0) * input.rolls; results["expectedResources"] = Number.isFinite(v) ? v : 0; } catch { results["expectedResources"] = 0; }
  return results;
}


export function calculateCatan_probability_calculator(input: Catan_probability_calculatorInput): Catan_probability_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["expectedResources"] ?? 0;
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


export interface Catan_probability_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
