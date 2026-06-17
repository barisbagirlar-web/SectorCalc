// Auto-generated from pet-weight-calculator-schema.json
import * as z from 'zod';

export interface Pet_weight_calculatorInput {
  body_length: number;
  chest_girth: number;
  age_months: number;
  condition_factor: number;
}

export const Pet_weight_calculatorInputSchema = z.object({
  body_length: z.number().default(30),
  chest_girth: z.number().default(40),
  age_months: z.number().default(12),
  condition_factor: z.number().default(3),
});

function evaluateAllFormulas(input: Pet_weight_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.body_length * input.chest_girth) / 200; results["baseWeight"] = Number.isFinite(v) ? v : 0; } catch { results["baseWeight"] = 0; }
  try { const v = input.age_months < 12 ? (input.age_months / 12) : 1; results["ageFactor"] = Number.isFinite(v) ? v : 0; } catch { results["ageFactor"] = 0; }
  try { const v = (results["baseWeight"] ?? 0) * (results["ageFactor"] ?? 0) * (input.condition_factor / 3); results["targetWeight"] = Number.isFinite(v) ? v : 0; } catch { results["targetWeight"] = 0; }
  try { const v = (results["targetWeight"] ?? 0) * 0.85; results["healthyLower"] = Number.isFinite(v) ? v : 0; } catch { results["healthyLower"] = 0; }
  try { const v = (results["targetWeight"] ?? 0) * 1.15; results["healthyUpper"] = Number.isFinite(v) ? v : 0; } catch { results["healthyUpper"] = 0; }
  results["____healthyLower_toFixed_1____________he"] = 0;
  results["____targetWeight_toFixed_1______kg_"] = 0;
  try { const v = (results["targetWeight"] ?? 0).toFixed(1) + ' kg'; results["result"] = Number.isFinite(v) ? v : 0; } catch { results["result"] = 0; }
  return results;
}


export function calculatePet_weight_calculator(input: Pet_weight_calculatorInput): Pet_weight_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["result"] ?? 0;
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = [];
  const dataConfidenceAdjusted =
    typeof (input as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as Record<string, unknown>).dataConfidence as number) / 100)
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
