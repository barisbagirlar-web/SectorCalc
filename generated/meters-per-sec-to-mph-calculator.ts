// Auto-generated from meters-per-sec-to-mph-calculator-schema.json
import * as z from 'zod';

export interface Meters_per_sec_to_mph_calculatorInput {
  speed_ms: number;
  factor_m_to_mi: number;
  factor_s_to_h: number;
  decimal_places: number;
  dataConfidence?: number;
}

export const Meters_per_sec_to_mph_calculatorInputSchema = z.object({
  speed_ms: z.number().default(1),
  factor_m_to_mi: z.number().default(0.000621371),
  factor_s_to_h: z.number().default(3600),
  decimal_places: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Meters_per_sec_to_mph_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.speed_ms * input.factor_m_to_mi; results["speed_mps"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["speed_mps"] = Number.NaN; }
  try { const v = input.speed_ms * input.factor_m_to_mi * input.factor_s_to_h; results["speed_mph_unrounded"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["speed_mph_unrounded"] = Number.NaN; }
  return results;
}


export function calculateMeters_per_sec_to_mph_calculator(input: Meters_per_sec_to_mph_calculatorInput): Meters_per_sec_to_mph_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["speed_mph_unrounded"]);
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


export interface Meters_per_sec_to_mph_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
