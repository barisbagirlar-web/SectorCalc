// Auto-generated from fire-calculator-schema.json
import * as z from 'zod';

export interface Fire_calculatorInput {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  annualExpenses: number;
  currentSavings: number;
  annualContribution: number;
  expectedReturn: number;
  withdrawalRate: number;
}

export const Fire_calculatorInputSchema = z.object({
  currentAge: z.number().default(30),
  retirementAge: z.number().default(45),
  lifeExpectancy: z.number().default(85),
  annualExpenses: z.number().default(40000),
  currentSavings: z.number().default(100000),
  annualContribution: z.number().default(20000),
  expectedReturn: z.number().default(7),
  withdrawalRate: z.number().default(4),
});

function evaluateAllFormulas(input: Fire_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.retirementAge - input.currentAge; results["yearsToRetirement"] = Number.isFinite(v) ? v : 0; } catch { results["yearsToRetirement"] = 0; }
  try { const v = input.currentSavings * (1 + input.expectedReturn/100) ** (results["yearsToRetirement"] ?? 0) + input.annualContribution * ((1 + input.expectedReturn/100) ** (results["yearsToRetirement"] ?? 0) - 1) / (input.expectedReturn/100); results["futureValueOfSavings"] = Number.isFinite(v) ? v : 0; } catch { results["futureValueOfSavings"] = 0; }
  try { const v = input.annualExpenses / (input.withdrawalRate/100); results["requiredSavings"] = Number.isFinite(v) ? v : 0; } catch { results["requiredSavings"] = 0; }
  try { const v = input.lifeExpectancy - input.retirementAge; results["retirementYears"] = Number.isFinite(v) ? v : 0; } catch { results["retirementYears"] = 0; }
  try { const v = (results["futureValueOfSavings"] ?? 0); results["savingsAtRetirement"] = Number.isFinite(v) ? v : 0; } catch { results["savingsAtRetirement"] = 0; }
  try { const v = (results["savingsAtRetirement"] ?? 0) >= (results["requiredSavings"] ?? 0) ? 1 : 0; results["isFeasible"] = Number.isFinite(v) ? v : 0; } catch { results["isFeasible"] = 0; }
  return results;
}


export function calculateFire_calculator(input: Fire_calculatorInput): Fire_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = values["savingsAtRetirement"] ?? 0;
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


export interface Fire_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
