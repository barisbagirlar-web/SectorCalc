// @ts-nocheck
// Auto-generated from calibrated-training-calculator-schema.json
import * as z from 'zod';

export interface Calibrated_training_calculatorInput {
  preScore: number;
  postScore: number;
  trainingDuration: number;
  hourlyCost: number;
  scrapRateBefore: number;
  scrapRateAfter: number;
}

export const Calibrated_training_calculatorInputSchema = z.object({
  preScore: z.number().default(60),
  postScore: z.number().default(80),
  trainingDuration: z.number().default(40),
  hourlyCost: z.number().default(100),
  scrapRateBefore: z.number().default(5),
  scrapRateAfter: z.number().default(2),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Calibrated_training_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = ((input.postScore - input.preScore) / (100 - input.preScore)) * 100; results["skillGain"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["skillGain"] = 0; }
  try { const v = ((input.scrapRateBefore - input.scrapRateAfter) / input.scrapRateBefore) * 100; results["qualityImprovement"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["qualityImprovement"] = 0; }
  try { const v = (((input.postScore - input.preScore) / (100 - input.preScore)) * 100) / (input.trainingDuration * input.hourlyCost); results["costEfficiency"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["costEfficiency"] = 0; }
  try { const v = 0.6 * (((input.postScore - input.preScore) / (100 - input.preScore)) * 100) + 0.4 * (((input.scrapRateBefore - input.scrapRateAfter) / input.scrapRateBefore) * 100); results["trainingEffectiveness"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["trainingEffectiveness"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCalibrated_training_calculator(input: Calibrated_training_calculatorInput): Calibrated_training_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["trainingEffectiveness"]);
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


export interface Calibrated_training_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
