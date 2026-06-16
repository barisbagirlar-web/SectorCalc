// Auto-generated from cheat-day-calculator-schema.json
import * as z from 'zod';

export interface Cheat_day_calculatorInput {
  normalOEE: number;
  targetWeeklyOEE: number;
  workingDays: number;
  cheatDays: number;
}

export const Cheat_day_calculatorInputSchema = z.object({
  normalOEE: z.number().default(85),
  targetWeeklyOEE: z.number().default(80),
  workingDays: z.number().default(5),
  cheatDays: z.number().default(1),
});

function evaluateAllFormulas(input: Cheat_day_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.targetWeeklyOEE * input.workingDays - input.normalOEE * (input.workingDays - input.cheatDays)) / input.cheatDays; results["requiredCheatDayOEE"] = Number.isFinite(v) ? v : 0; } catch { results["requiredCheatDayOEE"] = 0; }
  try { const v = input.normalOEE * (input.workingDays - input.cheatDays) / input.workingDays; results["normalContribution"] = Number.isFinite(v) ? v : 0; } catch { results["normalContribution"] = 0; }
  try { const v = (results["requiredCheatDayOEE"] ?? 0) * input.cheatDays / input.workingDays; results["cheatContribution"] = Number.isFinite(v) ? v : 0; } catch { results["cheatContribution"] = 0; }
  try { const v = (results["normalContribution"] ?? 0) + (results["cheatContribution"] ?? 0); results["weeklyOEECheck"] = Number.isFinite(v) ? v : 0; } catch { results["weeklyOEECheck"] = 0; }
  return results;
}


export function calculateCheat_day_calculator(input: Cheat_day_calculatorInput): Cheat_day_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["requiredCheatDayOEE"] ?? 0;
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


export interface Cheat_day_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
