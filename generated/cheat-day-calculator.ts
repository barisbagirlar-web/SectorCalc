// Auto-generated from cheat-day-calculator-schema.json
import * as z from 'zod';

export interface Cheat_day_calculatorInput {
  normalDailyOutput: number;
  cheatDayOutputPercent: number;
  numCheatDays: number;
  totalDays: number;
}

export const Cheat_day_calculatorInputSchema = z.object({
  normalDailyOutput: z.number().default(100),
  cheatDayOutputPercent: z.number().default(50),
  numCheatDays: z.number().default(1),
  totalDays: z.number().default(30),
});

function evaluateAllFormulas(input: Cheat_day_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.normalDailyOutput * (input.totalDays - input.numCheatDays); results["normalContribution"] = Number.isFinite(v) ? v : 0; } catch { results["normalContribution"] = 0; }
  try { const v = input.normalDailyOutput * (input.cheatDayOutputPercent / 100) * input.numCheatDays; results["cheatContribution"] = Number.isFinite(v) ? v : 0; } catch { results["cheatContribution"] = 0; }
  try { const v = input.normalDailyOutput * (input.totalDays - input.numCheatDays) + input.normalDailyOutput * (input.cheatDayOutputPercent / 100) * input.numCheatDays; results["effectiveOutput"] = Number.isFinite(v) ? v : 0; } catch { results["effectiveOutput"] = 0; }
  try { const v = input.normalDailyOutput * input.totalDays; results["potentialFullOutput"] = Number.isFinite(v) ? v : 0; } catch { results["potentialFullOutput"] = 0; }
  try { const v = input.normalDailyOutput * input.totalDays - (input.normalDailyOutput * (input.totalDays - input.numCheatDays) + input.normalDailyOutput * (input.cheatDayOutputPercent / 100) * input.numCheatDays); results["loss"] = Number.isFinite(v) ? v : 0; } catch { results["loss"] = 0; }
  return results;
}


export function calculateCheat_day_calculator(input: Cheat_day_calculatorInput): Cheat_day_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["effectiveOutput"] ?? 0;
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
