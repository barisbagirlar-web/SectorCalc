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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Sleep_need_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.age < 18 ? 540 : (input.age > 65 ? 450 : 480)); results["baseSleepMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["baseSleepMinutes"] = 0; }
  try { const v = (input.shiftType === 1 ? 30 : (input.shiftType === 2 ? 15 : 0)); results["shiftAdjustment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["shiftAdjustment"] = 0; }
  try { const v = (input.sleepQuality - 5) * 5; results["qualityAdjustment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["qualityAdjustment"] = 0; }
  try { const v = (input.physicalActivity > 5 ? -10 : 0); results["activityAdjustment"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["activityAdjustment"] = 0; }
  try { const v = (asFormulaNumber(results["baseSleepMinutes"])) + (asFormulaNumber(results["shiftAdjustment"])) + (asFormulaNumber(results["qualityAdjustment"])) + (asFormulaNumber(results["activityAdjustment"])); results["totalSleepMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalSleepMinutes"] = 0; }
  try { const v = (input.desiredWakeUp - (asFormulaNumber(results["totalSleepMinutes"])) + 1440) % 1440; results["bedtimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bedtimeMinutes"] = 0; }
  try { const v = (asFormulaNumber(results["totalSleepMinutes"])) / 60; results["sleepDurationHours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sleepDurationHours"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
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
