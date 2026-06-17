// @ts-nocheck
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

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Deep_work_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.dailyWorkHours * 60; results["totalMinutes"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalMinutes"] = 0; }
  try { const v = input.meetingCount * input.meetingDuration; results["meetingTimeMinutes"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["meetingTimeMinutes"] = 0; }
  try { const v = input.interruptionCount * input.recoveryTime; results["interruptionTimeMinutes"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["interruptionTimeMinutes"] = 0; }
  try { const v = (input.shallowWorkPercent / 100) * (asFormulaNumber(results["totalMinutes"])); results["shallowTimeMinutes"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["shallowTimeMinutes"] = 0; }
  try { const v = (asFormulaNumber(results["shallowTimeMinutes"])) / 60; results["shallowWorkHours"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["shallowWorkHours"] = 0; }
  try { const v = (asFormulaNumber(results["meetingTimeMinutes"])) / 60; results["meetingHours"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["meetingHours"] = 0; }
  try { const v = (asFormulaNumber(results["interruptionTimeMinutes"])) / 60; results["interruptionHours"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["interruptionHours"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateDeep_work_calculator(input: Deep_work_calculatorInput): Deep_work_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["interruptionHours"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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
