// Auto-generated from ib-score-calculator-schema.json
import * as z from 'zod';

export interface Ib_score_calculatorInput {
  productivityScore: number;
  qualityScore: number;
  deliveryScore: number;
  safetyScore: number;
  costScore: number;
  dataConfidence?: number;
}

export const Ib_score_calculatorInputSchema = z.object({
  productivityScore: z.number().default(75),
  qualityScore: z.number().default(80),
  deliveryScore: z.number().default(90),
  safetyScore: z.number().default(85),
  costScore: z.number().default(70),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Ib_score_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.productivityScore * 0.25; results["prodWeighted"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["prodWeighted"] = Number.NaN; }
  try { const v = input.qualityScore * 0.30; results["qualWeighted"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["qualWeighted"] = Number.NaN; }
  try { const v = input.deliveryScore * 0.20; results["delivWeighted"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["delivWeighted"] = Number.NaN; }
  try { const v = input.safetyScore * 0.15; results["safeWeighted"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["safeWeighted"] = Number.NaN; }
  try { const v = input.costScore * 0.10; results["costWeighted"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["costWeighted"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["prodWeighted"])) + (toNumericFormulaValue(results["qualWeighted"])) + (toNumericFormulaValue(results["delivWeighted"])) + (toNumericFormulaValue(results["safeWeighted"])) + (toNumericFormulaValue(results["costWeighted"])); results["totalScore"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalScore"] = Number.NaN; }
  return results;
}


export function calculateIb_score_calculator(input: Ib_score_calculatorInput): Ib_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalScore"]);
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


export interface Ib_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
