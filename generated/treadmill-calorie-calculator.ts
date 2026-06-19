// Auto-generated from treadmill-calorie-calculator-schema.json
import * as z from 'zod';

export interface Treadmill_calorie_calculatorInput {
  weight: number;
  speed: number;
  incline: number;
  duration: number;
  exerciseType: number;
  dataConfidence?: number;
}

export const Treadmill_calorie_calculatorInputSchema = z.object({
  weight: z.number().default(70),
  speed: z.number().default(8),
  incline: z.number().default(0),
  duration: z.number().default(30),
  exerciseType: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Treadmill_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.speed * 1000 / 60; results["speedMperMin"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["speedMperMin"] = 0; }
  try { const v = input.incline / 100; results["grade"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["grade"] = 0; }
  try { const v = 3.5 + 0.1 * (asFormulaNumber(results["speedMperMin"])) + 1.8 * (asFormulaNumber(results["speedMperMin"])) * (asFormulaNumber(results["grade"])); results["VO2walking"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["VO2walking"] = 0; }
  try { const v = 3.5 + 0.2 * (asFormulaNumber(results["speedMperMin"])) + 0.9 * (asFormulaNumber(results["speedMperMin"])) * (asFormulaNumber(results["grade"])); results["VO2running"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["VO2running"] = 0; }
  try { const v = (asFormulaNumber(results["VO2walking"])) / 3.5; results["MET_walking"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["MET_walking"] = 0; }
  try { const v = (asFormulaNumber(results["VO2running"])) / 3.5; results["MET_running"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["MET_running"] = 0; }
  try { const v = (1 - input.exerciseType) * (asFormulaNumber(results["MET_walking"])) + input.exerciseType * (asFormulaNumber(results["MET_running"])); results["MET"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["MET"] = 0; }
  try { const v = (asFormulaNumber(results["MET"])) * input.weight * (input.duration / 60); results["calories"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["calories"] = 0; }
  try { const v = input.speed * (input.duration / 60); results["distance"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["distance"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTreadmill_calorie_calculator(input: Treadmill_calorie_calculatorInput): Treadmill_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["calories"]));
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


export interface Treadmill_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
