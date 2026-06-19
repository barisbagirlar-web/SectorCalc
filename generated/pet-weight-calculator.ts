// Auto-generated from pet-weight-calculator-schema.json
import * as z from 'zod';

export interface Pet_weight_calculatorInput {
  body_length: number;
  chest_girth: number;
  age_months: number;
  condition_factor: number;
  dataConfidence?: number;
}

export const Pet_weight_calculatorInputSchema = z.object({
  body_length: z.number().default(30),
  chest_girth: z.number().default(40),
  age_months: z.number().default(12),
  condition_factor: z.number().default(3),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Pet_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.body_length * input.chest_girth) / 200; results["baseWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["baseWeight"] = 0; }
  try { const v = input.age_months < 12 ? (input.age_months / 12) : 1; results["ageFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["ageFactor"] = 0; }
  try { const v = (asFormulaNumber(results["baseWeight"])) * (asFormulaNumber(results["ageFactor"])) * (input.condition_factor / 3); results["targetWeight"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["targetWeight"] = 0; }
  try { const v = (asFormulaNumber(results["targetWeight"])) * 0.85; results["healthyLower"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["healthyLower"] = 0; }
  try { const v = (asFormulaNumber(results["targetWeight"])) * 1.15; results["healthyUpper"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["healthyUpper"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculatePet_weight_calculator(input: Pet_weight_calculatorInput): Pet_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["healthyUpper"]);
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


export interface Pet_weight_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
