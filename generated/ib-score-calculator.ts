// @ts-nocheck
// Auto-generated from ib-score-calculator-schema.json
import * as z from 'zod';

export interface Ib_score_calculatorInput {
  productivityScore: number;
  qualityScore: number;
  deliveryScore: number;
  safetyScore: number;
  costScore: number;
}

export const Ib_score_calculatorInputSchema = z.object({
  productivityScore: z.number().default(75),
  qualityScore: z.number().default(80),
  deliveryScore: z.number().default(90),
  safetyScore: z.number().default(85),
  costScore: z.number().default(70),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ib_score_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.productivityScore * 0.25; results["prodWeighted"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["prodWeighted"] = 0; }
  try { const v = input.qualityScore * 0.30; results["qualWeighted"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["qualWeighted"] = 0; }
  try { const v = input.deliveryScore * 0.20; results["delivWeighted"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["delivWeighted"] = 0; }
  try { const v = input.safetyScore * 0.15; results["safeWeighted"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["safeWeighted"] = 0; }
  try { const v = input.costScore * 0.10; results["costWeighted"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["costWeighted"] = 0; }
  try { const v = (asFormulaNumber(results["prodWeighted"])) + (asFormulaNumber(results["qualWeighted"])) + (asFormulaNumber(results["delivWeighted"])) + (asFormulaNumber(results["safeWeighted"])) + (asFormulaNumber(results["costWeighted"])); results["totalScore"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalScore"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateIb_score_calculator(input: Ib_score_calculatorInput): Ib_score_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalScore"]);
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


export interface Ib_score_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
