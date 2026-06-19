// Auto-generated from vitamin-calculator-schema.json
import * as z from 'zod';

export interface Vitamin_calculatorInput {
  rda: number;
  food1Servings: number;
  food1VitPerServing: number;
  food2Servings: number;
  food2VitPerServing: number;
  food3Servings: number;
  food3VitPerServing: number;
  dataConfidence?: number;
}

export const Vitamin_calculatorInputSchema = z.object({
  rda: z.number().default(90),
  food1Servings: z.number().default(1),
  food1VitPerServing: z.number().default(30),
  food2Servings: z.number().default(1),
  food2VitPerServing: z.number().default(20),
  food3Servings: z.number().default(1),
  food3VitPerServing: z.number().default(10),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Vitamin_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.food1Servings * input.food1VitPerServing + input.food2Servings * input.food2VitPerServing + input.food3Servings * input.food3VitPerServing; results["totalVitaminIntake"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["totalVitaminIntake"] = 0; }
  try { const v = ((asFormulaNumber(results["totalVitaminIntake"])) / input.rda) * 100; results["percentRDA"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["percentRDA"] = 0; }
  try { const v = input.rda - (asFormulaNumber(results["totalVitaminIntake"])); results["shortfallValue"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["shortfallValue"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateVitamin_calculator(input: Vitamin_calculatorInput): Vitamin_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["totalVitaminIntake"]));
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


export interface Vitamin_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
