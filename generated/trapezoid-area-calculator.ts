// Auto-generated from trapezoid-area-calculator-schema.json
import * as z from 'zod';

export interface Trapezoid_area_calculatorInput {
  base1: number;
  base2: number;
  height: number;
  outputUnitSelection: number;
  dataConfidence?: number;
}

export const Trapezoid_area_calculatorInputSchema = z.object({
  base1: z.number().default(0),
  base2: z.number().default(0),
  height: z.number().default(0),
  outputUnitSelection: z.number().default(1),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Trapezoid_area_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.base1 + input.base2; results["sumOfBases"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["sumOfBases"] = 0; }
  try { const v = (asFormulaNumber(results["sumOfBases"])) / 2; results["halfSumOfBases"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["halfSumOfBases"] = 0; }
  try { const v = (asFormulaNumber(results["halfSumOfBases"])) * input.height; results["area"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["area"] = 0; }
  try { const v = input.outputUnitSelection === 1 ? 1 : (input.outputUnitSelection === 2 ? 0.01 : (input.outputUnitSelection === 3 ? 0.000001 : 1)); results["conversionFactor"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["conversionFactor"] = 0; }
  try { const v = (asFormulaNumber(results["area"])) * (asFormulaNumber(results["conversionFactor"])); results["finalArea"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["finalArea"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateTrapezoid_area_calculator(input: Trapezoid_area_calculatorInput): Trapezoid_area_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["finalArea"]));
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


export interface Trapezoid_area_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
