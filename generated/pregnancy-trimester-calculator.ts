// Auto-generated from pregnancy-trimester-calculator-schema.json
import * as z from 'zod';

export interface Pregnancy_trimester_calculatorInput {
  lmpDay: number;
  lmpMonth: number;
  lmpYear: number;
  currentDay: number;
  currentMonth: number;
  currentYear: number;
}

export const Pregnancy_trimester_calculatorInputSchema = z.object({
  lmpDay: z.number().default(1),
  lmpMonth: z.number().default(1),
  lmpYear: z.number().default(2024),
  currentDay: z.number().default(1),
  currentMonth: z.number().default(1),
  currentYear: z.number().default(2024),
});

function evaluateAllFormulas(input: Pregnancy_trimester_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.currentYear - input.lmpYear)*365 + (input.currentMonth - input.lmpMonth)*30 + (input.currentDay - input.lmpDay); results["totalDaysDifference"] = Number.isFinite(v) ? v : 0; } catch { results["totalDaysDifference"] = 0; }
  try { const v = Math.floor((results["totalDaysDifference"] ?? 0) / 7); results["gestationalWeeks"] = Number.isFinite(v) ? v : 0; } catch { results["gestationalWeeks"] = 0; }
  try { const v = (results["totalDaysDifference"] ?? 0) % 7; results["gestationalDays"] = Number.isFinite(v) ? v : 0; } catch { results["gestationalDays"] = 0; }
  try { const v = (results["gestationalWeeks"] ?? 0) < 14 ? 1 : ((results["gestationalWeeks"] ?? 0) < 28 ? 2 : 3); results["trimester"] = Number.isFinite(v) ? v : 0; } catch { results["trimester"] = 0; }
  try { const v = input.lmpYear*365 + input.lmpMonth*30 + input.lmpDay; results["lmpTotalDays"] = Number.isFinite(v) ? v : 0; } catch { results["lmpTotalDays"] = 0; }
  try { const v = (results["lmpTotalDays"] ?? 0) + 280; results["dueTotalDays"] = Number.isFinite(v) ? v : 0; } catch { results["dueTotalDays"] = 0; }
  try { const v = Math.floor((results["dueTotalDays"] ?? 0) / 365); results["dueYear"] = Number.isFinite(v) ? v : 0; } catch { results["dueYear"] = 0; }
  try { const v = (results["dueTotalDays"] ?? 0) % 365; results["remainingAfterYear"] = Number.isFinite(v) ? v : 0; } catch { results["remainingAfterYear"] = 0; }
  try { const v = Math.floor((results["remainingAfterYear"] ?? 0) / 30); results["dueMonth"] = Number.isFinite(v) ? v : 0; } catch { results["dueMonth"] = 0; }
  try { const v = (results["remainingAfterYear"] ?? 0) % 30; results["dueDay"] = Number.isFinite(v) ? v : 0; } catch { results["dueDay"] = 0; }
  try { const v = (results["dueMonth"] ?? 0) + '/' + (results["dueDay"] ?? 0) + '/' + (results["dueYear"] ?? 0); results["dueDateString"] = Number.isFinite(v) ? v : 0; } catch { results["dueDateString"] = 0; }
  try { const v = (results["gestationalWeeks"] ?? 0) + ' weeks ' + (results["gestationalDays"] ?? 0) + ' days'; results["gestationalString"] = Number.isFinite(v) ? v : 0; } catch { results["gestationalString"] = 0; }
  return results;
}


export function calculatePregnancy_trimester_calculator(input: Pregnancy_trimester_calculatorInput): Pregnancy_trimester_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["trimester"] ?? 0;
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


export interface Pregnancy_trimester_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
