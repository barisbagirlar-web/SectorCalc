// Auto-generated from candito-6-week-calculator-schema.json
import * as z from 'zod';

export interface Candito_6_week_calculatorInput {
  squat1RM: number;
  bench1RM: number;
  deadlift1RM: number;
  trainingMaxPercent: number;
  dataConfidence?: number;
}

export const Candito_6_week_calculatorInputSchema = z.object({
  squat1RM: z.number().default(140),
  bench1RM: z.number().default(100),
  deadlift1RM: z.number().default(180),
  trainingMaxPercent: z.number().default(90),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Candito_6_week_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.squat1RM * input.trainingMaxPercent / 100; results["squatTM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["squatTM"] = Number.NaN; }
  try { const v = input.bench1RM * input.trainingMaxPercent / 100; results["benchTM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["benchTM"] = Number.NaN; }
  try { const v = input.deadlift1RM * input.trainingMaxPercent / 100; results["deadliftTM"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deadliftTM"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["squatTM"])) * 0.775; results["squatWeek1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["squatWeek1"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["squatTM"])) * 0.80; results["squatWeek2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["squatWeek2"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["squatTM"])) * 0.825; results["squatWeek3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["squatWeek3"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["squatTM"])) * 0.85; results["squatWeek4"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["squatWeek4"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["squatTM"])) * 0.875; results["squatWeek5"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["squatWeek5"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["squatTM"])) * 1.0; results["squatWeek6"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["squatWeek6"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["benchTM"])) * 0.775; results["benchWeek1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["benchWeek1"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["benchTM"])) * 0.80; results["benchWeek2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["benchWeek2"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["benchTM"])) * 0.825; results["benchWeek3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["benchWeek3"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["benchTM"])) * 0.85; results["benchWeek4"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["benchWeek4"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["benchTM"])) * 0.875; results["benchWeek5"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["benchWeek5"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["benchTM"])) * 1.0; results["benchWeek6"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["benchWeek6"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["deadliftTM"])) * 0.775; results["deadliftWeek1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deadliftWeek1"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["deadliftTM"])) * 0.80; results["deadliftWeek2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deadliftWeek2"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["deadliftTM"])) * 0.825; results["deadliftWeek3"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deadliftWeek3"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["deadliftTM"])) * 0.85; results["deadliftWeek4"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deadliftWeek4"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["deadliftTM"])) * 0.875; results["deadliftWeek5"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deadliftWeek5"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["deadliftTM"])) * 1.0; results["deadliftWeek6"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["deadliftWeek6"] = Number.NaN; }
  return results;
}


export function calculateCandito_6_week_calculator(input: Candito_6_week_calculatorInput): Candito_6_week_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["deadliftWeek6"]);
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


export interface Candito_6_week_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
