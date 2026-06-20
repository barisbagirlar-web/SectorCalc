// Auto-generated from vo2-max-from-mile-time-calculator-schema.json
import * as z from 'zod';

export interface Vo2_max_from_mile_time_calculatorInput {
  timeMinutes: number;
  heartRateBpm: number;
  weightKg: number;
  gender: number;
  dataConfidence?: number;
}

export const Vo2_max_from_mile_time_calculatorInputSchema = z.object({
  timeMinutes: z.number().default(8.5),
  heartRateBpm: z.number().default(150),
  weightKg: z.number().default(70),
  gender: z.number().default(1),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Vo2_max_from_mile_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = -0.1636 * input.weightKg; results["weightComponent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weightComponent"] = Number.NaN; }
  try { const v = -1.438 * input.timeMinutes; results["timeComponent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["timeComponent"] = Number.NaN; }
  try { const v = -0.1928 * input.heartRateBpm; results["heartRateComponent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["heartRateComponent"] = Number.NaN; }
  try { const v = 8.344 * input.gender; results["genderComponent"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["genderComponent"] = Number.NaN; }
  try { const v = 100.5 - 0.1636 * input.weightKg - 1.438 * input.timeMinutes - 0.1928 * input.heartRateBpm + 8.344 * input.gender; results["vo2max"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["vo2max"] = Number.NaN; }
  return results;
}


export function calculateVo2_max_from_mile_time_calculator(input: Vo2_max_from_mile_time_calculatorInput): Vo2_max_from_mile_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["vo2max"]);
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


export interface Vo2_max_from_mile_time_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
