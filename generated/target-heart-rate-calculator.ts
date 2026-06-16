// Auto-generated from target-heart-rate-calculator-schema.json
import * as z from 'zod';

export interface Target_heart_rate_calculatorInput {
  age: number;
  restingHeartRate: number;
  intensityMin: number;
  intensityMax: number;
}

export const Target_heart_rate_calculatorInputSchema = z.object({
  age: z.number().default(30),
  restingHeartRate: z.number().default(70),
  intensityMin: z.number().default(50),
  intensityMax: z.number().default(85),
});

function evaluateAllFormulas(input: Target_heart_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 220 - input.age; results["maxHeartRate"] = Number.isFinite(v) ? v : 0; } catch { results["maxHeartRate"] = 0; }
  try { const v = (results["maxHeartRate"] ?? 0) - input.restingHeartRate; results["heartRateReserve"] = Number.isFinite(v) ? v : 0; } catch { results["heartRateReserve"] = 0; }
  try { const v = (results["heartRateReserve"] ?? 0) * (input.intensityMin / 100) + input.restingHeartRate; results["targetMin"] = Number.isFinite(v) ? v : 0; } catch { results["targetMin"] = 0; }
  try { const v = (results["heartRateReserve"] ?? 0) * (input.intensityMax / 100) + input.restingHeartRate; results["targetMax"] = Number.isFinite(v) ? v : 0; } catch { results["targetMax"] = 0; }
  return results;
}


export function calculateTarget_heart_rate_calculator(input: Target_heart_rate_calculatorInput): Target_heart_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["Your"] ?? 0;
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


export interface Target_heart_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
