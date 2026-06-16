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

function evaluateAllFormulas(input: Pomodoro_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.numberOfPomodoros * input.workDuration; results["totalWorkTime"] = Number.isFinite(v) ? v : 0; } catch { results["totalWorkTime"] = 0; }
  try { const v = Math.floor((input.numberOfPomodoros - 1) / input.pomodorosBeforeLongBreak); results["numberOfLongBreaks"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfLongBreaks"] = 0; }
  try { const v = input.numberOfPomodoros - 1 - (results["numberOfLongBreaks"] ?? 0); results["numberOfShortBreaks"] = Number.isFinite(v) ? v : 0; } catch { results["numberOfShortBreaks"] = 0; }
  try { const v = (results["numberOfShortBreaks"] ?? 0) * input.shortBreakDuration + (results["numberOfLongBreaks"] ?? 0) * input.longBreakDuration; results["totalBreakTime"] = Number.isFinite(v) ? v : 0; } catch { results["totalBreakTime"] = 0; }
  try { const v = input.startTimeMinutes + (results["totalWorkTime"] ?? 0) + (results["totalBreakTime"] ?? 0); results["estimatedEndMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["estimatedEndMinutes"] = 0; }
  return results;
}


export function calculatePomodoro_calculator(input: Pomodoro_calculatorInput): Pomodoro_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["estimatedEndMinutes"] ?? 0;
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


export interface Pomodoro_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
