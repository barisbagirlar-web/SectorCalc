// @ts-nocheck
// Auto-generated from standard-drink-calculator-schema.json
import * as z from 'zod';

export interface Standard_drink_calculatorInput {
  volume: number;
  abv: number;
  standardGrams: number;
  quantity: number;
}

export const Standard_drink_calculatorInputSchema = z.object({
  volume: z.number().default(330),
  abv: z.number().default(5),
  standardGrams: z.number().default(14),
  quantity: z.number().default(1),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Standard_drink_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.volume * (input.abv / 100) * 0.789; results["gramsAlcohol"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["gramsAlcohol"] = 0; }
  try { const v = ((asFormulaNumber(results["gramsAlcohol"])) * input.quantity) / input.standardGrams; results["totalStandardDrinks"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["totalStandardDrinks"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateStandard_drink_calculator(input: Standard_drink_calculatorInput): Standard_drink_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["totalStandardDrinks"]);
  const breakdown = {
    
  };
  const hiddenLossDrivers: string[] = [];
  const suggestedActions: string[] = ["Review inputs and verify results against site standards."];
  const dataConfidenceAdjusted =
    typeof (input as unknown as Record<string, unknown>).dataConfidence === "number"
      ? totalWasteCost * (((input as unknown as Record<string, unknown>).dataConfidence as number) / 100)
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


export interface Standard_drink_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
