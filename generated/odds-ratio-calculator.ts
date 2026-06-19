// Auto-generated from odds-ratio-calculator-schema.json
import * as z from 'zod';

export interface Odds_ratio_calculatorInput {
  a: number;
  b: number;
  c: number;
  d: number;
  dataConfidence?: number;
}

export const Odds_ratio_calculatorInputSchema = z.object({
  a: z.number().default(10),
  b: z.number().default(20),
  c: z.number().default(5),
  d: z.number().default(30),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Odds_ratio_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.a * input.d) / (input.b * input.c); results["oddsRatio"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["oddsRatio"] = 0; }
  try { const v = input.a / input.b; results["oddsExposed"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["oddsExposed"] = 0; }
  try { const v = input.c / input.d; results["oddsUnexposed"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["oddsUnexposed"] = 0; }
  try { const v = input.a * input.d; results["ad"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ad"] = 0; }
  try { const v = input.b * input.c; results["bc"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bc"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateOdds_ratio_calculator(input: Odds_ratio_calculatorInput): Odds_ratio_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["oddsRatio"]);
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


export interface Odds_ratio_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
