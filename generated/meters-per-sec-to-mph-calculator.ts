// Auto-generated from meters-per-sec-to-mph-calculator-schema.json
import * as z from 'zod';

export interface Meters_per_sec_to_mph_calculatorInput {
  speed_ms: number;
  factor_m_to_mi: number;
  factor_s_to_h: number;
  decimal_places: number;
}

export const Meters_per_sec_to_mph_calculatorInputSchema = z.object({
  speed_ms: z.number().default(1),
  factor_m_to_mi: z.number().default(0.000621371),
  factor_s_to_h: z.number().default(3600),
  decimal_places: z.number().default(2),
});

function evaluateAllFormulas(input: Meters_per_sec_to_mph_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.speed_ms * input.factor_m_to_mi; results["speed_mps"] = Number.isFinite(v) ? v : 0; } catch { results["speed_mps"] = 0; }
  try { const v = input.speed_ms * input.factor_m_to_mi * input.factor_s_to_h; results["speed_mph_unrounded"] = Number.isFinite(v) ? v : 0; } catch { results["speed_mph_unrounded"] = 0; }
  try { const v = Math.round(input.speed_ms * input.factor_m_to_mi * input.factor_s_to_h * Math.pow(10, input.decimal_places)) / Math.pow(10, input.decimal_places); results["speed_mph_rounded"] = Number.isFinite(v) ? v : 0; } catch { results["speed_mph_rounded"] = 0; }
  return results;
}


export function calculateMeters_per_sec_to_mph_calculator(input: Meters_per_sec_to_mph_calculatorInput): Meters_per_sec_to_mph_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["speed_mph_rounded"] ?? 0;
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


export interface Meters_per_sec_to_mph_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
