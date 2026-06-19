// Auto-generated from nyquist-calculator-schema.json
import * as z from 'zod';

export interface Nyquist_calculatorInput {
  maxFrequency: number;
  samplingFrequency: number;
  safetyFactor: number;
  desiredUtilization: number;
  dataConfidence?: number;
}

export const Nyquist_calculatorInputSchema = z.object({
  maxFrequency: z.number().default(500),
  samplingFrequency: z.number().default(2000),
  safetyFactor: z.number().default(1.2),
  desiredUtilization: z.number().default(80),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Nyquist_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.samplingFrequency / 2; results["nyquistFrequency"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["nyquistFrequency"] = 0; }
  try { const v = 2 * input.maxFrequency * input.safetyFactor; results["requiredSamplingRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["requiredSamplingRate"] = 0; }
  try { const v = input.samplingFrequency > 0 ? (input.maxFrequency / (input.samplingFrequency / 2)) * 100 : 0; results["actualUtilization"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["actualUtilization"] = 0; }
  try { const v = input.desiredUtilization > 0 ? (200 * input.maxFrequency) / input.desiredUtilization : 0; results["recommendedSamplingForDesiredUtilization"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["recommendedSamplingForDesiredUtilization"] = 0; }
  try { const v = (input.samplingFrequency >= 2 * input.maxFrequency * input.safetyFactor) ? 1 : 0; results["isAdequate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["isAdequate"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateNyquist_calculator(input: Nyquist_calculatorInput): Nyquist_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["nyquistFrequency"]);
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


export interface Nyquist_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
