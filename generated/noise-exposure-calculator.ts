// @ts-nocheck
// Auto-generated from noise-exposure-calculator-schema.json
import * as z from 'zod';

export interface Noise_exposure_calculatorInput {
  noiseLevel: number;
  exposureTime: number;
  exchangeRate: number;
  criterionLevel: number;
  thresholdLevel: number;
}

export const Noise_exposure_calculatorInputSchema = z.object({
  noiseLevel: z.number().default(90),
  exposureTime: z.number().default(8),
  exchangeRate: z.number().default(3),
  criterionLevel: z.number().default(85),
  thresholdLevel: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Noise_exposure_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.noiseLevel + input.exposureTime + input.exchangeRate; results["result"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result"] = 0; }
  try { const v = input.noiseLevel + input.exposureTime + input.exchangeRate; results["result_copy"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["result_copy"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateNoise_exposure_calculator(input: Noise_exposure_calculatorInput): Noise_exposure_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["result"]);
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


export interface Noise_exposure_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
