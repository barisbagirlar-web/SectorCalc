// Auto-generated from sleep-debt-calculator-schema.json
import * as z from 'zod';

export interface Sleep_debt_calculatorInput {
  requiredSleepPerDay: number;
  actualSleepDay1: number;
  actualSleepDay2: number;
  actualSleepDay3: number;
  actualSleepDay4: number;
  actualSleepDay5: number;
  actualSleepDay6: number;
  actualSleepDay7: number;
}

export const Sleep_debt_calculatorInputSchema = z.object({
  requiredSleepPerDay: z.number().default(8),
  actualSleepDay1: z.number().default(8),
  actualSleepDay2: z.number().default(8),
  actualSleepDay3: z.number().default(8),
  actualSleepDay4: z.number().default(8),
  actualSleepDay5: z.number().default(8),
  actualSleepDay6: z.number().default(8),
  actualSleepDay7: z.number().default(8),
});

function evaluateAllFormulas(input: Sleep_debt_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = Math.max(input.requiredSleepPerDay - input.actualSleepDay1, 0) + Math.max(input.requiredSleepPerDay - input.actualSleepDay2, 0) + Math.max(input.requiredSleepPerDay - input.actualSleepDay3, 0) + Math.max(input.requiredSleepPerDay - input.actualSleepDay4, 0) + Math.max(input.requiredSleepPerDay - input.actualSleepDay5, 0) + Math.max(input.requiredSleepPerDay - input.actualSleepDay6, 0) + Math.max(input.requiredSleepPerDay - input.actualSleepDay7, 0); results["totalSleepDebt"] = Number.isFinite(v) ? v : 0; } catch { results["totalSleepDebt"] = 0; }
  try { const v = Math.max(input.requiredSleepPerDay - input.actualSleepDay1, 0); results["day1Debt"] = Number.isFinite(v) ? v : 0; } catch { results["day1Debt"] = 0; }
  try { const v = Math.max(input.requiredSleepPerDay - input.actualSleepDay2, 0); results["day2Debt"] = Number.isFinite(v) ? v : 0; } catch { results["day2Debt"] = 0; }
  try { const v = Math.max(input.requiredSleepPerDay - input.actualSleepDay3, 0); results["day3Debt"] = Number.isFinite(v) ? v : 0; } catch { results["day3Debt"] = 0; }
  try { const v = Math.max(input.requiredSleepPerDay - input.actualSleepDay4, 0); results["day4Debt"] = Number.isFinite(v) ? v : 0; } catch { results["day4Debt"] = 0; }
  try { const v = Math.max(input.requiredSleepPerDay - input.actualSleepDay5, 0); results["day5Debt"] = Number.isFinite(v) ? v : 0; } catch { results["day5Debt"] = 0; }
  try { const v = Math.max(input.requiredSleepPerDay - input.actualSleepDay6, 0); results["day6Debt"] = Number.isFinite(v) ? v : 0; } catch { results["day6Debt"] = 0; }
  try { const v = Math.max(input.requiredSleepPerDay - input.actualSleepDay7, 0); results["day7Debt"] = Number.isFinite(v) ? v : 0; } catch { results["day7Debt"] = 0; }
  return results;
}


export function calculateSleep_debt_calculator(input: Sleep_debt_calculatorInput): Sleep_debt_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["totalSleepDebt"] ?? 0;
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


export interface Sleep_debt_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
