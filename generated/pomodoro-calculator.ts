// Auto-generated from pomodoro-calculator-schema.json
import * as z from 'zod';

export interface Pomodoro_calculatorInput {
  numberOfPomodoros: number;
  workDuration: number;
  shortBreakDuration: number;
  longBreakDuration: number;
  pomodorosBeforeLongBreak: number;
  startTimeMinutes: number;
  dataConfidence?: number;
}

export const Pomodoro_calculatorInputSchema = z.object({
  numberOfPomodoros: z.number().default(1),
  workDuration: z.number().default(25),
  shortBreakDuration: z.number().default(5),
  longBreakDuration: z.number().default(15),
  pomodorosBeforeLongBreak: z.number().default(4),
  startTimeMinutes: z.number().default(480),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Pomodoro_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.numberOfPomodoros) * (input.workDuration) * (input.shortBreakDuration) * (input.longBreakDuration) * (input.pomodorosBeforeLongBreak) * (input.startTimeMinutes); results["totalWorkTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWorkTime"] = Number.NaN; }
  try { const v = (input.numberOfPomodoros) * (input.workDuration) * (input.shortBreakDuration); results["totalWorkTime_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalWorkTime_aux"] = Number.NaN; }
  return results;
}


export function calculatePomodoro_calculator(input: Pomodoro_calculatorInput): Pomodoro_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalWorkTime_aux"]);
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


export interface Pomodoro_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
