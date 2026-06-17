// Auto-generated from resting-heart-rate-calculator-schema.json
import * as z from 'zod';

export interface Resting_heart_rate_calculatorInput {
  beats: number;
  seconds: number;
  age: number;
  fitnessLevel: number;
}

export const Resting_heart_rate_calculatorInputSchema = z.object({
  beats: z.number().default(20),
  seconds: z.number().default(15),
  age: z.number().default(30),
  fitnessLevel: z.number().default(5),
});

function evaluateAllFormulas(input: Resting_heart_rate_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.beats / input.seconds) * 60; results["restingHeartRate"] = Number.isFinite(v) ? v : 0; } catch { results["restingHeartRate"] = 0; }
  try { const v = Math.round((results["restingHeartRate"] ?? 0)); results["restingHeartRateRounded"] = Number.isFinite(v) ? v : 0; } catch { results["restingHeartRateRounded"] = 0; }
  try { const v = ((results["restingHeartRate"] ?? 0) < 60 ? 'Athletic' : (results["restingHeartRate"] ?? 0) < 80 ? 'Normal' : 'Elevated'); results["classification"] = Number.isFinite(v) ? v : 0; } catch { results["classification"] = 0; }
  try { const v = `A resting heart rate of ${(results["restingHeartRateRounded"] ?? 0)} bpm is considered ${(results["classification"] ?? 0).toLowerCase()}.`; results["breakdown1"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown1"] = 0; }
  try { const v = 'Normal resting heart rate ranges from 60 to 100 bpm for adults. Athletes may have 40-60 bpm.'; results["breakdown2Text"] = Number.isFinite(v) ? v : 0; } catch { results["breakdown2Text"] = 0; }
  try { const v = (results["restingHeartRateRounded"] ?? 0) + ' bpm'; results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


export function calculateResting_heart_rate_calculator(input: Resting_heart_rate_calculatorInput): Resting_heart_rate_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Resting_heart_rate_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
