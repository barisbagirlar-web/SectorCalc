// Auto-generated from net-carb-calculator-schema.json
import * as z from 'zod';

export interface Net_carb_calculatorInput {
  totalCarbs: number;
  dietaryFiber: number;
  sugarAlcohols: number;
  dataConfidence?: number;
}

export const Net_carb_calculatorInputSchema = z.object({
  totalCarbs: z.number().default(30),
  dietaryFiber: z.number().default(5),
  sugarAlcohols: z.number().default(2),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Net_carb_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.totalCarbs - input.dietaryFiber - input.sugarAlcohols; results["netCarbs"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["netCarbs"] = 0; }
  try { const v = input.totalCarbs; results["totalCarbs"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalCarbs"] = 0; }
  try { const v = input.dietaryFiber; results["dietaryFiber"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["dietaryFiber"] = 0; }
  try { const v = input.sugarAlcohols; results["sugarAlcohols"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sugarAlcohols"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateNet_carb_calculator(input: Net_carb_calculatorInput): Net_carb_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["netCarbs"]));
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


export interface Net_carb_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
