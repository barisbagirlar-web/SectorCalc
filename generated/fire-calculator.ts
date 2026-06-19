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
  dataConfidence?: number;
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

function asFormulaNumber(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

function evaluateAllFormulas(input: Fire_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.retirementAge - input.currentAge; results["yearsToRetirement"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["yearsToRetirement"] = 0; }
  try { const v = input.currentSavings * (1 + input.expectedReturn/100) ** (asFormulaNumber(results["yearsToRetirement"])) + input.annualContribution * ((1 + input.expectedReturn/100) ** (asFormulaNumber(results["yearsToRetirement"])) - 1) / (input.expectedReturn/100); results["futureValueOfSavings"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["futureValueOfSavings"] = 0; }
  try { const v = input.annualExpenses / (input.withdrawalRate/100); results["requiredSavings"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["requiredSavings"] = 0; }
  try { const v = input.lifeExpectancy - input.retirementAge; results["retirementYears"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["retirementYears"] = 0; }
  try { const v = (asFormulaNumber(results["futureValueOfSavings"])); results["savingsAtRetirement"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["savingsAtRetirement"] = 0; }
  try { const v = (asFormulaNumber(results["savingsAtRetirement"])) >= (asFormulaNumber(results["requiredSavings"])) ? 1 : 0; results["isFeasible"] = typeof v === "number" && Number.isFinite(v) ? v : 0; } catch { results["isFeasible"] = 0; }
  return results;
}


function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : 0;
}

export function calculateFire_calculator(input: Fire_calculatorInput): Fire_calculatorOutput {
  const values = evaluateAllFormulas(input);
  const totalWasteCost = toNumericFormulaValue(values["savingsAtRetirement"]);
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


export interface Fire_calculatorOutput {
  totalWasteCost: number;
  breakdown: {  };
  hiddenLossDrivers: string[];
  suggestedActions: string[];
  dataConfidenceAdjusted: number;
  premiumRequired: boolean;
  premiumFeatures: string[];
}
