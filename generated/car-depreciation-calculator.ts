// @ts-nocheck
// Auto-generated from car-depreciation-calculator-schema.json
import * as z from 'zod';

export interface Car_depreciation_calculatorInput {
  purchasePrice: number;
  residualValuePercentage: number;
  currentAge: number;
  expectedLifespan: number;
  mileage: number;
  expectedMileage: number;
}

export const Car_depreciation_calculatorInputSchema = z.object({
  purchasePrice: z.number().default(30000),
  residualValuePercentage: z.number().default(20),
  currentAge: z.number().default(5),
  expectedLifespan: z.number().default(15),
  mileage: z.number().default(100000),
  expectedMileage: z.number().default(300000),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Car_depreciation_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = (input.purchasePrice - input.purchasePrice * input.residualValuePercentage/100) / input.expectedLifespan; results["annualDepreciation"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annualDepreciation"] = 0; }
  try { const v = (input.purchasePrice - input.purchasePrice * input.residualValuePercentage/100) / input.expectedLifespan; results["annualDepreciation_aux"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["annualDepreciation_aux"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateCar_depreciation_calculator(input: Car_depreciation_calculatorInput): Car_depreciation_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["annualDepreciation_aux"]);
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


export interface Car_depreciation_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
