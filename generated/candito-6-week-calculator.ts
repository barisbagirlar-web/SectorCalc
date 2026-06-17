// Auto-generated from candito-6-week-calculator-schema.json
import * as z from 'zod';

export interface Candito_6_week_calculatorInput {
  squat1RM: number;
  bench1RM: number;
  deadlift1RM: number;
  trainingMaxPercent: number;
}

export const Candito_6_week_calculatorInputSchema = z.object({
  squat1RM: z.number().default(140),
  bench1RM: z.number().default(100),
  deadlift1RM: z.number().default(180),
  trainingMaxPercent: z.number().default(90),
});

function evaluateAllFormulas(input: Candito_6_week_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.squat1RM * input.trainingMaxPercent / 100; results["squatTM"] = Number.isFinite(v) ? v : 0; } catch { results["squatTM"] = 0; }
  try { const v = input.bench1RM * input.trainingMaxPercent / 100; results["benchTM"] = Number.isFinite(v) ? v : 0; } catch { results["benchTM"] = 0; }
  try { const v = input.deadlift1RM * input.trainingMaxPercent / 100; results["deadliftTM"] = Number.isFinite(v) ? v : 0; } catch { results["deadliftTM"] = 0; }
  try { const v = (results["squatTM"] ?? 0) * 0.775; results["squatWeek1"] = Number.isFinite(v) ? v : 0; } catch { results["squatWeek1"] = 0; }
  try { const v = (results["squatTM"] ?? 0) * 0.80; results["squatWeek2"] = Number.isFinite(v) ? v : 0; } catch { results["squatWeek2"] = 0; }
  try { const v = (results["squatTM"] ?? 0) * 0.825; results["squatWeek3"] = Number.isFinite(v) ? v : 0; } catch { results["squatWeek3"] = 0; }
  try { const v = (results["squatTM"] ?? 0) * 0.85; results["squatWeek4"] = Number.isFinite(v) ? v : 0; } catch { results["squatWeek4"] = 0; }
  try { const v = (results["squatTM"] ?? 0) * 0.875; results["squatWeek5"] = Number.isFinite(v) ? v : 0; } catch { results["squatWeek5"] = 0; }
  try { const v = (results["squatTM"] ?? 0) * 1.0; results["squatWeek6"] = Number.isFinite(v) ? v : 0; } catch { results["squatWeek6"] = 0; }
  try { const v = (results["benchTM"] ?? 0) * 0.775; results["benchWeek1"] = Number.isFinite(v) ? v : 0; } catch { results["benchWeek1"] = 0; }
  try { const v = (results["benchTM"] ?? 0) * 0.80; results["benchWeek2"] = Number.isFinite(v) ? v : 0; } catch { results["benchWeek2"] = 0; }
  try { const v = (results["benchTM"] ?? 0) * 0.825; results["benchWeek3"] = Number.isFinite(v) ? v : 0; } catch { results["benchWeek3"] = 0; }
  try { const v = (results["benchTM"] ?? 0) * 0.85; results["benchWeek4"] = Number.isFinite(v) ? v : 0; } catch { results["benchWeek4"] = 0; }
  try { const v = (results["benchTM"] ?? 0) * 0.875; results["benchWeek5"] = Number.isFinite(v) ? v : 0; } catch { results["benchWeek5"] = 0; }
  try { const v = (results["benchTM"] ?? 0) * 1.0; results["benchWeek6"] = Number.isFinite(v) ? v : 0; } catch { results["benchWeek6"] = 0; }
  try { const v = (results["deadliftTM"] ?? 0) * 0.775; results["deadliftWeek1"] = Number.isFinite(v) ? v : 0; } catch { results["deadliftWeek1"] = 0; }
  try { const v = (results["deadliftTM"] ?? 0) * 0.80; results["deadliftWeek2"] = Number.isFinite(v) ? v : 0; } catch { results["deadliftWeek2"] = 0; }
  try { const v = (results["deadliftTM"] ?? 0) * 0.825; results["deadliftWeek3"] = Number.isFinite(v) ? v : 0; } catch { results["deadliftWeek3"] = 0; }
  try { const v = (results["deadliftTM"] ?? 0) * 0.85; results["deadliftWeek4"] = Number.isFinite(v) ? v : 0; } catch { results["deadliftWeek4"] = 0; }
  try { const v = (results["deadliftTM"] ?? 0) * 0.875; results["deadliftWeek5"] = Number.isFinite(v) ? v : 0; } catch { results["deadliftWeek5"] = 0; }
  try { const v = (results["deadliftTM"] ?? 0) * 1.0; results["deadliftWeek6"] = Number.isFinite(v) ? v : 0; } catch { results["deadliftWeek6"] = 0; }
  results["Squat__squatWeek1__kg__Bench__benchWeek1"] = 0;
  results["Squat__squatWeek2__kg__Bench__benchWeek2"] = 0;
  results["Squat__squatWeek3__kg__Bench__benchWeek3"] = 0;
  results["Squat__squatWeek4__kg__Bench__benchWeek4"] = 0;
  results["Squat__squatWeek5__kg__Bench__benchWeek5"] = 0;
  results["Squat__squatWeek6__kg__Bench__benchWeek6"] = 0;
  results["result"] = 0;
  return results;
}


export function calculateCandito_6_week_calculator(input: Candito_6_week_calculatorInput): Candito_6_week_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
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


export interface Candito_6_week_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
