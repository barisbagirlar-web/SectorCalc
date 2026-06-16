// Auto-generated from time-management-calculator-schema.json
import * as z from 'zod';

export interface Time_management_calculatorInput {
  totalTasks: number;
  timePerTask: number;
  workers: number;
  efficiency: number;
  breakTimePerDay: number;
  workingHoursPerDay: number;
}

export const Time_management_calculatorInputSchema = z.object({
  totalTasks: z.number().default(10),
  timePerTask: z.number().default(30),
  workers: z.number().default(1),
  efficiency: z.number().default(100),
  breakTimePerDay: z.number().default(60),
  workingHoursPerDay: z.number().default(8),
});

function evaluateAllFormulas(input: Time_management_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.totalTasks * input.timePerTask) / input.workers; results["totalWorkMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["totalWorkMinutes"] = 0; }
  try { const v = (input.totalTasks * input.timePerTask) / (input.workers * (input.efficiency/100)); results["adjustedWorkMinutes"] = Number.isFinite(v) ? v : 0; } catch { results["adjustedWorkMinutes"] = 0; }
  try { const v = input.workingHoursPerDay * 60 - input.breakTimePerDay; results["effectiveMinutesPerDay"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveMinutesPerDay"] = 0; }
  try { const v = (input.totalTasks * input.timePerTask) / (input.workers * (input.efficiency/100) * (input.workingHoursPerDay * 60 - input.breakTimePerDay)); results["totalDays"] = Number.isFinite(v) ? v : 0; } catch { results["totalDays"] = 0; }
  return results;
}


export function calculateTime_management_calculator(input: Time_management_calculatorInput): Time_management_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalDays"] ?? 0;
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


export interface Time_management_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
