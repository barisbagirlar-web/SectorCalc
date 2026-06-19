// Auto-generated from deep-work-calculator-schema.json
import * as z from 'zod';

export interface Deep_work_calculatorInput {
  dailyWorkHours: number;
  meetingCount: number;
  meetingDuration: number;
  interruptionCount: number;
  recoveryTime: number;
  deepWorkBlock: number;
  shallowWorkPercent: number;
  dataConfidence?: number;
}

export const Deep_work_calculatorInputSchema = z.object({
  dailyWorkHours: z.number().default(8),
  meetingCount: z.number().default(3),
  meetingDuration: z.number().default(30),
  interruptionCount: z.number().default(10),
  recoveryTime: z.number().default(15),
  deepWorkBlock: z.number().default(90),
  shallowWorkPercent: z.number().default(30),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Deep_work_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.dailyWorkHours * 60; results["totalMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalMinutes"] = 0; }
  try { const v = input.meetingCount * input.meetingDuration; results["meetingTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["meetingTimeMinutes"] = 0; }
  try { const v = input.interruptionCount * input.recoveryTime; results["interruptionTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["interruptionTimeMinutes"] = 0; }
  try { const v = (input.shallowWorkPercent / 100) * (asFormulaNumber(results["totalMinutes"])); results["shallowTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["shallowTimeMinutes"] = 0; }
  try { const v = (asFormulaNumber(results["shallowTimeMinutes"])) / 60; results["shallowWorkHours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["shallowWorkHours"] = 0; }
  try { const v = (asFormulaNumber(results["meetingTimeMinutes"])) / 60; results["meetingHours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["meetingHours"] = 0; }
  try { const v = (asFormulaNumber(results["interruptionTimeMinutes"])) / 60; results["interruptionHours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["interruptionHours"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateDeep_work_calculator(input: Deep_work_calculatorInput): Deep_work_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["interruptionHours"]);
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


export interface Deep_work_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
