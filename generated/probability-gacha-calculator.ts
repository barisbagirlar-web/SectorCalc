// Auto-generated from probability-gacha-calculator-schema.json
import * as z from 'zod';

export interface Probability_gacha_calculatorInput {
  attempts: number;
  probability: number;
  cost: number;
  guarantee: number;
  dataConfidence?: number;
}

export const Probability_gacha_calculatorInputSchema = z.object({
  attempts: z.number().default(10),
  probability: z.number().default(0.05),
  cost: z.number().default(100),
  guarantee: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Probability_gacha_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1 / input.probability; results["expectedAttempts"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["expectedAttempts"] = 0; }
  try { const v = (1 / input.probability) * input.cost; results["expectedCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["expectedCost"] = 0; }
  try { const v = input.guarantee * input.cost; results["worstCaseCost"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["worstCaseCost"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateProbability_gacha_calculator(input: Probability_gacha_calculatorInput): Probability_gacha_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["worstCaseCost"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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


export interface Probability_gacha_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
