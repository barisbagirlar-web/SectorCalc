// Auto-generated from sleep-latency-calculator-schema.json
import * as z from 'zod';

export interface Sleep_latency_calculatorInput {
  lightsOutTime: number;
  age: number;
  caffeineIntake: number;
  screenTime: number;
  roomTemperature: number;
  stressLevel: number;
}

export const Sleep_latency_calculatorInputSchema = z.object({
  lightsOutTime: z.number().default(22.5),
  age: z.number().default(35),
  caffeineIntake: z.number().default(150),
  screenTime: z.number().default(60),
  roomTemperature: z.number().default(20),
  stressLevel: z.number().default(5),
});

function evaluateAllFormulas(input: Sleep_latency_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 10 + 0.2 * (input.age - 30) + 0.05 * input.caffeineIntake + 0.1 * input.screenTime + ((input.roomTemperature - 20) ** 2) / 2 + 2 * input.stressLevel; results["predictedSleepLatency"] = Number.isFinite(v) ? v : 0; } catch { results["predictedSleepLatency"] = 0; }
  try { const v = input.lightsOutTime + (results["predictedSleepLatency"] ?? 0) / 60; results["estimatedSleepOnset"] = Number.isFinite(v) ? v : 0; } catch { results["estimatedSleepOnset"] = 0; }
  try { const v = 0.2 * (input.age - 30); results["ageAdjustment"] = Number.isFinite(v) ? v : 0; } catch { results["ageAdjustment"] = 0; }
  try { const v = 0.05 * input.caffeineIntake; results["caffeineAdjustment"] = Number.isFinite(v) ? v : 0; } catch { results["caffeineAdjustment"] = 0; }
  try { const v = 0.1 * input.screenTime; results["screenAdjustment"] = Number.isFinite(v) ? v : 0; } catch { results["screenAdjustment"] = 0; }
  try { const v = ((input.roomTemperature - 20) ** 2) / 2; results["temperatureAdjustment"] = Number.isFinite(v) ? v : 0; } catch { results["temperatureAdjustment"] = 0; }
  try { const v = 2 * input.stressLevel; results["stressAdjustment"] = Number.isFinite(v) ? v : 0; } catch { results["stressAdjustment"] = 0; }
  return results;
}


export function calculateSleep_latency_calculator(input: Sleep_latency_calculatorInput): Sleep_latency_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["predictedSleepLatency"] ?? 0;
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


export interface Sleep_latency_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
