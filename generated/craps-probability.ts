// Auto-generated from craps-probability-schema.json
import * as z from 'zod';

export interface Craps_probabilityInput {
  point: number;
  rolls: number;
  betAmount: number;
  payoutOdds: number;
  dataConfidence?: number;
}

export const Craps_probabilityInputSchema = z.object({
  point: z.number().default(6),
  rolls: z.number().default(1),
  betAmount: z.number().default(10),
  payoutOdds: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Craps_probabilityInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.point === 6 || input.point === 8 ? 5/11 : input.point === 5 || input.point === 9 ? 4/10 : input.point === 4 || input.point === 10 ? 3/9 : 0; results["winProbability"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["winProbability"] = Number.NaN; }
  try { const v = 1 - (toNumericFormulaValue(results["winProbability"])); results["loseProbability"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["loseProbability"] = Number.NaN; }
  try { const v = input.betAmount * (input.payoutOdds * (toNumericFormulaValue(results["winProbability"])) - (toNumericFormulaValue(results["loseProbability"]))); results["expectedValue"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["expectedValue"] = Number.NaN; }
  try { const v = 1 - (1 - (toNumericFormulaValue(results["winProbability"]))) ** input.rolls; results["winChanceAfterNRolls"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["winChanceAfterNRolls"] = Number.NaN; }
  return results;
}


export function calculateCraps_probability(input: Craps_probabilityInput): Craps_probabilityOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["expectedValue"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
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


export interface Craps_probabilityOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
