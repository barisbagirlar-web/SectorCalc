// Auto-generated from time-management-calculator-schema.json
import * as z from 'zod';

export interface Time_management_calculatorInput {
  totalTasks: number;
  timePerTask: number;
  workers: number;
  efficiency: number;
  breakTimePerDay: number;
  workingHoursPerDay: number;
  dataConfidence?: number;
}

export const Time_management_calculatorInputSchema = z.object({
  totalTasks: z.number().default(10),
  timePerTask: z.number().default(30),
  workers: z.number().default(1),
  efficiency: z.number().default(100),
  breakTimePerDay: z.number().default(60),
  workingHoursPerDay: z.number().default(8),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Time_management_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.totalTasks * input.timePerTask) / input.workers; results["totalWorkMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalWorkMinutes"] = 0; }
  try { const v = (input.totalTasks * input.timePerTask) / (input.workers * (input.efficiency/100)); results["adjustedWorkMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustedWorkMinutes"] = 0; }
  try { const v = input.workingHoursPerDay * 60 - input.breakTimePerDay; results["effectiveMinutesPerDay"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["effectiveMinutesPerDay"] = 0; }
  try { const v = (input.totalTasks * input.timePerTask) / (input.workers * (input.efficiency/100) * (input.workingHoursPerDay * 60 - input.breakTimePerDay)); results["totalDays"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDays"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTime_management_calculator(input: Time_management_calculatorInput): Time_management_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalDays"]));
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof input.dataConfidence === "number"
      ? Math.max(0, totalWasteCost * (input.dataConfidence / 100))
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
