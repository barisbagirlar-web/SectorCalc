// Auto-generated from heart-rate-reserve-calculator-schema.json
import * as z from 'zod';

export interface Heart_rate_reserve_calculatorInput {
  age: number;
  restingHeartRate: number;
  maximumHeartRate: number;
  intensity: number;
  dataConfidence?: number;
}

export const Heart_rate_reserve_calculatorInputSchema = z.object({
  age: z.number().default(30),
  restingHeartRate: z.number().default(70),
  maximumHeartRate: z.number().default(0),
  intensity: z.number().default(60),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Heart_rate_reserve_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.maximumHeartRate > 0 ? input.maximumHeartRate : 220 - input.age; results["maxHeartRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["maxHeartRate"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["maxHeartRate"])) - input.restingHeartRate; results["heartRateReserve"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["heartRateReserve"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["heartRateReserve"])) * (input.intensity / 100) + input.restingHeartRate; results["targetHeartRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["targetHeartRate"] = Number.NaN; }
  return results;
}


export function calculateHeart_rate_reserve_calculator(input: Heart_rate_reserve_calculatorInput): Heart_rate_reserve_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["targetHeartRate"]);
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


export interface Heart_rate_reserve_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
