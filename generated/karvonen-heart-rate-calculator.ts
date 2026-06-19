// Auto-generated from karvonen-heart-rate-calculator-schema.json
import * as z from 'zod';

export interface Karvonen_heart_rate_calculatorInput {
  age: number;
  restingHR: number;
  maxHR: number;
  intensityLow: number;
  intensityHigh: number;
  dataConfidence?: number;
}

export const Karvonen_heart_rate_calculatorInputSchema = z.object({
  age: z.number().default(30),
  restingHR: z.number().default(60),
  maxHR: z.number().default(190),
  intensityLow: z.number().default(60),
  intensityHigh: z.number().default(70),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Karvonen_heart_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.maxHR - input.restingHR) * (input.intensityLow / 100)) + input.restingHR; results["targetHeartRateLow"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["targetHeartRateLow"] = 0; }
  try { const v = ((input.maxHR - input.restingHR) * (input.intensityHigh / 100)) + input.restingHR; results["targetHeartRateHigh"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["targetHeartRateHigh"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateKarvonen_heart_rate_calculator(input: Karvonen_heart_rate_calculatorInput): Karvonen_heart_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["targetHeartRateHigh"]);
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


export interface Karvonen_heart_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
