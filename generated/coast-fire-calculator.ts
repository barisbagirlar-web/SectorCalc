// Auto-generated from coast-fire-calculator-schema.json
import * as z from 'zod';

export interface Coast_fire_calculatorInput {
  currentAge: number;
  retirementAge: number;
  annualReturnRate: number;
  fireTarget: number;
  dataConfidence?: number;
}

export const Coast_fire_calculatorInputSchema = z.object({
  currentAge: z.number().default(30),
  retirementAge: z.number().default(65),
  annualReturnRate: z.number().default(7),
  fireTarget: z.number().default(1000000),
});

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Coast_fire_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.retirementAge - input.currentAge; results["yearsToRetirement"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yearsToRetirement"] = Number.NaN; }
  try { const v = input.retirementAge - input.currentAge; results["yearsToRetirement_aux"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yearsToRetirement_aux"] = Number.NaN; }
  return results;
}


export function calculateCoast_fire_calculator(input: Coast_fire_calculatorInput): Coast_fire_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["yearsToRetirement_aux"]);
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


export interface Coast_fire_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
