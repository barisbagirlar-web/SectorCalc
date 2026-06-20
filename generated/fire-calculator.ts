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

function toNumericFormulaValue(value: number): number {
  return Number.isFinite(value) ? value : Number.NaN;
}

function evaluateAllFormulas(input: Fire_calculatorInput): Record<string, number> {
  const results: Record<string, number> = {};
  try { const v = input.retirementAge - input.currentAge; results["yearsToRetirement"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["yearsToRetirement"] = Number.NaN; }
  try { const v = input.currentSavings * (1 + input.expectedReturn/100) ** (toNumericFormulaValue(results["yearsToRetirement"])) + input.annualContribution * ((1 + input.expectedReturn/100) ** (toNumericFormulaValue(results["yearsToRetirement"])) - 1) / (input.expectedReturn/100); results["futureValueOfSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["futureValueOfSavings"] = Number.NaN; }
  try { const v = input.annualExpenses / (input.withdrawalRate/100); results["requiredSavings"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["requiredSavings"] = Number.NaN; }
  try { const v = input.lifeExpectancy - input.retirementAge; results["retirementYears"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["retirementYears"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["futureValueOfSavings"])); results["savingsAtRetirement"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["savingsAtRetirement"] = Number.NaN; }
  try { const v = (toNumericFormulaValue(results["savingsAtRetirement"])) >= (toNumericFormulaValue(results["requiredSavings"])) ? 1 : 0; results["isFeasible"] = typeof v === "number" && Number.isFinite(v) ? v : Number.NaN; } catch { results["isFeasible"] = Number.NaN; }
  return results;
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
