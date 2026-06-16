// Auto-generated from max-heart-rate-calculator-schema.json
import * as z from 'zod';

export interface Max_heart_rate_calculatorInput {
  birthYear: number;
  currentYear: number;
  restingHR: number;
  lowerIntensity: number;
  upperIntensity: number;
}

export const Max_heart_rate_calculatorInputSchema = z.object({
  birthYear: z.number().default(1990),
  currentYear: z.number().default(2024),
  restingHR: z.number().default(70),
  lowerIntensity: z.number().default(60),
  upperIntensity: z.number().default(80),
});

function evaluateAllFormulas(input: Max_heart_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.currentYear - input.birthYear; results["age"] = Number.isFinite(v) ? v : 0; } catch { results["age"] = 0; }
  try { const v = 220 - (results["age"] ?? 0); results["maxHR"] = Number.isFinite(v) ? v : 0; } catch { results["maxHR"] = 0; }
  try { const v = (results["maxHR"] ?? 0) - input.restingHR; results["heartRateReserve"] = Number.isFinite(v) ? v : 0; } catch { results["heartRateReserve"] = 0; }
  try { const v = input.restingHR + (results["heartRateReserve"] ?? 0) * (input.lowerIntensity / 100); results["lowerTarget"] = Number.isFinite(v) ? v : 0; } catch { results["lowerTarget"] = 0; }
  try { const v = input.restingHR + (results["heartRateReserve"] ?? 0) * (input.upperIntensity / 100); results["upperTarget"] = Number.isFinite(v) ? v : 0; } catch { results["upperTarget"] = 0; }
  return results;
}


export function calculateMax_heart_rate_calculator(input: Max_heart_rate_calculatorInput): Max_heart_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["maxHR"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Max_heart_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
