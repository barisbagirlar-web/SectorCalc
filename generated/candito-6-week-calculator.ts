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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Candito_6_week_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.squat1RM * input.trainingMaxPercent / 100; results["squatTM"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["squatTM"] = 0; }
  try { const v = input.bench1RM * input.trainingMaxPercent / 100; results["benchTM"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["benchTM"] = 0; }
  try { const v = input.deadlift1RM * input.trainingMaxPercent / 100; results["deadliftTM"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["deadliftTM"] = 0; }
  try { const v = (asFormulaNumber(results["squatTM"])) * 0.775; results["squatWeek1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["squatWeek1"] = 0; }
  try { const v = (asFormulaNumber(results["squatTM"])) * 0.80; results["squatWeek2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["squatWeek2"] = 0; }
  try { const v = (asFormulaNumber(results["squatTM"])) * 0.825; results["squatWeek3"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["squatWeek3"] = 0; }
  try { const v = (asFormulaNumber(results["squatTM"])) * 0.85; results["squatWeek4"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["squatWeek4"] = 0; }
  try { const v = (asFormulaNumber(results["squatTM"])) * 0.875; results["squatWeek5"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["squatWeek5"] = 0; }
  try { const v = (asFormulaNumber(results["squatTM"])) * 1.0; results["squatWeek6"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["squatWeek6"] = 0; }
  try { const v = (asFormulaNumber(results["benchTM"])) * 0.775; results["benchWeek1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["benchWeek1"] = 0; }
  try { const v = (asFormulaNumber(results["benchTM"])) * 0.80; results["benchWeek2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["benchWeek2"] = 0; }
  try { const v = (asFormulaNumber(results["benchTM"])) * 0.825; results["benchWeek3"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["benchWeek3"] = 0; }
  try { const v = (asFormulaNumber(results["benchTM"])) * 0.85; results["benchWeek4"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["benchWeek4"] = 0; }
  try { const v = (asFormulaNumber(results["benchTM"])) * 0.875; results["benchWeek5"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["benchWeek5"] = 0; }
  try { const v = (asFormulaNumber(results["benchTM"])) * 1.0; results["benchWeek6"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["benchWeek6"] = 0; }
  try { const v = (asFormulaNumber(results["deadliftTM"])) * 0.775; results["deadliftWeek1"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["deadliftWeek1"] = 0; }
  try { const v = (asFormulaNumber(results["deadliftTM"])) * 0.80; results["deadliftWeek2"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["deadliftWeek2"] = 0; }
  try { const v = (asFormulaNumber(results["deadliftTM"])) * 0.825; results["deadliftWeek3"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["deadliftWeek3"] = 0; }
  try { const v = (asFormulaNumber(results["deadliftTM"])) * 0.85; results["deadliftWeek4"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["deadliftWeek4"] = 0; }
  try { const v = (asFormulaNumber(results["deadliftTM"])) * 0.875; results["deadliftWeek5"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["deadliftWeek5"] = 0; }
  try { const v = (asFormulaNumber(results["deadliftTM"])) * 1.0; results["deadliftWeek6"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["deadliftWeek6"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCandito_6_week_calculator(input: Candito_6_week_calculatorInput): Candito_6_week_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["deadliftWeek6"]));
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


export interface Candito_6_week_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
