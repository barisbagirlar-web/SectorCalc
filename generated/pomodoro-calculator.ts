// @ts-nocheck
// Auto-generated from pomodoro-calculator-schema.json
import * as z from 'zod';

export interface Pomodoro_calculatorInput {
  numberOfPomodoros: number;
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  pomodorosBeforeLongBreak: number;
  startTimeMinutes: number;
}

export const Pomodoro_calculatorInputSchema = z.object({
  numberOfPomodoros: z.number().default(1),
  workDuration: z.number().default(25),
  shortBreakDuration: z.number().default(5),
  longBreakDuration: z.number().default(15),
  pomodorosBeforeLongBreak: z.number().default(4),
  startTimeMinutes: z.number().default(480),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pomodoro_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.numberOfPomodoros * input.workDuration; results["totalWorkTime"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalWorkTime"] = 0; }
  try { const v = input.numberOfPomodoros * input.workDuration; results["totalWorkTime_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalWorkTime_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculatePomodoro_calculator(input: Pomodoro_calculatorInput): Pomodoro_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalWorkTime_aux"]);
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


export interface Pomodoro_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
