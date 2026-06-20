// Auto-generated from sleep-latency-calculator-schema.json
import * as z from 'zod';

export interface Sleep_latency_calculatorInput {
  lightsOutTime: number;
  age: number;
  caffeineIntake: number;
  screenTime: number;
  roomTemperature: number;
  stressLevel: number;
  dataConfidence?: number;
}

export const Sleep_latency_calculatorInputSchema = z.object({
  lightsOutTime: z.number().default(22.5),
  age: z.number().default(35),
  caffeineIntake: z.number().default(150),
  screenTime: z.number().default(60),
  roomTemperature: z.number().default(20),
  stressLevel: z.number().default(5),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sleep_latency_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 10 + 0.2 * (input.age - 30) + 0.05 * input.caffeineIntake + 0.1 * input.screenTime + ((input.roomTemperature - 20) ** 2) / 2 + 2 * input.stressLevel; results["predictedSleepLatency"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["predictedSleepLatency"] = Number.NaN; }
  try { const v = input.lightsOutTime + (toNumericFormulaValue(results["predictedSleepLatency"])) / 60; results["estimatedSleepOnset"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["estimatedSleepOnset"] = Number.NaN; }
  try { const v = 0.2 * (input.age - 30); results["ageAdjustment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ageAdjustment"] = Number.NaN; }
  try { const v = 0.05 * input.caffeineIntake; results["caffeineAdjustment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["caffeineAdjustment"] = Number.NaN; }
  try { const v = 0.1 * input.screenTime; results["screenAdjustment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["screenAdjustment"] = Number.NaN; }
  try { const v = ((input.roomTemperature - 20) ** 2) / 2; results["temperatureAdjustment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["temperatureAdjustment"] = Number.NaN; }
  try { const v = 2 * input.stressLevel; results["stressAdjustment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["stressAdjustment"] = Number.NaN; }
  return results;
}


export function calculateSleep_latency_calculator(input: Sleep_latency_calculatorInput): Sleep_latency_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["predictedSleepLatency"]);
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


export interface Sleep_latency_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
