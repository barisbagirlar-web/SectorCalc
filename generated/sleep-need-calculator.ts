// Auto-generated from sleep-need-calculator-schema.json
import * as z from 'zod';

export interface Sleep_need_calculatorInput {
  age: number;
  shiftType: number;
  sleepQuality: number;
  desiredWakeUp: number;
  sleepLatency: number;
  physicalActivity: number;
  dataConfidence?: number;
}

export const Sleep_need_calculatorInputSchema = z.object({
  age: z.number().default(30),
  shiftType: z.number().default(0),
  sleepQuality: z.number().default(5),
  desiredWakeUp: z.number().default(420),
  sleepLatency: z.number().default(15),
  physicalActivity: z.number().default(2),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Sleep_need_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.age < 18 ? 540 : (input.age > 65 ? 450 : 480)); results["baseSleepMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseSleepMinutes"] = Number.NaN; }
  try { const v = (input.shiftType === 1 ? 30 : (input.shiftType === 2 ? 15 : 0)); results["shiftAdjustment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["shiftAdjustment"] = Number.NaN; }
  try { const v = (input.sleepQuality - 5) * 5; results["qualityAdjustment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["qualityAdjustment"] = Number.NaN; }
  try { const v = (input.physicalActivity > 5 ? -10 : 0); results["activityAdjustment"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["activityAdjustment"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["baseSleepMinutes"])) + (toNumericFormulaValue(results["shiftAdjustment"])) + (toNumericFormulaValue(results["qualityAdjustment"])) + (toNumericFormulaValue(results["activityAdjustment"])); results["totalSleepMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalSleepMinutes"] = Number.NaN; }
  try { const v = (input.desiredWakeUp - (toNumericFormulaValue(results["totalSleepMinutes"])) + 1440) % 1440; results["bedtimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["bedtimeMinutes"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["totalSleepMinutes"])) / 60; results["sleepDurationHours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sleepDurationHours"] = Number.NaN; }
  return results;
}


export function calculateSleep_need_calculator(input: Sleep_need_calculatorInput): Sleep_need_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["sleepDurationHours"]);
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


export interface Sleep_need_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
