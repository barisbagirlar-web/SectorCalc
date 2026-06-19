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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Turkey_cooking_time_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weightKg * 2.20462; results["weightLbs"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["weightLbs"] = 0; }
  try { const v = input.ovenTempC * 9/5 + 32; results["ovenTempF"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ovenTempF"] = 0; }
  try { const v = input.isStuffed * 5; results["stuffingRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["stuffingRate"] = 0; }
  try { const v = 17.5 + (asFormulaNumber(results["stuffingRate"])); results["baseRate"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["baseRate"] = 0; }
  try { const v = (asFormulaNumber(results["weightLbs"])) * (asFormulaNumber(results["baseRate"])); results["baseTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["baseTime"] = 0; }
  try { const v = (asFormulaNumber(results["baseTime"])) * (325 / (asFormulaNumber(results["ovenTempF"]))); results["adjustedTime"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustedTime"] = 0; }
  try { const v = (74 - input.startTempC) / 70; results["startFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["startFactor"] = 0; }
  try { const v = (asFormulaNumber(results["adjustedTime"])) * (asFormulaNumber(results["startFactor"])); results["finalTimeMinutes"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["finalTimeMinutes"] = 0; }
  try { const v = (asFormulaNumber(results["finalTimeMinutes"])) / 60; results["finalTimeHours"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["finalTimeHours"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTurkey_cooking_time_calculator(input: Turkey_cooking_time_calculatorInput): Turkey_cooking_time_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["finalTimeMinutes"]));
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


export interface Turkey_cooking_time_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
