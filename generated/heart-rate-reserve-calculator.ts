// Auto-generated from heart-rate-reserve-calculator-schema.json
import * as z from 'zod';

export interface Heart_rate_reserve_calculatorInput {
  age: number;
  restingHeartRate: number;
  maximumHeartRate: number;
  intensity: number;
}

export const Heart_rate_reserve_calculatorInputSchema = z.object({
  age: z.number().default(30),
  restingHeartRate: z.number().default(70),
  maximumHeartRate: z.number().default(0),
  intensity: z.number().default(60),
});

function evaluateAllFormulas(input: Heart_rate_reserve_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.maximumHeartRate > 0 ? input.maximumHeartRate : 220 - input.age; results["maxHeartRate"] = Number.isFinite(v) ? v : 0; } catch { results["maxHeartRate"] = 0; }
  try { const v = (results["maxHeartRate"] ?? 0) - input.restingHeartRate; results["heartRateReserve"] = Number.isFinite(v) ? v : 0; } catch { results["heartRateReserve"] = 0; }
  try { const v = (results["heartRateReserve"] ?? 0) * (input.intensity / 100) + input.restingHeartRate; results["targetHeartRate"] = Number.isFinite(v) ? v : 0; } catch { results["targetHeartRate"] = 0; }
  return results;
}


export function calculateHeart_rate_reserve_calculator(input: Heart_rate_reserve_calculatorInput): Heart_rate_reserve_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["targetHeartRate"] ?? 0;
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


export interface Heart_rate_reserve_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
