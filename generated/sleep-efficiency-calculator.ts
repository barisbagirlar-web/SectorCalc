// Auto-generated from sleep-efficiency-calculator-schema.json
import * as z from 'zod';

export interface Sleep_efficiency_calculatorInput {
  timeInBed: number;
  sleepLatency: number;
  waso: number;
  awakenings: number;
}

export const Sleep_efficiency_calculatorInputSchema = z.object({
  timeInBed: z.number().default(480),
  sleepLatency: z.number().default(30),
  waso: z.number().default(30),
  awakenings: z.number().default(0),
});

function evaluateAllFormulas(input: Sleep_efficiency_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.timeInBed - input.sleepLatency - input.waso; results["totalSleepTime"] = Number.isFinite(v) ? v : 0; } catch { results["totalSleepTime"] = 0; }
  try { const v = ((results["totalSleepTime"] ?? 0) / input.timeInBed) * 100; results["sleepEfficiency"] = Number.isFinite(v) ? v : 0; } catch { results["sleepEfficiency"] = 0; }
  try { const v = (results["sleepEfficiency"] ?? 0) - input.awakenings * 2; results["qualityScore"] = Number.isFinite(v) ? v : 0; } catch { results["qualityScore"] = 0; }
  return results;
}


export function calculateSleep_efficiency_calculator(input: Sleep_efficiency_calculatorInput): Sleep_efficiency_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["sleepEfficiency"] ?? 0;
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


export interface Sleep_efficiency_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
