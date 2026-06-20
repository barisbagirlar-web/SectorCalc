// Auto-generated from piotroski-f-score-calculator-schema.json
import * as z from 'zod';

export interface Piotroski_f_score_calculatorInput {
  roaPositive: number;
  cfoPositive: number;
  roaIncreased: number;
  accrualLow: number;
  leverageDecreased: number;
  currentRatioIncreased: number;
  grossMarginIncreased: number;
  assetTurnoverIncreased: number;
  dataConfidence?: number;
}

export const Piotroski_f_score_calculatorInputSchema = z.object({
  roaPositive: z.number().default(0),
  cfoPositive: z.number().default(0),
  roaIncreased: z.number().default(0),
  accrualLow: z.number().default(0),
  leverageDecreased: z.number().default(0),
  currentRatioIncreased: z.number().default(0),
  grossMarginIncreased: z.number().default(0),
  assetTurnoverIncreased: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Piotroski_f_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roaPositive + input.cfoPositive + input.roaIncreased + input.accrualLow + input.leverageDecreased + input.currentRatioIncreased + input.grossMarginIncreased + input.assetTurnoverIncreased; results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["primary"] = Number.NaN; }
  try { const v = input.roaPositive; results["roaPositive"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["roaPositive"] = Number.NaN; }
  try { const v = input.cfoPositive; results["cfoPositive"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["cfoPositive"] = Number.NaN; }
  try { const v = input.roaIncreased; results["roaIncreased"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["roaIncreased"] = Number.NaN; }
  try { const v = input.accrualLow; results["accrualLow"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["accrualLow"] = Number.NaN; }
  try { const v = input.leverageDecreased; results["leverageDecreased"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["leverageDecreased"] = Number.NaN; }
  try { const v = input.currentRatioIncreased; results["currentRatioIncreased"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["currentRatioIncreased"] = Number.NaN; }
  try { const v = input.grossMarginIncreased; results["grossMarginIncreased"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["grossMarginIncreased"] = Number.NaN; }
  try { const v = input.assetTurnoverIncreased; results["assetTurnoverIncreased"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["assetTurnoverIncreased"] = Number.NaN; }
  return results;
}


export function calculatePiotroski_f_score_calculator(input: Piotroski_f_score_calculatorInput): Piotroski_f_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["assetTurnoverIncreased"]);
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


export interface Piotroski_f_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
