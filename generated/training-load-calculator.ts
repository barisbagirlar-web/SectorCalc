// @ts-nocheck
// Auto-generated from training-load-calculator-schema.json
import * as z from 'zod';

export interface Training_load_calculatorInput {
  duration: number;
  avgHeartRate: number;
  restingHeartRate: number;
  maxHeartRate: number;
  kFactor: number;
}

export const Training_load_calculatorInputSchema = z.object({
  duration: z.number().default(60),
  avgHeartRate: z.number().default(140),
  restingHeartRate: z.number().default(60),
  maxHeartRate: z.number().default(190),
  kFactor: z.number().default(0.64),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Training_load_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.avgHeartRate - input.restingHeartRate) / (input.maxHeartRate - input.restingHeartRate); results["hrRatio"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["hrRatio"] = 0; }
  try { const v = (input.avgHeartRate - input.restingHeartRate) / (input.maxHeartRate - input.restingHeartRate); results["hrRatio_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["hrRatio_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateTraining_load_calculator(input: Training_load_calculatorInput): Training_load_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["hrRatio_aux"]);
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


export interface Training_load_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
