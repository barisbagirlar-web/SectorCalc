// Auto-generated from turkey-cooking-time-calculator-schema.json
import * as z from 'zod';

export interface Turkey_cooking_time_calculatorInput {
  weightKg: number;
  ovenTempC: number;
  isStuffed: number;
  startTempC: number;
  dataConfidence?: number;
}

export const Turkey_cooking_time_calculatorInputSchema = z.object({
  weightKg: z.number().default(5),
  ovenTempC: z.number().default(175),
  isStuffed: z.number().default(0),
  startTempC: z.number().default(4),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Turkey_cooking_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weightKg * 2.20462; results["weightLbs"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["weightLbs"] = Number.NaN; }
  try { const v = input.ovenTempC * 9/5 + 32; results["ovenTempF"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["ovenTempF"] = Number.NaN; }
  try { const v = input.isStuffed * 5; results["stuffingRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["stuffingRate"] = Number.NaN; }
  try { const v = 17.5 + (toNumericFormulaValue(results["stuffingRate"])); results["baseRate"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseRate"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["weightLbs"])) * (toNumericFormulaValue(results["baseRate"])); results["baseTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["baseTime"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["baseTime"])) * (325 / (toNumericFormulaValue(results["ovenTempF"]))); results["adjustedTime"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["adjustedTime"] = Number.NaN; }
  try { const v = (74 - input.startTempC) / 70; results["startFactor"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["startFactor"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["adjustedTime"])) * (toNumericFormulaValue(results["startFactor"])); results["finalTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["finalTimeMinutes"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["finalTimeMinutes"])) / 60; results["finalTimeHours"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["finalTimeHours"] = Number.NaN; }
  return results;
}


export function calculateTurkey_cooking_time_calculator(input: Turkey_cooking_time_calculatorInput): Turkey_cooking_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["finalTimeMinutes"]);
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


export interface Turkey_cooking_time_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
