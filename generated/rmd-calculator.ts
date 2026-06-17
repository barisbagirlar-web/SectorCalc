// @ts-nocheck
// Auto-generated from rmd-calculator-schema.json
import * as z from 'zod';

export interface Rmd_calculatorInput {
  accountBalance: number;
  age: number;
  spouseAge: number;
  beneficiaryType: number;
  lifeExpectancyFactor: number;
}

export const Rmd_calculatorInputSchema = z.object({
  accountBalance: z.number().default(500000),
  age: z.number().default(73),
  spouseAge: z.number().default(70),
  beneficiaryType: z.number().default(1),
  lifeExpectancyFactor: z.number().default(0),
});

function asFormulaNumber(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Rmd_calculatorInput): Record<string, number | string> {
  const results: Record<string, number | string> = {};
  try { const v = input.age <= 72 ? 0 : (input.beneficiaryType === 1 ? (input.spouseAge >= input.age ? 27.4 : 25.6) : (input.beneficiaryType === 2 ? 10.0 : 12.2)); results["lifeExpectancyFactorCalc"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["lifeExpectancyFactorCalc"] = 0; }
  try { const v = input.lifeExpectancyFactor > 0 ? input.accountBalance / input.lifeExpectancyFactor : ((asFormulaNumber(results["lifeExpectancyFactorCalc"])) > 0 ? input.accountBalance / (asFormulaNumber(results["lifeExpectancyFactorCalc"])) : 0); results["rmdAmount"] = typeof v === "number" ? (Number.isFinite(v) ? v : 0) : typeof v === "string" ? v : 0; } catch { results["rmdAmount"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number | string | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function calculateRmd_calculator(input: Rmd_calculatorInput): Rmd_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["rmdAmount"]);
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


export interface Rmd_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
