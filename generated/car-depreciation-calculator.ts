// Auto-generated from car-depreciation-calculator-schema.json
import * as z from 'zod';

export interface Car_depreciation_calculatorInput {
  purchasePrice: number;
  residualValuePercentage: number;
  currentAge: number;
  expectedLifespan: number;
  mileage: number;
  expectedMileage: number;
  dataConfidence?: number;
}

export const Car_depreciation_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(30000),
  residualValuePercentage: z.number().default(20),
  currentAge: z.number().default(5),
  expectedLifespan: z.number().default(15),
  mileage: z.number().default(100000),
  expectedMileage: z.number().default(300000),
});

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Car_depreciation_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = (input.purchasePrice - input.purchasePrice * input.residualValuePercentage/100) / input.expectedLifespan; results["annualDepreciation"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annualDepreciation"] = 0; }
  try { const v = (input.purchasePrice - input.purchasePrice * input.residualValuePercentage/100) / input.expectedLifespan; results["annualDepreciation_aux"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["annualDepreciation_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateCar_depreciation_calculator(input: Car_depreciation_calculatorInput): Car_depreciation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = Math.max(0, toNumericFormulaValue(values["annualDepreciation_aux"]));
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


export interface Car_depreciation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
