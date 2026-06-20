// Auto-generated from age-difference-calculator-schema.json
import * as z from 'zod';

export interface Age_difference_calculatorInput {
  person1Years: number;
  person1Months: number;
  person2Years: number;
  person2Months: number;
  dataConfidence?: number;
}

export const Age_difference_calculatorInputSchema = z.object({
  person1Years: z.number().default(30),
  person1Months: z.number().default(0),
  person2Years: z.number().default(25),
  person2Months: z.number().default(0),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Age_difference_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.person1Years + input.person1Months / 12; results["totalAge1"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalAge1"] = Number.NaN; }
  try { const v = input.person2Years + input.person2Months / 12; results["totalAge2"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["totalAge2"] = Number.NaN; }
  return results;
}


export function calculateAge_difference_calculator(input: Age_difference_calculatorInput): Age_difference_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalAge2"]);
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


export interface Age_difference_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
