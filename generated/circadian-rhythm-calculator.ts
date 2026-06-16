// Auto-generated from circadian-rhythm-calculator-schema.json
import * as z from 'zod';

export interface Circadian_rhythm_calculatorInput {
  wakeTime: number;
  currentTime: number;
  sleepDuration: number;
  circadianAmplitude: number;
  baselineAlertness: number;
}

export const Circadian_rhythm_calculatorInputSchema = z.object({
  wakeTime: z.number().default(7),
  currentTime: z.number().default(12),
  sleepDuration: z.number().default(7.5),
  circadianAmplitude: z.number().default(30),
  baselineAlertness: z.number().default(70),
});

function evaluateAllFormulas(input: Circadian_rhythm_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = ((input.currentTime - input.wakeTime + 24) % 24); results["hoursSinceWake"] = Number.isFinite(v) ? v : 0; } catch { results["hoursSinceWake"] = 0; }
  try { const v = Math.cos(2 * Math.PI * ((results["hoursSinceWake"] ?? 0) - 8) / 24); results["circadianFactor"] = Number.isFinite(v) ? v : 0; } catch { results["circadianFactor"] = 0; }
  try { const v = Math.min(100, Math.max(0, input.baselineAlertness + input.circadianAmplitude * (results["circadianFactor"] ?? 0))); results["alertness"] = Number.isFinite(v) ? v : 0; } catch { results["alertness"] = 0; }
  return results;
}


export function calculateCircadian_rhythm_calculator(input: Circadian_rhythm_calculatorInput): Circadian_rhythm_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["alertness"] ?? 0;
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


export interface Circadian_rhythm_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
