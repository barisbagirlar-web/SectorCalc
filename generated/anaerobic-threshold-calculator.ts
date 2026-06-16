// Auto-generated from anaerobic-threshold-calculator-schema.json
import * as z from 'zod';

export interface Anaerobic_threshold_calculatorInput {
  age: number;
  restingHeartRate: number;
  maxHeartRate: number;
  intensity: number;
}

export const Anaerobic_threshold_calculatorInputSchema = z.object({
  age: z.number().default(30),
  restingHeartRate: z.number().default(60),
  maxHeartRate: z.number().default(0),
  intensity: z.number().default(85),
});

function evaluateAllFormulas(input: Anaerobic_threshold_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.maxHeartRate > 0 ? input.maxHeartRate : 220 - input.age; results["maxHR"] = Number.isFinite(v) ? v : 0; } catch { results["maxHR"] = 0; }
  try { const v = (results["maxHR"] ?? 0) - input.restingHeartRate; results["heartRateReserve"] = Number.isFinite(v) ? v : 0; } catch { results["heartRateReserve"] = 0; }
  try { const v = input.restingHeartRate + (input.intensity / 100) * (results["heartRateReserve"] ?? 0); results["anaerobicThresholdHR"] = Number.isFinite(v) ? v : 0; } catch { results["anaerobicThresholdHR"] = 0; }
  return results;
}


export function calculateAnaerobic_threshold_calculator(input: Anaerobic_threshold_calculatorInput): Anaerobic_threshold_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["anaerobicThresholdHR"] ?? 0;
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


export interface Anaerobic_threshold_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
