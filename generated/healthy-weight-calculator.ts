// Auto-generated from healthy-weight-calculator-schema.json
import * as z from 'zod';

export interface Healthy_weight_calculatorInput {
  height: number;
  weight: number;
  age: number;
  waist: number;
  hip: number;
  dataConfidence?: number;
}

export const Healthy_weight_calculatorInputSchema = z.object({
  height: z.number().default(170),
  weight: z.number().default(70),
  age: z.number().default(30),
  waist: z.number().default(80),
  hip: z.number().default(100),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Healthy_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.weight / ((input.height / 100) ** 2); results["bmi"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["bmi"] = 0; }
  try { const v = input.waist / input.height; results["whtr"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["whtr"] = 0; }
  try { const v = input.waist / input.hip; results["whr"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["whr"] = 0; }
  try { const v = 18.5 * ((input.height / 100) ** 2); results["ideal_min"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ideal_min"] = 0; }
  try { const v = 24.9 * ((input.height / 100) ** 2); results["ideal_max"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ideal_max"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateHealthy_weight_calculator(input: Healthy_weight_calculatorInput): Healthy_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["bmi"]));
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


export interface Healthy_weight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
