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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Piotroski_f_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.roaPositive + input.cfoPositive + input.roaIncreased + input.accrualLow + input.leverageDecreased + input.currentRatioIncreased + input.grossMarginIncreased + input.assetTurnoverIncreased; results["primary"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["primary"] = 0; }
  try { const v = input.roaPositive; results["roaPositive"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["roaPositive"] = 0; }
  try { const v = input.cfoPositive; results["cfoPositive"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["cfoPositive"] = 0; }
  try { const v = input.roaIncreased; results["roaIncreased"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["roaIncreased"] = 0; }
  try { const v = input.accrualLow; results["accrualLow"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["accrualLow"] = 0; }
  try { const v = input.leverageDecreased; results["leverageDecreased"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["leverageDecreased"] = 0; }
  try { const v = input.currentRatioIncreased; results["currentRatioIncreased"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["currentRatioIncreased"] = 0; }
  try { const v = input.grossMarginIncreased; results["grossMarginIncreased"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grossMarginIncreased"] = 0; }
  try { const v = input.assetTurnoverIncreased; results["assetTurnoverIncreased"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["assetTurnoverIncreased"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
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
