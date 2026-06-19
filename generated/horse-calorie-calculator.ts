// Auto-generated from horse-calorie-calculator-schema.json
import * as z from 'zod';

export interface Horse_calorie_calculatorInput {
  bodyWeight: number;
  activityLevel: number;
  pregnancyStage: number;
  lactationStage: number;
  ageFactor: number;
  dataConfidence?: number;
}

export const Horse_calorie_calculatorInputSchema = z.object({
  bodyWeight: z.number().default(500),
  activityLevel: z.number().default(1.2),
  pregnancyStage: z.number().default(1),
  lactationStage: z.number().default(1),
  ageFactor: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Horse_calorie_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = 1.4 + 0.03 * (input.bodyWeight * 2.20462); results["maintenanceDE"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["maintenanceDE"] = 0; }
  try { const v = (asFormulaNumber(results["maintenanceDE"])) * input.activityLevel * input.pregnancyStage * input.lactationStage * input.ageFactor; results["totalDailyDE"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalDailyDE"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHorse_calorie_calculator(input: Horse_calorie_calculatorInput): Horse_calorie_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalDailyDE"]);
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


export interface Horse_calorie_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
