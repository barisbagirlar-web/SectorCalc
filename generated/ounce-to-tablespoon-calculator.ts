// Auto-generated from ounce-to-tablespoon-calculator-schema.json
import * as z from 'zod';

export interface Ounce_to_tablespoon_calculatorInput {
  fluidOunces: number;
  conversionFactor: number;
  decimalPlaces: number;
  safetyFactor: number;
  dataConfidence?: number;
}

export const Ounce_to_tablespoon_calculatorInputSchema = z.object({
  fluidOunces: z.number().default(1),
  conversionFactor: z.number().default(2),
  decimalPlaces: z.number().default(2),
  safetyFactor: z.number().default(0),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Ounce_to_tablespoon_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.fluidOunces * input.conversionFactor; results["rawTablespoons"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["rawTablespoons"] = 0; }
  try { const v = (asFormulaNumber(results["rawTablespoons"])) * (1 + input.safetyFactor / 100); results["adjustedTablespoons"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["adjustedTablespoons"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateOunce_to_tablespoon_calculator(input: Ounce_to_tablespoon_calculatorInput): Ounce_to_tablespoon_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["adjustedTablespoons"]);
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


export interface Ounce_to_tablespoon_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
