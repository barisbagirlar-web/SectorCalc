// @ts-nocheck
// Auto-generated from craps-probability-schema.json
import * as z from 'zod';

export interface Craps_probabilityInput {
  point: number;
  rolls: number;
  betAmount: number;
  payoutOdds: number;
}

export const Craps_probabilityInputSchema = z.object({
  point: z.number().default(6),
  rolls: z.number().default(1),
  betAmount: z.number().default(10),
  payoutOdds: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Craps_probabilityInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.point === 6 || input.point === 8 ? 5/11 : input.point === 5 || input.point === 9 ? 4/10 : input.point === 4 || input.point === 10 ? 3/9 : 0; results["winProbability"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["winProbability"] = 0; }
  try { const v = 1 - (asFormulaNumber(results["winProbability"])); results["loseProbability"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["loseProbability"] = 0; }
  try { const v = input.betAmount * (input.payoutOdds * (asFormulaNumber(results["winProbability"])) - (asFormulaNumber(results["loseProbability"]))); results["expectedValue"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["expectedValue"] = 0; }
  try { const v = 1 - (1 - (asFormulaNumber(results["winProbability"]))) ** input.rolls; results["winChanceAfterNRolls"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["winChanceAfterNRolls"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCraps_probability(input: Craps_probabilityInput): Craps_probabilityOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["expectedValue"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
