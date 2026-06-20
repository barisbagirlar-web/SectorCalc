// Auto-generated from bakers-percentage-calculator-schema.json
import * as z from 'zod';

export interface Bakers_percentage_calculatorInput {
  flourWeight: number;
  waterPercentage: number;
  yeastPercentage: number;
  saltPercentage: number;
  sugarPercentage: number;
  fatPercentage: number;
  dataConfidence?: number;
}

export const Bakers_percentage_calculatorInputSchema = z.object({
  flourWeight: z.number().default(1000),
  waterPercentage: z.number().default(60),
  yeastPercentage: z.number().default(1),
  saltPercentage: z.number().default(2),
  sugarPercentage: z.number().default(0),
  fatPercentage: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Bakers_percentage_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.flourWeight * input.waterPercentage / 100; results["waterWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["waterWeight"] = Number.NaN; }
  try { const v = input.flourWeight * input.yeastPercentage / 100; results["yeastWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yeastWeight"] = Number.NaN; }
  try { const v = input.flourWeight * input.saltPercentage / 100; results["saltWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["saltWeight"] = Number.NaN; }
  try { const v = input.flourWeight * input.sugarPercentage / 100; results["sugarWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["sugarWeight"] = Number.NaN; }
  try { const v = input.flourWeight * input.fatPercentage / 100; results["fatWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["fatWeight"] = Number.NaN; }
  try { const v = input.flourWeight + (toNumericFormulaValue(results["waterWeight"])) + (toNumericFormulaValue(results["yeastWeight"])) + (toNumericFormulaValue(results["saltWeight"])) + (toNumericFormulaValue(results["sugarWeight"])) + (toNumericFormulaValue(results["fatWeight"])); results["totalDoughWeight"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalDoughWeight"] = Number.NaN; }
  return results;
}


export function calculateBakers_percentage_calculator(input: Bakers_percentage_calculatorInput): Bakers_percentage_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalDoughWeight"]);
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


export interface Bakers_percentage_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
