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

function evaluateAllFormulas(input: Rmd_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.age <= 72 ? 0 : (input.beneficiaryType === 1 ? (input.spouseAge >= input.age ? 27.4 : 25.6) : (input.beneficiaryType === 2 ? 10.0 : 12.2)); results["lifeExpectancyFactorCalc"] = Number.isFinite(v) ? v : 0; } catch { results["lifeExpectancyFactorCalc"] = 0; }
  try { const v = input.lifeExpectancyFactor > 0 ? input.accountBalance / input.lifeExpectancyFactor : ((results["lifeExpectancyFactorCalc"] ?? 0) > 0 ? input.accountBalance / (results["lifeExpectancyFactorCalc"] ?? 0) : 0); results["rmdAmount"] = Number.isFinite(v) ? v : 0; } catch { results["rmdAmount"] = 0; }
  return results;
}


export function calculateRmd_calculator(input: Rmd_calculatorInput): Rmd_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["rmdAmount"] ?? 0;
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


export interface Rmd_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
