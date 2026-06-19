// Auto-generated from gacha-calculator-schema.json
import * as z from 'zod';

export interface Gacha_calculatorInput {
  costPerPull: number;
  baseProbability: number;
  hardPityAt: number;
  desiredSuccesses: number;
  dataConfidence?: number;
}

export const Gacha_calculatorInputSchema = z.object({
  costPerPull: z.number().default(10),
  baseProbability: z.number().default(0.6),
  hardPityAt: z.number().default(90),
  desiredSuccesses: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Gacha_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.baseProbability / 100; results["pDecimal"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["pDecimal"] = 0; }
  try { const v = 1 - (asFormulaNumber(results["pDecimal"])); results["q"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["q"] = 0; }
  try { const v = input.hardPityAt; results["hardPityPulls"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["hardPityPulls"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateGacha_calculator(input: Gacha_calculatorInput): Gacha_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["hardPityPulls"]));
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


export interface Gacha_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
